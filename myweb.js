const fs = require("fs").promises;
const path = require("path");

const webDir = path.join(__dirname, "web");
const indexPath = path.join(__dirname, "webs.json");

async function ensureSetup() {
  await fs.mkdir(webDir, { recursive: true });

  try {
    await fs.access(indexPath);
  } catch {
    const initialData = { webs: [{ ruta: "main", file: "web/main.html" }] };
    await fs.writeFile(indexPath, JSON.stringify(initialData, null, 2), "utf8");
  }

  const mainPath = path.join(webDir, "main.html");
  try {
    await fs.access(mainPath);
  } catch {
    await fs.writeFile(
      mainPath,
      "<h1>Página principal</h1><p>Edita esta página en /admin</p>",
      "utf8"
    );
  }
}

async function readIndex() {
  const raw = await fs.readFile(indexPath, "utf8");
  return JSON.parse(raw);
}

async function writeIndex(data) {
  await fs.writeFile(indexPath, JSON.stringify(data, null, 2), "utf8");
}

// Módulo principal
const myWeb = {
  init: ensureSetup,

  list: async () => {
    const index = await readIndex();
    return index.webs;
  },

  new: async (id, texto = "") => {
    const slug = id === "main" ? "main" : simpleSlug(id);
    const fileName = `${slug}.html`;
    const filePath = path.join(webDir, fileName);

    await fs.writeFile(filePath, texto, "utf8");

    const index = await readIndex();
    index.webs.push({ ruta: slug, file: `web/${fileName}` });
    await writeIndex(index);
  },

  edit: async (id, texto = "") => {
    const fileName = `${id}.html`;
    const filePath = path.join(webDir, fileName);
    await fs.writeFile(filePath, texto, "utf8");
  },

  delete: async (id) => {
    if (id === "main")
      throw new Error("No se puede eliminar la página principal");

    const index = await readIndex();
    const i = index.webs.findIndex((w) => w.ruta === id);

    if (i !== -1) {
      const fileName = `${id}.html`;
      const filePath = path.join(webDir, fileName);
      try {
        await fs.unlink(filePath);
      } catch {}
      index.webs.splice(i, 1);
      await writeIndex(index);
    }
  },

  get: async (id) => {
    try {
      const fileName = `${id}.html`;
      const filePath = path.join(webDir, fileName);
      return await fs.readFile(filePath, "utf8");
    } catch {
      return null;
    }
  },
};

function simpleSlug(str) {
  return String(str).toLowerCase().trim().replace(/\s+/g, "-");
}

module.exports = myWeb;
