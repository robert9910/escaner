const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: e.target.children.user.value,
      password: e.target.children.password.value,
      role: e.target.children.role.value // Agregamos la selección de rol
    })
  });
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);
  const resJson = await res.json();
  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});