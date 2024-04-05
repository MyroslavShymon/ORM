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

	generateInterface<T>() {
		const filePath = path.join(__dirname, '/decorators/column/interfaces', 'column-options.interface.d.ts');

		if (fs.existsSync(filePath))
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error('Error deleting file:', err);
				} else {
					console.log('File deleted successfully.');
				}
			});

		const mysqlImport = ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				undefined, // Not type-only import
				undefined, // No default import
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier('MysqlDataTypes'), ts.factory.createIdentifier('MysqlDataTypes'))
				])
			),
			ts.factory.createStringLiteral('../../../core/types/mysql-data-types'), // Adjust the path accordingly
			undefined
		);
		const mysqlTypeNode = ts.factory.createTypeReferenceNode('MysqlDataTypes', []);


		const postgresImport = ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				undefined, // Not type-only import
				undefined, // No default import
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier('PostgresqlDataTypes'), ts.factory.createIdentifier('PostgresqlDataTypes'))
				])
			),
			ts.factory.createStringLiteral('../../../core/types/postgresql-data-types'), // Adjust the path accordingly
			undefined
		);
		const postgresqlTypeNode = ts.factory.createTypeReferenceNode('PostgresqlDataTypes', []);

		const dataTypeTypeNode: ts.TypeNode = this._connectionData.type === DatabasesTypes.MYSQL ? mysqlTypeNode : postgresqlTypeNode;

		const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
			undefined,
			'ColumnOptionsInterface',
			[],
			undefined,
			[
				ts.factory.createPropertySignature(
					undefined,
					'dataType',
					undefined,
					dataTypeTypeNode
				),
				ts.factory.createPropertySignature(
					undefined,
					'nullable',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createArrayTypeNode(
						ts.factory.createTypeReferenceNode('boolean')
					)
				),
				ts.factory.createPropertySignature(
					undefined,
					'length',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createTypeReferenceNode('number')
				),
				ts.factory.createPropertySignature(
					undefined,
					'check',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createTypeReferenceNode('string')
				),
				ts.factory.createPropertySignature(
					undefined,
					'nameOfCheckConstraint',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createTypeReferenceNode('string')
				),
				ts.factory.createPropertySignature(
					undefined,
					'defaultValue',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createUnionTypeNode([
						ts.factory.createTypeReferenceNode('string', []),
						ts.factory.createTypeReferenceNode('number', []),
						ts.factory.createTypeReferenceNode('boolean', [])
					])
				),
				ts.factory.createPropertySignature(
					undefined,
					'unique',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createTypeReferenceNode('boolean')
				),
				ts.factory.createPropertySignature(
					undefined,
					'nullsNotDistinct',
					ts.factory.createToken(ts.SyntaxKind.QuestionToken),
					ts.factory.createTypeReferenceNode('boolean')
				)
			]
		);
		// Додаємо імпорт в залежності від типу даних
		const imports = this._connectionData.type === DatabasesTypes.MYSQL ? [mysqlImport] : [postgresImport];
		const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
		const resultFile = ts.createSourceFile('column-options.interface.d.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

		// Додаємо імпорти до початку файлу
		const resultWithImports = ts.factory.updateSourceFile(resultFile, imports);

		// Додаємо інтерфейс до файлу
		const resultWithInterface = ts.factory.updateSourceFile(resultWithImports, resultWithImports.statements.concat([interfaceDeclaration]));

		// Друкуємо та записуємо результат у файл
		const result = printer.printFile(resultWithInterface);

		fs.writeFileSync(filePath, result, 'utf8');
	}
}

export { DatabaseManager };