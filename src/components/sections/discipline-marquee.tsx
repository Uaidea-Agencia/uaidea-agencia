import { DISCIPLINES } from "@/content/home";
function DisciplineGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="flex gap-11 pr-11 font-display text-lg font-semibold text-(--w)/32 uppercase whitespace-nowrap"
    >
      {DISCIPLINES.map((discipline) => (
        <span key={discipline} className="flex items-center gap-11">
          {discipline}
          <span aria-hidden="true" className="text-primary">
            ·
          </span>
        </span>
      ))}
    </div>
  );
}
export function DisciplineMarquee() {
  return (
    <div className="dark bg-background text-foreground border-border overflow-hidden border-y py-4.5">
      <div className="animate-marquee flex w-max">
        <DisciplineGroup />
        <DisciplineGroup hidden />
      </div>
    </div>
  );
}
