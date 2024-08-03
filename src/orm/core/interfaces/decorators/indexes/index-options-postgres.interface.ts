export interface IndexOptionsPostgresInterface {
	isUnique?: boolean;
	included?: string[];

	isHash?: boolean;
	isGist?: boolean;
	isGin?: boolean;
	isSpgist?: boolean;
	isBrin?: boolean;

	bloomWith?: string;
	condition?: string;
}