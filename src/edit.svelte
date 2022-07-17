<script>
  import { onMount } from 'svelte';
  import { get_placeholder } from './placeholder_cards.js';
  import { local_unix_day, unix_seconds } from './unix_day.js';
  import { getOcclusionData, random_id, upload_media, commit_changes } from './api.js';
  import SideEditor from './side_editor.svelte';
  import TagsEditor from './tags_editor.svelte';
  import EditHeader from './edit_header.svelte';
  import ImageOccluder from './image_occluder.svelte';
  export let collection_tags;
  export let card;
  export let card_edited_alert;
  export let state;
  export let cached_cards;
  let occlusion_data = {box:{width:500,height:500}, hide_all:true, rectangles:[]}
  onMount(async () => {
          if (card.id!=0 && card.card_type==='occlusion') {
                  occlusion_data = await getOcclusionData(card.back_image_id)
          }
  });
  let tmp_card = {...card}; // copy into tmp card
  $: placeholder = get_placeholder(tmp_card.card_type)
  const start_time = unix_seconds();
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
  async function save() {
          const end_time = unix_seconds()
          var elapsed = end_time - start_time;
          // increment review_start time by the seconds we spend editing the card
          // this will make the reviewing_time be less so that we don't
          // double count the time as both editing and reviewing
          state.review_start = state.review_start + elapsed;
          // copy over values from the tmp card
          for (var key in tmp_card) {
                  card[key] = tmp_card[key];
          };

          if (card.card_type==='occlusion') {
                  // If it took 30 seconds to make 6 Img Occlusion cards I want
                  // to report this as 5 seconds per card so that I do not overcount
                  elapsed = elapsed / occlusion_data.rectangles.length
                  //const siblings = // fetch_cardlist back_image_id===card.back_image_id (old)
                  // replace siblings with already cached_cards
                  // cached_cards.push (siblings where not already in cached_cards)
                  // occl_cards = siblings.

                  for (let rect of occlusion_data.rectangles) {
                          if (rect.deleted && rect.id!=0) {
                                  // delete existing occlusion cards
                                  // update the database via api
                                  commit_changes({id: rect.id, visibility: 'purged'})
                                  // update cached_cards locally
                                  const cached_card = cached_cards.find((elem) => elem.id===rect.id)
                                  cached_card.visibility = 'purged';
                          }
                          if (rect.id===0 && !rect.deleted) {
                                  // create new occlusion cards
                                  let new_card = {...card} // copy existing occlusion card
                                  new_card.id = random_id()
                                  rect.id = new_card.id // NB: We are building up occlusion data
                                  cached_cards.push(new_card);
                                  // send it to the db
                                  commit_changes(new_card, elapsed)
                          }
                          // update occlusion data for all occl cards via api
                          // update occlusion data locally in cached cards
                  }
                  // We just assigned each rectangle to a real card we just created
                  // Now we save the image_occlusion_data in JSON to database media table
                  const media_id = await upload_media(JSON.stringify(occlusion_data), false)
                  // now go back and set back_image_id to media_id for all cards
                  for (let rect of occlusion_data.rectangles) {
                          // update the database
                          commit_changes({id: rect.id, back_image_id: media_id})
                          // locally update cached cards
                          const cached_card = cached_cards.find((elem) => elem.id===rect.id)
                          cached_card.back_image_id = media_id
                  }
                  // finally if our original card was one of these we should push it
                  quit()
                          
          } else if (card.card_type==='basic' || card.card_type==='verses') {
                  // API call to save edits to the server
                  if (card.id===0) {
                      card.id = random_id() 
                      cached_cards.push(card);
                      cached_cards = cached_cards;
                  }
                  commit_changes(card, elapsed);
                  quit()
          }

  }
  function quit() {
          state.edit_mode = false;
          state.card_to_edit = null;
          card_edited_alert = true;
  }

  
</script>



<body>

<EditHeader bind:card={tmp_card} on:preview={preview} on:cancel={cancel} on:save={save}></EditHeader>
<hr>

{#if tmp_card.card_type==='occlusion'}
        <ImageOccluder bind:data={occlusion_data} bind:image_id={tmp_card.front_image_id} />
        <hr>
{/if}

<SideEditor image_picker_disabled={tmp_card.card_type==='occlusion'} bind:text={tmp_card.front_text} bind:image_id={tmp_card.front_image_id} placeholder={placeholder.front}></SideEditor>
<hr>


{#if tmp_card.card_type!='verses'}
<SideEditor image_picker_disabled={tmp_card.card_type==='occlusion'} bind:text={tmp_card.back_text} bind:image_id={tmp_card.back_image_id} placeholder={placeholder.back}></SideEditor>
<hr>
{/if}

<TagsEditor bind:collection_tags bind:card={tmp_card}></TagsEditor>

</body>
