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

export interface CreateTableOptionsInterface {
	table?: TableInterface,
	columns?: ColumnInterface[],
	computedColumns?: ComputedColumnInterface[],
	foreignKeys?: ForeignKeyInterface[],
	primaryColumn?: PrimaryGeneratedColumnInterface,
	oneToOne?: OneToOneInterface[],
	oneToMany?: OneToManyInterface[],
	manyToMany?: ManyToManyInterface[]
}