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

let task1 = createTask("Finish project", "Complete the project by the end of the week", new Date(2024, 5, 30), "High");
let task2 = createTask("Grocery shopping", "Buy groceries for the week", new Date(2024, 5, 25), "Medium");
let task3 = createTask("Call mom", "Check in with mom and see how she's doing", new Date(2024, 5, 28), "Low");

function displayTask(task) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    const titleElement = document.createElement('h3');
    titleElement.textContent = task.title;
    taskContainer.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = task.description;
    taskContainer.appendChild(descriptionElement);

    const dueDateElement = document.createElement('p');
    dueDateElement.textContent = `Due: ${task.formattedDueDate()} (${task.timeUntilDue()})`;
    taskContainer.appendChild(dueDateElement);

    const priorityElement = document.createElement('p');
    priorityElement.textContent = `Priority: ${task.priority}`;
    taskContainer.appendChild(priorityElement);

    return taskContainer;
}

//form for adding new tasks
const form = document.createElement('form');
form.classList.add('task-form');
form.style.width = '30vw';
form.hidden = true; // Initially hidden

const formHeader = document.createElement('div');
formHeader.classList.add('form-header');
formHeader.style.display = 'flex';
formHeader.style.justifyContent = 'space-between';
formHeader.style.alignItems = 'center';
const formTitle = document.createElement('h2');
formTitle.display = 'inline';
formTitle.textContent = 'Add New Task';
formHeader.appendChild(formTitle);
const closeButton = document.createElement('button');
closeButton.type = 'button';
closeButton.textContent = 'X';
closeButton.display = 'inline-block';
closeButton.classList.add('close-button');
formHeader.appendChild(closeButton);
form.appendChild(formHeader);

closeButton.addEventListener('click', () => {
    form.hidden = true; // Hide form when close button is clicked
});

const line = document.createElement('br');
const titleLabel = document.createElement('label');
titleLabel.textContent = "Title:";
titleLabel.style.display = 'block';
titleLabel.style.marginBottom = '1%';
form.appendChild(titleLabel);
const titleInput = document.createElement('input');
titleInput.type = 'text';
titleInput.style.height = '2rem';
titleInput.style.width = '60%';
titleInput.style.display = 'block';
titleInput.required = true;
titleInput.style.marginBottom = '0.5rem';
titleInput.style.borderRadius = '10px';
titleInput.placeholder = 'Task Title';
form.appendChild(titleInput);
form.appendChild(line.cloneNode());

const descriptionInput = document.createElement('textarea');
const descriptionLabel = document.createElement('label');
descriptionLabel.textContent = "Description:";
descriptionLabel.style.display = 'block';
descriptionLabel.style.marginBottom = '1%';
form.appendChild(descriptionLabel);
descriptionInput.rows = 6;
descriptionInput.style.width = '100%';
descriptionInput.style.resize = 'none';
descriptionInput.style.display = 'block';
descriptionInput.style.borderRadius = '10px';
descriptionInput.placeholder = 'Task Description';
form.appendChild(descriptionInput);

const dateContainer = document.createElement('div');
const dueDateInput = document.createElement('input');
const dueDateLabel = document.createElement('label');
dueDateLabel.textContent = "Due Date:";
dueDateInput.style.height = '2rem';
dueDateInput.style.borderRadius = '10px';
dueDateInput.type = 'date';
dateContainer.appendChild(dueDateLabel);
dateContainer.appendChild(line.cloneNode());
dateContainer.appendChild(dueDateInput);
dateContainer.style.display = 'inline-block';
form.appendChild(dateContainer);

const priorityContainer = document.createElement('div');
const priorityLabel = document.createElement('label');
priorityLabel.textContent = "Priority:";
const prioritySelect = document.createElement('select');
const priorities = ['Low', 'Medium', 'High'];
priorities.forEach(priority => {
    const option = document.createElement('option');
    option.value = priority;
    option.textContent = priority;
    prioritySelect.appendChild(option);
});
prioritySelect.style.height = '2rem';
prioritySelect.style.borderRadius = '10px';
priorityContainer.appendChild(priorityLabel);
priorityContainer.appendChild(line.cloneNode());
priorityContainer.appendChild(prioritySelect);
priorityContainer.style.display = 'inline-block';
priorityContainer.style.marginLeft = '1rem';
priorityContainer.style.marginTop = '1.5rem';
form.appendChild(priorityContainer);

const submitButton = document.createElement('button');
submitButton.classList.add('submit-button');
submitButton.type = 'submit';
submitButton.textContent = 'Add Task';
form.appendChild(submitButton);

form.addEventListener('submit', (e) => {
    try {
        e.preventDefault();
        const newTask = createTask(
            titleInput.value,
            descriptionInput.value,
            new Date(dueDateInput.value),
            prioritySelect.value
        );
        mainContent.appendChild(displayTask(newTask));
        form.reset();
        form.hidden = true; // Hide form after submission
    } catch (error) {
        console.error('Error adding task:', error);
        alert('please fill out all fields correctly');
    }
});

const body = document.querySelector('body');

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');


const sidebar = document.createElement('div');
sidebar.classList.add('sidebar');

const sidebarUser = document.createElement('h2');
sidebarUser.classList.add('sidebar-user');
sidebarUser.textContent = "USERNAME";

// Add Task button
const sidebarAddTask = document.createElement('button');
sidebarAddTask.classList.add('sidebar-add-task');
sidebarAddTask.textContent = "+ Add Task";

sidebarAddTask.addEventListener('click', () => {
    form.hidden = !form.hidden; // Toggle form visibility
});

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

wrapper.appendChild(sidebar);

const mainContent = document.createElement('div');
mainContent.classList.add('main-content');
wrapper.appendChild(mainContent);
mainContent.appendChild(displayTask(task1));
mainContent.appendChild(displayTask(task2));
mainContent.appendChild(displayTask(task3));

body.appendChild(form);
body.appendChild(wrapper);

// const projectList = document.createElement('