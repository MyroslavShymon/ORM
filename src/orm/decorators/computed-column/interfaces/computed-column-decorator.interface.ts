import { BaseComputedColumnInterface } from '@decorators/computed-column';

export interface ComputedColumnDecoratorInterface extends BaseComputedColumnInterface {
	name?: string;
}