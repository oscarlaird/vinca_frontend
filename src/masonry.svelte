<script>
	import { onMount, tick } from 'svelte'
	import Column from './card_column.svelte'
        export let cards = [];
	export let cols;
	let template = Array(cols).fill(Math.floor(100/cols)+'%').join(' ');
	let col_contents = [];
	for (let _ of Array(cols)) {
		col_contents.push([])
	}
	let col_heights = Array(cols).fill(0);

	onMount(async () => {
          let shortest_col;
          for (let card of cards) {
                 await tick(); //wait for col_heights to update
                 shortest_col = col_heights.indexOf(Math.min(...col_heights))
                 col_contents[shortest_col].push(card);
		 col_contents[shortest_col] = col_contents[shortest_col];

    	  }
	});
	
</script>

<div class='columns' style:grid-template-columns={template}>

<!--
// [...Array(5).keys()] gives the range [0,1,2,3,4]
-->
{#each [...Array(cols).keys()] as offset}
        <Column bind:height={col_heights[offset]} cards={col_contents[offset]} />
{/each}

</div>

<style>
  .columns {
    display: grid;
  }

</style>
