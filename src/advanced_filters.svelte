<script>
  import { purge } from './api.js'
  import { info as global_info } from './info.js';
  import { collection_tags } from './collection_tags.js';
  import { filters, sort } from './filters.js';
  import Tristate from './tristate.svelte';
  import InfoTooltip from './info_tooltip.svelte';
  let info = $global_info;
  $: global_info.set(info) // update global_info when info (LOCAL) changes
  let purge_button;
  function ask_purge() {
          if (confirm('Purge deleted cards?')) {
                  purge($filters)
                  purge_button.style.display = 'none';
          }
  }
  $: switch ($sort) {
          case 'old':
                  info = 'create_date';
                  break;
          case 'overdue':
                  info = 'due_date';
                  break;
          case 'total time':
                  info = 'total_seconds';
                  break;
          case 'merit':
                  info = 'merit';
                  break;
          default:
                  info = null;
                  break;
  }
  
</script>

<div class='master'>
<div class='tristates'>
<Tristate bind:state={$filters['due']}>due: </Tristate>
<Tristate bind:state={$filters['new']}>new: </Tristate>
<Tristate bind:state={$filters['deleted']}>deleted: </Tristate>
{#if $filters.deleted}
        <button type='button' style:border-radius={'4px'} bind:this={purge_button} style:color={'red'} on:click={ask_purge}>purge
                <InfoTooltip text={'Purged cards will never be seen again.<br><br>(However, vinca never destroys data and it is possible to manually recover purged cards from the database).'} />
        </button>
{/if}
<Tristate bind:state={$filters['images']}>images: </Tristate>
<Tristate bind:state={$filters['audio']}>audio: </Tristate>
</div>

<div class='selectors'>
<span>
Type:
<select bind:value={$filters['card_type']}>
        <option></option>
	<option>basic</option>
	<option>verses</option>
	<option>occlusion</option>
</select></span>
<span>
Info: 
<select bind:value={info}>
        <option></option>
	<option value='create_date'>created</option>
	<option value='due_date'>due date</option>
	<option value='last_review_date'>last review</option>
	<option value='edit_seconds'>editing time</option>
	<option value='review_seconds'>review time</option>
	<option value='total_seconds'>total time</option>
	<option value='card_type'>card type</option>
	<option value='tags'>tags</option>
	<option value='merit'>merit</option>
</select></span>
</div>
<div class='selectors'>
<span>
Sort: 
<select bind:value={$sort}>
	<option>recent</option>
	<option>old</option>
	<option>overdue</option>
	<option>total time</option>
	<option>random</option>
	<option>merit</option>
</select></span>
<span>
Tag: 
<select bind:value={$filters['tag']}>
        <option></option>
        {#each $collection_tags as tag}
                <option>{tag}</option>
        {/each}
</select></span></div>
</div>


<style>
	div {
		display: flex;
		justify-content: center;
		margin: 10px;
	}
	.tristates {
	}
	.selectors {
		min-width: 350px;
	}
	select {
                margin: 10px 20px 10px 0px;
		vertical-align: middle;
	}
	button {
		margin: 10px;
	}
	.master {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		
	}
</style>


