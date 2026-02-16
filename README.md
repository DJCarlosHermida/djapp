# DJ Carlos Hermida | Music & Web

Sitio web profesional para DJ Carlos Hermida: servicios de DJ, producción musical y diseño web. Desarrollado con React, TypeScript y Vite.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # previsualizar el build
```

## Subir a GitHub

1. Crea un repositorio nuevo en [GitHub](https://github.com/new) (sin README ni .gitignore).
2. En la carpeta del proyecto:

```bash
git remote add origin https://github.com/TU_USUARIO/djcarloshermida-react.git
git branch -M main
git push -u origin main
```

Sustituye `TU_USUARIO` por tu usuario de GitHub.

## Desplegar la app (gratis)

### Opción 1: Vercel (recomendado)

1. Entra en [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. **Add New** → **Project** y selecciona el repo `djcarloshermida-react`.
3. Vercel detecta Vite automáticamente. Pulsa **Deploy**.
4. En unos segundos tendrás una URL tipo `djcarloshermida-react.vercel.app`.

Cada vez que hagas `git push` a `main`, Vercel volverá a desplegar.

### Opción 2: Netlify

1. Entra en [netlify.com](https://www.netlify.com) e inicia sesión con GitHub.
2. **Add new site** → **Import an existing project** → elige el repo.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Deploy. Tu sitio quedará en una URL tipo `xxx.netlify.app`.

---

© DJ Carlos Hermida. Todos los derechos reservados.
