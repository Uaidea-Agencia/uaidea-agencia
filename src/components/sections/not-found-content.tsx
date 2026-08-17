import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ROUTES } from "@/config/routes";
export function NotFoundContent() {
  return (
    <section className="dark bg-background text-foreground relative overflow-hidden">
      <span
        aria-hidden="true"
        className="font-mono text-(--w)/[0.05] pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[42vw] leading-none font-medium select-none"
      >
        404
      </span>

      <Container className="relative flex min-h-[70vh] flex-col items-start justify-center py-16 sm:py-24">
        <p className="text-muted-foreground mb-6 font-mono text-xs tracking-[0.14em] uppercase">
          Erro 404 — rota não encontrada
        </p>
        <h1 className="mb-6 max-w-[18ch] text-balance text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] uppercase">
          Essa página ficou sem plano.
        </h1>
        <p className="text-muted-foreground mb-10 max-w-[52ch] text-lg text-balance">
          O link que você seguiu mudou de endereço, ficou desatualizado ou ainda está a caminho.
          Aqui a gente também gosta de seguir rota com estratégia.
        </p>
        <div className="flex flex-wrap items-center gap-7">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={ROUTES.home}>Voltar para o início</Link>}
          />
          <Link href={ROUTES.contato} variant="underline">
            Falar com a gente
          </Link>
        </div>
      </Container>
    </section>
  );
}
