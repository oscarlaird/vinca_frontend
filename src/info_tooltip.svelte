<script>
  import { onMount } from 'svelte';
  export let text;
  let tooltip;
  let tooltiptext;
  let innerWidth; // width of the whole window
  onMount(() => {
          // Do some gymnastics so that if the info icon
          // is on the edge of the screen the tooltip help
          // text will still be entirely on the screen
          // usually it is centered below info icon
          const rect = tooltip.getBoundingClientRect()
          const left_margin=rect.left
          const right_margin=innerWidth - rect.right
          if (left_margin < 120) {
                tooltiptext.style['margin-left'] = '-'+left_margin+'px';
          } else if (right_margin < 120) {
                tooltiptext.style['margin-left'] = '-'+(240 - right_margin)+'px';
          } else {
                tooltiptext.style['margin-left'] = '-120px';
          }


  });
</script> 

<div class="tooltip" bind:this={tooltip}>
	<span class='question_mark'>?</span>
        <span class="tooltiptext" bind:this={tooltiptext} >{@html text}</span>
</div>

<svelte:window bind:innerWidth  />

<style>
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
	border: 1px solid black;
	height: 24px;
	width: 24px;
	border-radius: 50%;
	text-align: center;
  vertical-align: middle;
}
	
	.question_mark {
		font-size: 1.4em;
	}

/* Tooltip text */
.tooltiptext {
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
	
  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.5s;
	
  width: 240px;
  top: 100%;
  left: 50%;
	margin-top: 10px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
	font-size: 1em;
} 
</style>
