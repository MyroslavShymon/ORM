import * as ts from 'typescript';
import * as fs from 'fs';
import { FS } from '@utils/fs';
import {
	FieldTypeInterface,
	OptionsToCreateFieldInterface,
	TypescriptCodeGeneratorInterface
} from '@utils/typescript-code-generator/interfaces';
import { IncrementalTypeIndexator } from '@utils/incremental-type-indexator';

export class TypescriptCodeGenerator implements TypescriptCodeGeneratorInterface {
	private readonly _configFilePath;

	constructor(configFilePath: string) {
		this._configFilePath = configFilePath;
	}

	generateInterfaceFile(
		interfaceFileName: string,
		interfaceFilePath: string,
		interfaceName: string,
		interfaceFields: OptionsToCreateFieldInterface[],
		interfaceImports?: ts.ImportDeclaration
	): void {
		FS.deleteFile(interfaceFilePath);
		IncrementalTypeIndexator.performIncrementalTypeIndexing(this._configFilePath);

		fs.writeFileSync(
			interfaceFilePath,
			this.generateInterface(
				interfaceFileName,
				this.formInterface(
					interfaceName,
					interfaceFields
				),
				interfaceImports
			),
			'utf8'
		);
	}

	generateInterface(
		fileName: string,
		interfaceDeclaration?: ts.InterfaceDeclaration,
		imports?: ts.ImportDeclaration
	): string {
		const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
		const resultFile = ts.createSourceFile(fileName, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

		// Add imports into the start of the file
		const resultWithImports = ts.factory.updateSourceFile(resultFile, imports ? [imports] : []);

		// Add interface into files
		const resultWithInterface = ts.factory.updateSourceFile(resultWithImports, resultWithImports.statements.concat([interfaceDeclaration]));

		// Print and write down result into file
		return printer.printFile(resultWithInterface);
	}

	formImport(importName: string, importPath: string): [ts.ImportDeclaration, ts.TypeReferenceNode] {
		const formedImport = ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				undefined, // Not type-only import
				undefined, // No default import
				ts.factory.createNamedImports([
					ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(importName), ts.factory.createIdentifier(importName))
				])
			),
			ts.factory.createStringLiteral(importPath), // Adjust the path accordingly
			undefined
		);
		const typeNode = ts.factory.createTypeReferenceNode(importName, []);

		return [formedImport, typeNode];
	}

	formInterface(interfaceName: string, fields: OptionsToCreateFieldInterface[]): ts.InterfaceDeclaration {
		const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
			undefined,
			interfaceName,
			[],
			undefined,
			fields.map(this.formField)
		);

		return ts.factory.updateInterfaceDeclaration(
			interfaceDeclaration,
			[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], //add export
			interfaceDeclaration.name,
			interfaceDeclaration.typeParameters,
			interfaceDeclaration.heritageClauses,
			interfaceDeclaration.members
		);
	}

	formField = ({ isFieldOptional, fieldName, fieldType }: OptionsToCreateFieldInterface): ts.PropertySignature => {
		const typeArray = Array.isArray(fieldType) ? fieldType : [fieldType];

		const dataType = typeArray.map((type) =>
			'type' in type && type.type ? this.handleTypeElement(type) : type as ts.TypeReferenceNode
		);

		const dataTypeNode = dataType.length === 1
			? dataType[0]
			: ts.factory.createUnionTypeNode(dataType);

		return ts.factory.createPropertySignature(
			undefined,
			fieldName,
			isFieldOptional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
			dataTypeNode
		);
	};

	handleTypeElement(typeElement: FieldTypeInterface): ts.TypeNode {
		let elementType: ts.TypeNode = typeElement.isStringLiteral ?
			ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(typeElement.type)) :
			ts.factory.createTypeReferenceNode(typeElement.type, []);

		return typeElement.isArray && !typeElement.isStringLiteral
			? ts.factory.createArrayTypeNode(elementType)
			: elementType;
	};
}