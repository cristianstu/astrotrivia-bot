import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";

export function askQuestion(req, gameId) {
  console.log('############## - askQuestion');
  const userId = req.body.member.user.id;
  // User's object choice
  // const objectName = req.body.data.options[0].value;
  console.log({ userId });
  // Formatters.codeBlock('json', JSON.stringify(req.body, null, 2));
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `
        Pregunta lanzada por <@${userId}>
        - :regional_indicator_a: Opción A\n- :regional_indicator_b: Opción B\n- :regional_indicator_c: Opción c\n- :regional_indicator_d: Opción D
      `.trim(),
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|A`,
              label: 'A',
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|B`,
              label: 'B',
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|C`,
              label: 'C',
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|D`,
              label: 'D',
              style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  }
}

function buttonLabel(label, qtty) {
  if (!qtty) {
    return label;
  }

  return `${label} (${qtty})`;
}

export function addReaction(req, games) {
  console.log('############## - addReaction');
  const customId = req.body.data.custom_id;
  const gameId = customId.split('|')[0];
  const game = games[gameId];
  const response = customId.split('|')[1];
  const responses = game.responses;

  responses[response] += 1;
  // console.log({ body: req.body }
  // console.log({ message });
  console.log({ game, response, customId });

  // return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      content: `
        Pregunta lanzada por <@${game.createdBy}>
        - :regional_indicator_a: Opción A\n- :regional_indicator_b: Opción B\n- :regional_indicator_c: Opción c\n- :regional_indicator_d: Opción D
      `.trim(),
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|A`,
              label: buttonLabel('A', responses['A']),
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|B`,
              label: buttonLabel('B', responses['B']),
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|C`,
              label: buttonLabel('C', responses['C']),
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${gameId}|D`,
              label: buttonLabel('D', responses['D']),
              style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    }
  }
}
