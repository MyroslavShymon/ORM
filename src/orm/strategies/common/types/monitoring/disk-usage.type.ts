import { DatabasesTypes } from '@core/enums';
import { DiskUsageInterface as DiskUsageInterfaceMysql } from '@strategies/mysql';
import { DiskUsageInterface as DiskUsageInterfacePostgres } from '@strategies/postgres';

export type DiskUsageType<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.MYSQL ? DiskUsageInterfaceMysql[] :
		DT extends DatabasesTypes.POSTGRES ? DiskUsageInterfacePostgres[] :
			never;