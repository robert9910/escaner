import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const usuarios = [{
  user: "a",
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2"
}];

async function login(req, res) {
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;
  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (!usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  if (!loginCorrecto) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }
  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  };
  res.cookie("jwt", token, cookieOption);
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
}

async function register(req) {
  const user = req.body.user;
  const password = req.body.password;
  const role = req.body.role;
  if (!user || !password || !role) {
    return { status: "Error", message: "Los campos están incompletos" };
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (usuarioAResvisar) {
    return { status: "Error", message: "Este usuario ya existe" };
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password, salt);
  const nuevoUsuario = {
    user, password: hashPassword, role
  };
  usuarios.push(nuevoUsuario);
  console.log(usuarios);
  return { status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/" };
}

export const methods = {
  login,
  register
};

export function obtenerDatosConductor() {
  // Aquí puedes implementar la lógica para obtener los datos del conductor
  // Por ejemplo, podrías filtrar los usuarios por un cierto rol que represente a los conductores
  const conductores = usuarios.filter(usuario => usuario.role === "conductor");
  
  // Luego, podrías devolver los datos de los conductores en el formato adecuado
  return conductores.map(conductor => {
    return {
      codigoBarras: conductor.codigoBarras,
      horaEscaneo: conductor.horaEscaneo
      // Asegúrate de que los nombres de las propiedades coincidan con lo que espera tu página del gerente
    };
  });
}