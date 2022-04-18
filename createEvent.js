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

    Sets default event start and end times. Default start time is the current date and time when the script is ran. Default end time is +1 hour from the start time.

*/

// Timeoffset will need to be changed if EST OR EDT (EDT IS DEFAULT -> -5 for EST)
const TIMEOFFSET = '-04:00';

const dateTimeForCalander = () => {
    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // end time is +1 hour from start time, you can change this by editing the +1 below.
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

/* Uncomment to show current start & end times. */
//console.log(dateTimeForCalander());





/*

    Create new Google Calendar event.

*/

// Function for creating new event.
const insertEvent = async (event) => {
    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`\nError at insertEvent function:\n${error}\n`);
        return 0;
    }
};

let dateTime = dateTimeForCalander();

// EDIT EVENT DETAILS HERE:
let event = {
    'summary': `Test Summary`,
    'description': `Test Description`,
    'start': {
        'dateTime': dateTime['start'], // If you do not want to use the default start time, change ['start'] to '2022-04-18T09:00:00-07:00' or whichever dates and times you want. Time is 24 hour.
        'timeZone': 'America/Kentucky/Louisville'
    },
    'end': {
        'dateTime': dateTime['end'], // If you do not want to use the default end time, change ['end'] to '2022-04-18T09:00:00-07:00' or whichever dates and times you want. Time is 24 hour.
        'timeZone': 'America/Kentucky/Louisville'
    }
};

// Calls the insertEvent function, will create an event based on the event details above.
insertEvent(event)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
