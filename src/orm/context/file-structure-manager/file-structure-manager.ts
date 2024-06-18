import * as path from 'path';
import { DatabasesTypes } from '@core/enums';
import {
	OptionsToCreateFieldInterface,
	TypescriptCodeGenerator,
	TypescriptCodeGeneratorInterface
} from '@utils/typescript-code-generator';
import { ConnectionData } from '@core/types';

export class FileStructureManager {
	private static readonly _configFilePath = path.join(__dirname, '../../../..', '/tsconfig.json');
	private static _typescriptCodeGenerator: TypescriptCodeGeneratorInterface =
		new TypescriptCodeGenerator(this._configFilePath);

	static manage(connectionData: ConnectionData) {
		this._generateColumnOptionsDecoratorInterface(connectionData);
		this._generateBaseComputedColumnInterface(connectionData);
		this._generateTableDecoratorInterface(connectionData);
		this._generateStringDecoratorInterface(connectionData);
		this._generatePrimaryGeneratedColumnDecoratorInterface(connectionData);
		this._generateIntegerDecoratorInterface(connectionData);
		this._generateFloatDecoratorInterface(connectionData);
		this._generateNumericDecoratorInterface(connectionData);
	}

	private static _generateNumericDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'numeric-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/types/numeric/common', fileName);

		const [floatImports, FloatTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlFloatTypesType', '../../float/common/mysql-float-types.type') :
			this._typescriptCodeGenerator.formImport('PostgresFloatTypesType', '../../float/common/postgres-float-types.type');
		const [integerImports, IntegerTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlIntegerTypesType', '../../integer/common/mysql-integer-types.type') :
			this._typescriptCodeGenerator.formImport('PostgresIntegerTypesType', '../../integer/common/postgres-integer-types.type');

		const interfaceFields: OptionsToCreateFieldInterface[] = [
			{
				fieldName: 'type',
				fieldType: [FloatTypesTypeNode, IntegerTypesTypeNode]
			}
		];

		if (connectionData.type === DatabasesTypes.MYSQL) {
			interfaceFields.push(
				{
					fieldName: 'totalNumberOfDigits',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'numberOfDigitsAfterPoint',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'displayWidth',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'isUnsigned',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isZerofill',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isAutoIncrement',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				}
			);
		}
		if (connectionData.type === DatabasesTypes.POSTGRES) {
			interfaceFields.push(
				{
					fieldName: 'precision',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'scale',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				}
			);
		}

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'NumericDecoratorInterface',
			interfaceFields,
			[integerImports, floatImports]
		);
	}

	private static _generateFloatDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'float-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/types/float/common', fileName);

		const [imports, FloatTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlFloatTypesType', './mysql-float-types.type') :
			this._typescriptCodeGenerator.formImport('PostgresFloatTypesType', './postgres-float-types.type');

		const interfaceFields: OptionsToCreateFieldInterface[] = [
			{
				fieldName: 'type',
				fieldType: FloatTypesTypeNode
			}
		];

		if (connectionData.type === DatabasesTypes.MYSQL) {
			interfaceFields.push(
				{
					fieldName: 'totalNumberOfDigits',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'numberOfDigitsAfterPoint',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'isUnsigned',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isZerofill',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				}
			);
		}
		if (connectionData.type === DatabasesTypes.POSTGRES) {
			interfaceFields.push(
				{
					fieldName: 'precision',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'scale',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				}
			);
		}

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'FloatDecoratorInterface',
			interfaceFields,
			[imports]
		);
	}

	private static _generateIntegerDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'integer-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/types/integer/common', fileName);

		const [imports, IntegerTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlIntegerTypesType', './mysql-integer-types.type') :
			this._typescriptCodeGenerator.formImport('PostgresIntegerTypesType', './postgres-integer-types.type');

		const interfaceFields: OptionsToCreateFieldInterface[] = [
			{
				fieldName: 'type',
				fieldType: IntegerTypesTypeNode
			}
		];

		if (connectionData.type === DatabasesTypes.MYSQL) {
			interfaceFields.push(
				{
					fieldName: 'displayWidth',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'isUnsigned',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isZerofill',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isAutoIncrement',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				}
			);
		}

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'IntegerDecoratorInterface',
			interfaceFields,
			[imports]
		);
	}

	private static _generatePrimaryGeneratedColumnDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'primary-generated-column-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/primary-generated-column/interfaces', fileName);

		const [imports, AutoIncrementColumnTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('AutoIncrementColumnTypesMysqlType', '../types/auto-increment-column-types-mysql.type') :
			this._typescriptCodeGenerator.formImport('AutoIncrementColumnTypesPostgresType', '../types/auto-increment-column-types-postgres.type');

		const interfaceFields = [
			{
				fieldName: 'type',
				fieldType: AutoIncrementColumnTypesTypeNode
			},
			{
				fieldName: 'startWith',
				isFieldOptional: true,
				fieldType: { type: 'number' }
			},
			{
				fieldName: 'incrementBy',
				isFieldOptional: true,
				fieldType: { type: 'number' }
			},
			{
				fieldName: 'minValue',
				isFieldOptional: true,
				fieldType: { type: 'number' }
			},
			{
				fieldName: 'maxValue',
				isFieldOptional: true,
				fieldType: { type: 'number' }
			},
			{
				fieldName: 'isCycle',
				isFieldOptional: true,
				fieldType: { type: 'boolean' }
			},
			{
				fieldName: 'cache',
				isFieldOptional: true,
				fieldType: { type: 'number' }
			},
			{
				fieldName: 'ownedBy',
				isFieldOptional: true,
				fieldType: { type: 'string' }
			}
		];

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			interfaceFields.push(
				{
					fieldName: 'restartWith',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'noOrder',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				}
			);
		}

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'PrimaryGeneratedColumnDecoratorInterface',
			interfaceFields,
			[imports]
		);
	}

	private static _generateStringDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'string-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/types/string/common', fileName);

		const [imports, StringTypesTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlStringTypesType', './mysql-string-types.type') :
			this._typescriptCodeGenerator.formImport('PostgresStringTypesType', './postgres-string-types.type');

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
			[imports]
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
			[imports]
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
			[imports]
		);
	}

	private static _generateColumnOptionsDecoratorInterface(connectionData: ConnectionData) {
		const fileName = 'column-options-decorator.interface.d.ts';
		const filePath = path.join(__dirname, '../..', '/decorators/column/interfaces', fileName);

		const [imports, dataTypeTypeNode] = connectionData.type === DatabasesTypes.MYSQL ?
			this._typescriptCodeGenerator.formImport('MysqlDataTypes', '../../../core/types/mysql-data-types') :
			this._typescriptCodeGenerator.formImport('PostgresqlDataTypes', '../../../core/types/postgresql-data-types');

		const interfaceFields = [
			{
				fieldName: 'dataType',
				isFieldOptional: true,
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
				fieldName: 'check',
				isFieldOptional: true,
				fieldType: { type: 'string' }
			},
			{
				fieldName: 'nameOfCheckConstraint',
				isFieldOptional: true,
				fieldType: { type: 'string' }
			}
		];

		if (connectionData.type === DatabasesTypes.MYSQL) {
			interfaceFields.push(
				{
					fieldName: 'totalNumberOfDigits',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'numberOfDigitsAfterPoint',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'displayWidth',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'isZerofill',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isAutoIncrement',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'isUnsigned',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				}
			);
		}

		if (connectionData.type === DatabasesTypes.POSTGRES) {
			interfaceFields.push(
				{
					fieldName: 'nullsNotDistinct',
					isFieldOptional: true,
					fieldType: { type: 'boolean' }
				},
				{
					fieldName: 'precision',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				},
				{
					fieldName: 'scale',
					isFieldOptional: true,
					fieldType: { type: 'number' }
				}
			);
		}

		this._typescriptCodeGenerator.generateInterfaceFile(
			fileName,
			filePath,
			'ColumnOptionsDecoratorInterface',
			interfaceFields,
			[imports]
		);
	}
}