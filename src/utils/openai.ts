// utils/openai.ts
import type { User } from "./auth";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY_STORAGE = "healthykong_openai_key";

/* ---------- API 키 관리 ---------- */

export function saveOpenAIKey(apiKey: string) {
  localStorage.setItem(OPENAI_KEY_STORAGE, apiKey);
}

export function getOpenAIKey(): string | null {
  // 1) 로컬 스토리지에서 사용자 설정 API 키 확인
  const storedKey = localStorage.getItem(OPENAI_KEY_STORAGE);
  if (storedKey && storedKey.trim().length > 0) {
    return storedKey;
  }

  // 2) 환경 변수 확인 (있으면 사용)
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
      // @ts-ignore
      const envKey = import.meta.env.VITE_OPENAI_API_KEY as string;
      if (envKey && envKey.trim().length > 0) {
        return envKey;
      }
    }
  } catch {
    // 환경 변수 접근 실패는 무시
  }

  // 3) 없으면 null (더미 키 사용 X)
  return null;
}

export function hasOpenAIKey(): boolean {
  const key = getOpenAIKey();
  return !!key && key.trim().length > 0;
}

export function removeOpenAIKey() {
  localStorage.removeItem(OPENAI_KEY_STORAGE);
}

/* ---------- 타입 정의 ---------- */

export interface WeeklyHealthData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalRecords: number;
  avgBloodSugar?: number;
  avgSystolic?: number;
  avgDiastolic?: number;
  bloodSugarReadings: number[];
  bloodPressureReadings: Array<{ systolic: number; diastolic: number }>;
  recordDates: string[];
}

export interface AIAnalysis {
  trend: "improving" | "stable" | "needs_attention";
  trendReason: string;
  insights: Array<{
    title: string;
    description: string;
    icon: "exercise" | "diet" | "stress" | "general";
    priority: "high" | "medium" | "low";
  }>;
  encouragement: string;
  keyRecommendations: string[];
}

// ✅ User.profile 타입
type UserProfile = User["profile"] | null | undefined;

/* ---------- 메인 분석 함수 ---------- */

export async function analyzeHealthDataWithAI(
  healthData: WeeklyHealthData,
  profile?: UserProfile,
): Promise<AIAnalysis> {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  const prompt = generateAnalysisPrompt(healthData, profile);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `당신은 당뇨와 고혈압 관리 전문가입니다. 사용자의 프로필 정보와 건강 데이터를 분석하고 실용적이고 구체적인 조언을 제공합니다. 
응답은 반드시 JSON 형식으로만 제공하며, 다음 구조를 정확히 따릅니다:
{
  "trend": "improving" | "stable" | "needs_attention",
  "trendReason": "추세 판단 이유 (1-2문장)",
  "insights": [
    {
      "title": "조언 제목",
      "description": "구체적인 조언 내용 (2-3문장)",
      "icon": "exercise" | "diet" | "stress" | "general",
      "priority": "high" | "medium" | "low"
    }
  ],
  "encouragement": "격려 메시지 (1-2문장)",
  "keyRecommendations": ["핵심 추천사항 1", "핵심 추천사항 2", "핵심 추천사항 3"]
}

조언은 3-5개 정도 제공하며, 우선순위가 높은 것부터 배치합니다. 
반드시 사용자의 나이, 성별, BMI, 관리 질환(당뇨/고혈압/고지혈증 여부), HbA1c, 평소 혈압, 생활 습관(음주/흡연/운동)까지 모두 고려해 주세요.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `OpenAI API 오류: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const analysis: AIAnalysis = JSON.parse(content);

    if (!analysis.trend || !analysis.insights || !analysis.encouragement) {
      throw new Error("AI 응답 형식이 올바르지 않습니다.");
    }

    return analysis;
  } catch (error) {
    console.error("OpenAI API 호출 실패:", error);
    throw error;
  }
}

/* ---------- 프롬프트 생성 ---------- */

