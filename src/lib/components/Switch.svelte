<script lang="ts">
	import { cn } from '$lib/utils';
  import { createSwitch } from '@melt-ui/svelte';
  
  export let value = false;
  const { root, input, isChecked } = createSwitch({checked: value});


  isChecked.subscribe((v) => value = v);

  export let label = "";
  export let name = "";

  let cl = "";
  export {cl as class};
</script>

<section class={cn("flex items-center", cl)}>
  <label class="pr-4 leading-none" for={name}>
    {label}
  </label>
  <button
    melt={$root}
    class="relative h-6 w-11 cursor-default rounded-full bg-stone-800 transition-colors data-[state=checked]:bg-stone-700"
    id="airplane-mode"
  >
    <span
      class="block h-5 w-5 translate-x-0.5 rounded-full bg-white
              transition-transform will-change-transform
              {$isChecked && 'translate-x-[22px]'}"
    />
    <input melt={$input} />
  </button>
</section>