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