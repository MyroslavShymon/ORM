import { BaseColumnInterface, ColumnOptionsMysqlInterface } from '@core/interfaces';

export interface ColumnMysqlInterface extends BaseColumnInterface {
	options?: ColumnOptionsMysqlInterface;
}