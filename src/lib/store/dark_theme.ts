import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const enabled = writable<boolean>(browser && localStorage.theme === 'dark');