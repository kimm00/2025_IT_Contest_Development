import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as AuthUser,
  getAuth,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { toast } from "sonner";

// =================================================================
// 1. 타입 정의 (Types)
// =================================================================

export interface UserProfile {
  birthYear?: number;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;

  // 질환 / 혈당 / 혈압
  conditions?: string[];
  diabetesType?: string;
  diagnosisPeriod?: string;
  medicationType?: string;
  hba1c?: number;
  systolicBP?: number;
  diastolicBP?: number;

  // 생활 습관
  alcoholFrequency?: string;
  smokingStatus?: string;
  exerciseFrequency?: string;

  completedAt?: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  totalDonation: number;
  createdAt: string;
  lastRecordDate: string | null;
  badges: string[];
  profile?: UserProfile;
}

export interface HealthLog {
  id: string;
  userId: string;
  type: "blood_sugar" | "blood_pressure";
  value?: number;      // 혈당
  systolic?: number;   // 수축기
  diastolic?: number;  // 이완기
  measuredTime?: string; // 측정 시간대
  recordedAt: string;  // ISO String
}

// =================================================================
// 2. 유틸리티 함수 (Helper)
// =================================================================

/**
 * UTC 시간을 한국 시간(KST) 기준 날짜 문자열(YYYY-MM-DD)로 변환
 * 예: "2025-11-25T01:00:00Z" (UTC) -> "2025-11-25" (KST)
 */
function getKSTDateString(isoString?: string | null): string {
  const date = isoString ? new Date(isoString) : new Date();
  // UTC 시간에 9시간을 더함
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toISOString().split("T")[0];
}

// 현재 로그인된 유저 정보 가져오기 (Auth 객체 기준)
export function getCurrentUser() {
  const authInstance = getAuth();
  return authInstance.currentUser;
}

// =================================================================
// 3. 인증 함수 (Auth)
// =================================================================

export async function signup(email: string, password: string, name: string): Promise<boolean> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: name || user.email?.split("@")[0],
      totalDonation: 0,
      createdAt: new Date().toISOString(),
      lastRecordDate: null,
      badges: ["goal_setter"],
    });

    return true;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("이미 사용 중인 이메일입니다.");
    } else {
      toast.error("회원가입 중 오류가 발생했습니다.");
    }
    console.error("Signup Error: ", error);
    return false;
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      toast.error("로그인 중 오류가 발생했습니다.");
    }
    console.error("Login Error: ", error);
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    toast.error("로그아웃 중 오류가 발생했습니다.");
    console.error("Logout Error: ", error);
  }
}

// =================================================================
// 4. 사용자 프로필 함수 (User Profile)
// =================================================================

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (authUser: AuthUser | null) => {
    try {
      if (authUser) {
        const userProfile = await getUserByUid(authUser.uid);
        if (userProfile) {
          callback(userProfile);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    } catch (error) {
      console.error("Error during auth state change:", error);
      callback(null);
    }
  });
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
    console.error("No user profile found in Firestore for UID:", uid);
    return null;
  }
}

export const getCurrentUserProfile = getUserByUid;

export async function updateCurrentUserProfile(updates: Partial<Omit<User, "uid" | "email">>): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    toast.error("로그인이 필요합니다.");
    return false;
  }

  const userDocRef = doc(db, "users", user.uid);
  try {
    await updateDoc(userDocRef, { ...updates });
    return true;
  } catch (error) {
    toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    console.error("Update Profile Error: ", error);
    return false;
  }
}

export async function updateUserProfile(profile: UserProfile): Promise<boolean> {
  const authUser = auth.currentUser;
  if (!authUser) {
    toast.error("로그인이 필요합니다.");
    return false;
  }

  const userDocRef = doc(db, "users", authUser.uid);
  const cleanedProfile: Record<string, any> = {};
  Object.entries(profile).forEach(([key, value]) => {
    if (value !== undefined) cleanedProfile[key] = value;
  });

  try {
    await updateDoc(userDocRef, { profile: cleanedProfile });
    return true;
  } catch (error) {
    console.error("Update User Profile Error: ", error);
    toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    return false;
  }
}

// =================================================================
// 5. 건강 기록 함수 (Health Logs & Donation Logic)
// =================================================================

/**
 * 건강 기록 추가 및 기부금 적립
 */
export async function addHealthLog(
  logData: Omit<HealthLog, "id" | "userId">
): Promise<"first_donation" | "normal_log" | null> {
  const user = auth.currentUser;
  if (!user) {
    toast.error("로그인이 필요합니다.");
    return null;
  }

  const userDocRef = doc(db, "users", user.uid);
  let wasFirstDonation = false;

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("User profile not found!");
      }

      const userData = userDoc.data() as User;
      
      // 1. 현재 날짜(오늘)를 한국 시간(KST) 기준 YYYY-MM-DD로 변환
      const todayKST = getKSTDateString(); 
      
      // 2. DB에 저장된 마지막 기록 날짜도 KST 기준 YYYY-MM-DD로 변환 (UTC -> KST 변환 필수)
      const lastRecordDateKST = userData.lastRecordDate 
        ? getKSTDateString(userData.lastRecordDate) 
        : "";

      let newTotalDonation = userData.totalDonation || 0;
      
      // 3. 날짜 비교: "오늘 날짜(KST)"와 "마지막 기록 날짜(KST)"가 다르면 포인트 지급
      if (lastRecordDateKST !== todayKST) {
        newTotalDonation += 100;
        wasFirstDonation = true;
      }

      // 4. 건강 기록 저장 (healthLogs 컬렉션)
      const newLogRef = doc(collection(db, "healthLogs"));
      transaction.set(newLogRef, {
        userId: user.uid,
        id: newLogRef.id,
        ...logData, // measuredTime, recordedAt 포함됨
      });

      // 5. 사용자 프로필 업데이트 (마지막 기록 시간은 항상 최신으로 갱신)
      transaction.update(userDocRef, {
        totalDonation: newTotalDonation,
        lastRecordDate: new Date().toISOString(), // 저장 자체는 표준 UTC ISO 포맷으로
      });
    });

    return wasFirstDonation ? "first_donation" : "normal_log";
  } catch (error) {
    toast.error("기록 저장 중 오류가 발생했습니다.");
    console.error("Add Health Log Transaction Error: ", error);
    return null;
  }
}

export async function getUserHealthLogs(): Promise<HealthLog[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const logsCollectionRef = collection(db, "healthLogs");
    const q = query(
      logsCollectionRef,
      where("userId", "==", user.uid),
      orderBy("recordedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as HealthLog)
    );
  } catch (error) {
    toast.error("기록을 불러오는 중 오류가 발생했습니다.");
    console.error("Get Health Logs Error: ", error);
    return [];
  }
}

export function subscribeToUserProfile(
  uid: string,
  callback: (user: User | null) => void
): Unsubscribe {
  const userDocRef = doc(db, "users", uid);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) callback(doc.data() as User);
    else callback(null);
  }, (error) => {
    console.error("Error subscribing to user profile:", error);
    callback(null);
  });
}

export async function userExistsByEmail(email: string): Promise<boolean> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
}