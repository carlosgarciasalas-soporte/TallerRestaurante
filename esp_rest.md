# Guia del Proyecto: Linea Base Software de Restaurante

Este documento ajusta el alcance del proyecto a la actividad **AA2: Taller Grupal - Linea Base Software de Restaurante** de la Unidad 2 de Gestion del Software.

El objetivo no es solo generar un backend, sino construir y documentar una **linea base inicial estable** para el **Sistema Integral de Gestion de Restaurante (SIGR)**. Esta linea base servira como punto de referencia para el control de versiones, la gestion de cambios, la trazabilidad y futuras validaciones del sistema.

## 1. Proposito de la Linea Base

La linea base debe representar una primera version organizada, ejecutable y documentada del sistema. Debe incluir:

- Codigo fuente inicial del sistema.
- Estructura de carpetas definida.
- Modulos principales identificados.
- Pruebas basicas de integracion.
- Documentacion tecnica minima.
- Versionado con Git.
- Criterios claros de validacion y aprobacion.

Esta version inicial debe permitir demostrar que el proyecto tiene una base estable sobre la cual se pueden controlar cambios futuros.

## 2. Alcance Funcional del SIGR

El sistema debe modelar los modulos relevantes indicados en la guia:

1. **Autenticacion de usuarios**
   - Usuarios con roles: cliente, mesero y administrador.
   - Inicio de sesion basico.
   - Proteccion de rutas segun rol.

2. **Menu digital**
   - CRUD de categorias.
   - CRUD de platos o productos.
   - Estado de disponibilidad.
   - Precio y descripcion.

3. **Pedidos**
   - Registro de pedidos.
   - Relacion maestro-detalle: pedido e items del pedido.
   - Estados del pedido: pendiente, en preparacion, servido, cancelado, pagado.
   - Validacion de disponibilidad de productos.

4. **Reservas**
   - Registro de reservas por fecha y hora.
   - Datos del cliente.
   - Numero de personas.
   - Estado de la reserva: pendiente, confirmada, cancelada.

5. **Caja y facturacion**
   - Registro de pagos asociados a pedidos.
   - Calculo de totales.
   - Cierre de caja diario basico.

6. **Reportes**
   - Reporte diario de ventas.
   - Pedidos por estado.
   - Productos mas vendidos.

## 3. Alcance Tecnico Recomendado

Para que la linea base sea viable y clara, se recomienda construir el backend primero con una arquitectura limpia y persistencia simple.

### Stack base

- **Runtime:** Node.js.
- **API:** Express.js.
- **Testing:** Jest y Supertest.
- **Persistencia inicial:** repositorios en memoria o archivo JSON.
- **Control de versiones:** Git.
- **Documentacion:** README, CHANGELOG, LICENSE y documento de linea base.

### Arquitectura propuesta

```text
src/
  domain/
    entities/
    repositories/
    services/
  application/
    use-cases/
  infrastructure/
    http/
      controllers/
      routes/
      middlewares/
    repositories/
    database/
  shared/
    errors/
    pagination/
tests/
docs/
public/
```

### Responsabilidad de cada capa

- `src/domain`: reglas de negocio, entidades y contratos de repositorio.
- `src/application`: casos de uso del sistema.
- `src/infrastructure`: Express, rutas, controladores, persistencia y middlewares.
- `src/shared`: utilidades comunes, paginacion, errores y respuestas.
- `tests`: pruebas de integracion de los endpoints principales.
- `docs`: documentacion asociada a la linea base.
- `public`: interfaz web basica, si se decide incluir frontend.

## 4. Endpoints Minimos de la Linea Base

La API inicial debe cubrir los modulos principales del SIGR.

### Usuarios y autenticacion

- `POST /auth/login`
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

### Categorias

- `GET /categories?page=&limit=`
- `POST /categories`
- `GET /categories/:id`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### Productos o platos

- `GET /products?page=&limit=`
- `POST /products`
- `GET /products/:id`
- `PUT /products/:id`
- `DELETE /products/:id`

### Pedidos

- `GET /orders?page=&limit=`
- `POST /orders`
- `GET /orders/:id`
- `PUT /orders/:id/status`
- `DELETE /orders/:id`

El endpoint `GET /orders/:id` debe devolver el pedido con sus items relacionados. El endpoint `POST /orders` debe recibir el maestro y el detalle en una sola operacion.

### Reservas

- `GET /reservations?page=&limit=`
- `POST /reservations`
- `GET /reservations/:id`
- `PUT /reservations/:id`
- `DELETE /reservations/:id`

### Caja y reportes

