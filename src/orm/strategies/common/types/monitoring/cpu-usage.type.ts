import { DatabasesTypes } from '@core/enums';
import { CpuUsageInterface as CpuUsageInterfaceMysql } from '@strategies/mysql';
import { CpuUsageInterface as CpuUsageInterfacePostgres } from '@strategies/postgres';

export type CpuUsageType<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.MYSQL ? CpuUsageInterfaceMysql[] :
		DT extends DatabasesTypes.POSTGRES ? CpuUsageInterfacePostgres[] :
			never;