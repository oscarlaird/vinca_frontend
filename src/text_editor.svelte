<script>
	import {onMount} from 'svelte';
  export let value = null;
	let area;
	export let placeholder;
        $: if (area) {area.placeholder = placeholder}
</script>

<textarea bind:value bind:this={area}></textarea>

<style>
	textarea {
		border: 1px solid black;
	}
</style>
