export function About() {
  const stats = [
    { value: "150+", label: "Проектов" },
    { value: "50+", label: "Клиентов" },
    { value: "5", label: "Лет опыта" },
    { value: "98%", label: "Довольных клиентов" },
  ];

  return (
    <section id="about" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              О нашей компании
            </h2>
            <p className="mt-6 text-muted-foreground">
              Мы — команда профессионалов, которая специализируется на создании
              современных веб-приложений и цифровых решений. Наша миссия —
              помогать бизнесу расти и развиваться с помощью технологий.
            </p>
            <p className="mt-4 text-muted-foreground">
              За годы работы мы накопили богатый опыт в различных отраслях и
              готовы применить его для решения ваших задач.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
