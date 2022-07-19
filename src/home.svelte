<script>
  import { fetch_cardlist } from './api.js';
  import { new_card } from './card_templates.js';
  import Tristate from './tristate.svelte';
  import ReviewButton from './review_button.svelte';
  import CreateButton from './create_button.svelte';
  import Card from './card.svelte';
  import Filters from './filters.svelte';
  import Masonry from './masonry.svelte';
  import Loading from './loading.svelte';
  import { card_to_edit, card_to_review, username } from './state.js'
  import { filters, sort, next_two_due } from './filters.js'
  let innerWidth;
  // one column for every 450px of window width
  // At least one column
  $: cols = Math.floor(innerWidth / 450) || 1
  function create_card() {
          // create a new template card
          // pass it to the editor
          let nc = {...new_card()}; // copy new card template
          card_to_edit.set(nc);
  }
  function review() {
          card_to_review.set($next_two_due[0])
  }
        /*
  */
</script>


<svelte:window bind:innerWidth />

<body>

<div class='top'>
{#if $username === 'guest'}
        Welcome, guest
        <button class='login_button' type='button' on:click={() => {username.set('')}}>login / register</button>
{:else}
        Hello, {$username}
        <a class='login_button' on:click={() => {username.set('guest')}}>sign out</a> or
        <a class='login_button' on:click={() => {username.set('')}}>switch account</a>
{/if}

<a style="float: right; position: relative;" href='http://docs.vinca.study/links.html'>Links</a>

<div id='major_buttons'>
<ReviewButton on:click={review} />
<CreateButton on:click={create_card} />
</div>
</div>

<div style:margin='20px'>
<Filters />
</div>

{#key {...$filters} }
{#key $sort}
{#await fetch_cardlist()}
   <p><Loading /></p>
{:then cards}
   {#key cols}
     <Masonry cards={cards} cols={cols} />
   {/key}
{:catch error}
   <p style="color: red">{error.message}</p>
{/await}
{/key}
{/key}

</body>

<style>
  #major_buttons {
    display: grid;
    grid-template-columns: auto auto;
    gap: 5px;
  }
  .top {
    max-width: 1000px;
    margin: auto auto;
  }
  .login_button {
    border-radius: 10px;
  }
</style>
