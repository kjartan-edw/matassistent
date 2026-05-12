export interface Dagsstatus {
  estimertKcal: number;
  kcalNivå: "lavt" | "moderat" | "høyt";
  protein: "bra" | "litt lavt" | "lavt";
  romForMer: boolean;
  melding: string;
}

export interface Måltid {
  id: string;
  timestamp: string;
  text?: string;
  imagePreview?: string;
  response: string;
  dagsstatus?: Dagsstatus;
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
  // Behold kun siste 90 dager
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

export function sisteStatus(måltider: Måltid[]): Dagsstatus | null {
  for (let i = måltider.length - 1; i >= 0; i--) {
    if (måltider[i].dagsstatus) return måltider[i].dagsstatus!;
  }
  return null;
}
