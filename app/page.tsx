export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1a2e]">
      <iframe
        src="/emulator.html"
        className="w-full h-screen border-0"
        title="J2ME Эмулятор"
        allow="fullscreen"
      />
    </main>
  );
}
