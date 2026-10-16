# AISUNI — Archivo activo

Sitio editorial en una sola página, con Jekyll y colecciones Markdown, compatible con GitHub Pages.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `aisuni`). Sube **todos los archivos y carpetas**, incluidos los nombres que empiezan con `_`.
2. En **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)** y guarda.
3. Si el repositorio está en `usuario.github.io/aisuni/`, edita `_config.yml` y establece `baseurl: "/aisuni"`. Si está en el dominio raíz o usas un dominio personalizado, deja `baseurl: ""` y configura `url` según tu dominio.
4. GitHub Pages compila `data.json` automáticamente a partir de los Markdown en cada commit a `main`. La publicación puede tardar unos minutos.

## Añadir un proyecto

En GitHub abre `_proyectos` → **Add file → Create new file**, crea por ejemplo `mi-proyecto.md` y copia la estructura de cualquier archivo existente. Cambia `id` (único), `num`, `title`, `category`, `year`, `image`, `gallery` y textos. Haz **Commit changes**: el proyecto aparecerá tras el deploy. Para una pieza de archivo, haz lo mismo en `_archivo`.

El cuerpo Markdown debe contener `## Concepto` y `## Proceso`. Los metadatos van entre las dos líneas `---` iniciales. Los datos se convierten en JSON en build time; nunca editas `index.html` para añadir contenidos. `num` establece el orden de clasificación; usa numeraciones de longitud coherente (`01`, `02`, `03`...).

## Multimedia y formatos

Coloca imágenes en `assets/` y referencia su ruta relativa sin barra inicial (`assets/mi-imagen.webp`). Las imágenes mantienen su aspecto original en el visor (`object-fit: contain`), aunque las vistas previas se recortan para conservar un índice ordenado.

Para mezclar fotos y videos en una ficha usa `media` **en lugar de** `gallery`:

```yaml
media:
  - type: image
    src: "assets/mi-foto-vertical.webp"
    alt: "Descripción de la imagen"
  - type: image
    src: "assets/mi-foto-horizontal.jpg"
  - type: mp4
    src: "assets/mi-video.mp4"
    poster: "assets/poster.webp"
  - type: youtube
    src: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  - type: vimeo
    src: "https://vimeo.com/76979871"
```

Los links ilustrativos de YouTube/Vimeo son ejemplos de formato, no videos de AISUNI. No se incluyen en los proyectos demo. El reproductor requiere que el dueño del video permita incrustarlo. Para videos pesados se recomienda alojamiento externo: GitHub Pages tiene límites de almacenamiento y transferencia.

## Editar textos y enlaces

- `_contenido/portada.md`: manifiesto.
- `_contenido/info.md`: información, metodología, tags e imagen.
- `_contenido/contacto.md`: email y enlaces sociales. Los links que vienen por defecto son **placeholders** y debes sustituirlos por tus cuentas reales.
- `_config.yml`: configuración de GitHub Pages y URL base.

Las imágenes SVG que se incluyen son **placeholders generados** para facilitar pruebas y no pretenden ser obras reales ni documentación de los proyectos.

## Desarrollo local y pruebas

Instala Ruby + Bundler y corre `bundle install && bundle exec jekyll serve`, luego abre `http://localhost:4000/`. El archivo `index.html` necesita servidor: GitHub Pages no se emula haciendo doble clic en el HTML porque Jekyll debe compilar Liquid/Markdown. Para ver la pantalla sin Jekyll, el repositorio incluye un archivo `preview.html` con un snapshot de demostración (no es fuente editorial, ni debe publicarse como página principal).

## Consideraciones

- El buscador/filtros filtra la colección entera cargada en memoria, sin límite de elementos impuesto por código; conjuntos enormes pueden requerir paginación en el futuro.
- Edición de Markdown dispara la recompilación automática desde la rama configurada.
- La web carga fuentes desde Google Fonts y videos externos desde su proveedor. Todo el resto es estático.
- Revisa el contenido editorial demo y reemplaza SVGs/links de ejemplo antes del lanzamiento público.
