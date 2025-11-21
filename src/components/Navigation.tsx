import { useEffect, useState } from "react";
import {
  Heart,
  LogOut,
  BarChart3,
  Home,
  User,
  Users,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { logout } from "../utils/auth";
import { cn } from "../lib/utils";

import { Page } from "../types/navigation";

interface NavigationProps {
  userEmail: string;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ userEmail }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 너비 기준으로 모바일 여부 판단 (768px 미만이면 모바일)
  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => pathname === path;

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white shadow-sm"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 + 데스크톱 메뉴 */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <Heart className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">
                HealthyKong
              </span>
            </Link>

            {/* 데스크톱 메뉴: 모바일이 아닐 때만 렌더링 */}
            {!isMobile && (
              <div className="flex gap-1">
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "gap-2 justify-start",
                    getNavClass("/dashboard"),
                  )}
                >
                  <Link to="/dashboard">
                    <Home className="w-4 h-4" />
                    대시보드
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "gap-2 justify-start",
                    getNavClass("/report"),
                  )}
                >
                  <Link to="/report">
                    <BarChart3 className="w-4 h-4" />
                    건강 리포트
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "gap-2 justify-start",
                    getNavClass("/community"),
                  )}
                >
                  <Link to="/community">
                    <Users className="w-4 h-4" />
                    커뮤니티
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "gap-2 justify-start",
                    getNavClass("/mypage"),
                  )}
                >
                  <Link to="/mypage">
                    <User className="w-4 h-4" />
                    마이페이지
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* 오른쪽 영역 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {userEmail}
            </span>

            {/* 데스크톱 로그아웃: 모바일이 아닐 때만 */}
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            )}

            {/* 모바일 햄버거: 모바일일 때만 */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴: 모바일 + 열려 있을 때만 */}
      {isMobile && mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                getNavClass("/dashboard"),
              )}
            >
              <Link to="/dashboard" onClick={closeMobileMenu}>
                <Home className="w-4 h-4" />
                대시보드
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                getNavClass("/report"),
              )}
            >
              <Link to="/report" onClick={closeMobileMenu}>
                <BarChart3 className="w-4 h-4" />
                건강 리포트
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                getNavClass("/community"),
              )}
            >
              <Link to="/community" onClick={closeMobileMenu}>
                <Users className="w-4 h-4" />
                커뮤니티
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                getNavClass("/mypage"),
              )}
            >
              <Link to="/mypage" onClick={closeMobileMenu}>
                <User className="w-4 h-4" />
                마이페이지
              </Link>
            </Button>

            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="text-sm text-gray-600 px-3 py-2">
                {userEmail}
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
