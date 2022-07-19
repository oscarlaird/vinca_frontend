<script>
	import { afterUpdate } from 'svelte';
        import Card from './card.svelte';
        export let cards = [];
	export let height = 0;
	let col;
	afterUpdate(() => {
		height = col.clientHeight
	})
	
</script>     

<div bind:this={col} style:height="fit-content">
{#each cards as card}
        <Card card={card} />
{/each}	
</div>
