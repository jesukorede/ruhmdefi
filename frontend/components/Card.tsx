export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border bg-white p-4 shadow-sm">
      <div className="font-medium mb-2">{title}</div>
      {children}
    </div>
  );
}