<script>
        import { onMount } from 'svelte'
        import { getProtectedImage, getOcclusionData } from './api.js'
        export let card;
        export let flipped;
        let occlusion_data;
        let occludedImage;
        onMount( async () => {
                occlusion_data = await getOcclusionData(card.back_image_id)
                const image_url = await getProtectedImage(card.front_image_id)
                occludedImage.style['background-image'] = 'url(' + image_url + ')'
        });
</script>

{#if occlusion_data}
<div id='occludedImage' bind:this={occludedImage} style:width={occlusion_data.box.width+'px'} style:height={occlusion_data.box.height+'px'}>
  {#each occlusion_data.rectangles as rect}
          {#if !rect.deleted}
            <div style="position: absolute; top: {rect.top}px; left: {rect.left}px;
                    width: {rect.width}px; height: {rect.height}px;
                    background-color: {card.id===rect.id         ? 'transparent' :
                                        !occlusion_data.hide_all ? 'rgba(70,70,70,0.2)' :
                                                                   'rgba(70,70,70,1)'};
                    border: 5px solid {!(card.id===rect.id) ? 'black' : flipped ? 'green' : 'red'}">
            </div>
          {/if}
  {/each}
</div>
{:else}
Loading...
{/if}

<style>
        #occludedImage {
                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
                padding: 0px;
                position: relative;
        }
</style>



