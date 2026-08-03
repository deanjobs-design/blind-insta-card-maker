import { FieldValues } from '@/lib/types'
import { getLogoScale } from '@/lib/logoScale'

interface Props {
  values: FieldValues
  fieldKey: string          // 로고 이미지 필드 키 (예: 'channelThumbnail', 'c1Logo')
  size: number              // 원 지름(px)
  fallbackSrc?: string      // 업로드 전 기본 이미지
  fallbackInner?: number    // 기본 이미지일 때 안쪽 크기(px) — blind 로고 등
}

// 흰 배경 원 + 업로드 로고를 비율 유지(contain)로 배치, 크기 조절 지원
export function LogoCircle({ values, fieldKey, size, fallbackSrc, fallbackInner }: Props) {
  const src = values[fieldKey]
  const scale = getLogoScale(values, fieldKey) / 100 // 0.4 ~ 1.0

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: '#ffffff',
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(0,0,0,0.06)',
    }}>
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            objectFit: 'contain',
          }}
        />
      ) : fallbackSrc ? (
        <img
          src={fallbackSrc}
          alt=""
          style={
            fallbackInner
              ? { height: fallbackInner, width: 'auto', objectFit: 'contain', opacity: 0.5 }
              : { width: '100%', height: '100%', objectFit: 'cover' }
          }
        />
      ) : null}
    </div>
  )
}
