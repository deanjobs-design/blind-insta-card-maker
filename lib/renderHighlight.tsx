import React from 'react'

// [텍스트]를 더 굵게(굵기 한 단계 ↑) 렌더링. 크기·색상은 그대로.
export function renderBolder(text: string, boldWeight = 600) {
  return text.split(/(\[.*?\])/g).map((part, i) =>
    part.startsWith('[') && part.endsWith(']')
      ? <span key={i} style={{ fontWeight: boldWeight }}>{part.slice(1, -1)}</span>
      : <span key={i}>{part}</span>
  )
}
