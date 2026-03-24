# Frontend — Prueba técnica

Pequeña aplicación frontend creada con Angular. Este repositorio contiene la UI, servicios y stores usados en la prueba técnica.

## Requisitos

- Node.js (16+ recomendada)
- npm

## Instalación

1. Instala dependencias:

	npm install

2. Levanta la aplicación en modo desarrollo:

	npm start

	La app quedará disponible en http://localhost:4200/ y se recargará automáticamente al cambiar archivos.

## Scripts útiles

- `npm start` — Inicia el servidor de desarrollo (`ng serve`).
- `npm test` — Ejecuta tests unitarios.
- `npm run build` — Genera los artefactos de producción en `dist/`.

Revisa `package.json` para más scripts específicos.

## Estructura relevante

Resumen de carpetas importantes:

- `src/app/core` — Servicios, interceptores, guards y modelos centrales.
- `src/app/features` — Módulos por dominio (auth, requests, resources).
- `src/app/shared` — Componentes y utilidades compartidas.
- `src/assets/i18n` — Archivos de traducción (`en.json`, `es.json`).

## Notas de desarrollo

- El proyecto usa Angular CLI (v17+). Usa `ng generate` para scaffolding (componentes, servicios, guards, etc.).
- Para agregar nuevas traducciones, edita los archivos en `src/assets/i18n`.

## Contacto

Si necesitas que ajuste este README (idioma, más instrucciones, ejemplos), dime qué quieres que añada y lo actualizo.
