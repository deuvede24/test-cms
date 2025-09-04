// public/js/webClient.js
const webClient = {
  list: async () => {
    const res = await fetch("/api/list");
    const data = await res.json();
    return data.webs;
  },

  get: async (ruta) => {
    const res = await fetch(`/api/get/${encodeURIComponent(ruta)}`);
    return res.json();
  },

  new: async (ruta, texto) => {
    const res = await fetch("/api/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruta, texto }),
    });
    return res.json();
  },

  edit: async (ruta, texto) => {
    const res = await fetch("/api/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruta, texto }),
    });
    return res.json();
  },

  delete: async (ruta) => {
    const res = await fetch(`/api/delete/${encodeURIComponent(ruta)}`, {
      method: "DELETE",
    });
    return res.json();
  },
};
