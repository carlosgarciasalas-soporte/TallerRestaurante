# Sistema Integral de Gestion de Restaurante (SIGR)

Linea base inicial del sistema SIGR para la actividad **AA2: Taller Grupal - Linea Base Software de Restaurante**.

## Descripcion

SIGR es una API web para gestionar operaciones basicas de un restaurante: usuarios, menu digital, pedidos, reservas, pagos, caja y reportes. Esta version funciona como linea base estable para control de cambios y trazabilidad.

## Stack

- Node.js
- Express.js
- Jest
- Supertest
- Repositorios en memoria

## Instalacion

```bash
npm install
```

## Ejecutar

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000/api
```

La pagina principal del proyecto queda disponible en:

```text
http://localhost:3000
```

## Datos de prueba

```bash
npm run seed
```

## Pruebas

```bash
npm test
```

## Despliegue en Vercel

Este proyecto esta preparado para desplegarse en Vercel:

- `public/` contiene la pagina principal.
- `src/server.js` exporta la app Express para Vercel y tambien permite ejecucion local con `npm start`.
- `vercel.json` redirige las rutas `/api/*` al backend Express y las rutas web a `public/index.html`.

Pasos recomendados:

```bash
npm test
```

Luego subir el proyecto a GitHub y conectarlo desde Vercel. Tambien puedes usar Vercel CLI:

```bash
npm install -g vercel
vercel
```

Nota: esta linea base usa repositorios en memoria. En Vercel los datos pueden reiniciarse entre ejecuciones, asi que es suficiente para demo academica, pero para produccion debe conectarse una base de datos externa.

## Endpoints principales

- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/reservations`
- `POST /api/payments`
- `GET /api/reports/daily-sales`
- `GET /api/reports/orders-by-status`
- `GET /api/reports/top-products`

Los endpoints de listado soportan `page` y `limit`.

## Estructura

```text
src/
  domain/
  application/
  infrastructure/
  shared/
tests/
docs/
```

## Linea base

Esta version cubre los criterios iniciales:

- API ejecutable.
- Modulos principales definidos.
- Pedido maestro-detalle.
- Paginacion.
- Validaciones basicas.
- Pruebas de integracion.
- Documentacion minima.
