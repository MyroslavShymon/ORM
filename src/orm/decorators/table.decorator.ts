import 'reflect-metadata';
import {TableOptionsInterface} from "../interfaces/decorators/table-options.interface";

export function Table(options?: TableOptionsInterface) {
    return function (constructor: Function) {

        if (
            !options ||
            options.tableName === undefined ||
            options.tableName === ''
        ) {
            console.info("Ви вказали назву таблиці не коректно або взагалі її не вказали, тому назва буде взята за назвою класу");
            options.tableName = constructor.name;
        }

        Reflect.defineMetadata('table', options, constructor.prototype);
    };
}
