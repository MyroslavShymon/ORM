import { DatabasesTypes } from '@core/enums';
import { PrimaryGeneratedColumnMysqlInterface, PrimaryGeneratedColumnPostgresInterface } from '@core/interfaces';

export type PrimaryGeneratedColumnInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? PrimaryGeneratedColumnPostgresInterface : PrimaryGeneratedColumnMysqlInterface;