import {
  Building2,
  Heart,
  Handshake,
  TrendingUp,
  Users,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface PartnershipPageProps {
  onNavigateBack: () => void;
}

export default function PartnershipPage({ onNavigateBack }: PartnershipPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            className="text-emerald-600 hover:text-emerald-700 mb-4 px-0 hover:bg-emerald-50"
            onClick={onNavigateBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Handshake className="w-10 h-10 text-emerald-600" />
            <h1 className="text-gray-900">파트너십</h1>
          </div>
          <p className="text-xl text-gray-600">헬시콩과 함께하는 기업들</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {/* Main Partner */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">메인 파트너</h2>
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
            <CardContent className="p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-white mb-1">아템제약</h2>
                  <p className="text-blue-100">헬시콩의 공식 후원 파트너</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <p className="text-xl mb-4 leading-relaxed">
                  "건강한 사회를 만드는 것이 우리의 사명입니다."
                </p>
                <p className="text-blue-100 leading-relaxed">
                  아템제약은 50년 이상 국내 제약 산업을 선도해온 대한민국 대표 제약사로서,
                  만성질환 치료제 개발과 환자 복지 증진에 앞장서 왔습니다.
                  헬시콩 플랫폼을 통해 환자들의 자가 관리를 지원하고,
                  경제적 어려움을 겪는 환우들에게 실질적인 도움을 제공합니다.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💊</div>
                  <div className="text-2xl mb-1">200+</div>
                  <p className="text-sm text-blue-100">의약품 라인업</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🏥</div>
                  <div className="text-2xl mb-1">1,500+</div>
                  <p className="text-sm text-blue-100">협력 의료기관</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">❤️</div>
                  <div className="text-2xl mb-1">10억+</div>
                  <p className="text-sm text-blue-100">연간 사회공헌 금액</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Partnership Model */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">파트너십 모델</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <Heart className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-gray-900 mb-3">기부금 매칭</h3>
                <p className="text-gray-600 mb-4">
                  사용자가 건강 데이터를 기록할 때마다 아템제약이 100P씩 기부금을 매칭하여
                  실제 환자 지원 프로그램에 사용됩니다.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-emerald-800">
                    <strong>2024년 기준:</strong> 총 3억 2천만원의 기부금 매칭
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <Users className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-gray-900 mb-3">환자 지원 프로그램</h3>
                <p className="text-gray-600 mb-4">
                  적립된 기부금은 저소득층 만성질환자의 의료비 지원,
                  건강 교육 프로그램, 무료 건강검진 등에 투명하게 사용됩니다.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>2024년 기준:</strong> 1,200명의 환자 지원
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-gray-900 mb-3">건강 데이터 연구</h3>
                <p className="text-gray-600 mb-4">
                  개인정보 보호를 철저히 준수하며, 익명화된 건강 데이터를 활용하여
                  더 나은 만성질환 관리 솔루션을 연구합니다.
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    <strong>IRB 승인:</strong> 모든 연구는 기관윤리위원회 승인 후 진행
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <Award className="w-10 h-10 text-amber-600 mb-4" />
                <h3 className="text-gray-900 mb-3">브랜드 상생</h3>
                <p className="text-gray-600 mb-4">
                  아템제약은 CSR 활동을 통해 브랜드 가치를 높이고,
                  헬시콩은 안정적인 서비스 운영 기반을 확보합니다.
                </p>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>수상 이력:</strong> 2024 대한민국 CSR 대상 수상
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">함께 만든 임팩트</h2>
          <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg">
            <CardContent className="p-10">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl mb-2">32,000</div>
                  <p className="text-emerald-100">활성 사용자</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">3.2억원</div>
                  <p className="text-emerald-100">누적 기부금</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">1,200명</div>
                  <p className="text-emerald-100">지원 환자</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">95%</div>
                  <p className="text-emerald-100">만족도</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* User Rewards */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">사용자 리워드 프로그램</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                아템제약의 후원으로 사용자들에게 레벨별 맞춤 혜택을 제공합니다.
                건강 관리를 꾸준히 실천하고 기부금을 적립할수록 더 많은 혜택을 받으실 수 있습니다.
              </p>

              <div className="grid md:grid-cols-5 gap-4">
                {/* 새싹콩 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl text-center mb-2">🌱</div>
                  <h4 className="text-center mb-2">새싹콩</h4>
                  <p className="text-xs text-gray-600 text-center mb-3">0 ~ 4,999P</p>
                  <div className="bg-white rounded p-3 text-xs">
                    <p className="text-emerald-600 mb-2">🎟️ 후원 혜택</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 제품 3% 할인 쿠폰</li>
                      <li>• 샘플 추첨권 1매</li>
                    </ul>
                  </div>
                </div>

                {/* 성장콩 */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                  <div className="text-3xl text-center mb-2">🌿</div>
                  <h4 className="text-center mb-2">성장콩</h4>
                  <p className="text-xs text-gray-600 text-center mb-3">5,000 ~ 9,999P</p>
                  <div className="bg-white rounded p-3 text-xs">
                    <p className="text-emerald-600 mb-2">🎟️ 후원 혜택</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 제품 5% 할인 쿠폰</li>
                      <li>• 샘플팩 응모권</li>
                    </ul>
                  </div>
                </div>

                {/* 기부콩 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl text-center mb-2">😇</div>
                  <h4 className="text-center mb-2">기부콩</h4>
                  <p className="text-xs text-gray-600 text-center mb-3">
                    10,000 ~ 29,999P
                  </p>
                  <div className="bg-white rounded p-3 text-xs">
                    <p className="text-blue-600 mb-2">🎁 후원 혜택</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 제품 7% 할인 쿠폰</li>
                      <li>• 샘플팩 추첨권</li>
                    </ul>
                  </div>
                </div>

                {/* 황금콩 */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                  <div className="text-3xl text-center mb-2">👼</div>
                  <h4 className="text-center mb-2">황금콩</h4>
                  <p className="text-xs text-gray-600 text-center mb-3">
                    30,000 ~ 99,999P
                  </p>
                  <div className="bg-white rounded p-3 text-xs">
                    <p className="text-amber-600 mb-2">✨ 후원 혜택</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 제품 10% 할인 쿠폰</li>
                      <li>• 건강 상담 할인권</li>
                    </ul>
                  </div>
                </div>

                {/* 플래티넘콩 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-3xl text-center mb-2">🏆</div>
                  <h4 className="text-center mb-2">플래티넘콩</h4>
                  <p className="text-xs text-gray-600 text-center mb-3">
                    100,000P 이상
                    <br />
                    (약 3년간 매일 기록)
                  </p>
                  <div className="bg-white rounded p-3 text-xs">
                    <p className="text-purple-600 mb-2">👑 후원 혜택</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 제품 12~15% 할인</li>
                      <li>• 신제품 체험팩</li>
                      <li>• 전설의 챔피언 인증</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-emerald-50 rounded-lg p-4">
                <p className="text-sm text-emerald-800 text-center">
                  💡 모든 리워드는 아템제약의 후원으로 제공되며, 실제 상품은 파트너사 정책에 따라
                  변경될 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">파트너 메시지</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👔</span>
                </div>
                <div>
                  <p className="text-gray-700 text-xl italic leading-relaxed mb-4">
                    "아템제약은 단순히 약을 만드는 회사가 아닙니다.
                    우리는 환자의 삶의 질을 개선하고, 건강한 사회를 만드는 것을 목표로 합니다.
                    헬시콩과의 파트너십은 이러한 비전을 실현하는 혁신적인 방법입니다."
                  </p>
                  <p className="text-gray-600">
                    <strong>김철수</strong> - 아템제약 대표이사
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  아템제약은 앞으로도 헬시콩과 함께 더 많은 환우들에게 실질적인 도움을 제공하고,
                  기술과 헬스케어의 융합을 통해 새로운 가치를 창출해 나갈 것입니다.
                  여러분의 작은 실천이 큰 변화를 만듭니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Partnership Inquiry */}
        <section>
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 shadow-sm">
            <CardContent className="p-10 text-center">
              <Building2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-gray-900 mb-4">파트너십 문의</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                헬시콩과 함께 건강한 사회를 만들어갈 파트너사를 찾습니다.
                제약사, 의료기기 제조사, 보험사, IT 기업 등 다양한 분야의 협력을 환영합니다.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  asChild
                >
                  <a href="mailto:partnership@healthykong.com">파트너십 문의</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  onClick={onNavigateBack}
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}