import {tableNames} from "../types/tables";
import {dataSourceService} from "../data-source-service";
import {DatabasesTypes} from "../enums/databases-types";

export function Column(sdf: string): any {
    console.log("second(): factory evaluated", sdf);
    const aa = {}
    return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
        const connectionClient = dataSourceService.getConnectionClient()

        connectionClient.then((connectionClient) => {
            const {connectionData, dataSource} = connectionClient;
            console.log("connectionData, dataSource", connectionData)
            console.log("second(): called", propertyKey.name, "dfgdfgd", tableNames);

        });
    };
}