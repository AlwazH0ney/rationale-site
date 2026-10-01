import { render, screen } from "@testing-library/react";
import { BUTTON_VARIANTS, Button, LinkButton, type ButtonVariant } from "@/components/ui/Button";

const VARIANTS = Object.keys(BUTTON_VARIANTS) as ButtonVariant[];

describe("Button", () => {
  it.each(VARIANTS)("renders the %s variant with its classes", (variant) => {
    render(<Button variant={variant}>Run match</Button>);
    const btn = screen.getByRole("button", { name: "Run match" });
    for (const cls of BUTTON_VARIANTS[variant].split(" ")) expect(btn).toHaveClass(cls);
  });

  it("encodes the brand shapes: square primary, pill secondary/outline/sage, sage fill", () => {
    expect(BUTTON_VARIANTS.primary).toContain("rounded-sm");
    expect(BUTTON_VARIANTS.secondary).toContain("rounded-pill");
    expect(BUTTON_VARIANTS.outline).toContain("border-ink");
    expect(BUTTON_VARIANTS.sage).toContain("bg-sage");
    expect(BUTTON_VARIANTS.ghost.split(" ").some((c) => c.startsWith("bg-"))).toBe(false);
  });

  it("defaults to a non-submitting primary button", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("bg-ink", "rounded-sm");
  });

  it("respects disabled", () => {
    render(<Button disabled>Run match</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders a link variant", () => {
    render(<LinkButton variant="outline" href="#methods">Read the method</LinkButton>);
    const link = screen.getByRole("link", { name: "Read the method" });
    expect(link).toHaveAttribute("href", "#methods");
    expect(link).toHaveClass("rounded-pill", "border-ink");
  });
});
