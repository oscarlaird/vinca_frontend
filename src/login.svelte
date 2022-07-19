<script>
        import { onMount } from 'svelte'
        import { get_users_list, get_token, register_and_get_token } from './api.js';
        import { username } from './state.js'
	let users = [];
        let typed_username = '';
	let password = '';
	let register_or_login = 'login';
        let failed_login = false;
        let password_box; let username_box;
	$: user_exists = users.includes(typed_username);
	$: login_possible = user_exists && password.length > 2;
	$: register_possible = !user_exists && typed_username.length > 2 && password.length > 2;
	$: submit_possible = register_or_login==='login'&&login_possible ||
		                   register_or_login==='register'&&register_possible;
	$: warning = "user does not exist!".repeat(register_or_login==='login' && !user_exists && typed_username.length > 2) + 
						 	"username is already taken!".repeat(register_or_login==='register' && user_exists && typed_username.length > 2);
        onMount(async () => {
                users = await get_users_list();
                username_box.focus();
        });
        async function login() {
                const success = await get_token(typed_username, password);
                if (success) {
                  username.set(typed_username);
                } else {
                  failed_login = true;
                  password = '';
                  password_box.focus()
                }
        }
        async function register() {
                const success = await register_and_get_token(typed_username, password)
                if (success) {
                        username.set(typed_username)
                } else {
                        alert('registration failed')
                }
        }
        function submit() {
                if (register_or_login==='login') {
                        login()
                } else {
                        register()
                }
        }
        let submit_button;
        function handleKeydown(event) {
                if (event.key!=='Enter') return;
                event.preventDefault()
                submit_button.click()
        }

</script>


<body>
{warning}
<input class='entry' bind:this={username_box} type='text' placeholder='Username' bind:value={typed_username}>
<input class='entry' bind:this={password_box} type='password' placeholder='Password' bind:value={password} on:keydown={handleKeydown}>

{#if register_or_login==='login' && failed_login}
        <center style="color: darkred">Incorrect Password</center>
{/if}

<div id='bottom_row'>
	<label><input type='radio' name='rol' value='login' bind:group={register_or_login}> LOGIN</label>
	<label><input type='radio' name='rol' value='register' bind:group={register_or_login}> REGISTER</label>
        <input type='submit' bind:this={submit_button} value={register_or_login} disabled={!submit_possible} style:border={submit_possible ? '1px solid black' : ''} on:click={submit}>
</div>
<br><center><button type='button' on:click={() => {username.set('guest')}}>continue as guest</button></center>
</body>

<style>
	.entry {
		display: block;
		width: 100%
	}
	label {
		margin: auto 0;
		font-size: 14px;
	}
	#bottom_row {
		display: grid;
		grid-template-columns: 30% 40% 30%;
	}
	body {
		background-color: #DECEDE;
		border: 1px solid black;
		max-width: 300px;
		max-height: 300px;
		margin: auto auto;
                position: absolute;
                top: calc(50% - 150px);
                left: calc(50% - 150px);
		
	}
</style>
