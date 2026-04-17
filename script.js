const STORAGE_KEY = 'todo-list-tasks';
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedButton = document.getElementById('clear-completed');

let tasks = [];

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty">Your task list is empty. Add something to get started.</li>';
    }

    tasks.forEach(task => {
        const item = document.createElement('li');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <button class="task-toggle" aria-label="Toggle task completion">${task.completed ? '✓' : ''}</button>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete" aria-label="Delete task">✕</button>
        `;

        item.querySelector('.task-toggle').addEventListener('click', () => toggleTask(task.id));
        item.querySelector('.task-delete').addEventListener('click', () => removeTask(task.id));

        taskList.appendChild(item);
    });

    updateTaskCount();
}

function updateTaskCount() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    taskCount.textContent = `${total} task${total !== 1 ? 's' : ''} · ${completed} completed`;
}

function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    tasks.unshift({
        id: Date.now().toString(),
        text: trimmed,
        completed: false
    });

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

todoForm.addEventListener('submit', event => {
    event.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
    taskInput.focus();
});

clearCompletedButton.addEventListener('click', clearCompleted);

loadTasks();
renderTasks();
