---
id: "machine-learning-2019-2021"
num: "01"
title: "Machine Learning / 2019–2021"
category: "Algoritmos"
categoryTag: "Algoritmos & procesos"
year: "2019–2021"
client: "Independiente"
image: "assets/archivo/01-machine-learning-2019-2021/01-yaku-01-poster.jpg"
tools: "Machine Learning, StyleGAN2-ADA, StyleGAN3"
status: "Terminado"
media:
  - type: mp4
    src: "assets/archivo/01-machine-learning-2019-2021/01-yaku-01.mp4"
    poster: "assets/archivo/01-machine-learning-2019-2021/01-yaku-01-poster.jpg"
  - type: mp4
    src: "assets/archivo/01-machine-learning-2019-2021/02-yaku-ii-03.mp4"
    poster: "assets/archivo/01-machine-learning-2019-2021/02-yaku-ii-03-poster.jpg"
  - type: mp4
    src: "assets/archivo/01-machine-learning-2019-2021/03-mars-is-gone.mp4"
    poster: "assets/archivo/01-machine-learning-2019-2021/03-mars-is-gone-poster.jpg"
  - type: mp4
    src: "assets/archivo/01-machine-learning-2019-2021/04-third-eye-bridge.mp4"
    poster: "assets/archivo/01-machine-learning-2019-2021/04-third-eye-bridge-poster.jpg"
  - type: mp4
    src: "assets/archivo/01-machine-learning-2019-2021/05-llanganates.mp4"
    poster: "assets/archivo/01-machine-learning-2019-2021/05-llanganates-poster.jpg"
---
## Concepto

Este conjunto reúne una referencia a las exploraciones realizadas entre 2019 y 2021 mediante distintas técnicas de **Machine Learning**. La mayoría de las obras se generó entrenando modelos con imágenes originales, creadas específicamente para formar datasets. Cada modelo tuvo un entrenamiento individual para producir resultados distintos.

## Proceso

**Curación del dataset:** Se reunió un conjunto de imágenes propias, recortadas a formato cuadrado de 1024 × 1024 px y alineadas manualmente.

**Preparación:** Las imágenes se convirtieron al formato de datos utilizado por la red mediante el script `dataset_tool.py`.

**Entrenamiento:** Se entrenaron modelos **StyleGAN2-ADA** y **StyleGAN3**, aplicando transferencia de aprendizaje desde modelos base de NVIDIA y aumentación adaptativa (ADA) para reducir el sobreajuste.

**Generación:** Las imágenes fijas se crearon mediante el muestreo de semillas aleatorias en el espacio latente. Para los videos, el script `gen_video.py` calculó transiciones entre vectores para producir interpolaciones fluidas.

En algunas animaciones se incorporó sonido personalizado, creado con herramientas generativas de audio o añadido directamente al archivo generado.

[Ver la curación en objkt](https://objkt.com/curations/objkt/machine-learning-2019-2021-15136133){:target="_blank"}
