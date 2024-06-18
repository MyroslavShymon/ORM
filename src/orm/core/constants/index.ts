export const constants = {
	migrationsTableName: 'migrations',
	migrationsTableSchemaName: 'public',
	currentDatabaseIngot: 'current_database_ingot',

	tableComparerAlgorithm: {
		maximumConvergenceOfTable: 100,
		minimumUniquesPercentage: 70,
		minimumColumnUniquePercentage: 80
	},

	decoratorsMetadata: {
		table: 'table',
		columns: 'columns',
		primaryColumn: 'primary-column',
		foreignKeys: 'foreign-keys',
		computedColumns: 'computed-columns',
		oneToOne: 'one-to-one',
		oneToMany: 'one-to-many',
		manyToMany: 'many-to-many'
	},

	errors: {
		assignableToType: 2322
	}

};