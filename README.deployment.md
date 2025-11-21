# Frontend - Proyecto Trueque

Aplicación Next.js para el sistema de trueque de objetos.

## Desarrollo Local

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun dev

# Build para producción
bun run build

# Ejecutar producción
bun start
```

## Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lf7ZRQsAAAAAHUI3Jd8esdqfFBmiCxExeXWb7_z
```

## Deploy en Vercel

Ver [DEPLOY.md](../DEPLOY.md) para instrucciones completas.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Asegúrate de configurar las variables de entorno en Vercel:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

## Estructura

- `/app` - Páginas y rutas de Next.js
- `/components` - Componentes reutilizables
- `/lib` - Utilidades y contextos (auth, API client, etc.)
- `/hooks` - Custom React hooks
- `/public` - Archivos estáticos

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Google reCAPTCHA v3
