const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

//  Datos en memoria 
const users = [
     { id: 1, username: "admin", password: bcrypt.hashSync("54321", 8) }
    ,{ id: 2, username: "Sergio", password: bcrypt.hashSync("54321", 8)}
    ,{ id: 3, username: "Roxana", password: bcrypt.hashSync("54321", 8) }
];
let posts = [{ id: 1, title: "Primer Post", content: "¡Hola Mundo!" }];

const SECRET = "supersecretkey";

//  Middleware de autenticación 
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//  Rutas de Autenticación 
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Credenciales Incorrectas, Intente de nuevo." });
  }
  const token = jwt.sign({ username: user.username, id: user.id }, SECRET, { expiresIn: "1m" });
  res.json({ token });
});

//  Rutas de Posts 

// Obtener todos
app.get("/posts", (req, res) => {
  res.json(posts);
});
// Obtener especifico
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "No se ha encontrado un post" });
  res.json(post);
});
// Crear post
app.post("/posts", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);
  res.status(201).json(newPost);
});
// habilitar escucha
app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));