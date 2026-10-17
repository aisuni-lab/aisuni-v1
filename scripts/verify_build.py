#!/usr/bin/env python3
"""Check that Jekyll generated a valid, complete data.json on every deployment."""
import json,sys,pathlib,re
site=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '_site')
file=site/'data.json'
assert file.exists(), 'Jekyll did not generate _site/data.json'
data=json.loads(file.read_text(encoding='utf-8'))
for key,folder in [('proyectos','_proyectos'),('archivo','_archivo')]:
  expected=len(list(pathlib.Path(folder).glob('*.md')))
  actual=len(data.get(key,[]))
  assert expected==actual, f'{key}: {expected} markdown files but {actual} entries in generated JSON'
  for item in data[key]:
    assert item.get('id') and item.get('title') and item.get('num'), f'Incomplete item: {item}'
    image=item.get('image','')
    if image and not re.match(r'^https?://', image):
      assert (site/image.lstrip('/')).exists(), f'Missing local image: {image}'
    for media in item.get('gallery') or []:
      if isinstance(media,str) and not re.match(r'^https?://',media):
        assert (site/media.lstrip('/')).exists(), f'Missing gallery image: {media}'
assert data.get('content',{}).get('portada',{}).get('body'), 'Missing Markdown portada content'
print(f'Build OK: {len(data["proyectos"])} projects, {len(data["archivo"])} archive entries; portada loaded')
