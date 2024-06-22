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

const ALL_COMMANDS = [TEST_COMMAND, QUESTION_COMMAND];

installGlobalCommands(APP_ID, ALL_COMMANDS);
