<script>
        export let state = null;
        let states = [null, true, false];
	let state_idx = states.indexOf(state); // initial state idx
	$: state = states[state_idx];
        $: color = {null:'black', true: 'darkgreen', false: 'red'}[state];
        $: text = {null: 'any', true: 'yes', false: 'no'}[state];
	function cycle_state() {
		state_idx = (state_idx + 1) % states.length;
	}
</script>

<label style:color={color} style:display={'inline'}>
  <slot></slot><br>
  <input on:click={cycle_state} type="checkbox" indeterminate={state===false} checked={state != null}>
	{text}
</label>

<style>
	label {
		margin: 10px;
                min-width: 50px;
	}
</style>
