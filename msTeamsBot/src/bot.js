'use strict';

module.exports.setup = function(app) {
    var builder = require('botbuilder');
    var teams = require('botbuilder-teams');
    var config = require('config');
    var superagent = require('superagent');


    if (!config.has("bot.appId")) {
        // We are running locally; fix up the location of the config directory and re-intialize config
        process.env.NODE_CONFIG_DIR = "../config";
        delete require.cache[require.resolve('config')];
        config = require('config');
    }
    // Create a connector to handle the conversations
    var connector = new teams.TeamsChatConnector({
        // It is a bad idea to store secrets in config files. We try to read the settings from
        // the config file (/config/default.json) OR then environment variables.
        // See node config module (https://www.npmjs.com/package/config) on how to create config files for your Node.js environment.
        appId: config.get("bot.appId"),
        appPassword: config.get("bot.appPassword")
    });
    
    var inMemoryBotStorage = new builder.MemoryBotStorage();
    
    // Define a simple bot with the above connector that echoes what it received
    var bot = new builder.UniversalBot(connector, function(session) {
        // Message might contain @mentions which we would like to strip off in the response
        var text = teams.TeamsMessage.getTextWithoutMentions(session.message);

        var conversation_type = session.message.address.conversation.conversationType;

        if(conversation_type == 'personal'){
            console.log("one-one with the bot");

            var expert = {
                    "unity":  {
                        "name": "Jenny",
                        "team" : "GameDev",
                        "shortText": "Jenny loves to build AR applications using unity. you can reach her at jenny@copilot.xyz"
                    },
                    "python":  {
                        "name": "alberto",
                        "team" : "DataScience",
                        "shortText": "Alberto loves playing with data and graphs. you can reach her at jenny@copilot.xyz"
                    }
            }

            if(text.includes("expert")|| text.includes("suggestions") || text.includes("advice") || text.includes("suggestion") || text.includes("guide") || text.includes("help"))
            {   
                if(text.includes("unity") )
                    session.send('Unicorn - Jenny');
                else if(text.includes("python"))
                    session.send('alberto');
            }else{

                session.send("sorry i dont know how to process your request. I still  need to learn");
            }
            
            

        }else{
            console.log("we are in a group");
            // this gets you the team id
            var teamId = session.message.sourceEvent.team.id;

            var conversationId = session.message.address.conversation.id;

            console.log("TeamId", teamId);

            // fetch members of a team
            connector.fetchMembers(session.message.address.serviceUrl, conversationId, function (err, result) {
                if (err) {
                    console.log('There is some error');
                }
                else {
                    console.log(JSON.stringify(result));
                }
            });    

            // fetch channels in a team
            connector.fetchChannelList(session.message.address.serviceUrl, teamId, function (err, result) {
                if (err) {
                    console.log('There is some error');
                }
                else {
                    console.log(JSON.stringify(result));
                }
            });


            //fetch team info
            connector.fetchTeamInfo(session.message.address.serviceUrl, teamId, function (err, result) {
                if (err) {
                    console.log('There is some error');
                }
                else {
                    console.log(JSON.stringify(result));
                }
            });

            superagent.get('http://localhost:9999/api')
            .end((err, res) => {
            if (err) { return console.log(err); }
                console.log(res.body);
            if(res){
                console.log(res.body);
                session.send('You said: %s', res.body[0] + "\n" + res.body[1] + "\n" + res.body[2]);
            }
            });

            
        }


        

        

        /*
        superagent.get('https://api.nasa.gov/planetary/apod')
            .query({ api_key: 'NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo', date: '2017-08-02' })
            .end((err, res) => {
            if (err) { return console.log(err); }
            console.log(res.body.url);
            console.log(res.body.explanation);
            });*/

            /*superagent
            .post('https://lightai.azurewebsites.net/qnamaker/knowledgebases/09893d55-6a0b-4a91-b9ab-3e934799d697/generateAnswer')
            .send({ question: 'what is your age'})
            .set('EndpointKey', '66bb5b9-33f7-4a77-9ad1-aa64fea0d55a')
            .set('Accept', 'application/json')
            .then(res => {
               alert('yay got ' + JSON.stringify(res.body));
            });*/


            


        
        
    }).set('storage', inMemoryBotStorage);

    // Setup an endpoint on the router for the bot to listen.
    // NOTE: This endpoint cannot be changed and must be api/messages
    app.post('/api/messages', connector.listen());

    // Export the connector for any downstream integration - e.g. registering a messaging extension
    module.exports.connector = connector;
};
