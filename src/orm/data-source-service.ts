import { DataSource } from "./data-source";

class DataSourceService {
    private dataSource: Promise<DataSource> | null = null;

    setDataSource(dataSource: Promise<DataSource>) {
        this.dataSource = dataSource;
    }

    getDataSource(): Promise<DataSource> | null {
        return this.dataSource;
    }
}

export const dataSourceService = new DataSourceService();