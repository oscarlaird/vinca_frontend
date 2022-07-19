import { writable, derived } from 'svelte/store';
import { get_next_two_due, get_due_count, get_created_count } from './api.js';
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


export const due_count =   derived(filters,
                                 async (filters, set) => {set(await get_due_count())},
                                 '-' //default
                         )

export const created_count = derived(filters,
                                 async (filters, set) => {set(await get_created_count())},
                                 '-' //default
                         )

export const next_two_due = derived([filters, sort, card_to_review],
                async (params, set) => { const ntd = await get_next_two_due(); set(ntd); },
                [null, null]
        )
