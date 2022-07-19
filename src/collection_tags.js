import { get_collection_tags } from './api.js';
import { writable } from 'svelte/store';

const collection_tags = writable([])

async function load_tags() {
  const loaded_tags = await get_collection_tags();
  collection_tags.set(loaded_tags);
};

load_tags()

export { collection_tags }
