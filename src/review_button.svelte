<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function forward() {
          dispatch('click');
  }
  export let due_count = 0;
  $: due_count_plus = due_count + (due_count>=50 ? '+' : '');
</script>

<button type='button' on:click={forward}>
  <div id='review_text'>
    Review <span style="font-size: 100%;">🕮 </span>
  </div>
  <div id='due_count'>{due_count_plus} cards due</div>
</button>

<style>
  button {
    color: green;
    border: 2px green solid;
    margin: 6px;
  }
  #review_text {
    font-size: 2em;
    font-family: "Times New Roman", Times, Serif;
    padding: 0.5em;
  }
  #due_count {
    font-size: 1em;
  }
</style>
