<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function forward() {
          dispatch('click');
  }
  export let created_count;
</script>

<button type='button' on:click={forward}>
  <div id='create_text'>
    Create <span style="font-size: 120%;">✍</span> 
  </div>
  <span id='due_count'>{created_count} created today</span>
</button>

<style>
  button {
    color: purple;
    border: 2px purple solid;
    margin: 6px;
  }
  #create_text {
    font-size: 2em;
    padding: 0.5em;
  }
  #due_count {
    font-size: 1em;
  }
</style>
