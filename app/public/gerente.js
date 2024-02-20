// Función para mostrar los datos recibidos en la página
function mostrarDatosRecibidos(datos) {
  const datosEscaneadosDiv = document.getElementById("datosEscaneados");
  datosEscaneadosDiv.innerHTML = `<p><strong>Código:</strong> ${datos.codigo}</p><p><strong>Hora:</strong> ${datos.hora}</p>`;
}

// Función para cerrar sesión
function cerrarSesion() {
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.location.href = "/";
}

// Asignar evento al botón de cerrar sesión
document.getElementById("cerrarSesionBtn").addEventListener("click", cerrarSesion);

// Realizar solicitud al servidor para obtener los datos
function obtenerDatos() {
  fetch('/datos') // Ruta donde el servidor está escuchando para recibir los datos
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos del servidor.');
    }
    return response.json();
  })
  .then(data => {
    mostrarDatosRecibidos(data); // Llamar a la función para mostrar los datos recibidos
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Llamar a la función para obtener los datos cuando la página se carga
window.addEventListener("load", obtenerDatos);