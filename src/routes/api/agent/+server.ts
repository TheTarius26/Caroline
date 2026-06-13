import { getProjectIdea } from '$lib/openrouter/agent';

export async function GET() {
	const idea = (await getProjectIdea('web development')) || {
		title: 'No idea',
		description: 'No description'
	};
	return new Response(JSON.stringify(idea), {
		headers: { 'Content-Type': 'application/json' }
	});
}
