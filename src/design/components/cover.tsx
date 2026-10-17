"use client"
import Image from "next/image";

const coverPattern = "/design/cover-pattern.svg"

export function Cover() {
  return (
    <section
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--brand-950)] to-[var(--brand-700)]"
      data-name="Cover"
      data-node-id="4973:1056"
    >
      <h1
        className="relative z-10 px-6 text-center font-bold leading-[1.4] text-[var(--text-light-title)] text-[clamp(3rem,11.5vw,13.75rem)] tracking-tight"
        data-node-id="4973:1397"
      >
        Iran Plazza
      </h1>

      <div
        aria-hidden
        className="pointer-events-none absolute top-[-433px] left-[calc(50%+702.5px)] h-[1379px] w-[1405px] -translate-x-1/2 max-lg:opacity-70"
        data-name="Pattern"
        data-node-id="5695:33889"
      >
        <Image
          alt=""
          className="block size-full max-w-none"
          height={1379}
          src={coverPattern}
          width={1405}
        />
      </div>
    </section>
  )
}
