import express from 'express'; // Importar Express
import cookieParser from 'cookie-parser'; // Importar cookie-parser para manejar cookies
import path from 'path'; // Importar path para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Importar fileURLToPath para obtener la ruta del directorio actual
import { methods as authentication } from "./controllers/authentication.controller.js"; // Importar métodos de autenticación desde el controlador de autenticación
import { methods as authorization } from "./middlewares/authorization.js"; // Importar métodos de autorización desde el middleware de autorización
import mongoose from 'mongoose'; // Importar Mongoose para la conexión a la base de datos MongoDB
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno desde el archivo .env

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Obtener la ruta del directorio actual
const app = express(); // Crear una aplicación Express
const port = process.env.PORT || 4000; // Puerto en el que la aplicación escuchará las solicitudes, se toma de las variables de entorno o se usa 4000 como valor predeterminado

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a la base de datos MongoDB en la nube');
}).catch((error) => {
  console.error('Error de conexión a MongoDB:', error);
});

// Manejar eventos de conexión y error de MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a la base de datos MongoDB');
});

// Configuración de la aplicación
app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos desde el directorio 'public'
app.use(express.json()); // Middleware para analizar JSON en las solicitudes
app.use(cookieParser()); // Middleware para analizar cookies en las solicitudes

// Rutas para la aplicación web
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages/login.html")));
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages/register.html")));
app.get("/admin/gerente", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages/admin/gerente.html")));
app.get("/admin/conductor", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages/admin/conductor.html")));

// Rutas para autenticación y registro de usuarios
app.post("/api/login", authentication.login);
app.post("/api/register", async (req, res) => {
  try {
    const registerResult = await authentication.register(req);
    if (registerResult.status === "ok") {
      res.json(registerResult);
    } else {
      res.status(400).json(registerResult);
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ status: "Error", message: "Error en el servidor" });
  }
});

// Ruta para recibir datos desde el cliente
app.post("/datos", (req, res) => {
  // Aquí deberías manejar los datos recibidos desde el cliente
  const datosRecibidos = req.body;
  console.log('Datos recibidos del cliente:', datosRecibidos);
  
  // Enviar una respuesta con los datos recibidos
  res.json(datosRecibidos);
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
  console.log("Servidor corriendo en puerto", port);
});