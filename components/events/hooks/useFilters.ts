import { useState } from "react";
import { Importance } from "../types/event";

export function useFilters() {
  const [importanceFilter, setImportanceFilter] = useState<Importance | "ALL">(
    "ALL"
  );
  const [search, setSearch] = useState("");
  return { importanceFilter, setImportanceFilter, search, setSearch };
}
