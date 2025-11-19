import { useState, useEffect } from "react";
import { Activity, Droplet, Heart, Plus, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  getCurrentUserProfile, 
  getUserHealthLogs, 
  type HealthLog, 
  type User
} from "../utils/auth";
import { auth } from "../firebase";

import HealthRecordModal from "./HealthRecordModal";
import BadgeNotification from "./BadgeNotification";
import { checkAndAwardBadges, calculateConsecutiveDays, daysSinceLastRecord } from "../utils/badges";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordType, setRecordType] = useState<'blood_sugar' | 'blood_pressure'>('blood_sugar');
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthLogs();
  }, []);

  const loadHealthLogs = async () => {
    const authUser = auth.currentUser;
    if (!authUser) {
      setLoading(false);
      return; 
    }

    try {
      const [profile, logs] = await Promise.all([
        getCurrentUserProfile(authUser.uid),
        getUserHealthLogs()
      ]);

      setUser(profile);
      setHealthLogs(logs);

      if (profile && logs) {
        // 뱃지 체크
        const totalRecords = logs.length;
        const recordDates = logs.map(log => log.recordedAt);
        const consecutiveDays = calculateConsecutiveDays(recordDates);
        const daysSince = daysSinceLastRecord(recordDates);
        
        const hasBloodSugar = logs.some(log => log.type === 'blood_sugar');
        const hasBloodPressure = logs.some(log => log.type === 'blood_pressure');
        
        const earnedBadges = await checkAndAwardBadges(
          profile,
          totalRecords,
          consecutiveDays,
          hasBloodSugar,
          hasBloodPressure,
          daysSince
        );
        
        if (earnedBadges.length > 0) {
          setNewBadges(earnedBadges);
        }
      }
      
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'blood_sugar' | 'blood_pressure') => {
    setRecordType(type);
    setIsModalOpen(true);
  };

  const getLatestReading = (type: 'blood_sugar' | 'blood_pressure') => {
    const log = healthLogs.find(log => log.type === type);
    if (!log) return null;
    
    if (type === 'blood_sugar') {
      return `${log.value} mg/dL`;
    } else {
      return `${log.systolic}/${log.diastolic} mmHg`;
    }
  };

  const getTodayRecordCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return healthLogs.filter(log => 
      log.recordedAt.startsWith(today)
    ).length;
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">대시보드 로딩 중...</div>;
  }
  
  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">사용자 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 통계 */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-8">안녕하세요, {user.name}님! 👋</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/80">누적 기부금</CardDescription>
                <CardTitle className="text-3xl">₩{user.totalDonation.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Heart className="w-4 h-4" />
                  <span>매일 기록으로 생명을 살립니다</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/80">오늘 기록</CardDescription>
                <CardTitle className="text-3xl">{getTodayRecordCount()}회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Activity className="w-4 h-4" />
                  <span>꾸준한 기록이 습관을 만듭니다</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/80">전체 기록</CardDescription>
                <CardTitle className="text-3xl">{healthLogs.length}회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <TrendingUp className="w-4 h-4" />
                  <span>계속 성장 중입니다</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 건강 데이터 입력 섹션 */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
        <h2 className="text-2xl mb-6">오늘의 건강 기록</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 혈당 기록 카드 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>혈당 기록</CardTitle>
                    <CardDescription>Blood Sugar Level</CardDescription>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => openModal('blood_sugar')}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl mb-2">
                {getLatestReading('blood_sugar') || '데이터 없음'}
              </div>
              <p className="text-sm text-gray-600">
                최근 측정: {healthLogs.find(log => log.type === 'blood_sugar')
                  ? new Date(healthLogs.find(log => log.type === 'blood_sugar')!.recordedAt).toLocaleDateString()
                  : '-'}
              </p>
            </CardContent>
          </Card>

          {/* 혈압 기록 카드 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>혈압 기록</CardTitle>
                    <CardDescription>Blood Pressure</CardDescription>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => openModal('blood_pressure')}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl mb-2">
                {getLatestReading('blood_pressure') || '데이터 없음'}
              </div>
              <p className="text-sm text-gray-600">
                최근 측정: {healthLogs.find(log => log.type === 'blood_pressure')
                  ? new Date(healthLogs.find(log => log.type === 'blood_pressure')!.recordedAt).toLocaleDateString()
                  : '-'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 최근 기록 목록 */}
        <div>
          <h2 className="text-2xl mb-6">최근 기록</h2>
          {healthLogs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">아직 기록이 없습니다</p>
                <p className="text-sm text-gray-500">첫 건강 기록을 시작하고 100원을 기부하세요!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {healthLogs.slice(0, 10).map((log) => (
                <Card key={log.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        log.type === 'blood_sugar' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {log.type === 'blood_sugar' ? (
                          <Droplet className="w-5 h-5 text-red-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {log.type === 'blood_sugar' ? '혈당' : '혈압'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.recordedAt).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg">
                        {log.type === 'blood_sugar' 
                          ? `${log.value} mg/dL` 
                          : `${log.systolic}/${log.diastolic} mmHg`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 건강 기록 모달 */}
      <HealthRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recordType={recordType}
        onSuccess={loadHealthLogs}
      />

      {/* 뱃지 알림 */}
      {newBadges.length > 0 && (
        <BadgeNotification
          badgeIds={newBadges}
          onClose={() => setNewBadges([])}
        />
      )}
    </div>
  );
}