import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { type User, type HealthLog } from "./auth";
import { toast } from "sonner";

export interface Badge {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  category: "routine" | "donation" | "challenge";
  emoji: string;
  color: string;
  condition: string;
}

export const ALL_BADGES: Badge[] = [
  // 루틴 / 습관 관련 뱃지
  {
    id: "first_record",
    name: "First Step",
    nameKo: "첫 발걸음",
    description: "건강 기록의 첫 시작",
    category: "routine",
    emoji: "🌟",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    condition: "첫 건강 기록 작성",
  },
  {
    id: "starter_spark",
    name: "Starter Spark",
    nameKo: "스타터 스파크",
    description: "좋은 시작을 알린 첫 불꽃",
    category: "routine",
    emoji: "✨",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    condition: "3일 연속 건강 기록",
  },
  {
    id: "consistency_champ",
    name: "Consistency Champ",
    nameKo: "꾸준함의 달인",
    description: "2주 연속 루틴 성공",
    category: "routine",
    emoji: "💪",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    condition: "14일 연속 건강 기록",
  },
  {
    id: "habit_master",
    name: "Habit Master",
    nameKo: "습관화의 고수",
    description: "1달 연속 루틴 성공",
    category: "routine",
    emoji: "🏅",
    color: "bg-purple-100 text-purple-700 border-purple-300",
    condition: "30일 연속 건강 기록",
  },
  {
    id: "comeback_kid",
    name: "Comeback Kid",
    nameKo: "재기의 용사",
    description: "포기하지 않은 용기",
    category: "routine",
    emoji: "🔥",
    color: "bg-red-100 text-red-700 border-red-300",
    condition: "7일 공백 후 재시작",
  },
  {
    id: "perfect_streak",
    name: "Perfect Streak",
    nameKo: "완벽한 한 주",
    description: "일주일 완벽 달성",
    category: "routine",
    emoji: "⭐",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    condition: "7일 연속 건강 기록",
  },

  // 기부 / 선행 관련 뱃지
  {
    id: "kindness_beginner",
    name: "Kindness Beginner",
    nameKo: "선행의 첫걸음",
    description: "첫 기부 달성",
    category: "donation",
    emoji: "💚",
    color: "bg-green-100 text-green-700 border-green-300",
    condition: "첫 기부 (100P)",
  },
  {
    id: "giving_spirit",
    name: "Giving Spirit",
    nameKo: "나눔의 정신",
    description: "나눔의 마음이 자라나는 중",
    category: "donation",
    emoji: "🌱",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    condition: "누적 기부 5,000P",
  },
  {
    id: "donation_star",
    name: "Donation Star",
    nameKo: "기부의 별",
    description: "꾸준한 나눔 실천가",
    category: "donation",
    emoji: "⭐",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    condition: "누적 기부 30,000P",
  },
  {
    id: "hope_maker",
    name: "Hope Maker",
    nameKo: "희망 메이커",
    description: "세상에 희망을 전하는 사람",
    category: "donation",
    emoji: "🌈",
    color: "bg-purple-100 text-purple-700 border-purple-300",
    condition: "누적 기부 100,000P",
  },

  // 도전 / 성장 관련 뱃지
  {
    id: "goal_setter",
    name: "Goal Setter",
    nameKo: "목표 설정자",
    description: "목표를 세운 사람",
    category: "challenge",
    emoji: "🎯",
    color: "bg-indigo-100 text-indigo-700 border-indigo-300",
    condition: "회원가입 완료",
  },
  {
    id: "life_balancer",
    name: "Life Balancer",
    nameKo: "균형의 달인",
    description: "삶의 균형을 이룬 자",
    category: "challenge",
    emoji: "⚖️",
    color: "bg-teal-100 text-teal-700 border-teal-300",
    condition: "혈당과 혈압 모두 기록",
  },
  {
    id: "persistence_legend",
    name: "Persistence Legend",
    nameKo: "꾸준함의 전설",
    description: "루틴 50회 이상 실행",
    category: "challenge",
    emoji: "🏆",
    color: "bg-amber-100 text-amber-700 border-amber-300",
    condition: "건강 기록 50회",
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return ALL_BADGES.find((badge) => badge.id === id);
}

// 뱃지 획득 조건 체크 및 DB 업데이트
export async function checkAndAwardBadges(
  user: User,
  totalRecords: number,
  consecutiveDays: number,
  hasBloodSugar: boolean,
  hasBloodPressure: boolean,
  daysSinceLastRecord: number
): Promise<string[]> {
  const newBadges: string[] = [];
  const currentBadges = user.badges || []; // 사용자의 현재 뱃지 목록
  const totalDonation = user.totalDonation; // 사용자의 현재 포인트

  // 첫 기록
  if (totalRecords === 1 && !currentBadges.includes("first_record")) {
    newBadges.push("first_record");
  }

  // 첫 기부
  if (totalDonation >= 100 && !currentBadges.includes("kindness_beginner")) {
    newBadges.push("kindness_beginner");
  }

  // 3일 연속
  if (consecutiveDays >= 3 && !currentBadges.includes("starter_spark")) {
    newBadges.push("starter_spark");
  }

  // 7일 연속
  if (consecutiveDays >= 7 && !currentBadges.includes("perfect_streak")) {
    newBadges.push("perfect_streak");
  }

  // 14일 연속
  if (consecutiveDays >= 14 && !currentBadges.includes("consistency_champ")) {
    newBadges.push("consistency_champ");
  }

  // 30일 연속
  if (consecutiveDays >= 30 && !currentBadges.includes("habit_master")) {
    newBadges.push("habit_master");
  }

  // 재기의 용사 (7일 이상 공백 후 재시작)
  if (
    daysSinceLastRecord >= 7 &&
    totalRecords > 1 &&
    !currentBadges.includes("comeback_kid")
  ) {
    newBadges.push("comeback_kid");
  }

  // 기부 뱃지들
  if (totalDonation >= 5000 && !currentBadges.includes("giving_spirit")) {
    newBadges.push("giving_spirit");
  }

  if (totalDonation >= 30000 && !currentBadges.includes("donation_star")) {
    newBadges.push("donation_star");
  }

  if (totalDonation >= 100000 && !currentBadges.includes("hope_maker")) {
    newBadges.push("hope_maker");
  }

  // 균형의 달인 (혈당과 혈압 모두 기록)
  if (
    hasBloodSugar &&
    hasBloodPressure &&
    !currentBadges.includes("life_balancer")
  ) {
    newBadges.push("life_balancer");
  }

  // 꾸준함의 전설 (50회 기록)
  if (totalRecords >= 50 && !currentBadges.includes("persistence_legend")) {
    newBadges.push("persistence_legend");
  }

  // 새로 획득한 뱃지가 있다면 Firestore DB에 한 번만 업데이트
  if (newBadges.length > 0) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        badges: arrayUnion(...newBadges),
      });
    } catch (error) {
      console.error("Badge award DB update error:", error);
      toast.error("뱃지 획득 정보를 저장하는 데 실패했습니다.");
      return []; // DB 저장 실패 시 빈 배열 반환
    }
  }

  return newBadges;
}

// 연속 일수 계산
export function calculateConsecutiveDays(recordDates: string[]): number {
  if (recordDates.length === 0) return 0;

  const uniqueDates = [
    ...new Set(recordDates.map((d) => d.split("T")[0])),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let consecutive = 0;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (uniqueDates[0] === todayStr) {
    consecutive = 1;
  } else if (uniqueDates[0] === yesterdayStr) {
    consecutive = 1;
  } else {
    return 0;
  }

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const diffDays = Math.floor(
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      consecutive++;
    } else {
      break;
    }
  }

  return consecutive;
}

// 기록 공백 계산
export function daysSinceLastRecord(recordDates: string[]): number {
  const uniqueDates = [
    ...new Set(recordDates.map((d) => d.split("T")[0])),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDates.length < 2) return 0;

  const mostRecent = new Date(uniqueDates[0]);
  const secondMostRecent = new Date(uniqueDates[1]);

  const diffDays = Math.floor(
    (mostRecent.getTime() - secondMostRecent.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffDays;
}

// 특정 사용자의 배지 목록 가져오기
export function getUserBadges(email: string): string[] {
  const data = localStorage.getItem(`badges_${email}`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
