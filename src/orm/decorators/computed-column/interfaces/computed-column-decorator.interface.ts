import { DatabasesTypes } from '@core/enums';
import { BaseComputedColumnInterface } from '@decorators/computed-column';

export interface ComputedColumnDecoratorInterface<DT extends DatabasesTypes | undefined = undefined>
	extends BaseComputedColumnInterface {
	name?: string;
}