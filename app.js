import 'dotenv/config';
import express from 'express';
import { InteractionResponseType, InteractionType, verifyKeyMiddleware } from 'discord-interactions';

import { PORT, PUBLIC_KEY } from './constants.js';
import { getRandomEmoji } from './utils.js';
import { addReaction, askQuestion } from './commands/question.js';

const app = express();

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
      const question = askQuestion(req);
      return res.send(question);
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    console.log('############## - message component');
    // console.log(req.body);
    const reaction = addReaction(req);

    return res.send(reaction);
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
