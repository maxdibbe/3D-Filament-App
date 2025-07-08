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

async function loadFilaments() {
  list.innerHTML = '';
  const snapshot = await db.collection('filaments').get();
  snapshot.forEach(doc => {
    const data = doc.data();
   // Dentro il ciclo di creazione degli elementi DOM
let container = document.createElement('div');
container.id = `filament-${doc.id}`;
container.innerHTML = `
  <h3>${data.name}</h3>
  <p>Materiale: ${data.material}</p>
  <p>Colore: ${data.color}</p>
  <!-- Altri dati -->
  <button onclick="exportPDF('${doc.id}')">📄 Esporta in PDF</button>
`;
listContainer.appendChild(container);

  });
}
function exportPDF(id) {
  const element = document.getElementById(`filament-${id}`);
  if (element) {
    html2pdf().set({
      margin: 10,
      filename: `filament-${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  } else {
    alert("Impossibile esportare: elemento non trovato.");
  }
}

function editFilament(id, data) {
  document.getElementById('name').value = data.name;
  // … riempi gli altri campi
  form.onsubmit = async e => {
    e.preventDefault();
    await db.collection('filaments').doc(id).update({
      name: ..., material: ..., // etc.
    });
    form.reset();
    form.onsubmit = addNew;
    loadFilaments();
  };
}
function deleteFilament(id) {
  db.collection('filaments').doc(id).delete().then(loadFilaments);
}



async function deleteFilament(id) {
  await db.collection('filaments').doc(id).delete();
  loadFilaments();
}

auth.onAuthStateChanged(user => {
  if (user) {
    loadFilaments();
  } else {
    window.location.href = "index.html";
  }
});