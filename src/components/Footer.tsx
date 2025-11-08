import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-emerald-500" />
              <span className="text-xl text-white">HealthyKong</span>
            </div>
            <p className="text-sm mb-4">
              건강을 지키는 습관이, 또 다른 생명을 지킵니다.
            </p>
            <p className="text-xs text-gray-500">
              © 2025 HealthyKong (헬시콩). All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="text-white mb-4">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/dashboard"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  건강 챌린지
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  기부 프로그램
                </Link>
              </li>
              <li>
                <Link 
                  to="/report"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  건강 리포트
                </Link>
              </li>
              <li>
                <Link 
                  to="/community"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white mb-4">회사</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/about"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link 
                  to="/partnership"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  파트너십
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms"
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm space-y-3">
          <p className="text-emerald-400">
            ❤️ 본 기부금은 <strong>ITM제약 (Mock)</strong>의 후원으로 운영됩니다.
          </p>
          <p className="text-gray-400">
            💡 당일 첫 건강 기록 시 100원 자동 기부 | 누적 기부금에 따라 레벨별 후원 혜택 제공
          </p>
          <p className="text-gray-500">
            헬시콩(HealthyKong)은 의료 서비스가 아닌 건강 관리 플랫폼입니다. 
            중요한 의료 결정은 반드시 전문의와 상담하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}