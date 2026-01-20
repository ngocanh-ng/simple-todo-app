// ========================================
// 1. INITIALISIERUNG
// ========================================

// DOM-Elemente auswählen
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Daten-Arrays und Variablen
let todos = [];
let filter = 'all'; // 'all', 'active', 'completed'


// ========================================
// 2. CRUD FUNKTIONEN (Create, Read, Update, Delete)
// ========================================

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

// Funktion zum Bearbeiten eines Todos
function editTodo(id) {
    const todo = todos.find(function(t) {
        return t.id === id;
    });
    
    if (!todo) return;

    const newText = prompt('Todo bearbeiten', todo.text);

    if (newText === null || newText.trim() === '') {
        return;
    };

    todo.text = newText.trim();
    saveTodos();
    renderTodos();

}


// ========================================
// 3. RENDER FUNKTIONEN (Anzeige)
// ========================================

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

    // ID im data-Attribut speichern (für Event Delegation)
    li.dataset.todoId = todo.id;

    // Completed-Status setzen
    if (todo.completed) {
        li.classList.add('completed');
    }

    // Checkbox Status setzen
    checkbox.checked = todo.completed;

    // Text setzen
    span.textContent = todo.text;

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

// Funktion zum Aktualisieren des Zählers
function updateCounter() {
    const total = todos.length;
    const completed = todos.filter(function(t) {
        return t.completed;
    }).length;

    const counter = document.getElementById('counter');
    counter.textContent = completed + ' von ' + total + ' erledigt';
}


// ========================================
// 4. FILTER FUNKTIONEN
// ========================================

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


// ========================================
// 5. LOCALSTORAGE FUNKTIONEN
// ========================================

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


// ========================================
// 6. EVENT LISTENER
// ========================================

// Event Listener für den Button
addBtn.addEventListener('click', addTodo);

// Event Listener für Enter-Taste
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// Event Delegation für Delete-Buttons (ein Listener für alle Todos)
todoList.addEventListener('click', function(event) {
    const target = event.target;

    // Prüfen ob Delete-Button geklickt wurde
    if (target.classList.contains('delete-btn')) {
        const li = target.closest('.todo-item');
        if (li) {
            const todoId = Number(li.dataset.todoId);
            deleteTodo(todoId);
        }
    }
});

// Event Delegation für Checkboxen (ein Listener für alle Todos)
todoList.addEventListener('change', function(event) {
    const target = event.target;

    // Prüfen ob Checkbox geändert wurde
    if (target.classList.contains('todo-checkbox')) {
        const li = target.closest('.todo-item');
        if (li) {
            const todoId = Number(li.dataset.todoId);
            toggleTodo(todoId);
        }
    }
});

// Event Delegation für Edit-Button
todoList.addEventListener('click', function(event) {
    const target = event.target;

    // Prüfen ob Edit-Button geklickt wurde
    if (target.classList.contains('edit-btn')) {
        const li = target.closest('.todo-item');
        if (li) {
            const todoId = Number(li.dataset.todoId);
            editTodo(todoId);
        }
    }
});


// ========================================
// 7. INITIALISIERUNG BEIM LADEN
// ========================================

// Beim Laden der Seite die gespeicherten Todos laden
loadTodos();