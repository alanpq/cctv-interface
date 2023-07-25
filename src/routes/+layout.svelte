<script lang="ts">
    import "../app.css";
    
	import { browser } from "$app/environment";
	import { enabled } from "../lib/store/dark_theme";
    enabled.subscribe((value) => {
        if(!browser) return;
        localStorage.theme = (value == true) ? "dark" : "light";
        console.log(value);
        if (value)
            document.documentElement.classList.add('dark')
        else
            document.documentElement.classList.remove('dark')
        }
    )
    // import type { LayoutData } from './$types';
    
    // export let data: LayoutData;
</script>

<slot/>