import { useEffect, useState } from "react";
import { Activity, Calendar, Droplet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUserHealthLogs, type HealthLog } from "../utils/auth";
import { toast } from "sonner";

export default function HealthReport() {
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const logs = await getUserHealthLogs();
        setHealthLogs(logs);
      } catch (error) {
        console.error("Failed to load health reports:", error);
        toast.error("리포트 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    loadLogs();
  }, []);

  const getFilteredLogs = () => {
    const now = new Date();
    let cutoffDate = new Date();

    if (selectedPeriod === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      cutoffDate.setDate(now.getDate() - 30);
    } else {
      cutoffDate = new Date(0); // All time
    }

    return healthLogs.filter(log => new Date(log.recordedAt) >= cutoffDate);
  };

  const getChartData = (type: 'blood_sugar' | 'blood_pressure') => {
    const filtered = getFilteredLogs()
      .filter(log => log.type === type)
      .reverse(); // Oldest first for chart

    return filtered.map(log => ({
      date: new Date(log.recordedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      value: type === 'blood_sugar' ? log.value : log.systolic,
      diastolic: type === 'blood_pressure' ? log.diastolic : undefined,
    }));
  };

  const getAverageValue = (type: 'blood_sugar' | 'blood_pressure') => {
    const filtered = getFilteredLogs().filter(log => log.type === type);
    if (filtered.length === 0) return 0;

    if (type === 'blood_sugar') {
      const sum = filtered.reduce((acc, log) => acc + (log.value || 0), 0);
      return Math.round(sum / filtered.length);
    } else {
      const systolicSum = filtered.reduce((acc, log) => acc + (log.systolic || 0), 0);
      const diastolicSum = filtered.reduce((acc, log) => acc + (log.diastolic || 0), 0);
      const avgSystolic = Math.round(systolicSum / filtered.length);
      const avgDiastolic = Math.round(diastolicSum / filtered.length);
      return `${avgSystolic}/${avgDiastolic}`;
    }
  };

  const bloodSugarData = getChartData('blood_sugar');
  const bloodPressureData = getChartData('blood_pressure');

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">리포트 로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-2">건강 리포트 📊</h1>
          <p className="text-emerald-100">나의 건강 데이터를 한눈에 확인하세요</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
        {/* 기간 선택 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            최근 7일
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            최근 30일
          </button>
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>평균 혈당</CardDescription>
                <Droplet className="w-5 h-5 text-red-600" />
              </div>
              <CardTitle className="text-3xl">
                {getAverageValue('blood_sugar') || '-'} 
                {getAverageValue('blood_sugar') ? ' mg/dL' : ''}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>평균 혈압</CardDescription>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-3xl">
                {getAverageValue('blood_pressure') || '-'}
                {getAverageValue('blood_pressure') !== '0/0' && getAverageValue('blood_pressure') !== 0 ? ' mmHg' : ''}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>기록 횟수</CardDescription>
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl">{getFilteredLogs().length}회</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 혈당 그래프 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-600" />
              혈당 추이
            </CardTitle>
            <CardDescription>시간에 따른 혈당 수치 변화</CardDescription>
          </CardHeader>
          <CardContent>
            {bloodSugarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bloodSugarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    name="혈당 (mg/dL)"
                    dot={{ fill: '#dc2626', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                혈당 기록이 없습니다
              </div>
            )}
          </CardContent>
        </Card>

        {/* 혈압 그래프 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              혈압 추이
            </CardTitle>
            <CardDescription>시간에 따른 혈압 변화</CardDescription>
          </CardHeader>
          <CardContent>
            {bloodPressureData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="수축기 (mmHg)"
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    name="이완기 (mmHg)"
                    dot={{ fill: '#06b6d4', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                혈압 기록이 없습니다
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}