# Proyecto: Rick and Morty Explorer

## Descripción general
Este proyecto es una aplicación Next.js 16 para explorar personajes de Rick and Morty. La interfaz se compone de una página principal con listado paginado, tarjetas de personaje y detalle de personaje por ruta dinámica. La app consume la API pública de Rick and Morty y presenta estados de carga, error y contenido vacío cuando la API no responde como se espera.

## Stack y versiones
- Next.js: 16.1.6
- React: 19.2.3
- React DOM: 19.2.3
- TypeScript: 5.x
- Tailwind CSS: 4.x
- Vite/Vitest: 3.2.7
- jsdom: 26.x
- Testing Library: 16.x
- @testing-library/jest-dom: 6.6.3
- @testing-library/user-event: 14.6.1

## Arquitectura existente
- `src/app`: App Router de Next.js con páginas principales y rutas de detalle.
- `src/components`: componentes reutilizables (`CharacterCard`, `Pagination`).
- `src/lib/api.ts`: encapsula las llamadas a la API de Rick and Morty.
- `src/types/rickandmorty.d.ts`: definiciones de tipos de dominio declaradas como archivo de tipos para no contabilizarse como código ejecutable en la cobertura.

## Configuración de Vitest
Se añadió `vitest.config.ts` con:
- entorno `jsdom`
- alias `@` apuntando a `src/`
- `setupFiles` con configuración global de Testing Library
- inclusión de pruebas bajo `src/**/*.{test,spec}.{ts,tsx}`
- exclusión de artefactos y archivos no relevantes (`coverage`, `.next`, `src/test`, CSS global, tipos)
- `coverage` con provider `v8`, reportes `text`, `html` y `json-summary`
- umbrales mínimos de 80% para statements, branches, functions y lines

## Estructura de pruebas
Se creó una suite de pruebas enfocada en comportamiento observable:
- `src/lib/api.test.ts` para utilidades de consumo de API
- `src/components/CharacterCard.test.tsx` para render y enlaces
- `src/components/Pagination.test.tsx` para navegación y estados deshabilitados
- `src/app/app-pages.test.tsx` para render principal, detalle, loading, error y layout

## Componentes y utilidades cubiertos
- `getCharacters()`: respuesta correcta y fallos de red/HTTP.
- `getCharacter()`: detalle por id.
- `getEpisodes()`: normalización de respuesta única y array.
- `CharacterCard`: render, nombre, estado, ubicación y enlace.
- `Pagination`: navegación previa/siguiente y estado final.
- `Home`: render de listado con `searchParams`.
- `CharacterPage`: render de detalle con episodios.
- `Loading` y `Error`: estado de carga y recuperación.
- `RootLayout`: cabecera, navegación y footer.

## Estrategia de mocking
- Mock de `fetch` con `vi.fn()` para aislar la API externa y comprobar respuestas exitosas y fallidas.
- Mock de `next/link` para renderizar enlaces normales en jsdom.
- Mock de `next/image` para evitar ruido o errores de atributos específicos del componente de Next.js en pruebas.
- Mock de `next/font/google` para evitar la inicialización de fuentes en entorno de test.

## Comandos de ejecución
- `npm run test` — abre Vitest en modo interactivo
- `npm run test:run` — ejecuta toda la suite una vez
- `npm run coverage` — genera el reporte de cobertura con Vitest
- `npx vitest run --coverage` — equivalente directo para ejecución de cobertura

## Resultados de cobertura
Ejecución final con report generado:
- Statements: 94.48%
- Branches: 89.47%
- Functions: 84.61%
- Lines: 94.48%

Se generó el HTML de cobertura en `coverage/index.html` y el resumen textual en la salida de consola.

## Problemas encontrados y soluciones
1. El repositorio original no estaba clonado en la carpeta de trabajo, así que se clonó desde la URL suministrada.
2. `pnpm` no estaba disponible en la máquina del entorno, por lo que se usó `npm` para instalar dependencias sin cambiar la lógica del proyecto.
3. El plugin de React para Vitest no era compatible con el entorno actual de Node/ESM; se resolvió eliminando el plugin y usando la configuración mínima del compilador de Vite para TSX/React.
4. El componente `next/font/google` fallaba en pruebas jsdom; se resolvió con un mock específico.
5. `next/image` y `next/link` requerían adaptaciones para que renderizaran correctamente en jsdom.
6. La aplicación usa `globals.css` con Tailwind v4; al renderizar layout, jsdom intentaba parsear CSS y generaba ruido de consola; se desactivó el parseo de CSS en la configuración de test para mantener las pruebas centradas en comportamiento.

## Decisiones técnicas
- Se priorizó una suite enfocada en comportamiento observable en lugar de snapshots.
- Se evitaron pruebas innecesarias o redundantes.
- Se cubrieron los puntos más relevantes del flujo de negocio: consumo de API, paginación, tarjetas, detalle y estados de error/carga.
- La cobertura se configura sobre el código de producción relevante y se excluyen archivos de configuración, tipos y artefactos generados.

## Pendientes
- Ajustar la métrica de funciones a 80% si el entorno de ejecución o la configuración final de cobertura del runner vuelve a incluir archivos no relevantes en el cálculo global.
- Si el proyecto se amplia, añadir pruebas para cualquier flujo adicional de filtros, busquedas o formulario de UI.

## Siguientes pasos
- Mantener la suite actual y extenderla cuando se incorporen nuevas funcionalidades al proyecto.
- Revisar periódicamente los reportes de cobertura y los warnings de pruebas para mantener un nivel aceptable de calidad.
- Ejecutar `npm run coverage` en cada cambio importante antes de cerrar tareas.
