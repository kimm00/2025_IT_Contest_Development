import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as AuthUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  runTransaction,
  orderBy,
  onSnapshot,
  limit,
  type Unsubscribe,
} from "firebase/firestore";
import { toast } from "sonner";

export interface UserProfile {
  birthYear?: number;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;

  // 질환 / 혈당 / 혈압
  conditions?: string[];              // ["diabetes", "hypertension", ...]
  diabetesType?: string;              // "type1" | "type2" 등
  diagnosisPeriod?: string;           // "under1year" | "1to5years" | ...
  medicationType?: string;           // "oral" | "insulin" 등
  hba1c?: number;
  systolicBP?: number;
  diastolicBP?: number;

  // 생활 습관
  alcoholFrequency?: string;         // "none" | "1to2" | ...
  smokingStatus?: string;            // "never" | "past" | "current"
  exerciseFrequency?: string;        // "none" | "1to2" | ...

  completedAt?: string;              // ISO string
}

export interface User {
  uid: string;
  email: string;
  name: string;
  totalDonation: number;
  createdAt: string; // ISO string
  lastRecordDate: string | null;
  badges: string[];
  profile?: UserProfile;             // 🔹 프로필 필드 추가
}

export interface HealthLog {
  id: string; // Firestore 문서 ID
  userId: string; // User의 uid
  type: "blood_sugar" | "blood_pressure";
  value?: number;
  systolic?: number;
  diastolic?: number;
  recordedAt: string;
}

// --- 2. 인증 함수 (Firebase Auth) ---

/**
 * 회원가입 (Auth + Firestore)
 */
export async function signup(
  email: string,
  password: string,
  name: string
): Promise<boolean> {
  try {
    // 1. Firebase Auth에 유저 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 2. Firestore 'users' 컬렉션에 프로필 문서 생성
    const userDocRef = doc(db, "users", user.uid); // ID를 uid로 사용
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: name || user.email?.split("@")[0],
      totalDonation: 0,
      createdAt: new Date().toISOString(),
      lastRecordDate: null,
      badges: ["goal_setter"], // 'Goal Setter' 뱃지 기본 부여
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

/**
 * 로그인 (Firebase Auth)
 */
export async function login(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // 로그인 성공 시, Auth가 세션을 자동으로 관리 (localStorage 불필요)
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

/**
 * 로그아웃 (Firebase Auth)
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
    // 로그아웃 성공 시, Auth가 세션을 자동으로 제거
  } catch (error: any) {
    toast.error("로그아웃 중 오류가 발생했습니다.");
    console.error("Logout Error: ", error);
  }
}

// --- 3. 사용자 프로필 함수 (Firestore) ---

/**
 * (중요) 실시간 사용자 상태 감지 (Auth + Firestore)
 * React Context에서 이 함수를 사용하여 로그인 상태를 감지합니다.
 * try/catch를 추가하여 프로필 로드 실패 시에도 앱이 멈추지 않도록 함
 */
export function onAuthChange(
  callback: (user: User | null) => void
): () => void {
  // onAuthStateChanged는 구독 해제 함수를 반환합니다.
  return onAuthStateChanged(auth, async (authUser: AuthUser | null) => {
    try {
      if (authUser) {
        // 1. Auth에는 로그인됨 -> Firestore에서 프로필 정보를 가져옴
        const userProfile = await getCurrentUserProfile(authUser.uid);

        if (userProfile) {
          callback(userProfile); // 프로필 정보(이름, 기부금 등)와 함께 반환
        } else {
          // Auth에는 있지만 DB에 프로필이 없는 비정상적 경우
          callback(null);
        }
      } else {
        // 2. 로그아웃됨
        callback(null);
      }
    } catch (error) {
      // 3. getCurrentUserProfile에서 오류 발생 시
      console.error("Error during auth state change:", error);
      callback(null);
    }
  });
}

/**
 * (Helper) uid로 Firestore에서 사용자 프로필 가져오기
 */
export async function getCurrentUserProfile(uid: string): Promise<User | null> {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
    // 프로필이 없는 경우 (이론상 signup에서 생성해야 함)
    console.error("No user profile found in Firestore for UID:", uid);
    return null;
  }
}

/**
 * 현재 로그인된 사용자 프로필 업데이트
 */
export async function updateCurrentUserProfile(
  updates: Partial<Omit<User, "uid" | "email">>
): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    toast.error("로그인이 필요합니다.");
    return false;
  }

  const userDocRef = doc(db, "users", user.uid);
  try {
    await updateDoc(userDocRef, {
      ...updates,
      // (필요시 'updatedAt: serverTimestamp()' 추가)
    });
    return true;
  } catch (error) {
    toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    console.error("Update Profile Error: ", error);
    return false;
  }
}

