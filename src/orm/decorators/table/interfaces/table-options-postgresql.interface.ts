import { ConstraintInterface } from '@decorators/index';

export interface TableOptionsPostgresqlInterface {
	checkConstraint?: ConstraintInterface | ConstraintInterface[];
	unique?: string[][] | string[];
	primaryKeys?: string[];
}