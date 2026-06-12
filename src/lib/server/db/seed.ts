import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { user } from './schema/auth.schema';
import { collaboratorsSchema } from './schema/collaborators.schema';
import { commentsSchema } from './schema/comments.schema';
import { projectsSchema } from './schema/projects.schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set');
	process.exit(1);
}

const pool = new pg.Client({ connectionString: DATABASE_URL });
await pool.connect();
const db = drizzle(pool);

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Static Data ────────────────────────────────────────────────────────────

const seedUsers = [
	{ id: 'user_seed_001', name: 'Alice Wijaya', email: 'alice@example.com' },
	{ id: 'user_seed_002', name: 'Budi Santoso', email: 'budi@example.com' },
	{ id: 'user_seed_003', name: 'Citra Dewi', email: 'citra@example.com' },
	{ id: 'user_seed_004', name: 'Dimas Pratama', email: 'dimas@example.com' },
	{ id: 'user_seed_005', name: 'Eka Putri', email: 'eka@example.com' }
];

interface SeedProject {
	name: string;
	description: string;
	features: string;
	category: string;
	difficulty: number;
	status: string;
}

const seedProjects: SeedProject[] = [
	{
		name: 'AI Study Buddy',
		description:
			'Personal AI tutor that adapts to your learning style and helps you master any subject through interactive quizzes and spaced repetition.',
		features: 'Adaptive quizzes, Progress tracking, Voice interaction, Spaced repetition',
		category: 'AI',
		difficulty: 2,
		status: 'active'
	},
	{
		name: 'Carbon Wallet',
		description:
			'Track your daily carbon footprint by scanning receipts and get personalized suggestions to reduce emissions.',
		features: 'Receipt scanner, CO2 calculator, Green challenges, Leaderboard',
		category: 'Environment',
		difficulty: 1,
		status: 'active'
	},
	{
		name: 'HealthSync',
		description:
			'A unified health dashboard that aggregates data from wearables, lab results, and manual logs to give you a complete picture of your well-being.',
		features: 'Wearable sync, Lab result parser, Trend analysis, Medication reminders',
		category: 'Health',
		difficulty: 3,
		status: 'active'
	},
	{
		name: 'CodeMentor',
		description:
			'Peer-to-peer code review platform where junior developers get feedback from seniors in exchange for writing documentation.',
		features: 'Code review queue, Annotations, Reputation system, Doc generator',
		category: 'Education',
		difficulty: 2,
		status: 'active'
	},
	{
		name: 'Pocket Ledger',
		description:
			'Minimalist personal finance app that uses AI to categorize transactions and predict future spending patterns.',
		features: 'AI categorization, Spending forecast, Budget alerts, Export to CSV',
		category: 'Finance',
		difficulty: 2,
		status: 'active'
	},
	{
		name: 'Movie Match',
		description:
			'Tinder-style swiping for movies and shows. Swipe right to watch later, get recommendations based on your taste profile.',
		features: 'Swipe UI, Taste profile, Watchlist sync, Friend recommendations',
		category: 'Entertainment',
		difficulty: 1,
		status: 'active'
	},
	{
		name: 'NeighbourHelp',
		description:
			'Hyper-local community platform where neighbours can lend tools, offer rides, or organise block parties.',
		features: 'Geo-feed, Tool library, Ride pooling, Event calendar',
		category: 'Social',
		difficulty: 2,
		status: 'active'
	},
	{
		name: 'Focus Flow',
		description:
			'Pomodoro timer with AI-powered break suggestions. It learns when you are most productive and schedules deep work sessions accordingly.',
		features: 'Smart Pomodoro, Distraction blocker, Productivity analytics, Custom sounds',
		category: 'Productivity',
		difficulty: 1,
		status: 'active'
	},
	{
		name: 'GitExplain',
		description:
			'Open-source Chrome extension that explains any GitHub codebase using LLM — just click a file and get a plain-English summary.',
		features: 'File summarizer, Dependency graph, README generator, PR reviewer',
		category: 'Open Source',
		difficulty: 3,
		status: 'active'
	},
	{
		name: 'Plant Parent',
		description:
			'AI-powered plant care app that identifies plants from photos, diagnoses diseases, and reminds you when to water or fertilise.',
		features: 'Plant identifier, Disease diagnosis, Care schedule, Community tips',
		category: 'AI',
		difficulty: 2,
		status: 'active'
	},
	{
		name: 'MediTrack',
		description:
			'Blockchain-based medical record system giving patients full control over who accesses their health data.',
		features: 'Encrypted records, Access logs, Consent management, Emergency access',
		category: 'Health',
		difficulty: 3,
		status: 'active'
	},
	{
		name: 'EcoMarket',
		description:
			'Marketplace for upcycled and second-hand goods with a carbon-saving badge on each listing showing how much CO₂ you saved by buying used.',
		features: 'Listing builder, Carbon badge, Chat system, Shipping calculator',
		category: 'Environment',
		difficulty: 2,
		status: 'active'
	}
];

const seedComments: string[] = [
	'This is brilliant! I have been looking for something like this.',
	'I tried building something similar but gave up. Would love to contribute!',
	'Great idea but I think the scope is too broad for an MVP.',
	'How would this handle privacy concerns?',
	'I would definitely use this. When can I sign up for beta?',
	'Have you checked if there are existing open-source alternatives?',
	'Solid concept. The monetisation model needs more thought though.',
	'I can help with the frontend if anyone picks this up!',
	'Nice! This fills a real gap in the market.',
	'What tech stack are you planning to use for this?'
];

