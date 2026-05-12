/** 마크다운 content에서 이미지 URL을 추출한다. ![alt](url) 패턴 매칭. */
export function extractImageUrls(content: string): string[] {
  return [...content.matchAll(/!\[.*?\]\((https?:\/\/[^)]+)\)/g)].map(
    (m) => m[1]
  )
}
