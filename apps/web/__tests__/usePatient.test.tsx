import { act, renderHook, waitFor } from "@testing-library/react";
import { usePatient } from "@/hooks/usePatient";
import { mockFetch, TCGA } from "./fixtures";

describe("usePatient", () => {
  it("loads the three demo patients from /mock/patients.json", async () => {
    mockFetch();
    const { result } = renderHook(() => usePatient());
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(globalThis.fetch).toHaveBeenCalledWith("/mock/patients.json", undefined);
    expect(result.current.patients.map((p) => p.id)).toEqual([TCGA, "SYN-EGFR-L858R", "SYN-BRCA1"]);
    expect(result.current.patient?.id).toBe(TCGA);
    expect(result.current.patient?.tmb).toBe(4.6);
  });

  it("switches the selected patient", async () => {
    mockFetch();
    const { result } = renderHook(() => usePatient());
    await waitFor(() => expect(result.current.status).toBe("ready"));
    act(() => result.current.select("SYN-EGFR-L858R"));
    expect(result.current.patient?.mutations[0].gene).toBe("EGFR");
  });

  it("reports a failed load with the fix", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("nope", { status: 500 }));
    const { result } = renderHook(() => usePatient());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toMatch(/returned 500.*pnpm mock/);
  });

  it("reports an unreachable network", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    const { result } = renderHook(() => usePatient());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toMatch(/Could not reach/);
  });
});
