export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="placeholder-shell">
      <p className="eyebrow">REUSE</p>
      <h1>{title}</h1>
    </main>
  );
}