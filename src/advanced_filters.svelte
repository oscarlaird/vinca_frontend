<script>
  import { purge } from './api.js'
  import Tristate from './tristate.svelte';
  import InfoTooltip from './info_tooltip.svelte';
  export let filters;
  export let info;
  export let collection_tags;
  export let sort;
  export let card_edited_alert;
  export let filtered_cards;
  let purge_button;
  function ask_purge() {
          if (confirm('Purge deleted cards?')) {
                  purge(filters)
                  purge_button.style.display = 'none';
                  filtered_cards =[];
          }
  }
  $: switch (sort) {
          case 'old':
                  info = 'create_date';
                  break;
          case 'overdue':
                  info = 'due_date';
                  break;
          case 'total time':
                  info = 'total_seconds';
                  break;
          case 'meritorious':
                  info = 'merit';
                  break;
          default:
                  info = null;
                  break;
  }
  
</script>

<div class='master'>
<div class='tristates'>
<Tristate bind:state={filters['due']}>due: </Tristate>
<Tristate bind:state={filters['new']}>new: </Tristate>
<Tristate bind:state={filters['deleted']}>deleted: </Tristate>
{#if filters.deleted}
        <button type='button' style:border-radius={'4px'} bind:this={purge_button} style:color={'red'} on:click={ask_purge}>purge
                <InfoTooltip text={'Purged cards will never be seen again.<br><br>(However, vinca never destroys data and it is possible to manually recover purged cards from the database).'} />
        </button>
{/if}
<Tristate bind:state={filters['images']}>images: </Tristate>
<Tristate bind:state={filters['audio']}>audio: </Tristate>
</div>

<div class='selectors'>
<span>
Card type:
<select bind:value={filters['card_type']}>
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
<select bind:value={sort}>
	<option>recent</option>
	<option>old</option>
	<option>overdue</option>
	<option>total time</option>
	<option>random</option>
	<option>meritorious</option>
</select></span>
<span>
Tag: 
<select bind:value={filters['tag']}>
        <option></option>
        {#each collection_tags as tag}
                <option>{tag}</option>
        {/each}
</select></span></div>

<!--
<div class='buttons'>
<label>
        <center>Created Date Range</center>
        <center><input type='date' bind:value={filters['created_after']}><input type='date' bind:value={filters['created_before']}></center>
</label>
<label>
        <center>Due Date Range</center>
        <center><input type='date' bind:value={filters['due_after']}><input type='date' bind:value={filters['due_before']}></center>
</label>
</div>
-->
</div>


<style>
	input {
		font-size: 12px;
	}
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
	.buttons {
		min-width: 300px;
	}
	select {
                margin: 10px 20px 10px 0px;
		vertical-align: middle;
	}
	button {
		margin: 10px;
	}
        label {
                margin: 10px;
        }
	.master {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		
	}

</style>


