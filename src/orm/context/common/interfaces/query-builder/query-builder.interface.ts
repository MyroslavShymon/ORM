import { ConditionParamsType, JoinCondition } from '@core/types';
import { CacheOptionsInterface } from '@context/common/interfaces/query-builder/cache-options.interface';

export interface QueryBuilderInterface<T> {
	query: string;
	parameters: any[];

	createView(name: string): QueryBuilderInterface<T>;

	select(columns?: string[]): QueryBuilderInterface<T>;

	into(name: string): QueryBuilderInterface<T>;

	sum(column: string): QueryBuilderInterface<T>;

	count(column: string): QueryBuilderInterface<T>;

	having(condition: ConditionParamsType<T>): QueryBuilderInterface<T>;

	as(alias: string): QueryBuilderInterface<T>;

	groupBy(columns: string[]): QueryBuilderInterface<T>;

	from(table: string): QueryBuilderInterface<T>;

	where(params: ConditionParamsType<T>): QueryBuilderInterface<T>;

	leftJoin(table: string, condition: JoinCondition): QueryBuilderInterface<T>;

	rightJoin(table: string, condition: JoinCondition): QueryBuilderInterface<T>;

	innerJoin(table: string, condition: JoinCondition): QueryBuilderInterface<T>;

	union(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T>;

	unionAll(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T>;

	orderBy(column: string, order?: string): QueryBuilderInterface<T>;

	limit(count: number): QueryBuilderInterface<T>;

	insert(values: Partial<T>, tableName: string): QueryBuilderInterface<T>;

	insertMany(values: Partial<T>[], tableName: string): QueryBuilderInterface<T>;

	update(values: Partial<T>, tableName: string): QueryBuilderInterface<T>;

	delete(tableName: string): QueryBuilderInterface<T>;

	cache(options: CacheOptionsInterface, enableMonitoring?: boolean): Promise<T>;

	build(): string;

	buildWithoutSemicolon(): string;

	execute(enableMonitoring?: boolean): Promise<T>;
}