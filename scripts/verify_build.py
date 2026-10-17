#!/usr/bin/env python3
"""Verify Jekyll data publication. Missing media warns but never blocks markdown edits."""
import json, pathlib, sys, re
site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
file = site / 'data.json'
if not file.is_file():
    sys.exit('ERROR: Jekyll no generó _site/data.json')
try:
    data = json.loads(file.read_text(encoding='utf-8'))
except (ValueError, OSError) as exc:
    sys.exit(f'ERROR: data.json inválido: {exc}')
for key, folder in (('proyectos','_proyectos'), ('archivo','_archivo')):
    collection = data.get(key)
    if not isinstance(collection, list):
        sys.exit(f'ERROR: {key} no es un array en data.json')
    expected = len(list(pathlib.Path(folder).glob('*.md')))
    if len(collection) != expected:
        print(f'::warning::{key}: hay {expected} archivos .md y {len(collection)} entradas publicadas. Revisar el YAML de los archivos nuevos.')
    for item in collection:
        if not item.get('title'):
            print(f'::warning::{key}: entrada sin título: {item.get("id", "?")}')
        paths = ([item.get('image')] + list(item.get('gallery') or []))
        for medium in item.get('media') or []:
            if isinstance(medium, dict):
                paths.extend([medium.get('src'), medium.get('poster')])
        for p in paths:
            if not isinstance(p, str) or not p or re.match(r'^(https?:)?//', p):
                continue
            if not (site / p.lstrip('/')).is_file():
                print(f'::warning::Imagen o vídeo local no encontrado: {p} (obra: {item.get("title", "?")}). La publicación continuará.')
content = data.get('content')
if not isinstance(content, dict):
    print('::warning::No se encontró el objeto content; revisar data.json y _contenido/')
else:
    for key in ('portada','info','contacto'):
        if key not in content:
            print(f'::warning::Falta _contenido/{key}.md o no fue compilado')
print(f'OK: JSON válido; {len(data["proyectos"])} proyectos y {len(data["archivo"])} entradas de archivo.')
