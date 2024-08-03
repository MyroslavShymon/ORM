export interface IndexOptionsMysqlInterface {
	isUnique?: boolean;
	included?: string[];

	isFulltext?: boolean;
	isSpatial?: boolean;
}