const firebaseConfig = {
  apiKey: "AIzaSyDQC4Orf4OWr8JuDGrmYvSDRSn6FCT6KoU",
  authDomain: "asistenciaqr-10cae.firebaseapp.com",
  databaseURL: "https://asistenciast-e9ff6-default-rtdb.firebaseio.com/",
  projectId: "asistenciast-e9ff6",
  storageBucket: "asistenciaqr-10cae.appspot.com",
  messagingSenderId: "1023385957521",
  appId: "1:1023385957521:web:00f39c30ee2aca76503b30"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ▶️ 50 registros de ejemplo LOCAL (no se suben a Firebase)
const carreras = ["Ingeniería", "Administración", "Enfermería", "Diseño", "Psicología"];
const instituciones = ["INACAP", "DUOC UC", "USACH", "UTFSM", "U. de Chile"];

const asistentesEjemplo = Array.from({ length: 50 }, (_, i) => ({
  rut: `1111111${i}-K`,
  nombre: `Ejemplo ${i + 1}`,
  celular: `+5691234567${i % 10}`,
  correo: `ejemplo${i + 1}@correo.com`,
  carrera: carreras[i % carreras.length],
  institucion: instituciones[i % instituciones.length]
}));

function cargarDatos(filtroCarrera = "") {
  const tabla = document.getElementById("tablaDatos");
  const contador = document.getElementById("contador");
  tabla.innerHTML = "";
  let total = 0;

  const agregarFila = (data) => {
    const carrera = data.carrera?.toLowerCase() || "";
    if (filtroCarrera === "" || carrera.includes(filtroCarrera.toLowerCase())) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${data.rut}</td>
        <td>${data.nombre}</td>
        <td>${data.celular}</td>
        <td>${data.correo}</td>
        <td>${data.carrera}</td>
        <td>${data.institucion}</td>
      `;
      tabla.appendChild(fila);
      total++;
    }
  };

  // Primero los registros locales
  asistentesEjemplo.forEach(agregarFila);

  // Luego los de Firebase
  db.ref("asistentesweb").once("value").then((snapshot) => {
    snapshot.forEach((child) => agregarFila(child.val()));
    contador.textContent = `${total} asistentes encontrados`;
  }).catch((error) => {
    document.getElementById("mensajeError").style.display = "block";
    contador.textContent = `${total} asistentes encontrados (sin conexión a Firebase)`;
    console.error("Firebase error:", error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  document.getElementById("selectCarrera").addEventListener("change", (e) => {
    cargarDatos(e.target.value);
  });
});
