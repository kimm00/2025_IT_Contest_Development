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

interface WeeklyAIReportProps {
  healthLogs: HealthLog[];
}

export default function WeeklyAIReport({ healthLogs }: WeeklyAIReportProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyHealthData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(hasOpenAIKey());

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

    // 지난 7일간의 로그 필터링
    const weekLogs = healthLogs.filter((log) => {
      const logDate = new Date(log.recordedAt);
      return logDate >= oneWeekAgo && logDate <= now;
    });

    if (weekLogs.length === 0) {
      setWeeklyData(null);
      setAiAnalysis(null);
      return;
    }

    // 혈당 데이터
    const bloodSugarLogs = weekLogs.filter(
      (log) => log.type === "blood_sugar" && log.value
    );
    const bloodSugarReadings = bloodSugarLogs.map((log) => log.value!);
    const avgBloodSugar =
      bloodSugarReadings.length > 0
        ? bloodSugarReadings.reduce((sum, val) => sum + val, 0) /
          bloodSugarReadings.length
        : undefined;

    // 혈압 데이터
    const bloodPressureLogs = weekLogs.filter(
      (log) => log.type === "blood_pressure"
    );
    const bloodPressureReadings = bloodPressureLogs.map((log) => ({
      systolic: log.systolic!,
      diastolic: log.diastolic!,
    }));
    const avgSystolic =
      bloodPressureReadings.length > 0
        ? bloodPressureReadings.reduce((sum, r) => sum + r.systolic, 0) /
          bloodPressureReadings.length
        : undefined;
    const avgDiastolic =
      bloodPressureReadings.length > 0
        ? bloodPressureReadings.reduce((sum, r) => sum + r.diastolic, 0) /
          bloodPressureReadings.length
        : undefined;

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
      avgBloodSugar,
      avgSystolic,
      avgDiastolic,
      bloodSugarReadings,
      bloodPressureReadings,
      recordDates: weekLogs.map((log) => log.recordedAt),
    });
  };

  const analyzeWithAI = async () => {
    if (!weeklyData) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeHealthDataWithAI(weeklyData);
      setAiAnalysis(analysis);
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("AI 분석 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "exercise":
        return <Footprints className="w-5 h-5" />;
      case "diet":
        return <Apple className="w-5 h-5" />;
      case "stress":
        return <Brain className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-emerald-200 bg-emerald-50";
    }
  };

  const getTrendInfo = (trend: string) => {
    switch (trend) {
      case "improving":
        return {
          icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
          text: "개선 중",
          color: "text-emerald-700 bg-emerald-100",
        };
      case "needs_attention":
        return {
          icon: <TrendingDown className="w-5 h-5 text-red-600" />,
          text: "주의 필요",
          color: "text-red-700 bg-red-100",
        };
      default:
        return {
          icon: <Activity className="w-5 h-5 text-blue-600" />,
          text: "안정적",
          color: "text-blue-700 bg-blue-100",
        };
    }
  };

  // API 키 없을 때
  if (!hasApiKey) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900">AI 주간 건강 리포트</h3>
              <p className="text-sm text-gray-600">OpenAI 연동 필요</p>
            </div>
          </div>

          <Alert className="mb-4">
            <Key className="h-4 w-4" />
            <AlertDescription>
              AI 건강 분석을 사용하려면 OpenAI API 키가 필요합니다.
              <br />
              마이페이지에서 API 키를 설정해주세요.
            </AlertDescription>
          </Alert>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => (window.location.hash = "#mypage")}
          >
            <Key className="w-4 h-4 mr-2" />
            API 키 설정하러 가기
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 데이터 부족
  if (!weeklyData || weeklyData.totalRecords === 0) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900">AI 주간 건강 리포트</h3>
              <p className="text-sm text-gray-600">
                데이터를 수집하는 중입니다
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            이번 주 건강 기록이 없습니다. 데이터를 기록하시면 GPT-4가 맞춤
            분석을 제공해드립니다! 📊
          </p>
        </CardContent>
      </Card>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            <div className="text-center">
              <h3 className="text-gray-900 mb-2">
                AI가 건강 데이터를 분석하고 있습니다...
              </h3>
              <p className="text-sm text-gray-600">
                GPT-4가 여러분의 건강 추이를 분석하고 맞춤형 조언을 생성
                중입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-gray-900">AI 분석 오류</h3>
              <p className="text-sm text-gray-600">
                분석 중 문제가 발생했습니다
              </p>
            </div>
          </div>

          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setError(null);
                analyzeWithAI();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => (window.location.hash = "#mypage")}
            >
              <Key className="w-4 h-4 mr-2" />
              API 키 확인
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // AI 분석 결과 표시
  if (!aiAnalysis) return null;

  const trendInfo = getTrendInfo(aiAnalysis.trend);

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 flex-wrap">
                AI 주간 건강 리포트
                <Badge className={trendInfo.color}>
                  {trendInfo.icon}
                  <span className="ml-1">{trendInfo.text}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="text-purple-700 border-purple-300"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  GPT-4 분석
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {weeklyData.startDate} - {weeklyData.endDate} (Week{" "}
                {weeklyData.weekNumber})
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-700 hover:bg-purple-100"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="text-xs text-gray-500 mb-1">기록 횟수</div>
            <div className="text-xl text-purple-700">
              {weeklyData.totalRecords}회
            </div>
          </div>
          {weeklyData.avgBloodSugar && (
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="text-xs text-gray-500 mb-1">평균 혈당</div>
              <div className="text-xl text-purple-700">
                {weeklyData.avgBloodSugar.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">mg/dL</div>
            </div>
          )}
          {weeklyData.avgSystolic && weeklyData.avgDiastolic && (
            <>
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-gray-500 mb-1">평균 수축기</div>
                <div className="text-xl text-purple-700">
                  {weeklyData.avgSystolic.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">mmHg</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-gray-500 mb-1">평균 이완기</div>
                <div className="text-xl text-purple-700">
                  {weeklyData.avgDiastolic.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">mmHg</div>
              </div>
            </>
          )}
        </div>

        {/* Trend Reason */}
        {aiAnalysis.trendReason && (
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              {trendInfo.icon}
              <div>
                <h5 className="text-gray-900 mb-1">추세 분석</h5>
                <p className="text-sm text-gray-700">
                  {aiAnalysis.trendReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border border-purple-200">
          <p className="text-gray-800 text-center">
            💜 {aiAnalysis.encouragement}
          </p>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-900">🤖 AI 맞춤 조언</h4>
            <Badge
              variant="outline"
              className="text-purple-700 border-purple-300"
            >
              {aiAnalysis.insights.length}개의 인사이트
            </Badge>
          </div>

          {aiAnalysis.insights
            .slice(0, isExpanded ? aiAnalysis.insights.length : 2)
            .map((insight, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 border-2 ${getPriorityColor(
                  insight.priority
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIconComponent(insight.icon)}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-gray-900 mb-1">{insight.title}</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!isExpanded && aiAnalysis.insights.length > 2 && (
          <Button
            variant="outline"
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
            onClick={() => setIsExpanded(true)}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            {aiAnalysis.insights.length - 2}개 조언 더 보기
          </Button>
        )}

        {/* Key Recommendations */}
        {isExpanded &&
          aiAnalysis.keyRecommendations &&
          aiAnalysis.keyRecommendations.length > 0 && (
            <>
              <Separator />
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <h5 className="text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  핵심 실천 사항
                </h5>
                <ul className="space-y-2">
                  {aiAnalysis.keyRecommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-indigo-600 mt-0.5">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

        <Separator />

        {/* Footer */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              <Sparkles className="w-3 h-3 inline mr-1" />
              이 리포트는 OpenAI GPT-4가 여러분의 건강 데이터를 분석하여
              제공하는 맞춤형 조언입니다.
              <br />
              중요한 건강 결정은 반드시 전문의와 상담하세요.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAiAnalysis(null);
              analyzeWithAI();
            }}
            className="text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
