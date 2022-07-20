<script>
  import Home from './home.svelte';
  import Edit from './edit.svelte';
  import Review from './review.svelte';
  import Login from './login.svelte';
  import { username, card_to_edit, card_to_preview, card_to_review } from './state.js'

  if (!$username) {username.set('guest')}  // Logs in as guest if we aren't logged in

  $: component = (!$username) ? Login  : ($card_to_preview   ) ? Review : ($card_to_edit      ) ? Edit   : ($card_to_review    ) ? Review : Home;

</script>

<body>
{#key [$card_to_review, $username]}
  <svelte:component this={component} />
{/key}
</body>

<style>
  body {
    background-color: #CAE3CD;
    border: 1px solid black;
    min-height: 100%;
    height: fit-content;
  }
</style>
