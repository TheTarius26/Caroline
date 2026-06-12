<script lang="ts">
	import { fly } from 'svelte/transition';

	let sidebarOpen = $state(false);
</script>

<!-- Top Nav -->
<div
	class="w-full h-12 flex items-center justify-between px-4 border-b border-gray-200 sticky top-0 bg-white z-10"
>
	<div class="flex items-center gap-2">
		<button
			onclick={() => (sidebarOpen = true)}
			class="p-1 hover:bg-gray-100 rounded"
			aria-label="Open menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
		<div class="text-xl font-bold">Ideas</div>
		<div class="h-full bg-white w-px"></div>
	</div>
	<nav class="space-x-4"></nav>
</div>

<!-- Sidebar -->
{#if sidebarOpen}
	<aside
		class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-4"
		transition:fly={{ x: -300, duration: 250 }}
	>
		<div class="flex justify-between items-center mb-6">
			<span class="font-bold text-lg">Menu</span>
			<button
				onclick={() => (sidebarOpen = false)}
				class="p-1 hover:bg-gray-100 rounded"
				aria-label="Close menu"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<nav class="flex flex-col space-y-2">
			<a href="/" class="text-gray-700 hover:text-gray-900">Home</a>
			<a href="/about" class="text-gray-700 hover:text-gray-900">About</a>
			<a href="/contact" class="text-gray-700 hover:text-gray-900">Contact</a>
		</nav>
	</aside>
{/if}
