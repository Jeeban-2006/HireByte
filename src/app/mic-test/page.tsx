"use client";

export default function MicrophoneButton() {
  const requestMic = () => {
    // ❗ NOTHING before this line
    navigator.mediaDevices.getUserMedia({ audio: true });
  };

  return (
    <button
      onClick={requestMic}
      style={{ padding: 12, fontSize: 16 }}
    >
      Enable Microphone
    </button>
  );
}
