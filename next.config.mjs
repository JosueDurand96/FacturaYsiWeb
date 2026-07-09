/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // El type-checking de TypeScript sí corre en build; ESLint no bloquea el build
  // (los estilos de lint se revisan aparte con `npm run lint`).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
