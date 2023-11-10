import { AddColumnInterface } from './add-column.interface';
import { AlterTableResultInterface } from './alter-table-result.interface';

export interface TableManipulationInterface {
	alterTable(tableName: string): AlterTableResultInterface;

	addColumn(tableName: string): (parameters: AddColumnInterface) => Promise<void>;

}