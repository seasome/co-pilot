const builder = require('botbuilder');
const builderTeams = require('botbuilder-teams');
const restify = require('restify');
const connector = new builderTeams.TeamsChatConnector(
    {
        appId: "d589b12c-f0a2-47dd-861e-85dc41feb629",
        appPassword: "feplf854|;#zyLAHASEF58="
    });

const bot = new builder.UniversalBot(connector)
    .set('storage', new builder.MemoryBotStorage());

const dialog = new builder.IntentDialog();

dialog.matches(/^getchannels/i, [
    function (session, args, next) {
        connector.fetchChannelList(
            session.message.address.serviceUrl,
            session.message.sourceEvent.team.id,
            (err, result) => {
                if (err) {
                    session.endDialog(JSON.stringify(err));
                }
                else {
                    session.send('Here are the matching channels');
                    session.endDialog(JSON.stringify(result));
                }                
            }
        )
    }
]);

dialog.matches(/^aboutme/i, [
    function (session, args, next) {
        console.log(session);
        var conversationId = session.message.address.conversation.id;
        connector.fetchMembers(
            session.message.address.serviceUrl,
            conversationId,
            (err, result) => {
                if (err) {
                    session.endDialog(JSON.stringify(err));
                }
                else {
                    session.endDialog(JSON.stringify(result));
                }
            }
        );
    }
]);

bot.dialog('/', dialog);

const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(3978);