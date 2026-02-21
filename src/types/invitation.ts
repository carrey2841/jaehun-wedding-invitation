/** 청첩장 데이터 타입 (정책서 기준) */

/** 커버: 대표 이미지, 예식 일시, 위치+시간 */
export interface CoverInfo {
  heroImageUrl?: string
  weddingDateLabel?: string
  weddingDateTime?: string
  placeName?: string
  placeAddress?: string
}

/** 초대문(모시는 말씀) - 나중에 값 변경 가능 */
export interface InvitationTextInfo {
  title?: string
  body?: string
  groomLine?: string
  brideLine?: string
}

/** 연락처 - 화면에는 노출하지 않고 전화/문자 버튼만 */
export interface ContactForAction {
  hostPhone?: string
  groomPhone?: string
  bridePhone?: string
}

/** 일시·장소·오시는 길 */
export interface VenueInfo {
  date?: string
  time?: string
  dateTimeLabel?: string
  placeName?: string
  address?: string
  mapUrl?: string
  subway?: string
  bus?: string
  car?: string
  parking?: string
}

/** 갤러리: 40~50장, 01.png ~ 12.png 등 */
export interface GalleryInfo {
  totalCount?: number
  extension?: string
}

export interface ParentsInfo {
  groomFather?: string
  groomMother?: string
  brideFather?: string
  brideMother?: string
}

export interface ContactInfo {
  phone?: string
  kakao?: string
  etc?: string
}

/** 계좌 1건 (신랑/신랑 아버지/신랑 어머니 등 개별) */
export interface AccountInfo {
  relation?: string
  bankName?: string
  accountHolder?: string
  accountNumber?: string
}

/** 신랑측/신부측 계좌 목록 */
export interface AccountsBySide {
  groom: AccountInfo[]
  bride: AccountInfo[]
}

export interface InvitationData {
  cover: CoverInfo
  invitationText: InvitationTextInfo
  contactForAction: ContactForAction
  venue: VenueInfo
  gallery: GalleryInfo
  parents: ParentsInfo
  contact: ContactInfo
  accountsBySide: AccountsBySide
}
