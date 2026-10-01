import { render, screen } from "@testing-library/react";
import { DataCard } from "@/components/ui/DataCard";

describe("DataCard", () => {
  it("renders a value and a unit", () => {
    render(<DataCard value="4.6" unit="TMB, mut/Mb" noSource />);
    expect(screen.getByText("4.6")).toBeInTheDocument();
    expect(screen.getByText("TMB, mut/Mb")).toBeInTheDocument();
    expect(screen.queryByText(/source/)).not.toBeInTheDocument();
  });

  it("marks an unsourced claim visibly", () => {
    render(<DataCard value="90" unit="min manual review per patient" />);
    expect(screen.getByText("[source needed]")).toBeInTheDocument();
  });

  it("links a cited source", () => {
    render(<DataCard value="200" unit="trials" source="ClinicalTrials.gov" sourceHref="https://clinicaltrials.gov" />);
    expect(screen.getByRole("link", { name: "ClinicalTrials.gov" })).toHaveAttribute("href", "https://clinicaltrials.gov");
  });
});
