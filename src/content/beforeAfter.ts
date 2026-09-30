// 전후사진 (분야 key 는 사이트맵 시술 분류와 같음)
// ※ 실제 사진 · 환자 동의가 준비되면 여기에 추가하거나, 관리자 게시판과 연결합니다.
export type BeforeAfter = {
  id: string;
  category: string;
  title: string;
  note?: string;
  before: string;
  after: string;
};

export const beforeAfter: BeforeAfter[] = [];
