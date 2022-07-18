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
    Create <span style="font-size: 100%;">✍</span> 
  </div>
  <div id='due_count'>{created_count} created today</div>
</button>

<style>
  button {
    color: purple;
    border: 2px purple solid;
    position: relative;
    margin: 6px;
  }
  #create_text {
    font-size: 2em;
    font-family: "Times New Roman", Times, Serif;
    padding: 24px;
  }
  @font-face {
    font-family: "Times New Roman";
    src: url(times-new-roman.ttf);
  }
  #due_count {
    font-size: 1em;
    position: absolute;
    display: block;
    width: 100%;
    bottom: 6px;
  }
</style>
