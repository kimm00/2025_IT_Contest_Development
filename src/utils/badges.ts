// 뱃지 시스템

export interface Badge {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  category: 'routine' | 'donation' | 'challenge';
  emoji: string;
  color: string;
  condition: string;
}

export const ALL_BADGES: Badge[] = [
  // 루틴 / 습관 관련 뱃지
  {
    id: 'first_record',
    name: 'First Step',
    nameKo: '첫 발걸음',
    description: '건강 기록의 첫 시작',
    category: 'routine',
    emoji: '🌟',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    condition: '첫 건강 기록 작성'
  },
  {
    id: 'starter_spark',
    name: 'Starter Spark',
    nameKo: '스타터 스파크',
    description: '좋은 시작을 알린 첫 불꽃',
    category: 'routine',
    emoji: '✨',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    condition: '3일 연속 건강 기록'
  },
  {
    id: 'consistency_champ',
    name: 'Consistency Champ',
    nameKo: '꾸준함의 달인',
    description: '2주 연속 루틴 성공',
    category: 'routine',
    emoji: '💪',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    condition: '14일 연속 건강 기록'
  },
  {
    id: 'habit_master',
    name: 'Habit Master',
    nameKo: '습관화의 고수',
    description: '1달 연속 루틴 성공',
    category: 'routine',
    emoji: '🏅',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    condition: '30일 연속 건강 기록'
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    nameKo: '재기의 용사',
    description: '포기하지 않은 용기',
    category: 'routine',
    emoji: '🔥',
    color: 'bg-red-100 text-red-700 border-red-300',
    condition: '7일 공백 후 재시작'
  },
  {
    id: 'perfect_streak',
    name: 'Perfect Streak',
    nameKo: '완벽한 한 주',
    description: '일주일 완벽 달성',
    category: 'routine',
    emoji: '⭐',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    condition: '7일 연속 건강 기록'
  },

  // 기부 / 선행 관련 뱃지
  {
    id: 'kindness_beginner',
    name: 'Kindness Beginner',
    nameKo: '선행의 첫걸음',
    description: '첫 기부 달성',
    category: 'donation',
    emoji: '💚',
    color: 'bg-green-100 text-green-700 border-green-300',
    condition: '첫 기부 (100원)'
  },
  {
    id: 'giving_spirit',
    name: 'Giving Spirit',
    nameKo: '나눔의 정신',
    description: '나눔의 마음이 자라나는 중',
    category: 'donation',
    emoji: '🌱',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    condition: '누적 기부 5,000원'
  },
  {
    id: 'donation_star',
    name: 'Donation Star',
    nameKo: '기부의 별',
    description: '꾸준한 나눔 실천가',
    category: 'donation',
    emoji: '⭐',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    condition: '누적 기부 30,000원'
  },
  {
    id: 'hope_maker',
    name: 'Hope Maker',
    nameKo: '희망 메이커',
    description: '세상에 희망을 전하는 사람',
    category: 'donation',
    emoji: '🌈',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    condition: '누적 기부 100,000원'
  },

  // 도전 / 성장 관련 뱃지
  {
    id: 'goal_setter',
    name: 'Goal Setter',
    nameKo: '목표 설정자',
    description: '목표를 세운 사람',
    category: 'challenge',
    emoji: '🎯',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    condition: '회원가입 완료'
  },
  {
    id: 'life_balancer',
    name: 'Life Balancer',
    nameKo: '균형의 달인',
    description: '삶의 균형을 이룬 자',
    category: 'challenge',
    emoji: '⚖️',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    condition: '혈당과 혈압 모두 기록'
  },
  {
    id: 'persistence_legend',
    name: 'Persistence Legend',
    nameKo: '꾸준함의 전설',
    description: '루틴 50회 이상 실행',
    category: 'challenge',
    emoji: '🏆',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    condition: '건강 기록 50회'
  }
];

export function getBadgeById(id: string): Badge | undefined {
  return ALL_BADGES.find(badge => badge.id === id);
}

// 사용자가 획득한 뱃지 저장/조회
const STORAGE_KEY = 'healthykong_user_badges';

export interface UserBadgeData {
  [email: string]: {
    badges: string[]; // 획득한 뱃지 ID 목록
    earnedAt: { [badgeId: string]: string }; // 획득 시간
  };
}

export function getUserBadges(email: string): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allUserBadges: UserBadgeData = data ? JSON.parse(data) : {};
    return allUserBadges[email]?.badges || [];
  } catch {
    return [];
  }
}

