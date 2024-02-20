// Función para generar datos simulados y enviarlos al servidor
function generarDatosSimulados() {
  // Simulación de datos a enviar
  const datosSimulados = {
    codigo: "123456",
    hora: new Date().toLocaleTimeString()
  };

  // Enviar los datos al servidor utilizando fetch
  fetch('/datos', {
    method: 'POST', // O cambia a 'GET' si el servidor está configurado para recibir datos de esta manera
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosSimulados)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ocurrió un error al enviar los datos al servidor.');
    }
    return response.json();
  })
  .then(data => {
    console.log('Respuesta del servidor:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Función para cerrar sesión
function cerrarSesion() {
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.location.href = "/";
}

// Asignar evento al botón de generar datos
document.getElementById("generarDatosBtn").addEventListener("click", generarDatosSimulados);
document.getElementById("cerrarSesionBtn").addEventListener("click", cerrarSesion);