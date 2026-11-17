/**
 * ==============================================================
 * Sesiunea 7: Trecerea la TypeScript (Task Tracker Refactoring)
 * ==============================================================
 */

// 1. Tipizarea Primitivelor & Variabilelor de Configurare
const apiUrl: string = 'https://jsonplaceholder.typicode.com/todos';
const maxTasksLimit: number = 5;
let isAppReady: boolean = false;

// 2. Tipul de Uniune (Union Type) pentru Statusul Task-ului
type TaskStatus = 'todo' | 'in-progress' | 'completed';

// 3. Modelul de Date Tipizat (Type Alias TaskItem)
type TaskItem = {
  id: number;
  title: string;
  status: TaskStatus;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
};

let listaTaskuri: TaskItem[] = [];

// Referințe DOM
const activeTasksList = document.querySelector('#active-tasks-list') as HTMLUListElement;
const loadingMsg = document.querySelector('#loading-msg') as HTMLParagraphElement;
const addTaskForm = document.querySelector('#add-task-form') as HTMLFormElement;
const taskNameInput = document.querySelector('#task-name') as HTMLInputElement;
const submitBtn = document.querySelector('#submit-task-btn') as HTMLButtonElement;
const errorMsg = document.querySelector('#error-msg') as HTMLElement;

// 4. Semnăturile Funcțiilor & Eliminarea lui any (Zero Any Policy)
const proceseazaTaskNou = (taskObj: TaskItem): boolean => {
  const titluriExistente: string[] = listaTaskuri.map((task) => task.title.trim().toLowerCase());

  if (!taskObj.title || taskObj.title.trim() === '') {
    console.log('Eroare: Task-ul trebuie să aibă un titlu!');
    return false;
  }

  if (titluriExistente.includes(taskObj.title.trim().toLowerCase())) {
    console.log('Eroare: Acest task există deja!');
    return false;
  }

  listaTaskuri.push(taskObj);
  console.log('Task adăugat cu succes!');
  return true;
};

const afiseazaTask = (id: number): void => {
  const task: TaskItem | undefined = listaTaskuri.find((t) => t.id === id);
  if (!task) {
    return;
  }

  const li = document.createElement('li');
  li.classList.add('task-item');

  li.innerHTML = `
    <span class="task-title">${task.title}</span>
    <button class="btn-delete" data-testid="delete-btn-${id}">Șterge</button>
  `;

  activeTasksList.appendChild(li);
};

// 5. Funcție Asincronă Tipizată (Fetch API & Promise)
const incarcaTaskuriInitiale = async (): Promise<void> => {
  try {
    loadingMsg.style.display = 'block';

    const response: Response = await fetch(`${apiUrl}?_limit=${maxTasksLimit}`);
    const data = await response.json();
    const taskuriDeLaServer = data as TaskItem[];

    taskuriDeLaServer.forEach((task) => {
      const taskNormalizat: TaskItem = {
        id: task.id,
        title: task.title,
        status: 'todo',
        completed: false
      };

      listaTaskuri.push(taskNormalizat);
      afiseazaTask(taskNormalizat.id);
    });

    isAppReady = true;
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

// POST: salvarea unui task nou (validat prin proceseazaTaskNou)
addTaskForm.addEventListener('submit', async (e: SubmitEvent) => {
  e.preventDefault();

  const taskTitle: string = taskNameInput.value.trim();
  if (taskTitle === '') {
    return;
  }

  const taskNou: TaskItem = {
    id: Date.now(),
    title: taskTitle,
    status: 'todo',
    completed: false
  };

  const esteValid: boolean = proceseazaTaskNou(taskNou);

  if (!esteValid) {
    errorMsg.textContent = 'Acest task există deja în listă sau e invalid!';
    errorMsg.style.display = 'block';
    return;
  }

  errorMsg.style.display = 'none';
  submitBtn.textContent = 'Se salvează...';
  submitBtn.disabled = true;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: taskNou.title,
        completed: false,
        userId: 1
      })
    });

    afiseazaTask(taskNou.id);
    taskNameInput.value = '';
  } catch (error) {
    alert('Eroare la salvarea pe rețea!');
  } finally {
    submitBtn.textContent = 'Salvează Task';
    submitBtn.disabled = true;
  }
});

// Marcarea ca "Completed" + Ștergere
activeTasksList.addEventListener('click', async (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains('task-title')) {
    target.classList.toggle('completed');
  }

  if (target.classList.contains('btn-delete')) {
    const deleteBtn = target as HTMLButtonElement;
    const taskItem = deleteBtn.closest('.task-item') as HTMLLIElement;
    const testId: string = deleteBtn.getAttribute('data-testid') ?? '';
    const taskId: number = Number(testId.split('-')[2]);

    deleteBtn.textContent = 'Se șterge...';
    deleteBtn.disabled = true;

    try {
      const response: Response = await fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        taskItem.remove();
        listaTaskuri = listaTaskuri.filter((t) => t.id !== taskId);
      }
    } catch (error) {
      alert('Eroare de rețea la ștergere!');
      deleteBtn.textContent = 'Șterge';
      deleteBtn.disabled = false;
    }
  }
});

// Chaos Mode: pop-up promoțional aleatoriu
const initChaosMode = (): void => {
  const randomDelay: number = Math.floor(Math.random() * 4000) + 2000;

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

    const closeBtn = modal.querySelector('.btn-close-promo') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    document.body.appendChild(modal);
  }, randomDelay);
};

initChaosMode();