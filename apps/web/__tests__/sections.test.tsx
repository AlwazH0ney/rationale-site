import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Anatomy } from "@/components/sections/Anatomy";
import { Credits } from "@/components/sections/Credits";
import { Differentiation } from "@/components/sections/Differentiation";
import { Hero } from "@/components/sections/Hero";
import { PipelineSection } from "@/components/sections/PipelineSection";
import { Problem } from "@/components/sections/Problem";
import { Science } from "@/components/sections/Science";
import { Footer } from "@/components/ui/Footer";
import { Timeline } from "@/components/ui/Timeline";
import { mockFetch, PATIENTS } from "./fixtures";

describe("static sections", () => {
  it("hero has the locked headline with one sage word and both CTAs", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Match a tumor to its trial in the time it takes to read the report.");
    expect(within(h1).getByText("trial")).toHaveClass("text-sage");
    expect(screen.getByRole("link", { name: "See a match" })).toHaveAttribute("href", "#demo");
    expect(screen.getByRole("link", { name: "Read the method" })).toHaveAttribute("href", "#methods");
  });

  it("problem shows three figures, each flagged until sourced", () => {
    render(<Problem />);
    expect(screen.getAllByText("[source needed]")).toHaveLength(3);
  });

  it("pipeline section has both explanation columns", () => {
    render(<PipelineSection />);
    expect(screen.getByRole("heading", { name: "Remove noise" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Add evidence" })).toBeInTheDocument();
  });

  it("anatomy shows three gene cards, STK11 inverted", () => {
    render(<Anatomy />);
    const stk = screen.getByText("STK11 loss").closest("li")!;
    expect(stk).toHaveClass("bg-ink");
    expect(screen.getByText("KRAS p.G12C").closest("li")).toHaveClass("bg-sage-ghost");
  });

  it("differentiation and comparison use text, not icons, and cite sources", () => {
    render(<Differentiation />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(6);
    expect(within(table).getAllByText("not reported").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /ncbi-nlp\/TrialGPT/ })).toBeInTheDocument();
  });

  it("comparison accepts custom rows", () => {
    render(<ComparisonTable rows={[{ property: "x", values: ["yes", "no", "no"] }]} />);
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("credits link the real repository and include the marquee", () => {
    render(<Credits />);
    expect(screen.getByRole("link", { name: /AlwazH0ney\/trial-matcher/ })).toHaveAttribute(
      "href",
      "https://github.com/AlwazH0ney/trial-matcher",
    );
    expect(screen.getByRole("marquee")).toBeInTheDocument();
  });

  it("footer says not for clinical use", () => {
    render(<Footer />);
    expect(screen.getByText("Not for clinical use")).toBeInTheDocument();
  });

  it("timeline marks the proposed line as the active dot", () => {
    const { container } = render(<Timeline items={PATIENTS[0].timeline} />);
    const active = container.querySelectorAll("[data-active]");
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveClass("bg-sage");
  });
});

describe("science section", () => {
  it("renders three charts and labels illustrative vs real data", async () => {
    mockFetch();
    render(<Science />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Calibration" })).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "Coverage and risk" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evidence chain" })).toBeInTheDocument();
    expect(screen.getAllByText("illustrative data")).toHaveLength(2);
    expect(screen.getAllByText("real data")).toHaveLength(1);
  });

  it("opens the source modal from a sunburst leaf by keyboard and closes on Escape", async () => {
    mockFetch();
    const user = userEvent.setup();
    render(<Science />);
    const leaves = await screen.findAllByRole("button", { name: /show source/ });
    expect(leaves).toHaveLength(43);
    leaves[0].focus();
    await user.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link")).toHaveAttribute("href", expect.stringMatching(/^https:\/\/clinicaltrials\.gov\/study\/NCT/));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("opens the source modal on click", async () => {
    mockFetch();
    const user = userEvent.setup();
    render(<Science />);
    const leaves = await screen.findAllByRole("button", { name: /show source/ });
    await user.click(leaves[5]);
    expect(await screen.findByRole("dialog")).toHaveTextContent("cited patient feature");
    await user.click(screen.getByTestId("modal-backdrop"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
