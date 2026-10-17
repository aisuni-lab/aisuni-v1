# AISUNI V3 — Publicar y mantener

1. En GitHub elimina la versión antigua del repositorio y sube TODO el contenido de este ZIP a la **raíz** (incluida la carpeta oculta `.github/workflows/publish.yml`). Evita mantener archivos antiguos duplicados en `_proyectos` o `_archivo`.
2. Ve a Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. En Actions abre **Publicar AISUNI (Jekyll)**; espera las fases `build` y `deploy` verdes. Si falla el paso **Verificar que Markdown se compiló**, mira su mensaje para saber qué entrada necesita corrección.
4. Abre el sitio, recarga con Cmd+Shift+R.

## Contenidos

- `_contenido/portada.md`: `title` es el titular y el texto después de la segunda línea `---` es la descripción. `image: ""` oculta la imagen del encabezado; cambia a `image: "assets/images/mi-foto.webp"` si deseas mostrarla.
- `_contenido/info.md` y `_contenido/contacto.md`: información y contacto.
- `_proyectos/01-nombre.md`, `_proyectos/02-nombre.md`, ... y `_archivo/01-nombre.md`: proyectos y piezas. Mantén `num: "01"`, `num: "02"`, etc. en cada archivo. El número **dentro del Markdown** determina el orden, NO el nombre del archivo; mantén ambos consistentes. Para 100+ entradas utiliza `num: "0100"`, o números de cuatro dígitos en toda la colección para orden lexicográfico estable.
- `assets/images`: imágenes. En la cabecera de cada `.md` usa `image: "assets/images/nombre.webp"` y una lista `gallery` para la galería.
- Los cambios solo se verán en el sitio cuando **Actions termine y despliegue**. `data.json` NO se edita a mano: se compila desde los `.md`.

## Si no aparecen cambios

Revisa 1) que editaste la rama `main` del repositorio publicado, 2) que el archivo está en la carpeta correcta y termina en `.md`, 3) que hay `---` de apertura y cierre en el front matter, 4) que **Actions** no tiene errores y **Pages** usa GitHub Actions, 5) que no quedó un `data.json` antiguo publicado por otro flujo.

## Comprobación práctica

Cambia un título, haz commit, espera Actions verde y abre `https://USUARIO.github.io/REPOSITORIO/data.json`. Busca el título modificado. Crea luego un archivo `07-prueba.md` con `num: "07"`, `id` único, `title`, `category`, `year`, `image` válido y `---` antes y después de metadatos; el contador debe aumentar en uno después del siguiente despliegue.
