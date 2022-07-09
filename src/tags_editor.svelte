<script>
  export let card;
  export let collection_tags;
	function new_tag (tag) {
		collection_tags = [tag, ...collection_tags];
	  card.tags = tag+', '+card.tags
	}
  let tags_list = card.tags.split(',')
  $: card.tags = tags_list.join(', ')
</script>

<div id='tags_bar'>
  <p id='tags_list'><b>{card.tags}</b></p>
	<div id='clickers'>
  	<select bind:value={tags_list} name="tags" multiple>
    	{#each collection_tags as tag}
	    <option selected={tags_list.includes(tag)} value={tag}> {tags_list.includes(tag)===true ? '✓' : ''}
				{tag}</option>
	    {/each}
    </select>
	  <p><span id='control_click'>Ctrl+Click to select multiple tags<br></span>
	    <button type='button' on:click={() => {new_tag(prompt('new tag'))}}>new tag
	    </button>
	  </p>		
	</div>

</div>

<style>
	#tags_bar {
		border: 1px solid black;
		background-color: #eee;
		margin: auto 0 15px;
		display: grid;
		padding: 10px;
	}
	#clickers {
		display: grid;
		grid-template-columns: 75% 25%;
	}
	p {
		text-align: center;
	}
</style>
