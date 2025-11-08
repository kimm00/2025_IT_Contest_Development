import { Heart } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
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
    </section>
  );
}
