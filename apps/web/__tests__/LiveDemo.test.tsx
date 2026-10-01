import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiveDemo } from "@/components/sections/LiveDemo";
import { mockFetch } from "./fixtures";

describe("LiveDemo", () => {
  it("runs a match, then resets and re-enables on patient swap", async () => {
    mockFetch();
    const user = userEvent.setup();
    render(<LiveDemo />);
    const run = await screen.findByRole("button", { name: "Run match" });
    expect(screen.getByText("No match yet")).toBeInTheDocument();

    await user.click(run);
    expect(await screen.findAllByTestId("trial-row")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Run match" })).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("patient"), "SYN-EGFR-L858R");
    expect(screen.getByText("No match yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run match" })).toBeEnabled();
    const card = screen.getByRole("complementary", { name: "Patient profile" });
    expect(within(card).getAllByText(/EGFR/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Run match" }));
    await waitFor(() => expect(screen.getByText("rule layer only")).toBeInTheDocument());
  });

  it("shows the TCGA patient's drivers, timeline and the sage run button", async () => {
    mockFetch();
    render(<LiveDemo />);
    const card = await screen.findByRole("complementary", { name: "Patient profile" });
    expect(within(card).getAllByText("DRIVER")).toHaveLength(4);
    expect(within(card).getByText("KRAS G12C", { exact: false })).toBeInTheDocument();
    expect(within(card).getByRole("list", { name: "Treatment timeline" })).toHaveTextContent("progression");
    expect(within(card).getByRole("button", { name: "Run match" })).toHaveClass("bg-sage");
  });
});
