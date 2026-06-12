import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const projectsSchema = pgTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	upvotes: integer('upvotes').default(0).notNull(),
	downvotes: integer('downvotes').default(0).notNull(),
	views: integer('views').default(0).notNull(),
	difficulty: integer('difficulty').default(0).notNull(),
	features: text('features').notNull().default(''),
	status: text('status').notNull().default('active'),
	category: text('category').notNull().default('AI'),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});
