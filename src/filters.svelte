<script>

  import { filters } from './filters.js'
  import AdvancedFilters from './advanced_filters.svelte';
  let open = false;
  $: pointer = (open ? '-' : '+');
  $: more_or_less = (open ? 'Less' : 'More')
  let toggle = () => {open = !open};
</script>

<center>

Search: <input type='search' bind:value={$filters['search']} />

<button type='button' on:click={toggle}>
        {more_or_less} Filters <b>{pointer}</b>
</button>

</center>

<!--
  Use a div with conditional display instead of a more
  Svelte-conventional if block because an if block would require
  resubscribing to $filters each time it opened and this would
  make components think $filters was being updated
-->

<div style:display={open ? 'block' : 'none'}>
  <AdvancedFilters />
</div>




