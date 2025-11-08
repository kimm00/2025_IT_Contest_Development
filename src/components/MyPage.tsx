import { useState, useEffect } from "react";
import { Award, Heart, TrendingUp, Calendar, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { getUserHealthLogs, type HealthLog } from "../utils/auth";
import { useAuth } from "../context/AuthContext"; 
import { ALL_BADGES, calculateConsecutiveDays, type Badge as BadgeType } from "../utils/badges";

export default function MyPage() {
  const { user } = useAuth();
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadLogs = async () => {
      setLoading(true);
      try {
        const logs = await getUserHealthLogs();
        setHealthLogs(logs);
      } catch (error) {
        console.error("Failed to load health logs for MyPage:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLogs();
  }, [user]);

  const userBadges = user?.badges || [];

  const consecutiveDays = calculateConsecutiveDays(healthLogs.map(log => log.recordedAt));
  
  const getMemberSince = () => {
    if (!user?.createdAt) return '';
    return new Date(user.createdAt).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">마이페이지 로딩 중...</div>;
  }
  
  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-2">마이페이지</h1>
          <p className="text-emerald-100">나의 건강 여정과 기부 현황</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 프로필 & 통계 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 프로필 카드 */}
            <Card>
              <CardHeader>
                <CardTitle>프로필</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">가입일: {getMemberSince()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">누적 기부금</span>
                    </div>
                    <p className="text-2xl">₩{user.totalDonation.toLocaleString()}</p>
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
                <CardDescription>
                  나의 건강 습관이 만드는 변화
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 기부금</p>
                      <p className="text-3xl text-emerald-700">₩{user.totalDonation.toLocaleString()}</p>
                    </div>
                    <Heart className="w-12 h-12 text-emerald-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">다음 뱃지 (5,000원)</span>
                        <span className="text-emerald-700">
                          {userBadges.includes('giving_spirit')
                            ? '달성! 🎉' 
                            : `₩${(5000 - user.totalDonation).toLocaleString()} 남음`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((user.totalDonation / 5000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-emerald-200">
                      <p className="text-sm text-gray-700 mb-2">
                        💡 <strong>알고 계셨나요?</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        나의 기부금으로 다른 환우분들이 건강 관리에 필요한 
                        혈당 측정기, 혈압계 등을 지원받을 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">연속 기록</span>
                    </div>
                    <p className="text-2xl">{consecutiveDays}일</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">획득 뱃지</span>
                    </div>
                    <p className="text-2xl">
                      {userBadges.length}개
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 뱃지 갤러리 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  나의 뱃지 컬렉션
                </CardTitle>
                <CardDescription>
                  {`${userBadges.length}개 / ${ALL_BADGES.length}개 달성`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 루틴/습관 뱃지 */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700 flex items-center gap-2">
                      <span>🌟</span> 루틴 / 습관 뱃지
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_BADGES.filter(b => b.category === 'routine').map(badge => {
                        const earned = userBadges.includes(badge.id);
                        return (
                          <div
                            key={badge.id}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              earned
                                ? badge.color + ' shadow-sm'
                                : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-1">
                                {earned ? badge.emoji : '🔒'}
                              </div>
                              <p className="text-xs mb-1">{badge.nameKo}</p>
                              <p className="text-xs text-gray-500 leading-tight">
                                {badge.condition}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 기부/선행 뱃지 */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700 flex items-center gap-2">
                      <span>💚</span> 기부 / 선행 뱃지
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_BADGES.filter(b => b.category === 'donation').map(badge => {
                        const earned = userBadges.includes(badge.id);
                        return (
                          <div
                            key={badge.id}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              earned
                                ? badge.color + ' shadow-sm'
                                : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-1">
                                {earned ? badge.emoji : '🔒'}
                              </div>
                              <p className="text-xs mb-1">{badge.nameKo}</p>
                              <p className="text-xs text-gray-500 leading-tight">
                                {badge.condition}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 도전/성장 뱃지 */}
                  <div>
                    <h4 className="text-sm mb-3 text-gray-700 flex items-center gap-2">
                      <span>🔥</span> 도전 / 성장 뱃지
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_BADGES.filter(b => b.category === 'challenge').map(badge => {
                        const earned = userBadges.includes(badge.id);
                        return (
                          <div
                            key={badge.id}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              earned
                                ? badge.color + ' shadow-sm'
                                : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-1">
                                {earned ? badge.emoji : '🔒'}
                              </div>
                              <p className="text-xs mb-1">{badge.nameKo}</p>
                              <p className="text-xs text-gray-500 leading-tight">
                                {badge.condition}
                              </p>
                            </div>
                          </div>
                        );
                      })}
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
                  매일의 작은 기록이 모여 큰 변화를 만듭니다. 
                  나의 건강을 지키는 동시에 다른 이들을 돕는 여정을 계속해보세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}