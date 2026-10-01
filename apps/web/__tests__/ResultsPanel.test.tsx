import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsPanel } from "@/components/demo/ResultsPanel";
import { RESULTS, TCGA } from "./fixtures";

describe("ResultsPanel", () => {
  it("shows the empty state before a match is run", () => {
    render(<ResultsPanel result={null} status="idle" />);
    expect(screen.getByText("No match yet")).toBeInTheDocument();
  });

  it("renders the 3 TCGA trials in status-then-score order with the Phase 3 numbers", () => {
    render(<ResultsPanel result={RESULTS[TCGA]} status="done" />);
    const rows = screen.getAllByTestId("trial-row");
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => within(r).getByText(/^NCT\d+$/).textContent)).toEqual([
      "NCT04303780",
      "NCT03600883",
      "NCT03778229",
    ]);
    expect(rows[0]).toHaveTextContent("unresolved");
    expect(rows[0]).toHaveTextContent("0.863");
    expect(rows[1]).toHaveTextContent("0.732");
    expect(rows[2]).toHaveTextContent("rejected");
    expect(rows[2]).toHaveTextContent("0.501");
    expect(rows[2]).toHaveTextContent("pass 5 · fail 3 · unknown 4 · abstained 1");
  });

  it("orders by status even if the input is shuffled", () => {
    const r = RESULTS[TCGA];
    render(<ResultsPanel result={{ ...r, trials: [...r.trials].reverse() }} status="done" />);
    const first = screen.getAllByTestId("trial-row")[0];
    expect(first).toHaveTextContent("NCT04303780");
  });

  it("shows the status counts", () => {
    render(<ResultsPanel result={RESULTS[TCGA]} status="done" />);
    const counts = screen.getByRole("list", { name: "Trials by status" });
    expect(within(counts).getByText("unresolved").parentElement).toHaveTextContent("2");
    expect(within(counts).getByText("rejected").parentElement).toHaveTextContent("1");
    expect(within(counts).getByText("abstained").parentElement).toHaveTextContent("0");
  });

  it("expands a trial into criterion rows with cited features and meters", async () => {
    const user = userEvent.setup();
    render(<ResultsPanel result={RESULTS[TCGA]} status="done" />);
    const osi = screen.getAllByTestId("trial-row")[2];
    const toggle = within(osi).getByRole("button", { expanded: false });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const list = within(osi).getByRole("list", { name: "Criteria for NCT03778229" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(13);
    expect(list).toHaveTextContent("rule never_received:egfr_tki"); // failure 2, rule-filled
    expect(list).toHaveTextContent("abstained"); // failure 1
    expect(within(list).getAllByRole("meter").length).toBeGreaterThan(0);
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("labels synthetic results as rule layer only, with pending criteria", async () => {
    const user = userEvent.setup();
    render(<ResultsPanel result={RESULTS["SYN-BRCA1"]} status="done" />);
    expect(screen.getByText("rule layer only")).toBeInTheDocument();
    const row = screen.getAllByTestId("trial-row")[0];
    expect(row).toHaveTextContent(/pending \d+/);
    await user.click(within(row).getByRole("button", { expanded: false }));
    expect(within(row).getAllByText("pending LLM run").length).toBeGreaterThan(0);
  });

  it("names the problem on error", () => {
    render(<ResultsPanel result={null} status="error" error="Could not reach /api. Check that the API is running." />);
    expect(screen.getByText(/Check that the API is running/)).toBeInTheDocument();
  });
});
