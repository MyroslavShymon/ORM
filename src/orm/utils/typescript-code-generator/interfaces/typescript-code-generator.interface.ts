import * as ts from 'typescript';
import {
	OptionsToCreateFieldInterface
} from '@utils/typescript-code-generator/interfaces/options-to-create-field.interface';
import { FieldTypeInterface } from '@utils/typescript-code-generator/interfaces/field-type.interface';

export interface TypescriptCodeGeneratorInterface {
	generateInterface(
		fileName: string,
		interfaceDeclaration?: ts.InterfaceDeclaration,
		imports?: ts.ImportDeclaration
	): string;

	formImport(importName: string, importPath: string): [ts.ImportDeclaration, ts.TypeReferenceNode];

	formInterface(interfaceName: string, fields: OptionsToCreateFieldInterface[]): ts.InterfaceDeclaration;

	formField({ isFieldOptional, fieldName, fieldType }: OptionsToCreateFieldInterface): ts.PropertySignature;

	handleTypeElement(typeElement: FieldTypeInterface): ts.TypeNode;
}