import { useState, useEffect } from "react";
import {
  Award,
  Heart,
  TrendingUp,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  User as UserIcon,
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

import {
  onAuthChange,
  getUserHealthLogs,
  type User,
  type HealthLog,
} from "../utils/auth";

import { ALL_BADGES } from "../utils/badges";

import {
  saveOpenAIKey,
  getOpenAIKey,
  removeOpenAIKey,
  hasOpenAIKey,
} from "../utils/openai";

import { toast } from "sonner";
import MyPageProfileDialog from "./MyPageProfileDialog"; // ✅ 프로필 수정 모달

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);

  // 🔑 API 키 관련 상태 (예전 스타일로 복원)
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(!hasOpenAIKey());
  const [savedKey, setSavedKey] = useState(getOpenAIKey() || "");
  const [tempKey, setTempKey] = useState(savedKey);

  const [loading, setLoading] = useState(true);

  // ✅ 프로필 수정 모달 열림 상태
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // Firebase Auth + Firestore 프로필 구독
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setHealthLogs([]);
        setLoading(false);
        return;
      }

      try {
        setUser(currentUser);

        // 현재 로그인 사용자 건강 기록 가져오기
        const logs = await getUserHealthLogs();
        setHealthLogs(logs);
      } catch (err) {
        console.error("Failed to load MyPage:", err);
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

  // 🔑 저장 버튼
  const handleSaveApiKey = () => {
    if (tempKey.trim().length === 0) {
      toast.error("API 키를 입력해주세요.");
      return;
    }

    saveOpenAIKey(tempKey);
    setSavedKey(tempKey);
    setIsEditingApiKey(false);
    toast.success("API 키가 저장되었습니다.");
  };

  // 🔑 취소 버튼
  const handleCancelEdit = () => {
    setTempKey(savedKey); // 원래 값으로 복귀
    setIsEditingApiKey(false);
  };

  // 🔑 삭제 버튼
  const handleRemoveApiKey = () => {
    removeOpenAIKey();
    setSavedKey("");
    setTempKey("");
    setIsEditingApiKey(true);
    toast.success("API 키가 삭제되었습니다.");
  };

  // ✅ 프로필 수정 다이얼로그에서 저장 후 호출
  const handleProfileUpdated = () => {
    toast.success("프로필이 업데이트되었습니다.");
  };

  const getBMI = () => {
    const height = user?.profile?.height;
    const weight = user?.profile?.weight;
    if (height && weight) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMIStatus = () => {
    const bmi = getBMI();
    if (!bmi) return null;
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { text: "저체중", color: "text-blue-600" };
    if (bmiNum < 23) return { text: "정상", color: "text-green-600" };
    if (bmiNum < 25) return { text: "과체중", color: "text-yellow-600" };
    return { text: "비만", color: "text-red-600" };
  };

  const getGenderText = (gender?: string) => {
    if (gender === "male") return "남성";
    if (gender === "female") return "여성";
    return "미설정";
  };

  const getConditionsText = (conditions?: string[]) => {
    if (!conditions || conditions.length === 0) return "미설정";
    if (conditions.includes("none")) return "없음 (예방 목적)";
    const labels: Record<string, string> = {
      diabetes: "당뇨병",
      hypertension: "고혈압",
      hyperlipidemia: "고지혈증",
    };
    return conditions.map((c) => labels[c] || c).join(", ");
  };

  const getConsecutiveDays = () => {
    if (healthLogs.length === 0) return 0;

    const dates = healthLogs.map((log) =>
      new Date(log.recordedAt).toISOString().split("T")[0]
    );
    const uniqueDates = [...new Set(dates)].sort().reverse();

    let consecutive = 1;
    const today = new Date().toISOString().split("T")[0];

    if (uniqueDates[0] !== today) return 0;

    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i - 1]);
      const prev = new Date(uniqueDates[i]);
      const diffDays = Math.round(
        (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
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

  const userBadges = user.badges ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 상단 헤더 */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-2 font-bold">마이페이지</h1>
          <p className="text-emerald-100">나의 건강 여정과 기부 현황</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 2칸: 프로필 + 기부 임팩트 + AI 설정 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 프로필 카드 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>프로필</CardTitle>

                  <MyPageProfileDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onUpdate={handleProfileUpdated}
                  />
                </div>
              </CardHeader>

              <CardContent>
                {/* 기본 정보 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {user.name || user.email.split("@")[0]}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      가입일: {getMemberSince()}
                    </p>
                  </div>
                </div>

                {/* ProfileSetupPage에서 저장한 정보가 있을 때만 상세 프로필 표시 */}
                {user.profile?.completedAt ? (
                  <div className="space-y-4 mb-6">
                    {/* 나이/성별/키/체중 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">나이</p>
                        <p className="text-lg">
                          {user.profile.age !== undefined
                            ? `${user.profile.age}세`
                            : "-"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">성별</p>
                        <p className="text-lg">
                          {getGenderText(user.profile.gender)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">키</p>
                        <p className="text-lg">
                          {user.profile.height
                            ? `${user.profile.height}cm`
                            : "-"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">체중</p>
                        <p className="text-lg">
                          {user.profile.weight
                            ? `${user.profile.weight}kg`
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {/* BMI 카드 */}
                    {getBMI() && (
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              체질량지수 (BMI)
                            </p>
                            <p className="text-xl">
                              {getBMI()}{" "}
                              {getBMIStatus() && (
                                <span
                                  className={`text-base ${
                                    getBMIStatus()?.color
                                  }`}
                                >
                                  ({getBMIStatus()?.text})
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              💡 BMI는 당뇨/고혈압 위험도의 핵심 지표입니다
                            </p>
                          </div>
                          <UserIcon className="w-8 h-8 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {/* 질환/혈압/당화혈색소 */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-gray-600 min-w-24">
                          관리 질환:
                        </span>
                        <span className="text-sm">
                          {getConditionsText(user.profile.conditions)}
                        </span>
                      </div>
                      {user.profile.hba1c !== undefined && (
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 min-w-24">
                            당화혈색소:
                          </span>
                          <span className="text-sm">
                            {user.profile.hba1c}%
                          </span>
                        </div>
                      )}
                      {user.profile.systolicBP !== undefined &&
                        user.profile.diastolicBP !== undefined && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-gray-600 min-w-24">
                              평소 혈압:
                            </span>
                            <span className="text-sm">
                              {user.profile.systolicBP}/
                              {user.profile.diastolicBP} mmHg
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-800 mb-2">
                      🎯 프로필을 완성하고 맞춤 건강 관리를 시작하세요!
                    </p>
                    <p className="text-xs text-blue-700 mb-3">
                      프로필 정보를 입력하면 맞춤형 건강 리포트를 받아볼 수
                      있습니다.
                    </p>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setEditDialogOpen(true)}
                    >
                      프로필 작성하기
                    </Button>
                  </div>
                )}

                {/* 누적 기부금 / 전체 기록 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">누적 기부금</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      ₩{user.totalDonation.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">전체 기록</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      {healthLogs.length}회
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 기부 임팩트 */}
            <Card className="border rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  기부 임팩트
                </CardTitle>
                <CardDescription className="text-gray-600">
                  나의 건강 습관이 만드는 변화
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-600">총 기부금</p>
                      <p className="text-4xl font-semibold text-emerald-700">
                        ₩{user.totalDonation.toLocaleString()}
                      </p>
                    </div>

                    <Heart className="w-12 h-12 text-emerald-600 stroke-[1.5]" />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>다음 뱃지까지</span>
                      <span className="text-emerald-700 font-medium">
                        {user.totalDonation >= 10000
                          ? "달성! 🎉"
                          : `₩${(
                              10000 - user.totalDonation
                            ).toLocaleString()} 남음`}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (user.totalDonation / 10000) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-200">
                    <p className="text-sm text-gray-800 mb-1 font-medium">
                      💡 알고 계셨나요?
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      나의 기부금으로 다른 환우분들이 건강 관리에 필요한 혈당
                      측정기, 혈압계 등을 지원받을 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">연속 기록</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      {getConsecutiveDays()}일
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">획득 뱃지</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      {userBadges.length}개
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API 키 안내 텍스트 */}
            <div className="mt-4 text-xs text-gray-600 leading-relaxed bg-gray-100 p-3 rounded-lg">
              <strong>🔑 OpenAI API 키가 필요합니다.</strong>
              <br />
              AI 건강 분석 기능을 사용하려면 OpenAI API 키를 등록해야 합니다.
              <br />
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                className="text-blue-700 font-semibold underline text-sm md:text-base hover:text-blue-800 transition-colors"
                rel="noreferrer"
              >
                👉 API 키 발급받기 (OpenAI 공식 사이트)
              </a>
              <br />
              분석 1회 비용은 약 <strong>$0.03 ~ $0.08</strong> 정도로 매우
              저렴합니다.
            </div>

            {/* AI 건강 분석 설정 카드 */}
            <Card className="p-6 border-2 border-purple-200 bg-purple-50/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI 건강 분석 설정
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  OpenAI API를 연결하여 주간 AI 건강 리포트를 받아보세요.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  GPT-4가 건강 기록을 분석하고 맞춤형 조언을 제공합니다. API
                  키는 브라우저(localStorage)에만 저장됩니다.
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">상태:</span>
                  <Badge
                    className={
                      hasOpenAIKey()
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-300 text-black"
                    }
                  >
                    {hasOpenAIKey() ? "연결됨" : "미연결"}
                  </Badge>
                </div>

                {/* 🔑 API Key 입력 / 저장 UI (저장 버튼 포함) */}
                {isEditingApiKey ? (
                  <>
                    {/* 입력 + 눈 버튼 */}
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-1">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={tempKey}
                          onChange={(e) => setTempKey(e.target.value)}
                          placeholder="sk-..."
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-3 shrink-0"
                      >
                        {showApiKey ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>

                    {/* 저장 + 취소 */}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={handleSaveApiKey}
                        className="px-3 py-3 font-semibold"
                      >
                        저장
                      </Button>
                      {hasOpenAIKey() && (
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="px-3 py-3 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
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
                      className="text-red-600 hover:bg-red-50"
                      onClick={handleRemoveApiKey}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽 뱃지 컬렉션 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  나의 뱃지 컬렉션
                </CardTitle>
                <CardDescription>
                  {userBadges.length}개 / {ALL_BADGES.length}개
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {["routine", "donation", "challenge"].map((category) => (
                    <div key={category}>
                      <h4 className="text-sm mb-3 text-gray-700">
                        {category === "routine"
                          ? "🌟 루틴 뱃지"
                          : category === "donation"
                          ? "💚 기부 뱃지"
                          : "🔥 도전 뱃지"}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ALL_BADGES.filter(
                          (b) => b.category === category
                        ).map((badge) => {
                          const earned = userBadges.includes(badge.id);
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
                                <p className="text-xs mt-1 font-medium">
                                  {badge.nameKo}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {badge.condition}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}