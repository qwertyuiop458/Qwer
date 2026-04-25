import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Создаём цифровые решения для вашего бизнеса
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Мы помогаем компаниям развиваться в цифровом мире. Современные
          технологии, индивидуальный подход и качественный результат.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Начать проект
            <ArrowRight className="h-4 w-4" />
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
  );
}
