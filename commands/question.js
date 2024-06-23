import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";

import { Game } from "./game.js";

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
  const game = new Game({
    mode: 'custom',
    createdBy: req.body.member.user.id,
  });

  const gameId = game.id;
  games[gameId] = game;
  const userId = req.body.member.user.id;
  const question = game.question;

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: [
        `Pregunta lanzada por <@${userId}>`,
        `**${question.text}**`,
        [
          `- :regional_indicator_a: ${question.options['A']}`,
          `- :regional_indicator_b: ${question.options['B']}`,
          `- :regional_indicator_c: ${question.options['C']}`,
          `- :regional_indicator_d: ${question.options['D']}`,
        ].join('\n'),
      ].join('\n\n') + '\n-',
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
  const correctAnswer = game.getAnswer();
  // console.log({ game, customId, correctAnswer });

  const answerBy = (userIds = []) => {
    return userIds.map((userId) => `<@${userId}>`).join(' ');
  };

  if (action === 'end-question' && game.createdBy === userId) {
    const fields = [
      { name: 'Pregunta', value: game.question.text },
      { name: 'Respuesta correcta', value: `${game.question.correct} - ${correctAnswer}` },
    ];

    const { winners, losers } = game.getUserResult();
    if (winners.length > 0) {
      fields.push({ name: 'Ganadores', value: `✅ ${answerBy(winners)}` });
    }

    if (losers.length > 0) {
      fields.push({ name: 'Perdedores', value: `❌ ${answerBy(losers)}` });
    }

    const mostVotedQuestions = game.getMostVotedQuestions();
    console.log(mostVotedQuestions);
    // [
    //   [ 'A', { count: 1, users: [Array] } ],
    //   [ 'B', { count: 1, users: [Array] } ]
    // ]
    for (const [key, value] of mostVotedQuestions) {
      const emoji = game.question.correct === key ? '✅' : '❌';
      const q = game.question.options[key];
      fields.push({ name: `Resultado grupal (${value.count}) votos`, value: `${emoji} ${q}` });
    }

    const groupIsCorrect = mostVotedQuestions.some(([key]) => key === game.question.correct);

    return {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: {
        components: [],
        embeds: [
        {
          color: groupIsCorrect ? 0x00ff00 : 0xff0000,
          title: 'Pregunta finalizada',
          fields,
        }
      ]
      }
    }
  } else {
    const response = customId.split('|')[1];
    const responses = game.responses;
    const allUsers = responses['A'].users.concat(responses['B'].users, responses['C'].users, responses['D'].users);

    // If already answered, ignore.
    if (allUsers.includes(userId)) {
      return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
    }

    game.answer(userId, response);

    // console.log({ game, response, customId });

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
