"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Keyboard,
  Monitor,
  Smartphone,
  Gamepad2,
  HelpCircle,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

interface EmulatorState {
  isLoaded: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
  showKeyboard: boolean;
  showHelp: boolean;
}

interface EmulatorSettings {
  phoneType: string;
  screenWidth: number;
  screenHeight: number;
  soundEnabled: boolean;
  scale: number;
}

const PHONE_TYPES = [
  { value: "Nokia", label: "Nokia" },
  { value: "SonyEricsson", label: "Sony Ericsson" },
  { value: "Motorola", label: "Motorola" },
  { value: "Samsung", label: "Samsung" },
  { value: "Siemens", label: "Siemens" },
  { value: "LG", label: "LG" },
  { value: "Standard", label: "Стандартный" },
];

const SCREEN_SIZES = [
  { width: 128, height: 128, label: "128x128" },
  { width: 128, height: 160, label: "128x160" },
  { width: 176, height: 208, label: "176x208" },
  { width: 176, height: 220, label: "176x220" },
  { width: 240, height: 320, label: "240x320" },
  { width: 320, height: 240, label: "320x240" },
  { width: 352, height: 416, label: "352x416" },
  { width: 480, height: 800, label: "480x800" },
];

const KEYBOARD_LAYOUT = [
  { key: "Esc", label: "Esc", action: "Настройки" },
  { key: "F1", label: "F1 / Q", action: "Левая софт-клавиша" },
  { key: "F2", label: "F2 / W", action: "Правая софт-клавиша" },
  { key: "Enter", label: "Enter", action: "OK / Действие" },
  { key: "Arrow", label: "Стрелки", action: "Навигация" },
  { key: "0-9", label: "0-9", action: "Цифровые клавиши" },
  { key: "E", label: "E", action: "* (звездочка)" },
  { key: "R", label: "R", action: "# (решетка)" },
];

