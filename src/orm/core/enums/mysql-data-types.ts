export enum MysqlDataTypes {
	// Цілі числа
	TINYINT = 'TINYINT', // Дуже маленьке ціле число
	SMALLINT = 'SMALLINT', // Маленьке ціле число
	MEDIUMINT = 'MEDIUMINT', // Середнє ціле число
	INT = 'INT', // Звичайне ціле число
	BIGINT = 'BIGINT', // Велике ціле число

	// Числа з плаваючою комою
	DECIMAL = 'DECIMAL', // Число з фіксованою точністю, може мати два параметри: точність та масштаб
	FLOAT = 'FLOAT', // Число з плаваючою комою, може мати два параметри: точність та масштаб
	DOUBLE = 'DOUBLE', // Подвійна точність числа з плаваючою комою
	BIT = 'BIT', // Рядок бітів фіксованої довжини, вказується кількість бітів

	// Логічний тип
	BOOLEAN = 'BOOLEAN', // Логічне значення (TRUE/FALSE)

	// Дати та час
	DATE = 'DATE', // Дата
	DATETIME = 'DATETIME', // Дата та час
	TIMESTAMP = 'TIMESTAMP', // Дата та час (завжди оновлюється при оновленні рядка)
	TIME = 'TIME', // Час
	YEAR = 'YEAR', // Рік

	// Рядки та текст
	CHAR = 'CHAR', // Рядок фіксованої довжини, вказується довжина рядка
	VARCHAR = 'VARCHAR', // Рядок змінної довжини, вказується максимальна довжина рядка
	TINYTEXT = 'TINYTEXT', // Текст невеликої довжини
	TEXT = 'TEXT', // Текст
	MEDIUMTEXT = 'MEDIUMTEXT', // Текст середньої довжини
	LONGTEXT = 'LONGTEXT', // Текст великої довжини

	// Бінарні дані
	BINARY = 'BINARY', // Рядок бітів фіксованої довжини, вказується довжина рядка
	VARBINARY = 'VARBINARY', // Рядок бітів змінної довжини, вказується максимальна довжина рядка
	TINYBLOB = 'TINYBLOB', // Бінарні дані невеликого розміру
	BLOB = 'BLOB', // Бінарні дані
	MEDIUMBLOB = 'MEDIUMBLOB', // Бінарні дані середнього розміру
	LONGBLOB = 'LONGBLOB', // Бінарні дані великого розміру

	// Перерахування та множини
	ENUM = 'ENUM', // Перерахування значень, перелік значень
	SET = 'SET', // Множина значень, перелік значень

	// JSON та геометрія
	JSON = 'JSON', // JSON-дані
	GEOMETRY = 'GEOMETRY', // Геометричні дані

	// Географічні типи
	POINT = 'POINT', // Точка
	LINESTRING = 'LINESTRING', // Лінія
	POLYGON = 'POLYGON', // Полігон
	MULTIPOINT = 'MULTIPOINT', // Мульти-точка
	MULTILINESTRING = 'MULTILINESTRING', // Мульти-лінія
	MULTIPOLYGON = 'MULTIPOLYGON', // Мульти-полігон
	GEOMETRYCOLLECTION = 'GEOMETRYCOLLECTION', // Колекція геометричних об'єктів

	// Інші
	INTERVAL = 'INTERVAL', // Інтервал, тип інтервалу
	NULL = 'NULL' // Спеціальне значення NULL
}