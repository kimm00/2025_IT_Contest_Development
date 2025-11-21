import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Page } from "./types/navigation";
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";

import {
  onAuthChange,
  type User,
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

/* -------------------------------------------------------
    Path → Page 타입 매핑
------------------------------------------------------- */
const pathToPage = (pathname: string): Page => {
  switch (pathname) {
    case "/": return "landing";
    case "/login": return "login";
    case "/signup": return "signup";
    case "/profile-setup": return "profile-setup";
    case "/dashboard": return "dashboard";
    case "/report": return "report";
    case "/mypage": return "mypage";
    case "/community": return "community";
    case "/about": return "about";
    case "/partnership": return "partnership";
    case "/privacy": return "privacy";
    case "/terms": return "terms";
    default: return "landing";
  }
};

/* Page → URL 매핑 */
const pageToPath = (page: Page): string => {
  switch (page) {
    case "landing": return "/";
    case "login": return "/login";
    case "signup": return "/signup";
    case "profile-setup": return "/profile-setup";
    case "dashboard": return "/dashboard";
    case "report": return "/report";
    case "mypage": return "/mypage";
    case "community": return "/community";
    case "about": return "/about";
    case "partnership": return "/partnership";
    case "privacy": return "/privacy";
    case "terms": return "/terms";
  }
};

/* URL /user/:uid → 페이지 컴포넌트로 넘기기 */
function UserProfileRoute() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  if (!uid) return <div>잘못된 접근입니다.</div>;

  return <UserProfilePage userUid={uid} onBack={() => navigate(-1)} />;
}

/* ======================================================
                    메인 App
====================================================== */

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = pathToPage(location.pathname);

  const handleNavigate = (page: Page) => {
    navigate(pageToPath(page));
  };

  /* 프로필 완료 플래그 로컬스토리지 */
  const getLocalProfileCompleted = () => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("hk_profile_completed") === "1";
  };

  /* Firebase Auth 구독 */
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setCurrentUser(user);
      setAuthReady(true);

      // 로컬 플래그도 세팅
      if (typeof window !== "undefined") {
        if (!user) {
          window.localStorage.removeItem("hk_profile_completed");
        } else if (user.profile?.completedAt) {
          window.localStorage.setItem("hk_profile_completed", "1");
        }
      }
    });
    return unsub;
  }, []);

  /* 페이지 보호/리다이렉트 */
  useEffect(() => {
    if (!authReady) return;

    const publicPaths = [
      "/", "/login", "/signup", "/about",
      "/partnership", "/privacy", "/terms"
    ];

    const path = location.pathname;

    // 로그인 X → public 아니면 landing으로
    if (!currentUser) {
      if (!publicPaths.includes(path)) navigate("/");
      return;
    }

    const localCompleted = getLocalProfileCompleted();
    const remoteCompleted = !!currentUser.profile?.completedAt;
    const profileCompleted = localCompleted || remoteCompleted;

    // 프로필 미완료 → setup으로 강제 이동
    if (!profileCompleted && path !== "/profile-setup") {
      navigate("/profile-setup");
      return;
    }

    // 프로필 완료 → landing/login/signup에 있으면 dashboard로
    if (
      profileCompleted &&
      (path === "/" || path === "/login" || path === "/signup" || path === "/profile-setup")
    ) {
      navigate("/dashboard");
    }
  }, [authReady, currentUser, location.pathname, navigate]);

  /* 프로필 설정 완료 핸들러 */
  const handleProfileSetupDone = () => {
    window.localStorage.setItem("hk_profile_completed", "1");
    navigate("/dashboard");
  };

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
      {/* 로그인 상태에서만 Navigation 표시 */}
      {currentUser && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userEmail={currentUser.email}
        />
      )}

      <Routes>
        {/* 랜딩 */}
        <Route
          path="/"
          element={
            <LandingPage
              onNavigateToLogin={() => navigate("/login")}
              onNavigateToSignup={() => navigate("/signup")}
              onNavigate={handleNavigate}
            />
          }
        />

        {/* 로그인 */}
        <Route
          path="/login"
          element={
            <LoginPage
              onLoginSuccess={() => navigate("/dashboard")}
              onNavigateToSignup={() => navigate("/signup")}
              onBackToLanding={() => navigate("/")}
            />
          }
        />

        {/* 회원가입 */}
        <Route
          path="/signup"
          element={
            <SignupPage
              onSignupSuccess={() => navigate("/login")}
              onNavigateToLogin={() => navigate("/login")}
              onBackToLanding={() => navigate("/")}
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

        {/* 정보 페이지 */}
        <Route path="/about" element={<AboutPage onNavigateBack={() => navigate("/")} />} />
        <Route path="/partnership" element={<PartnershipPage onNavigateBack={() => navigate("/")} />} />
        <Route path="/privacy" element={<PrivacyPage onNavigateBack={() => navigate("/")} />} />
        <Route path="/terms" element={<TermsPage onNavigateBack={() => navigate("/")} />} />

        {/* 보호 페이지 */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<HealthReport />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/community" element={<CommunityPage />} />

        <Route path="/user/:uid" element={<UserProfileRoute />} />

        {/* 없는 경로 → 랜딩 */}
        <Route
          path="*"
          element={
            <LandingPage
              onNavigateToLogin={() => navigate("/login")}
              onNavigateToSignup={() => navigate("/signup")}
              onNavigate={handleNavigate}
            />
          }
        />
      </Routes>

      {/* Footer 표시 조건 */}
      {["dashboard", "report", "mypage", "community"].includes(currentPage) && (
        <Footer onNavigate={handleNavigate} />
      )}

      <Toaster />
    </div>
  );
}