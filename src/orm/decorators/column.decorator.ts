import 'reflect-metadata';
import {ColumnInterface} from "../interfaces/decorators/column/column.interface";
import {ColumnDecoratorInterface} from "../interfaces/decorators/column/column-decorator.interface";

export function Column({name, options}: ColumnDecoratorInterface) {
    return function (target: any, propertyKey: string) {

        if (!name || name === '') {
            name = propertyKey;
        }

        const columns: ColumnInterface[] = Reflect.getMetadata('columns', target) || [];
        columns.push({ name, options });
        Reflect.defineMetadata('columns', columns, target);
    };
}