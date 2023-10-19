import {DataSourceInterface} from "./interfaces/data-source.interface";

//TODO typing
class DataSource {
    private dataSource: DataSourceInterface;
    client

    setDatabase(dataSource: DataSourceInterface) {
        this.dataSource = dataSource;
    }

    async connectDatabase(connectionData: any) {
        await this.dataSource.connect(connectionData);

        this.client = await this.dataSource.client;
    }
}

export {DataSource};