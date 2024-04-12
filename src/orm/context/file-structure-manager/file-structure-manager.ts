import * as path from 'path';
import { DatabasesTypes } from '@core/enums';
import { TypescriptCodeGenerator, TypescriptCodeGeneratorInterface } from '@utils/typescript-code-generator';
import { ConnectionData } from '@core/types';

export class FileStructureManager {
	private static _typescriptCodeGenerator: TypescriptCodeGeneratorInterface = new TypescriptCodeGenerator();

	static manage(connectionData: ConnectionData) {
		this._generateColumnOptionsDecoratorInterface(connectionData);
		this._generateBaseComputedColumnInterface(connectionData);
		this._generateTableDecoratorInterface(connectionData);
		this._generateStringDecoratorInterface(connectionData);
	}

	private static _generateStringDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'string-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/types/interfaces/string', fileName);

		const [imports, StringTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlStringTypesType', '../../types/string/mysql-string-types.type') :
			this._typescriptCodeGenerator.formImport('PostgresStringTypesType', '../../types/string/postgres-string-types.type');

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'StringDecoratorInterface',
			[
				{
					fieldName: 'length',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'type',
					fieldType: StringTypesTypeNode
				}
			],
			imports
		);
	}

	private static _generateTableDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'table-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/table/interfaces', fileName);

		const [imports, TableOptionsTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('TableOptionsMysqlInterface', '../../../core/interfaces/decorators/table/table-options-mysql.interface') :
			this._typescriptCodeGenerator.formImport('TableOptionsPostgresqlInterface', '../../../core/interfaces/decorators/table/table-options-postgresql.interface');

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'TableDecoratorInterface',
			[
				{
					fieldName: 'options',
					isFieldOptional: true,
					fieldType: TableOptionsTypeNode
				},
				{
					fieldName: 'name',
					isFieldOptional: true,
					fieldType: { type: 'string' }
				}
			],
			imports
		);
	}

	private static _generateBaseComputedColumnInterface(connectionData: ConnectionData) {
		const fileName = 'base-computed-column.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/computed-column/interfaces', fileName);

		const [imports, dataTypeTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlDataTypes', '../../../core/types/mysql-data-types') :
			this._typescriptCodeGenerator.formImport('PostgresqlDataTypes', '../../../core/types/postgresql-data-types');

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'BaseComputedColumnInterface',
			[
				{
					fieldName: 'dataType',
					fieldType: dataTypeTypeNode
				},
				{
					fieldName: 'calculate',
					fieldType: { type: 'string' }
				},
				{
					fieldName: 'stored',
					fieldType: { type: 'boolean' }
				}
			],
			imports
		);
	}

	private static _generateColumnOptionsDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'column-options-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/column/interfaces', fileName);

		const [imports, dataTypeTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlDataTypes', '../../../core/types/mysql-data-types') :
			this._typescriptCodeGenerator.formImport('PostgresqlDataTypes', '../../../core/types/postgresql-data-types');

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
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
			],
			imports
		);
	}
}