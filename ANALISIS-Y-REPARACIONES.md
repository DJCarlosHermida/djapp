# Análisis del proyecto DJ App (djcarloshermida)

## 1. Resumen del proyecto

- **Stack:** React 19 + TypeScript + Vite 7.  
- **Propósito:** Sitio one-page de DJ Carlos Hermida: servicios (DJ, Producción musical, Web), galería de eventos, sobre mí, contacto, redes.  
- **Estructura:** `App.tsx` orquesta estado global; componentes en `src/Components/`; tipos en `src/types.ts`; datos en `src/data.ts`; estilos en `src/style.css`. Bootstrap se importa en `main.tsx` para grid y componentes.

---

## 2. Estructura actual

```
src/
├── App.tsx              # Estado, efectos, composición de secciones
├── main.tsx             # Entrada: Bootstrap, style.css, ReactDOM.render
├── main.ts              # Posible resto de template (revisar uso)
├── counter.ts           # Posible resto de template (revisar uso)
├── types.ts             # MediaItem, Evento, ServicioId, PortfolioLink
├── data.ts              # EVENTOS_GALERIA, PORTFOLIO_LINKS, constantes
├── style.css            # Estilos globales + tema claro/oscuro
└── Components/
    ├── index.ts         # Re-export de todos los componentes
    ├── Navbar.tsx       # Barra fija, equalizer, tema, bandera Uruguay
    ├── Hero.tsx         # Cabecera principal
    ├── Footer.tsx       # Pie
    ├── AboutSection.tsx # Sobre mí
    ├── SocialSection.tsx# Redes sociales
    ├── ServicesSection.tsx # Servicios (cards + detalle, forwardRef)
    ├── GaleriaSection.tsx  # Galería de eventos (grid + detalle)
    ├── ContactSection.tsx  # Formulario + mapa
    └── UruguayFlag.tsx     # Bandera animada (SVG)
```

- **App.tsx:** Maneja `equalizerActive`, `navScrolled`, `theme`, `eventoSeleccionado`, `servicioSeleccionado`; efectos de scroll, actividad (idle), tema en `localStorage` y clic fuera de Servicios para cerrar detalle; `handleSubmit` abre `mailto`.
- **Navegación:** Enlaces a `#home`, `#remix`, `#services`, `#about`, `#galeria`, `#social`, `#form`.
- **Servicios:** Tres cards; al elegir una se muestra detalle (DJ vacío, Música con SoundCloud, Web con portfolio). Clic fuera del contenedor de Servicios restaura la vista de cards (vía ref + `mousedown` en documento).
- **Galería:** Lista de eventos desde `EVENTOS_GALERIA`; algunos enlazan a Instagram; el resto abre detalle con grid de fotos/videos.

---

## 3. Problemas detectados (por prioridad)

### Prioridad 1 – Crítico (rompe build o UX esencial)

1. **Error de sintaxis en `ServicesSection.tsx` (forwardRef + JSX)**  
   - **Qué:** El compilador (vite:react-swc) puede fallar con `Expected ',', got 'export'` en la línea del `export default`.  
   - **Por qué:** La forma `forwardRef(...)( (props, ref) => ( <section>...</section> ) )` puede ser ambigua para el parser con el cierre de paréntesis.  
   - **Reparar:** Reescribir el componente con cuerpo de bloque y `return` explícito para evitar ambigüedad:
     - Sustituir `(props, ref) => (` por `(props, ref) => { return (` y cerrar con `); }` antes de `);` de `forwardRef`.

2. **Bootstrap no declarado en `package.json`**  
   - **Qué:** `main.tsx` importa `bootstrap/dist/css/bootstrap.min.css` y `bootstrap/dist/js/bootstrap.bundle.min.js`, pero Bootstrap no aparece en `dependencies` ni `devDependencies`.  
   - **Riesgo:** En instalación limpia (`npm ci` o nuevo clone) la build puede fallar o los estilos/JS de Bootstrap no cargar.  
   - **Reparar:** Añadir `"bootstrap": "^5.3.x"` (o la versión que se use) a `dependencies` en `package.json` y ejecutar `npm install`.

### Prioridad 2 – Alto (datos incorrectos / accesibilidad / HTML)

3. **IDs duplicados en `EVENTOS_GALERIA`**  
   - **Qué:** En `data.ts`, varios eventos comparten `id: 'corporativo-2024'` (EVENTOS EMPRESARIALES, DESPEDIDAS, DESFILES).  
   - **Riesgo:** Keys duplicadas en el `.map()` de la galería pueden causar comportamiento errático de React y bugs visuales.  
   - **Reparar:** Asignar `id` único a cada evento (por ejemplo `corporativo-2024`, `despedidas-2024`, `desfiles-2024`).

4. **Falta de `id="remix"` en la página**  
   - **Qué:** El nav y el hero enlazan a `#remix`, pero no hay ningún elemento con `id="remix"` en la página. Solo existe un `id="remix"` en el título de la card “Producción Musical” dentro de Servicios.  
   - **Riesgo:** Al hacer clic en “Remix” o “Escuchar playlist” el scroll no lleva a un ancla clara o puede quedar en sitio incorrecto.  
   - **Reparar:** Añadir un ancla visible para Remix: por ejemplo un `id="remix"` en la sección de Servicios (o en un bloque dedicado) para que el enlace lleve ahí de forma predecible.

