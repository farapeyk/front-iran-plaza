"use client"
import Image from "next/image";

import { useState } from "react"
import { cn } from "@/design/lib/utils"
const playFill = "/design/icons/play-fill.svg"
const pauseIcon = "/design/icons/pause.svg"

type VoicePlayerProps = {
  className?: string
  playing?: boolean
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  "aria-label"?: string
}

/** Figma Voice player — play / pause toggle */
function VoicePlayer({
  className,
  playing: controlled,
  defaultPlaying = false,
  onPlayingChange,
  "aria-label": ariaLabel,
}: VoicePlayerProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultPlaying)
  const playing = controlled ?? uncontrolled

  function toggle() {
    const next = !playing
    if (controlled === undefined) setUncontrolled(next)
    onPlayingChange?.(next)
  }

  return (
    <button
      type="button"
      data-slot="voice-player"
      data-state={playing ? "pause" : "play"}
      aria-label={ariaLabel ?? (playing ? "توقف" : "پخش صوت")}
      onClick={toggle}
      className={cn(
        "flex size-8 items-center justify-center overflow-clip rounded-full border-2 border-secondary-25 bg-secondary-200 transition-opacity hover:opacity-90",
        !playing && "ps-0.5",
        className
      )}
    >
      {playing ? (
        <Image alt="" className="size-4" height={16} src={pauseIcon} width={16} />
      ) : (
        <Image alt="" className="h-[13px] w-[11px]" height={13} src={playFill} width={11} />
      )}
    </button>
  )
}

export { VoicePlayer }
