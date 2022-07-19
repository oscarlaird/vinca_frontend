<script>
  import { collection_tags } from './collection_tags.js';
  export let card;
	function new_tag (tag) {
                collection_tags.update((tags) => [tag, ...tags]);
                has_tag_map[tag] = true;
	}
  let has_tag_map = $collection_tags.reduce((running_map, tag) => {running_map[tag] = false; return running_map}, (new Map()));
  const tl = card.tags==='' ? [] : card.tags.split(',')
  for (tag in tl) {
          has_tag_map[tag] = true
  }
  $: tags_list = Object.entries(has_tag_map).filter(pair => pair[1]).map(pair => pair[0])
  $: card.tags = tags_list.join(', ');

  let search = '';
</script>

<div id='tags_bar'>
  <p id='tags_list'><b>{card.tags}</b></p>
  <button type='button' on:click={() => {new_tag(prompt('new tag'))}}>+ new tag </button>&nbsp;
  <input type='search' bind:value={search} placeholder='search' />

{#each Object.keys(has_tag_map).reverse() as tag}
        {#if tag.includes(search)}
            <label> 
                <input type='checkbox' bind:checked={has_tag_map[tag]}  />
                {tag}
            </label>
        {/if}
{/each}
</div>





<style>
	#tags_bar {
		border: 1px solid black;
		background-color: #eee;
		margin: auto 0 15px;
		display: flex;
                flex-flow: row wrap;
		padding: 10px;
	}
	p {
		text-align: center;
                width: 100%;
	}
        label {
                margin: 8px;

        }

</style>
