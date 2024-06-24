import { BaseColumnInterface } from '@core/interfaces';
import { PostgresqlDataTypes } from '@core/types';

export interface ComputedColumnPostgresInterface extends BaseColumnInterface {
	columnName: string;
	dataType: PostgresqlDataTypes;
	calculate: string;
}