var builder = require('botbuilder');


module.exports = [
    // Destination
    function (session) {
        session.send('Welcome to the Hotels finder!');
        builder.Prompts.text(session, 'Please enter your destination');
    },
    function (session, results, next) {
        session.dialogData.destination = results.response;
        session.send('Looking for hotels in %s', results.response);
        next();
    },
function (session, results)
{ 
session.dialogData.deadpool=results.response;
session.send('Looking to stay for long term');
},



    // Check-in
    function (session) {
        builder.Prompts.time(session, 'When do you want to check in?');
    },
    function (session, results, next) {
        session.dialogData.checkIn = results.response.resolution.start;
        next();
    },

    // Nights
    function (session) {
        builder.Prompts.number(session, 'How many nights do you want to stay?');
    },
    function (session, results, next) {
        session.dialogData.nights = results.response;
        next();
    },

    // Search...
    function (session) {
        var destination = session.dialogData.destination;
        var checkIn = new Date(session.dialogData.checkIn);
        var checkOut = checkIn.addDays(session.dialogData.nights);

        session.send(
            'Ok. Searching for Hotels in %s from %d/%d to %d/%d...',
            destination,
            checkIn.getMonth() + 1, checkIn.getDate(),
            checkOut.getMonth() + 1, checkOut.getDate());

        
    }
];


Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};