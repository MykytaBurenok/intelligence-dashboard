'use client'

import { useParams } from 'next/navigation'

export default function ShiftDetailPage() {
  const params = useParams()

  return (
    <main>
      <h1>Shift {params?.id}</h1>
    </main>
  )
}
