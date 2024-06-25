import { DatabasesTypes } from '@core/enums';
import { PrimaryGeneratedColumnMysqlInterface, PrimaryGeneratedColumnPostgresInterface } from '@core/interfaces';

export type  AddPrimaryGeneratedColumnInterface<DT extends DatabasesTypes> =
	DT extends DatabasesTypes.POSTGRES ? PrimaryGeneratedColumnPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? PrimaryGeneratedColumnMysqlInterface :
			never;