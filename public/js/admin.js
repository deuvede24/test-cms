// public/js/admin.js
let editingPage = null;

document.addEventListener("DOMContentLoaded", () => {
  loadPages();
  document
    .getElementById("page-form")
    .addEventListener("submit", handleFormSubmit);
  document.getElementById("cancel-button").addEventListener("click", resetForm);
});

// ===== funciones =====
async function loadPages() {
  try {
    const pages = await webClient.list();
    displayPages(pages);
  } catch (error) {
    alert("Error loading pages");
  }
}

function displayPages(pages) {
  const tbody = document.getElementById("pages-list");
  tbody.innerHTML = pages
    .map((p) => {
      const url = p.ruta === "main" ? "/" : `/${p.ruta}`;
      const canDelete = p.ruta !== "main";
      return `<tr>
      <td><code>${p.ruta}</code></td>
      <td><a href="${url}" target="_blank">Ver</a></td>
      <td>
        <button onclick="editPage('${p.ruta}')">Editar</button>
        ${
          canDelete
            ? `<button class="danger" onclick="deletePage('${p.ruta}')">Borrar</button>`
            : ""
        }
        </td>
      </tr>`;
    })
    .join("");
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const route = document.getElementById("page-route").value.trim();
  const content = document.getElementById("page-content").value;

  if (!route || !content) {
    return alert("Te faltan campos por completar");
  }
  try {
    if (editingPage) {
      await webClient.edit(route, content);
      alert("Página editada");
      resetForm();
    } else {
      await webClient.new(route, content);
      alert("Página creada");
      document.getElementById("page-form").reset();
    }
    loadPages();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function editPage(route) {
  editingPage = route;
  document.getElementById("page-route").value = route;
  document.getElementById("page-route").disabled = true;
  document.getElementById("form-title").textContent = `Editando ${route}`;
  document.getElementById("form-button").textContent = "Actualizar página";
  document.getElementById("cancel-button").style.display = "inline-block";
  try {
    const res = await webClient.get(route);
    document.getElementById("page-content").value = res.ok ? res.html : "";
  } catch {
    alert("Error cargando página");
  }
}
async function deletePage(route) {
  if (!confirm(`¿Seguro que quieres borrar esta página ${route}?`)) {
    return;
  }
  try {
    await webClient.delete(route);
    alert("Página borrada");
    loadPages();
  } catch {
    alert("Error borrando página");
  }
}
function resetForm() {
  editingPage = null;
  document.getElementById("form-title").textContent = "Crear nueva página";
  document.getElementById("form-button").textContent = "Crear página";
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("page-route").disabled = false;
  document.getElementById("page-form").reset();
}
