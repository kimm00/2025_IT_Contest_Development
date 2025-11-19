import { useState, useEffect } from "react";
import { Activity, Droplet, Heart, Plus, TrendingUp } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  onAuthChange,
  getUserHealthLogs,
  type HealthLog,
  type User,
} from "../utils/auth";

import HealthRecordModal from "./HealthRecordModal";
import BadgeNotification from "./BadgeNotification";
import WeeklyAIReport from "./WeeklyAIReport";

import {
  checkAndAwardBadges,
  calculateConsecutiveDays,
  daysSinceLastRecord,
} from "../utils/badges";

export default function Dashboard() {
  // Firebase user 객체
  const [user, setUser] = useState<User | null>(null);

  // 건강 기록
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordType, setRecordType] = useState<
    "blood_sugar" | "blood_pressure"
  >("blood_sugar");

  // 새로운 뱃지
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setHealthLogs([]);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // 건강 기록 가져오기
      const logs = await getUserHealthLogs();
      setHealthLogs(logs);

      // 뱃지 체크
      awardBadges(currentUser, logs);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const awardBadges = async (user: User, logs: HealthLog[]) => {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);
    const freshUser = userSnap.data() as User;
    const recordDates = logs.map((l) => l.recordedAt);
    const totalRecords = logs.length;
    const consecutiveDays = calculateConsecutiveDays(recordDates);
    const daysSince = daysSinceLastRecord(recordDates);

    const hasBloodSugar = logs.some((l) => l.type === "blood_sugar");
    const hasBloodPressure = logs.some((l) => l.type === "blood_pressure");

    const earned = await checkAndAwardBadges(
      freshUser,
      totalRecords,
      consecutiveDays,
      hasBloodSugar,
      hasBloodPressure,
      daysSince
    );

    if (earned && earned.length > 0) {
      setNewBadges(earned);
    }
  };

  const getLatestReading = (type: "blood_sugar" | "blood_pressure") => {
    const log = healthLogs.find((l) => l.type === type);
    if (!log) return null;

    return type === "blood_sugar"
      ? `${log.value} mg/dL`
      : `${log.systolic}/${log.diastolic} mmHg`;
  };

  const getTodayRecordCount = () => {
    const today = new Date().toISOString().split("T")[0];
    return healthLogs.filter((log) => log.recordedAt.startsWith(today)).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        대시보드 로딩 중...
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-8">
            안녕하세요, {user.email.split("@")[0]}님! 👋
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 누적 기부금 */}
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <CardDescription className="text-white/80">
                  누적 기부금
                </CardDescription>
                <CardTitle className="text-3xl">
                  ₩{user.totalDonation.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* 오늘 기록 */}
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <CardDescription className="text-white/80">
                  오늘 기록
                </CardDescription>
                <CardTitle className="text-3xl">
                  {getTodayRecordCount()}회
                </CardTitle>
              </CardHeader>
            </Card>

            {/* 전체 기록 */}
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <CardDescription className="text-white/80">
                  전체 기록
                </CardDescription>
                <CardTitle className="text-3xl">
                  {healthLogs.length}회
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* 건강 기록 입력 */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
        <h2 className="text-2xl mb-6">오늘의 건강 기록</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 혈당 */}
          <Card className="hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>혈당 기록</CardTitle>
                    <CardDescription>Blood Sugar</CardDescription>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setRecordType("blood_sugar");
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl mb-2">
                {getLatestReading("blood_sugar") || "데이터 없음"}
              </div>
            </CardContent>
          </Card>

          {/* 혈압 */}
          <Card className="hover:shadow-lg">
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
                  onClick={() => {
                    setRecordType("blood_pressure");
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl mb-2">
                {getLatestReading("blood_pressure") || "데이터 없음"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 주간 AI 리포트 */}
        <div className="mb-12">
          <WeeklyAIReport healthLogs={healthLogs} />
        </div>

        {/* 최근 기록 */}
        <div>
          <h2 className="text-2xl mb-6">최근 기록</h2>
          {healthLogs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>아직 기록이 없습니다.</p>
                <p className="text-sm text-gray-500">
                  첫 기록을 저장하면 100원이 기부됩니다!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {healthLogs.slice(0, 10).map((log) => (
                <Card key={log.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.type === "blood_sugar"
                            ? "bg-red-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {log.type === "blood_sugar" ? (
                          <Droplet className="w-5 h-5 text-red-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-600" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium">
                          {log.type === "blood_sugar" ? "혈당" : "혈압"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.recordedAt).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg">
                      {log.type === "blood_sugar"
                        ? `${log.value} mg/dL`
                        : `${log.systolic}/${log.diastolic} mmHg`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      <HealthRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recordType={recordType}
        onSuccess={async () => {
          const logs = await getUserHealthLogs();
          setHealthLogs(logs);
          if (user) awardBadges(user, logs);
        }}
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
