<script>
  import { get_basic_placeholder, get_verses_placeholder } from './placeholder_cards.js';
  import { local_unix_day, unix_seconds } from './unix_day.js';
  import { commit_changes } from './api.js';
  import SideEditor from './side_editor.svelte';
  import TagsEditor from './tags_editor.svelte';
  import EditHeader from './edit_header.svelte';
  export let collection_tags;
  export let card;
  export let card_edited_alert;
  export let state;
  let tmp_card = {...card}; // copy into tmp card
  const start_time = unix_seconds();
  $: back_side_display = (tmp_card.card_type==="basic" ? "block" : "none")
  function preview() {
          state.preview_mode = true;
          state.card_to_preview = tmp_card;
  }
  function cancel() {
          // if it was a new card (designated by id=0) we want to permanently delete it
          if (card.id===0) {
                  card.visibility = 'purged'
          }
          state['edit_mode'] = false;

  }
  function save() {
          // copy over values from the tmp card
          for (var key in tmp_card) {
                  card[key] = tmp_card[key];
          };
          // API call to save edits to the server
          const end_time = unix_seconds()
          const elapsed = end_time - start_time;
          // increment review_start time by the seconds we spend editing the card
          // this will make the reviewing_time be less so that we don't
          // double count the time as both editing and reviewing
          state.review_start = state.review_start + elapsed;
          commit_changes(card, elapsed);
          state.edit_mode = false;
          state.card_to_edit = null;
          card_edited_alert = true;
  }

  
</script>

<body>

<EditHeader bind:card={tmp_card} on:preview={preview} on:cancel={cancel} on:save={save}></EditHeader>
<hr>
<SideEditor bind:text={tmp_card.front_text} bind:image_id={tmp_card.front_image_id} placeholder='question'></SideEditor>

<div style='display:{back_side_display}'>
<hr>
<SideEditor bind:text={tmp_card.back_text} bind:image_id={tmp_card.back_image_id} placeholder='answer'></SideEditor>
</div>
<hr>
<TagsEditor bind:collection_tags bind:card={tmp_card}></TagsEditor>



</body>


