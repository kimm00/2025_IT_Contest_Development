import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";

import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import type { HealthLog, UserProfile } from "../utils/auth";
import {
  analyzeHealthDataWithAI,
  hasOpenAIKey,
  getErrorMessage,
  type AIAnalysis,
} from "../utils/openai";

/* ---------------- 작은 UI 컴포넌트 ---------------- */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-purple-100 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function SummaryBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-3 border border-purple-100">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl text-purple-700">{value}</div>
      {unit && <div className="text-xs text-gray-500">{unit}</div>}
    </div>
  );
}

function InsightBox({
  insight,
}: {
  insight: { title: string; description: string };
}) {
  return (
    <div className="rounded-lg p-4 border-2 mt-2">
      <h5 className="font-medium">{insight.title}</h5>
      <p className="text-sm text-gray-700">{insight.description}</p>
    </div>
  );
}

function getTrendInfo(trend: string) {
  switch (trend) {
    case "improving":
      return {
        text: "개선 중",
        color: "bg-emerald-100 text-emerald-700",
      };
    case "needs_attention":
      return {
        text: "주의 필요",
        color: "bg-red-100 text-red-700",
      };
    default:
      return {
        text: "안정적",
        color: "bg-blue-100 text-blue-700",
      };
  }
}

/* ---------------- 타입 ---------------- */

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

interface WeeklyAIReportInnerProps {
  healthLogs: HealthLog[];
  userProfile?: UserProfile;
  weeklyData: WeeklyHealthData | null;
  setWeeklyData: any;
  aiAnalysis: AIAnalysis | null;
  setAiAnalysis: any;
  isLoading: boolean;
  setIsLoading: any;
  error: string | null;
  setError: any;
  hasApiKey: boolean;
  isExpanded: boolean;
  setIsExpanded: any;
}

/* ---------------- 내부 컴포넌트 ---------------- */

