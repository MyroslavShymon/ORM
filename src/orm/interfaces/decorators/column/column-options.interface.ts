import {PostgresqlDataTypes} from "../../../enums/postgresql-data-types";

export interface ColumnOptionsInterface {
    dataType: PostgresqlDataTypes;
    nullable?: boolean;
    length?: number;
    check?: string;
    checkConstraint?: string;
    default?: string | number;
    unique?: boolean;
    nullsNotDistinct?: boolean;
}