5. **Error ortográfico en AboutSection**  
   - **Qué:** Texto “Apacionado” en la biografía.  
   - **Reparar:** Cambiar a “Apasionado”.

6. **HTML inválido en AboutSection (anidación de `<i>`)**  
   - **Qué:** Varios `<i>` anidados (p. ej. `<i><i title='...'>...</i>...</i>`) para discotecas y emisoras.  
   - **Riesgo:** Accesibilidad y validación HTML; algunos lectores de pantalla pueden interpretar mal la estructura.  
   - **Reparar:** Usar un único `<i>` por nombre o envolver la lista en `<span>` con clases y usar `title` en el contenedor adecuado, sin anidar `<i>`.

### Prioridad 3 – Medio (mantenibilidad y consistencia)

7. **Archivos posiblemente no usados**  
   - **Qué:** `src/main.ts` y `src/counter.ts` parecen restos del template de Vite/React.  
   - **Reparar:** Si no se referencian desde ningún punto de entrada ni otro archivo, eliminarlos para no generar confusión.

8. **Inconsistencia de mayúsculas en la carpeta de componentes**  
   - **Qué:** En el código se importa `'./Components'` (C mayúscula). En sistemas con sensibilidad a mayúsculas (Linux, builds en CI) puede haber fallos si en algún momento se usa `components` (minúscula).  
   - **Reparar:** Mantener un único nombre (por ejemplo `Components`) y asegurar que todas las importaciones y el sistema de archivos lo usen de forma coherente.

9. **Servicio DJ sin contenido en el detalle**  
   - **Qué:** Al elegir “DJ y Discoteca” solo se muestra el botón “Volver a servicios” y la etiqueta “Servicio”, sin texto ni lista (el bloque está vacío).  
   - **Reparar:** Añadir contenido útil (por ejemplo descripción, tipos de eventos, equipamiento) o, si se quiere simetría con Música/Web, un mensaje tipo “Próximamente” o enlace a contacto.

10. **Formulario de contacto: nombre del campo en backend**  
    - **Qué:** Se usa `name="Email"` en el input de email (con “E” mayúscula). Si en el futuro se envía a un backend que espere `email`, podría haber desajuste.  
    - **Reparar:** Mantener coherencia: o bien usar `name="email"` y adaptar `handleSubmit` (formData.get('email')), o documentar que el backend espera `Email`.

### Prioridad 4 – Bajo (mejoras opcionales)

11. **Accesibilidad del iframe de SoundCloud**  
    - Revisar que el iframe tenga `title` adecuado (ya tiene “SoundCloud DJ Carlos Hermida - Producción y Remixes”) y que la sección sea navegable por teclado.

12. **Rendimiento de imágenes en galería**  
    - Algunas imágenes usan URLs externas (picsum). Para producción, conviene usar recursos locales o un CDN y considerar `loading="lazy"` (ya usado en varias imágenes).

13. **SEO**  
    - Ya hay meta description y keywords en `index.html`. Opcional: Open Graph / Twitter Cards para redes sociales.

---

## 4. Lista ordenada por prioridad para reparar

| # | Prioridad | Tarea | Archivo(s) |
|---|-----------|--------|------------|
| 1 | **Crítico** | Corregir sintaxis de `forwardRef` en ServicesSection (cuerpo con `return`) | `src/Components/ServicesSection.tsx` |
| 2 | **Crítico** | Añadir Bootstrap a `package.json` e instalar | `package.json` |
| 3 | **Alto** | Dar IDs únicos a cada evento en `EVENTOS_GALERIA` | `src/data.ts` |
| 4 | **Alto** | Asegurar ancla `#remix` (id en sección o bloque visible) | `src/Components/ServicesSection.tsx` o estructura de secciones |
| 5 | **Alto** | Corregir “Apacionado” → “Apasionado” | `src/Components/AboutSection.tsx` |
| 6 | **Alto** | Corregir anidación de `<i>` en AboutSection (HTML válido) | `src/Components/AboutSection.tsx` |
| 7 | **Medio** | Eliminar o documentar `main.ts` y `counter.ts` si no se usan | `src/main.ts`, `src/counter.ts` |
| 8 | **Medio** | Unificar nombre de carpeta de componentes (Components) | Imports y estructura de carpetas |
| 9 | **Medio** | Añadir contenido o placeholder al detalle del servicio DJ | `src/Components/ServicesSection.tsx` |
| 10 | **Medio** | Unificar nombre del campo email (Email vs email) y documentar | `src/App.tsx`, `src/Components/ContactSection.tsx` |
| 11 | **Bajo** | Revisar títulos y navegación por teclado en iframes | `src/Components/ServicesSection.tsx` |
| 12 | **Bajo** | Revisar fuentes de imágenes en producción / lazy loading | `src/data.ts`, componentes de galería |
| 13 | **Bajo** | Añadir meta Open Graph / Twitter si se comparte en redes | `index.html` |

---

## 5. Resumen ejecutivo

- **Crítico:** Arreglar compilación de `ServicesSection` y declarar Bootstrap en `package.json`.  
- **Alto:** IDs únicos en galería, ancla Remix, ortografía y HTML en About.  
- **Medio:** Limpieza de archivos no usados, consistencia de nombres, contenido del servicio DJ y nombre del campo email.  
- **Bajo:** Accesibilidad de iframes, imágenes y meta para redes.

Si quieres, el siguiente paso puede ser aplicar en el código las reparaciones 1 y 2 (ServicesSection y Bootstrap) y luego seguir en orden con el resto.
