import { AutoIncrementColumnTypesPostgresType } from '@decorators/primary-generated-column';

export interface AddPrimaryGeneratedColumnInterface {
	columnName: string;
	type: AutoIncrementColumnTypesPostgresType;
	startWith?: number;
	incrementBy?: number;
	minValue?: number;
	maxValue?: number;
	isCycle?: boolean;
	cache?: number;
	ownedBy?: string;
	restartWith?: number;
	noOrder?: boolean;
}