<script lang="ts">
	import Switch from '../lib/components/Switch.svelte';
	import { enabled } from '../lib/store/dark_theme';
	import Separator from '../lib/components/Separator.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section>
	<img
		alt="live feed"
		src="http://192.168.1.28:8081"
		class="bg-slate-800 max-h-[100vh] max-w-[100vw]"
	/>
</section>

<Separator />
<Switch label="Dark Mode" name="dark-mode" bind:value={$enabled} />

<article class="flex flex-wrap">
	{#each data.videos as v}
		{#if v.thumb}
			<section>
				<p>{v.ts_format}</p>
				<img src={`/cctv/${v.thumb}`} class="max-h-[9em]" alt={v.ts_format}/>
			</section>
		{/if}
	{/each}
</article>