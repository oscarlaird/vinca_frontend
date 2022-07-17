<script>
  import { onMount } from 'svelte'
  import {upload_media, getProtectedImage} from './api.js';
  export let image_id;
  let image_url = null;
  let real_file_input;
  export let disabled = false;
  let name = 'Choose Image';
  let button;
  function upload() {
          let file = real_file_input.files[0]
          name = file.name;
          const reader = (new FileReader());
          reader.readAsDataURL(file); 
          reader.onload = async () => {
                  let media_id = await upload_media(reader.result);
                  image_id = await media_id;
                  image_url = 'url(' + reader.result + ')';  // base64 encoding of selected file with mime-type prefix
                  button.style['background-image'] = image_url
          };
  };
  onMount(async () => {
          if (image_id!=0) {
                  const image_url = await getProtectedImage( image_id );
                  button.style['background-image'] = 'url('+image_url+')'
          }
  });
</script>


<input type='file' bind:this={real_file_input} on:change={upload} accept='image/*' style='display: none'>

<button style:background-color={disabled ? 'lightgray' : 'white'} disabled={disabled} bind:this={button} on:click={() => {real_file_input.click()}}>
	&nbsp;
	🖼
	&nbsp;
	<span style='font-size: 32px;'>↑</span>
	&nbsp;
	📷
	<br>
	<span style='font-size: 16px;'>{disabled ? 'N/A' : name}</span>
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
