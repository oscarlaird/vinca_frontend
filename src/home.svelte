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
  function create_card() {
          // create a new template card
          // add it to the filtered_cards list
          // pass it to the editor
          let nc = {...new_card}; // copy new card template
          cached_cards.push(nc);
          filtered_cards.push(nc);
          state['card_to_edit'] = nc;
          state['edit_mode'] = true;
  }
</script>

<body>

{#if username === 'guest'}
        Welcome, guest
        <button class='login_button' type='button' on:click={() => {username = 'none'}}>login / register</button>
{:else}
        Hello, {username}
        <a class='login_button' on:click={() => {username = 'guest'; window.localStorage.clear()}}>sign out</a> or
        <a class='login_button' on:click={() => {username = 'none'}}>switch account</a>
{/if}

<div id='major_buttons'>
<ReviewButton on:click={() => {state.reviewing=true}} bind:due_count></ReviewButton>
        <CreateButton on:click={create_card} bind:created_count></CreateButton>
</div>

<div style:margin='20px'>
<Filters bind:filters bind:info/>
</div>

<div id='card_list'>
{#each filtered_cards as card (card.id)}
        <Card bind:card_edited_alert card={card} bind:info bind:state></Card>
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
  .login_button {
    border-radius: 10px;
    color: #77f;
  }
  #card_list {
    display: grid;
    grid-template-columns: auto;
  }
  @media screen and (min-width: 900px) {
    #card_list {
      grid-template-columns: auto auto;
    }
  }
  @media screen and (min-width: 1350px) {
    #card_list {
      grid-template-columns: auto auto auto;
    }
  }
  @media screen and (min-width: 1800px) {
    #card_list {
      grid-template-columns: auto auto auto auto;
    }
  }
</style>
