<script>
        export let self = {deleted: false, id: 0, left: 100, top: 100, width: 200, height: 100}
        let click_pos;
        let old_self;
        function resize(e) {
                click_pos = {x:e.clientX, y:e.clientY}
                old_self = {...self};
                document.onmousemove = (e) => {
                                self.width = old_self.width + (e.clientX - click_pos.x);
                                self.height = old_self.height + (e.clientY - click_pos.y);
                }
                document.onmouseup = (e) => {document.onmousemove = null;}
        }
        function move(e) {
                click_pos = {x:e.clientX, y:e.clientY}
                old_self = {...self};
                document.onmousemove = (e) => {
                                self.left = old_self.left + (e.clientX - click_pos.x);
                                self.top  = old_self.top  + (e.clientY - click_pos.y);
                        }
                document.onmouseup = (e) => {document.onmousemove = null;}
                //pass
        }
        function del(e) {
                if (self.id!=0 && !confirm('This will trigger a card to be deleted on save.')) {
                        return
                }
                self.deleted = true;
                swallow(e)
        }
        function swallow(e) {
                e.stopPropagation()
        }
</script>

{#if !self.deleted}
<div style:position={'absolute'}
     style:top={self.top +'px'} style:left={self.left +'px'}
     style:width={self.width +'px'} style:height={self.height +'px'} >
     <button id='moveButton'   type='button' on:mousedown={move} on:click={swallow}>{self.width>45 && self.height>20 ? '✣ Move' : ''}</button>
     <button id='deleteButton' type='button' on:click={del}>✗ Del</button>
     <button id='resizeButton' type='button' on:mousedown={resize} on:click={swallow}>⤡</button>
</div>
{/if}

<style>
        #resizeButton {
                border-radius: 50%;
                position: absolute;
                top: calc(100% - 12px);
                left: calc(100% - 12px);
                width: 24px;
                height: 24px;
                padding: 2px 5px;
                border: 1px solid black;
        }
        #moveButton {
                width: 100%;
                height: 100%;
        }
        #deleteButton {
                position: absolute;
                left: calc(100% + 5px);
                top: calc(50% - 15px);
                height: 30px;
                width: 60px;
                color: red;
        }

</style>


