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
sidebarUser.classList.add('sidebar-user');
sidebarUser.textContent = "USERNAME";

// Add Task button
const sidebarAddTask = document.createElement('button');
sidebarAddTask.classList.add('sidebar-add-task');
sidebarAddTask.textContent = "+ Add Task";

// Search functionality
const sidebarSearch = document.createElement('div');
sidebarSearch.classList.add('sidebar-search');
const searchDisplay = document.createElement('p');
searchDisplay.textContent = "Search";
searchDisplay.style.cursor = 'pointer';
sidebarSearch.appendChild(searchDisplay);
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search tasks...';
searchInput.style.display = 'none';
sidebarSearch.appendChild(searchInput);
searchDisplay.addEventListener('click', () => {
    if (searchInput.style.display === 'none') {
        searchInput.style.display = 'block';
    } else {
        searchInput.style.display = 'none';
    }
});

sidebar.appendChild(sidebarUser);
sidebar.appendChild(sidebarAddTask);
sidebar.appendChild(sidebarSearch);

body.appendChild(sidebar);

// const projectList = document.createElement('