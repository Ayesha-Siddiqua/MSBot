

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

var DialogLabels = {
    Hotels: 'yes',

};

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Are you looking for a hotel? yes/no',
            [DialogLabels.Hotels],
            {
                maxRetries: 1,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {

            case DialogLabels.Hotels:
                return session.beginDialog('hotels');
        }
    }
]);


bot.dialog('hotels', require('./hotels'));


// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});