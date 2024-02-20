const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = e.target.children.user.value;
  const password = e.target.children.password.value;
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user,
      password
    })
  });
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);
  const resJson = await res.json();
  if (resJson.redirect) {
    // Redirigir a diferentes rutas según el rol
    if (resJson.role === 'conductor') {
      window.location.href = '/conductor'; // Redirigir a la página del conductor
    } else if (resJson.role === 'gerente') {
      window.location.href = '/gerente'; // Redirigir a la página del gerente
    } else {
      window.location.href = '/'; // Redirigir a una página por defecto en caso de un rol desconocido
    }
  }
});