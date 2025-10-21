export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="font-medium mb-2">{title}</div>
            {children}
        </div>
    );
}