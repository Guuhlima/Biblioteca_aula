/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Não falhar o build por erros de ESLint
    ignoreDuringBuilds: true,
  },
  // (opcional, não recomendo a longo prazo)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
