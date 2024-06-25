import { BaseComputedColumnInterface } from '@decorators/computed-column';
import { DatabasesTypes } from '@core/enums';

export interface ComputedColumnMetadataInterface<DT extends DatabasesTypes | undefined = undefined>
	extends BaseComputedColumnInterface<DT> {
	name: string;
	propertyKey: string;
}