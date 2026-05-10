# Taller Linea Base SIGR

## Portada

**Titulo:** Taller Grupal - Linea Base Software de Restaurante  
**Sistema:** Sistema Integral de Gestion de Restaurante (SIGR)  
**Curso:** Gestion del Software  
**Fecha:** 10/05/2026  
**Integrantes:** Pendiente por completar

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
- Pruebas basicas de integracion.
- Documentacion tecnica minima.

## Versionado del Codigo

- Herramienta utilizada: Git.
- Rama principal estable recomendada: `main`.
- Tag recomendado para la entrega: `v0.1.0-linea-base`.
- Repositorio oficial: pendiente por definir.

## Criterios de Validacion

- El proyecto instala dependencias mediante `npm install`.
- El servidor inicia mediante `npm start`.
- Los endpoints principales responden correctamente.
- Los listados soportan paginacion.
- Los pedidos implementan maestro-detalle.
- Las pruebas de integracion se ejecutan mediante `npm test`.
- La documentacion minima esta incluida.

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

## Validacion y Aprobacion

**Fecha de creacion:** 10/05/2026  
**Validado por:** grupo de desarrollo  
**Responsable de aprobacion:** coordinador del equipo o rol designado  
**Estado:** linea base inicial creada
