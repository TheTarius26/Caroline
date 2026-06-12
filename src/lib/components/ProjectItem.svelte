<script lang="ts">
	import CategoryBadge from './CategoryBadge.svelte';

	interface ProjectItemProps {
		title: string;
		description: string;
		category: string;
		commentsCount?: number;
		upvotes?: number;
		downvotes?: number;
		href?: string;
		onclick?: () => void;
	}

	let {
		title,
		description,
		category,
		commentsCount,
		upvotes,
		downvotes,
		onclick,
		href
	}: ProjectItemProps = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	{onclick}
	type={href ? undefined : 'button'}
	role={href ? 'link' : 'button'}
	class="border border-gray-300 rounded-md p-4 h-full flex flex-col justify-start shadow-sm hover:shadow-md transition-shadow cursor-pointer"
>
	<div class="flex items-center justify-between gap-2 mb-2">
		<h3 class="text-lg font-semibold">{title}</h3>
		<CategoryBadge label={category} />
	</div>
	<p class="text-gray-600 line-clamp-4">{description}</p>
	<!-- Spacer -->
	<div class="grow">&nbsp;</div>
	<div class="flex items-end gap-2 justify-between">
		<div class="flex items-center gap-4">
			<!-- soft comment icon -->
			<div class="flex items-center gap-1">
				<svg class="w-6 h-6 text-gray-500">
					<path
						fill="currentColor"
						d="M21 6h-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1h2a1 1 0 1 0 0-2zM5 4h12v12H5V4zm7.707 8.707a1 1 0 0 0-1.414-1.414L9.586 14l-1.707-1.707a1 1 0 1 0-1.414 1.414L8.586 15l-1.707 1.707a1 1 0 1 0 1.414 1.414L9.586 16l1.707 1.707a1 1 0 0 0 1.414-1.414L11.414 15l1.707-1.707z"
					/>
				</svg>
				<span>{commentsCount}</span>
			</div>
		</div>
		<!-- upvotes + downvotes icon -->
		<div>
			<div class="flex items-center gap-1">
				<!-- arrow up icon -->
				<svg class="w-6 h-6">
					<path fill="currentColor" d="M12 4l-6 6h4v6h4v-6h4l-6-6z" />
				</svg>
				<span>{upvotes}</span>
			</div>
			<div class="flex items-center gap-1">
				<!-- arrow down icon -->
				<svg class="w-6 h-6">
					<path fill="currentColor" d="M12 20l6-6h-4v-6h-4v6H6l6 6z" />
				</svg>
				<span>{downvotes}</span>
			</div>
		</div>
	</div></svelte:element
>
