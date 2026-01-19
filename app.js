// DOM-Elemente auswählen
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
let todos = [];

// Funktion zum Hinzufügen eines Todos
function addTodo() {
    const text = todoInput.value.trim();
    
    // Prüfen ob Eingabe leer ist
    if (text === '') {
        alert('Bitte eine Aufgabe eingeben!');
        return;
    }
    
    // Todo-Objekt erstellen
    const todo = {
        id: Date.now(), // Einfache eindeutige ID
        text: text,
        completed: false
    };
    
    // Debug Log zum überprüfen
    console.log('DEBUG: Neues Todo hinzugefügt:', todo);

    todos.push(todo);

    // Debug Log zum überprüfen
    console.log('DEBUG: Alle Todos:', todos);

    // Eingabefeld leeren
    todoInput.value = '';

    // Speichern und anzeigen
    saveTodos();
    renderTodos();
}

// Event Listener für den Button
addBtn.addEventListener('click', addTodo);

// Event Listener für Enter-Taste
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// Funktion zum Erstellen eines Todo Items
function renderTodo(todo) {

    // Template-Element holen
    const template = document.getElementById('todoTemplate');
    
    // Template klonen (kopieren)
    const clone = template.content.cloneNode(true);
    
    // Elemente aus dem Klon holen
    const li = clone.querySelector('.todo-item');
    const checkbox = clone.querySelector('.todo-checkbox');
    const span = clone.querySelector('.todo-text');
    const deleteBtn = clone.querySelector('.delete-btn');
    
    // Completed-Status setzen
    if (todo.completed) {
        li.classList.add('completed');
    }
    
    // Checkbox konfigurieren
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
        toggleTodo(todo.id);
    });
    
    // Text setzen
    span.textContent = todo.text;
    
    // Delete-Button konfigurieren
    deleteBtn.addEventListener('click', () => {
        deleteTodo(todo.id);
    });
    
    // Geklontes Element zur Liste hinzufügen
    todoList.appendChild(clone);
}

// Funktion zum Anzeigen aller Todos
function renderTodos() {
    // Liste leeren
    todoList.innerHTML = '';

    const filtered = getFilteredTodos();
    filtered.forEach(function(todo) {
        renderTodo(todo);
    });

    updateCounter();
}

// Funktion zum Umschalten des completed-Status
function toggleTodo(id) {
    // Todo finden
    const todo = todos.find(function(t) {
        return t.id === id;
    });
    
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Funktion zum Löschen eines Todos
function deleteTodo(id) {
    // Filtern: Alle Todos AUSSER das mit der gesuchten ID
    todos = todos.filter(function(t) {
        return t.id !== id;
    });

    saveTodos();
    renderTodos();
}

// Funktion zum Speichern in LocalStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Funktion zum Laden aus LocalStorage
function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
        renderTodos();
    }
}

let filter = 'all'; // 'all', 'active', 'completed'

function setFilter(newFilter) {
    filter = newFilter;
    renderTodos();
}

function getFilteredTodos() {
    if (filter === 'active') {
        return todos.filter(t => !t.completed);
    } else if (filter === 'completed') {
        return todos.filter(t => t.completed);
    }
    return todos;
}

function updateCounter() {
    const total = todos.length;
    const completed = todos.filter(function(t) {
        return t.completed;
    }).length;

    const counter = document.getElementById('counter');
    counter.textContent = completed + ' von ' + total + ' erledigt';
}

// Beim Laden der Seite die gespeicherten Todos laden
loadTodos();