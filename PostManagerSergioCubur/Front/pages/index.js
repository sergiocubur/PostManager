import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Home() {
  // Estados generales
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [token, setToken] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Estados para login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Cargar posts al iniciar
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error: No se pudo obtener:", err);
    }
  };

  const fetchPostById = async (id) => {
    try {
      const res = await api.get(`/posts/${id}`);
      setSelectedPost(res.data);
    } catch {
      alert("No se ha encontrado el post");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) return alert("¡Debes iniciar sesión!");
    try {
      await api.post(
        "/posts",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setContent("");
      fetchPosts();
    } catch {
      alert("Error: No se ha creado el post");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) return alert("Ingresa usuario y contraseña");
    try {
      const res = await api.post("/login", { username, password });
      setToken(res.data.token);
      alert("Sesión iniciada!");
      setUsername("");
      setPassword("");
    } catch {
      alert("Error de login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Post Manager</h1>

      {/* Login */}
      {!token && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ingresar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      {token && (
        <div className="flex justify-center mb-6">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-2xl bg-white p-4 rounded-lg shadow"
          >
            
            <input
              type="text"
              placeholder="Titulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />
            <textarea
              className="w-full border rounded p-3 mb-2 resize-none"
              placeholder="Que quieres contarnos..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Publicar
            </button>
          </form>
        </div>
      )}

      {/* Layout: Tarjetas y contenido*/}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Tarjetas */}
        <div className="lg:w-1/2 grid grid-cols-1 gap-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => fetchPostById(p.id)}
            >
              <h2 className="font-bold text-lg mb-2">{p.title}</h2>
              <p className="text-gray-700 text-sm">
                {p.content.length > 60
                  ? p.content.substring(0, 60) + "..."
                  : p.content}
              </p>
            </div>
          ))}
        </div>

        {/* Post selected */}
        {selectedPost && (
          <div className="lg:w-1/2 bg-yellow-100 p-6 rounded-xl shadow-lg">
            <h2 className="font-bold text-xl mb-2">{selectedPost.title}</h2>
            <p className="text-gray-800">{selectedPost.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
