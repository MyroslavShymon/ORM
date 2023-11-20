import { AddColumnInterface } from '../../../core';

export interface AlterTableResultInterface<DB> {
	addColumn: (parameters: AddColumnInterface<DB>) => Promise<Object>;
}