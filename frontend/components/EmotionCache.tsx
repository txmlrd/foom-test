"use client"

import type React from "react"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { useServerInsertedHTML } from "next/navigation"
import { useState } from "react"

export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "mui" })
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      inserted.push(args[1])
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const inserted = flush()
    if (inserted.length === 0) {
      return null
    }
    return (
      <style
        key="emotion-cache"
        dangerouslySetInnerHTML={{
          __html: inserted.join("\n"),
        }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
