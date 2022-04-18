/*

    Config & Setup

*/

const fs = require('fs');
const {google} = require('googleapis');
require('dotenv').config();

// Credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// API
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);




// Event ID can be changed here. You can get this value from running "event-id.js".
const eventId = "123";




const updateDesc = async (eventIDs) => {
    try {
        let response = await calendar.events.patch({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
            resource: {
                description: "Updated Description"
              }
        });
    } catch (error) {
        console.log(`Error at updateDesc --> ${error}`);
        return 0;
    }
};

updateDesc()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });