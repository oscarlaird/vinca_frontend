<script>
  import Tristate from './tristate.svelte';
  export let filters;
  export let info;
</script>

<div class='master'>
<div class='tristates'>
<Tristate bind:state={filters['due']}>due: </Tristate>
<Tristate bind:state={filters['new']}>new: </Tristate>
<Tristate bind:state={filters['deleted']}>deleted: </Tristate>
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
Sort: 
<select bind:value={filters['sort']}>
	<option>recent</option>
	<option>old</option>
	<option>overdue</option>
	<option>total time</option>
	<option>reviewed</option>
	<option>edited</option>
	<option>random</option>
</select></span>
<span>
Info: 
<select bind:value={info}>
	<option value='create_date'>created</option>
	<option value='due_date'>due date</option>
	<option value='last_review_date'>last review</option>
	<option value='edit_seconds'>editing time</option>
	<option value='review_seconds'>review time</option>
	<option value='total_seconds'>total time</option>
	<option value='card_type'>card type</option>
	<option value='tags'>tags</option>
</select></span>
</div>

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


