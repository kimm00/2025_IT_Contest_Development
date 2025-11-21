import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Page } from "./types/navigation";
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";

import {
  onAuthChange,
  type User, // Firebase User (profile 포함 버전)
} from "./utils/auth";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfileSetupPage from "./components/ProfileSetupPage";
import Dashboard from "./components/Dashboard";
import HealthReport from "./components/HealthReport";
import MyPage from "./components/MyPage";
import UserProfilePage from "./components/UserProfilePage";
import AboutPage from "./components/AboutPage";
import PartnershipPage from "./components/PartnershipPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import CommunityPage from "./components/CommunityPage";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// 경로 → Page 타입 매핑
const pathToPage = (pathname: string): Page => {
  switch (pathname) {
    case "/":
      return "landing";
    case "/login":
      return "login";
    case "/signup":
      return "signup";
    case "/profile-setup":
      return "profile-setup";
    case "/dashboard":
      return "dashboard";
    case "/report":
      return "report";
    case "/mypage":
      return "mypage";
    case "/community":
      return "community";
    case "/about":
      return "about";
    case "/partnership":
      return "partnership";
    case "/privacy":
      return "privacy";
    case "/terms":
      return "terms";
    default:
      return "landing";
  }
};

// Page 타입 → 경로 매핑
const pageToPath = (page: Page): string => {
  switch (page) {
    case "landing":
      return "/";
    case "login":
      return "/login";
    case "signup":
      return "/signup";
    case "profile-setup":
      return "/profile-setup";
    case "dashboard":
      return "/dashboard";
    case "report":
      return "/report";
    case "mypage":
      return "/mypage";
    case "community":
      return "/community";
    case "about":
      return "/about";
    case "partnership":
      return "/partnership";
    case "privacy":
      return "/privacy";
    case "terms":
      return "/terms";
  }
};

// URL의 :uid 값을 꺼내서 UserProfilePage에 넘겨주는 래퍼
function UserProfileRoute() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  if (!uid) {
    return <div>잘못된 접근입니다.</div>;
  }

  return <UserProfilePage userUid={uid} onBack={() => navigate(-1)} />;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = pathToPage(location.pathname);

  const handleNavigate = (page: Page) => {
    navigate(pageToPath(page));
  };

  // ✅ 프로필 완료 플래그를 로컬스토리지에서 읽는 헬퍼
  const getLocalProfileCompleted = () => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("hk_profile_completed") === "1";
  };

  // Firebase Auth 상태 구독
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setAuthReady(true);

      // ✅ 로그인/로그아웃 시 로컬 플래그도 정리
      if (typeof window !== "undefined") {
        if (!user) {
          window.localStorage.removeItem("hk_profile_completed");
        } else if (user.profile?.completedAt) {
          window.localStorage.setItem("hk_profile_completed", "1");
        }
      }
    });
    return unsubscribe;
  }, []);

  // 로그인/로그아웃 + 프로필 완료 여부에 따른 페이지 강제 이동 로직
  useEffect(() => {
    if (!authReady) return;

    const publicPaths = [
      "/",
      "/login",
      "/signup",
      "/about",
      "/partnership",
      "/privacy",
      "/terms",
    ];

    const path = location.pathname;

    // 1) 로그아웃 상태
    if (!currentUser) {
      if (!publicPaths.includes(path)) {
        navigate("/");
      }
      return;
    }

    // 2) 로그인 상태
    const localCompleted = getLocalProfileCompleted();
    const remoteCompleted = !!currentUser.profile?.completedAt;
    const profileCompleted = localCompleted || remoteCompleted;

    // 프로필 미완료인데 profile-setup이 아니면 profile-setup으로 이동
    if (!profileCompleted && path !== "/profile-setup") {
      navigate("/profile-setup");
      return;
    }

    // 프로필 완료인데 여전히 landing/login/signup/profile-setup이면 dashboard로 이동
    if (
      profileCompleted &&
      (path === "/" ||
        path === "/login" ||
        path === "/signup" ||
        path === "/profile-setup")
    ) {
      navigate("/dashboard");
    }
  }, [authReady, currentUser, location.pathname, navigate]);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  const handleSignupSuccess = () => {
    navigate("/login");
  };

  // ✅ 프로필 설정 완료/건너뛰기 시: 플래그 세팅 + 대시보드 이동
  const handleProfileSetupDone = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hk_profile_completed", "1");
    }
    navigate("/dashboard");
  };

  // authReady 전에 잠깐 로딩 화면
  if (!authReady) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 로그인 상태에서만 상단 네비게이션 표시 (필요에 따라 조정 가능) */}
      {currentUser && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userEmail={currentUser.email}
        />
      )}

      <Routes>
        {/* 랜딩 페이지 */}
        <Route
          path="/"
          element={
            <LandingPage
              onNavigateToLogin={() => handleNavigate("login")}
              onNavigateToSignup={() => handleNavigate("signup")}
              onNavigate={handleNavigate}
            />
          }
        />

        {/* 로그인 / 회원가입 */}
        <Route
          path="/login"
          element={
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToSignup={() => handleNavigate("signup")}
              onBackToLanding={() => handleNavigate("landing")}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              onSignupSuccess={handleSignupSuccess}
              onNavigateToLogin={() => handleNavigate("login")}
              onBackToLanding={() => handleNavigate("landing")}
            />
          }
        />

        {/* 프로필 설정 */}
        <Route
          path="/profile-setup"
          element={
            <ProfileSetupPage
              onComplete={handleProfileSetupDone}
              onSkip={handleProfileSetupDone}
            />
          }
        />

        {/* 정보 페이지 (로그인 불필요) */}
        <Route
          path="/about"
          element={
            <AboutPage onNavigateBack={() => handleNavigate("landing")} />
          }
        />
        <Route
          path="/partnership"
          element={
            <PartnershipPage onNavigateBack={() => handleNavigate("landing")} />
          }
        />
        <Route
          path="/privacy"
          element={
            <PrivacyPage onNavigateBack={() => handleNavigate("landing")} />
          }
        />
        <Route
          path="/terms"
          element={
            <TermsPage onNavigateBack={() => handleNavigate("landing")} />
          }
        />

        {/* 보호된 페이지들 (auth useEffect에서 알아서 리다이렉트) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<HealthReport />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/user/:uid" element={<UserProfileRoute />} />

        {/* 없는 경로는 랜딩으로 */}
        <Route
          path="*"
          element={
            <LandingPage
              onNavigateToLogin={() => handleNavigate("login")}
              onNavigateToSignup={() => handleNavigate("signup")}
              onNavigate={handleNavigate}
            />
          }
        />
      </Routes>

      {/* 대시보드/리포트/마이페이지/커뮤니티에서만 푸터 보여주기 */}
      {["dashboard", "report", "mypage", "community"].includes(currentPage) && (
        <Footer onNavigate={handleNavigate} />
      )}

      <Toaster />
    </div>
  );
}