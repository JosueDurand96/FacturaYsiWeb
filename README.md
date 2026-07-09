# FacturaYsi — Web (Landing + App)

Doble propósito: **landing comercial** pública y **app web** (espejo de la app móvil) para emitir desde la PC.

Stack: **Next.js 15 (App Router) + TypeScript + TailwindCSS + TanStack Query + Zustand + Framer Motion**.

## Requisitos
- Node 20+
- Backend FacturaYsi-BE en `http://localhost:4000`

## Instalación y ejecución
```bash
cd FacturaYsi-Web
npm install
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev                    # http://localhost:3000
```

## Build
```bash
npm run build
npm start
```

## Rutas

### Público
- `/` — landing (hero, pains, cómo funciona, para quién, precios, testimonios, FAQ, CTA)
- `/precios`, `/casos-de-uso`, `/faq`
- `/login`, `/registro`

### App (protegida, requiere sesión)
- `/app/dashboard` — 3 cards de emisión + recientes
- `/app/emitir/gre` — formulario simplificado a 2 columnas (UBIGEO en cascada)
- `/app/emitir/factura`, `/app/emitir/boleta`
- `/app/historial`, `/app/documento/[id]`
- `/app/frecuentes`, `/app/vehiculos`, `/app/conductores`, `/app/perfil`

## Acceso demo
Con el seeder del backend: RUC `20512345678`, usuario `julio@transportesjc.pe`, clave `Julio2026!`.

## Variables de entorno
| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend (`.../api`) |
