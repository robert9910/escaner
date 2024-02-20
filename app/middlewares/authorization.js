import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "./../controllers/authentication.controller.js";

dotenv.config();

function soloAdmin(req, res, next) {
  const logueado = revisarCookie(req);
  if (logueado) return next();
  return res.redirect("/");
}

function soloPublico(req, res, next) {
  const logueado = revisarCookie(req);
  if (!logueado) return next();
  const usuarioAResvisar = obtenerUsuario(req);
  if (!usuarioAResvisar) return res.redirect("/");

  // Redirigir según el rol del usuario
  if (usuarioAResvisar.role === 'conductor') {
    return res.redirect("/admin/conductor");
  } else if (usuarioAResvisar.role === 'gerente') {
    return res.redirect("/admin/gerente");
  } else {
    return res.redirect("/");
  }
}

function revisarCookie(req) {
  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    if (!usuarioAResvisar) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function obtenerUsuario(req) {
  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    return usuarios.find(usuario => usuario.user === decodificada.user);
  } catch {
    return null;
  }
}

export const methods = {
  soloAdmin,
  soloPublico,
};