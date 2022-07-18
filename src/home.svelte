<script>
  import { new_card } from './card_templates.js';
  import Tristate from './tristate.svelte';
  import ReviewButton from './review_button.svelte';
  import CreateButton from './create_button.svelte';
  import Card from './card.svelte';
  import Filters from './filters.svelte';
  let due;
  let new_only;
  $: due_message = (due === 'any' ? '' : due === 'yes' ? 'due' : 'not due')
  export let username;
  export let state;
  export let filtered_cards;
  export let cached_cards;
  export let filters;
  export let due_count;
  export let info;
  export let created_count;
  export let card_edited_alert;
  export let collection_tags;
  export let sort;
  export let search;
  let innerWidth;
  // one column for every 450px of window width
  // At least one column
  $: cols = Math.floor(innerWidth / 450) || 1
  function create_card() {
          // create a new template card
          // add it to the filtered_cards list
          // pass it to the editor
          let nc = {...new_card()}; // copy new card template
          state['card_to_edit'] = nc;
          state['edit_mode'] = true;
  }
</script>

<svelte:window bind:innerWidth />

<body>


<div class='top'>
{#if username === 'guest'}
        Welcome, guest
        <button class='login_button' type='button' on:click={() => {username = 'none'}}>login / register</button>
{:else}
        Hello, {username}
        <a class='login_button' on:click={() => {username = 'guest'; window.localStorage.clear()}}>sign out</a> or
        <a class='login_button' on:click={() => {username = 'none'}}>switch account</a>
{/if}

<a style="float: right; position: relative;" href='http://docs.vinca.study/links.html'>Links</a>

<div id='major_buttons'>
<ReviewButton on:click={() => {state.reviewing=true}} bind:due_count></ReviewButton>
<CreateButton on:click={create_card} bind:created_count></CreateButton>
</div>
</div>

<div style:margin='20px'>
<Filters bind:filtered_cards bind:search bind:sort bind:filters bind:info bind:collection_tags/>
</div>

<div class='columns'>

<!--
// [...Array(5).keys()] gives the range [0,1,2,3,4]
-->
{#each [...Array(cols).keys()] as offset}
        <div class='column'>
        {#each filtered_cards.filter((elem,idx,arr) => idx%cols===offset) as card (card.id)}
                <Card bind:card_edited_alert card={card} bind:info bind:state></Card>
        {/each}
        </div>
{/each}

</div>



</body>

<style>
  #major_buttons {
    display: grid;
    grid-template-columns: auto auto;
    background-color: #ddd;
    width: 100%;
    border: 1px solid black;
  }
  .top {
    max-width: 1000px;
    margin: auto auto;
  }
  .login_button {
    border-radius: 10px;
  }
  .columns {
    display: grid;
    grid-template-columns: auto;
  }
  @media screen and (min-width: 900px) {
    .columns {
      grid-template-columns: 50% 50%;
    }
  }
  @media screen and (min-width: 1350px) {
    .columns {
            grid-template-columns: 33% 34% 33%;
    }
  }
  @media screen and (min-width: 1800px) {
    .columns {
            grid-template-columns: 25% 25% 25% 25%;
    }
  }
</style>
