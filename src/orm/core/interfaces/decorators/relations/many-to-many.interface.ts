export interface ManyToManyInterface {
	tableName: string;
	foreignKey: string;
	referencedColumn: string;
	referencedTable: string;
}