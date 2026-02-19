# Corregir conflicto components / Components

En tu proyecto la carpeta de componentes se ve a veces como `components` y otras como `Components`. Eso hace que TypeScript y el linter se confundan y aparezcan errores en `AboutSection.tsx` u otros.

**Solución (hacerlo una sola vez):**

1. **Cierra Cursor** por completo.
2. Abre el **Explorador de archivos** de Windows y ve a la carpeta del proyecto:
   `c:\DJCARLOSHERMIDA\HTML\projects\djapp\src`
3. Localiza la carpeta de componentes (puede verse como **Components** o **components**).
4. **Renómbrala** para que quede siempre en minúsculas: **`components`**.
   - **Opción A (Explorador):** Clic derecho en la carpeta → "Cambiar nombre" → escribe: `components`
   - **Opción B (PowerShell en la raíz del proyecto):** Para forzar minúsculas en Windows, ejecuta:
     ```powershell
     Rename-Item -Path "src\Components" -NewName "components_tmp"
     Rename-Item -Path "src\components_tmp" -NewName "components"
     ```
5. Abre **`src/App.tsx`** en un editor de texto y cambia la línea de import:
   - De: `} from './Components'`
   - A: `} from './components'`
6. Guarda, **vuelve a abrir Cursor** y en la raíz del proyecto ejecuta:
   ```bash
   npm start
   ```

A partir de ahí, usa siempre la ruta `src/components` (minúsculas) y no deberían volver los errores de “Declaration or statement expected” ni los de “differs only in casing”.
