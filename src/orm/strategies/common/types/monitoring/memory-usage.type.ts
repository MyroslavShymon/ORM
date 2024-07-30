import { DatabasesTypes } from '@core/enums';
import { MemoryUsageInterface as MemoryUsageInterfaceMysql } from '@strategies/mysql';
import { MemoryUsageInterface as MemoryUsageInterfacePostgres } from '@strategies/postgres';

export type MemoryUsageType<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.MYSQL ? MemoryUsageInterfaceMysql[] :
		DT extends DatabasesTypes.POSTGRES ? MemoryUsageInterfacePostgres :
			never;