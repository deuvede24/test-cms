const express = require("express");
const path = require("path");
require("hbs");
const myWeb = require("./myweb");

const app = express();
//const PORT = 3000;

const PORT = process.env.PORT || 3000;

//View engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
myWeb.init();

//Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ===== API REST =====

// Listar páginas
app.get("/api/list", async (req, res) => {
  try {
    const webs = await myWeb.list();
    res.json({ ok: true, webs });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Crear nueva página
app.post("/api/new", async (req, res) => {
  try {
    const { ruta, texto } = req.body;
    await myWeb.new(ruta, texto || "");
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Editar página existente
app.put("/api/edit", async (req, res) => {
  try {
    const { ruta, texto } = req.body;
    await myWeb.edit(ruta, texto || "");
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Borrar página
app.delete("/api/delete/:ruta", async (req, res) => {
  try {
    await myWeb.delete(req.params.ruta);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Extra opcional: devolver HTML crudo de una página (para Fase 3)
app.get("/api/get/:ruta", async (req, res) => {
  try {
    const html = await myWeb.get(req.params.ruta);
    if (!html)
      return res.status(404).json({ ok: false, error: "No encontrada" });
    res.json({ ok: true, html });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

//Rutas
app.get("/", async (req, res) => {
  try {
    const mainContent = await myWeb.get("main");
    res.render("page", {
      title: "Página principal",
      bodyHtml: mainContent || "<h1>Bienvenidos</h1>",
    });
  } catch {
    res.render("page", {
      title: "Página principal",
      bodyHtml: "<h1>Error al cargar</h1>",
    });
  }
});

app.get("/admin", (req, res) => {
  res.render("admin", { title: "Panel de administración" });
});

app.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    if (slug === "admin" || slug.startsWith("api")) {
      return res.status(404).send("No encontrada");
    }
    const html = await myWeb.get(slug);
    if (!html) return res.status(404).send("Página no encontrada");
    res.render("page", { title: slug, bodyHtml: html });
  } catch {
    res.status(500).send("Error del servidor");
  }
});

//Iniciar servidor
/*app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});*/
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
