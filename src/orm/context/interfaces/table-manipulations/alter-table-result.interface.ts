import { AddColumnInterface } from '@core/interfaces';

export interface AlterTableResultInterface<DB> {
	addColumn: (parameters: AddColumnInterface<DB>) => Promise<Object>;
}