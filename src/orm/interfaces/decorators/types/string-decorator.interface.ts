import { PostgresqlDataTypes } from '../../../enums';

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