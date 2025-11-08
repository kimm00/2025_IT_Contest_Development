import { Activity, FileText, Heart, Bell, Award } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Activity,
    title: "건강 루틴 챌린지",
    description: "매일의 건강 관리를 재미있는 챌린지로",
    features: [
      "혈당/혈압 입력, 복용 체크, 운동 기록",
      "정상 범위 유지 시 챌린지 성공",
      "성취도에 따라 포인트 및 뱃지 부여"
    ]
  },
  {
    icon: FileText,
    title: "건강 기록 & 리포트",
    description: "데이터로 보는 나의 건강 상태",
    features: [
      "일일 혈당·혈압 그래프 시각화",
      "주간/월간 트렌드 분석",
      "건강 데이터 기반 개인 관리 점수 제공"
    ]
  },
  {
    icon: Heart,
    title: "기부형 챌린지",
    description: "나의 성공이 누군가의 희망으로",
    badge: "NEW",
    features: [
      "당일 첫 건강 기록 시 100원 자동 기부",
      "기업 후원으로 운영되는 투명한 기부 시스템",
      "기부 레벨에 따른 제약사 후원 혜택 제공"
    ],
    iconColor: "text-rose-600"
  },
  {
    icon: Bell,
    title: "복용 알림 & 리마인더",
    description: "잊지 않고 관리하는 건강 습관",
    features: [
      "약 복용 시간 푸시 알림",
      "미체크 시 리마인드 메시지 발송",
      "완료 시 챌린지 진행률 반영"
    ]
  },
  {
    icon: Award,
    title: "뱃지 & 레벨 시스템",
    description: "성취를 보상하는 동기부여 시스템",
    features: [
      "13개 뱃지 (루틴/기부/도전 카테고리)",
      "5단계 레벨 (새싹콩 → 플래티넘콩)",
      "레벨별 제약사 후원 혜택 (할인/샘플팩)"
    ],
    iconColor: "text-amber-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">주요 기능</h2>
          <p className="text-xl text-gray-600">
            건강 관리부터 사회 기여까지, 하나의 플랫폼에서
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
