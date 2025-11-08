import { Heart, Users, TrendingUp, Database } from "lucide-react";
import { Card } from "./ui/card";

const concepts = [
  {
    icon: Heart,
    title: "건강 관리",
    description: "혈당·혈압·복용 등 건강 루틴을 챌린지화",
    color: "text-rose-600 bg-rose-100"
  },
  {
    icon: Users,
    title: "사회 기여",
    description: "당일 첫 기록 시 100원 기부, 레벨별 후원 혜택",
    color: "text-emerald-600 bg-emerald-100"
  },
  {
    icon: TrendingUp,
    title: "동기 부여",
    description: "뱃지·랭킹 시스템으로 지속적 실천 유도",
    color: "text-amber-600 bg-amber-100"
  },
  {
    icon: Database,
    title: "데이터 기반",
    description: "개인 건강 데이터 시각화 및 관리 효율 향상",
    color: "text-blue-600 bg-blue-100"
  }
];

export default function ConceptSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">핵심 콘셉트</h2>
          <p className="text-xl text-emerald-600 italic">"Self-care becomes Social-care."</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 border-gray-100">
                <div className={`w-14 h-14 rounded-xl ${concept.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">{concept.title}</h3>
                <p className="text-gray-600">{concept.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
