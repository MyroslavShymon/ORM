import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableInterface
} from '@core/interfaces/decorators';
import { DatabasesTypes } from '@core/enums';

export interface CreateTableOptionsPostgresInterface {
	table: TableInterface<DatabasesTypes.POSTGRES>,
	columns?: ColumnInterface<DatabasesTypes.POSTGRES>[],
	computedColumns?: ComputedColumnInterface<DatabasesTypes.POSTGRES>[],
	foreignKeys?: ForeignKeyInterface[],
	primaryColumn?: PrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>,
	oneToOne?: OneToOneInterface[],
	oneToMany?: OneToManyInterface[],
	manyToMany?: ManyToManyInterface[]
}