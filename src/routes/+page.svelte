<script lang="ts">
	import { browser } from "$app/environment";
	import { writable } from "svelte/store";
	import Switch from "../lib/components/Switch.svelte";
	import { enabled } from "../lib/store/dark_theme";

  

</script>

<img alt="live feed" src="http://192.168.1.28:8081" class="bg-slate-800"/>

<Switch label="Dark Mode" name="dark-mode" bind:value={$enabled}/>