// ============================================================
// Sesiunea 3: JavaScript Basics (Business Logic & Validare)
// ============================================================

// 1. Baza temporară de date (Array de Obiecte)
const listaTaskuri = [
  { id: 1, nume: "Învață arhitectura DOM", completat: false },
  { id: 2, nume: "Scrie selectoare CSS", completat: true }
];

// 2. Funcția de Validare (Arrow Function)
const proceseazaTaskNou = (taskObj) => {
  if (!taskObj.nume || taskObj.nume === "") {
    console.log("Eroare: Task-ul trebuie să aibă un nume!");
  } else {
    listaTaskuri.push(taskObj);
    console.log("Task adăugat cu succes!");
  }
};

// 3. Testează funcția apelând-o cu un task invalid și unul valid
proceseazaTaskNou({ id: 3, nume: "", completat: false });
proceseazaTaskNou({ id: 4, nume: "Scrie testul pentru butonul disabled", completat: false });

// 4. Bucla for pentru raportarea task-urilor din memorie
for (let i = 0; i < listaTaskuri.length; i++) {
  console.log(`Task #${listaTaskuri[i].id}: ${listaTaskuri[i].nume}`);
}

// ============================================================
// Sesiunea 4: JS DOM Manipulation (Task Tracker)
// ============================================================

// 1. Selectare elemente DOM
const addTaskForm = document.querySelector('#add-task-form');
const taskNameInput = document.querySelector('#task-name');
const historyTableBody = document.querySelector('#history-table tbody');
const submitBtn = document.querySelector('[data-testid="submit-task-btn"]');

// 2. Ascultător eveniment 'submit' și adăugare dinamică în tabel
addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const numeTask = taskNameInput.value.trim();
  if (numeTask === '') {
    return;
  }

  const newRow = document.createElement('tr');

  const idCell = document.createElement('td');
  idCell.textContent = `#${Date.now()}`;

  const nameCell = document.createElement('td');
  nameCell.textContent = numeTask;

  const actionsCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-row');
  deleteButton.textContent = 'Șterge';
  actionsCell.appendChild(deleteButton);

  newRow.appendChild(idCell);
  newRow.appendChild(nameCell);
  newRow.appendChild(actionsCell);

  historyTableBody.appendChild(newRow);

  taskNameInput.value = '';
  submitBtn.disabled = true;
});

// 3. Ștergere dinamică din DOM (Event Delegation pe document)
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-row')) {
    event.target.closest('tr').remove();
  }
});

// Bonus: activează/dezactivează butonul în funcție de conținutul input-ului
taskNameInput.addEventListener('input', () => {
  submitBtn.disabled = taskNameInput.value.trim() === '';
});