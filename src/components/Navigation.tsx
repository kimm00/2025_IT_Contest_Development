import { Heart, LogOut, BarChart3, Home, User, Users } from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "../utils/auth";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userEmail: string;
}

export default function Navigation({ currentPage, onNavigate, userEmail }: NavigationProps) {
  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <Heart className="w-6 h-6 text-emerald-600" />
              <span className="text-xl text-gray-900">HealthyKong</span>
            </button>
            
            <div className="hidden md:flex gap-1">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('dashboard')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                대시보드
              </Button>
              <Button
                variant={currentPage === 'report' ? 'default' : 'ghost'}
                onClick={() => onNavigate('report')}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                건강 리포트
              </Button>
              <Button
                variant={currentPage === 'community' ? 'default' : 'ghost'}
                onClick={() => onNavigate('community')}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                커뮤니티
              </Button>
              <Button
                variant={currentPage === 'mypage' ? 'default' : 'ghost'}
                onClick={() => onNavigate('mypage')}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                마이페이지
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
