export interface DropTablePostgresInterface {
	type?: 'CASCADE' | 'RESTRICT';
	ifExist?: boolean;
}