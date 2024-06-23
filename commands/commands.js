import 'dotenv/config';

import { installGlobalCommands } from '../utils.js';
import { APP_ID } from '../constants.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command, show a random emoji',
  type: 1,
};

const QUESTION_COMMAND = {
  name: 'pregunta',
  description: 'Crea una pregunta trivia para que todos puedan contestar',
  type: 1,
};

const POLL_COMMAND = {
  name: 'encuesta',
  description: 'Crea una encuesta para que todos puedan votar',
  type: 1,
};

const ALL_COMMANDS = [QUESTION_COMMAND, POLL_COMMAND];
const DEV_COMMANDS = [TEST_COMMAND, ...ALL_COMMANDS];

if (process.env.NODE_ENV === 'development') {
  console.log('Installing dev commands');
  installGlobalCommands(APP_ID, DEV_COMMANDS);
} else {
  console.log('Installing all commands');
  installGlobalCommands(APP_ID, ALL_COMMANDS);
}

