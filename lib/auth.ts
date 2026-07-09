import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserT, EmpresaT } from "./types";

interface AuthState {
  token: string | null;
  user: UserT | null;
  empresa: EmpresaT | null;
  hydrated: boolean;
  setSession: (token: string, user: UserT, empresa: EmpresaT | null) => void;
  setEmpresa: (empresa: EmpresaT | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      empresa: null,
      hydrated: false,
      setSession: (token, user, empresa) => set({ token, user, empresa }),
      setEmpresa: (empresa) => set({ empresa }),
      logout: () => set({ token: null, user: null, empresa: null }),
    }),
    {
      name: "facturaysi-web-auth",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
