export interface DropTableInterface {
	type?: 'CASCADE' | 'RESTRICT';
	ifExist?: boolean;
}