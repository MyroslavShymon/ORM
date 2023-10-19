import {dataSourceService} from "../data-source-service";

export function Table(): Function {
    return function (constructor: Function): void {
        const tableName = constructor.name;
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id INT AUTO_INCREMENT PRIMARY KEY
            );
        `;

        const dataSource = dataSourceService.getDataSource();

        dataSource.then((dataSource) => {
            dataSource.client.query(createTableSQL).then(() => {
                console.log(`Table ${tableName} created successfully.`);
            }).catch((error) => {
                console.error('error', error);
            });
        });
    };
}