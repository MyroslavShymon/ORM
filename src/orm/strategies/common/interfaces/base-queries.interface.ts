import {
	AddDefaultValueInterface,
	DropDefaultValueInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';
import { OrderOperators } from '@core/types';
import { QueryBuilderInterface } from '@context/common';

export interface BaseQueriesInterface {
	//base database structure modifier
	renameTable(tableName: string, parameters: RenameTableInterface): string;

	//base table structure modifier
	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	//select
	select(columns: string[]): string;

	orderBy(column: string, order: OrderOperators): string;

	as(alias: string): string;

	limit(count: number): string;

	//insert
	setInto(name: string): string;

	//query structure builder
	from(table: string): string;

	union(queryBuilder: QueryBuilderInterface<Object>): string;

	unionAll(queryBuilder: QueryBuilderInterface<Object>): string;

	//aggregate
	summing(column: string): string;

	counting(column: string): string;
	
	groupBy(columns: string[]): string;
}