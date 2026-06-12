<script lang="ts">
	interface CategoryBadgeProps {
		label: string;
		onclick?: () => void;
		selected?: boolean;
		formaction?: string;
	}

	let { label, onclick, selected, formaction }: CategoryBadgeProps = $props();
</script>

<button
	class="text-gray-800 text-xs font-semibold px-2 py-1 rounded-full h-auto transition-colors duration-200 {onclick
		? 'cursor-pointer'
		: ''} {selected ? 'bg-blue-500 text-white hover:bg-blue-800' : 'bg-gray-200 hover:bg-gray-300'}"
	{formaction}
	{onclick}
>
	<span class="capitalize">{label}</span>
</button>
