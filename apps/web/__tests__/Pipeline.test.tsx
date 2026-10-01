import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pipeline } from "@/components/pipeline/Pipeline";
import { STAGES } from "@/components/pipeline/stages";

describe("Pipeline", () => {
  it("renders six stages", () => {
    render(<Pipeline />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  it("opens the drawer with the stage's input and output when a stage is clicked", async () => {
    const user = userEvent.setup();
    render(<Pipeline />);
    await user.click(screen.getByRole("button", { name: /retrieve/ }));
    const dialog = await screen.findByRole("dialog", { name: "retrieve" });
    expect(dialog).toHaveTextContent(STAGES[2].input);
    expect(dialog).toHaveTextContent(STAGES[2].output);
  });

  it("closes on Escape and returns focus to the stage", async () => {
    const user = userEvent.setup();
    render(<Pipeline />);
    const stage = screen.getByRole("button", { name: /judge/ });
    await user.click(stage);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(stage).toHaveFocus();
  });

  it("closes from the close button", async () => {
    const user = userEvent.setup();
    render(<Pipeline />);
    await user.click(screen.getByRole("button", { name: /fetch/ }));
    await user.click(await screen.findByRole("button", { name: "Close panel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("moves between stages with arrow keys and opens with Enter", async () => {
    const user = userEvent.setup();
    render(<Pipeline />);
    screen.getByRole("button", { name: /fetch/ }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /parse/ })).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("button", { name: /rank/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog", { name: "rank" })).toBeInTheDocument();
  });

  it("traps Tab inside the open drawer", async () => {
    const user = userEvent.setup();
    render(<Pipeline />);
    await user.click(screen.getByRole("button", { name: /verify/ }));
    const close = await screen.findByRole("button", { name: "Close panel" });
    expect(close).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(close).toHaveFocus();
  });
});
