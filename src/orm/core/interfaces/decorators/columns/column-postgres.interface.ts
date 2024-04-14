import { BaseColumnInterface, ColumnOptionsPostgresInterface } from '@core/interfaces';

export interface ColumnPostgresInterface extends BaseColumnInterface {
	options?: ColumnOptionsPostgresInterface;
}