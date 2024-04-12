import {
	AutoIncrementColumnTypesMysqlType,
	AutoIncrementColumnTypesPostgresType
} from '@decorators/primary-generated-column';

export interface PrimaryGeneratedColumnDecoratorInterface {
	type: AutoIncrementColumnTypesPostgresType | AutoIncrementColumnTypesMysqlType;
	startWith?: number;
	incrementBy?: number;
	minValue?: number;
	maxValue?: number;
	isCycle?: boolean;
	cache?: number;
	ownedBy?: string;
	restartWith?: number;//postgres
	noOrder?: boolean;//postgres
}