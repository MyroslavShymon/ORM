# Orm

Welcome to @myroslavshymon/orm(ORM) documentation. My system is a powerful and flexible tool for working with databases
in the NodeJS environment, which allows developers to efficiently interact with relational databases such as PostgreSQL
and MySQL. ORM is designed to simplify the process of working with data, ensuring security and productivity.

[Link to full documentation of my ORM](https://myroslavs-organization.gitbook.io/orm)  
[Link to example of usage of my ORM system](https://github.com/MyroslavShymon/ORM-Example-Project)

### Main functionality:

1. Abstracting access to the database
2. Conversion of objects into database records and vice versa
3. Automatic creation and maintenance of the database structure
4. Database migrations
5. Support of various databases
6. Management of communications between objects
7. Support for integrity constraints
8. Providing protection against SQL injections
9. Data caching
10. Transaction support

## Getting Started

### Connecting to PostgreSQL

To begin, you need to set up a connection to your PostgreSQL database. Below is an example of how to establish this
connection:

```typescript
import { DatabaseManager, DatabasesTypes, DataSourceContext } from "@myroslavshymon/orm";

// Create a DatabaseManager instance for PostgreSQL
export const databaseManager = new DatabaseManager<DatabasesTypes.POSTGRES>(
	{
		type: DatabasesTypes.POSTGRES,
		host: 'localhost',
		user: 'postgres',
		password: 'xxx',
		port: 5432,
		database: 'first',
		models: [
			Users,
		],
	},
	new DataSourceContext()
);

// Establish the ORM connection
(async () => {
	await databaseManager.createOrmConnection();
})();
```

### Configuration Parameters:

- `type`: Type of database (e.g., MySQL or PostgreSQL).
- `host`: Database server address.
- `user`: Username for database connection.
- `password`: Password for database connection.
- `port`: Port on which the database is running.
- `database`: Name of the database.
- `models`: Array of models to be used in your ORM system.

### Explanation:

Import Necessary Modules: Import the required modules from your ORM library.  
Create DatabaseManager Instance: Initialize DatabaseManager with database connection parameters.  
Create ORM Connection: Call createOrmConnection to establish the connection.

This setup allows you to quickly configure the connection to your database and start using my ORM.

### Defining a User Model

To create a basic user model, you need to define the Users model. Here’s an example:

```typescript
import {
	Boolean,
	Column,
	PrimaryGeneratedColumn,
	String,
	Table
} from "@myroslavshymon/orm";

@Table({ name: 'users' })
export class Users {
	@PrimaryGeneratedColumn({ type: 'BIGINT' })
	user_id: number;

	@String({ type: "VARCHAR", length: 255 })
	@Column({ options: { unique: true, nullable: false } })
	username: string;

	@String({ type: "VARCHAR", length: 255 })
	@Column({ options: { nullable: false } })
	email: string;

	@String({ type: "VARCHAR", length: 255 })
	@Column({ options: { nullable: false } })
	password: string;

	@Column({ options: { dataType: 'BOOLEAN', defaultValue: false } })
	is_active: boolean;
}
```

### Explanation:

- `@Table({name: 'users'})`: Specifies the table name in the database.
- `@PrimaryGeneratedColumn({type: 'BIGINT'})`: Defines user_id as a primary key with auto-generation.
- `@String({type: "VARCHAR", length: 255})`: Specifies column type and length for username, email, and password.
- `@Column({options: {nullable: false}})`: Ensures columns are non-nullable.
- `@Column({options: {dataType: 'BOOLEAN', defaultValue: false}})`: Defines is_active as a boolean with a default value
  of false.

## Adding Models to the System

Once you have created your model, include it in the database configuration:

```typescript
import { DatabaseManager, DatabasesTypes, DataSourceContext } from "@myroslavshymon/orm";
import { Users } from "./models/users"; // Path to your model

export const databaseManager = new DatabaseManager<DatabasesTypes.POSTGRES>(
	{
		type: DatabasesTypes.POSTGRES,
		host: 'localhost',
		user: 'postgres',
		password: 'xxx',
		port: 5432,
		database: 'first',
		models: [
			Users
		],
	},
	new DataSourceContext()
);
```

### Creating Tables in the Database

To create the users table:

Initialize the connection with createOrmConnection().
Run `npm run start` to synchronize the Users class and map it to the `current_database_ingot` table in migrations for
migration creation.

### Creating and Running Migrations

To manage database schema changes, use migrations. For details, refer to the migration documentation
[Link to documentation of ORM-CLI](https://myroslavs-organization.gitbook.io/orm/orm-cli/komandi-i-vikoristannya)

## Query Examples

Here are some examples of how to perform basic queries using my ORM:

1. ***Select All Users***

```typescript
const selectAllUsers = await databaseManager.queryBuilder<Users[]>()
	.select()
	.from('users')
	.execute();

console.log('Select All Users Query: ', selectAllUsers);
```

**This query retrieves all records from the `users` table.**

2. ***Select Active Users***

```typescript
const selectActiveUsers = await databaseManager.queryBuilder<Users[]>()
	.select()
	.from('users')
	.where({ conditions: { is_active: { eq: 'true' } } })
	.execute();

console.log('Select Active Users Query: ', selectActiveUsers);
```

**This query retrieves only active `users` where `is_active` is true.**

3. ***Select Users by `user_id`***

```typescript
const selectUserByUserId = await databaseManager.queryBuilder<Users[]>()
	.select()
	.from('users')
	.where({ conditions: { user_id: { lt: 6 } } })
	.execute();

console.log('Select User by UserId Query: ', selectUserByUserId);
```

**This query retrieves users with `user_id` less than 6.**

These examples demonstrate how to perform simple queries using my ORM’s QueryBuilder. Queries can be adjusted or
expanded
based on your data retrieval needs.

For more advanced usage please read full documentation
[My ORM Documentation](https://myroslavs-organization.gitbook.io/orm)
