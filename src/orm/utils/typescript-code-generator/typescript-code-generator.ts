import * as ts from 'typescript';
import * as fs from 'fs';
import {
	FieldTypeInterface,
	OptionsToCreateFieldInterface,
	TypescriptCodeGeneratorInterface
} from '@utils/typescript-code-generator/interfaces';
import { FS } from '@utils/fs';

export class TypescriptCodeGenerator implements TypescriptCodeGeneratorInterface {
	constructor() {
	}

	generateInterfaceFile(
		interfaceFileName: string,
		interfaceFilePath: string,
		interfaceName: string,
		interfaceImports: ts.ImportDeclaration,
		interfaceFields: OptionsToCreateFieldInterface[]
	): void {
		FS.deleteFile(interfaceFilePath);

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

		// Додаємо імпорти до початку файлу
		const resultWithImports = ts.factory.updateSourceFile(resultFile, [imports]);

		// Додаємо інтерфейс до файлу
		const resultWithInterface = ts.factory.updateSourceFile(resultWithImports, resultWithImports.statements.concat([interfaceDeclaration]));

		// Друкуємо та записуємо результат у файл
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
		return ts.factory.createInterfaceDeclaration(
			undefined,
			interfaceName,
			[],
			undefined,
			fields.map(this.formField)
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
		const elementType = ts.factory.createTypeReferenceNode(typeElement.type, []);
		return typeElement.isArray
			? ts.factory.createArrayTypeNode(elementType)
			: elementType;
	};
}