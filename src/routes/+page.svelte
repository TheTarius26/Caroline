<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ProjectItem from '$lib/components/ProjectItem.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let selectedCategory = $state<string[]>([]);
	let searchQuery = $state('');
	let inputSearch = $state<HTMLInputElement>();

	const params = new SvelteURLSearchParams();

	const toggleCategory = (cat: string) => {
		const newSelectedCategory = selectedCategory.includes(cat)
			? selectedCategory.filter((c) => c !== cat)
			: [...selectedCategory, cat];

		selectedCategory = newSelectedCategory;
		params.set('categories', newSelectedCategory.join(','));
		if (params.get('categories') === '') params.delete('categories');

		goto(resolve(`/?${params.toString()}`));
	};

	let timer: ReturnType<typeof setTimeout>;
	function onSearch(value: string) {
		searchQuery = value;

		clearTimeout(timer);
		timer = setTimeout(() => {
			if (value) params.set('search', value);
			if (!value) params.delete('search');
			goto(resolve(`/?${params.toString()}`), {
				replaceState: true,
				noScroll: true,

				keepFocus: true
			});
		}, 300);

		// inputSearch.focus();
	}

	const categories = [
		'AI',
		'Health',
		'Education',
		'Environment',
		'Finance',
		'Entertainment',
		'Social',
		'Productivity',
		'Open Source'
	];
</script>

<div class="p-4 h-[calc(100vh-4rem)] w-full flex flex-col mx-auto items-center mt-[10vh]">
	<h1 class="text-7xl font-bold mb-2">Ideas</h1>
	<p class="text-gray-600 mb-8">Get project ideas based on your interests.</p>
	<div class="flex flex-wrap gap-2 mb-4 justify-center max-w-md w-full">
		{#each categories as cat (cat)}
			<CategoryBadge
				label={cat}
				selected={selectedCategory.includes(cat)}
				onclick={() => toggleCategory(cat)}
			/>
		{/each}
	</div>
	<div class="flex space-x-2 mb-8 w-full max-w-md">
		<input
			bind:this={inputSearch}
			type="text"
			placeholder="Enter a topic (e.g. AI, health, education)"
			class="border border-gray-300 rounded px-4 py-2 w-full max-w-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
			bind:value={searchQuery}
			oninput={(e) => onSearch(e.currentTarget.value)}
		/>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4 w-full max-w-4xl">
		{#each data.projects as project (project.id)}
			<ProjectItem
				title={project.name}
				description={project.description || ''}
				category={project.category}
				href={`/projects/${project.id}`}
				onclick={() => {
					console.log(`Clicked on project ${project.name}`);
				}}
			/>
		{/each}
	</div>
	<!-- Bottom Spacer -->
	<div class="grow">&nbsp;</div>
</div>
