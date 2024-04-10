import { ConstraintInterface } from '@core/interfaces';

export interface TableOptionsPostgresqlInterface {
	checkConstraint?: ConstraintInterface | ConstraintInterface[];
	unique?: string[][] | string[];
	primaryKeys?: string[];
}