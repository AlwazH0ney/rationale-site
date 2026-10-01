import { render, screen } from "@testing-library/react";
import { Chip } from "@/components/ui/Chip";
import type { TrialStatus } from "@/lib/types";

describe("Chip", () => {
  it.each<[TrialStatus, string]>([
    ["eligible", "bg-ink"],
    ["unresolved", "border"],
    ["abstained", "border-dashed"],
    ["rejected", "bg-paper"],
  ])("renders %s with its dot treatment", (status, dotClass) => {
    const { container } = render(<Chip status={status} />);
    const chip = container.querySelector(`[data-status="${status}"]`)!;
    expect(chip).toHaveTextContent(status);
    expect(chip.querySelector("span[aria-hidden]")).toHaveClass(dotClass);
  });

  it("inverts the fill only for rejected", () => {
    const { container } = render(
      <>
        <Chip status="rejected" />
        <Chip status="unresolved" />
      </>,
    );
    expect(container.querySelector('[data-status="rejected"]')).toHaveClass("bg-ink", "text-paper");
    expect(container.querySelector('[data-status="unresolved"]')).toHaveClass("bg-paper", "text-ink");
  });

  it("shows a count when given", () => {
    render(<Chip status="unresolved" count={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
