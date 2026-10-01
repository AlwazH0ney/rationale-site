import { Anatomy } from "@/components/sections/Anatomy";
import { Credits } from "@/components/sections/Credits";
import { Differentiation } from "@/components/sections/Differentiation";
import { Hero } from "@/components/sections/Hero";
import { LiveDemo } from "@/components/sections/LiveDemo";
import { PipelineSection } from "@/components/sections/PipelineSection";
import { Problem } from "@/components/sections/Problem";
import { Science } from "@/components/sections/Science";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <PipelineSection />
      <LiveDemo />
      <Science />
      <Anatomy />
      <Differentiation />
      <Credits />
    </>
  );
}
