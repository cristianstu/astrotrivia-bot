export class Game {
  constructor({ mode, createdBy, question }) {
    this.id = crypto.randomUUID();
    this.mode = mode;
    this.createdBy = createdBy;
    this.question = question;
    this.responses = {
      A: { count: 0, users: [] },
      B: { count: 0, users: [] },
      C: { count: 0, users: [] },
      D: { count: 0, users: [] },
    };
  }

  getAnswer() {
    return this.question.options[this.question.correct];
  }

  answer(userId, response) {
    this.responses[response].count += 1;
    this.responses[response].users.push(userId);
  }

  getUserResult() {
    const correctAnswer = this.question.correct;
    const winners = [];
    const losers = [];
    for (const [key, value] of Object.entries(this.responses)) {
      console.log({key, value, correctAnswer});
      if (key === this.question.correct) {
        winners.push(...value.users);
      } else {
        losers.push(...value.users);
      }
    }
    return { winners, losers };
  }
}
