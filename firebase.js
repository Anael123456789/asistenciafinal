const firebaseConfig = {
  apiKey: "AIzaSyDQC4Orf4OWr8JuDGrmYvSDRSn6FCT6KoU",
  authDomain: "asistenciast-e9ff6.firebaseapp.com",
  databaseURL: "https://asistenciast-e9ff6-default-rtdb.firebaseio.com/",
  projectId: "asistenciast-e9ff6",
  storageBucket: "asistenciast-e9ff6.appspot.com",
  messagingSenderId: "1023385957521",
  appId: "1:1023385957521:web:00f39c30ee2aca76503b30"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔄 Cargar datos con filtros
function cargarDatos(carreraFiltro = "", institucionFiltro = "") {
  const tabla = document.getElementById("tablaDatos");
  const contador = document.getElementById("contador");
  tabla.innerHTML = "";
  let total = 0;

  db.ref("asistentesweb").once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const carrera = data.carrera?.toLowerCase() || "";
      const institucion = data.institucion?.toLowerCase() || "";

      if (
        (carreraFiltro === "" || carrera.includes(carreraFiltro.toLowerCase())) &&
        (institucionFiltro === "" || institucion === institucionFiltro.toLowerCase())
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

// 🧠 Listeners
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();

  const inputCarrera = document.getElementById("inputCarrera");
  const selectInstitucion = document.getElementById("selectInstitucion");

  inputCarrera.addEventListener("input", () => {
    cargarDatos(inputCarrera.value.trim(), selectInstitucion.value);
  });

  selectInstitucion.addEventListener("change", () => {
    cargarDatos(inputCarrera.value.trim(), selectInstitucion.value);
  });
});

// ✅ Puedes llamar esta función desde consola para test
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

    ref.push({ rut, nombre, celular, correo, carrera, institucion });
  }

  alert("✅ 50 registros de ejemplo han sido subidos.");
  cargarDatos();
}
