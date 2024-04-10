import { DatabaseTypesMap } from '@core/types';
import { BaseColumnInterface } from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface ComputedColumnInterface<DB extends DatabasesTypes | undefined = undefined> extends BaseColumnInterface {
	dataType: DatabaseTypesMap<DB>;
	calculate: string;
	stored: boolean;
}