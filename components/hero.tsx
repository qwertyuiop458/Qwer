import { Download, Gamepad2 } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Gamepad2 className="h-4 w-4" />
          Версия 1.0.1
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          J2ME Loader
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Эмулятор Java ME для Android. Запускайте классические Java-игры 
          и приложения на вашем современном смартфоне.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#download"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-5 w-5" />
            Скачать бесплатно
          </a>
          <a
            href="#features"
            className="rounded-lg border border-border bg-card px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Узнать больше
          </a>
        </div>
      </div>
    </section>
  )
}
