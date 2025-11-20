import { useState } from "react";
import {
  Heart,
  User,
  Activity,
  Target,
  ArrowRight,
  Droplet,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { updateUserProfile } from "../utils/auth";
import { toast } from "sonner";

interface ProfileSetupPageProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function ProfileSetupPage({
  onComplete,
  onSkip,
}: ProfileSetupPageProps) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: 기본 신체 정보
    birthYear: "",
    gender: "",
    height: "",
    weight: "",

    // Step 2: 질환 관리 정보
    conditions: [] as string[],
    diabetesType: "",
    diagnosisPeriod: "",
    medicationType: "",
    hba1c: "",
    systolicBP: "",
    diastolicBP: "",

    // Step 3: 생활 습관
    alcoholFrequency: "",
    smokingStatus: "",
    exerciseFrequency: "",
  });

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.birthYear ||
        !formData.gender ||
        !formData.height ||
        !formData.weight
      ) {
        toast.error("모든 기본 정보를 입력해주세요.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.conditions.length === 0) {
        toast.error(
          "관리 중인 질환을 선택해주세요. (없다면 '없음(예방 목적)' 선택)",
        );
        return;
      }
      setStep(3);
    } else if (step === 3) {
      void handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConditionToggle = (condition: string) => {
    if (condition === "none") {
      setFormData({
        ...formData,
        conditions: ["none"],
        diabetesType: "",
        medicationType: "",
      });
    } else {
      const current = formData.conditions.filter((c) => c !== "none");
      if (current.includes(condition)) {
        setFormData({
          ...formData,
          conditions: current.filter((c) => c !== condition),
        });
      } else {
        setFormData({
          ...formData,
          conditions: [...current, condition],
        });
      }
    }
  };

  const handleSubmit = async () => {
    const currentYear = new Date().getFullYear();
    const birthYearNum = parseInt(formData.birthYear, 10);
    const age = currentYear - birthYearNum;
  
    // 1. 기본 필수 필드 먼저 세팅
    const profile: any = {
      birthYear: birthYearNum,
      age,
      gender: formData.gender,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      conditions: formData.conditions,
      completedAt: new Date().toISOString(), // ⭐ 중요
    };
  
    const hasDiabetes = formData.conditions.includes("diabetes");
    const hasHypertension = formData.conditions.includes("hypertension");
    const isNoneOnly = formData.conditions.includes("none");
  
    // 2. 당뇨 관련 (선택값들)
    if (hasDiabetes && formData.diabetesType) {
      profile.diabetesType = formData.diabetesType;
    }
    if (formData.hba1c) {
      profile.hba1c = parseFloat(formData.hba1c);
    }
  
    // 3. 고혈압 관련
    if (hasHypertension && formData.systolicBP) {
      profile.systolicBP = parseFloat(formData.systolicBP);
    }
    if (hasHypertension && formData.diastolicBP) {
      profile.diastolicBP = parseFloat(formData.diastolicBP);
    }
  
    // 4. 공통 질환 정보 (예방 목적이 아닐 때만)
    if (!isNoneOnly && formData.diagnosisPeriod) {
      profile.diagnosisPeriod = formData.diagnosisPeriod;
    }
    if (!isNoneOnly && formData.medicationType) {
      profile.medicationType = formData.medicationType;
    }
  
    // 5. 생활 습관
    if (formData.alcoholFrequency) {
      profile.alcoholFrequency = formData.alcoholFrequency;
    }
    if (formData.smokingStatus) {
      profile.smokingStatus = formData.smokingStatus;
    }
    if (formData.exerciseFrequency) {
      profile.exerciseFrequency = formData.exerciseFrequency;
    }
  
    const ok = await updateUserProfile(profile);
    if (!ok) return;
  
    toast.success("프로필 설정이 완료되었습니다! 🎉");
    onComplete();
  };
  

  const getBMI = () => {
    if (formData.height && formData.weight) {
      const heightM = parseFloat(formData.height) / 100;
      const bmi = parseFloat(formData.weight) / (heightM * heightM);
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

  const hasDiabetes = formData.conditions.includes("diabetes");
  const hasHypertension = formData.conditions.includes("hypertension");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl text-gray-900">HealthyKong</span>
          </div>
          <h1 className="text-3xl mb-2">맞춤 건강 관리 시작하기</h1>
          <p className="text-gray-600">
            나에게 꼭 맞는 건강 관리와 AI 리포트를 위한 정보 입력
          </p>
          {onSkip && (
            <Button variant="ghost" size="sm" onClick={onSkip} className="mt-4">
              나중에 하기
            </Button>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 ${
                step >= 2 ? "bg-emerald-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`w-16 h-1 ${
                step >= 3 ? "bg-emerald-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 px-4">
            <span>기본정보</span>
            <span>질환관리</span>
            <span>생활습관</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Step 1. 기본 신체 정보"}
              {step === 2 && "Step 2. 질환 관리 정보 ⭐"}
              {step === 3 && "Step 3. 생활 습관"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "BMI 계산과 기초대사량 추정에 사용됩니다"}
              {step === 2 && "당뇨/고혈압 맞춤 관리를 위한 핵심 정보입니다"}
              {step === 3 && "AI가 생활 습관 개선을 조언하는 데 활용됩니다"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: 기본 신체 정보 */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthYear">출생연도</Label>
                    <Input
                      id="birthYear"
                      type="number"
                      placeholder="예: 1985"
                      value={formData.birthYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birthYear: e.target.value,
                        })
                      }
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">성별</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">남성</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">신장 (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="예: 170"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      min="100"
                      max="250"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">체중 (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="예: 65"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      min="30"
                      max="300"
                      step="0.1"
                    />
                  </div>
                </div>

                {getBMI() && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          체질량지수 (BMI)
                        </p>
                        <p className="text-2xl">
                          {getBMI()}{" "}
                          {getBMIStatus() && (
                            <span
                              className={`text-base ${getBMIStatus()?.color}`}
                            >
                              ({getBMIStatus()?.text})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          💡 BMI는 당뇨/고혈압 위험도의 핵심 지표입니다
                        </p>
                      </div>
                      <Activity className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: 질환 관리 정보 */}
            {step === 2 && (
              <>
                <div className="space-y-3">
                  <Label>관리 중인 질환 (복수 선택 가능)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="diabetes"
                        checked={formData.conditions.includes("diabetes")}
                        onCheckedChange={() =>
                          handleConditionToggle("diabetes")
                        }
                      />
                      <Label htmlFor="diabetes" className="cursor-pointer">
                        🩸 당뇨병 (Diabetes)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hypertension"
                        checked={formData.conditions.includes("hypertension")}
                        onCheckedChange={() =>
                          handleConditionToggle("hypertension")
                        }
                      />
                      <Label htmlFor="hypertension" className="cursor-pointer">
                        💓 고혈압 (Hypertension)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hyperlipidemia"
                        checked={formData.conditions.includes("hyperlipidemia")}
                        onCheckedChange={() =>
                          handleConditionToggle("hyperlipidemia")
                        }
                      />
                      <Label
                        htmlFor="hyperlipidemia"
                        className="cursor-pointer"
                      >
                        💊 고지혈증 (Hyperlipidemia){" "}
                        <span className="text-xs text-gray-500">
                          - 선택사항
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="none"
                        checked={formData.conditions.includes("none")}
                        onCheckedChange={() => handleConditionToggle("none")}
                      />
                      <Label htmlFor="none" className="cursor-pointer">
                        🛡️ 없음 (예방 목적)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* 당뇨 추가 질문 */}
                {hasDiabetes && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Droplet className="w-5 h-5" />
                      <span>당뇨병 상세 정보</span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diabetesType">당뇨 유형</Label>
                      <Select
                        value={formData.diabetesType}
                        onValueChange={(value: string) =>
                          setFormData({ ...formData, diabetesType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="type1">제1형 당뇨</SelectItem>
                          <SelectItem value="type2">제2형 당뇨</SelectItem>
                          <SelectItem value="gestational">
                            임신성 당뇨
                          </SelectItem>
                          <SelectItem value="prediabetes">
                            당뇨 전단계
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hba1c">
                        최근 당화혈색소 (HbA1c){" "}
                        <span className="text-xs text-gray-500">
                          - 선택사항
                        </span>
                      </Label>
                      <Input
                        id="hba1c"
                        type="number"
                        placeholder="예: 6.5 (%)"
                        value={formData.hba1c}
                        onChange={(e) =>
                          setFormData({ ...formData, hba1c: e.target.value })
                        }
                        step="0.1"
                        min="4"
                        max="15"
                      />
                      <p className="text-xs text-gray-600">
                        💡 당뇨 환자의 성적표, AI 분석에 매우 중요한 지표입니다
                      </p>
                    </div>
                  </div>
                )}

                {/* 고혈압 추가 질문 */}
                {hasHypertension && (
                  <div className="bg-red-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-5 h-5" />
                      <span>평소 혈압 (알고 있다면)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="systolicBP">수축기 혈압</Label>
                        <Input
                          id="systolicBP"
                          type="number"
                          placeholder="예: 130"
                          value={formData.systolicBP}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              systolicBP: e.target.value,
                            })
                          }
                          min="70"
                          max="250"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diastolicBP">이완기 혈압</Label>
                        <Input
                          id="diastolicBP"
                          type="number"
                          placeholder="예: 85"
                          value={formData.diastolicBP}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diastolicBP: e.target.value,
                            })
                          }
                          min="40"
                          max="150"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 공통 질문 */}
                {!formData.conditions.includes("none") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosisPeriod">진단 시기</Label>
                      <Select
                        value={formData.diagnosisPeriod}
                        onValueChange={(value: string) =>
                          setFormData({
                            ...formData,
                            diagnosisPeriod: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under1year">
                            1년 미만 (초보)
                          </SelectItem>
                          <SelectItem value="1to5years">
                            1~5년
                          </SelectItem>
                          <SelectItem value="over5years">
                            5년 이상 (베테랑)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicationType">약물 복용 여부</Label>
                      <Select
                        value={formData.medicationType}
                        onValueChange={(value: string) =>
                          setFormData({
                            ...formData,
                            medicationType: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oral">먹는 약</SelectItem>
                          <SelectItem value="insulin">인슐린 주사</SelectItem>
                          <SelectItem value="both">
                            약 + 주사 병행
                          </SelectItem>
                          <SelectItem value="lifestyle">
                            운동 &amp; 식이요법만
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 3: 생활 습관 */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="alcoholFrequency">음주 빈도</Label>
                  <Select
                    value={formData.alcoholFrequency}
                    onValueChange={(value: string) =>
                      setFormData({
                        ...formData,
                        alcoholFrequency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">안 함</SelectItem>
                      <SelectItem value="1to2">주 1~2회</SelectItem>
                      <SelectItem value="3plus">주 3회 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smokingStatus">흡연 상태</Label>
                  <Select
                    value={formData.smokingStatus}
                    onValueChange={(value: string) =>
                      setFormData({
                        ...formData,
                        smokingStatus: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">비흡연</SelectItem>
                      <SelectItem value="past">과거 흡연</SelectItem>
                      <SelectItem value="current">현재 흡연</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exerciseFrequency">운동 빈도</Label>
                  <Select
                    value={formData.exerciseFrequency}
                    onValueChange={(value: string) =>
                      setFormData({
                        ...formData,
                        exerciseFrequency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">안 함</SelectItem>
                      <SelectItem value="1to2">주 1~2회</SelectItem>
                      <SelectItem value="3to4">주 3~4회</SelectItem>
                      <SelectItem value="5plus">주 5회 이상</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    💡 숨이 찰 정도의 중강도 이상 운동 기준
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <Target className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm mb-1">🎯 AI가 이렇게 활용합니다</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• "담배를 줄이면 혈당 조절이 더 쉬워집니다"</li>
                        <li>• "운동을 조금만 더 늘려보세요"</li>
                        <li>• "음주는 혈압에 영향을 줄 수 있어요"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  이전
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                {step === 3 ? "완료" : "다음"}
                {step < 3 && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          🔒 모든 정보는 안전하게 보관되며, 맞춤 건강 관리와 AI 리포트에만 사용됩니다.
        </p>
      </div>
    </div>
  );
}