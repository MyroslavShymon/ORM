import { BaseColumnInterface } from '@core/interfaces';
import { MysqlDataTypes } from '@core/types';

export interface ComputedColumnMysqlInterface extends BaseColumnInterface {
	columnName: string;
	dataType: MysqlDataTypes;
	calculate: string;
	stored?: boolean;
}