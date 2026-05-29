import "./styles.css";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    get task() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority
        }
    }

    formattedDueDate() {
        return format(this.dueDate, 'MMMM d, yyyy');
    }

    timeUntilDue() {
    return formatDistance(this.dueDate, new Date(), { addSuffix: true }); // e.g. "in 3 days"
    }
}

function createTask(title, description, dueDate, priority) {
    return new Task(title, description, dueDate, priority);
}


const body = document.querySelector('body');

const sidebar = document.createElement('div');
sidebar.classList.add('sidebar');

const sidebarUser = document.createElement('h2');
sidebarUser.textContent = "USERNAME";
const sidebarAddTask = document.createElement('button');
sidebarAddTask.textContent = "Add Task";
sidebar.appendChild(sidebarUser);
sidebar.appendChild(sidebarAddTask);

body.appendChild(sidebar);

// const projectList = document.createElement('