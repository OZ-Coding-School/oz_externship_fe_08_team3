import { http, HttpResponse } from 'msw'

export const completionsHandlers = [
  http.post('*/chatbot/sessions/:sessionId/completions/', () => {
    // SSE 스트리밍 mock — cs/handler.ts에 실제 SSE mock이 구현되어 있음
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        const chunks = ['안녕', '하세요! ', '무엇을 ', '도와드릴까요?']
        let i = 0
        const interval = setInterval(() => {
          if (i < chunks.length) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ message: chunks[i] })}\n\n`
              )
            )
            i++
          } else {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            clearInterval(interval)
          }
        }, 100)
      },
    })

    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  }),
]
