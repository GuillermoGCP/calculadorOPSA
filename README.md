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
También puedes establecer `JWT_SECRET` para firmar las sesiones de usuario.

En la interfaz se pueden editar individualmente los costes y también el nombre de cada concepto con el botón **Editar**. Además es posible añadir nuevos conceptos en cada bloque de categoría. Puedes asignar un nombre a la configuración actual y almacenarla usando **Guardar empanada**.

Las empanadas guardadas se muestran en una lista desplegable desde donde se pueden precargar para realizar ajustes y, tras pulsar **Obtener gastos y beneficios**, consultar los totales (IVA incluido) y el beneficio según el margen indicado.

## Uso de Tailwind CSS

Este proyecto utiliza la CDN de Tailwind de forma predeterminada, tal como se incluye en `app/layout.js`.

Si prefieres un flujo de trabajo con Tailwind compilado, instala las dependencias necesarias y genera la configuraci\u00f3n:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

A continuaci\u00f3n elimina la etiqueta `<script>` de Tailwind de `app/layout.js` y en su lugar importa el CSS generado por Tailwind.

El comando `npm run build` se encargar\u00e1 de procesar los estilos cada vez que construyas el proyecto.

