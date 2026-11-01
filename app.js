// ============================================================
// Task Tracker - app.js (Sesiunea 6: Kanban Workshop)
// ============================================================

const activeTasksList = document.querySelector('#active-tasks-list');
const loadingMsg = document.querySelector('#loading-msg');
const addTaskForm = document.querySelector('#add-task-form');
const taskNameInput = document.querySelector('#task-name');
const submitBtn = document.querySelector('#submit-task-btn');
const errorMsg = document.querySelector('#error-msg');

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Funcție reutilizabilă: desenează un task în DOM
const deseneazaTaskInDOM = (id, titlu) => {
  const li = document.createElement('li');
  li.classList.add('task-item');

  li.innerHTML = `
    <span class="task-title">${titlu}</span>
    <button class="btn-delete" data-testid="delete-btn-${id}">Șterge</button>
  `;

  activeTasksList.appendChild(li);
};

// 1. GET: încărcarea inițială a task-urilor
const incarcaTaskuriInitiale = async () => {
  try {
    loadingMsg.style.display = 'block';

    const response = await fetch(`${API_URL}?_limit=5`);
    const taskuriDeLaServer = await response.json();

    taskuriDeLaServer.forEach((task) => {
      deseneazaTaskInDOM(task.id, task.title);
    });

    loadingMsg.style.display = 'none';
  } catch (error) {
    loadingMsg.textContent = 'Eroare la încărcarea task-urilor!';
    loadingMsg.style.color = 'red';
    console.log('Eroare:', error);
  }
};

incarcaTaskuriInitiale();

// Activează/dezactivează butonul în funcție de conținutul input-ului
taskNameInput.addEventListener('input', () => {
  submitBtn.disabled = taskNameInput.value.trim() === '';
});

// 2. POST: salvarea unui task nou pe rețea (+ Bonus: previne duplicatele)
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskTitle = taskNameInput.value.trim();
  if (taskTitle === '') {
    return;
  }

  const titluriExistente = Array.from(
    activeTasksList.querySelectorAll('.task-title')
  ).map((span) => span.textContent.trim().toLowerCase());

  if (titluriExistente.includes(taskTitle.toLowerCase())) {
    errorMsg.textContent = 'Acest task există deja în listă!';
    errorMsg.style.display = 'block';
    return;
  }

  errorMsg.style.display = 'none';
  submitBtn.textContent = 'Se salvează...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: taskTitle,
        completed: false,
        userId: 1
      })
    });

    const newTask = await response.json();
    deseneazaTaskInDOM(newTask.id, newTask.title);
    taskNameInput.value = '';
  } catch (error) {
    alert('Eroare la salvarea pe rețea!');
  } finally {
    submitBtn.textContent = 'Salvează Task';
    submitBtn.disabled = true;
  }
});

// 3. Marcarea ca "Completed" (toggle class la click pe titlu) + 4/5. DELETE
activeTasksList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('task-title')) {
    e.target.classList.toggle('completed');
  }

  if (e.target.classList.contains('btn-delete')) {
    const deleteBtn = e.target;
    const taskItem = deleteBtn.closest('.task-item');
    const testId = deleteBtn.getAttribute('data-testid');
    const taskId = testId.split('-')[2];

    deleteBtn.textContent = 'Se șterge...';
    deleteBtn.disabled = true;

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        taskItem.remove();
      }
    } catch (error) {
      alert('Eroare de rețea la ștergere!');
      deleteBtn.textContent = 'Șterge';
      deleteBtn.disabled = false;
    }
  }
});

// 6. Chaos Mode: pop-up promoțional aleatoriu
const initChaosMode = () => {
  const randomDelay = Math.floor(Math.random() * 4000) + 2000;

  setTimeout(() => {
    const modal = document.createElement('div');
    modal.className = 'overlay-modal';
    modal.setAttribute('data-testid', 'promo-overlay');

    modal.innerHTML = `
      <div class="promo-box">
        <h3>Ofertă Specială! 🚀</h3>
        <p>Fă upgrade la versiunea Premium pentru task-uri nelimitate!</p>
        <button class="btn-close-promo" data-testid="close-promo-btn">Nu, mulțumesc</button>
      </div>
    `;

    const closeBtn = modal.querySelector('.btn-close-promo');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    document.body.appendChild(modal);
  }, randomDelay);
};

initChaosMode();