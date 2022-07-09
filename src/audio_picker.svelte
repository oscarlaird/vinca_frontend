<script>
  let real_file_input;
	let value = 'Choose audio';
</script>

<input type='file' bind:this={real_file_input} accept='.mp3,.wav,.ogg' bind:value style='display: none'>

<button on:click={() => {real_file_input.click()}}>
	&nbsp;
	♬
	&nbsp;
	<span style='font-size: 32px;'>↑</span>
	&nbsp;
	🕪
	<br>
	<span style='font-size: 16px;'>{value}</span>
</button>

<style>
	button {
		color: black;
		font-size: 20px;
		padding: 15px;
		border: 1px solid black;
	}
</style>
