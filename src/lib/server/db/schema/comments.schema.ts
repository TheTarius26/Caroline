import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';
import { projectsSchema } from './projects.schema';

export const commentsSchema = pgTable('comments', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => projectsSchema.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	parentId: text('parent_id').references((): AnyPgColumn => commentsSchema.id, {
		onDelete: 'cascade'
	}),
	comment: text('comment').notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});
