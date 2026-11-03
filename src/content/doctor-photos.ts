// 병원 제공 2026.10.12 인물 보정(최종). 원본 JPEG를 재압축·리사이즈 없이 보관합니다.
// 세로 프로필은 4672×7008, 나머지는 7008×4672. 화면에서 원본 비율을 유지합니다.
// 화면에는 web/ 의 작은 사본(긴 변 2400px, 병원 승인 2026-11-03)을 씁니다. 원본은 retouched/ 에 그대로 둡니다.
export const doctorPhotos = {
  banner: "/images/photos/retouched/web/doctor-banner.jpg", // A7402790
  portrait: "/images/photos/retouched/web/doctor-portrait.jpg", // A7402803
  consult: "/images/photos/retouched/web/consult.jpg", // A7402654
  laser: "/images/photos/retouched/web/laser.jpg", // A7402692
  coolsonic: "/images/photos/retouched/web/coolsonic.jpg", // A7402722
  coolphase: "/images/photos/retouched/web/coolphase.jpg", // A7402707
} as const;
