# Taller Linea Base SIGR

## Portada

**Titulo:** Taller Grupal - Linea Base Software de Restaurante  
**Sistema:** Sistema Integral de Gestion de Restaurante (SIGR)  
**Curso:** Gestion del Software  
**Fecha:** 10/05/2026  
**Integrantes:** Carlos Garcia Salas

## Introduccion

El Sistema Integral de Gestion de Restaurante (SIGR) es una aplicacion web orientada a apoyar la operacion basica de un restaurante mediante la gestion de usuarios, menu digital, pedidos, reservas, pagos, caja y reportes.

Establecer una linea base temprana permite definir una version inicial estable del codigo fuente, facilitar la trazabilidad, controlar cambios futuros y asegurar que el equipo trabaje sobre una estructura tecnica comun.

## Objetivo del Taller

Definir y documentar una linea base inicial del sistema SIGR, reforzando competencias de gestion de configuracion, documentacion tecnica, versionado de codigo y planificacion de versiones.

## Descripcion del Proyecto

**Nombre del sistema:** Sistema Integral de Gestion de Restaurante (SIGR).

**Descripcion:** API web para gestionar pedidos, reservas, menu digital, caja y reportes diarios de ventas.

## Componentes Incluidos en la Linea Base

- Modulo de autenticacion de usuarios con roles cliente, mesero y administrador.
- Modulo de menu digital con CRUD de categorias y productos.
- Modulo de pedidos con relacion maestro-detalle.
- Modulo de reservas por fecha y hora.
- Modulo de pagos, cierre de caja y reportes.
- Dashboard de demostracion con Bento Grid, metricas operativas y productos destacados.
- Vistas paginadas para productos y clientes.
- Formularios modales para agregar y modificar clientes.
- Formularios modales para agregar y modificar productos.
- Dashboard administrativo con metricas, graficas de ingresos, ordenes, categorias, actividad, resenas y menus tendencia.
- Panel lateral de detalle para pedidos.
- Pruebas basicas de integracion.
- Documentacion tecnica minima.

## Versionado del Codigo

- Herramienta utilizada: Git.
- Rama principal estable recomendada: `main`.
- Tag recomendado para la entrega: `v0.1.0-linea-base`.
- Repositorio oficial: `https://github.com/carlosgarciasalas-soporte/TallerRestaurante`.

## Criterios de Validacion

- El proyecto instala dependencias mediante `npm install`.
- El servidor inicia mediante `npm start`.
- Los endpoints principales responden correctamente.
- Los listados soportan paginacion.
- Los pedidos implementan maestro-detalle.
- Las pruebas de integracion se ejecutan mediante `npm test`.
- La documentacion minima esta incluida.
- La linea base queda identificada con el tag `v0.1.0-linea-base`.

## Herramientas de Soporte

- Git para control de versiones.
- GitHub para alojamiento del repositorio.
- GitHub Issues para seguimiento de mejoras y errores.
- Vercel para despliegue web y publicacion de la API en entorno serverless.
- Jenkins o GitHub Actions como opcion futura para integracion continua.

## Documentacion Asociada

- `README.md`: instrucciones de instalacion, ejecucion y endpoints.
- `CHANGELOG.md`: historial de cambios de la linea base.
- `LICENSE.txt`: licencia MIT.
- `docs/linea-base.md`: fuente del documento tecnico para exportar a PDF.
- `docs/assets/dashboard-preview.png`: imagen generada automaticamente para evidenciar la vista inicial del dashboard.

## Validacion y Aprobacion

**Fecha de creacion:** 10/05/2026  
**Validado por:** Carlos Garcia Salas  
**Responsable de aprobacion:** Carlos Garcia Salas  
**Estado:** linea base inicial creada

## Historial de Cambios de la Linea Base

| Commit | Tipo | Descripcion | Evidencia |
| --- | --- | --- | --- |
| 99aeece | chore | Inicializacion de la linea base SIGR. | API base, tests, README y configuracion Vercel. |
| ae3a742 | feat | Ampliacion de datos demo. | 15 productos con imagenes, 10 clientes y 5 pedidos. |
| a5e493b | feat | Endpoints de dashboard. | Resumen operativo y ultimos pedidos. |
| d603930 | feat | Layout demo. | Navegacion principal y sidebar glassmorphism. |
| 0c1782d | feat | Dashboard Bento. | Metricas, ultimos pedidos y productos mas vendidos. |
| 37a4fe9 | feat | Productos y clientes paginados. | Controles visuales y paginacion de servidor. |
| c0f3d60 | feat | Pedidos maestro-detalle. | Drawer lateral con desglose de items y total. |
| 5e936fb | style | Pulido visual. | Badges de estado y mejoras de lectura. |
| d182b13 | feat | CRUD visual de clientes. | Formulario modal para agregar y modificar clientes. |
| 40f9422 | feat | CRUD visual de productos. | Formulario modal para agregar y modificar productos. |
| 3a20f32 | feat | Analitica de dashboard administrativo. | Endpoint con revenue, ordenes, categorias, actividad y resenas. |
| 2919ab6 | feat | Redisenho de dashboard administrativo. | UI inspirada en dashboard SaaS de restaurante con graficas y panel lateral. |
| 0919f48 | docs | Documentacion de dashboard administrativo. | README y linea base actualizados con analitica. |
| e9827ed | feat | Ofertas del dia. | Slider automatico con tres pancerottis y ajustes de pantalla completa. |
| 1730e9e | style | Rebranding visual restaurante. | Sidebar blanca, paleta naranja y logo de pancerotti con marca Restaurante. |
| fa876fc | style | Header ejecutivo. | Saludo, buscador, acciones y perfil de usuario estilo dashboard moderno. |
| b746f84 | style | Cards y layout del dashboard. | KPIs con ordenes, clientes, ingresos y ticket promedio. |
| d3cc08a | style | Visualizaciones del dashboard. | Graficas de ingresos, ordenes por dia y tipos de orden mejoradas. |
| 3fe37d9 | style | Panel derecho del dashboard. | Menus en tendencia, actividad reciente y resenas con avatares. |

## Estructura de Datos

La linea base usa repositorios en memoria ubicados en `src/infrastructure/repositories`. Los datos iniciales se cargan desde `src/infrastructure/database/seedData.js` e incluyen usuarios, categorias, productos, pedidos, pagos y reservas.

Esta decision permite ejecutar la demo sin instalar un motor de base de datos. Como limitacion, los datos creados desde la interfaz se reinician al reiniciar el servidor.

## Manual de Despliegue

1. Instalar dependencias con `npm install`.
2. Ejecutar pruebas con `npm test`.
3. Ejecutar localmente con `npm start`.
4. Abrir `http://localhost:3000`.
5. Para Vercel, conectar el repositorio de GitHub y desplegar. El archivo `vercel.json` redirige `/api/*` hacia el backend Express y sirve la interfaz desde `public/`.
