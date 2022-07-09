let unix_seconds = () => Math.floor(Date.now() / 1000);
const tz_offset = (new Date().getTimezoneOffset())*60; // number of seconds between here and GMT (getTimezoneOffset returns minutes)
let local_unix_seconds = () => unix_seconds() - tz_offset;
let local_unix_day = () => local_unix_seconds() / 86400.0; // 86400 seconds in a day

export { local_unix_day, unix_seconds }
