export interface ManyToManyDecoratorInterface {
	tableName: string;
	foreignKey: string;
	referencedColumn: string;
}