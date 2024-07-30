import { DatabasesTypes } from '@core/enums';
import { ActiveConnectionsInterface as ActiveConnectionsInterfaceMysql } from '@strategies/mysql';
import { ActiveConnectionsInterface as ActiveConnectionsInterfacePostgres } from '@strategies/postgres';

export type ActiveConnectionsType<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.MYSQL ? ActiveConnectionsInterfaceMysql :
		DT extends DatabasesTypes.POSTGRES ? ActiveConnectionsInterfacePostgres :
			never;