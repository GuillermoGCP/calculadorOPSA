# calculadorOPSA

Proyecto de ejemplo en Next.js y TypeScript para calcular los costes de una empanada de carne y estimar diferentes tipos de beneficio.

## Ejecución en local

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

Debes definir la variable de entorno `MONGO_URI` con la cadena de conexión de MongoDB antes de arrancar la aplicación.
Además define `STATIC_TOKEN`, un valor fijo que se enviará en la cookie de sesión.

En la interfaz se pueden editar individualmente los costes y también el nombre de cada concepto con el botón **Editar**. Además es posible añadir nuevos conceptos en cada bloque de categoría. Puedes asignar un nombre a la configuración actual y almacenarla usando **Guardar empanada**. Si has cargado una empanada existente puedes usar **Actualizar empanada** para ir guardando los cambios sobre la misma.

Las empanadas guardadas se muestran en una lista desplegable desde donde se pueden precargar para realizar ajustes y, tras pulsar **Obtener gastos y beneficios**, consultar los totales (IVA incluido) y el beneficio según el margen indicado.

## Exportación a Excel

Se ha añadido soporte para descargar los datos en formato `.xlsx`:

* En la calculadora encontrarás el botón **Descargar empanada** que genera una hoja con todos los conceptos, totales y beneficios de la empanada actual.
* En la página **Empanadas guardadas** puedes exportar todas las empanadas, cada una en su propia pestaña del libro.
* Desde **Productos** es posible obtener un listado completo de productos en Excel.

## Estilos CSS

La aplicación combina utilidades de **Tailwind CSS** con hojas de estilo clásicas.
Los estilos globales se encuentran en `styles/globals.css` y la configuración de
Tailwind está en `tailwind.config.js`.


## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
