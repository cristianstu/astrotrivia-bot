import 'dotenv/config';

import { installGlobalCommands } from '../utils.js';
import { APP_ID } from '../constants.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const QUESTION_COMMAND = {
  name: 'pregunta',
  description: 'Trivia question',
  type: 1,
};

const POLL_COMMAND = {
  name: 'encuesta',
  description: 'Trivia question',
  type: 1,
};

const ALL_COMMANDS = [QUESTION_COMMAND, POLL_COMMAND];

installGlobalCommands(APP_ID, ALL_COMMANDS);
