// Route Handler de exemplo — confirma o padrão de src/app/api/ para
// endpoints reais (webhook, integração) que o site vier a precisar.
// Este aqui já tem uso prático: checagem de uptime/deploy.
export function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
