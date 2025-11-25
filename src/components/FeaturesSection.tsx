import { Zap, Brain, Trophy, Gift } from "lucide-react";

export default function FeatureCard() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
    {/* Core Features Section */}
    <div className="bg-white border-t border-gray-100">
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-gray-900 mb-6">주요 기능</h2>
        <p className="text-xl text-gray-600 mb-8">게이미피케이션과 소셜 임팩트로 건강 관리가 즐거워집니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Feature 1: 건강 루틴 챌린지 & 기부 엔진 */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl border-2 border-emerald-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">① 건강 루틴 챌린지 & 기부 엔진</h3>
              <p className="text-base text-gray-600 mb-2">
                매일 혈당, 혈압, 투약, 운동 등을 기록하면 하루 최대 <strong className="text-emerald-700">100P의 기부 포인트</strong>가 자동으로 적립됩니다.
              </p>
              <p className="text-base text-gray-500">
                적립된 포인트는 대시보드에서 실시간 확인 가능하며, 당뇨 협회 등 파트너 NGO에 실제 기부금으로 전달됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2: AI 맞춤형 건강 리포트 */}
        <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">② AI 맞춤형 건강 리포트</h3>
              <p className="text-base text-gray-600 mb-2">
                <strong className="text-purple-700">OpenAI GPT</strong>를 활용한 개인화된 분석 리포트를 제공합니다.
              </p>
              <ul className="space-y-1 text-base text-gray-500">
                <li>• <strong>3단계 데이터 통합:</strong> 신체정보 + 질환정보 + 생활습관</li>
                <li>• <strong>초개인화 코칭:</strong> "저강도 유산소 운동 추천" 등 구체적 조언</li>
                <li>• <strong>주간 리포트:</strong> 7일간 건강 변화 추이와 위험 신호 감지</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature 3: 성장형 커뮤니티와 레벨 시스템 */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">③ 성장형 커뮤니티와 레벨 시스템</h3>
              <p className="text-base text-gray-600 mb-3">
                기부 누적액에 따라 레벨이 성장하며, 이는 커뮤니티 내에서 <strong className="text-blue-700">선한 영향력의 지표</strong>가 됩니다.
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
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
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">④ 뱃지 컬렉션 (Achievement Badges)</h3>
              <p className="text-base text-gray-600 mb-3">
                다양한 활동에 대한 보상으로 <strong className="text-amber-700">13개의 뱃지</strong>를 지급하여 동기부여를 극대화합니다.
              </p>
              <div className="space-y-2 text-base text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600">🎯</span>
                  <span><strong>루틴 관련:</strong> 3일 연속 성공 시 '스타터 스파크', 재도전 시 '재기의 용사'</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">💝</span>
                  <span><strong>기부 관련:</strong> 첫 기부 시 '선행의 첫걸음', 10만원 달성 시 '희망 메이커'</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}