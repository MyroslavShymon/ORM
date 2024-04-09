import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import 'reflect-metadata';
import { DatabaseIngotInterface, DatabaseManagerInterface } from '@core/interfaces';
import { ConnectionClient, ConnectionData } from '@core/types';
import { DatabasesTypes } from '@core/enums';
import { DataSourcePostgres } from '@strategies/postgres';
import { DataSourceMySql } from '@strategies/mysql';
import {
	DataSourceContextInterface,
	QueryBuilderInterface,
	TableCreatorInterface,
	TableManipulationInterface
} from '@context/common';

interface FieldTypeInterface {
	type: string;
	isArray?: boolean;
}

interface OptionsToCreateField {
	fieldName: string,
	fieldType: FieldTypeInterface[] | FieldTypeInterface | ts.TypeReferenceNode | ts.TypeReferenceNode[]
	isFieldOptional?: boolean,
}

class DatabaseManager<DB extends DatabasesTypes> implements DatabaseManagerInterface {
	private _connectionData: ConnectionData;
	private _dataSource: DataSourceContextInterface;

	constructor(connectionData: ConnectionData, dataSource: DataSourceContextInterface) {
		this._connectionData = connectionData;
		this._dataSource = dataSource;

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.setDatabase(new DataSourcePostgres());
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.setDatabase(new DataSourceMySql());
		}
	}

	async connectDatabase(): Promise<void> {
		try {
			await this._dataSource.connectDatabase(this._connectionData);
		} catch (error) {
			console.error('Error while connecting database', error);
		}
	}

	async createOrmConnection(): Promise<ConnectionClient> {
		try {
			this.generateInterface();
			const databaseIngot: DatabaseIngotInterface = { tables: [] };

			await this._dataSource.connectDatabase(this._connectionData);

			const isMigrationTableExist = await this._dataSource.migrationManager.checkTableExistence({
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema
			});

			if (!isMigrationTableExist) {
				await this._dataSource.migrationManager.createMigrationTable({
					tableName: this._connectionData.migrationTable,
					tableSchema: this._connectionData.migrationTableSchema
				});

				await this._dataSource.migrationManager.initCurrentDatabaseIngot({
					tableName: this._connectionData.migrationTable,
					tableSchema: this._connectionData.migrationTableSchema,
					databaseIngot
				});
			}

			const tablesIngot = await this._dataSource.tableCreator.createIngotOfTables(this._connectionData);
			if (!tablesIngot.length) {
				const results = await this._dataSource.getCurrentTime();
				console.log('Database is work, current timestamp: ', results);
			}
			databaseIngot.tables = tablesIngot || [];

			await this._dataSource.migrationManager.syncDatabaseIngot({
				tableName: this._connectionData.migrationTable,
				tableSchema: this._connectionData.migrationTableSchema,
				databaseIngot
			});
		} catch (error) {
			console.error('Error while creating orm connection', error);
		} finally {
			// await this._dataSource.client.release();
		}

		return {
			dataSource: this._dataSource,
			connectionData: this._connectionData
		};
	}

	async query(sql: string): Promise<Object> {
		try {
			return this._dataSource.query(sql);
		} catch (error) {
			console.error('Error while querying', error);
		}
	}

	set connectionData(connectionData: ConnectionData) {
		this._connectionData = connectionData;
	}

	set dataSource(dataSource: DataSourceContextInterface) {
		this._dataSource = dataSource;
	}

	get connectionData(): ConnectionData {
		return this._connectionData;
	}

	get tableManipulation(): TableManipulationInterface<DB> {
		return this._dataSource.tableManipulation;
	}

	get tableCreator(): TableCreatorInterface {
		return this._dataSource.tableCreator;
	}

	queryBuilder<T>(): QueryBuilderInterface<T> {
		return this._dataSource.queryBuilder<T>();
	}

	handleTypeElement(typeElement: FieldTypeInterface): ts.TypeNode {
		const elementType = ts.factory.createTypeReferenceNode(typeElement.type, []);
		return typeElement.isArray
			? ts.factory.createArrayTypeNode(elementType)
			: elementType;
	};

	formField = ({ isFieldOptional, fieldName, fieldType }: OptionsToCreateField): ts.PropertySignature => {
		const typeArray = Array.isArray(fieldType) ? fieldType : [fieldType];

		const dataType = typeArray.map((type) =>
			'type' in type && type.type ? this.handleTypeElement(type) : type as ts.TypeReferenceNode
		);

		const dataTypeNode = dataType.length === 1
			? dataType[0]
			: ts.factory.createUnionTypeNode(dataType);

		return ts.factory.createPropertySignature(
			undefined,
			fieldName,
			isFieldOptional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
			dataTypeNode
		);
	};

	formInterface(interfaceName: string, fields: OptionsToCreateField[]): ts.InterfaceDeclaration {
		return ts.factory.createInterfaceDeclaration(
			undefined,
			interfaceName,
			[],
			undefined,
			fields.map(this.formField)
		);
	}

	formImport(importName: string, importPath: string): [ts.ImportDeclaration, ts.TypeReferenceNode] {
		const formedImport = ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				undefined, // Not type-only import
				undefined, // No default import
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(importName), ts.factory.createIdentifier(importName))
				])
			),
			ts.factory.createStringLiteral(importPath), // Adjust the path accordingly
			undefined
		);
		const typeNode = ts.factory.createTypeReferenceNode(importName, []);

		return [formedImport, typeNode];
	}

	_generateInterface(
		fileName: string,
		interfaceDeclaration?: ts.InterfaceDeclaration,
		imports?: ts.ImportDeclaration
	): string {
		const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
		const resultFile = ts.createSourceFile(fileName, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

		// Додаємо імпорти до початку файлу
		const resultWithImports = ts.factory.updateSourceFile(resultFile, [imports]);

		// Додаємо інтерфейс до файлу
		const resultWithInterface = ts.factory.updateSourceFile(resultWithImports, resultWithImports.statements.concat([interfaceDeclaration]));

		// Друкуємо та записуємо результат у файл
		return printer.printFile(resultWithInterface);
	}

	generateInterface() {
		const filePath = path.join(__dirname, '/decorators/column/interfaces', 'column-options-decorator.interface.d.ts');

		if (fs.existsSync(filePath))
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error('Error deleting file:\n', err);
				} else {
					console.log('File deleted successfully.');
				}
			});

		const [imports, dataTypeTypeNode] = this._connectionData.type === DatabasesTypes.MYSQL ?
			this.formImport('MysqlDataTypes', '../../../core/types/mysql-data-types') :
			this.formImport('PostgresqlDataTypes', '../../../core/types/postgresql-data-types');

		const interfaceDeclaration = this.formInterface(
			'ColumnOptionsDecoratorInterface',
			[
				{
					fieldName: 'dataType',
					fieldType: dataTypeTypeNode
				},
				{
					fieldName: 'nullable',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'length',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'check',
					isFieldOptional: true,
					fieldType: { type: 'string' }
				},
				{
					fieldName: 'nameOfCheckConstraint',
					isFieldOptional: true,
					fieldType: { type: 'string' }
				},
				{
					fieldName: 'defaultValue',
					isFieldOptional: true,
					fieldType: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
				},
				{
					fieldName: 'unique',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'nullsNotDistinct',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				}
			]
		);

		fs.writeFileSync(
			filePath,
			this._generateInterface(
				'column-options-decorator.interface.d.ts',
				interfaceDeclaration,
				imports
			),
			'utf8'
		);
	}
}

export { DatabaseManager };