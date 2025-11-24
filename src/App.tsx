import { useState, useEffect } from "react";
import { 
  Routes, 
  Route, 
  Navigate, 
  Outlet, 
  useLocation, 
  useNavigate, 
  useParams 
} from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Utils & Types
import { onAuthChange, type User } from "./utils/auth";
import { Page } from "./types/navigation";

// Components
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
import ScrollToTop from "./components/ScrollToTop";

// Layout Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

/* -------------------------------------------------------
    Helper: Path → Page 타입 변환 (네비게이션 하이라이팅용)
------------------------------------------------------- */
const pathToPage = (pathname: string): Page => {
  if (pathname.startsWith("/user/")) return "user-profile";
  
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

/* -------------------------------------------------------
    1. Public Layout (로그인하지 않은 사용자용)
    - 이미 로그인했다면 대시보드로 리다이렉트
------------------------------------------------------- */
function PublicLayout({ 
  user, 
  authReady 
}: { 
  user: User | null; 
  authReady: boolean; 
}) {
  if (!authReady) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  
  // 이미 로그인했으면 대시보드로 보냄
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

/* -------------------------------------------------------
    2. Protected Layout (로그인 사용자용 - 메인)
    - Navigation, Footer 포함
    - 프로필 설정 미완료시 /profile-setup으로 리다이렉트
------------------------------------------------------- */
function ProtectedLayout({ 
  user, 
  authReady 
}: { 
  user: User | null; 
  authReady: boolean; 
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 로딩 중
  if (!authReady) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  // 2. 비로그인 상태 -> 로그인 페이지로
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // 3. 프로필 미완료 체크
  // (로컬 스토리지 플래그 or 유저 객체 정보 확인)
  const isProfileCompleted = 
    user.profile?.completedAt || 
    (typeof window !== 'undefined' && window.localStorage.getItem("hk_profile_completed") === "1");

  if (!isProfileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  // 4. 정상 렌더링
  const currentPage = pathToPage(location.pathname);
  
  // Navigation에 전달할 핸들러 (기존 컴포넌트 호환용)
  const handleNavigate = (page: Page) => {
    // page 이름을 경로로 변환하여 이동
    const pathMap: Record<string, string> = {
      dashboard: "/dashboard",
      report: "/report",
      mypage: "/mypage",
      community: "/community",
      landing: "/",
    };
    if (pathMap[page]) navigate(pathMap[page]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        userEmail={user.email} 
      />
      
      <Outlet />
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

/* -------------------------------------------------------
    3. Simple Protected Layout (프로필 설정용)
    - 로그인 필요하지만, 네비게이션/푸터는 없음
------------------------------------------------------- */
function SimpleProtectedLayout({ 
  user, 
  authReady 
}: { 
  user: User | null; 
  authReady: boolean; 
}) {
  const location = useLocation();

  if (!authReady) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}

/* -------------------------------------------------------
    4. User Profile Route Helper
    - URL 파라미터 처리용
------------------------------------------------------- */
function UserProfileRoute() {
  const { uid } = useParams();
  const navigate = useNavigate();

  if (!uid) return <Navigate to="/community" replace />;
  
  return (
    <UserProfilePage 
      userUid={uid} 
      onBack={() => navigate('/community')} 
    />
  );
}

/* ======================================================
                    Main App Component
====================================================== */
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  // Firebase Auth 구독
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setCurrentUser(user);
      setAuthReady(true);
      
      // 로컬 스토리지 동기화
      if (user?.profile?.completedAt) {
        window.localStorage.setItem("hk_profile_completed", "1");
      } else if (!user) {
        window.localStorage.removeItem("hk_profile_completed");
      }
    });
    return unsub;
  }, []);

  // 네비게이션 헬퍼 (Landing, Login 등에서 사용)
  const handleNavigate = (page: Page) => {
    // 단순 경로 이동용 헬퍼
    const pathMap: Record<string, string> = {
      landing: "/",
      login: "/login",
      signup: "/signup",
      dashboard: "/dashboard",
    };
    if (pathMap[page]) navigate(pathMap[page]);
  };

  // 프로필 설정 완료 핸들러
  const handleProfileSetupDone = () => {
    window.localStorage.setItem("hk_profile_completed", "1");
    navigate("/dashboard");
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ================== 1. Public Routes ================== */}
        <Route path="/" element={
          <LandingPage 
            onNavigateToLogin={() => navigate('/login')}
            onNavigateToSignup={() => navigate('/signup')}
            onNavigate={handleNavigate}
          />
        } />
        <Route path="/about" element={<AboutPage onNavigateBack={() => navigate('/')} />} />
        <Route path="/partnership" element={<PartnershipPage onNavigateBack={() => navigate('/')} />} />
        <Route path="/privacy" element={<PrivacyPage onNavigateBack={() => navigate('/')} />} />
        <Route path="/terms" element={<TermsPage onNavigateBack={() => navigate('/')} />} />

        {/* ================== 2. Public Only (로그인 시 접근 불가) ================== */}
        <Route element={<PublicLayout user={currentUser} authReady={authReady} />}>
          <Route path="/login" element={
            <LoginPage 
              onLoginSuccess={() => navigate('/dashboard')}
              onNavigateToSignup={() => navigate('/signup')}
              onBackToLanding={() => navigate('/')}
            />
          } />
          <Route path="/signup" element={
            <SignupPage 
              onSignupSuccess={() => navigate('/login')}
              onNavigateToLogin={() => navigate('/login')}
              onBackToLanding={() => navigate('/')}
            />
          } />
        </Route>

        {/* ================== 3. Simple Protected (Nav 없음) ================== */}
        <Route element={<SimpleProtectedLayout user={currentUser} authReady={authReady} />}>
          <Route path="/profile-setup" element={
            <ProfileSetupPage 
              onComplete={handleProfileSetupDone}
              onSkip={handleProfileSetupDone}
            />
          } />
        </Route>

        {/* ================== 4. Main Protected (Nav, Footer 있음) ================== */}
        <Route element={<ProtectedLayout user={currentUser} authReady={authReady} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<HealthReport />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/user/:uid" element={<UserProfileRoute />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster />
    </>
  );
}