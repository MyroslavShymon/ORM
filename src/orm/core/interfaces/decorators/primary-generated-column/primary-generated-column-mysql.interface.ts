import { AutoIncrementColumnTypesMysqlType } from '@decorators/primary-generated-column';

export interface PrimaryGeneratedColumnMysqlInterface {
	columnName: string;
	type: AutoIncrementColumnTypesMysqlType;
	startWith?: number;
	incrementBy?: number;
	minValue?: number;
	maxValue?: number;
	isCycle?: boolean;
	cache?: number;
	ownedBy?: string;
}