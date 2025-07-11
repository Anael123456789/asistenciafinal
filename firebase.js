const firebaseConfig = {
  apiKey: "AIzaSyDQC4Orf4OWr8JuDGrmYvSDRSn6FCT6KoU",
  authDomain: "asistenciaqr-10cae.firebaseapp.com",
  databaseURL: "https://asistenciast-e9ff6-default-rtdb.firebaseio.com/",
  projectId: "asistenciast-e9ff6",
  storageBucket: "asistenciaqr-10cae.appspot.com",
  messagingSenderId: "1023385957521",
  appId: "1:1023385957521:web:00f39c30ee2aca76503b30"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Función para cargar datos con filtro por carrera
function cargarDatos(carreraFiltro = "") {
  const tabla = document.getElementById("tablaDatos");
  const contador = document.getElementById("contador");
  tabla.innerHTML = "";
  let total = 0;

  db.ref("asistentesweb").once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const carrera = data.carrera?.toLowerCase() || "";

      if (
        carreraFiltro === "" ||
        carrera.includes(carreraFiltro.toLowerCase())
      ) {
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
    });
    contador.textContent = `${total} asistentes encontrados`;
  }, (error) => {
    document.getElementById("mensajeError").style.display = "block";
    console.error("Error al cargar datos:", error);
  });
}

// Filtro en tiempo real
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();

  const input = document.getElementById("inputCarrera");
  input.addEventListener("input", () => {
    const filtro = input.value.trim();
    cargarDatos(filtro);
  });
});

// Función para subir 50 asistentes falsos
function generarYSubirEjemplos() {
  const carreras = ["Ingeniería", "Administración", "Enfermería", "Diseño", "Psicología"];
  const instituciones = ["INACAP", "DUOC UC", "USACH", "UTFSM", "U. de Chile"];
  const ref = db.ref("asistentesweb");

  for (let i = 1; i <= 50; i++) {
    const rut = `${Math.floor(10000000 + Math.random() * 89999999)}-${Math.floor(Math.random() * 10)}`;
    const nombre = `Estudiante ${i}`;
    const celular = `+569${Math.floor(10000000 + Math.random() * 89999999)}`;
    const correo = `estudiante${i}@ejemplo.com`;
    const carrera = carreras[Math.floor(Math.random() * carreras.length)];
    const institucion = instituciones[Math.floor(Math.random() * instituciones.length)];

    const nuevoAsistente = {
      rut,
      nombre,
      celular,
      correo,
      carrera,
      institucion
    };

    ref.push(nuevoAsistente);
  }

  alert("✅ 50 registros de ejemplo han sido subidos.");
  cargarDatos(); // refresca la tabla
}
