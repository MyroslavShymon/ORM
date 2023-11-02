import 'reflect-metadata';
import {ColumnDecoratorInterface} from "../interfaces/decorators/column/column-decorator.interface";
import {ColumnMetadataInterface} from "../interfaces/decorators/column/column-metadata.interface";

export function Column({name, options}: ColumnDecoratorInterface) {
    return function (target: any, propertyKey: string) {

        if (!name || name === '') {
            name = propertyKey;
        }

        const columns: ColumnMetadataInterface[] = Reflect.getMetadata('columns', target) || [];
        columns.push({ name, options, propertyKey });
        Reflect.defineMetadata('columns', columns, target);
    };
}