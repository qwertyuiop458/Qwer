import { Zap, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Быстрая разработка",
    description:
      "Используем современные технологии для быстрой реализации ваших идей без потери качества.",
  },
  {
    icon: Shield,
    title: "Надёжность",
    description:
      "Гарантируем безопасность и стабильную работу всех наших решений.",
  },
  {
    icon: Users,
    title: "Поддержка 24/7",
    description:
      "Наша команда всегда готова помочь и ответить на любые ваши вопросы.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-secondary/50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Наши преимущества
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Почему клиенты выбирают нас для реализации своих проектов
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
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
  );
}
