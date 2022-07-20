import { writable, derived } from 'svelte/store';
import { card_to_review } from './state.js';

export const filters = writable({
                                 deleted: false, search: '',
                                 due: null, new: null,
                                 images: null, audio: null,
                                 tag: null, card_type: '',
                                 created_after: null, created_before: null,
                                 due_after: null, due_before:  null,
                        });

export const sort = writable('recent')

