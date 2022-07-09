<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let save   = () => {dispatch('save')}
  let cancel = () => {dispatch('cancel')}
  let preview = () => {dispatch('preview')}
  const card_types = ['basic','verses','occlusion']
	export let card;
</script>

<center>
{#each card_types as card_type}
<label>
  <input type="radio" name="card_type" bind:group={card.card_type} value={card_type} checked={card.card_type===card_type}>
  {card_type}
</label>
{/each}

<button class='submit_button' on:click={cancel}>cancel</button>
<button class='submit_button' on:click={preview}>preview</button>
<button class='submit_button' on:click={save}>  save</button>
</center>

<style>
	label {
		display: inline;
		padding: 12px;
	}
	.submit_button {
		font-size: 1.2em;
		padding: 18px;
		margin: 6px;
        border: 1px solid black;
	}
</style>

