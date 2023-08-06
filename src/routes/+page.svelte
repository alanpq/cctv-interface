<script lang="ts">
	import Switch from '../lib/components/Switch.svelte';
	import { enabled } from '../lib/store/dark_theme';
	import Separator from '../lib/components/Separator.svelte';
	import type { PageData } from './$types';
	import type { Video } from './+page.server';

	export let data: PageData;

	let safe_thumb: string | undefined;
	let video: Video | undefined;

	const cctv_path = data.cctv_path;

	const setVideo = (v: Video) => {
		video = v;
		safe_thumb = v.thumb ?? safe_thumb;
	};
</script>

<main>
	<section class="flex flex-row items-center justify-center bg-black">
		{#if video}
			<video
				src={`${cctv_path}/${video.video}`}
				controls
				autoplay
				poster={`${cctv_path}/${video.thumb ?? safe_thumb}`}
			/>
		{:else}
			<img
				alt="live feed"
				src="http://192.168.1.28:8081"
				class="bg-slate-800 max-h-[100vh] max-w-[100vw]"
			/>
		{/if}
	</section>
	<section class="p-1 flex">
		{data.videos.length} videos.
		<span class="flex-1" />
		<Switch label="Dark Mode" name="dark-mode" bind:value={$enabled} />
	</section>

	<article class="videos text-white overflow-y-auto">
		{#each data.videos as v}
			{#if v.thumb}
				<button
					class="
				flex
				h-[9em]
				w-[12em]
				bg-cover
				relative cursor-pointer
				after:absolute after:inset-0
				after:transition-opacity after:opacity-0
				hover:after:opacity-50 after:bg-black"
					class:after:opacity-80={video?.ts == v.ts}
					style={`background-image: url(${cctv_path}/${v.thumb})`}
					on:click={setVideo(v)}
				>
					<p class="self-end text-center w-full">{v.ts_format}</p>
					<!-- <img src={`/cctv/${v.thumb}`} class="max-h-[9em]" alt={v.ts_format}/> -->
				</button>
			{/if}
		{/each}
	</article>
</main>

<style lang="scss">
	.videos {
		display: grid;
		// gap: 0.3em;
		grid-template-columns: repeat(auto-fill, 12em);
		justify-content: center;
	}

	main {
		display: grid;
		grid-template-rows: auto min-content min-content minmax(2fr, auto);
		height: 100dvh;
	}
</style>
