import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Instructions } from "@/components/instructions"
import { Download } from "@/components/download"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Instructions />
      <Download />
      <Footer />
    </main>
  )
}
