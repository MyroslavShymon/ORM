import * as path from 'path';
import { DatabasesTypes } from '@core/enums';
import { TypescriptCodeGenerator, TypescriptCodeGeneratorInterface } from '@utils/typescript-code-generator';
import { ConnectionData } from '@core/types';

export class FileStructureManager {
	private static _typescriptCodeGenerator: TypescriptCodeGeneratorInterface = new TypescriptCodeGenerator();

	static manage(connectionData: ConnectionData) {
		this._generateColumnOptionsDecoratorInterface(connectionData);
		this._generateBaseComputedColumnInterface(connectionData);
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
			imports,
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
			]
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
			imports,
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
	}
}