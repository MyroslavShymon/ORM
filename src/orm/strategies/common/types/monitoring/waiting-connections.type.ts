import { DatabasesTypes } from '@core/enums';
import { WaitingConnectionsInterface as WaitingConnectionsInterfaceMysql } from '@strategies/mysql';
import { WaitingConnectionsInterface as WaitingConnectionsInterfacePostgres } from '@strategies/postgres';

export type WaitingConnectionsType<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.MYSQL ? WaitingConnectionsInterfaceMysql :
		DT extends DatabasesTypes.POSTGRES ? WaitingConnectionsInterfacePostgres :
			never;