import { Heart, LogOut, BarChart3, Home, User, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { logout } from "../utils/auth";
import { cn } from "../lib/utils";

interface NavigationProps {
  userEmail: string;
}

export default function Navigation({ userEmail }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => pathname === path;

  const getNavClass = (path: string) => {
    return isActive(path)
      ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white shadow-sm"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link 
              to="/"
              className="flex items-center gap-2"
            >
              <Heart className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">HealthyKong</span>
            </Link>
            
            <div className="hidden md:flex gap-1">              
              <Button asChild variant="ghost" className={cn("gap-2 justify-start", getNavClass('/dashboard'))}>
                <Link to="/dashboard">
                  <Home className="w-4 h-4" />
                  대시보드
                </Link>
              </Button>

              <Button asChild variant="ghost" className={cn("gap-2 justify-start", getNavClass('/report'))}>
                <Link to="/report">
                  <BarChart3 className="w-4 h-4" />
                  건강 리포트
                </Link>
              </Button>

              <Button asChild variant="ghost" className={cn("gap-2 justify-start", getNavClass('/community'))}>
                <Link to="/community">
                  <Users className="w-4 h-4" />
                  커뮤니티
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className={cn("gap-2 justify-start", getNavClass('/mypage'))}>
                <Link to="/mypage">
                  <User className="w-4 h-4" />
                  마이페이지
                </Link>
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