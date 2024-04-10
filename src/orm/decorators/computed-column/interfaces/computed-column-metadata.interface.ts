import { DatabasesTypes } from '@core/enums';
import { BaseComputedColumnInterface } from '@decorators/computed-column';

export interface ComputedColumnMetadataInterface<DT extends DatabasesTypes | undefined = undefined>
	extends BaseComputedColumnInterface {
	name: string;
	propertyKey: string;
}