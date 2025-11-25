import { Button } from "./ui/button";
import { Heart, ArrowRight, Zap, Brain, Trophy, Gift } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Main Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full w-fit">
              <Heart className="w-4 h-4" />
              <span>Heal yourself, help others</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl tracking-tight text-gray-900">
              <span className="block">HealthyKong</span>
              <span className="block text-emerald-600 mt-2">헬시콩</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-xl">
              <strong className="text-emerald-700">"Self-care becomes Social-care."</strong>
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              매일 <strong className="text-emerald-700">혈당, 혈압, 운동 등 건강 루틴을 기록</strong>하면, 
              그 기록이 <strong className="text-emerald-700">실제 기부금으로 환산</strong>되어 사회에 환원되는 IT 헬스케어 서비스입니다.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>💡 </strong> 작심삼일로 끝나는 건강 관리를 <strong>게이미피케이션 & 소셜 임팩트</strong>로 해결하는 개인 맞춤형 플랫폼
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
                asChild
              >
                <Link to="/signup">
                  시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                asChild
              >
                <Link to="/about">
                  더 알아보기
                </Link>
              </Button>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl text-emerald-600">72%</div>
                <div className="text-sm text-gray-600">이탈률 감소</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600">100P</div>
                <div className="text-sm text-gray-600">일일 최대 적립</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600">13개</div>
                <div className="text-sm text-gray-600">뱃지 컬렉션</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758691462353-36b215702253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjB0ZWNobm9sb2d5JTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYyMzIyNDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Health Technology"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">오늘의 총 적립 포인트</div>
                  <div className="text-emerald-600">+2,400P 적립</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-emerald-600 mb-3">핵심 기능 (Core Features)</h2>
            <p className="text-gray-600">게이미피케이션과 소셜 임팩트로 건강 관리가 즐거워집니다</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1: 건강 루틴 챌린지 & 기부 엔진 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl border-2 border-emerald-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">① 건강 루틴 챌린지 & 기부 엔진</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    매일 혈당, 혈압, 투약, 운동 등을 기록하면 하루 최대 <strong className="text-emerald-700">100원의 기부 포인트</strong>가 자동으로 적립됩니다.
                  </p>
                  <p className="text-xs text-gray-500">
                    적립된 포인트는 대시보드에서 실시간 확인 가능하며, 당뇨 협회 등 파트너 NGO에 실제 기부금으로 전달됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: AI 맞춤형 건강 리포트 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">② AI 맞춤형 건강 리포트</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong className="text-purple-700">OpenAI GPT</strong>를 활용한 개인화된 분석 리포트를 제공합니다.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• <strong>3단계 데이터 통합:</strong> 신체정보 + 질환정보 + 생활습관</li>
                    <li>• <strong>초개인화 코칭:</strong> "저강도 유산소 운동 추천" 등 구체적 조언</li>
                    <li>• <strong>주간 리포트:</strong> 7일간 건강 변화 추이와 위험 신호 감지</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature 3: 성장형 커뮤니티와 레벨 시스템 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">③ 성장형 커뮤니티와 레벨 시스템</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    기부 누적액에 따라 레벨이 성장하며, 이는 커뮤니티 내에서 <strong className="text-blue-700">선한 영향력의 지표</strong>가 됩니다.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="bg-green-50 px-2 py-1 rounded border border-green-200">
                      <span className="text-green-800">🌱 새싹콩</span>
                    </div>
                    <div className="bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      <span className="text-emerald-800">🌿 성장콩</span>
                    </div>
                    <div className="bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      <span className="text-blue-800">💚 기부콩</span>
                    </div>
                    <div className="bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      <span className="text-amber-800">🏆 황금콩</span>
                    </div>
                    <div className="bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      <span className="text-purple-800">💎 플래티넘콩</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 황금콩~플래티넘콩 달성 시 건강검진권, 제품 할인 등 특별 혜택 제공
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4: 뱃지 컬렉션 */}
            <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-xl border-2 border-amber-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">④ 뱃지 컬렉션 (Achievement Badges)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    다양한 활동에 대한 보상으로 <strong className="text-amber-700">13개의 뱃지</strong>를 지급하여 동기부여를 극대화합니다.
                  </p>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600">🎯</span>
                      <span><strong>루틴 관련:</strong> 3일 연속 성공 시 'Starter Spark', 재도전 시 'Comeback Kid'</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600">💝</span>
                      <span><strong>기부 관련:</strong> 첫 기부 시 'Kindness Beginner', 10만원 달성 시 'Hope Maker'</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Solving Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-gray-900 mb-4">
                <span className="text-emerald-600">30일 이내 이탈률 70%</span>를<br />
                어떻게 해결할까요?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                기존 만성질환 관리 앱들은 단순한 데이터 저장소 기능에 그쳐 사용자의 흥미를 유발하지 못했습니다. 
                헬시콩은 게이미피케이션과 소셜 임팩트로 이 문제를 해결합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-pink-700 mb-1">재미 (Fun)</div>
                    <div className="text-sm text-gray-600">건강 기록을 게임 미션처럼 수행하고 뱃지 획득</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-emerald-700 mb-1">의미 (Meaning)</div>
                    <div className="text-sm text-gray-600">건강한 행동이 어려운 이웃을 돕는 기부금으로 전환</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-white mb-4">헬시콩은 단순한 건강 기록 앱이 아닙니다</h3>
              <p className="text-emerald-50 leading-relaxed">
                여러분의 오늘 하루 건강한 습관이<br />
                누군가의 생명을 살리는 기적이 되는 경험,<br />
                <strong>헬시콩이 만들어갑니다.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}