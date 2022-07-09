<script>
  export let filters;
  export let info
  import AdvancedFilters from './advanced_filters.svelte';
	let open = false;
	$: visibility = (open ? 'block' : 'none')
	$: pointer = (open ? '-' : '+');
	$: more_or_less = (open ? 'Less' : 'More')
	let toggle = () => {open = !open};
</script>

<center>
        Search: <input type='search' bind:value={filters['search']}>
<button type='button' on:click={toggle}>
        {more_or_less} Filters <b>{pointer}</b>
</button>
</center>

<div style:display={visibility}>
<AdvancedFilters bind:info bind:filters />
</div>




