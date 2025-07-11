const firebaseConfig = {
  apiKey: "AIzaSyDQC4Orf4OWr8JuDGrmYvSDRSn6FCT6KoU",
  authDomain: "asistenciaqr-10cae.firebaseapp.com",
  databaseURL: "https://asistenciast-e9ff6-default-rtdb.firebaseio.com/",
  projectId: "asistenciast-e9ff6",
  storageBucket: "asistenciaqr-10cae.appspot.com",
  messagingSenderId: "1023385957521",
  appId: "1:1023385957521:web:00f39c30ee2aca76503b30",
  measurementId: "G-S1S306BZFK"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tablaDatos = document.getElementById("tablaDatos");
const filtroCarrera = document.getElementById("filtroCarrera");

function cargarAsistentes(filtro = "") {
  database.ref("asistentesweb").on("value", (snapshot) => {
    tablaDatos.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
      const asistente = childSnapshot.val();
      if (!filtro || asistente.carrera.toLowerCase().includes(filtro.toLowerCase())) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${asistente.rut}</td>
          <td>${asistente.nombre}</td>
          <td>${asistente.celular || ""}</td>
          <td>${asistente.correo || ""}</td>
          <td>${asistente.carrera || ""}</td>
          <td>${asistente.institucion || ""}</td>
        `;
        tablaDatos.appendChild(fila);
      }
    });
  }, (error) => {
    console.error("Error al leer desde Firebase:", error);
    document.getElementById("mensajeError").textContent = "Error al conectar con Firebase.";
  });
}

// Filtrar al escribir en el input
filtroCarrera.addEventListener("input", () => {
  const filtro = filtroCarrera.value.trim();
  cargarAsistentes(filtro);
});

// Cargar todos al inicio
cargarAsistentes();
