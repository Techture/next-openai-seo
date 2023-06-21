export default function AppLayout({ children }) {
  return (
    <div className="grid grid-cols-[300px_1fr]">
      <div className="bg-cyan-900">App Layout</div>
      <div className="bg-cyan-700">{children}</div>
    </div>
  );
}
