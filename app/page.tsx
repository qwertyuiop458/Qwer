import J2MEEmulator from "@/components/j2me-emulator";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">J2</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  J2ME Web Emulator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Эмулятор Java ME в браузере
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Главная
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Игры
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Помощь
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                О проекте
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Emulator */}
      <J2MEEmulator />

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              J2ME Web Emulator - Запускайте классические Java игры в браузере
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Версия 1.0.1</span>
              <span>|</span>
              <span>Русский интерфейс</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
