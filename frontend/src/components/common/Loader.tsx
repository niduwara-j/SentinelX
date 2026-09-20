import Spinner from "./Spinner";

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary">
      <Spinner label={label} />
    </div>
  );
}

