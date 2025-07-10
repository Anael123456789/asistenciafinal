// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQC4Orf4OWr8JuDGrmYvSDRSn6FCT6KoU",
  authDomain: "asistenciaqr-10cae.firebaseapp.com",
  databaseURL: "https://asistenciaqr-10cae-default-rtdb.firebaseio.com",
  projectId: "asistenciaqr-10cae",
  storageBucket: "asistenciaqr-10cae.appspot.com",
  messagingSenderId: "1023385957521",
  appId: "1:1023385957521:web:00f39c30ee2aca76503b30",
  measurementId: "G-S1S306BZFK"
};

// Inicializa Firebase
try {
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const tabla = document.getElementById("tablaDatos");
  const mensajeError = document.getElementById("mensajeError");

  database.ref("asistentesweb").on("value", (snapshot) => {
    tabla.innerHTML = "";
    const datos = snapshot.val();

    if (datos) {
      mensajeError.style.display = "none";
      Object.values(datos).forEach(asistente => {
        const fila = `
          <tr>
            <td>${asistente.rut || ""}</td>
            <td>${asistente.nombre || ""}</td>
            <td>${asistente.celular || ""}</td>
            <td>${asistente.correo || ""}</td>
            <td>${asistente.carrera || ""}</td>
            <td>${asistente.institucion || ""}</td>
          </tr>`;
        tabla.innerHTML += fila;
      });
    } else {
      mensajeError.style.display = "block";
      mensajeError.textContent = "No hay datos disponibles.";
    }
  }, (error) => {
    mensajeError.style.display = "block";
    mensajeError.textContent = "Error al conectar a Firebase.";
    console.error(error);
  });

} catch (e) {
  document.getElementById("mensajeError").style.display = "block";
  console.error("Firebase no se pudo inicializar:", e);
}
