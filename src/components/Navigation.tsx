import { Heart, LogOut, BarChart3, Home, User, Users } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { logout } from "../utils/auth";

interface NavigationProps {
  userEmail: string;
}

export default function Navigation({ userEmail }: NavigationProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getNavVariant = ({ isActive }: { isActive: boolean }) => {
    return isActive ? 'default' : 'ghost';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2"
            >
              <Heart className="w-6 h-6 text-emerald-600" />
              <span className="text-xl text-gray-900">HealthyKong</span>
            </Link>
            
            <div className="hidden md:flex gap-1">
              <Button asChild variant="ghost" className="gap-2">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => (isActive ? "bg-accent" : "")}
                >
                  <Home className="w-4 h-4" />
                  대시보드
                </NavLink>
              </Button>

              <Button asChild variant="ghost" className="gap-2">
                <NavLink 
                  to="/report" 
                  className={({ isActive }) => (isActive ? "bg-accent" : "")}
                >
                  <BarChart3 className="w-4 h-4" />
                  건강 리포트
                </NavLink>
              </Button>

              <Button asChild variant="ghost" className="gap-2">
                <NavLink 
                  to="/community" 
                  className={({ isActive }) => (isActive ? "bg-accent" : "")}
                >
                  <Users className="w-4 h-4" />
                  커뮤니티
                </NavLink>
              </Button>
              
              <Button asChild variant="ghost" className="gap-2">
                <NavLink 
                  to="/mypage" 
                  className={({ isActive }) => (isActive ? "bg-accent" : "")}
                >
                  <User className="w-4 h-4" />
                  마이페이지
                </NavLink>
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