<script lang="ts">
	import { cn } from '$lib/utils';
	import { createSeparator, type CreateSeparatorProps } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorProps['orientation'] = 'horizontal';
	export let decorative: CreateSeparatorProps['decorative'] = false;

	const { root } = createSeparator({
		orientation,
		decorative
	});
</script>

<div
	melt={$root}
	class={cn(
    'bg-slate-700',
    orientation == 'vertical' ? 'h-4 w-[1px]' : 'my-3.5 mx-1 h-[1px] w-full'
  )}
/>
