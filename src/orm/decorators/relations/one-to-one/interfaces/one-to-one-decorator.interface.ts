export interface OneToOneDecoratorInterface {
	foreignKey: string;
	table: string;
	referenceColumn: string;
}