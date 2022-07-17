import { local_unix_day } from './unix_day.js'

function new_card() {
        const current_time = local_unix_day()
        return {id: 0,
                front_text: '', back_text: '',
                visibility: 'visible', card_type: 'basic', scheduler: 'basic',
                tags: '',
                merit: 6,
                create_date: current_time, due_date: current_time,
                last_review_date: current_time, last_edit_date: current_time,
                review_seconds: 0, edit_seconds: 0, total_seconds: 0,
                front_image_id: 0, back_image_id: 0, front_audio_id: 0, back_audio_id: 0};
}

function dummy_card() {
        return dummy_card ={...new_card(), front_text: 'loading...'};
}

export { new_card, dummy_card }
