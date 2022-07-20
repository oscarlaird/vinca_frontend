<script>
  import { createEventDispatcher } from 'svelte';
  import InfoTooltip from './info_tooltip.svelte'
  export let card;
  const dispatch = createEventDispatcher();
  let save   = () => {dispatch('save')}
  let cancel = () => {dispatch('cancel')}
  let preview = () => {dispatch('preview')}
  const card_types = ['basic','verses','occlusion']
</script>

<center>
        <InfoTooltip text="<b>Basic</b>:  class question and answer card <br><br>
                <b>Verses</b>: tests you line by line (useful for poetry) <br><br>
                <b>Occlusion</b>: generate several cards by covering up parts of a map or diagram (useful for geography)" />

Card type:
<select style:background-color={'white'} bind:value={card.card_type}>
{#each card_types as card_type}
  <option>{card_type}</option>
{/each}
</select>


<button class='submit_button' on:click={cancel}>cancel</button>
<button class='submit_button' on:click={preview}>preview</button>
<button class='submit_button' on:click={save}>  save</button>


<InfoTooltip text="Quantify in minutes the worth of remembering this knowledge.<br><br>
        This lets you see if the time spent studying a card has been worthwhile. <br><br>
        It also lets you sort your cards to find the best ones." />
Merit:
<input type=number bind:value={card.merit} style:width='50px' min=1 max=60>


</center>

<style>
	.submit_button {
		font-size: 1.2em;
		padding: 18px;
		margin: 6px;
        border: 1px solid black;
	}
</style>

