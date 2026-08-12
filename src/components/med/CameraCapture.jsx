import React, { useEffect, useRef, useState } from "react";
import { Camera, X, RefreshCw, Check } from "lucide-react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [shot, setShot] = useState(null); // data URL preview

  const stop = () => {
    streamRef.current?.getTracks?.().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (e) {
        setError(
          e?.name === "NotAllowedError"
            ? "Camera access was blocked. Allow camera permission in your browser."
            : "Couldn't open the camera. You can still upload a photo instead."
        );
      }
    })();
    return () => {
      mounted = false;
      stop();
    };
  }, []);

  const snap = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 960;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    const url = canvas.toDataURL("image/jpeg", 0.9);
    setShot(url);
    stop();
  };

  const retake = async () => {
    setShot(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setReady(true);
    } catch (e) {
      setError("Couldn't reopen the camera.");
    }
  };

  const confirm = async () => {
    const res = await fetch(shot);
    const blob = await res.blob();
    onCapture(new File([blob], "capture.jpg", { type: "image/jpeg" }));
  };

  const close = () => {
    stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm font-medium">Camera</span>
        <button onClick={close} className="rounded-full p-2 hover:bg-white/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      {error ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
          <Camera className="h-10 w-10 text-white/60" />
          <p className="mt-4 max-w-sm text-sm text-white/80">{error}</p>
          <button onClick={close} className="mt-6 rounded-full bg-white/10 px-5 py-2.5 text-sm">
            Go back
          </button>
        </div>
      ) : (
        <div className="relative flex flex-1 items-center justify-center">
          {shot ? (
            <img src={shot} alt="capture" className="max-h-full max-w-full object-contain" />
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className="max-h-full max-w-full object-contain"
              style={{ display: ready ? "block" : "none" }}
            />
          )}
          {!ready && !shot && (
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          )}
        </div>
      )}

      {!error && (
        <div className="flex items-center justify-center gap-8 px-5 py-8">
          {shot ? (
            <>
              <button onClick={retake} className="flex flex-col items-center gap-2 text-white">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <RefreshCw className="h-5 w-5" />
                </span>
                <span className="text-xs">Retake</span>
              </button>
              <button onClick={confirm} className="flex flex-col items-center gap-2 text-white">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-6 w-6" />
                </span>
                <span className="text-xs">Use photo</span>
              </button>
            </>
          ) : (
            <button onClick={snap} disabled={!ready} className="flex flex-col items-center gap-2 text-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/10 disabled:opacity-50">
                <Camera className="h-6 w-6" />
              </span>
              <span className="text-xs">Capture</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}