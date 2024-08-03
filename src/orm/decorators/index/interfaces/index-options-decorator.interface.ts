export interface IndexOptionsDecoratorInterface {
	isUnique?: boolean;
	included?: string[];

	isHash?: boolean;//? postgres
	isGist?: boolean;//? postgres
	isGin?: boolean;//? postgres
	isSpgist?: boolean;//? postgres
	isBrin?: boolean;//? postgres

	bloomWith?: string;//? postgres
	condition?: string;//? postgres

	isFulltext?: boolean;//? mysql
	isSpatial?: boolean;//? mysql
}