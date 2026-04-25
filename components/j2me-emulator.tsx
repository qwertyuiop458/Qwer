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
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Hash,
  Star,
  Smartphone,
} from "lucide-react";
import JSZip from "jszip";

interface GameFile {
  name: string;
  data: ArrayBuffer;
  manifest?: Record<string, string>;
}

interface EmulatorState {
  isRunning: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
}

interface EmulatorSettings {
  screenSize: "small" | "medium" | "large";
  screenFilter: "none" | "scanlines" | "lcd";
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  frameSkip: number;
}

export default function J2MEEmulator() {
  const [gameFile, setGameFile] = useState<GameFile | null>(null);
  const [emulatorState, setEmulatorState] = useState<EmulatorState>({
    isRunning: false,
    isPaused: false,
    isMuted: false,
    isFullscreen: false,
    showSettings: false,
  });
  const [settings, setSettings] = useState<EmulatorSettings>({
    screenSize: "medium",
    screenFilter: "none",
    soundEnabled: true,
    vibrationEnabled: true,
    frameSkip: 0,
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentGames, setRecentGames] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas dimensions based on screen size
  const screenDimensions = {
    small: { width: 128, height: 160 },
    medium: { width: 240, height: 320 },
    large: { width: 320, height: 480 },
  };

  const currentDimensions = screenDimensions[settings.screenSize];

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setLoadingProgress(0);
      setErrorMessage(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        let manifest: Record<string, string> = {};

        // Check if it's a JAD file
        if (file.name.endsWith(".jad")) {
          const text = new TextDecoder().decode(arrayBuffer);
          manifest = parseManifest(text);
        }

        // Check if it's a JAR file
        if (file.name.endsWith(".jar")) {
          const zip = await JSZip.loadAsync(arrayBuffer);
          const manifestFile = zip.file("META-INF/MANIFEST.MF");
          if (manifestFile) {
            const manifestText = await manifestFile.async("string");
            manifest = parseManifest(manifestText);
          }
          setLoadingProgress(50);
        }

        setLoadingProgress(100);

        const newGame: GameFile = {
          name: file.name,
          data: arrayBuffer,
          manifest,
        };

        setGameFile(newGame);
        setRecentGames((prev) => {
          const updated = [file.name, ...prev.filter((g) => g !== file.name)];
          return updated.slice(0, 5);
        });

        // Start emulation
        setTimeout(() => {
          setIsLoading(false);
          startEmulation(newGame);
        }, 500);
      } catch {
        setErrorMessage("Ошибка загрузки файла. Убедитесь, что это корректный JAR/JAD файл.");
        setIsLoading(false);
      }
    },
    []
  );

  // Parse JAD/MANIFEST.MF
  const parseManifest = (text: string): Record<string, string> => {
    const manifest: Record<string, string> = {};
    const lines = text.split(/\r?\n/);
    let currentKey = "";

    for (const line of lines) {
      if (line.startsWith(" ") && currentKey) {
        manifest[currentKey] += line.trim();
      } else {
        const colonIndex = line.indexOf(":");
        if (colonIndex > 0) {
          currentKey = line.substring(0, colonIndex).trim();
          manifest[currentKey] = line.substring(colonIndex + 1).trim();
        }
      }
    }

    return manifest;
  };

  // Start emulation (demo visualization)
  const startEmulation = useCallback((game: GameFile) => {
    setEmulatorState((prev) => ({ ...prev, isRunning: true, isPaused: false }));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Demo: Draw a simple loading/running screen
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";

    const gameName = game.manifest?.["MIDlet-Name"] || game.name.replace(/\.(jar|jad)$/i, "");
    ctx.fillText(gameName, canvas.width / 2, 30);

    ctx.font = "10px monospace";
    ctx.fillStyle = "#00ff00";
    ctx.fillText("Загружено", canvas.width / 2, canvas.height / 2);

    // Draw demo phone screen content
    drawDemoScreen(ctx, canvas.width, canvas.height);
  }, []);

  // Draw demo screen
  const drawDemoScreen = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Status bar
    ctx.fillStyle = "#003366";
    ctx.fillRect(0, 0, width, 20);

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("J2ME", 5, 14);

    ctx.textAlign = "right";
    const time = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    ctx.fillText(time, width - 5, 14);

    // Main content area
    ctx.fillStyle = "#001133";
    ctx.fillRect(0, 20, width, height - 40);

    // Menu items
    ctx.fillStyle = "#00aaff";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";

    const menuItems = ["Новая игра", "Продолжить", "Настройки", "Выход"];
    const startY = 60;
    const itemHeight = 25;

    menuItems.forEach((item, index) => {
      const y = startY + index * itemHeight;

      if (index === 0) {
        ctx.fillStyle = "#0066cc";
        ctx.fillRect(10, y - 12, width - 20, 20);
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = "#00aaff";
      }

      ctx.fillText(item, width / 2, y);
    });

    // Softkeys
    ctx.fillStyle = "#003366";
    ctx.fillRect(0, height - 20, width, 20);

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Выбор", 5, height - 6);

    ctx.textAlign = "right";
    ctx.fillText("Меню", width - 5, height - 6);
  };

  // Toggle pause
  const togglePause = useCallback(() => {
    setEmulatorState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Reset emulation
  const resetEmulation = useCallback(() => {
    if (gameFile) {
      startEmulation(gameFile);
    }
  }, [gameFile, startEmulation]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setEmulatorState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setEmulatorState((prev) => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setEmulatorState((prev) => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  // Handle key press (for phone keypad)
  const handleKeyPress = useCallback((key: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Visual feedback
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setTimeout(() => {
      if (canvasRef.current) {
        const c = canvasRef.current.getContext("2d");
        if (c) {
          c.fillStyle = "#001133";
          c.fillRect(0, 20, canvas.width, canvas.height - 40);
        }
      }
    }, 100);
  }, []);

  // Drag and drop support
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
      if (file.name.endsWith(".jar") || file.name.endsWith(".jad")) {
        // Create a synthetic event
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          fileInputRef.current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
      } else {
        setErrorMessage("Поддерживаются только JAR и JAD файлы");
      }
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial screen
    ctx.fillStyle = "#001133";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0066cc";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("J2ME Web Emulator", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "#666666";
    ctx.font = "10px monospace";
    ctx.fillText(
      "Загрузите JAR/JAD файл",
      canvas.width / 2,
      canvas.height / 2 + 10
    );
  }, [currentDimensions]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* Left Panel - Controls & Info */}
      <div className="lg:w-80 space-y-4">
        {/* File Upload */}
        <div
          className="bg-card rounded-xl p-4 border border-border"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h2 className="text-lg font-semibold mb-3 text-foreground">
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
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              Нажмите или перетащите
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              JAR, JAD файлы
            </span>
          </label>

          {isLoading && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Загрузка...</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-400">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Game Info */}
        {gameFile && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-lg font-semibold mb-3 text-foreground">
              Информация
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Название:</span>
                <span className="text-foreground truncate ml-2 max-w-[150px]">
                  {gameFile.manifest?.["MIDlet-Name"] || gameFile.name}
                </span>
              </div>
              {gameFile.manifest?.["MIDlet-Vendor"] && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Издатель:</span>
                  <span className="text-foreground truncate ml-2 max-w-[150px]">
                    {gameFile.manifest["MIDlet-Vendor"]}
                  </span>
                </div>
              )}
              {gameFile.manifest?.["MIDlet-Version"] && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Версия:</span>
                  <span className="text-foreground">
                    {gameFile.manifest["MIDlet-Version"]}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-lg font-semibold mb-3 text-foreground">
              Недавние игры
            </h2>
            <ul className="space-y-2">
              {recentGames.map((game, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground truncate flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span className="truncate">{game}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Settings */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <button
            onClick={() =>
              setEmulatorState((prev) => ({
                ...prev,
                showSettings: !prev.showSettings,
              }))
            }
            className="flex items-center justify-between w-full text-lg font-semibold text-foreground"
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
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Размер экрана
                </label>
                <select
                  value={settings.screenSize}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      screenSize: e.target.value as "small" | "medium" | "large",
                    }))
                  }
                  className="w-full bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="small">128x160 (Маленький)</option>
                  <option value="medium">240x320 (Средний)</option>
                  <option value="large">320x480 (Большой)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Фильтр экрана
                </label>
                <select
                  value={settings.screenFilter}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      screenFilter: e.target.value as "none" | "scanlines" | "lcd",
                    }))
                  }
                  className="w-full bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">Без фильтра</option>
                  <option value="scanlines">Scanlines</option>
                  <option value="lcd">LCD эффект</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Пропуск кадров: {settings.frameSkip}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={settings.frameSkip}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      frameSkip: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center - Emulator Screen */}
      <div className="flex-1 flex flex-col items-center" ref={containerRef}>
        {/* Phone Frame */}
        <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-3xl p-4 shadow-2xl">
          {/* Screen Bezel */}
          <div className="bg-black rounded-xl p-2 relative">
            {/* Control Bar */}
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-2">
                {emulatorState.isRunning ? (
                  <>
                    <button
                      onClick={togglePause}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-muted transition-colors"
                      title={emulatorState.isPaused ? "Продолжить" : "Пауза"}
                    >
                      {emulatorState.isPaused ? (
                        <Play className="w-4 h-4 text-success" />
                      ) : (
                        <Pause className="w-4 h-4 text-warning" />
                      )}
                    </button>
                    <button
                      onClick={resetEmulation}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-muted transition-colors"
                      title="Перезапуск"
                    >
                      <RotateCcw className="w-4 h-4 text-foreground" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Ожидание...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-secondary hover:bg-muted transition-colors"
                  title={emulatorState.isMuted ? "Включить звук" : "Выключить звук"}
                >
                  {emulatorState.isMuted ? (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-foreground" />
                  )}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-secondary hover:bg-muted transition-colors"
                  title="Полный экран"
                >
                  {emulatorState.isFullscreen ? (
                    <X className="w-4 h-4 text-foreground" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Canvas Screen */}
            <div
              className={`relative ${
                settings.screenFilter === "scanlines"
                  ? "after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0px,rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] after:pointer-events-none"
                  : settings.screenFilter === "lcd"
                  ? "after:absolute after:inset-0 after:bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.1)_0px,transparent_1px,transparent_3px)] after:pointer-events-none"
                  : ""
              }`}
            >
              <canvas
                ref={canvasRef}
                width={currentDimensions.width}
                height={currentDimensions.height}
                className="bg-black rounded-lg"
                style={{
                  imageRendering: "pixelated",
                  width: `${currentDimensions.width * 1.5}px`,
                  height: `${currentDimensions.height * 1.5}px`,
                }}
              />
            </div>
          </div>

          {/* Phone Keypad */}
          <div className="mt-4 px-4">
            {/* Soft Keys */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => handleKeyPress("softLeft")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-white transition-colors"
              >
                Выбор
              </button>
              <button
                onClick={() => handleKeyPress("softRight")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-white transition-colors"
              >
                Меню
              </button>
            </div>

            {/* D-Pad */}
            <div className="flex justify-center mb-4">
              <div className="grid grid-cols-3 gap-1">
                <div />
                <button
                  onClick={() => handleKeyPress("up")}
                  className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors active:bg-gray-400"
                >
                  <ChevronUp className="w-6 h-6 text-white" />
                </button>
                <div />
                <button
                  onClick={() => handleKeyPress("left")}
                  className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors active:bg-gray-400"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => handleKeyPress("ok")}
                  className="w-12 h-12 bg-primary hover:bg-primary/80 rounded-lg flex items-center justify-center transition-colors active:bg-primary/60"
                >
                  <span className="text-white text-xs font-bold">OK</span>
                </button>
                <button
                  onClick={() => handleKeyPress("right")}
                  className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors active:bg-gray-400"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                <div />
                <button
                  onClick={() => handleKeyPress("down")}
                  className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors active:bg-gray-400"
                >
                  <ChevronDown className="w-6 h-6 text-white" />
                </button>
                <div />
              </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="w-full h-10 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors active:bg-gray-500 flex items-center justify-center"
                  >
                    {key === "*" ? (
                      <Star className="w-4 h-4" />
                    ) : key === "#" ? (
                      <Hash className="w-4 h-4" />
                    ) : (
                      key
                    )}
                  </button>
                )
              )}
            </div>

            {/* Call/End Buttons */}
            <div className="flex justify-center gap-8 mt-4">
              <button
                onClick={() => handleKeyPress("call")}
                className="w-14 h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Phone className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => handleKeyPress("end")}
                className="w-14 h-10 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Phone className="w-5 h-5 text-white rotate-135" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Instructions */}
      <div className="lg:w-72 space-y-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Инструкция
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                1
              </span>
              <span>Загрузите JAR или JAD файл игры</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                2
              </span>
              <span>Дождитесь загрузки и инициализации</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
              <span>Используйте виртуальную клавиатуру</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                4
              </span>
              <span>Настройте размер экрана и фильтры</span>
            </li>
          </ol>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Управление
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Стрелки / WASD</span>
              <span>Навигация</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Enter</span>
              <span>OK / Выбор</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Q / E</span>
              <span>Софт-клавиши</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>0-9</span>
              <span>Цифры</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">
            Это демонстрационная версия веб-эмулятора J2ME. Полная эмуляция Java
            ME требует реализации JVM в браузере.
          </p>
        </div>
      </div>
    </div>
  );
}