function WeeklyAIReportInner({
  healthLogs,
  userProfile,
  weeklyData,
  setWeeklyData,
  aiAnalysis,
  setAiAnalysis,
  isLoading,
  setIsLoading,
  error,
  setError,
  hasApiKey,
  isExpanded,
  setIsExpanded,
}: WeeklyAIReportInnerProps) {
  /* ----- 주간 데이터 생성 ----- */
  useEffect(() => {
    prepareWeeklyData();
  }, [healthLogs]);

  const getWeekNumber = (date: Date): number => {
    const first = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - first.getTime()) / 86400000;
    return Math.ceil((diff + first.getDay() + 1) / 7);
  };

  const prepareWeeklyData = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekLogs = healthLogs.filter((log) => {
      const d = new Date(log.recordedAt);
      return d >= oneWeekAgo && d <= now;
    });

    if (weekLogs.length === 0) {
      setWeeklyData(null);
      setAiAnalysis(null);
      return;
    }

    const bloodSugarLogs = weekLogs.filter(
      (log) => log.type === "blood_sugar" && log.value
    );
    const bloodSugarReadings = bloodSugarLogs.map((l) => l.value!);

    const bloodPressureLogs = weekLogs.filter(
      (log) => log.type === "blood_pressure"
    );
    const bloodPressureReadings = bloodPressureLogs.map((l) => ({
      systolic: l.systolic!,
      diastolic: l.diastolic!,
    }));

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : undefined;

    setWeeklyData({
      weekNumber: getWeekNumber(now),
      startDate: oneWeekAgo.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
      endDate: now.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
      totalRecords: weekLogs.length,
      avgBloodSugar: avg(bloodSugarReadings),
      avgSystolic: avg(bloodPressureReadings.map((b) => b.systolic)),
      avgDiastolic: avg(bloodPressureReadings.map((b) => b.diastolic)),
      bloodSugarReadings,
      bloodPressureReadings,
      recordDates: weekLogs.map((l) => l.recordedAt),
    });
  };

  /* ----- AI 자동 분석 ----- */
  useEffect(() => {
    if (
      weeklyData &&
      weeklyData.totalRecords >= 1 &&
      hasApiKey &&
      !aiAnalysis &&
      !isLoading
    ) {
      analyzeWithAI();
    }
  }, [weeklyData, hasApiKey]);

  const analyzeWithAI = async () => {
    if (!weeklyData || !hasApiKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeHealthDataWithAI(weeklyData, userProfile);
      setAiAnalysis(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI 상태 처리 ---------------- */

  if (!hasApiKey) {
    return (
      <div className="p-6 rounded-xl border border-purple-200 bg-purple-50/40">
        <SectionHeader
          icon={<Sparkles className="text-purple-600" />}
          title="AI 주간 건강 리포트"
          subtitle="OpenAI API 키가 필요합니다"
        />

        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          GPT 기반 AI 분석을 사용하려면 OpenAI API 키를 등록해주세요.
        </p>

        <a
          href="https://platform.openai.com/account/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-700 underline font-medium hover:text-purple-900"
        >
          👉 OpenAI API 키 발급받기
        </a>
      </div>
    );
  }

  if (!weeklyData) {
    return (
      <>
        <SectionHeader
          icon={<Sparkles />}
          title="AI 주간 건강 리포트"
          subtitle="이번 주 기록 없음"
        />
        <p className="text-sm text-gray-600">
          이번 주에 기록된 건강 데이터가 없습니다.
        </p>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-8">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-2" />
        <p className="text-gray-600">AI 분석 중…</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <SectionHeader
          icon={<AlertCircle className="text-red-600" />}
          title="AI 분석 오류"
          subtitle="다시 시도해주세요"
        />

        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button variant="outline" className="mt-2" onClick={analyzeWithAI}>
          <RefreshCw className="w-4 h-4 mr-2" /> 다시 분석하기
        </Button>
      </>
    );
  }

  /* ----- 정상 결과 UI ----- */

  const trendInfo = getTrendInfo(aiAnalysis?.trend ?? "stable");

  return (
    <>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-purple-600" />
          AI 주간 건강 리포트
          <Badge className={trendInfo.color}>{trendInfo.text}</Badge>
        </CardTitle>

        <CardDescription className="flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4" />
          {weeklyData.startDate} - {weeklyData.endDate}
        </CardDescription>
      </CardHeader>

      {/* summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryBox label="기록 횟수" value={weeklyData.totalRecords} />

        {weeklyData.avgBloodSugar !== undefined && (
          <SummaryBox
            label="평균 혈당"
            value={weeklyData.avgBloodSugar.toFixed(0)}
            unit="mg/dL"
          />
        )}

        {weeklyData.avgSystolic !== undefined && (
          <SummaryBox
            label="평균 수축기"
            value={weeklyData.avgSystolic.toFixed(0)}
            unit="mmHg"
          />
        )}

        {weeklyData.avgDiastolic !== undefined && (
          <SummaryBox
            label="평균 이완기"
            value={weeklyData.avgDiastolic.toFixed(0)}
            unit="mmHg"
          />
        )}
      </div>

      {/* insights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">AI 조언</h4>
          <Badge>{aiAnalysis?.insights?.length ?? 0}개</Badge>
        </div>

        {aiAnalysis?.insights
          ?.slice(0, isExpanded ? aiAnalysis.insights.length : 2)
          .map((insight, idx) => (
            <InsightBox key={idx} insight={insight} />
          ))}

        {(aiAnalysis?.insights?.length ?? 0) > 2 && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => setIsExpanded((prev: boolean) => !prev)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" /> 접기
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" /> 더 보기
              </>
            )}
          </Button>
        )}
      </div>

      <Separator className="mt-3" />
      <p className="text-xs text-gray-500 mt-2">
        AI 조언은 참고용이며, 건강 관련 중요한 결정은 전문의와 상담하세요.
      </p>
    </>
  );
}

/* ---------------- 메인 Export 컴포넌트 ---------------- */

export default function WeeklyAIReport({
  healthLogs,
  userProfile,
}: {
  healthLogs: HealthLog[];
  userProfile?: UserProfile;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyHealthData | null>(null);
  const [aiAnalysis, setAiAnalysis] =
    useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey] = useState(hasOpenAIKey());

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-[260px]">
      <CardContent className="p-6 flex flex-col gap-4">
        <WeeklyAIReportInner
          healthLogs={healthLogs}
          userProfile={userProfile}
          weeklyData={weeklyData}
          setWeeklyData={setWeeklyData}
          aiAnalysis={aiAnalysis}
          setAiAnalysis={setAiAnalysis}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          error={error}
          setError={setError}
          hasApiKey={hasApiKey}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </CardContent>
    </Card>
  );
}
