import { ClayLung } from "../three/dynamic";
import { LinkButton } from "../ui/Button";
import { Accent } from "../ui/SectionHeader";

export function Hero() {
  return (
    <section className="viewport-section grid items-center gap-10 pb-12 md:grid-cols-[1.15fr_1fr]" aria-labelledby="hero-title">
      <div className="flex flex-col gap-6">
        <p className="label">rationale · oncology research</p>
        <h1 id="hero-title" className="text-display1">
          Match a tumor to its <Accent>trial</Accent> in the time it takes to read the report.
        </h1>
        <p className="max-w-[560px] text-lede text-slate">
          Uncertainty-aware, evidence-grounded clinical trial matching for lung adenocarcinoma. Open code. Open data. Open methods.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <LinkButton variant="secondary" href="#demo">
            See a match
          </LinkButton>
          <LinkButton variant="outline" href="#methods">
            Read the method
          </LinkButton>
        </div>
      </div>
      <div className="relative">
        <ClayLung height="clamp(300px, 80vw, 480px)" label="Clay model of the lungs; drag to turn, pinch or ctrl and scroll to zoom" />
        <p className="text-center font-mono text-micro text-stone">sage marker: primary tumour site (illustrative)</p>
      </div>
    </section>
  );
}
