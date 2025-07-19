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

// Datos locales (fallback)
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
    institucion: "Universidad de Chile"
  }
];

let datosCompletos = [];

function cargarDatos() {
  const tabla = document.getElementById("tablaDatos");
  const mensajeError = document.getElementById("mensajeError");

  tabla.innerHTML = "";
  datosCompletos = [];

  const agregarDatos = (data) => {
    datosCompletos.push(data);
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
  };

  // Local
  asistentesEjemplo.forEach(agregarDatos);

  // Firebase
  db.ref("asistentesweb").once("value").then(snapshot => {
    snapshot.forEach(child => agregarDatos(child.val()));
    actualizarFiltros();
    aplicarFiltros();
  }).catch(() => {
    mensajeError.style.display = "block";
    actualizarFiltros();
    aplicarFiltros();
  });
}

function actualizarFiltros() {
  const selectCarrera = document.getElementById("selectCarrera");
  const selectInstitucion = document.getElementById("selectInstitucion");

  const carreras = [...new Set(datosCompletos.map(d => d.carrera).filter(Boolean))];
  const instituciones = [...new Set(datosCompletos.map(d => d.institucion).filter(Boolean))];

  selectCarrera.innerHTML = `<option value="">Todas</option>` + carreras.sort().map(c => `<option value="${c}">${c}</option>`).join("");
  selectInstitucion.innerHTML = `<option value="">Todas</option>` + instituciones.sort().map(i => `<option value="${i}">${i}</option>`).join("");
}

function aplicarFiltros() {
  const carreraFiltro = document.getElementById("selectCarrera").value.toLowerCase();
  const institucionFiltro = document.getElementById("selectInstitucion").value.toLowerCase();
  const letra = document.getElementById("ordenLetra").value.toLowerCase();
  const tabla = document.getElementById("tablaDatos");
  const contador = document.getElementById("contador");

  let total = 0;
  const filas = tabla.querySelectorAll("tr");

  filas.forEach(fila => {
    const nombre = fila.children[1].textContent.toLowerCase();
    const carrera = fila.children[4].textContent.toLowerCase();
    const institucion = fila.children[5].textContent.toLowerCase();

    const apellido = nombre.split(" ")[1] || "";
    const coincideCarrera = !carreraFiltro || carrera.includes(carreraFiltro);
    const coincideInstitucion = !institucionFiltro || institucion.includes(institucionFiltro);
    const coincideLetra = !letra || apellido.startsWith(letra);

    if (coincideCarrera && coincideInstitucion && coincideLetra) {
      fila.style.display = "";
      total++;
    } else {
      fila.style.display = "none";
    }
  });

  contador.textContent = `${total} asistentes encontrados`;
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  document.getElementById("selectCarrera").addEventListener("change", aplicarFiltros);
  document.getElementById("selectInstitucion").addEventListener("change", aplicarFiltros);
  document.getElementById("ordenLetra").addEventListener("input", aplicarFiltros);
});
