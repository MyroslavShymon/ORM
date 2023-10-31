import 'reflect-metadata';
import {ColumnOptionsInterface} from "../interfaces/decorators/column-options.interface";

export function Column(options: ColumnOptionsInterface) {
    return function (target: any, propertyKey: string) {
        const columns = Reflect.getMetadata('columns', target) || [];
        columns.push({ options, propertyKey });
        Reflect.defineMetadata('columns', columns, target);
    };
}