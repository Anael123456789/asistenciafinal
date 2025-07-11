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

// Generar 50 asistentes de ejemplo local
const carreras = ["Ingeniería", "Administración", "Enfermería", "Diseño", "Psicología"];
const instituciones = ["INACAP", "DUOC UC", "USACH", "UTFSM", "U. de Chile"];

const asistentesEjemplo = Array.from({ length: 50 }, (_, i) => {
  return {
    rut: `${Math.floor(10000000 + Math.random() * 89999999)}-${Math.floor(Math.random() * 10)}`,
    nombre: `Estudiante ${i + 1}`,
    celular: `+569${Math.floor(10000000 + Math.random() * 89999999)}`,
    correo: `estudiante${i + 1}@ejemplo.com`,
    carrera: carreras[Math.floor(Math.random() * carreras.length)],
    institucion: instituciones[Math.floor(Math.random() * instituciones.length)]
  };
});

// Cargar datos desde Firebase y combinar con ejemplos
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
        <td>${data.rut || ""}</td>
        <td>${data.nombre || ""}</td>
        <td>${data.celular || ""}</td>
        <td>${data.correo || ""}</td>
        <td>${data.carrera || ""}</td>
        <td>${data.institucion || ""}</td>
      `;
      tabla.appendChild(fila);
      total++;
    }
  };

  // Primero los locales
  asistentesEjemplo.forEach(agregarFila);

  // Luego los reales desde Firebase
  db.ref("asistentesweb").once("value", (snapshot) => {
    snapshot.forEach((child) => agregarFila(child.val()));
    contador.textContent = `${total} asistentes encontrados`;
  }, (error) => {
    document.getElementById("mensajeError").style.display = "block";
    console.error("Error al cargar datos:", error);
    contador.textContent = `${total} asistentes encontrados (solo ejemplos)`;
  });
}

// Escuchar filtro
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  const filtro = document.getElementById("selectCarrera");
  filtro.addEventListener("change", () => cargarDatos(filtro.value));
});
