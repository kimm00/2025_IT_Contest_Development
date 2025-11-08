// 사용자 인증 관련 유틸리티 (localStorage 기반)

export interface User {
  email: string;
  name: string;
  totalDonation: number;
  createdAt: string;
  lastRecordDate: string | null;
}

export interface HealthLog {
  id: string;
  userId: string;
  type: 'blood_sugar' | 'blood_pressure';
  value?: number; // 혈당 수치
  systolic?: number; // 수축기 혈압
  diastolic?: number; // 이완기 혈압
  recordedAt: string;
}

// 회원가입
export function signup(email: string, password: string, name?: string): boolean {
  const users = getUsers();
  
  if (users[email]) {
    return false; // 이미 존재하는 이메일
  }
  
  users[email] = {
    password,
    name: name || email.split('@')[0], // 이름이 없으면 이메일 앞부분 사용
    totalDonation: 0,
    createdAt: new Date().toISOString(),
    lastRecordDate: null,
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

// 로그인
export function login(email: string, password: string): boolean {
  const users = getUsers();
  
  if (users[email] && users[email].password === password) {
    localStorage.setItem('currentUser', email);
    return true;
  }
  
  return false;
}

// 로그아웃
export function logout(): void {
  localStorage.removeItem('currentUser');
}

// 현재 로그인한 사용자 가져오기
export function getCurrentUser(): User | null {
  const email = localStorage.getItem('currentUser');
  if (!email) return null;
  
  const users = getUsers();
  if (!users[email]) return null;
  
  return {
    email,
    name: users[email].name || email.split('@')[0],
    totalDonation: users[email].totalDonation,
    createdAt: users[email].createdAt,
    lastRecordDate: users[email].lastRecordDate,
  };
}

// 사용자 정보 업데이트
export function updateUser(email: string, updates: Partial<Omit<User, 'email'>>): void {
  const users = getUsers();
  if (users[email]) {
    users[email] = { ...users[email], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

// 건강 기록 추가 (F-02, F-03)
export function addHealthLog(log: Omit<HealthLog, 'id'>): void {
  const logs = getHealthLogs();
  const newLog = {
    ...log,
    id: Date.now().toString(),
  };
  
  logs.push(newLog);
  localStorage.setItem('healthLogs', JSON.stringify(logs));
  
  // 기부금 적립 로직 (F-03)
  const user = getCurrentUser();
  if (user) {
    const today = new Date().toISOString().split('T')[0];
    const lastRecordDate = user.lastRecordDate?.split('T')[0];
    
    // 당일 첫 기록인 경우 100원 적립
    if (lastRecordDate !== today) {
      updateUser(user.email, {
        totalDonation: user.totalDonation + 100,
        lastRecordDate: new Date().toISOString(),
      });
    }
  }
}

// 사용자의 건강 기록 조회
export function getUserHealthLogs(email: string): HealthLog[] {
  const logs = getHealthLogs();
  return logs.filter(log => log.userId === email).sort((a, b) => 
    new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );
}

// Helper functions
function getUsers(): any {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : {};
}

function getHealthLogs(): HealthLog[] {
  const logs = localStorage.getItem('healthLogs');
  return logs ? JSON.parse(logs) : [];
}
