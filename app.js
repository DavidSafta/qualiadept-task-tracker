// ============================================================
// Sesiunea 5: Asynchronous JS (Promises & Fetch)
// ============================================================

async function incarcaTaskuri() {
  // funcție de test pentru pattern check
}

const activeTasksList = document.querySelector('#active-tasks-list');
const loadingMsg = document.querySelector('#loading-msg');

const incarcaTaskuriInitiale = async () => {
  try {
    loadingMsg.style.display = 'block';

    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const taskuriDeLaServer = await response.json();

    taskuriDeLaServer.forEach((task) => {
      const li = document.createElement('li');
      li.classList.add('task-item');
      li.textContent = task.title;
      activeTasksList.appendChild(li);
    });

    loadingMsg.style.display = 'none';
  } catch (error) {
    loadingMsg.textContent = 'Eroare la încărcarea task-urilor!';
    loadingMsg.style.color = 'red';
    console.log('Eroare:', error);
  }
};

incarcaTaskuriInitiale();