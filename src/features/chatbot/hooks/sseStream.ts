import type { ChatMessage } from '@/features/chatbot/widgetTypes'

const DEFAULT_MAX_BUFFER_SIZE = 100_000

export interface ChatHistoryMessage {
  role: 'user' | 'assistant'
  message?: string
  content?: string
  id?: string | number
}

export interface SseStreamResult {
  completed: boolean
  hasReceivedChunk: boolean
  bufferExceeded: boolean
}

interface ParsedSseEvent {
  done: boolean
  message: string | null
}

interface StreamState {
  assistantText: string
  completed: boolean
  hasReceivedChunk: boolean
  bufferExceeded: boolean
}

export function mapHistoryToMessages(
  results: ChatHistoryMessage[],
  idPrefix: string
): ChatMessage[] {
  return results.map((item, index) => ({
    id: item.id?.toString() ?? `${idPrefix}-history-${index}`,
    role: item.role,
    message: item.message ?? item.content ?? '',
  }))
}

function parseSseEvent(event: string): ParsedSseEvent {
  const line = event.split('\n').find((l) => l.startsWith('data:'))
  if (!line) return { done: false, message: null }

  const data = line.replace(/^data:\s*/, '').trim()
  if (data === '[DONE]') return { done: true, message: null }

  try {
    const chunk = JSON.parse(data) as { message?: unknown }
    return {
      done: false,
      message: typeof chunk.message === 'string' ? chunk.message : null,
    }
  } catch {
    return { done: false, message: null }
  }
}

function splitSseEvents(buffer: string) {
  const events = buffer.split('\n\n')
  return {
    events,
    rest: events.pop() ?? '',
  }
}

function applySseEvent({
  event,
  state,
  maxBufferSize,
  onChunk,
  onBufferExceeded,
}: {
  event: string
  state: StreamState
  maxBufferSize: number
  onChunk: (message: string) => void
  onBufferExceeded?: () => void
}) {
  const parsed = parseSseEvent(event)

  if (parsed.done) {
    state.completed = true
    return
  }
  if (parsed.message == null) return

  state.hasReceivedChunk = true
  state.assistantText += parsed.message

  if (state.assistantText.length > maxBufferSize) {
    state.bufferExceeded = true
    onBufferExceeded?.()
    return
  }

  onChunk(parsed.message)
}

function getSseReader(response: Response) {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('ReadableStream 없음')
  return reader
}

async function readNextChunk({
  reader,
  decoder,
  buffer,
  state,
  maxBufferSize,
  onChunk,
  onBufferExceeded,
}: {
  reader: ReadableStreamDefaultReader<Uint8Array>
  decoder: TextDecoder
  buffer: string
  state: StreamState
  maxBufferSize: number
  onChunk: (message: string) => void
  onBufferExceeded?: () => void
}) {
  const { done, value } = await reader.read()
  if (done) return { buffer, done: true }

  const { events, rest } = splitSseEvents(
    buffer + decoder.decode(value, { stream: true })
  )

  for (const event of events) {
    applySseEvent({
      event,
      state,
      maxBufferSize,
      onChunk,
      onBufferExceeded,
    })
    if (state.completed || state.bufferExceeded) break
  }

  return { buffer: rest, done: false }
}

export async function readSseMessageStream({
  response,
  onChunk,
  onBufferExceeded,
  maxBufferSize = DEFAULT_MAX_BUFFER_SIZE,
}: {
  response: Response
  onChunk: (message: string) => void
  onBufferExceeded?: () => void
  maxBufferSize?: number
}): Promise<SseStreamResult> {
  const reader = getSseReader(response)
  const decoder = new TextDecoder()
  let buffer = ''
  const state: StreamState = {
    assistantText: '',
    completed: false,
    hasReceivedChunk: false,
    bufferExceeded: false,
  }

  while (true) {
    const next = await readNextChunk({
      reader,
      decoder,
      buffer,
      state,
      maxBufferSize,
      onChunk,
      onBufferExceeded,
    })
    buffer = next.buffer
    const done = next.done || state.completed || state.bufferExceeded
    if (done) break
  }

  if (!state.completed && state.hasReceivedChunk) {
    state.completed = true
  }

  return {
    completed: state.completed,
    hasReceivedChunk: state.hasReceivedChunk,
    bufferExceeded: state.bufferExceeded,
  }
}
