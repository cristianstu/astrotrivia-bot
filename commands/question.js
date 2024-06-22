import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";

import { discordRequest } from "../utils.js";

export function askQuestion(req) {
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
              custom_id: `A`,
              label: 'A',
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `B`,
              label: 'B',
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `C`,
              label: 'C',
              style: ButtonStyleTypes.PRIMARY,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `D`,
              label: 'D',
              style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  }
}

export function addReaction(req) {
  console.log('############## - addReaction');
  const channel = req.body.channel;
  // const userId = req.body.member.user.id;
  const message = req.body.message;

  // console.log({ body: req.body }
  // console.log({ channel, userId, message });
  // console.log({ message });

  // discordRequest(
  //   `/channels/${channel.id}/messages/${message.id}/reactions/😄/@me`,
  //   { method: 'PUT' }
  // );

  return { type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE };
}
