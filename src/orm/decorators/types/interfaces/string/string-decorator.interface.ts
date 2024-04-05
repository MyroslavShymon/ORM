export interface StringDecoratorInterface {
	type: 'TEXT' | 'VARCHAR' | 'CHAR';
	length?: number;
}

//TODO
// import ts from 'typescript'
// ts.factory.createInterface('f')