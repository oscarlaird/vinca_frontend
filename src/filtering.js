import { local_unix_day } from './unix_day.js'

function filter_card(filters, card) {
return ((card.visibility != 'purged') &&
        //(!filters['search']        || card.front_text.includes(filters['search']) || card.back_text.includes(filters['search'])) &&
        (filters['deleted']===null || filters['deleted']===(card.visibility==='deleted')) &&
        // TODO local_unix_day is reevaluated for each card --performance
        (filters['due']===null     || filters['due']    ===(card.due_date < local_unix_day())) &&
        (filters['new']===null     || filters['new']    ===(card.due_date===card.create_date)) &&
        (filters['images']===null  || filters['images'] ===(card.front_image_id!=0 || card.back_image_id!=0)) &&
        (filters['audio']===null   || filters['audio']  ===(card.front_audio_id!=0 || card.back_audio_id!=0)) &&
        (!filters['card_type']     || filters['card_type'] === card.card_type) &&
        (!filters['created_after'] || (new Date(filters['created_after']))/24/60/60/1000 < card.create_date) &&
        (!filters['created_before']|| (new Date(filters['created_before']))/24/60/60/1000 > card.create_date) &&
        (!filters['due_after']     || (new Date(filters['due_after']))/24/60/60/1000 < card.due_date) &&
        (!filters['due_before']    || (new Date(filters['due_before']))/24/60/60/1000 > card.due_date) &&
        (!filters['tag']           || card.tags.includes(filters['tag'])) &&
         true )
}

// if we are reviewing find out the next card to study
function get_next_due_card(filtered_cards) {
        //TODO use the top card in the list
        if (filtered_cards.length===0) { return null };
//sort to get soonest due
  filtered_cards.sort((card1,card2) => {return card1.due_date - card2.due_date})
  var soonest_card = filtered_cards[0];
  // return the soonest card if it is due,
  // otherwise return null because no cards are due
 if (soonest_card.due_date < local_unix_day()) {
         return soonest_card
 } else {
         alert('Congratulations Student. There are no more due cards.')
         return null
 }
}

export { filter_card, get_next_due_card }
