import * as ts from 'typescript';
import { FieldTypeInterface } from '@utils/typescript-code-generator/interfaces/field-type.interface';

export interface OptionsToCreateFieldInterface {
	fieldName: string,
	fieldType: FieldTypeInterface[] | FieldTypeInterface | ts.TypeReferenceNode | ts.TypeReferenceNode[]
	isFieldOptional?: boolean,
}