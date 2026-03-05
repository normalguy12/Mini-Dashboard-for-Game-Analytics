"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { postAnalytics } from "@/lib/api";
import ErrorMessage from "@/app/components/ui/ErrorMessage";
import type { CreateAnalyticsDto } from "@/lib/types";

interface AddEntryFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface FormErrors {
  gameId?: string;
  eventType?: string;
  playerId?: string;
  score?: string;
  duration?: string;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const labelClass = "mb-1 block text-xs font-medium text-zinc-600";

export default function AddEntryForm({ onSuccess, onClose }: AddEntryFormProps) {
  const [gameId, setGameId] = useState("");
  const [eventType, setEventType] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [score, setScore] = useState("");
  const [duration, setDuration] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!gameId.trim()) e.gameId = "Game ID is required.";
    if (!eventType.trim()) e.eventType = "Event Type is required.";
    if (!playerId.trim()) e.playerId = "Player ID is required.";
    if (score !== "" && isNaN(Number(score))) e.score = "Score must be a number.";
    if (duration !== "" && isNaN(Number(duration))) e.duration = "Duration must be a number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);
    if (!validate()) return;

    const dto: CreateAnalyticsDto = {
      gameId: gameId.trim(),
      eventType: eventType.trim(),
      playerId: playerId.trim(),
      ...(score !== "" ? { score: Number(score) } : {}),
      ...(duration !== "" ? { duration: Number(duration) } : {}),
    };

    setSubmitting(true);
    try {
      await postAnalytics(dto);
      setSuccessMsg("Entry created successfully!");
      onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to create entry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Add Analytics Entry</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            ✕
          </button>
        </div>

        {apiError && <div className="mb-4"><ErrorMessage message={apiError} /></div>}
        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className={labelClass}>Game ID *</label>
            <input
              type="text"
              className={clsx(inputClass, errors.gameId && "border-red-400")}
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="e.g. game-42"
            />
            {errors.gameId && <p className="mt-1 text-xs text-red-500">{errors.gameId}</p>}
          </div>

          <div>
            <label className={labelClass}>Event Type *</label>
            <input
              type="text"
              className={clsx(inputClass, errors.eventType && "border-red-400")}
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g. level_complete"
            />
            {errors.eventType && <p className="mt-1 text-xs text-red-500">{errors.eventType}</p>}
          </div>

          <div>
            <label className={labelClass}>Player ID *</label>
            <input
              type="text"
              className={clsx(inputClass, errors.playerId && "border-red-400")}
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="e.g. player-007"
            />
            {errors.playerId && <p className="mt-1 text-xs text-red-500">{errors.playerId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Score (optional)</label>
              <input
                type="number"
                className={clsx(inputClass, errors.score && "border-red-400")}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="0"
              />
              {errors.score && <p className="mt-1 text-xs text-red-500">{errors.score}</p>}
            </div>
            <div>
              <label className={labelClass}>Duration in s (optional)</label>
              <input
                type="number"
                className={clsx(inputClass, errors.duration && "border-red-400")}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
              />
              {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={clsx(
                "rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors",
                submitting
                  ? "cursor-not-allowed bg-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
