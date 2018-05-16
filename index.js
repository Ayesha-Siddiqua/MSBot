

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());


var inMemoryStorage = new builder.MemoryBotStorage();

// tracking the order and Vehicle.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to Order and Vehicle Tracker!");
        builder.Prompts.number(session, "How can I help you today. Please provide your dealer ID");
    },
    function (session, results) {
         session.dialogData.DealerID = results.response;
        var style = builder.ListStyle['button'];
        builder.Prompts.choice(session, "Are you looking to know the status of the recent order?", "Yes|No", { listStyle: style });


    },
    function (session, results) {
        session.dialogData.confirmation = results.response;

        if (results.response.entity == 'Yes'){
         builder.Prompts.text(session, "It is in Transit. Estimated delivery date is 01-01-2019 at 5 PM");
        }
	
		else {
			 builder.Prompts.text(session, "Thank you for using our service.. See you next time");
		}
           },

function (session, results) {
    
   var style = builder.ListStyle['button'];
       
        builder.Prompts.choice(session, "Do you want to track the vehicle?", "Yes|No", { listStyle: style });
},

function (session, results) {
    
 if (results.response.entity == 'Yes'){
         builder.Prompts.text(session, "ting");
        }
	
		else {
			 builder.Prompts.text(session, "Thank yoy for using our service.. See you next time");
		}
},

    function (session, results) {
        session.dialogData.reservationName = results.response;





        // Process request and display reservation details
       // session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]).set('storage', inMemoryStorage); // Register in-memory storage