export interface ManyToManyInterface {
	foreignKey: string;
	referencedColumn: string;
	referencedTable: string;
	tableName?: string;
}