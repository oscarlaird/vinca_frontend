
let new_card = {id: 0, front_text: '', back_text: '',
                visibility: 'visible', tags: '', card_type: 'basic', is_due: true,
                create_date: 10.0, due_date: 10.0,
                front_image_id: 0, back_image_id: 0, front_audio_id: 0, back_audio_id: 0};

let dummy_card = {...new_card, front_text: 'loading...'};

export { new_card, dummy_card }
