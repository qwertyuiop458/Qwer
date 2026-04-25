import { Download, FileArchive, Shield, Smartphone } from "lucide-react"

export function Download() {
  return (
    <section id="download" className="bg-primary/5 px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Скачать J2ME Loader
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Бесплатный эмулятор Java ME для Android. Без рекламы и ограничений.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-foreground">J2ME Loader</h3>
              <p className="text-sm text-muted-foreground">Версия 1.0.1 для Android</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileArchive className="h-4 w-4" />
              <span>4.8 МБ</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Android 4.0+</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Без вирусов</span>
            </div>
          </div>

          <a
            href="/ru.playsoftware.j2meloader-101.zip"
            download
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-5 w-5" />
            Скачать ZIP
          </a>

          <p className="mt-4 text-xs text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="mt-1 text-sm text-muted-foreground">Бесплатно</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="mt-1 text-sm text-muted-foreground">Рекламы</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-3xl font-bold text-primary">1000+</div>
            <div className="mt-1 text-sm text-muted-foreground">Совместимых игр</div>
          </div>
        </div>
      </div>
    </section>
  )
}
