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
  TrendingUp,
  TrendingDown,
  Activity,
  Apple,
  Footprints,
  Brain,
  ChevronDown,
  ChevronUp,
  Calendar,
  Loader2,
  AlertCircle,
  Key,
  RefreshCw,
} from "lucide-react";

import { type HealthLog } from "../utils/auth";
import {
  analyzeHealthDataWithAI,
  hasOpenAIKey,
  getErrorMessage,
  type AIAnalysis,
} from "../utils/openai";

function SectionHeader({ icon, title, subtitle }) {
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

function SummaryBox({ label, value, unit }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-purple-100">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl text-purple-700">{value}</div>
      {unit && <div className="text-xs text-gray-500">{unit}</div>}
    </div>
  );
}

function InsightBox({ insight }) {
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

function WeeklyAIReportInner({
  healthLogs,
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
  /* ----- 데이터 준비 ----- */
  useEffect(() => {
    prepareWeeklyData();
  }, [healthLogs]);

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

    const avg = (arr) =>
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

  const analyzeWithAI = async () => {
    if (!weeklyData) return;
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeHealthDataWithAI(weeklyData);
      setAiAnalysis(analysis);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekNumber = (date: Date): number => {
    const first = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - first.getTime()) / 86400000;
    return Math.ceil((diff + first.getDay() + 1) / 7);
  };

  /* ------------------- 상태별 UI ------------------- */

  if (!hasApiKey) {
    return (
      <>
        <SectionHeader
          icon={<Sparkles />}
          title="AI 주간 건강 리포트"
          subtitle="OpenAI API 필요"
        />
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            마이페이지에서 API 키를 설정해주세요.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (!weeklyData) {
    return (
      <>
        <SectionHeader
          icon={<Sparkles />}
          title="AI 주간 건강 리포트"
          subtitle="기록 없음"
        />
        <p className="text-sm text-gray-600">이번 주 기록이 없습니다.</p>
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
          icon={<AlertCircle />}
          title="AI 분석 오류"
          subtitle="다시 시도해주세요"
        />

        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button variant="outline" className="mt-2" onClick={analyzeWithAI}>
          <RefreshCw className="w-4 h-4 mr-2" /> 재시도
        </Button>
      </>
    );
  }

  /* ----- 정상 --- */

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

        {weeklyData?.avgSystolic !== undefined && (
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

      {/* 인사이트 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">AI 조언</h4>
          <Badge>{aiAnalysis?.insights?.length ?? 0}개</Badge>
        </div>

        {aiAnalysis?.insights
          ?.slice(0, isExpanded ? aiAnalysis?.insights?.length ?? 0 : 2)
          .map((i, idx) => (
            <InsightBox key={idx} insight={i} />
          ))}

        {!isExpanded && (aiAnalysis?.insights?.length ?? 0) > 2 && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => setIsExpanded(true)}
          >
            <ChevronDown className="w-4 h-4 mr-2" /> 더 보기
          </Button>
        )}
      </div>

      <Separator className="mt-3" />
      <p className="text-xs text-gray-500 mt-2">
        AI 조언은 참고용이며, 중요한 건강 결정은 전문의와 상담하세요.
      </p>
    </>
  );
}

export default function WeeklyAIReport({
  healthLogs,
}: {
  healthLogs: HealthLog[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyHealthData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey] = useState(hasOpenAIKey());

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-[260px]">
      <CardContent className="p-6 flex flex-col gap-4">
        <WeeklyAIReportInner
          healthLogs={healthLogs}
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
