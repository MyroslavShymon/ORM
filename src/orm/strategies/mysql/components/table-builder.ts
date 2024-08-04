import { TableBuilderInterface } from '@strategies/mysql';
import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableInterface,
	TableOptionsMysqlInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export class TableBuilder implements TableBuilderInterface {
	createTable(
		table?: TableInterface<DatabasesTypes.MYSQL>,
		columns?: ColumnInterface<DatabasesTypes.MYSQL>[],
		computedColumns?: ComputedColumnInterface<DatabasesTypes.MYSQL>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface<DatabasesTypes.MYSQL>,
		oneToOne?: OneToOneInterface[],
		oneToMany?: OneToManyInterface[]
	): string {
		let createTableQuery;

		createTableQuery = `\n\tCREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;

		if (primaryColumn) {
			createTableQuery += this._handlePrimaryGeneratedColumns(primaryColumn);
		}

		if (columns?.length) {
			createTableQuery += this._handleColumns(columns);
		}

		if (computedColumns?.length) {
			createTableQuery += this._handleComputedColumns(computedColumns);
		}

		if (foreignKeys?.length) {
			createTableQuery += this._handleForeignKeys(foreignKeys);
		}

		if (oneToOne?.length) {
			createTableQuery += this._handleOneToOne(oneToOne);
		}

		if (oneToMany?.length) {
			createTableQuery += this._handleOneToMany(oneToMany);
		}

		if (table.options) {
			createTableQuery += this._handleOptionsOfTable(table.options);
		}

		createTableQuery += '\n );';

		return createTableQuery;
	}

	private _handlePrimaryGeneratedColumns(primaryColumn: PrimaryGeneratedColumnInterface<DatabasesTypes.MYSQL>) {
		if (!primaryColumn.columnName) {
			throw new Error('Please specify the name of the primary column!');
		}

		if (!primaryColumn.type) {
			throw new Error('Please specify the type of the primary column!');
		}

		let columnDefinition = `\`${primaryColumn.columnName}\` ${primaryColumn.type} PRIMARY KEY AUTO_INCREMENT`;

		// Handling additional parameters
		if (primaryColumn.startWith !== undefined) {
			columnDefinition += ` START WITH ${primaryColumn.startWith}`;
		}

		if (primaryColumn.incrementBy !== undefined) {
			columnDefinition += ` INCREMENT BY ${primaryColumn.incrementBy}`;
		}

		if (primaryColumn.minValue !== undefined) {
			columnDefinition += ` MINVALUE ${primaryColumn.minValue}`;
		}

		if (primaryColumn.maxValue !== undefined) {
			columnDefinition += ` MAXVALUE ${primaryColumn.maxValue}`;
		}

		if (primaryColumn.isCycle !== undefined) {
			columnDefinition += ` ${primaryColumn.isCycle ? 'CYCLE' : 'NO CYCLE'}`;
		}

		if (primaryColumn.cache !== undefined) {
			columnDefinition += ` CACHE ${primaryColumn.cache}`;
		}

		if (primaryColumn.ownedBy !== undefined) {
			columnDefinition += ` OWNED BY ${primaryColumn.ownedBy}`;
		}

		return `\t\t${columnDefinition},\n\t\t`;
	}

	private _handleColumns(columns: ColumnInterface<DatabasesTypes.MYSQL>[]): string {
		const formattedColumnStrings = columns.map(({ name, options }) => {
			if (!options.dataType) {
				throw new Error('Ви не вказали тип колонки');
			}

			// Перевірки для типів з параметрами
			if (
				['CHAR', 'VARCHAR', 'BINARY', 'VARBINARY'].includes(options.dataType) && !options.length
			) {
				throw new Error(`Ви не вказали довжину рядка для типу ${options.dataType}`);
			} else if (
				['ENUM', 'SET'].includes(options.dataType) && !options.values
			) {
				throw new Error(`Ви не вказали значення для типу ${options.dataType}`);
			} else if (
				['DECIMAL', 'FLOAT', 'DOUBLE', 'REAL'].includes(options.dataType) && (!options.precision || !options.scale)
			) {
				throw new Error(`Ви не вказали точність та масштаб для типу ${options.dataType}`);
			}

			const columnAttributes = [`\`${name}\` ${options.dataType}`];

			// Отримуємо довжину рядка і робимо йому правильний формат

			// Додаємо параметри до типів, які їх потребують
			if (options.length) {
				columnAttributes.push(`(${options.length})`);
			} else if (options.precision && options.scale) {
				columnAttributes.push(`(${options.precision}, ${options.scale})`);
			} else if (options.values) {
				columnAttributes.push(`(${options.values.join(', ')})`);
			}

			// Працюємо з displayWidth
			if (options.displayWidth) {
				columnAttributes.push(`(${options.displayWidth})`);
			}

			// Працюємо з UNSIGNED
			if (options.isUnsigned) {
				columnAttributes.push('UNSIGNED');
			}

			// constraint check
			if (options.check) {
				const constraintString = `
                	${options.nameOfCheckConstraint ? `CONSTRAINT ${options.nameOfCheckConstraint} ` : ''} CHECK (${options.check})`;
				columnAttributes.push(constraintString);
			}

			// Працюємо з ZEROFILL
			if (options.isZerofill) {
				columnAttributes.push('ZEROFILL');
			}

			//Працюємо з NULL || NOT NULL
			const isNullableString = options.nullable ? '' : 'NOT NULL';
			columnAttributes.push(isNullableString);

			// Працюємо з AUTO_INCREMENT
			if (options.isAutoIncrement) {
				columnAttributes.push('AUTO_INCREMENT');
			}

			//default
			if (options.defaultValue !== null && options.defaultValue !== undefined) {
				const defaultValueString = `DEFAULT ${options.defaultValue}`;
				columnAttributes.push(defaultValueString);
			}
			//unique
			if (options.unique) {
				columnAttributes.push('UNIQUE');
			}

			return columnAttributes.join(' ');
		});

		return formattedColumnStrings.join(',\n\t\t');
	}

	private _handleComputedColumns(computedColumns: ComputedColumnInterface<DatabasesTypes.MYSQL>[]): string {
		const formattedComputedColumns = computedColumns
			.map(({ name, calculate, dataType, stored }) =>
				`\`${name}\` ${dataType} GENERATED ALWAYS AS (${calculate}) ${stored ? 'STORED' : 'VIRTUAL'}`);

		return `${formattedComputedColumns.length > 0 ? `, \n\t\t${formattedComputedColumns.join(', \n\t\t')}` : ''}`;
	}

	private _handleForeignKeys(foreignKeys: ForeignKeyInterface[]): string {
		let formattedForeignKeys = [];

		for (const foreignKey of foreignKeys) {
			const { key, table, columnName } = foreignKey;

			formattedForeignKeys.push(`
		FOREIGN KEY (\`${columnName}\`) REFERENCES ${table}(${key})`);

		}

		return `${formattedForeignKeys.length > 0 ? `, \n${formattedForeignKeys.join(',')}` : ''}`.trim();
	}

	private _handleOneToOne(oneToOneConnections: OneToOneInterface[]): string {
		const formattedOneToOneConnectionsStrings = oneToOneConnections.map(o2o => `
			\`${o2o.foreignKey}\` INT UNIQUE,
			\tCONSTRAINT \`fk_oo_${o2o.columnName}\`
			\tFOREIGN KEY (\`${o2o.foreignKey}\`)
			\t\tREFERENCES \`${o2o.table}\`(\`${o2o.referenceColumn}\`)
	`);

		return formattedOneToOneConnectionsStrings.join(',\n\t\t');
	}

	private _handleOneToMany(oneToManyConnections: OneToManyInterface[]): string {
		const formattedOneToManyConnectionsStrings = oneToManyConnections.map(o2m => `
        \`${o2m.foreignKey}\` INT,
        \tCONSTRAINT \`fk_${o2m.tableName}_${o2m.foreignKey}\`
        \tFOREIGN KEY (\`${o2m.foreignKey}\`)
		\t\tREFERENCES \`${o2m.tableName}\`(\`${o2m.referenceColumn}\`)
    	`);

		return formattedOneToManyConnectionsStrings.join(',\n\t\t');
	}

	private _handleOptionsOfTable({ unique, primaryKeys }: TableOptionsMysqlInterface): string {
		const tableOptions = [];

		if (unique) {
			let formattedUniqueColumns;
			const isMultipleUniqueCombinations = Array.isArray(unique[0]);

			if (isMultipleUniqueCombinations) {
				formattedUniqueColumns = (unique as string[][])
					.map((uniqueCombination) =>
						`UNIQUE (${uniqueCombination
							.map(column => `\`${column}\``)
							.join(', ')})`
					)
					.join(', \n\t\t');
			} else {
				formattedUniqueColumns = `UNIQUE (${(unique as string[]).map(column => `\`${column}\``).join(', ')})`;
			}

			tableOptions.push(formattedUniqueColumns);
		}

		if (primaryKeys && primaryKeys.length > 0) {
			tableOptions.push(`PRIMARY KEY (${primaryKeys.map(pk => `\`${pk}\``).join(', ')})`);
		}

		return `${tableOptions.length > 0 ? `,\n\n\t\t${tableOptions.join(', \n\t\t')}` : ''}`;
	}
}