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

/*

    Query for event by title/summary, returns the id of the event(s) found. 
    MAKE SURE THE EVENT TITLE/SUMMARY IS UNIUE OR MULTIPLE ID's WILL BE RETURNED.

*/

const getEvents = async (summary) => {
    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            q: summary
        });
    
        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

// Event name that will be searched for. Change this to change the event id.
let summary = 'Lorem (1)';


getEvents(summary)
    .then((res) => {
        let id = res.map( (item) => item.id);
        console.log(id.toString());
    });