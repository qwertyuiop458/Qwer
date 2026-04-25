import { Download, FolderOpen, Play, Settings } from "lucide-react"

const steps = [
  {
    icon: Download,
    step: "1",
    title: "Скачайте приложение",
    description: "Загрузите APK файл J2ME Loader на ваше Android устройство.",
  },
  {
    icon: FolderOpen,
    step: "2",
    title: "Установите приложение",
    description: "Откройте загруженный файл и разрешите установку из неизвестных источников.",
  },
  {
    icon: Play,
    step: "3",
    title: "Добавьте игры",
    description: "Скопируйте JAR файлы игр на устройство и откройте их через J2ME Loader.",
  },
  {
    icon: Settings,
    step: "4",
    title: "Настройте управление",
    description: "При необходимости настройте виртуальную клавиатуру и параметры экрана.",
  },
]

export function Instructions() {
  return (
    <section id="instructions" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Как использовать
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Простая инструкция по установке и настройке J2ME Loader
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <div className="mt-4 flex justify-center">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
