import { Heart, Home, BarChart3, Users, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Page } from "../types/navigation";

interface FooterProps {
  onNavigate?: (page: Page) => void; // 옵셔널로 변경!
}

export default function Footer({ onNavigate }: FooterProps) {

  // ---------------------------------------------
  // 1) 앱 내부 Footer (하단 네비게이션)
  // ---------------------------------------------
  if (onNavigate) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white z-50">
        <div className="mx-auto flex max-w-md items-center justify-around py-2 text-xs">
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-gray-600"
            onClick={() => onNavigate("dashboard")}
          >
            <Home className="h-5 w-5" />
            <span>홈</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-gray-600"
            onClick={() => onNavigate("report")}
          >
            <BarChart3 className="h-5 w-5" />
            <span>리포트</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-gray-600"
            onClick={() => onNavigate("community")}
          >
            <Users className="h-5 w-5" />
            <span>커뮤니티</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-gray-600"
            onClick={() => onNavigate("mypage")}
          >
            <User className="h-5 w-5" />
            <span>마이페이지</span>
          </button>
        </div>
      </nav>
    );
  }

  // ---------------------------------------------
  // 2) 랜딩 페이지용 Footer (일반 마케팅 Footer)
  // ---------------------------------------------
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
              <li><Link to="/dashboard" className="hover:text-emerald-400">대시 보드</Link></li>
              <li><Link to="/report" className="hover:text-emerald-400">건강 리포트</Link></li>
              <li><Link to="/community" className="hover:text-emerald-400">커뮤니티</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">회사</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400">HealthyKong 소개</Link></li>
              <li><Link to="/partnership" className="hover:text-emerald-400">파트너십</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400">개인정보처리방침</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400">이용약관</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm space-y-3">
          <p className="text-emerald-400">
            ❤️ 본 기부금은 <strong>아템제약</strong>의 후원으로 운영됩니다.
          </p>
          <p className="text-gray-400">
            💡 당일 첫 건강 기록 시 100원 자동 기부 | 누적 기부금에 따라 레벨별 후원 혜택 제공
          </p>
          <p className="text-gray-500">
            HealthyKong은 의료 서비스가 아닌 건강 관리 플랫폼입니다. 
            중요한 의료 결정은 반드시 전문의와 상담하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}