// Configuración Firebase
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

// Ejemplos locales (funcionan sin Firebase)
const asistentesEjemplo = [
  {
    rut: "12345678-9",
    nombre: "Ana López",
    celular: "+56911111111",
    correo: "ana@example.com",
    carrera: "Ingeniería",
    institucion: "INACAP"
  },
  {
    rut: "23456789-0",
    nombre: "Carlos Soto",
    celular: "+56922222222",
    correo: "carlos@example.com",
    carrera: "Psicología",
    institucion: "DUOC UC"
  },
  {
    rut: "34567890-1",
    nombre: "María Torres",
    celular: "+56933333333",
    correo: "maria@example.com",
    carrera: "Administración",
    institucion: "U. de Chile"
  }
];

// Función para mostrar datos
function cargarDatos(filtroCarrera = "") {
  const tabla = document.getElementById("tablaDatos");
  const contador = document.getElementById("contador");
  const mensajeError = document.getElementById("mensajeError");

  tabla.innerHTML = "";
  let total = 0;

  const agregarFila = (data) => {
    const carrera = (data.carrera || "").toLowerCase();
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

  // Locales primero
  asistentesEjemplo.forEach(agregarFila);

  // Firebase si está disponible
  db.ref("asistentesweb").once("value").then(snapshot => {
    snapshot.forEach(child => agregarFila(child.val()));
    contador.textContent = `${total} asistentes encontrados`;
  }).catch(() => {
    mensajeError.style.display = "block";
    contador.textContent = `${total} asistentes encontrados (modo local)`;
  });
}

// Iniciar al cargar
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  document.getElementById("selectCarrera").addEventListener("change", (e) => {
    cargarDatos(e.target.value);
  });
});
