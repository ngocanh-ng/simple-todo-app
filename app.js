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
    const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) {
            li.classList.add('completed');
        }
        
        // Checkbox erstellen
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', function() {
            toggleTodo(todo.id);
        });
        
        // Text-Span erstellen
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        // Löschen-Button erstellen
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', function() {
            deleteTodo(todo.id);
        });
        
        // Alles zusammenfügen
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
}

// Funktion zum Anzeigen aller Todos
function renderTodos() {
    // Liste leeren
    todoList.innerHTML = '';
    
    todos.forEach(function(todo) {
    renderTodo(todo);
    });
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