- `POST /payments`
- `GET /cash-register/daily-summary`
- `POST /cash-register/close`
- `GET /reports/daily-sales`
- `GET /reports/orders-by-status`
- `GET /reports/top-products`

## 5. Criterios para Establecer la Linea Base

La linea base se considerara lista cuando cumpla estos criterios:

- El proyecto instala dependencias con `npm install`.
- El servidor inicia correctamente con `npm start` o `npm run dev`.
- Los modulos principales tienen rutas y casos de uso definidos.
- Los endpoints de listado soportan `page` y `limit`.
- Los pedidos implementan relacion maestro-detalle.
- Existen validaciones basicas de entrada.
- Existen pruebas de integracion con Jest y Supertest.
- Existe un script de datos iniciales con `npm run seed`.
- La estructura del proyecto esta documentada.
- El repositorio usa Git y tiene una rama principal estable `main`.
- Existe documentacion minima: `README.md`, `CHANGELOG.md`, `LICENSE.txt` y documento de linea base.

## 6. Documentacion Asociada Requerida

Ademas del codigo, el proyecto debe incluir documentos que respalden la linea base.

### README.md

Debe explicar:

- Descripcion del SIGR.
- Stack tecnologico.
- Requisitos de instalacion.
- Comandos para ejecutar el proyecto.
- Comandos para pruebas.
- Estructura de carpetas.
- Endpoints principales.

### CHANGELOG.md

Debe registrar los cambios incluidos en la linea base inicial:

- Version inicial.
- Modulos creados.
- Endpoints disponibles.
- Pruebas incluidas.
- Documentacion generada.

### LICENSE.txt

Debe definir una licencia para el proyecto, preferiblemente MIT para un trabajo academico.

### docs/linea-base.md

Documento tecnico fuente para luego exportar a PDF como `Taller_LineaBase_SIGR.pdf`. Debe incluir:

- Portada.
- Introduccion.
- Objetivo del taller.
- Descripcion del proyecto.
- Componentes incluidos en la linea base.
- Versionado del codigo.
- Criterios de validacion.
- Herramientas de soporte.
- Documentacion asociada.
- Validacion y aprobacion de la linea base.

## 7. Versionado del Codigo

La linea base debe quedar identificada en Git:

- Rama principal estable: `main`.
- Commits organizados por modulo o hito.
- Tag recomendado: `v0.1.0-linea-base`.
- Mensajes de commit claros, por ejemplo:
  - `chore: inicializar proyecto SIGR`
  - `feat: agregar modulo de menu digital`
  - `feat: agregar gestion de pedidos`
  - `test: agregar pruebas de integracion`
  - `docs: documentar linea base inicial`

## 8. Plan de Implementacion Recomendado

### Fase 1: Base del proyecto

1. Inicializar proyecto Node.js.
2. Instalar Express, Jest y Supertest.
3. Definir estructura de carpetas.
4. Crear servidor base y manejo de errores.

### Fase 2: Dominio y casos de uso

1. Crear entidades principales: User, Category, Product, Order, Reservation, Payment.
2. Definir reglas de negocio basicas.
3. Crear repositorios en memoria.
4. Crear casos de uso por modulo.

### Fase 3: API y validacion

1. Crear rutas y controladores.
2. Agregar validacion de entrada por middleware.
3. Implementar paginacion.
4. Implementar maestro-detalle en pedidos.

### Fase 4: Pruebas y datos iniciales

1. Configurar Jest.
2. Crear pruebas de integracion con Supertest.
3. Crear script `npm run seed`.
4. Validar endpoints principales.

### Fase 5: Documentacion de linea base

1. Crear `README.md`.
2. Crear `CHANGELOG.md`.
3. Crear `LICENSE.txt`.
4. Crear `docs/linea-base.md`.
5. Preparar el PDF final `Taller_LineaBase_SIGR.pdf`.

## 9. Entregable Academico Final

El entregable principal de la actividad debe ser:

```text
Taller_LineaBase_SIGR.pdf
```

Este PDF debe explicar la linea base del sistema y referenciar el repositorio o carpeta del codigo fuente. El codigo backend funciona como evidencia tecnica, pero el documento es el artefacto formal solicitado por la guia.

## 10. Enfoque Recomendado

Se recomienda construir una primera version pequena pero completa. Es preferible una linea base clara, ejecutable, probada y documentada, antes que un sistema demasiado grande sin trazabilidad.

La prioridad debe ser:

1. Cumplir la estructura y documentacion exigida por la actividad.
2. Tener un backend inicial funcional.
3. Evidenciar control de versiones y gestion de configuracion.
4. Dejar preparada la base para futuras actividades de cambios, pruebas e integracion continua.
