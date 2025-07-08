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
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${data.name}</strong> - ${data.material}, ${data.temperature}°C, Flow: ${data.flowRate}, TD: ${data.td}, €${data.price}
      <button onclick="deleteFilament('${doc.id}')">Cancella</button>
    `;
    list.appendChild(li);
  });
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