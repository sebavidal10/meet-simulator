# Google Meet UI Simulator

Réplica visual de la interfaz de Google Meet en modo oscuro, construida en HTML, CSS y JavaScript puro sin dependencias externas. Pensada para generar capturas de pantalla, mockups o simulaciones de llamadas con listas personalizadas de participantes.

## Características

- **Interfaz fiel a Google Meet:** Colores del tema oscuro oficial (`#202124`, `#3c4043`, `#8ab4f8`, `#ea4335`), tipografía Google Sans / Roboto e íconos de Material Symbols.
- **Grilla adaptable:** Ajusta automáticamente el número de filas, columnas y el tamaño de los avatares según la cantidad de participantes activos.
- **Avatares por iniciales:** Calcula las iniciales de cada participante y asigna un color fijo basado en la paleta de Google.
- **Código de reunión aleatorio:** Genera automáticamente un identificador con formato `xxx-xxxx-xxx` en cada carga (personalizable desde la interfaz).
- **Estados visuales por participante:**
  - Micrófono silenciado (`mic_off`) o activo con animación de voz y borde azul (`#8ab4f8`).
  - Indicador de mano levantada en la tarjeta.
- **Menús y paneles laterales incluidos:**
  - **Personas:** Buscador en tiempo real, contador de asistentes y formulario para agregar o quitar nombres.
  - **Chat:** Envío de mensajes locales para simular conversación en la llamada.
  - **Detalles de la reunión:** Enlace con el código actual de la sesión.
  - **Actividades y Controles del organizador:** Vistas estáticas de configuración.
  - **Menús emergentes:** Opciones de presentación, barra de reacciones y menú de tres puntos.

## Uso local

No requiere instalación ni servidor de desarrollo. Solo abre `index.html` en el navegador:

```bash
git clone https://github.com/sebavidal10/meet-simulator.git
cd meet-simulator
open index.html
```

## Cómo configurar la pantalla

### Editar lista de participantes, hora y código
Puedes abrir el modal de configuración haciendo clic en:
1. El bloque de **hora y código de la reunión** (esquina inferior izquierda).
2. El botón **Editar lista** dentro del panel lateral de **Personas**.
3. La opción **Configuración** en el menú de tres puntos de la barra inferior.

Dentro del área de texto puedes pegar una lista de nombres (uno por línea). Opcionalmente puedes añadir sufijos al final de cada nombre:
- `*` al final del nombre: aparece con el micrófono abierto y el indicador de hablando activo.
- `!` al final del nombre: aparece con la mano levantada.

```text
Sebastián Vidal *
María Fernanda Gómez
Carlos Andrés Rodríguez !
Lucía Martínez
```

### Atajos directos en las tarjetas
- **Clic sobre una tarjeta:** Alterna entre micrófono silenciado y hablando.
- **`Shift` + Clic sobre una tarjeta:** Levanta o baja la mano de ese participante.

## Estructura

```text
.
├── index.html   # Maquetación principal, barra de controles, paneles y modal
├── styles.css   # Estilos del tema oscuro, grilla y componentes
└── app.js       # Lógica de grilla, avatares, estados y configuración
```
