<script>
  import { onMount } from 'svelte'
  import {upload_media, getProtectedImage} from './api.js';
  export let image_id;
  let image_url = null;
  //let image_url = null;
  let real_file_input;
  let name = 'Choose image';
  let button;
  function upload() {
          let file = real_file_input.files[0]
          name = file.name;
          const reader = (new FileReader());
          reader.readAsDataURL(file); 
          reader.onload = async () => {
                  let media_id = await upload_media(reader.result, name);
                  image_id = await media_id;
                  image_url = 'url(' + reader.result + ')';  // base64 encoding of selected file with mime-type prefix
          };
  };
  onMount(async () => {
          if (image_id!=0) {
                  image_url = await getProtectedImage( image_id );
                  button.style['background-image'] = await image_url;
                  alert(image_url.substring(1,10) + button.style['background-image'])
          }
  });
</script>


<input type='file' bind:this={real_file_input} on:change={upload} accept='image/*' style='display: none'>

<button bind:this={button} on:click={() => {real_file_input.click()}}>
	&nbsp;
	🖼
	&nbsp;
	<span style='font-size: 32px;'>↑</span>
	&nbsp;
	📷
	<br>
	<span style='font-size: 16px;'>{name}</span>
</button>

<style>
	button {
		color: black;
		font-size: 20px;
		padding: 15px;
		border: 1px solid black;
                background-size: cover;
	}
</style>
