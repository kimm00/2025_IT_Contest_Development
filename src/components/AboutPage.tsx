import { Heart, Target, Users, TrendingUp, Award, Zap, Brain, Trophy, Shield, Sparkles, Gift } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface AboutPageProps {
  onNavigateBack: () => void;
  onNavigateToSignup?: () => void;
}
export default function AboutPage({
  onNavigateBack,
  onNavigateToSignup,
}: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mt-8 mb-4"
          >
            ← 돌아가기
          </button>
          <div className="flex items-center gap-3 mt-8 mb-2">
            <Heart className="w-10 h-10 text-emerald-600" />
            <h1 className="text-gray-900">HealthyKong 소개</h1>
          </div>
          <p className="text-xl text-gray-600">
            "Self-care becomes Social-care."
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">서비스 개요</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                헬시콩(HealthyKong)은 사용자가 매일 <strong className="text-emerald-700">혈당, 혈압, 운동 등 건강 루틴을 기록</strong>하면, 그 기록이 <strong className="text-emerald-700">실제 기부금으로 환산</strong>되어 사회에 환원되는 IT 헬스케어 서비스입니다.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                개인의 건강 관리(Self-care)와 사회적 기여(Social-care)를 결합하여, <strong>작심삼일로 끝나는 건강 관리의 동기부여 문제</strong>를 해결합니다.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-sm text-amber-800">
                  <strong>📊 통계:</strong> 기존 만성질환 관리 앱들의 30일 이내 이탈률은 <strong>70%</strong>에 달합니다. 헬시콩은 게이미피케이션과 소셜 임팩트로 이 문제를 해결합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Problem & Solution */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">문제 해결 방식</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-pink-50 to-white shadow-sm border-2 border-pink-200">
              <CardContent className="p-8">
                <Zap className="w-10 h-10 text-pink-600 mb-4" />
                <h3 className="text-gray-900 mb-3">재미 (Fun)</h3>
                <p className="text-gray-600">
                  건강 기록을 <strong>게임 미션</strong>처럼 수행하고 <strong>뱃지를 획득</strong>합니다. 
                  3일 연속 성공 시 '스타터 스파크', 루틴 실패 후 재도전 시 '재기의 용사' 등 13개의 뱃지가 여러분을 기다립니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm border-2 border-emerald-200">
              <CardContent className="p-8">
                <Heart className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-gray-900 mb-3">의미 (Meaning)</h3>
                <p className="text-gray-600">
                  나의 건강한 행동이 <strong>어려운 이웃을 돕는 기부금</strong>으로 쌓이는 확실한 보상 체계. 
                  제약사 및 헬스케어 기업의 CSR 예산이 여러분의 기부를 매칭합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">기술 스택</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-gray-700 mb-4">
                본 프로젝트는 최신 웹 기술 트렌드를 반영하여 개발되었습니다.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-emerald-700 mb-2">🎨 Frontend</div>
                  <div className="text-gray-600">React + Vite (빠른 렌더링)</div>
                  <div className="text-gray-600">TailwindCSS (일관된 디자인)</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-700 mb-2">☁️ Backend (Serverless)</div>
                  <div className="text-gray-600">Firebase Authentication</div>
                  <div className="text-gray-600">Firestore Database</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-700 mb-2">🤖 AI Engine</div>
                  <div className="text-gray-600">OpenAI API (GPT-4o/mini)</div>
                  <div className="text-gray-600">실시간 데이터 분석</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Business Model */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">비즈니스 모델 및 기대 효과</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm">
              <CardContent className="p-8">
                <Shield className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-gray-900 mb-3">수익 모델</h3>
                <p className="text-gray-600 mb-3">
                  제약사 및 헬스케어 기업의 <strong className="text-emerald-700">CSR(사회공헌) 예산</strong>을 유치하여 사용자의 기부금을 매칭합니다.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>기업은 ESG 경영 실천과 긍정적 브랜드 이미지 획득</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>사용자는 비용 부담 없이 기부 참여</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>환우들은 실질적인 의료비 지원 혜택</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardContent className="p-8">
                <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-gray-900 mb-3">기대 효과</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-lg">🏥</span>
                    <span><strong>개인:</strong> 만성질환 관리 습관 형성</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-lg">💰</span>
                    <span><strong>사회:</strong> 만성질환 발병률 감소 및 의료비 절감</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-lg">💝</span>
                    <span><strong>문화:</strong> 기부 문화 확산</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-lg">🌍</span>
                    <span><strong>환경:</strong> 건강 형평성 실현</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">핵심 가치</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm">
              <CardContent className="p-8">
                <Target className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-gray-900 mb-3">지속가능한 건강 관리</h3>
                <p className="text-gray-600">
                  단순한 데이터 기록을 넘어, 사회적 의미를 부여함으로써 
                  건강 관리의 지속성을 높입니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardContent className="p-8">
                <Users className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-gray-900 mb-3">상생의 생태계</h3>
                <p className="text-gray-600">
                  개인의 작은 실천이 모여 다른 환우들에게 실질적인 도움이 되는 
                  선순환 구조를 만듭니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm">
              <CardContent className="p-8">
                <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-gray-900 mb-3">데이터 기반 인사이트</h3>
                <p className="text-gray-600">
                  축적된 건강 데이터를 시각화하여 개인 맞춤형 건강 관리 
                  인사이트를 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white shadow-sm">
              <CardContent className="p-8">
                <Award className="w-10 h-10 text-amber-600 mb-4" />
                <h3 className="text-gray-900 mb-3">투명한 운영</h3>
                <p className="text-gray-600">
                  모든 기부금 적립 내역과 사용 현황을 투명하게 공개하여 
                  신뢰를 구축합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
            <CardContent className="p-12 text-center">
              <h1 className="text-white mb-4">우리의 비전</h1>
              <p className="text-xl mb-6 opacity-90">
                "모든 만성질환자가 경제적 부담 없이<br />
                건강한 삶을 영위할 수 있는 세상을 만듭니다."
              </p>
              <p className="opacity-80 mb-6">
                헬시콩은 기술과 공감을 결합하여 건강 형평성을 실현하고,<br />
                개인의 작은 실천이 사회 전체의 건강을 증진시키는 생태계를 구축합니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Info */}
        <section>
          <h2 className="text-emerald-600 mb-6">팀 소개</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                헬시콩 팀은 대학생 개발자들로 구성된 팀입니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                우리는 만성질환 관리의 어려움을 직접 경험한 사람들, 
                그리고 그 가족들의 이야기에서 출발했습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                기술이 단순히 편리함을 넘어 사회적 가치를 창출할 수 있다는 믿음으로, 
                오늘도 더 나은 헬스케어 생태계를 만들기 위해 노력하고 있습니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 border-2 border-emerald-200">
            <CardContent className="p-12">
              <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl text-gray-900 mb-4">
                헬시콩은 단순한 건강 기록 앱이 아닙니다
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                여러분의 오늘 하루 건강한 습관이<br />
                누군가의 생명을 살리는 기적이 되는 경험,<br />
                <strong className="text-emerald-700">헬시콩이 만들어갑니다.</strong>
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={onNavigateBack}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                >
                  지금 시작하기
                </button>
                <a 
                  href="mailto:contact@healthykong.com"
                  className="px-8 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  문의하기
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}