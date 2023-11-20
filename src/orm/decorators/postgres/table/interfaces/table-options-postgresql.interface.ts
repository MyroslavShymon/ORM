import { ConstraintInterface } from './constraint.interface';

export interface TableOptionsPostgresqlInterface {
	checkConstraint?: ConstraintInterface | ConstraintInterface[];
	unique?: string[][] | string[];
}