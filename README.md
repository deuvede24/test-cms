# Test CMS (Mini CMS) – Node.js + Express + Handlebars

Mini CMS hecho con **Node.js + Express** y plantillas **Handlebars (hbs)**.  
Permite **crear, editar, listar y borrar páginas** desde un panel `/admin`, y luego verlas publicadas como rutas normales (`/:slug`).

✅ Deploy en Render: la app está online y se puede probar desde el navegador.

---

## Demo (Render)
- Home: `/`
- Panel admin: `/admin`

> Nota: en Render (plan free) puede tardar un poquito en “despertar” si llevaba tiempo sin visitas.

---

## Qué puedes hacer como usuario
1. Entras en **Home (`/`)** y ves la página principal.
2. Entras en **Admin (`/admin`)** y gestionas páginas:
   - Crear una página nueva (ej: `about`)
   - Editar contenido HTML
   - Borrar páginas
3. Después accedes a la página por URL:
   - `/about`
   - `/contact`
   - etc.

---

## Cómo funciona por dentro (muy simple)
- Las páginas se guardan como archivos HTML en la carpeta `web/`
- El listado de páginas/rutas se guarda en `webs.json`
- El servidor renderiza:
  - `views/page.hbs` para mostrar el contenido
  - `views/admin.hbs` para el panel

---

## Endpoints (API REST)
- `GET /api/list` → lista páginas
- `POST /api/new` → crea página `{ ruta, texto }`
- `PUT /api/edit` → edita página `{ ruta, texto }`
- `DELETE /api/delete/:ruta` → borra página
- `GET /api/get/:ruta` → devuelve HTML crudo de una página

---

## Instalación (local)
Requisitos: Node.js

```bash
npm install
npm start
