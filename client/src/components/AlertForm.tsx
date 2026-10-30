import { useState, type FormEvent } from 'react'
import { api, getErrorMessage } from '../lib/api'
import type { AlertCondition, PriceAlert } from '../types'
import { Button, ErrorMessage, Input, Select } from './ui'

interface Props {
  ticker: string
  onCreated: (alert: PriceAlert) => void
  onCancel: () => void
}

const CONDITIONS: { value: AlertCondition; label: string }[] = [
  { value: 'below', label: 'Price below ($)' },
  { value: 'above', label: 'Price above ($)' },
  { value: 'percentDown', label: 'Price down today (%)' },
  { value: 'percentUp', label: 'Price up today (%)' },
]

export default function AlertForm({ ticker, onCreated, onCancel }: Props) {
  const [condition, setCondition] = useState<AlertCondition>('below')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isPercent = condition === 'percentUp' || condition === 'percentDown'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const { data } = await api.post<PriceAlert>('/alerts', { ticker, condition, value: Number(value) })
      onCreated(data)
      setValue('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-line p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-2 text-lg font-bold">New alert for {ticker}</span>
        <Select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)} aria-label="Condition">
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          placeholder={isPercent ? 'e.g. 5' : 'e.g. 300'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          aria-label={isPercent ? 'Percent' : 'Price'}
          className="w-32"
        />
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add alert'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <ErrorMessage message={error} />
    </form>
  )
}