/**
 * 상세 건강 프로필 업데이트 (ProfileSetupPage에서 사용)
 * users/{uid} 문서의 profile 필드를 통째로 교체
 */
export async function updateUserProfile(
  profile: UserProfile
): Promise<boolean> {
  const authUser = auth.currentUser;
  if (!authUser) {
    toast.error("로그인이 필요합니다.");
    return false;
  }

  const userDocRef = doc(db, "users", authUser.uid);

  // 🔹 1) undefined 값 제거
  const cleanedProfile: Record<string, any> = {};
  Object.entries(profile).forEach(([key, value]) => {
    if (value !== undefined) {
      cleanedProfile[key] = value;
    }
  });

  try {
    await updateDoc(userDocRef, {
      profile: cleanedProfile,
      // 필요하면 updatedAt: serverTimestamp() 도 추가 가능
    });
    return true;
  } catch (error) {
    console.error("Update User Profile Error: ", error);
    toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    return false;
  }
}

// --- 4. 건강 기록 함수 (Firestore Transaction) ---

/**
 * 건강 기록 추가 및 기부금 적립 (F-02, F-03)
 * [중요] '기록 추가'와 '기부금 적립'을 하나의 트랜잭션으로 처리
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
    // 트랜잭션 시작
    await runTransaction(db, async (transaction) => {
      // 1. 최신 사용자 프로필을 트랜잭션 내에서 읽기
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("User profile not found!");
      }

      const userData = userDoc.data() as User;
      const today = new Date().toISOString().split("T")[0];
      const lastRecordDate = userData.lastRecordDate?.split("T")[0];

      let newTotalDonation = userData.totalDonation;
      let newLastRecordDate = userData.lastRecordDate;

      // 2. 기부금 적립 로직 (F-03)
      if (lastRecordDate !== today) {
        newTotalDonation += 100; // 당일 첫 기록인 경우 100원 적립
        newLastRecordDate = new Date().toISOString();
        wasFirstDonation = true; // 2. 플래그를 true로
      }

      // 3. 새 건강 기록 문서 생성 (트랜잭션)
      const newLogRef = doc(collection(db, "healthLogs")); // 새 ID 생성
      transaction.set(newLogRef, {
        ...logData,
        userId: user.uid, // userId 추가
        recordedAt: new Date().toISOString(),
        id: newLogRef.id, // HealthLog 타입이 id를 가지므로 추가
      });

      // 4. 사용자 프로필 업데이트 (트랜잭션)
      transaction.update(userDocRef, {
        totalDonation: newTotalDonation,
        lastRecordDate: newLastRecordDate,
      });
    });

    // 트랜잭션 성공
    // 3. 플래그에 따라 다른 값 반환
    return wasFirstDonation ? "first_donation" : "normal_log";
  } catch (error) {
    toast.error("기록 저장 중 오류가 발생했습니다.");
    console.error("Add Health Log Transaction Error: ", error);
    return null; // 실패
  }
}

/**
 * (F-04) 현재 사용자의 모든 건강 기록 조회
 */
export async function getUserHealthLogs(): Promise<HealthLog[]> {
  const user = auth.currentUser;
  if (!user) {
    return []; // 로그인 안했으면 빈 배열 반환
  }

  try {
    const logsCollectionRef = collection(db, "healthLogs");
    // 1. userId가 일치하는 문서를
    // 2. 'recordedAt' 기준으로 내림차순(최신순) 정렬
    const q = query(
      logsCollectionRef,
      where("userId", "==", user.uid),
      orderBy("recordedAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    // 3. 문서 배열로 변환
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as HealthLog)
    );
  } catch (error) {
    toast.error("기록을 불러오는 중 오류가 발생했습니다.");
    console.error("Get Health Logs Error: ", error);
    return [];
  }
}

/**
 * 실시간 사용자 프로필 구독 (onSnapshot)
 */
export function subscribeToUserProfile(
  uid: string,
  callback: (user: User | null) => void
): Unsubscribe {
  const userDocRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(
    userDocRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as User);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error subscribing to user profile:", error);
      toast.error("사용자 정보 실시간 연동에 실패했습니다.");
      callback(null);
    }
  );

  return unsubscribe;
}

// 이메일로 사용자 검색
export async function getUserByUid(uid: string): Promise<User | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as User) : null;
}

// 사용자 존재 체크 유틸
export async function userExistsByEmail(email: string): Promise<boolean> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
}
