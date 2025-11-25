import { Heart, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white">
      {/* Problem Solving Section */}
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
      
        <div className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Heart className="w-8 h-8" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl mb-6">
            건강한 습관으로 세상을 바꾸세요
          </h2>
          
          <p className="text-xl mb-4 opacity-90">
            "Manage your health, empower others."
          </p>
          
          <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
            헬시콩(HealthyKong)과 함께 당신의 건강 관리 루틴을 시작하고,
            동시에 다른 환우들을 도울 수 있습니다.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>무료 가입</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>개인정보 보호</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>언제든 중단 가능</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
