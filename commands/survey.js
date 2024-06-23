import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";

import { discordRequest } from "../utils.js";
import { Game } from "./game.js";

export function createPoll(req, games) {
  console.log('############## - createPoll');
  // Pick random questions
  const game = new Game({
    mode: 'poll',
    createdBy: req.body.member.user.id,
  });
  const question = game.question
  const gameId = game.id;
  games[gameId] = game;
  const userId = req.body.member.user.id;

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Pregunta lanzada por <@${userId}>`,
      poll: {
        question: { text: question.text },
        answers: [
          { poll_media: { text: question.options['A'], emoji: { name: '🇦', id: null } } },
          { poll_media: { text: question.options['B'], emoji: { name: '🇧', id: null } } },
          { poll_media: { text: question.options['C'], emoji: { name: '🇨', id: null } } },
          { poll_media: { text: question.options['D'], emoji: { name: '🇩', id: null } } },
        ],
        duration: 1,
        allow_multiselect: false,
      },
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|end-poll`,
              label: 'Finalizar (solo creador)',
              style: ButtonStyleTypes.PRIMARY,
            }
          ],
        },
      ],
    },
  }
}

export function endPoll(req, games) {
  console.log('############## - endPoll');
  const customId = req.body.data.custom_id;
  const gameId = customId.split('|')[0];
  const game = games[gameId];
  const channel = req.body.channel;
  const message = req.body.message;
  const userId = req.body.member.user.id;

  console.log({ customId, gameId, game });

  if (!game || game.createdBy !== userId) {
    return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
  }

  discordRequest(`/channels/${channel.id}/polls/${message.id}/expire`, { method: 'POST' });

  const correctAnswer = game.getAnswer();

  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      components: [],
      embeds: [
        {
          color: 0x00ff00,
          title: 'Pregunta finalizada',
          fields: [
            { name: 'Pregunta', value: game.question.text },
            { name: 'Respuesta correcta', value: correctAnswer },
          ]
        }
      ]
    }
  }
}
