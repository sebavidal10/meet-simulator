<div align="center">

  <img src="https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png" alt="Google Meet Logo" width="80" />

  # 🎥 Google Meet UI Simulator
  **Réplica visual 1:1 de la interfaz moderna de Google Meet en modo oscuro**

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
  [![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
  [![Material Symbols](https://img.shields.io/badge/Material_Symbols-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white)](#)
  [![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge)](#)

  *Diseñado para mockups, capturas de pantalla, demostraciones de producto, presentaciones y simulaciones de videollamadas sin necesidad de servidores ni cámaras.*

</div>

---

## ✨ Características Principales

- 🎨 **Fidelidad Visual Exacta:** Paleta de colores oficial de Google Meet Dark Mode (`#202124`, `#3c4043`, `#8ab4f8`, `#ea4335`), tipografía **Google Sans / Roboto** e iconografía oficial **Google Material Symbols**.
- 🧩 **Grilla Dinámica Inteligente:** Recalcula automáticamente filas, columnas y tamaños de avatar según la cantidad de participantes (desde 1 hasta +25 personas en pantalla).
- 🔤 **Avatares con Iniciales y Colores de Google:** Extrae automáticamente las iniciales de cada nombre y les asigna un color consistente de la paleta oficial de perfiles de Google.
- 🎙️ **Estados en Tiempo Real (Hablando / Silenciado / Mano Levantada):**
  - Indicador de micrófono tachado (`mic_off`) en esquina superior derecha.
  - Borde azul activo (`#8ab4f8`), anillo pulsante en el avatar y animación de ondas de voz cuando un participante está hablando.
  - Insignia de mano levantada en la esquina inferior izquierda de la tarjeta.
- 🗂️ **Todos los Menús y Paneles Oficiales Incluidos:**
  - 👥 **Personas:** Buscador funcional en vivo, contador de participantes, acordeón de colaboradores y botones para añadir o quitar personas.
  - 💬 **Chat de la llamada:** Switch de permisos, aviso de privacidad y envío de mensajes simulados en vivo.
  - ℹ️ **Detalles de la reunión:** Enlace dinámico según el código configurado y botón de copiado.
  - Shapes **Actividades:** Salas para grupos pequeños, Encuestas, Preguntas y respuestas, Grabación y Pizarra.
  - 🔒 **Controles del organizador:** Switches interactivos de moderación.
  - ⋮ **Menús Flotantes:** Menú de *Más opciones* (3 puntos), *Presentar ahora* y barra flotante de *Reacciones* con emojis animados.

---

## 🚀 Inicio Rápido

El proyecto **no requiere instalación, Node.js ni compiladores**. Funciona abriendo directamente el archivo en cualquier navegador moderno:

```bash
# 1. Clona o ubica la carpeta del proyecto
cd meet-simulator

# 2. Ábrelo directamente en tu navegador (macOS)
open index.html
```

*(En Windows o Linux, simplemente haz doble clic sobre `index.html`).*

---

## 🎮 Guía de Uso y Atajos Interactivos

Puedes controlar cada detalle de la pantalla antes de tomar una captura o compartirla:

### 1. Configurar lista masiva de participantes, hora y código
Haz clic en cualquiera de estos 3 lugares para abrir el **Modal de Configuración Rápida**:
1. En la **hora o código de la reunión** (`13:00 | abc-defg-hij`) en la esquina inferior izquierda.
2. En el botón **"Editar lista"** dentro del panel lateral de **Personas**.
3. En **"Configuración (Editar participantes)"** dentro del menú de 3 puntos (`⋮`).

> 💡 **Sintaxis rápida en la lista de nombres:**
> Escribe un nombre por línea. Puedes usar sufijos opcionales al final de cualquier línea:
> - Agrega `*` al final del nombre para que aparezca **con el micrófono encendido y hablando** (borde azul + ondas).
> - Agrega `!` al final del nombre para que aparezca **con la mano levantada**.
>
> **Ejemplo:**
> ```text
> Sebastián Vidal *
> María Fernanda Gómez
> Carlos Andrés Rodríguez !
> Lucía Martínez
> ```

### 2. Interacciones directas sobre las tarjetas
| Acción | Resultado en pantalla |
| :--- | :--- |
| **Clic izquierdo** sobre una tarjeta | Alterna a esa persona entre **Silenciado** (`mic_off`) y **Hablando** (borde azul + ondas de sonido). |
| **`Shift` + Clic** sobre una tarjeta | Levanta o baja la **mano** (`✋`) de ese participante. |
| **Pasar el mouse (Hover)** sobre una tarjeta | Muestra la píldora flotante de acciones de Google Meet (*Fijar*, *Micrófono*, *Más opciones*). |
| **Clic en emojis de Reacción (`😊`)** | Lanza emojis flotantes animados desde la esquina inferior de la pantalla. |

---

## 📁 Estructura del Proyecto

```text
meet-simulator/
├── index.html   # Estructura semántica, grilla, barra inferior, drawers y modales
├── styles.css   # Sistema de diseño Google Meet Dark Mode, animaciones y layout responsive
├── app.js       # Motor de grilla dinámica, generador de iniciales/colores y manejador de estados
└── README.md    # Documentación del proyecto
```

---

## 🛠️ Personalización Técnica

Si deseas ajustar colores o agregar más colores de avatares, puedes editar el arreglo `GOOGLE_AVATAR_COLORS` al inicio de [`app.js`](./app.js) o las variables CSS en `:root` dentro de [`styles.css`](./styles.css):

```css
:root {
  --bg-dark: #202124;              /* Fondo principal de la llamada */
  --tile-bg: #3c4043;              /* Fondo de cada tarjeta de participante */
  --tile-border-speaking: #8ab4f8; /* Borde azul de participante activo */
  --ctrl-danger: #ea4335;          /* Rojo oficial de botón colgar / mute */
  --google-blue: #1a73e8;          /* Azul principal de controles activos */
}
```

---

<div align="center">
  <sub>Hecho con precisión píxel a píxel para simulaciones de Google Meet.</sub>
</div>
