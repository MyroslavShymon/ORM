import { DataSourceContextInterface } from '@context/common/interfaces';
import { ConnectionData } from '@core/types/connection-data';
import { DatabasesTypes } from '@core/enums';

export type ConnectionClient<DT extends DatabasesTypes | undefined = undefined> = {
	dataSource: DataSourceContextInterface<DT>,
	connectionData: ConnectionData,
}