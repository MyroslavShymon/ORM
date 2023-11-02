import {DatabasesTypes} from "../../../enums/databases-types";

//TODO
// import ts from 'typescript'
// ts.factory.createInterface('f')

export interface StringDecoratorInterface<T, S> {
    // type: T extends S ? number: string ; // тут має бути тип строки
    length?: number;
    type: DatabasesTypes
}