import * as fs from 'fs';
import * as path from 'path';
import { DatabasesTypes } from '@core/enums';
import { TypescriptCodeGenerator, TypescriptCodeGeneratorInterface } from '@utils/typescript-code-generator';
import { ConnectionData } from '@core/types';

export class FileStructureManager {
	private static _typescriptCodeGenerator: TypescriptCodeGeneratorInterface = new TypescriptCodeGenerator();

	static generateColumnOptionsDecoratorInterface(connectionData: ConnectionData) {
		const filePath = path.join(__dirname, '../..', '/decorators/column/interfaces', 'column-options-decorator.interface.d.ts');

		if (fs.existsSync(filePath))
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error('Error deleting file:\n', err);
				} else {
					console.log('File deleted successfully.');
				}
			});

		const [imports, dataTypeTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlDataTypes', '../../../core/types/mysql-data-types') :
			this._typescriptCodeGenerator.formImport('PostgresqlDataTypes', '../../../core/types/postgresql-data-types');

		const interfaceDeclaration = this._typescriptCodeGenerator.formInterface(
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
			this._typescriptCodeGenerator.generateInterface(
				'column-options-decorator.interface.d.ts',
				interfaceDeclaration,
				imports
			),
			'utf8'
		);
	}
}