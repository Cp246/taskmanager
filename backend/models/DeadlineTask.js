const Task = require("./Task");

class DeadlineTask extends Task {
  constructor(props) {
    super(props);
    this.deadline = props.deadline;
  }

  isPastDeadline() {
    return new Date(this.deadline) < new Date();
  }
}

module.exports = DeadlineTask;
