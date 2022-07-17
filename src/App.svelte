<script>
  import { onMount } from 'svelte';
  import { dummy_card } from './card_templates.js';
  import { unix_seconds, local_unix_day } from './unix_day.js';
  import { get_collection_tags, set_guest_user, fetch_cardlist } from './api.js';
  import { filter_card, get_next_due_card }  from './filtering.js'
  import Home from './home.svelte';
  import Edit from './edit.svelte';
  import Review from './review.svelte';
  import Login from './login.svelte';
  let cached_cards = new Array(1).fill(dummy_card);
  let filtered_cards = cached_cards;
  let card_edited_alert = false;
  let defer_load = true;
  let collection_tags = [];
  let username;
  let state = {card_to_edit: null, edit_mode: false,
               card_to_preview: null, preview_mode: false,
               card_to_review: null, reviewing: false, review_start: null};
  let filters = { deleted: false, search: '',
                 due: null, new: null,
                 images: null, audio: null,
                 tag: null, card_type: '',
                 created_after: null, created_before: null,
                 due_after: null, due_before:  null,}
  let sort = 'recent';
  let info = null;
  let current_time = local_unix_day();
  let cards_loaded = false;

  $: created_cards = cached_cards.filter((card) => card.create_date > Math.floor(current_time))
  $: due_cards = cached_cards.filter((card) => card.due_date < current_time)
  $: created_count = created_cards.length
  $: due_count = due_cards.length

  let next_card;
  $: if (state.reviewing && state.card_to_review===null) {
          state.review_start = unix_seconds();
          next_card = get_next_due_card(filtered_cards);
          if (next_card===null) { state.reviewing = false; }
          state.card_to_review=next_card; // can be null
  };


  async function refresh_cached_cards() {
          // TODO we should pull cards from the db
          // which match our criteria up to 300
          if (!defer_load) {

                  cached_cards = await fetch_cardlist(filters, sort);
                  collection_tags = await get_collection_tags();
          }
  }
  async function refresh_filtered_cards() {
          if (!defer_load) {
                  filtered_cards = cached_cards//.filter((card) => filter_card(filters, card));
                  //const f = filtered_cards.sort((c1,c2) => {return c1.edit_seconds - c2.edit_seconds});
                  card_edited_alert = false;
                  switch (sort) {
                        case 'recent':
                                  filtered_cards.sort((c1,c2) => Math.max(c2.last_edit_date, c2.last_review_date)-
                                                                 Math.max(c1.last_edit_date, c1.last_review_date))
                                  break;
                        case 'old':
                                  filtered_cards.sort((c1,c2) => c1.create_date - c2.create_date)
                                  break;
                        case 'meritorious':
                                  filtered_cards.sort((c1,c2) => c2.merit - c1.merit)
                                  break;
                        case 'edited':
                                  filtered_cards.sort((c1,c2) => c1.last_edit_date - c2.last_edit_date)
                                  break;
                        case 'reviewed':
                                  filtered_cards.sort((c1,c2) => c1.last_review_date - c2.last_review_date)
                                  break;
                        case 'random':
                                  filtered_cards.sort(() => Math.random() - 0.5)
                                  break;
                        case 'overdue':
                                  filtered_cards.sort((c1,c2) => c1.due_date - c2.due_date)
                                  break;
                        case 'total time':
                                  filtered_cards.sort((c1,c2) => c2.total_seconds - c1.total_seconds)
                                  break;
                  }
          }
  }

  $: {let x = {...filters}; sort; refresh_cached_cards()} // TODO should refresh cached cards
  $: username,                    refresh_cached_cards()
  $: cached_cards,      refresh_filtered_cards()
  $: card_edited_alert, refresh_filtered_cards()
  

  onMount(async () => {
      set_guest_user();
      username = window.localStorage.getItem('username');
      defer_load = false;
  });

</script>

<body>
{#if username === 'none'}
  <Login bind:username></Login>
{:else}

{#if state.preview_mode && state.card_to_preview}
  <Review preview=true bind:card={state.card_to_preview} bind:state></Review>
{/if}

<div style:display={(!state.preview_mode) ? 'block' : 'none'}>
  {#if state.edit_mode && state.card_to_edit}
    <Edit bind:card={state.card_to_edit} bind:cached_cards bind:card_edited_alert bind:collection_tags bind:state />
  {/if}
</div>

<div style:display={(!state.preview_mode && !state.edit_mode) ? 'block' : 'none'}>
  {#if state.reviewing && state.card_to_review!=null}
    <Review bind:card_edited_alert bind:state bind:card={state.card_to_review} />
  {/if}
</div>

<div style:display={(!state.preview_mode && !state.edit_mode && !state.reviewing) ? 'block' : 'none'}>
  <Home bind:sort bind:collection_tags bind:card_edited_alert bind:due_count bind:created_count bind:username bind:filters bind:state bind:filtered_cards bind:cached_cards bind:info/>
</div>

{/if}
</body>


<style>
  body {
    background-color: #CAE3CD;
    border: 1px solid black;
    margin: 0 auto;
    min-height: 100%;
    height: fit-content;
  }
</style>
