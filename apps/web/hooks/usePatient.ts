"use client";

import { useEffect, useState } from "react";
import { fetchPatients } from "@/lib/client";
import type { Patient } from "@/lib/types";

export interface UsePatientResult {
  patients: Patient[];
  patient: Patient | null;
  select: (id: string) => void;
  status: "loading" | "ready" | "error";
  error: string | null;
}

/** Loads the demo patients once and tracks which one is selected (the first by default). */
export function usePatient(initialId?: string): UsePatientResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const [status, setStatus] = useState<UsePatientResult["status"]>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetchPatients()
      .then((list) => {
        if (!live) return;
        setPatients(list);
        setStatus("ready");
      })
      .catch((e: Error) => {
        if (!live) return;
        setError(e.message);
        setStatus("error");
      });
    return () => {
      live = false;
    };
  }, []);

  const patient = patients.find((p) => p.id === selectedId) ?? patients[0] ?? null;
  return { patients, patient, select: setSelectedId, status, error };
}
