import { create } from 'zustand'
import type { InvitationData } from '../types/invitation'

const defaultInvitationText = {
  title: 'Invitation',
  body: `살랑이는 바람결에
  사랑이 묻어나는 계절입니다.
  
  사랑으로 가득 채워 즐거움은 나누고
  어려움은 이겨내며 함께 나아가는
  삶을 꾸리겠습니다.

  축하와 격려 속에 내딛는 저희들의 첫걸음을
  지켜봐 주시면 감사하겠습니다.`,
  groomLine: '이재훈 • 이영주 올림',
  brideLine: '',
}

interface InvitationStore extends InvitationData {
  setCover: (cover: Partial<InvitationData['cover']>) => void
  setInvitationText: (t: Partial<InvitationData['invitationText']>) => void
  setContactForAction: (c: Partial<InvitationData['contactForAction']>) => void
  setVenue: (venue: Partial<InvitationData['venue']>) => void
  setGallery: (gallery: Partial<InvitationData['gallery']>) => void
  setParents: (parents: Partial<InvitationData['parents']>) => void
  setContact: (contact: Partial<InvitationData['contact']>) => void
  setAccountsBySide: (accounts: Partial<InvitationData['accountsBySide']>) => void
}

const initialState: InvitationData = {
  cover: {
    weddingDateLabel: '2026년 05월 16일 토요일 오후 5시',
    placeName: '라비니움',
    placeAddress: '서울특별시 송파구 천호대로 996',
  },
  invitationText: defaultInvitationText,
  contactForAction: {},
  venue: {
    dateTimeLabel: '2026년 05월 16일 토요일 오후 5시',
    date: '2026-05-16',
    time: '17:00',
    placeName: '라비니움 1층 리츄얼홀',
    address: '서울특별시 송파구 천호대로 996',
    mapUrl: 'https://map.naver.com/v5/search/라비니움%20이야',
    subway: '5호선, 8호선 천호역 10번출구 바로 앞',
    car: `주차 1시간 30분 무료
    (라비니움 주차장 이용 시)`,
    parking: `라비니움 웨딩홀 주차장이 다소 협소하여, 
    공영주차장 이용을 부탁드립니다.
    
    공영주차장 안내
서울시 강동구 천호대로 1026-1
천호역 6번출구 앞 / 천호지하공영주차장(천호입구) 지하 1, 2층

1. 셔틀버스 이용 시
천호지하공영주차장(천호입구) 내부에서 탑승
주차 위치 기둥번호 A,B,C,D 20-60번 사이 운행
(주차하신 차량 앞에서 대기 후 탑승/주차위치 메모/웨딩진행 시에만 운영)

2. 도보 이용 시
천호지하공영주차장(천호입구) 주차 후 
현대백화점 방향 직진 천호역 10번 출구 앞`,
  },
  gallery: { totalCount: 50, extension: 'jpg' },
  parents: {},
  contact: {},
  accountsBySide: { groom: [], bride: [] },
}

export const useInvitationStore = create<InvitationStore>((set) => ({
  ...initialState,
  setCover: (cover) => set((s) => ({ cover: { ...s.cover, ...cover } })),
  setInvitationText: (t) =>
    set((s) => ({ invitationText: { ...s.invitationText, ...t } })),
  setContactForAction: (c) =>
    set((s) => ({ contactForAction: { ...s.contactForAction, ...c } })),
  setVenue: (venue) => set((s) => ({ venue: { ...s.venue, ...venue } })),
  setGallery: (gallery) => set((s) => ({ gallery: { ...s.gallery, ...gallery } })),
  setParents: (parents) => set((s) => ({ parents: { ...s.parents, ...parents } })),
  setContact: (contact) => set((s) => ({ contact: { ...s.contact, ...contact } })),
  setAccountsBySide: (accounts) =>
    set((s) => ({
      accountsBySide: {
        ...s.accountsBySide,
        ...accounts,
      },
    })),
}))
