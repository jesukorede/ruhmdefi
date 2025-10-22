export default function Card({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
    return (
        <div className="card p-4 shadow-sm">
            <div className="font-medium mb-2">{title}</div>
            {children}
            {actions && (
                <div className="card-actions">
                    {actions}
                </div>
            )}
        </div>
    );
}