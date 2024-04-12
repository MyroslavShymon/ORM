import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { FS } from '@utils/fs';
import {
	FieldTypeInterface,
	OptionsToCreateFieldInterface,
	TypescriptCodeGeneratorInterface
} from '@utils/typescript-code-generator/interfaces';

export class TypescriptCodeGenerator implements TypescriptCodeGeneratorInterface {
	constructor() {
	}

	generateInterfaceFile(
		interfaceFileName: string,
		interfaceFilePath: string,
		interfaceName: string,
		interfaceFields: OptionsToCreateFieldInterface[],
		interfaceImports?: ts.ImportDeclaration
	): void {
		FS.deleteFile(interfaceFilePath);

		const configFileName = ts.findConfigFile(path.join(__dirname, '../../../..', '/tsconfig.json'), ts.sys.fileExists, 'tsconfig.json');

		if (!configFileName) {
			throw new Error('Could not find a valid \'tsconfig.json\'.');
		}

		const host = ts.createWatchCompilerHost(
			configFileName,
			{},
			ts.sys,
			ts.createSemanticDiagnosticsBuilderProgram,
			this.reportDiagnostic,
			this.reportWatchStatusChanged
		);

		const origCreateProgram = host.createProgram;
		host.createProgram = (rootNames, options, host, oldProgram) => {
			options.incremental = true; // Встановлюємо параметр інкрементальної переіндексації
			options.tsBuildInfoFile = './.tsbuildinfo';
			return origCreateProgram(rootNames, options, host, oldProgram);
		};

		const program = ts.createWatchProgram(host);

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

	reportDiagnostic(diagnostic: ts.Diagnostic): void {
		if (diagnostic.code === 2322) {
			throw Error(
				'Error ' +
				diagnostic.code +
				':' +
				ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)
			);
		}
		console.error(
			'Error',
			diagnostic.code,
			':',
			ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)
		);
	}

	reportWatchStatusChanged(diagnostic: ts.Diagnostic): void {
		console.info(
			ts.formatDiagnostic(diagnostic, {
				getCanonicalFileName: (fileName) => fileName,
				getCurrentDirectory: ts.sys.getCurrentDirectory,
				getNewLine: () => ts.sys.newLine
			})
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
		const resultWithImports = ts.factory.updateSourceFile(resultFile, imports ? [imports] : []);

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
		const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
			undefined,
			interfaceName,
			[],
			undefined,
			fields.map(this.formField)
		);

		return ts.factory.updateInterfaceDeclaration(
			interfaceDeclaration,
			[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], // Додаємо модифікатор export
			interfaceDeclaration.name,
			interfaceDeclaration.typeParameters,
			interfaceDeclaration.heritageClauses,
			interfaceDeclaration.members
		);
		// return ts.factory.createInterfaceDeclaration(
		// 	undefined,
		// 	interfaceName,
		// 	[],
		// 	undefined,
		// 	fields.map(this.formField)
		// );
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
		// let elementType: ts.TypeNode = typeElement.isStringLiteral ?
		// 	ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(typeElement.type)) :
		// 	ts.factory.createTypeReferenceNode(typeElement.type, []);
		//
		// return typeElement.isArray && !typeElement.isStringLiteral
		// 	? ts.factory.createArrayTypeNode(elementType)
		// 	: elementType;
		const elementType = ts.factory.createTypeReferenceNode(typeElement.type, []);
		return typeElement.isArray
			? ts.factory.createArrayTypeNode(elementType)
			: elementType;
	};
}