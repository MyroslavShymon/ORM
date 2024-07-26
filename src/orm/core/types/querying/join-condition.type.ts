import { ConnectionOperatorType } from '@core/types';

export type JoinCondition = {
	column: string;
	operator: ConnectionOperatorType;
	value: any | any[];
};