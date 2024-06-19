import { ManyToManyInterface } from '@core/interfaces';

export interface ManyToManyRelationsOfTablesInterface {
	manyToManyRelation: ManyToManyInterface[];
	tableName: string;
}