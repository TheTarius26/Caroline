import { db } from '$lib/server/db';
import { commentsSchema } from '$lib/server/db/schema/comments.schema';
import { projectsSchema } from '$lib/server/db/schema/projects.schema';
import { and, count, eq, ilike, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const categories = url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
	const searchQuery = url.searchParams.get('search') ?? '';

	const projects = await getProjectIdeas(categories, searchQuery);
	return { projects };
}) satisfies PageServerLoad;

const getProjectIdeas = async (categories: string[], searchQuery: string) => {
	const baseQuery = db
		.select({
			id: projectsSchema.id,
			name: projectsSchema.name,
			description: projectsSchema.description,
			category: projectsSchema.category,
			upvotes: projectsSchema.upvotes,
			downvotes: projectsSchema.downvotes,
			commentsCount: count(commentsSchema.id)
		})
		.from(projectsSchema)
		.leftJoin(commentsSchema, eq(projectsSchema.id, commentsSchema.projectId))
		.groupBy(projectsSchema.id);

	if (categories.length > 0 && searchQuery) {
		return await baseQuery.where(
			and(
				inArray(projectsSchema.category, categories),
				ilike(projectsSchema.name, `%${searchQuery}%`)
			)
		);
	}

	if (categories.length > 0) {
		return await baseQuery.where(inArray(projectsSchema.category, categories));
	}

	if (searchQuery) {
		return await baseQuery.where(ilike(projectsSchema.name, `%${searchQuery}%`));
	}

	return await baseQuery;
};
