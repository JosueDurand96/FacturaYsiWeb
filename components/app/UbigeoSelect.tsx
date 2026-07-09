"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { Select } from "@/components/ui/input";

interface Ubi {
  codigo: string;
  nombre: string;
}

export function UbigeoSelect({ onChange }: { onChange: (ubigeo: string) => void }) {
  const [dep, setDep] = useState("");
  const [prov, setProv] = useState("");

  const deps = useQuery({
    queryKey: ["ubigeo"],
    queryFn: () => unwrap<Ubi[]>(api.get("/catalogos/ubigeo")),
  });
  const provs = useQuery({
    queryKey: ["ubigeo", dep],
    enabled: !!dep,
    queryFn: () => unwrap<Ubi[]>(api.get(`/catalogos/ubigeo/${dep}`)),
  });
  const dists = useQuery({
    queryKey: ["ubigeo", dep, prov],
    enabled: !!dep && !!prov,
    queryFn: () =>
      unwrap<Ubi[]>(api.get(`/catalogos/ubigeo/${dep}/${prov.substring(2, 4)}`)),
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        value={dep}
        onChange={(e) => {
          setDep(e.target.value);
          setProv("");
        }}
      >
        <option value="">Departamento</option>
        {(deps.data ?? []).map((d) => (
          <option key={d.codigo} value={d.codigo}>
            {d.nombre}
          </option>
        ))}
      </Select>
      <Select value={prov} onChange={(e) => setProv(e.target.value)} disabled={!dep}>
        <option value="">Provincia</option>
        {(provs.data ?? []).map((p) => (
          <option key={p.codigo} value={p.codigo}>
            {p.nombre}
          </option>
        ))}
      </Select>
      <Select
        defaultValue=""
        onChange={(e) => onChange(e.target.value)}
        disabled={!prov}
      >
        <option value="">Distrito</option>
        {(dists.data ?? []).map((d) => (
          <option key={d.codigo} value={d.codigo}>
            {d.nombre}
          </option>
        ))}
      </Select>
    </div>
  );
}
