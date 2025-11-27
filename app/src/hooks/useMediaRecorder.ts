import { useCallback, useEffect, useRef, useState } from "react";

type PermissionState = "prompt" | "granted" | "denied";
type RecordingState = "idle" | "recording";

export const useMediaRecorder = () => {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const stopPromiseRef = useRef<Promise<Blob> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const requestStream = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(media);
      setPermissionState("granted");
      setError(null);
      return media;
    } catch (err) {
      setPermissionState("denied");
      const message = err instanceof Error ? err.message : "无法获取媒体权限";
      setError(message);
      throw err;
    }
  }, []);

  const startRecording = useCallback(async () => {
    const media = stream ?? (await requestStream());
    chunksRef.current = [];
    const recorder = new MediaRecorder(media, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;
    setRecordingState("recording");
    startTimeRef.current = performance.now();

    stopPromiseRef.current = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onerror = (event) => {
        setRecordingState("idle");
        reject(event.error);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordingState("idle");
        resolve(blob);
      };
    });

    recorder.start();
    return stopPromiseRef.current;
  }, [requestStream, stream]);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !stopPromiseRef.current) return null;
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    const blob = await stopPromiseRef.current;
    const duration = startTimeRef.current
      ? performance.now() - startTimeRef.current
      : 0;
    startTimeRef.current = null;
    return { blob, duration };
  }, []);

  const reset = useCallback(() => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setRecordingState("idle");
    setError(null);
    chunksRef.current = [];
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  return {
    permissionState,
    recordingState,
    stream,
    error,
    startRecording,
    stopRecording,
    reset,
  };
};
