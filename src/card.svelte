<script>
  import { local_unix_day } from './unix_day.js';
  import { commit_changes } from './api.js';
  async function toggle_delete() {
          card.visibility = (card.visibility==='visible' ? 'deleted' : 'visible');
          //notify API
          commit_changes(card);
          card_edited_alert = true;

  }
  function preview() {
          state['card_to_preview'] = card;
          state['preview_mode'] = true;
  }
  function edit() {
          state['card_to_edit'] = card;
          state['edit_mode'] = true;
  }
  export let card;
  export let card_edited_alert;
  export let state;
  export let info; // We need to know the sort criterion so that
  let current_time = local_unix_day();
  $: text_decoration = (card.visibility==='deleted' ? 'line-through' : '');
  $: is_due = card.due_date < current_time;
  $: due_alert = (is_due && card.visibility==='visible' ? 'inline' : 'none');
  $: extra_info = get_extra_info(info);
  function get_extra_info(info) {
          switch (info) {
                  case '':
                          return ''
                  case 'create_date':
                          return 'Created <b><mark>' +
                                  Math.trunc(current_time - card[info]) +
                                  '</mark></b> days ago';
                  case 'due_date':
                          return 'Due in <b><mark>' +
                                  Math.trunc(card[info] - current_time) +
                                  '</mark></b> days';
                  case 'last_review_date':
                          return 'Last reviewed <b><mark>' +
                                  Math.trunc(current_time - card[info]) + 
                                  '</mark></b> days ago';
                  case 'last_edit_date':
                          return 'Last edited <b><mark>' +
                                  Math.trunc(current_time - card[info]) + 
                                  '</mark></b> days ago';
                  case 'review_seconds':
                          return 'Spent <b><mark>' +
                                  Math.floor(card[info]) + 
                                  '</mark></b> seconds reviewing';
                  case 'edit_seconds':
                          return 'Spent <b><mark>' +
                                  Math.floor(card[info]) + 
                                  '</mark></b> seconds editing';
                  case 'total_seconds':
                          return 'Spent <b><mark>' +
                                  Math.floor(card[info]) + 
                                  '</mark></b> seconds';
                  case 'card_type':
                          return '<b><mark>' +
                                  card[info] + 
                                  '</mark></b>';
                  case 'tags':
                          return 'tags: <b><mark>' +
                                  card[info] + 
                                  '</mark></b>';
                  default:
                          return ''
          }
  }

  let card_container;
</script>

<div class='card_container'>
    <button style:color={'darkred'} type="button" class="button" on:click={toggle_delete}>✕</button>&nbsp;
    <button type="button" class="button" on:click={preview}>👁</button>&nbsp;
    <button type="button" class="button" on:click={edit}>✍</button>&nbsp;
    {@html extra_info}
    <span class='front_text' style='color:purple; display:{due_alert}'>(due)&nbsp;</span>    

    <span class='front_text' style='text-decoration:{text_decoration}'>{(!card.front_text) ? '(blank)' : card.front_text}</span>
</div>


<style>
  .card_container {
    border: 2px solid black;
    border-radius: 6px;
    padding: 6px;
    margin: 3px;
    background-color: #ddd;
  }
  .front_text {
    font-size: 1.2em;
    line-height: 1.8em;
  }
  .button {
    background-color: #eee;
    margin: auto 2px;
    min-width: 1.8em;
    min-height: 1.8em;
    width: 1.8em;
    height: 1.8em;
    border-radius: 25%;
    padding: 2px;
  }

</style>
