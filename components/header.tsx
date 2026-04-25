"use client"

import { Menu, X, Smartphone } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Smartphone className="h-5 w-5 text-primary-foreground" />
          </div>
          J2ME Loader
        </a>
        <nav className="hidden items-center gap-8 md:flex">
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
        <div className="flex items-center gap-4">
          <a
            href="#download"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:block"
          >
            Скачать
          </a>
          <button 
            className="text-muted-foreground md:hidden" 
            aria-label="Меню"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Возможности
            </a>
            <a href="#instructions" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Инструкция
            </a>
            <a href="#download" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Скачать
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
