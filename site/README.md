# Claqueta Digital

PWA de claqueta digital con QR para rodajes. Funciona 100% offline una vez cargada
(la librería de generación de QR está incrustada en `index.html`).

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado), por ejemplo
   `claqueta-digital`.
2. Sube el contenido de esta carpeta (`index.html`, `manifest.json`, `icons/`) a la
   raíz del repositorio.
3. En el repositorio: **Settings → Pages → Source**, selecciona la rama `main` y
   carpeta `/ (root)`. Guarda.
4. Tras un minuto, GitHub te dará una URL del tipo:
   `https://<tu-usuario>.github.io/claqueta-digital/`

## Comandos para subirlo desde terminal

```bash
cd claqueta-digital   # carpeta con index.html, manifest.json, icons/
git init
git add .
git commit -m "Claqueta digital v1"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/claqueta-digital.git
git push -u origin main
```

Luego activa GitHub Pages como en el paso 3.

## Uso en el iPhone

1. Abre la URL de GitHub Pages en Safari.
2. Botón "Compartir" → **Añadir a pantalla de inicio**.
3. Abre la app desde el icono de pantalla de inicio: se ejecuta a pantalla
   completa, sin barras de Safari.

## Actualizaciones

Cada vez que se suba un nuevo `index.html` al repo, los usuarios verán la
versión nueva al recargar (Safari cachea agresivamente las PWA instaladas;
si no se actualiza, cerrar la app desde el multitarea y volver a abrirla).
