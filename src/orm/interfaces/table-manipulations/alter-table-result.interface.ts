import { AddColumnInterface } from './add-column.interface';

export interface AlterTableResultInterface {
	addColumn: (parameters: AddColumnInterface) => Promise<void>;
}