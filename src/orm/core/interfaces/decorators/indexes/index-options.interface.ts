import { DatabasesTypes } from '@core/enums';
import { IndexOptionsMysqlInterface } from '@core/interfaces/decorators/indexes/index-options-mysql.interface';
import { IndexOptionsPostgresInterface } from '@core/interfaces/decorators/indexes/index-options-postgres.interface';
import { BaseIndexOptionsInterface } from '@core/interfaces/decorators/indexes/base-index-options.interface';

export type IndexOptionsInterface<DT extends DatabasesTypes | undefined = undefined> =
	DT extends DatabasesTypes.POSTGRES ? IndexOptionsPostgresInterface :
		DT extends DatabasesTypes.MYSQL ? IndexOptionsMysqlInterface :
			BaseIndexOptionsInterface;