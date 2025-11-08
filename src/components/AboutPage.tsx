import { Heart, Target, Users, TrendingUp, Award, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <Button variant="ghost" asChild className="text-emerald-600 hover:text-emerald-700 mb-4 px-0 hover:bg-emerald-50">
            <Link
              to="/"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
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
          <h2 className="text-emerald-600 mb-6">우리의 미션</h2>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                헬시콩(HealthyKong)은 <strong className="text-emerald-700">개인의 건강 관리가 사회적 기여로 연결되는</strong> 혁신적인 스마트 헬스케어 기부 챌린지 플랫폼입니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                당뇨병, 고혈압 등 만성질환으로 고통받는 많은 분들이 꾸준한 건강 관리의 어려움을 겪고 있습니다. 
                동시에 경제적 어려움으로 인해 적절한 치료와 관리를 받지 못하는 환우들도 많습니다. 
                헬시콩은 이 두 문제를 동시에 해결하고자 합니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How it Works */}
        <section className="mb-16">
          <h2 className="text-emerald-600 mb-6">작동 방식</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-gray-900 mb-3">1. 건강 기록</h3>
                <p className="text-gray-600">
                  매일 혈당, 혈압, 약 복용 등 건강 데이터를 간편하게 기록하세요. 
                  당일 첫 기록 시 100원의 기부금이 자동 적립됩니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-gray-900 mb-3">2. 자동 기부</h3>
                <p className="text-gray-600">
                  아템제약의 후원으로 여러분의 건강 관리가 실제 기부금으로 전환됩니다. 
                  추가 비용 부담 없이 선행을 실천할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-gray-900 mb-3">3. 함께 성장</h3>
                <p className="text-gray-600">
                  건강 리포트로 본인의 건강 상태를 시각화하고, 
                  누적 기부금으로 사회적 영향력을 확인하며 동기부여를 받으세요.
                </p>
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
              <h2 className="text-white mb-4">우리의 비전</h2>
              <p className="text-xl mb-6 opacity-90">
                "모든 만성질환자가 경제적 부담 없이<br />
                건강한 삶을 영위할 수 있는 세상을 만듭니다."
              </p>
              <p className="opacity-80">
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
                헬시콩 팀은 헬스케어 전문가, 데이터 과학자, UX/UI 디자이너, 
                소프트웨어 엔지니어로 구성된 다학제적 팀입니다.
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
          <p className="text-gray-600 mb-6">
            헬시콩과 함께하고 싶으신가요?
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link
                to="/signup"
              >
                시작하기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              <a 
                href="mailto:contact@healthykong.com"
              >
                문의하기
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}