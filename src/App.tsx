import { Routes, Route, useNavigate, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { logout } from './utils/auth';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import HealthReport from "./components/HealthReport";
import MyPage from "./components/MyPage";
import AboutPage from "./components/AboutPage";
import PartnershipPage from "./components/PartnershipPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import CommunityPage from "./components/CommunityPage";
import UserProfilePage from "./components/UserProfilePage";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'report' | 'mypage' | 'community' | 'about' | 'partnership' | 'privacy' | 'terms';


/**
 * 1. '보호된 레이아웃' (로그인 사용자 전용)
 * - Navigation, Footer를 포함하고, 로그아웃 시 /login으로 보냄
 */
function ProtectedLayout() {
  const { user, loading } = useAuth(); // 전역 바구니에서 유저 정보 확인
  const location = useLocation(); // 현재 URL 위치

  // 1A. 로딩 중 (Firebase Auth가 로그인 상태 확인 중)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  // 1B. 로그아웃 상태
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1C. 로그인 상태 (성공!)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userEmail={user.email} // 유저 이메일 전달
      />
      
      <Outlet /> 
      
      <Footer />
    </div>
  );
}

/**
 * 2. '공개 전용 레이아웃' (로그아웃 사용자 전용)
 * - 이미 로그인했다면 /dashboard로 보냄
 */
function PublicOnlyLayout() {
    const { user, loading } = useAuth();

    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
    }

    if (user) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}


/**
 * 3. 메인 App 컴포넌트 (라우터 설정)
 */
export default function App() {
  const navigate = useNavigate(); // react-router-dom의 페이지 이동 기능
  const handleLoginSuccess = () => navigate('/dashboard');
  const handleSignupSuccess = () => navigate('/dashboard');
  const handleGoToLogin = () => navigate('/login');
  const handleGoToSignup = () => navigate('/signup');
  const handleGoToLanding = () => navigate('/');
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={<LandingPage 
          onNavigateToLogin={handleGoToLogin}
        />} 
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/partnership" element={<PartnershipPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      <Route element={<PublicOnlyLayout />}>
        <Route 
          path="/login" 
          element={<LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={handleGoToSignup}
            onBackToLanding={handleGoToLanding}
          />} 
        />
        <Route 
          path="/signup" 
          element={<SignupPage 
            onSignupSuccess={handleSignupSuccess}
            onNavigateToLogin={handleGoToLogin}
            onBackToLanding={handleGoToLanding}
          />} 
        />
      </Route>
      
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="report" element={<HealthReport />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="user" element={<Navigate to="/community" replace />} />
        <Route path="user/:uid" element={<UserProfileRoute />} />
      </Route>

    </Routes>
  );
}

function UserProfileRoute() {
  const { uid } = useParams(); //  /user/:uid
  const navigate = useNavigate(); 

  if (!uid) return <Navigate to="/community" replace />;
  return (
    <UserProfilePage
      userUid={uid}
      onBack={() => navigate('/community')} // "커뮤니티로 돌아가기" 버튼 동작
    />
  );
}