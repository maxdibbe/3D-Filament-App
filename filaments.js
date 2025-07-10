// Firebase config
/*firebase.initializeApp({firebaseConfig});
const db = firebase.firestore();

// 🔁 Caricamento iniziale
window.onload = () => {
  loadFilamentTable();
};*/

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const form = document.getElementById('filament-form');
const list = document.getElementById('filament-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const material = document.getElementById('material').value;
  const temperature = document.getElementById('temperature').value;
  const flowRate = document.getElementById('flowRate').value;
  const td = document.getElementById('td').value;
  const price = document.getElementById('price').value;

  await db.collection('filaments').add({ name, material, temperature, flowRate, td, price });
  form.reset();
  loadFilaments();
});

// 🧾 Carica e mostra i filamenti in tabella
function loadFilamentTable() {
  db.collection("filaments").onSnapshot(snapshot => {
    const tbody = document.getElementById("filament-table-body");
    tbody.innerHTML = "";
    snapshot.forEach(doc => {
      const f = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${f.name}</td>
        <td>${f.material}</td>
        <td>${f.color}</td>
        <td>${f.flowRate || ''}</td>
        <td>${f.td || ''}</td>
        <td>${f.price || ''}</td>
        <td>
          <button onclick='editFilament("${doc.id}", ${JSON.stringify(f)})'>✏️</button>
          <button onclick='deleteFilament("${doc.id}")'>🗑️</button>
          <button onclick='exportPDF("${doc.id}")'>📄</button>
        </td>
      `;
      row.id = `filament-${doc.id}`;
      tbody.appendChild(row);
    });
  });
}

// 🔍 Filtri live
['filter-name', 'filter-material', 'filter-color'].forEach(id =>
  document.getElementById(id).addEventListener('input', filterTable)
);

function filterTable() {
  const name = document.getElementById('filter-name').value.toLowerCase();
  const material = document.getElementById('filter-material').value.toLowerCase();
  const color = document.getElementById('filter-color').value.toLowerCase();

  document.querySelectorAll('#filament-table-body tr').forEach(row => {
    const [n, m, c] = [...row.children].map(td => td.textContent.toLowerCase());
    row.style.display = (n.includes(name) && m.includes(material) && c.includes(color)) ? '' : 'none';
  });
}

// ✏️ Modifica
function editFilament(id, data) {
  document.getElementById('form-title').textContent = '✏️ Modifica Filamento';
  document.getElementById('name').value = data.name;
  document.getElementById('material').value = data.material;
  document.getElementById('color').value = data.color;
  document.getElementById('flowRate').value = data.flowRate || '';
  document.getElementById('td').value = data.td || '';
  document.getElementById('price').value = data.price || '';
  document.getElementById('filament-form').onsubmit = async e => {
    e.preventDefault();
    await db.collection("filaments").doc(id).update(getFormData());
    resetForm();
  };
}

// ➕ Inserimento
document.getElementById('filament-form').onsubmit = async e => {
  e.preventDefault();
  await db.collection("filaments").add(getFormData());
  resetForm();
};

function getFormData() {
  return {
    name: document.getElementById('name').value,
    material: document.getElementById('material').value,
    color: document.getElementById('color').value,
    flowRate: document.getElementById('flowRate').value,
    td: document.getElementById('td').value,
    price: document.getElementById('price').value
  };
}

function resetForm() {
  document.getElementById('filament-form').reset();
  document.getElementById('form-title').textContent = '➕ Aggiungi Nuovo Filamento';
  document.getElementById('filament-form').onsubmit = async e => {
    e.preventDefault();
    await db.collection("filaments").add(getFormData());
    resetForm();
  };
}

// 🗑️ Cancella
function deleteFilament(id) {
  db.collection("filaments").doc(id).delete();
}

// 📄 PDF
function exportPDF(id) {
  const el = document.getElementById(`filament-${id}`);
  html2pdf().from(el).save(`filament-${id}.pdf`);
}

