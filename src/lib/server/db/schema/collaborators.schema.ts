import { pgTable, text } from 'drizzle-orm/pg-core';
import { projectsSchema } from './projects.schema';

export const collaboratorsSchema = pgTable('collaborators', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('username').notNull(),
	repository: text('repository').notNull(),
	projectId: text('project_id')
		.notNull()
		.references(() => projectsSchema.id)
});
