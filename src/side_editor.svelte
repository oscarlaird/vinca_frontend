<script>
    import Editor from './text_editor.svelte';
	import Audio from './audio_picker.svelte';
	import Image from './image_picker.svelte';
	export let text;
        export let image_id;
        export let audio_id;
	export let audio_file;
	export let image_file;
	export let placeholder;
        export let image_picker_disabled;
</script>

<div id='main'>
	<Editor bind:value={text} bind:placeholder></Editor>
	<div id='media'>
      <Audio></Audio>
      <Image bind:image_id disabled={image_picker_disabled}></Image>
	</div>
</div>

<style>
	#media {
		display: grid;
        margin: 5px;
	}
	#main {
		display: grid;
		grid-template-columns: auto minmax(100px,150px);
	}
</style>
