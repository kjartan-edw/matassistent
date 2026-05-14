export interface Måltidestimater {
  kcal: number;
  protein: number; // gram
}

export interface Måltid {
  id: string;
  timestamp: string;
  text?: string;
  imagePreview?: string;
  response: string;
  estimater?: Måltidestimater;
}

export interface DagTotaler {
  kcal: number;
  protein: number;
}

export interface Brukerprofil {
  høyde: number;
  nåværendeVekt: number;
  målvekt: number;
  kjønn: "mann" | "kvinne" | "annet";
}

const STORAGE_KEY = "matassistent_maaltider";
const PROFIL_KEY = "matassistent_profil";

export function hentProfil(): Brukerprofil | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFIL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function lagreProfil(profil: Brukerprofil): void {
  localStorage.setItem(PROFIL_KEY, JSON.stringify(profil));
}

export function hentMåltider(): Måltid[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function lagreMåltid(måltid: Måltid): void {
  const alle = hentMåltider();
  alle.push(måltid);
  const grense = new Date();
  grense.setDate(grense.getDate() - 90);
  const filtrert = alle.filter((m) => new Date(m.timestamp) > grense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrert));
}

export function hentDagensMåltider(): Måltid[] {
  const alle = hentMåltider();
  const idagStr = new Date().toDateString();
  return alle.filter((m) => new Date(m.timestamp).toDateString() === idagStr);
}

export function beregnDagTotaler(måltider: Måltid[]): DagTotaler {
  return måltider.reduce(
    (sum, m) => ({
      kcal: sum.kcal + (m.estimater?.kcal ?? 0),
      protein: sum.protein + (m.estimater?.protein ?? 0),
    }),
    { kcal: 0, protein: 0 }
  );
}

export function kcalNivå(kcal: number): "lavt" | "moderat" | "høyt" {
  if (kcal < 800) return "lavt";
  if (kcal < 1600) return "moderat";
  return "høyt";
}

export function proteinNivå(gram: number): "lavt" | "litt lavt" | "bra" {
  if (gram < 30) return "lavt";
  if (gram < 60) return "litt lavt";
  return "bra";
}
