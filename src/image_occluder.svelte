<script>
  import {upload_media, getProtectedImage} from './api.js';
  import { onMount } from 'svelte'
  import Rectangle from './rectangle.svelte'
  export let data;
  let occlusionImage;
  let resize_tracking = false;
  export let image_id;
  let image_url = null;
  let real_file_input;

  let resizer;
  let click_pos;
  let old_dimensions;
  function resize(e) {
        click_pos = {x:e.clientX, y:e.clientY}
        old_dimensions = {width:data.box.width, height:data.box.height}
        document.onmousemove = (e) => {
                        data.box.width  = old_dimensions.width  + (e.clientX - click_pos.x);
                        data.box.height = old_dimensions.height + (e.clientY - click_pos.y);
        }
        document.onmouseup = (e) => {document.onmousemove = null;}
  }

  function upload() {
          let file = real_file_input.files[0]
          const reader = (new FileReader());
          reader.readAsDataURL(file); 
          reader.onload = async () => {
                  let media_id = await upload_media(reader.result);
                  image_id = await media_id;
                  image_url = 'url(' + reader.result + ')';  // base64 encoding of selected file with mime-type prefix
                  occlusionImage.style['background-image'] = image_url
          };
  };

  onMount(async () => {
          if (image_id!=0) {
                  image_url = await getProtectedImage( image_id );
                  occlusionImage.style['background-image'] = 'url('+image_url+')';
          }
  });
  const default_rectangle = {id: 0,  top: 50, left: 50, height: 100, width: 200, deleted:false}
  function new_rectangle() {
          //push a rectangle to the shapes list
          //link it to a real card
          var new_rect = {...default_rectangle}
          data.rectangles.push(new_rect)
          data.rectangles = data.rectangles;
  }
</script>


<input type='file' bind:this={real_file_input} on:change={upload} accept='image/*' style='display: none'>

<center><button type='button' on:click={new_rectangle} > + new rectangle</button>
        <label style:display='inline'><input type="radio" value={true}  name="hide" bind:group={data.hide_all} /> Hide All </label>
        <label style:display='inline'><input type="radio" value={false} name="hide" bind:group={data.hide_all} /> Hide One </label>
</center>


<button class='occlusionImage' on:click={real_file_input.click()} style:width={data.box.width+'px'} style:height={data.box.height+'px'} bind:this={occlusionImage}>
        {#each data.rectangles as rectangle}
                <Rectangle bind:self={rectangle} />
        {/each}
        <button bind:this={resizer} class='imageSizer' on:mousedown={resize} on:click={(e) => {e.stopPropagation()}}>⤡ Resize</button>
        {#if !image_id}Click to Upload an Image{/if}
</button>



<style>
        .occlusionImage {
                border: 1px solid black;
                position: relative;
                padding: 0px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
                overflow: clip;
        }
        .imageSizer {
                left: calc(100% - 1em);
                top: calc(100% - 1em);
                display: block;
                position: absolute;
                padding: 10px;

        }

</style>