const seedReplies: string[] = [
	'Good point! I think starting with web-only would be simpler.',
	'Agreed. Maybe we can scope it down to just the core feature first.',
	'I have been thinking about using SvelteKit + PostgreSQL for this.',
	'That is exactly what I was thinking. Let me know if you want to collaborate!',
	'Privacy is definitely important. We could use encryption at rest.'
];

// ─── Seed Logic ─────────────────────────────────────────────────────────────

async function seed() {
	console.log('🌱 Seeding database...\n');

	// ── Cleanup (child tables first because of FK) ──
	console.log('  Cleaning existing data...');
	await db.delete(commentsSchema);
	await db.delete(collaboratorsSchema);
	await db.delete(projectsSchema);
	await db.delete(user);
	console.log('  ✅ Done\n');

	// ── 1. Users ──
	console.log('  Creating users...');
	const createdUsers = await db
		.insert(user)
		.values(
			seedUsers.map((u) => ({
				id: u.id,
				name: u.name,
				email: u.email,
				emailVerified: true,
				bio: pickRandom([
					'Full-stack developer passionate about open source',
					'Product designer turned indie hacker',
					'CS student exploring side projects',
					'Software engineer & weekend builder',
					'Tech enthusiast and lifelong learner'
				]),
				githubUrl: `https://github.com/${u.name.toLowerCase().replace(/\s+/g, '')}`,
				role: 'user'
			}))
		)
		.returning({ id: user.id, name: user.name });
	console.log(`  ✅ ${createdUsers.length} users created\n`);

	// ── 2. Projects ──
	console.log('  Creating project ideas...');
	const createdProjects: { id: string; name: string }[] = [];
	for (const p of seedProjects) {
		const [project] = await db
			.insert(projectsSchema)
			.values({
				name: p.name,
				description: p.description,
				features: p.features,
				category: p.category,
				difficulty: p.difficulty,
				status: p.status,
				upvotes: randomInt(5, 120),
				downvotes: randomInt(0, 10),
				views: randomInt(50, 5000)
			})
			.returning({ id: projectsSchema.id, name: projectsSchema.name });
		createdProjects.push(project);
	}
	console.log(`  ✅ ${createdProjects.length} projects created\n`);

	// ── 3. Collaborators ──
	console.log('  Creating collaborators...');
	const collaboratorEntries: {
		username: string;
		repository: string;
		projectId: string;
	}[] = [];
	for (const project of createdProjects) {
		const count = randomInt(0, Math.min(2, createdUsers.length - 1));
		const shuffled = [...createdUsers].sort(() => Math.random() - 0.5);
		for (let i = 0; i < count; i++) {
			collaboratorEntries.push({
				username: shuffled[i].name,
				repository: `https://github.com/${shuffled[i].name.toLowerCase().replace(/\s+/g, '')}/${project.name.toLowerCase().replace(/\s+/g, '-')}`,
				projectId: project.id
			});
		}
	}
	if (collaboratorEntries.length > 0) {
		await db.insert(collaboratorsSchema).values(collaboratorEntries);
	}
	console.log(`  ✅ ${collaboratorEntries.length} collaborators created\n`);

	// ── 4. Comments + Replies ──
	console.log('  Creating comments & replies...');
	let totalComments = 0;
	for (const project of createdProjects) {
		const commentCount = randomInt(1, 4);
		const commentUserPool = [...createdUsers].sort(() => Math.random() - 0.5);

		for (let i = 0; i < commentCount; i++) {
			const commentUser = commentUserPool[i % commentUserPool.length];
			const [inserted] = await db
				.insert(commentsSchema)
				.values({
					projectId: project.id,
					userId: commentUser.id,
					comment: pickRandom(seedComments)
				})
				.returning({ id: commentsSchema.id });
			totalComments++;

			// 50% chance of having replies
			if (Math.random() > 0.5) {
				const replyCount = randomInt(1, 2);
				const replyUserPool = createdUsers.filter((u) => u.id !== commentUser.id);
				for (let j = 0; j < Math.min(replyCount, replyUserPool.length); j++) {
					await db.insert(commentsSchema).values({
						projectId: project.id,
						userId: replyUserPool[j].id,
						parentId: inserted.id,
						comment: pickRandom(seedReplies)
					});
					totalComments++;
				}
			}
		}
	}
	console.log(`  ✅ ${totalComments} comments created\n`);

	// ── Summary ──
	console.log('═══════════════════════════════════════');
	console.log('  📊 Seed Summary');
	console.log('═══════════════════════════════════════');
	console.log(`  Users:         ${createdUsers.length}`);
	console.log(`  Projects:      ${createdProjects.length}`);
	console.log(`  Collaborators: ${collaboratorEntries.length}`);
	console.log(`  Comments:      ${totalComments}`);
	console.log('═══════════════════════════════════════\n');

	console.log('✅ Seed completed successfully!');
	await pool.end();
}

seed().catch((e) => {
	console.error('❌ Seed failed:', e);
	process.exit(1);
});

export default seed;
