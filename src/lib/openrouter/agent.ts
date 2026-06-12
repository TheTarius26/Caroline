import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { projectsSchema } from '$lib/server/db/schema/projects.schema';
import { OpenRouter } from '@openrouter/agent';
import { z } from 'zod';

const openrouter = new OpenRouter({
	apiKey: env.OPENROUTER_API_KEY
});

// Schema validasi output
const ProjectIdea = z.object({
	title: z
		.string()
		.min(1)
		.describe(
			'Title of the project idea in general or the themes, max 20 characters. not represent the actual project title.'
		)
		.max(20)
		.default('No idea'),
	description: z
		.string()
		.min(1)
		.max(500)
		.describe('Short description of the project idea, in markdown format, max 500 characters')
		.default('No description'),
	features: z
		.array(z.string())
		.describe('List of main features of the project idea, max 5')
		.default([]),
	category: z
		.enum([
			'AI',
			'Health',
			'Education',
			'Environment',
			'Finance',
			'Entertainment',
			'Social',
			'Productivity',
			'Open Source'
		])
		.describe(
			'The category of the project idea, choose one from [AI, Health, Education, Environment, Finance, Entertainment, Social, Productivity, Open Source]. max 1 category.'
		)
		.default('AI'),
	difficulty: z
		.number()
		.int()
		.min(1)
		.max(10)
		.describe('Estimated difficulty of the project idea on a scale of 1 to 10')
		.default(5)
});

export type ProjectIdea = z.infer<typeof ProjectIdea>;

export async function getProjectIdea(topic: string): Promise<ProjectIdea> {
	const listAddedProjects = await db.select().from(projectsSchema);
	const response = await openrouter.callModel({
		model: 'deepseek-v4-flash',
		input: `You are a product manager. Give 1 project idea about "${topic}".

        ---
        **Format response:**
        \`\`\`json
        {
          ${Object.entries(ProjectIdea.shape)
						.map(([key, value]) => `${key}: ${value.description}`)
						.join(',\n          ')}
        }
        \`\`\`
        ---
        write the response in english.
				only return JSON. no markdown, no other text.
				category should be one of these: [AI, Health, Education, Environment, Finance, Entertainment, Social, Productivity, Open Source].
        ---
        
        exclude project ideas that are similar to these projects:
        ${listAddedProjects.map((p) => `- ${p.name}`).join('\n')}
        `
	});

	const text = await response.getText();

	try {
		// Parse JSON dari response (handle kalau ada backticks)
		const cleaned = text.replace(/```json?|```/g, '').trim();
		const idea = ProjectIdea.parse(JSON.parse(cleaned));
		db.insert(projectsSchema)
			.values({
				name: idea.title,
				description: idea.description,
				status: 'active',
				features: idea.features.join(', '),
				category: idea.category
			})
			.execute();
		return idea;
	} catch (e) {
		console.error('Failed to parse project idea from AI response:', e);
		console.error('Original response text:', text);
		return ProjectIdea.parse({}); // Return default idea if parsing fails
	}
}
