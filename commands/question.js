import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";
import questions from './questions.js';

function buttonLabel(label, qtty) {
  if (!qtty) {
    return label;
  }

  return `${label} (${qtty})`;
}

function answerButton({ answer, gameId, qtty = 0 }) {
  return {
    type: MessageComponentTypes.BUTTON,
    custom_id: `${gameId}|${answer}`,
    label: buttonLabel(answer, qtty),
    style: ButtonStyleTypes.PRIMARY,
  }
};

export function askQuestion(req, games) {
  console.log('############## - askQuestion');
  // Pick random questions
  const question = questions[Math.floor(Math.random() * questions.length)];
  const gameId = crypto.randomUUID();
  games[gameId] = {
    mode: 'custom',
    question,
    createdBy: req.body.member.user.id,
    responses: {
      A: { count: 0, users: [] },
      B: { count: 0, users: [] },
      C: { count: 0, users: [] },
      D: { count: 0, users: [] },
    }
  };

  const userId = req.body.member.user.id;

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: [
        `Pregunta lanzada por <@${userId}>`,
        `**${question.question}**`,
        [
          `- :regional_indicator_a: ${question.options['A']}`,
          `- :regional_indicator_b: ${question.options['B']}`,
          `- :regional_indicator_c: ${question.options['C']}`,
          `- :regional_indicator_d: ${question.options['D']}`,
        ].join('\n'),
      ].join('\n\n'),
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            answerButton({ answer: 'A', gameId }),
            answerButton({ answer: 'B', gameId }),
            answerButton({ answer: 'C', gameId }),
            answerButton({ answer: 'D', gameId }),
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|end-question`,
              label: 'Finalizar (solo creador)',
              style: ButtonStyleTypes.SECONDARY,
            }
          ],
        },
      ],
    },
  }
}

export function addReaction(req, games) {
  console.log('############## - addReaction');
  const customId = req.body.data.custom_id;
  const gameId = customId.split('|')[0];
  const game = games[gameId];
  const userId = req.body.member.user.id;

  if (!game) {
    return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
  }

  const action = customId.split('|')[1];
  const correctAnswer = game.question.options[game.question.correct];

  const answerBy = (userIds = []) => {
    return userIds.map((userId) => `<@${userId}>`).join(' ');
  };

  if (action === 'end-question' && game.createdBy === userId) {
    return {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: {
        components: [],
        embeds: [
        {
          color: 0x00ff00,
          title: 'Pregunta finalizada',
          fields: [
            { name: 'Pregunta', value: game.question.question },
            { name: 'Respuesta correcta', value: correctAnswer },
            { name: 'A', value: `contestado por: ${answerBy(game.responses['A'].users)}` },
            { name: 'B', value: `contestado por: ${answerBy(game.responses['B'].users)}` },
            { name: 'C', value: `contestado por: ${answerBy(game.responses['C'].users)}` },
            { name: 'D', value: `contestado por: ${answerBy(game.responses['D'].users)}` },
          ]
        }
      ]
      }
    }
  } else {
    const response = customId.split('|')[1];
    const responses = game.responses;
    const allUsers = responses['A'].users.concat(responses['B'].users, responses['C'].users, responses['D'].users);

    // IF alread answered, ignore.
    if (allUsers.includes(userId)) {
      return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
    }

    responses[response].count += 1;
    responses[response].users.push(userId);

    console.log({ game, response, customId });

    return {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: {
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              answerButton({ answer: 'A', gameId, qtty: responses['A'].count}),
              answerButton({ answer: 'B', gameId, qtty: responses['B'].count}),
              answerButton({ answer: 'C', gameId, qtty: responses['C'].count}),
              answerButton({ answer: 'D', gameId, qtty: responses['D'].count}),
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `${gameId}|end-question`,
                label: 'Finalizar (solo creador)',
                style: ButtonStyleTypes.SECONDARY,
              }
            ],
          }
        ],
      }
    }
  }
}
