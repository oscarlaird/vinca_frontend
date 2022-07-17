import { local_unix_day } from './unix_day.js'
// export error variables so we can show the
// user if and how the server fails
let error = {active: false, code: null, message: ''};

function random_id() {
        // returns a random 15 digit id
        // We don't want to go beyond this because javascript only supports 56bit ints.
        return String(Math.floor(Math.random() * 1000000000000000))
}

function default_options() {
  return {
    method: 'POST',
    mode: 'cors',
    headers: {'content-type': 'application/json', 'Authorization': 'Bearer '+window.localStorage.getItem('access_token')}
  }
};

// metadata is needed for edits and reviews
// it specifies the date and the number of seconds that it took to edit or review

async function get_users_list() {
        var url = new URL('http://localhost:8000/auth/users_list');
        var options = default_options()
        options.method = 'GET';
        const response = await fetch(url, options);
        return response.json();
}

async function get_token(username, password) {
        var url = new URL('http://localhost:8000/auth/token');
        var fd = new FormData();
        fd.append('username', username)
        fd.append('password', password)
        const options = {
          method: 'POST',
          mode: 'cors',
          body: fd,
        }
        var success = null;
        const response = await fetch(url, options)
          .then((r) => {
                  success = r.ok; // record if our token request was sucessful
                  return r; // pass on response to error handler
          })
          .then(handle_error_response)
          .catch(fetch_error_handler);
        if (success) {
                var token = await response.json();
                window.localStorage.setItem('access_token', token.access_token)
                window.localStorage.setItem('username', username)
                return true
        } else {
                return false
        }
}

async function register_and_get_token(username, password) {
        var url = new URL('http://localhost:8000/auth/register');
        var options = default_options()
        options.body = JSON.stringify( {username: username, password: password} )
        var success = null;
        const response = await fetch(url, options)
          .then((r) => {
                  success = r.ok; // record if our token request was sucessful
                  return r; // pass on response to error handler
          })
          .then(handle_error_response)
          .catch(fetch_error_handler);
        if (success) {
                var token = await response.json();
                window.localStorage.setItem('access_token', token.access_token)
                window.localStorage.setItem('username', username)
                return true
        } else {
                return false;
        }
}


async function commit_changes(card, seconds = 0) {
  const url = new URL('http://localhost:8000/commit_card');
  const metadata = {seconds: seconds, date: local_unix_day()}
  const payload = {
          card: card,
          metadata: metadata,
  }
  let options = default_options();
  options.body = JSON.stringify( payload );
  fetch(url, options)
    .then(handle_error_response)
    .then(response => {
          const server_card = response.json();
          // update card to match server_card. Especially important is that the id of a new card is updated.
          for (var key in server_card) {
                  card[key] = server_card[key]
          }
    })
    .catch(fetch_error_handler);
}

function fetch_error_handler(error) {
        alert('Internet Problem: ' + error.message)
}
function handle_error_response(response) {
    if (response.ok) {
            return response // pass on response for processing
    } else {
        throw new Error(response.status + ':  ' + response.statusText)
    }
}

async function commit_grade(card_id, grade, seconds) {
    const review_params = {
            card_id: card_id,
            grade: grade,
    };
    const metadata = {seconds: seconds, date: local_unix_day()}
    const payload = {review: review_params, metadata: metadata}
    let options = default_options();
    options.body = JSON.stringify( payload );
    var url = new URL('http://localhost:8000/review');
    fetch(url, options)
      .then(handle_error_response)
      .catch(fetch_error_handler);
}

async function upload_media(content, base64=true) {
        let options = default_options();
        options.body = JSON.stringify( {content: content, base64: base64} );
        var url = new URL('http://localhost:8000/upload_media')
        var media_id = null;
        const r = await fetch(url, options)
          .then(handle_error_response)
          .catch(fetch_error_handler);
        const json = await r.json();
        media_id = await json.media_id;
        return media_id
}

async function set_guest_user() {
        if (!window.localStorage.getItem('username')) {
                window.localStorage.setItem('username','guest')
                window.localStorage.setItem('access_token','guest123')
        }
}

async function fetch_cardlist(filters, sort) {
        var options = default_options();
        const url = new URL('http://localhost:8000/cardlist');
        const faux_filters = {deleted: null};
        const payload = {crit: {sort: sort}, filters: filters}
        options.body = JSON.stringify( payload )
        const response = await fetch(url, options)
              .then(handle_error_response)
              .catch(fetch_error_handler);
        return response.json();
}

async function hypothetical_due_dates(card_id, date) {
        const url = new URL("http://localhost:8000/hypothetical_due_dates")
        url.search = new URLSearchParams({card_id: card_id, date: date})
        var options = default_options()
        options.method = 'GET';
        const response = await fetch(url, options);
        const hypo_due_dates = await response.json();
        return hypo_due_dates;
}

async function get_collection_tags() {
        const url = new URL("http://localhost:8000/collection_tags")
        var options = default_options()
        options.method = 'GET';
        const response = await fetch(url, options);
        return response.json();
}

async function fetchWithAuthentication(url) {
  const headers = new Headers();
  var options = default_options();
  options.method = 'GET';
  const response = await fetch(url, options);
  return response
}

async function getProtectedImage( media_id) {
  // Fetch the image.
  const url = ("http://localhost:8000/get_media?media_id=" + media_id)
  const response = await fetchWithAuthentication( url );

  // Create an object URL from the data.
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  return objectUrl
  // Update the source of the image.
}

async function getOcclusionData( media_id ) {
        // Occlusion cards store their data in plaintext JSON format
        // In a media record referenced by back_image_id
        // We can do this because occlusion cards don't need back images
        
        // Fetch the image.
        const url = ("http://localhost:8000/get_occlusion_data?media_id=" + media_id)
        const response = await fetchWithAuthentication( url );
        const json = await response.json();
        return JSON.parse(json)
}

async function purge(filters) {
        const url = new URL("http://localhost:8000/purge");
        var options = default_options();
        options.body = JSON.stringify( filters );
        const response = await fetch(url, options);
}

export { random_id, getOcclusionData, purge, get_collection_tags, hypothetical_due_dates, register_and_get_token, fetch_cardlist, set_guest_user, get_users_list, upload_media, commit_changes, commit_grade, error, getProtectedImage, get_token }
