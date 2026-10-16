# AISUNI — publicar corrección en GitHub Pages

1. **Borra** de tu repositorio la carpeta anidada `aisuni-site/` si la creaste.
2. Sube **el contenido de esta carpeta** a la RAÍZ de tu repositorio, preservando las carpetas ocultas `.github/`, `_proyectos/`, `_archivo/` y `_contenido/`. En la raíz deben estar `index.html`, `data.json`, `_config.yml`, y `assets/`.
3. En tu repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Ya no uses **Deploy from a branch** para esta versión.
4. En la pestaña **Actions**, espera a que el flujo **Publicar AISUNI (Jekyll)** termine con marca verde.
5. En **Settings → Pages**, abre **Visit site** y fuerza recarga con Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac).

### Actualización
Añade o modifica archivos `.md` en `_proyectos/`, `_archivo/` y `_contenido/`, haz commit en `main` y GitHub Actions volverá a generar `data.json`.

### Diagnóstico
Si sigue fallando, comparte URL pública del repositorio y URL publicada. `https://usuario.github.io/repositorio/data.json` debe mostrar JSON, no texto Liquid ni error 404.
