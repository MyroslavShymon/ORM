import { ConstraintInterface } from '@decorators/postgres';

export interface TableOptionsPostgresqlInterface {
	checkConstraint?: ConstraintInterface | ConstraintInterface[];
	unique?: string[][] | string[];
	primaryKeys?: string[];
}