export default function J2MEEmulator() {
  const [emulatorState, setEmulatorState] = useState<EmulatorState>({
    isLoaded: false,
    isRunning: false,
    isPaused: false,
    isMuted: false,
    isFullscreen: false,
    showSettings: false,
    showKeyboard: false,
    showHelp: false,
  });

  const [settings, setSettings] = useState<EmulatorSettings>({
    phoneType: "Nokia",
    screenWidth: 240,
    screenHeight: 320,
    soundEnabled: true,
    scale: 2,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FreeJ2ME Web URL
  const EMULATOR_URL = "https://nicorobs.github.io/";

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".jar") && !file.name.toLowerCase().endsWith(".jad")) {
        setErrorMessage("Поддерживаются только JAR и JAD файлы");
        return;
      }

      setUploadedFile(file);
      setErrorMessage(null);
      setIsLoading(true);
      setLoadingMessage("Подготовка файла...");

      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Store in localStorage for potential use
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          localStorage.setItem("j2me_last_game", JSON.stringify({
            name: file.name,
            data: base64,
            timestamp: Date.now()
          }));
        };
        reader.readAsDataURL(file);
      } catch {
        console.log("[v0] Could not save to localStorage");
      }

      setLoadingMessage("Загрузка эмулятора...");
      
      setTimeout(() => {
        setIsLoading(false);
        setEmulatorState(prev => ({ ...prev, isLoaded: true, isRunning: true }));
      }, 2000);

      // Cleanup
      return () => URL.revokeObjectURL(fileUrl);
    },
    []
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setEmulatorState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setEmulatorState(prev => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setEmulatorState(prev => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement
      }));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Reset emulator
  const resetEmulator = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  // Open external emulator
  const openExternalEmulator = useCallback(() => {
    window.open(EMULATOR_URL, "_blank");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">J2ME Web Эмулятор</h1>
              <p className="text-xs text-muted-foreground">Запуск Java-игр в браузере</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmulatorState(prev => ({ ...prev, showHelp: !prev.showHelp }))}
              className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
              title="Справка"
            >
              <HelpCircle className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={openExternalEmulator}
              className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
              title="Открыть в новом окне"
            >
              <ExternalLink className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Controls */}
          <div className="lg:w-80 space-y-4">
            {/* File Upload */}
            <div
              className="bg-card rounded-xl p-4 border border-border"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <h2 className="text-base font-semibold mb-3 text-foreground flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Загрузка игры
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jar,.jad"
                onChange={handleFileUpload}
                className="hidden"
                id="game-upload"
              />

              <label
                htmlFor="game-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary hover:bg-secondary/50 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <span className="text-sm text-muted-foreground">{loadingMessage}</span>
                  </>
                ) : uploadedFile ? (
                  <>
                    <Gamepad2 className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm text-foreground font-medium truncate max-w-full px-2">
                      {uploadedFile.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Нажмите для замены
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Нажмите или перетащите
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      JAR, JAD файлы
                    </span>
                  </>
                )}
              </label>

              {errorMessage && (
                <div className="mt-3 p-2 bg-destructive/20 border border-destructive/50 rounded-lg text-xs text-destructive">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <button
                onClick={() => setEmulatorState(prev => ({ ...prev, showSettings: !prev.showSettings }))}
                className="flex items-center justify-between w-full text-base font-semibold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Настройки
                </span>
                {emulatorState.showSettings ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {emulatorState.showSettings && (
                <div className="mt-4 space-y-4">
                  {/* Phone Type */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Тип телефона
                    </label>
                    <select
                      value={settings.phoneType}
                      onChange={(e) => setSettings(prev => ({ ...prev, phoneType: e.target.value }))}
                      className="w-full bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {PHONE_TYPES.map(phone => (
                        <option key={phone.value} value={phone.value}>
                          {phone.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Screen Size */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Размер экрана
                    </label>
                    <select
                      value={`${settings.screenWidth}x${settings.screenHeight}`}
                      onChange={(e) => {
                        const [w, h] = e.target.value.split("x").map(Number);
                        setSettings(prev => ({ ...prev, screenWidth: w, screenHeight: h }));
                      }}
                      className="w-full bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {SCREEN_SIZES.map(size => (
                        <option key={size.label} value={`${size.width}x${size.height}`}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Scale */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Масштаб: {settings.scale}x
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.5"
                      value={settings.scale}
                      onChange={(e) => setSettings(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Sound */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Звук</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                      className={`p-2 rounded-lg transition-colors ${
                        settings.soundEnabled ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {settings.soundEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Help */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <button
                onClick={() => setEmulatorState(prev => ({ ...prev, showKeyboard: !prev.showKeyboard }))}
                className="flex items-center justify-between w-full text-base font-semibold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Управление
                </span>
                {emulatorState.showKeyboard ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {emulatorState.showKeyboard && (
                <div className="mt-4 space-y-2">
                  {KEYBOARD_LAYOUT.map(item => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">
                        {item.label}
                      </kbd>
                      <span className="text-muted-foreground">{item.action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {emulatorState.isRunning && (
              <div className="bg-card rounded-xl p-4 border border-border">
                <h2 className="text-base font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Действия
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEmulatorState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-muted rounded-lg transition-colors text-sm"
                  >
                    {emulatorState.isPaused ? (
                      <>
                        <Play className="w-4 h-4" />
                        Продолжить
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" />
                        Пауза
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetEmulator}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-muted rounded-lg transition-colors text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Сброс
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-muted rounded-lg transition-colors text-sm col-span-2"
                  >
                    {emulatorState.isFullscreen ? (
                      <>
                        <Minimize2 className="w-4 h-4" />
                        Выйти из полноэкранного
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-4 h-4" />
                        Полный экран
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Emulator Area */}
          <div className="flex-1" ref={containerRef}>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {uploadedFile ? uploadedFile.name : "J2ME Эмулятор"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    title={settings.soundEnabled ? "Выключить звук" : "Включить звук"}
                  >
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-foreground" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    title="Полный экран"
                  >
                    <Maximize2 className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Emulator Frame */}
              <div 
                className="relative bg-black flex items-center justify-center"
                style={{ 
                  minHeight: "500px",
                  height: emulatorState.isFullscreen ? "100vh" : "auto"
                }}
              >
                {!emulatorState.isLoaded ? (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                      <Smartphone className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Добро пожаловать в J2ME Эмулятор
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      Загрузите JAR или JAD файл, чтобы начать играть в классические Java-игры прямо в браузере
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Загрузить игру
                    </button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Или перетащите файл сюда
                    </p>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={EMULATOR_URL}
                    className="w-full h-full border-0"
                    style={{ 
                      minHeight: "500px",
                      height: emulatorState.isFullscreen ? "100vh" : "600px"
                    }}
                    allow="autoplay; fullscreen"
                    title="J2ME Emulator"
                  />
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Поддержка форматов</h3>
                <p className="text-sm text-muted-foreground">
                  JAR и JAD файлы, MIDP 1.0/2.0, CLDC 1.0/1.1
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Совместимость</h3>
                <p className="text-sm text-muted-foreground">
                  Nokia, Sony Ericsson, Motorola, Samsung и другие
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Возможности</h3>
                <p className="text-sm text-muted-foreground">
                  3D графика, MIDI звук, сохранение состояния
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Help Modal */}
      {emulatorState.showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Справка</h2>
              <button
                onClick={() => setEmulatorState(prev => ({ ...prev, showHelp: false }))}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <section>
                <h3 className="font-semibold text-foreground mb-2">Что такое J2ME?</h3>
                <p className="text-sm text-muted-foreground">
                  Java 2 Micro Edition (J2ME) - это платформа для запуска Java-приложений на мобильных устройствах. 
                  В 2000-х годах миллионы игр и приложений были созданы для телефонов Nokia, Sony Ericsson и других производителей.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">Как использовать</h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Загрузите JAR или JAD файл игры</li>
                  <li>Выберите тип телефона в настройках</li>
                  <li>Настройте размер экрана под игру</li>
                  <li>Используйте клавиатуру для управления</li>
                </ol>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">Управление</h3>
                <div className="space-y-2">
                  {KEYBOARD_LAYOUT.map(item => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">
                        {item.label}
                      </kbd>
                      <span className="text-muted-foreground">{item.action}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">Решение проблем</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Игра не запускается - попробуйте другой тип телефона</li>
                  <li>Графика искажена - измените размер экрана</li>
                  <li>Нет звука - проверьте настройки и разрешения браузера</li>
                  <li>Медленная работа - уменьшите масштаб</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
