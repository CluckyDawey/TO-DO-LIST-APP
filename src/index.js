import "./styles.css";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

class Task {
    constructor(title, description, dueDate, time, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = this._combineDateAndTime(dueDate, time); // Merge time into dueDate
    }

    get task() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
        };
    }

    // Parses "10:00 AM" and applies it to the date object
    _combineDateAndTime(date, timeStr) {
        if (!timeStr) return date;

        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const combined = new Date(date);
        combined.setHours(hours, minutes, 0, 0);
        return combined;
    }

    // Now correctly shows the real time since it's baked into dueDate
    formattedDueDateTime() {
        return format(this.dueDate, 'MMMM d, yyyy h:mm a');
    }

    timeUntilDue() {
        return formatDistance(this.dueDate, new Date(), { addSuffix: true });
    }

    startLiveCountdown(element, intervalMs = 1000) {
        // Update immediately, then on every interval
        element.textContent = `Due: ${this.formattedDueDateTime()} (${this.timeUntilDue()})`;
        
        const interval = setInterval(() => {
            element.textContent = `Due: ${this.formattedDueDateTime()} (${this.timeUntilDue()})`;
        }, intervalMs);

        return interval; // Return so you can clearInterval() later
    }
}

function createTask(title, description, dueDate, time, priority) {
    const task = new Task(title, description, dueDate, time, priority);
    allTasks.push(task);
    saveTasksToLocalStorage();
    return task;
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(allTasks.map(task => task.task)));
}

const allTasks = [];

const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
const tasks = storedTasks.map(taskData => new Task(taskData.title, taskData.description, new Date(taskData.dueDate), '', taskData.priority));

console.log('Loaded tasks from localStorage:', tasks);

function displayTask(task) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');
    taskContainer.dataset.dueDate = task.dueDate.toISOString(); // store for filtering later

    const titleElement = document.createElement('h3');
    titleElement.textContent = task.title;
    taskContainer.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = task.description;
    taskContainer.appendChild(descriptionElement);

    const dueDateElement = document.createElement('p');
    task.startLiveCountdown(dueDateElement);
    taskContainer.appendChild(dueDateElement);

    const priorityElement = document.createElement('p');
    priorityElement.textContent = `Priority: ${task.priority}`;
    taskContainer.appendChild(priorityElement);

    return taskContainer;
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
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

const timeContainer = document.createElement('div');
const dueTimeInput = document.createElement('input');
const dueTimeLabel = document.createElement('label');
dueTimeLabel.textContent = "Due Time:";
dueTimeInput.style.height = '2rem';
dueTimeInput.style.borderRadius = '10px';
dueTimeInput.type = 'time';
//const timeOptions = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];
// timeOptions.forEach(time => {
//     const option = document.createElement('option');
//     option.value = time;
//     option.textContent = time;
//     dueTimeInput.appendChild(option);
// });
timeContainer.appendChild(dueTimeLabel);
timeContainer.appendChild(line.cloneNode());
timeContainer.appendChild(dueTimeInput);
timeContainer.style.display = 'inline-block';
timeContainer.style.marginLeft = '1rem';
form.appendChild(timeContainer);

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
            dueTimeInput.value,
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

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const tasks = mainContent.querySelectorAll('.task-container');
    tasks.forEach(task => {
        const title = task.querySelector('h3').textContent.toLowerCase();
        const description = task.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
});

const sidebarToday = document.createElement('div');
sidebarToday.classList.add('sidebar-today');
const todayDisplay = document.createElement('p');
todayDisplay.textContent = "Today";
todayDisplay.style.cursor = 'pointer';
sidebarToday.appendChild(todayDisplay);

let showingTodayOnly = false; // track toggle state

todayDisplay.addEventListener('click', () => {
    showingTodayOnly = !showingTodayOnly;
    const now = new Date();
    const tasks = mainContent.querySelectorAll('.task-container');

    tasks.forEach(taskEl => {
        if (!showingTodayOnly) {
            taskEl.style.display = 'block'; // reset to show all
            return;
        }
        const dueDate = new Date(taskEl.dataset.dueDate);
        taskEl.style.display = isSameDay(dueDate, now) ? 'block' : 'none';
    });

    todayDisplay.textContent = showingTodayOnly ? "Today (showing all dates bound for today)" : "Today";
});

const sidebarAll = document.createElement('div');
sidebarAll.classList.add('sidebar-all');
const allDisplay = document.createElement('p');
allDisplay.textContent = "All Tasks";
allDisplay.style.cursor = 'pointer';
sidebarAll.appendChild(allDisplay);

allDisplay.addEventListener('click', () => {
    const tasks = mainContent.querySelectorAll('.task-container');
    tasks.forEach(task => {
        task.style.display = 'block'; // Show all tasks
    });
});

sidebar.appendChild(sidebarUser);
sidebar.appendChild(sidebarAddTask);
sidebar.appendChild(sidebarSearch);
sidebar.appendChild(sidebarToday);
sidebar.appendChild(sidebarAll);

wrapper.appendChild(sidebar);

const mainContent = document.createElement('div');
mainContent.classList.add('main-content');
wrapper.appendChild(mainContent);
tasks.forEach(t => allTasks.push(t));
allTasks.forEach(task => {
    mainContent.appendChild(displayTask(task));
});

body.appendChild(form);
body.appendChild(wrapper);