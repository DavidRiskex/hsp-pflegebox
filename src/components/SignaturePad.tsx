"use client";

import { useRef, useState, useEffect } from "react";

interface SignaturePadProps {
  onSave: (signatureBase64: string) => void;
  onClear?: () => void;
}

export default function SignaturePad({ onSave, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-quality lines
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1b6b54"; // Emerald Primary
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setIsEmpty(false);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
      if (onClear) onClear();
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas && !isEmpty) {
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
    }
  };

  return (
    <div className="w-full">
      <div className="relative glass-card bg-white rounded-3xl p-4 editorial-shadow border border-surface-variant/20 mb-6">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto cursor-crosshair touch-none bg-surface-container-lowest rounded-2xl"
        />
        
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 flex-col gap-2">
            <span className="material-symbols-outlined text-4xl">edit</span>
            <span className="text-sm font-bold tracking-widest uppercase">Hier unterschreiben</span>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={clear}
          className="flex-1 px-6 py-4 rounded-xl border-2 border-surface-variant/20 font-bold hover:bg-surface-variant/10 transition-colors"
        >
          Löschen
        </button>
        <button
          onClick={save}
          disabled={isEmpty}
          className="flex-1 px-6 py-4 rounded-xl bg-primary text-on-primary font-bold shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-30 disabled:grayscale"
        >
          Bestätigen
        </button>
      </div>
      
      <p className="text-center text-[10px] text-on-surface-variant mt-4 opacity-100 font-medium">
        Indem Sie hier unterschreiben, bestätigen Sie die Richtigkeit Ihrer Angaben und stimmen dem Antragsprozess zu.
      </p>
    </div>
  );
}
