/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // NADA de `output: "export"`, nada de `basePath`, nada de rewrites/redirects agora
};
module.exports = nextConfig;
