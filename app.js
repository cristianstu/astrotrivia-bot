import 'dotenv/config';
import express from 'express';
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions';

import { PORT, PUBLIC_KEY } from './constants.js';
import { getRandomEmoji } from './utils.js';
import { addReaction, askQuestion } from './commands/question.js';
import { createPoll, endPoll } from './commands/survey.js';

const app = express();

const games = {}

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), function (req, res) {
  console.log('############## - interaction');
  const { type, data } = req.body || {};
  console.log({ type, data });

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }

    // "pregunta" command
    if (name === 'pregunta') {
      const question = askQuestion(req, games);
      console.log(question);
      return res.send(question);
    }

    if (name === 'encuesta') {
      const question = createPoll(req, games);
      console.log(question);
      return res.send(question);
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    console.log('############## - message component');
    const customId = req.body.data.custom_id;
    const [,answer] = customId.split('|');

    if (answer === 'end-poll') {
      const response = endPoll(req, games);
      return res.send(response);
    } else {
      const reaction = addReaction(req, games);
      console.log({ reaction });
      return res.send(reaction);
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
