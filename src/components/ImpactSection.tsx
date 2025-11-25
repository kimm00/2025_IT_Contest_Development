import { Card } from "./ui/card";
import { User, Globe, DollarSign, Sprout } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import impactImage from "./assets/67c44a1bbbaedd44a3808e655e20ba2c51bd3d82.png";

const impacts = [
  {
    icon: User,
    title: "개인적 효과",
    description: "만성질환 관리 습관 형성, 건강 인식 향상",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Globe,
    title: "사회적 효과",
    description: "기업 후원 기부로 사회 환원, 건강한 선순환 조성",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    icon: DollarSign,
    title: "경제적 효과",
    description: "질병 예방으로 의료비 절감 및 사회적 부담 완화",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Sprout,
    title: "지속 가능성",
    description: "제약사 후원 기반의 안정적 운영, 레벨별 혜택 제공",
    color: "bg-teal-100 text-teal-600"
  }
];

export default function ImpactSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl text-gray-900 mb-6">기대 효과</h2>
            <p className="text-xl text-gray-600 mb-8">
              건강을 지키는 습관이, 또 다른 생명을 지킵니다.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {impacts.map((impact, index) => {
                const Icon = impact.icon;
                return (
                  <Card key={index} className="p-6 border-2 border-gray-100">
                    <div className={`w-12 h-12 rounded-lg ${impact.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{impact.title}</h3>
                    <p className="text-sm text-gray-600">{impact.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback 
                src={impactImage}
                alt="Donation and Charity"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-6 -left-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-xl shadow-xl">
              <div className="text-3xl mb-1">₩2.4M</div>
              <div className="text-sm opacity-90">이번 달 누적 기부금</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}