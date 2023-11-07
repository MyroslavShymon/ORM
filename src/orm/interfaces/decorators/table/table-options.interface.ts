import { ConstraintInterface } from './constraint.interface';

export interface TableOptionsInterface {
	checkConstraint?: ConstraintInterface | ConstraintInterface[];
	unique?: string[][] | string[];
}