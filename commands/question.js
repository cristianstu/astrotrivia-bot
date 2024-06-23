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
    question,
    createdBy: req.body.member.user.id,
    responses: { A: 0, B: 0, C: 0, D: 0 }
  };

  const userId = req.body.member.user.id;

  console.log({ userId });

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

  if (!game) {
    return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
  }

  const response = customId.split('|')[1];
  const responses = game.responses;

  responses[response] += 1;

  console.log({ game, response, customId });

  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            answerButton({ answer: 'A', gameId, qtty: responses['A']}),
            answerButton({ answer: 'B', gameId, qtty: responses['B']}),
            answerButton({ answer: 'C', gameId, qtty: responses['C']}),
            answerButton({ answer: 'D', gameId, qtty: responses['D']}),
          ],
        }
      ],
    }
  }
}
