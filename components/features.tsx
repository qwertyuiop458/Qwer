import { Smartphone, Settings, Zap, Maximize, Save, Github } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Поддержка JAR и JAD",
    description:
      "Запускайте Java-приложения в форматах JAR и JAD без дополнительной конвертации.",
  },
  {
    icon: Settings,
    title: "Гибкие настройки",
    description:
      "Настраивайте виртуальную клавиатуру, разрешение экрана и другие параметры эмуляции.",
  },
  {
    icon: Zap,
    title: "Высокая производительность",
    description:
      "Оптимизированный движок обеспечивает плавную работу даже на слабых устройствах.",
  },
  {
    icon: Maximize,
    title: "Масштабирование экрана",
    description:
      "Автоматическое масштабирование изображения под размер экрана вашего устройства.",
  },
  {
    icon: Save,
    title: "Сохранение прогресса",
    description:
      "Сохраняйте игровой прогресс и продолжайте с того места, где остановились.",
  },
  {
    icon: Github,
    title: "Открытый исходный код",
    description:
      "Полностью бесплатное приложение с открытым исходным кодом без рекламы.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-secondary/50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Возможности
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            J2ME Loader предоставляет все необходимые инструменты для запуска классических Java-игр
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
