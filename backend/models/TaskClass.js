class BaseTask {
  constructor(title, completed = false) {
    this.title = title;
    this.completed = completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
    return this.completed;
  }

  summary() {
    return `Task: ${this.title} | Completed: ${this.completed}`;
  }
}

class DeadlineTask extends BaseTask {
  constructor(title, completed, deadline) {
    super(title, completed);
    this.deadline = deadline;
  }

  isOverdue(currentDate = new Date()) {
    return new Date(this.deadline) < currentDate;
  }

  summary() {
    return `${super.summary()} | Deadline: ${this.deadline}`;
  }
}

// Example usage (for testing)
const example = new DeadlineTask("Write Report", false, "2025-05-20");
console.log(example.summary());
console.log("Overdue?", example.isOverdue());

module.exports = { BaseTask, DeadlineTask };
