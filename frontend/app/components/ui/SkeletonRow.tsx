const COLS = 6;

export default function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: COLS }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-zinc-200" />
        </td>
      ))}
    </tr>
  );
}
