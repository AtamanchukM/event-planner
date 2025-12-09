import { Importance } from "../types/event";

type Props = {
  importanceFilter: Importance | "ALL";
  setImportanceFilter: (val: Importance | "ALL") => void;
  search: string;
  setSearch: (val: string) => void;
};

export default function EventFilters({ importanceFilter, setImportanceFilter, search, setSearch }: Props) {
  return (
    <div className="flex flex-col gap-3 mb-4 w-full ">
      <select
        value={importanceFilter}
        onChange={e => setImportanceFilter(e.target.value as Importance | "ALL")}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
      >
        <option value="ALL">Всі важливості</option>
        <option value="NORMAL">Звичайна</option>
        <option value="IMPORTANT">Важлива</option>
        <option value="CRITICAL">Критична</option>
      </select>
      <input
        type="text"
        placeholder="Пошук..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
      />
    </div>
  );
}