export function awardBadge(email: string, badgeId: string): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allUserBadges: UserBadgeData = data ? JSON.parse(data) : {};
    
    if (!allUserBadges[email]) {
      allUserBadges[email] = { badges: [], earnedAt: {} };
    }

    // 이미 보유한 뱃지인지 확인
    if (allUserBadges[email].badges.includes(badgeId)) {
      return false; // 이미 보유
    }

    allUserBadges[email].badges.push(badgeId);
    allUserBadges[email].earnedAt[badgeId] = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allUserBadges));
    return true; // 새로 획득
  } catch {
    return false;
  }
}

export function hasBadge(email: string, badgeId: string): boolean {
  const badges = getUserBadges(email);
  return badges.includes(badgeId);
}

// 뱃지 획득 조건 체크
export function checkAndAwardBadges(
  email: string,
  totalRecords: number,
  consecutiveDays: number,
  totalDonation: number,
  hasBloodSugar: boolean,
  hasBloodPressure: boolean,
  daysSinceLastRecord: number
): string[] {
  const newBadges: string[] = [];

  // 첫 기록
  if (totalRecords === 1 && !hasBadge(email, 'first_record')) {
    if (awardBadge(email, 'first_record')) {
      newBadges.push('first_record');
    }
  }

  // 첫 기부
  if (totalDonation >= 100 && !hasBadge(email, 'kindness_beginner')) {
    if (awardBadge(email, 'kindness_beginner')) {
      newBadges.push('kindness_beginner');
    }
  }

  // 회원가입 (Goal Setter)
  if (!hasBadge(email, 'goal_setter')) {
    if (awardBadge(email, 'goal_setter')) {
      newBadges.push('goal_setter');
    }
  }

  // 3일 연속
  if (consecutiveDays >= 3 && !hasBadge(email, 'starter_spark')) {
    if (awardBadge(email, 'starter_spark')) {
      newBadges.push('starter_spark');
    }
  }

  // 7일 연속
  if (consecutiveDays >= 7 && !hasBadge(email, 'perfect_streak')) {
    if (awardBadge(email, 'perfect_streak')) {
      newBadges.push('perfect_streak');
    }
  }

  // 14일 연속
  if (consecutiveDays >= 14 && !hasBadge(email, 'consistency_champ')) {
    if (awardBadge(email, 'consistency_champ')) {
      newBadges.push('consistency_champ');
    }
  }

  // 30일 연속
  if (consecutiveDays >= 30 && !hasBadge(email, 'habit_master')) {
    if (awardBadge(email, 'habit_master')) {
      newBadges.push('habit_master');
    }
  }

  // 재기의 용사 (7일 이상 공백 후 재시작)
  if (daysSinceLastRecord >= 7 && totalRecords > 1 && !hasBadge(email, 'comeback_kid')) {
    if (awardBadge(email, 'comeback_kid')) {
      newBadges.push('comeback_kid');
    }
  }

  // 기부 뱃지들
  if (totalDonation >= 5000 && !hasBadge(email, 'giving_spirit')) {
    if (awardBadge(email, 'giving_spirit')) {
      newBadges.push('giving_spirit');
    }
  }

  if (totalDonation >= 30000 && !hasBadge(email, 'donation_star')) {
    if (awardBadge(email, 'donation_star')) {
      newBadges.push('donation_star');
    }
  }

  if (totalDonation >= 100000 && !hasBadge(email, 'hope_maker')) {
    if (awardBadge(email, 'hope_maker')) {
      newBadges.push('hope_maker');
    }
  }

  // 균형의 달인 (혈당과 혈압 모두 기록)
  if (hasBloodSugar && hasBloodPressure && !hasBadge(email, 'life_balancer')) {
    if (awardBadge(email, 'life_balancer')) {
      newBadges.push('life_balancer');
    }
  }

  // 꾸준함의 전설 (50회 기록)
  if (totalRecords >= 50 && !hasBadge(email, 'persistence_legend')) {
    if (awardBadge(email, 'persistence_legend')) {
      newBadges.push('persistence_legend');
    }
  }

  return newBadges;
}

// 연속 일수 계산
export function calculateConsecutiveDays(recordDates: string[]): number {
  if (recordDates.length === 0) return 0;

  const uniqueDates = [...new Set(recordDates.map(d => d.split('T')[0]))].sort().reverse();
  let consecutive = 1;
  const today = new Date().toISOString().split('T')[0];
  
  // 오늘 기록이 있는지 확인
  if (uniqueDates[0] !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (uniqueDates[0] !== yesterdayStr) {
      return 0; // 연속성이 끊김
    }
  }

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutive++;
    } else {
      break;
    }
  }

  return consecutive;
}

// 마지막 기록 이후 경과 일수
export function daysSinceLastRecord(recordDates: string[]): number {
  if (recordDates.length <= 1) return 0;

  const dates = recordDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
  const lastRecord = dates[1]; // 두 번째로 최근 기록
  const now = new Date();
  
  return Math.floor((now.getTime() - lastRecord.getTime()) / (1000 * 60 * 60 * 24));
}
