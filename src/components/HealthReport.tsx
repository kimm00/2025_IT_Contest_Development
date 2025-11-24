import { useEffect, useState } from "react";
import { Activity, Calendar, Droplet, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { getUserHealthLogs, type HealthLog } from "../utils/auth";
import { toast } from "sonner";

export default function HealthReport() {
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);

  // Firebase 데이터 비동기 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const logs = await getUserHealthLogs();
        setHealthLogs(logs);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        toast.error("건강 기록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  // 시간대별 혈당 데이터
  const getBloodSugarByTime = (timeType: string) => {
    const filtered = getFilteredLogs()
      .filter(log => log.type === 'blood_sugar' && log.measuredTime === timeType)
      .reverse(); // Oldest first

    // 날짜별로 그룹화 (같은 날에 여러 번 측정한 경우 평균)
    const grouped: Record<string, { sum: number; count: number }> = {};
    
    filtered.forEach(log => {
      const date = new Date(log.recordedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      if (!grouped[date]) {
        grouped[date] = { sum: 0, count: 0 };
      }
      grouped[date].sum += log.value || 0;
      grouped[date].count += 1;
    });

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      value: Math.round(data.sum / data.count),
    }));
  };

  // 통합 혈당 데이터 (모든 시간대를 하나의 그래프에)
  const getCombinedBloodSugarData = () => {
    const allDates = new Set<string>();
    const timeTypes = ['fasting', 'breakfast_after', 'lunch_after', 'dinner_after', 'bedtime'];
    
    // 모든 날짜 수집
    getFilteredLogs()
      .filter(log => log.type === 'blood_sugar')
      .forEach(log => {
        const date = new Date(log.recordedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        allDates.add(date);
      });

    // 날짜별로 각 시간대의 데이터 구성
    const dateArray = Array.from(allDates).sort((a, b) => {
      const dateA = new Date(a.replace(/\. /g, '/').replace('.', ''));
      const dateB = new Date(b.replace(/\. /g, '/').replace('.', ''));
      return dateA.getTime() - dateB.getTime();
    });

    return dateArray.map(date => {
      const dataPoint: any = { date };
      
      timeTypes.forEach(timeType => {
        const timeData = getBloodSugarByTime(timeType);
        const found = timeData.find(d => d.date === date);
        if (found) {
          dataPoint[timeType] = found.value;
        }
      });
      
      return dataPoint;
    });
  };

  // 시간대별 혈압 데이터
  const getBloodPressureByTime = (timeType: string) => {
    const filtered = getFilteredLogs()
      .filter(log => log.type === 'blood_pressure' && log.measuredTime === timeType)
      .reverse();

    // 날짜별로 그룹화
    const grouped: Record<string, { systolicSum: number; diastolicSum: number; count: number }> = {};
    
    filtered.forEach(log => {
      const date = new Date(log.recordedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      if (!grouped[date]) {
        grouped[date] = { systolicSum: 0, diastolicSum: 0, count: 0 };
      }
      grouped[date].systolicSum += log.systolic || 0;
      grouped[date].diastolicSum += log.diastolic || 0;
      grouped[date].count += 1;
    });

    return Object.entries(grouped).map(([date, data]) => ({
      date,
      systolic: Math.round(data.systolicSum / data.count),
      diastolic: Math.round(data.diastolicSum / data.count),
    }));
  };

  const getTimeLabel = (measuredTime: string) => {
    const labels: Record<string, string> = {
      fasting: '공복 (기상 직후)',
      breakfast_after: '아침 식후 2시간',
      lunch_after: '점심 식후 2시간',
      dinner_after: '저녁 식후 2시간',
      bedtime: '취침 전',
      morning: '아침 (기상 후)',
      afternoon: '오후 (점심 후)',
      evening: '저녁 (취침 전)',
    };
    return labels[measuredTime] || measuredTime;
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

  // 차트 설정
  const bloodSugarTimes = [
    { key: 'fasting', label: '공복 (기상 직후)', color: '#f59e0b', normalMax: 100 },
    { key: 'breakfast_after', label: '아침 식후 2시간', color: '#ef4444', normalMax: 140 },
    { key: 'lunch_after', label: '점심 식후 2시간', color: '#8b5cf6', normalMax: 140 },
    { key: 'dinner_after', label: '저녁 식후 2시간', color: '#3b82f6', normalMax: 140 },
    { key: 'bedtime', label: '취침 전', color: '#6366f1', normalMax: 140 },
  ];

  const bloodPressureTimes = [
    { key: 'morning', label: '아침 (기상 후)', color: '#3b82f6' },
    { key: 'afternoon', label: '오후 (점심 후)', color: '#8b5cf6' },
    { key: 'evening', label: '저녁 (취침 전)', color: '#6366f1' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm mb-2">{data.date}</p>
          {/* 혈당 데이터 */}
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey && entry.dataKey !== 'date' && entry.value) {
              const timeConfig = bloodSugarTimes.find(t => t.key === entry.dataKey);
              if (timeConfig) {
                return (
                  <div key={index} className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: timeConfig.color }}
                    />
                    <p className="text-sm">
                      <span className="font-medium">{timeConfig.label.split(' ')[0]}:</span> {entry.value} mg/dL
                    </p>
                  </div>
                );
              }
            }
            return null;
          })}
          {/* 혈압 데이터 */}
          {data.systolic !== undefined && (
            <>
              <p className="text-sm">
                <span className="font-medium">수축기:</span> {data.systolic} mmHg
              </p>
              <p className="text-sm">
                <span className="font-medium">이완기:</span> {data.diastolic} mmHg
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-3xl mb-2">건강 리포트 📊</h1>
          <p className="text-emerald-100">시간대별 혈당/혈압 추이를 확인하세요</p>
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
                {getAverageValue('blood_pressure') !== 0 ? ' mmHg' : ''}
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

        {/* 혈당 그래프 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Droplet className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl">혈당 추이 (시간대별)</h2>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="mb-2">시간대별 혈당 변화를 한눈에 확인하세요. 각 선은 측정 시간대를 나타냅니다.</p>
                <div className="flex flex-wrap gap-3">
                  {bloodSugarTimes.map(timeConfig => (
                    <span key={timeConfig.key} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: timeConfig.color }}></div>
                      {timeConfig.label.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>전체 혈당 추이</CardTitle>
              <CardDescription>
                {getCombinedBloodSugarData().length > 0 
                  ? `${getCombinedBloodSugarData().length}일 기록` 
                  : '기록 없음'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getCombinedBloodSugarData().length > 0 ? (
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart data={getCombinedBloodSugarData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      domain={[0, 'auto']}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                      iconType="line"
                    />
                    <ReferenceLine 
                      y={100} 
                      stroke="#10b981" 
                      strokeDasharray="3 3"
                      label={{ value: "공복 정상 상한", fontSize: 11, fill: "#10b981", position: "right" }}
                    />
                    <ReferenceLine 
                      y={140} 
                      stroke="#f59e0b" 
                      strokeDasharray="3 3"
                      label={{ value: "식후 정상 상한", fontSize: 11, fill: "#f59e0b", position: "right" }}
                    />
                    
                    {bloodSugarTimes.map(timeConfig => (
                      <Line 
                        key={timeConfig.key}
                        type="monotone" 
                        dataKey={timeConfig.key}
                        stroke={timeConfig.color}
                        strokeWidth={2}
                        name={timeConfig.label.split(' ')[0]}
                        dot={{ fill: timeConfig.color, r: 4 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[450px] flex items-center justify-center text-gray-400 text-sm">
                  혈당 기록이 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 혈압 그래프 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl">혈압 추이 (시간대별)</h2>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="mb-1">시간대별로 혈압 변화를 확인하세요. 아침 혈압이 높은 경향이 있습니다.</p>
                <p className="text-xs text-blue-700">💡 정상 범위: 수축기 90-120 mmHg, 이완기 60-80 mmHg</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bloodPressureTimes.map((timeConfig) => {
              const data = getBloodPressureByTime(timeConfig.key);
              
              return (
                <Card key={timeConfig.key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: timeConfig.color }}
                      />
                      {timeConfig.label}
                    </CardTitle>
                    <CardDescription>
                      {data.length > 0 ? `${data.length}회 측정` : '기록 없음'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            domain={[0, 'auto']}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            wrapperStyle={{ fontSize: '12px' }}
                            iconType="line"
                          />
                          <ReferenceLine 
                            y={120} 
                            stroke="#10b981" 
                            strokeDasharray="3 3"
                            label={{ value: "수축기 정상", fontSize: 10, fill: "#10b981" }}
                          />
                          <ReferenceLine 
                            y={80} 
                            stroke="#06b6d4" 
                            strokeDasharray="3 3"
                            label={{ value: "이완기 정상", fontSize: 10, fill: "#06b6d4" }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="systolic" 
                            stroke="#2563eb"
                            strokeWidth={2}
                            name="수축기"
                            dot={{ fill: '#2563eb', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="diastolic" 
                            stroke="#06b6d4"
                            strokeWidth={2}
                            name="이완기"
                            dot={{ fill: '#06b6d4', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                        {timeConfig.label} 기록이 없습니다
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}