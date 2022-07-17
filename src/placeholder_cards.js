
function get_basic_placeholder() {
        return {front: 'Question', back: 'Answer'}
};

function get_verses_placeholder() {
        return {front: "To be or not to be, that is the question:  \n" +
                       "Whether 'tis nobler in the mind to suffer  \n" +
                       "The slings and arrows of outrageous fortune\n" +
                       "Or to take arms against a sea of troubles  \n" +
                       "And by opposing, end them.",
                back: ''
        }
};

function get_occlusion_placeholder() {
        return {front: "- Text entered when the cards are created will be shared between all cards. \n" +
                       "- Afterwards each card's front and back text can be edited individually.",
                back:  ''}
}

function get_placeholder(card_type) {
        return card_type==='basic'  ? get_basic_placeholder()  :
               card_type==='verses' ? get_verses_placeholder() : get_occlusion_placeholder()

}

export { get_placeholder }
