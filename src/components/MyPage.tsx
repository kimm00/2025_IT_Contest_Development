import { useState, useEffect } from "react";
import {
  Award,
  Heart,
  TrendingUp,
  Calendar,
  Key,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";

import {
  onAuthChange,
  getCurrentUserProfile,
  getUserHealthLogs,
  type User,
} from "../utils/auth";

import {
  getUserBadges,
  ALL_BADGES,
  type Badge as BadgeType,
} from "../utils/badges";

import {
  saveOpenAIKey,
  getOpenAIKey,
  removeOpenAIKey,
  hasOpenAIKey,
} from "../utils/openai";

import { toast } from "sonner";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [healthLogs, setHealthLogs] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState(getOpenAIKey() || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(!hasOpenAIKey());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setHealthLogs([]);
        setLoading(false);
        return;
      }

      try {
        setUser(currentUser);

        // 건강 기록 불러오기
        const logs = await getUserHealthLogs();
        setHealthLogs(logs);
      } catch (err) {
        console.error("Failed to load MyPage data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getMemberSince = () => {
    if (!user?.createdAt) return "";
    return new Date(user.createdAt).toLocaleDateString("ko-KR");
  };

  const getConsecutiveDays = () => {
    if (healthLogs.length === 0) return 0;

    const dates = healthLogs.map(
      (log) => new Date(log.recordedAt).toISOString().split("T")[0]
    );

    const uniqueDates = [...new Set(dates)].sort().reverse();
    let consecutive = 1;

    const today = new Date().toISOString().split("T")[0];
    if (uniqueDates[0] !== today) return 0;

    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i - 1]);
      const prev = new Date(uniqueDates[i]);
      const diffDays =
        (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) consecutive++;
      else break;
    }

    return consecutive;
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim().length === 0) {
      toast.error("API 키를 입력해주세요.");
      return;
    }
    saveOpenAIKey(apiKey);
    toast.success("API 키가 저장되었습니다.");
    setIsEditingApiKey(false);
  };

  const handleRemoveApiKey = () => {
    removeOpenAIKey();
    setApiKey("");
    setIsEditingApiKey(true);
    toast.success("API 키가 삭제되었습니다.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        마이페이지 로딩 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        로그인 후 이용 가능합니다.
      </div>
    );
  }

  const hasAngelBadge = user.totalDonation >= 10000;
  const hasChampionBadge = healthLogs.length >= 30;
  const hasDedicatedBadge = healthLogs.length >= 7;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-2">마이페이지</h1>
          <p className="text-emerald-100">나의 건강 여정과 기부 현황</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===============================
              왼쪽 패널
          =============================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* 프로필 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>프로필</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl mb-1">{user.email.split("@")[0]}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      가입일: {getMemberSince()}
                    </p>
                  </div>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">누적 기부금</span>
                    </div>
                    <p className="text-2xl">
                      ₩{user.totalDonation.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">전체 기록</span>
                    </div>
                    <p className="text-2xl">{healthLogs.length}회</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 기부 현황 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  기부 임팩트
                </CardTitle>
                <CardDescription>나의 건강 습관이 만드는 변화</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">총 기부금</p>
                    <p className="text-3xl text-emerald-700">
                      ₩{user.totalDonation.toLocaleString()}
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (user.totalDonation / 10000) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-600">
                    다음 뱃지까지{" "}
                    {hasAngelBadge
                      ? "달성!"
                      : `₩${(
                          10000 - user.totalDonation
                        ).toLocaleString()} 남음`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* API 키 설정 */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI 건강 분석 설정
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Alert className="bg-purple-50 border-purple-200">
                  <AlertDescription className="text-sm text-gray-700">
                    GPT 기반 주간 AI 건강 분석을 이용하려면 API 키가 필요합니다.
                  </AlertDescription>
                </Alert>

                {/* 입력 폼 */}
                {isEditingApiKey ? (
                  <>
                    <div className="relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveApiKey}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        저장
                      </Button>
                      {hasOpenAIKey() && (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingApiKey(false)}
                        >
                          취소
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingApiKey(true)}
                    >
                      키 변경
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600"
                      onClick={handleRemoveApiKey}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ===============================
              오른쪽: 뱃지 컬렉션
          =============================== */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  나의 뱃지 컬렉션
                </CardTitle>
                <CardDescription>
                  {getUserBadges(user.email).length}개 / {ALL_BADGES.length}개
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* 루틴 뱃지 */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700">🌟 루틴 뱃지</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_BADGES.filter((b) => b.category === "routine").map(
                        (badge) => {
                          const earned = getUserBadges(user.email).includes(
                            badge.id
                          );
                          return (
                            <div
                              key={badge.id}
                              className={`p-3 rounded-lg border-2 ${
                                earned
                                  ? badge.color
                                  : "bg-gray-50 border-gray-200 opacity-60"
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-3xl">
                                  {earned ? badge.emoji : "🔒"}
                                </div>
                                <p className="text-xs">{badge.nameKo}</p>
                                <p className="text-xs text-gray-500">
                                  {badge.condition}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* 기부 뱃지 */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700">💚 기부 뱃지</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_BADGES.filter((b) => b.category === "donation").map(
                        (badge) => {
                          const earned = getUserBadges(user.email).includes(
                            badge.id
                          );
                          return (
                            <div
                              key={badge.id}
                              className={`p-3 rounded-lg border-2 ${
                                earned
                                  ? badge.color
                                  : "bg-gray-50 border-gray-200 opacity-60"
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-3xl">
                                  {earned ? badge.emoji : "🔒"}
                                </div>
                                <p className="text-xs">{badge.nameKo}</p>
                                <p className="text-xs text-gray-500">
                                  {badge.condition}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* 도전 뱃지 */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700">🔥 도전 뱃지</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_BADGES.filter((b) => b.category === "challenge").map(
                        (badge) => {
                          const earned = getUserBadges(user.email).includes(
                            badge.id
                          );
                          return (
                            <div
                              key={badge.id}
                              className={`p-3 rounded-lg border-2 ${
                                earned
                                  ? badge.color
                                  : "bg-gray-50 border-gray-200 opacity-60"
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-3xl">
                                  {earned ? badge.emoji : "🔒"}
                                </div>
                                <p className="text-xs">{badge.nameKo}</p>
                                <p className="text-xs text-gray-500">
                                  {badge.condition}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 격려 메시지 */}
            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white">
              <CardContent className="pt-6">
                <h3 className="text-xl mb-3">계속 진행하세요! 💪</h3>
                <p className="text-emerald-100 text-sm">
                  매일의 작은 기록이 큰 변화를 만듭니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