function generateAnalysisPrompt(
  data: WeeklyHealthData,
  profile?: UserProfile,
): string {
  let prompt = "";

  // 1. 프로필 요약
  if (profile && profile.completedAt) {
    const bmi =
      profile.height && profile.weight
        ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
        : null;

    const genderKo =
      profile.gender === "male"
        ? "남성"
        : profile.gender === "female"
        ? "여성"
        : "미설정";

    const conditionsText = (() => {
      if (!profile.conditions || profile.conditions.length === 0)
        return "미설정";
      if (profile.conditions.includes("none")) return "없음 (예방 목적)";
      const labels: Record<string, string> = {
        diabetes: "당뇨병",
        hypertension: "고혈압",
        hyperlipidemia: "고지혈증",
      };
      return profile.conditions.map((c: string) => labels[c] || c).join(", ");
    })();

    prompt += `[사용자 프로필]\n`;
    if (profile.age !== undefined) {
      prompt += `- 나이: ${profile.age}세\n`;
    }
    prompt += `- 성별: ${genderKo}\n`;
    if (profile.height) prompt += `- 키: ${profile.height} cm\n`;
    if (profile.weight) prompt += `- 체중: ${profile.weight} kg\n`;
    if (bmi) prompt += `- BMI: ${bmi}\n`;
    prompt += `- 관리 질환: ${conditionsText}\n`;

    if (profile.hba1c !== undefined) {
      prompt += `- 최근 당화혈색소(HbA1c): ${profile.hba1c}%\n`;
    }
    if (
      profile.systolicBP !== undefined &&
      profile.diastolicBP !== undefined
    ) {
      prompt += `- 평소 혈압: ${profile.systolicBP}/${profile.diastolicBP} mmHg\n`;
    }

    if (profile.alcoholFrequency) {
      const alcoholText: Record<string, string> = {
        none: "안 함",
        "1to2": "주 1~2회",
        "3plus": "주 3회 이상",
      };
      prompt += `- 음주 빈도: ${
        alcoholText[profile.alcoholFrequency] ?? profile.alcoholFrequency
      }\n`;
    }

    if (profile.smokingStatus) {
      const smokingText: Record<string, string> = {
        never: "비흡연",
        past: "과거 흡연",
        current: "현재 흡연",
      };
      prompt += `- 흡연 상태: ${
        smokingText[profile.smokingStatus] ?? profile.smokingStatus
      }\n`;
    }

    if (profile.exerciseFrequency) {
      const exerciseText: Record<string, string> = {
        none: "안 함",
        "1to2": "주 1~2회",
        "3to4": "주 3~4회",
        "5plus": "주 5회 이상",
      };
      prompt += `- 운동 빈도: ${
        exerciseText[profile.exerciseFrequency] ?? profile.exerciseFrequency
      }\n`;
    }

    if (profile.diagnosisPeriod) {
      const diagText: Record<string, string> = {
        under1year: "1년 미만",
        "1to5years": "1~5년",
        over5years: "5년 이상",
      };
      prompt += `- 질환 진단 시기: ${
        diagText[profile.diagnosisPeriod] ?? profile.diagnosisPeriod
      }\n`;
    }

    if (profile.medicationType) {
      const medText: Record<string, string> = {
        oral: "먹는 약",
        insulin: "인슐린 주사",
        both: "약 + 주사 병행",
        lifestyle: "운동 & 식이요법만",
      };
      prompt += `- 약물 복용 형태: ${
        medText[profile.medicationType] ?? profile.medicationType
      }\n`;
    }

    if (profile.diabetesType) {
      const dTypeText: Record<string, string> = {
        type1: "제1형 당뇨",
        type2: "제2형 당뇨",
        gestational: "임신성 당뇨",
        prediabetes: "당뇨 전단계",
      };
      prompt += `- 당뇨 유형: ${
        dTypeText[profile.diabetesType] ?? profile.diabetesType
      }\n`;
    }

    prompt += `\n`;
  } else {
    prompt += `[사용자 프로필]\n- 프로필 정보가 충분하지 않습니다. 가능한 범위 내에서 일반적인 한국 성인의 상황을 가정해 조언해주세요.\n\n`;
  }

  // 2. 이번 주 건강 데이터
  prompt += `[이번 주 건강 데이터]\n`;
  prompt += `📅 기간: ${data.startDate} ~ ${data.endDate} (Week ${data.weekNumber})\n`;
  prompt += `📊 기록 횟수: ${data.totalRecords}회\n\n`;

  if (data.bloodSugarReadings.length > 0) {
    prompt += `🩸 혈당 데이터:\n`;
    prompt += `- 평균: ${data.avgBloodSugar?.toFixed(1)} mg/dL\n`;
    prompt += `- 최고: ${Math.max(...data.bloodSugarReadings)} mg/dL\n`;
    prompt += `- 최저: ${Math.min(...data.bloodSugarReadings)} mg/dL\n`;
    prompt += `- 측정값: [${data.bloodSugarReadings.join(", ")}] mg/dL\n`;
    prompt += `- 측정 횟수: ${data.bloodSugarReadings.length}회\n\n`;
  }

  if (data.bloodPressureReadings.length > 0) {
    const systolics = data.bloodPressureReadings.map((r) => r.systolic);
    const diastolics = data.bloodPressureReadings.map((r) => r.diastolic);

    prompt += `💓 혈압 데이터:\n`;
    prompt += `- 평균: ${data.avgSystolic?.toFixed(
      1,
    )}/${data.avgDiastolic?.toFixed(1)} mmHg\n`;
    prompt += `- 수축기 범위: ${Math.min(...systolics)}-${Math.max(
      ...systolics,
    )} mmHg\n`;
    prompt += `- 이완기 범위: ${Math.min(...diastolics)}-${Math.max(
      ...diastolics,
    )} mmHg\n`;
    prompt += `- 측정 횟수: ${data.bloodPressureReadings.length}회\n\n`;
  }

  prompt += `📝 기록 패턴:\n`;
  if (data.totalRecords >= 7) {
    prompt += `- 매일 빠짐없이 기록했습니다.\n`;
  } else if (data.totalRecords >= 5) {
    prompt += `- 주 5회 이상 기록했습니다.\n`;
  } else if (data.totalRecords >= 3) {
    prompt += `- 주 3-4회 기록했습니다.\n`;
  } else {
    prompt += `- 기록이 부족합니다 (주 ${data.totalRecords}회만 기록)\n`;
  }

  prompt += `\n[요청 사항]\n`;
  prompt += `1. 위 프로필과 이번 주 데이터를 모두 고려해 전반적인 건강 추세를 평가하세요.\n`;
  prompt += `2. 운동, 식습관, 스트레스, 수면, 약물 복용, 기록 습관 등 다양한 측면에서 실용적인 조언 3~5개를 제시하세요.\n`;
  prompt += `3. 각 조언에는 우선순위(priority)와 아이콘(icon)을 설정하세요.\n`;
  prompt += `4. 마지막으로 따뜻한 격려 메시지를 작성해주세요.\n`;
  prompt += `5. 조언은 한국인의 식습관과 생활패턴(밥, 국, 야식, 회식 문화 등)을 고려해 주세요.\n`;

  return prompt;
}

/* ---------- 에러 메시지 변환 ---------- */
export function getErrorMessage(error: any): string {
  const msg =
    (error && (error as any).message) ||
    (typeof error === "string" ? error : "");

  if (msg.includes("API 키가 설정되지")) {
    return "OpenAI API 키를 설정해주세요.";
  }
  if (msg.includes("401")) {
    return "API 키가 유효하지 않습니다. 다시 확인해주세요.";
  }
  if (msg.includes("429")) {
    return "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
  }
  if (msg.includes("insufficient_quota")) {
    return "API 크레딧이 부족합니다. OpenAI 계정을 확인해주세요.";
  }
  return msg || "AI 분석 중 오류가 발생했습니다.";
}
