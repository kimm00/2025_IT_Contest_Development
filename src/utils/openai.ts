import { type HealthLog } from "./auth";

// OpenAI API 설정
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// API 키 관리
export function saveOpenAIKey(apiKey: string) {
  localStorage.setItem("openai_api_key", apiKey);
}

export function getOpenAIKey(): string | null {
  const saved = localStorage.getItem("openai_api_key");

  // 저장된 키가 있으면 그걸 사용
  if (saved && saved.trim().length > 0) return saved;

  // 기본값으로 도이 API 키 사용
  return "sk-도이의API키";
}

export function hasOpenAIKey(): boolean {
  const key = getOpenAIKey();
  return key !== null && key.trim().length > 0;
}

export function removeOpenAIKey() {
  localStorage.removeItem("openai_api_key");
}

interface WeeklyHealthData {
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

interface AIAnalysis {
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

export type { WeeklyHealthData, AIAnalysis };

export async function analyzeHealthDataWithAI(
  healthData: WeeklyHealthData
): Promise<AIAnalysis> {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  // GPT에게 전달할 프롬프트 생성
  const prompt = generateAnalysisPrompt(healthData);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 비용 효율적인 모델
        messages: [
          {
            role: "system",
            content: `당신은 당뇨와 고혈압 관리 전문가입니다. 사용자의 건강 데이터를 분석하고 실용적이고 구체적인 조언을 제공합니다. 
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

조언은 3-5개 정도 제공하며, 우선순위가 높은 것부터 배치합니다.`,
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
          `OpenAI API 오류: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // JSON 파싱
    const analysis: AIAnalysis = JSON.parse(content);

    // 데이터 검증
    if (!analysis.trend || !analysis.insights || !analysis.encouragement) {
      throw new Error("AI 응답 형식이 올바르지 않습니다.");
    }

    return analysis;
  } catch (error) {
    console.error("OpenAI API 호출 실패:", error);
    throw error;
  }
}

function generateAnalysisPrompt(data: WeeklyHealthData): string {
  let prompt = `다음은 사용자의 이번 주 건강 데이터입니다:\n\n`;

  prompt += `📅 기간: ${data.startDate} ~ ${data.endDate} (Week ${data.weekNumber})\n`;
  prompt += `📊 기록 횟수: ${data.totalRecords}회\n\n`;

  // 혈당 데이터
  if (data.bloodSugarReadings.length > 0) {
    prompt += `🩸 혈당 데이터:\n`;
    prompt += `- 평균: ${data.avgBloodSugar?.toFixed(1)} mg/dL\n`;
    prompt += `- 최고: ${Math.max(...data.bloodSugarReadings)} mg/dL\n`;
    prompt += `- 최저: ${Math.min(...data.bloodSugarReadings)} mg/dL\n`;
    prompt += `- 측정값: [${data.bloodSugarReadings.join(", ")}] mg/dL\n`;
    prompt += `- 측정 횟수: ${data.bloodSugarReadings.length}회\n\n`;
  }

  // 혈압 데이터
  if (data.bloodPressureReadings.length > 0) {
    const systolics = data.bloodPressureReadings.map((r) => r.systolic);
    const diastolics = data.bloodPressureReadings.map((r) => r.diastolic);

    prompt += `💓 혈압 데이터:\n`;
    prompt += `- 평균: ${data.avgSystolic?.toFixed(
      1
    )}/${data.avgDiastolic?.toFixed(1)} mmHg\n`;
    prompt += `- 수축기 범위: ${Math.min(...systolics)}-${Math.max(
      ...systolics
    )} mmHg\n`;
    prompt += `- 이완기 범위: ${Math.min(...diastolics)}-${Math.max(
      ...diastolics
    )} mmHg\n`;
    prompt += `- 측정 횟수: ${data.bloodPressureReadings.length}회\n\n`;
  }

  // 기록 패턴
  prompt += `📝 기록 패턴:\n`;
  if (data.totalRecords >= 7) {
    prompt += `- 매일 빠짐없이 기록했습니다!\n`;
  } else if (data.totalRecords >= 5) {
    prompt += `- 주 5회 이상 기록했습니다.\n`;
  } else if (data.totalRecords >= 3) {
    prompt += `- 주 3-4회 기록했습니다.\n`;
  } else {
    prompt += `- 기록이 부족합니다 (주 ${data.totalRecords}회만 기록)\n`;
  }

  prompt += `\n위 데이터를 바탕으로:\n`;
  prompt += `1. 전반적인 건강 추세를 평가하고\n`;
  prompt += `2. 실용적이고 구체적인 조언 3-5개를 제공하며\n`;
  prompt += `3. 따뜻한 격려 메시지를 작성해주세요.\n\n`;
  prompt += `조언은 운동, 식습관, 스트레스 관리, 기록 습관 등 다양한 측면을 고려하되, `;
  prompt += `우선순위가 높은 것부터 제시해주세요. 각 조언은 한국인의 식습관과 생활패턴을 고려해주세요.`;

  return prompt;
}

// 에러 메시지 변환
export function getErrorMessage(error: any): string {
  if (error.message?.includes("API 키")) {
    return "OpenAI API 키를 설정해주세요.";
  }
  if (error.message?.includes("401")) {
    return "API 키가 유효하지 않습니다. 다시 확인해주세요.";
  }
  if (error.message?.includes("429")) {
    return "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
  }
  if (error.message?.includes("insufficient_quota")) {
    return "API 크레딧이 부족합니다. OpenAI 계정을 확인해주세요.";
  }
  return error.message || "AI 분석 중 오류가 발생했습니다.";
}
