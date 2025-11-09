import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  onAuthChange,
  subscribeToUserProfile,
  type User    
} from '../utils/auth'; 
import { type Unsubscribe } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe: Unsubscribe | null = null; 

    // [수정됨] onAuthChange 콜백 로직 (userProfile = auth.ts에서 보낸 결과)
    const authUnsubscribe = onAuthChange((userProfile) => { 
      
      // 1. (기존) 프로필 구독이 있다면 먼저 해제
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      // 2. [수정됨] userProfile이 존재하면 (로그인 성공)
      if (userProfile) {
        // 3. [제거됨] setLoading(true) 제거 (초기 로딩(true) 상태 유지)
        
        // 4. '프로필'을 실시간 구독
        profileUnsubscribe = subscribeToUserProfile(userProfile.uid, (liveProfile) => {
          setUser(liveProfile); 
          setLoading(false); // 👈 '실시간 프로필'을 받는 즉시 로딩 종료
        });
      } else {
        // 5. [로그아웃됨]
        setUser(null);
        setLoading(false); // 👈 '로그아웃' 상태 확인 즉시 로딩 종료
      }
    });

    // 6. 컴포넌트 unmount 시 모든 구독 해제
    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []); // 앱 시작 시 딱 한 번만 실행

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}