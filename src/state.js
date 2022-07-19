import { writable } from 'svelte/store'

export const card_to_edit    = writable(null);
export const card_to_preview = writable(null);
export const card_to_review  = writable(null);

export const edit_mode    = writable(false);
export const reviewing    = writable(false);

export const review_start = writable(null);

export const username = writable(window.localStorage.getItem('username'));

username.subscribe((val) => {
        if (val === window.localStorage.getItem('username')) {return}
        if (val === 'guest') {
                // create a cached guest access token
                const random_id = String(Math.floor(Math.random() * 10000000))
                window.localStorage.setItem('access_token','guest'+random_id);
        }
        window.localStorage.setItem('username', val); // keep local storage in sync
});
