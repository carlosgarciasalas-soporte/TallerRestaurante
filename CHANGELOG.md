# Changelog

## 1.2.0 - Cumplimiento de modulos de linea base

- Implementacion de CRUD visual de categorias del menu digital.
- Validacion backend para impedir productos con categorias inexistentes.
- Implementacion de vista de reservas con filtro por fecha, creacion, edicion y cancelacion.
- Validacion de reservas duplicadas por fecha y hora.
- Implementacion de cierre de caja persistido en memoria e historial de cierres.
- Implementacion de vista de caja y reportes diarios.
- Ampliacion de pruebas de integracion a categorias, reservas y cierre de caja.
- Actualizacion de README y documentacion tecnica.

## 1.1.0 - Redisenho visual dashboard restaurante

- Aplicacion de rebranding visual con logo de pancerotti y marca Restaurante.
- Implementacion de header ejecutivo con saludo, buscador, acciones y perfil.
- Redisenho de tarjetas KPI con total de ordenes, clientes, ingresos y ticket promedio.
- Mejora de visualizaciones del dashboard con grafica de ingresos, ordenes por dia y barras de tipos de orden.
- Ajuste del panel derecho con menu en tendencia, actividad reciente y resenas con avatares.

## 1.0.0 - Linea base inicial

- Inicializacion del proyecto SIGR con Node.js y Express.
- Creacion de arquitectura por capas: dominio, aplicacion, infraestructura y compartidos.
- Implementacion de usuarios, categorias, productos, pedidos, reservas, pagos y reportes.
- Implementacion de pedidos con relacion maestro-detalle.
- Implementacion de paginacion en listados.
- Implementacion de seed con datos de prueba.
- Implementacion de pruebas de integracion con Jest y Supertest.
- Creacion de README, licencia y documento tecnico de linea base.
- Preparacion de configuracion para despliegue en Vercel.
- Ampliacion del seed demo con 15 productos, 10 clientes, 5 pedidos, imagenes de productos y categorias operativas.
- Incorporacion de endpoints de dashboard y respuestas de pedidos enriquecidas para la demo.
- Implementacion de dashboard Bento Grid con metricas, ultimos pedidos y productos mas vendidos.
- Implementacion de vistas paginadas para productos y clientes con controles visuales.
- Implementacion de pedidos maestro-detalle con panel lateral de desglose.
- Pulido visual de estados, badges y lectura general de la demo.
- Documentacion de trazabilidad de commits para la linea base demo.
- Incorporacion de formulario modal para agregar y modificar clientes desde la demo.
- Incorporacion de formulario modal para agregar y modificar productos desde la demo.
- Incorporacion de analitica backend para dashboard administrativo.
- Redisenho del dashboard administrativo con metricas, graficas, actividad, resenas y menus tendencia.
- Ajuste de marca visual, pantalla completa y vista de ofertas del dia con slider automatico de pancerottis.
