import { Smartphone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Smartphone className="h-4 w-4 text-primary-foreground" />
            </div>
            J2ME Loader
          </div>
          <nav className="flex gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Возможности
            </a>
            <a
              href="#instructions"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Инструкция
            </a>
            <a
              href="#download"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Скачать
            </a>
          </nav>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} J2ME Loader. Открытый исходный код.
        </div>
      </div>
    </footer>
  )
}
