<script>
    import OcclusionReviewer from './occlusion_reviewer.svelte'
    import { onMount } from 'svelte';
    import { unix_seconds, local_unix_day } from './unix_day.js';
    import { dummy_card } from './card_templates.js'
    import { hypothetical_due_dates, commit_grade, commit_changes, getProtectedImage } from './api.js';
    export let card;
    export let preview = false;
    export let state;
    export let card_edited_alert;
    let current_time = local_unix_day();
    let review_stop;
    let back_img;
    let front_img;
    let flipped = preview; //we are done clicking and should see the grading buttons
    let verses_line_no = 1;
    let verses_lines = card.front_text.split('\n')
    let hypo_due_dates = {again: 0, hard: 10, good: 15, easy: 25};
    onMount(async () => {
            hypo_due_dates = await hypothetical_due_dates(card.id, current_time);
            state.review_start = unix_seconds();
            if (card.front_image_id!=0) {
                    const image_url = await getProtectedImage(card.front_image_id);
                    front_img.src = image_url;
            }
            if (card.back_image_id!=0 && card.card_type!='occlusion') {
                    back_img.src = await getProtectedImage(card.back_image_id);
            }

    });
    function delete_card() {
            card.visibility = 'deleted';
            commit_changes(card);
            card_edited_alert = true;
            quit();
    }
    function quit() {
            if (state.preview_mode) {
                    state.preview_mode = false;
                    state.card_to_preview = null;
            } else {
                    state.reviewing = false;
                    state.card_to_review = null;
            }
    }
    function edit() {
            state.edit_mode = true;
            state.card_to_edit = card;
            if (state.preview_mode) {
                    quit()
            }

    }
    async function grade(grade) {
            // postpone the card while we figure out what the
            // real due date is. This lets the reviewer continue
            // to the next card while we figure it out.
            card.due_date = (current_time + 1);
            
            review_stop = unix_seconds();
            var elapsed = review_stop - state.review_start;

            await commit_grade(card.id, grade, elapsed);
            card.due_date = hypo_due_dates[grade];
            await commit_changes(card);


            // TODO set the due_date equal to the hypothetical and push to the server
            state.card_to_review = null;
            flipped = false;
    }
    function flip() {
            if (card.card_type==='basic' || card.card_type==='occlusion') {
                    flipped = true;
            } else if (card.card_type==='verses') {
                    verses_line_no++
                    flipped = (verses_line_no===verses_lines.length)
            }
    }
    function default_action() {
            if (!flipped) {
                    flip()
            } else {
                    //grade('good');
            }
    }
    function handleKeydown(event) {
        //let char = (typeof event !== 'undefined') ? String.fromCharCode(event.keyCode) : event.which
        const char = event.key;
        if (char==='e') {
                edit()
        } else if (char==='b' || char=='q') {
                quit()
        } else if (char==='d') {
                delete_card()
        } else if (char===' ') {
                default_action()
        } else if (char === '1') {
                grade('again');
        } else if (char === '2') {
                grade('hard');
        } else if (char === '3') {
                grade('good');
        } else if (char === '4') {
                grade('easy');
        }
    }


</script>

<svelte:window on:keydown={handleKeydown}/>

<body on:click={default_action}>

<div id='buttons_bar'>
{#if flipped}
        <div id='manage_buttons_bar'>
        <button class='manage_button' on:click={edit}><u>e</u>dit</button>
        <button class='manage_button' on:click={quit}>⏎ {@html preview ? '<u>b</u>ack' : '<u>q</u>uit'}</button>
        <button class='manage_button' on:click={delete_card}>✕ <u>d</u>elete</button>
        </div>
{/if}
{#if flipped && !preview}
        <div id='grade_buttons_bar'>
                {#if hypo_due_dates}
                {#each [['again',1], ['hard',2], ['good',3], ['easy',4]] as [grade_val, num]}
                        <button class='grade_button' on:click|stopPropagation={() => grade(grade_val)}>
                                {grade_val} ({num})<br>
                                <span style='font-size: 12px'>+{Math.floor(hypo_due_dates[grade_val]) - Math.floor(current_time)} days</span>
                </button>
                {/each}
                {/if}
        </div>
{/if}
</div>

{#if card.card_type==='basic' || preview}
  {@html card.front_text.replace(/\n/g,'<br>')}
{:else if card.card_type==='verses'}
  {#each verses_lines.slice(0,verses_line_no) as line}
          {line}<br>
  {/each}
{/if}

<br><br>
{#if !flipped}
        <button id='flipper' type='button' on:click={flip} autofocus>
                {card.card_type==='verses' ? 'Next Line' : 'Flip'}<br>
                <span style='font-size: 14px'>(click anywhere)</span>
        </button>
{/if}

{#if card.card_type!='verses' && flipped}
        <div id='backside'>
                <br>
                {@html card.back_text.replace('\n','<br>')}
        </div>
{/if}

{card.tags}
<hr>

{#if card.back_image_id!=0 && flipped && !card.card_type==='occlusion'}
        <center><img bind:this={back_img} /></center>
{/if}
{#if card.front_image_id!=0 && (card.back_image_id===0 || preview || !flipped) && !card.card_type==='occlusion'}
        <center><img bind:this={front_img} /></center>
{/if}


{#if card.card_type==='occlusion' && card.front_image_id}
        <OcclusionReviewer bind:card bind:flipped />
{/if}


</body>

<style>
	#flipper {
		padding: 6px 12px;
		font-size: 1.3em;
	}
	img {
		display: inline;
                max-width: 500px;
	}
	#buttons_bar {
                width: 94vw;
                bottom: 10px;
                position: fixed;
                left: 3vw;
	}
	#grade_buttons_bar {
                display: grid;
		grid-template-columns: auto auto auto auto;
                gap: 1%;
	}
	#manage_buttons_bar {
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 1%;

	}
	.grade_button {
	}
	.manage_button {
	}
        body {
                min-height: 100%;
        }
</style>

