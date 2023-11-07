import { PostgresqlDataTypes } from '../../../enums/postgresql-data-types';

export interface StringDecoratorInterface {
	type:
		PostgresqlDataTypes.TEXT |
		PostgresqlDataTypes.VARCHAR |
		PostgresqlDataTypes.CHAR;
	length?: number;
}

//TODO
// import ts from 'typescript'
// ts.factory.createInterface('f')