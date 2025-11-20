import { useEffect, useState } from "react";
import { Edit, Droplet, AlertCircle } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

import { auth } from "../firebase";
import {
  getCurrentUserProfile,
  updateUserProfile,
  type UserProfile,
} from "../utils/auth";
import { toast } from "sonner";

interface MyPageProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

interface ProfileFormState {
  birthYear: string;
  gender: string;
  height: string;
  weight: string;
  conditions: string[];
  diabetesType: string;
  diagnosisPeriod: string;
  medicationType: string;
  hba1c: string;
  systolicBP: string;
  diastolicBP: string;
  alcoholFrequency: string;
  smokingStatus: string;
  exerciseFrequency: string;
}

export default function MyPageProfileDialog({
  open,
  onOpenChange,
  onUpdate,
}: MyPageProfileDialogProps) {
  const [formData, setFormData] = useState<ProfileFormState>({
    birthYear: "",
    gender: "",
    height: "",
    weight: "",
    conditions: [],
    diabetesType: "",
    diagnosisPeriod: "",
    medicationType: "",
    hba1c: "",
    systolicBP: "",
    diastolicBP: "",
    alcoholFrequency: "",
    smokingStatus: "",
    exerciseFrequency: "",
  });

  useEffect(() => {
    if (!open) return;

    const loadProfile = async () => {
      const current = auth.currentUser;
      if (!current) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const userData = await getCurrentUserProfile(current.uid);
      if (!userData?.profile) return;

      const p = userData.profile as UserProfile;

      setFormData({
        birthYear: p.birthYear != null ? String(p.birthYear) : "",
        gender: p.gender ?? "",
        height: p.height != null ? String(p.height) : "",
        weight: p.weight != null ? String(p.weight) : "",
        conditions: p.conditions ?? [],
        diabetesType: p.diabetesType ?? "",
        diagnosisPeriod: p.diagnosisPeriod ?? "",
        medicationType: p.medicationType ?? "",
        hba1c: p.hba1c != null ? String(p.hba1c) : "",
        systolicBP: p.systolicBP != null ? String(p.systolicBP) : "",
        diastolicBP: p.diastolicBP != null ? String(p.diastolicBP) : "",
        alcoholFrequency: p.alcoholFrequency ?? "",
        smokingStatus: p.smokingStatus ?? "",
        exerciseFrequency: p.exerciseFrequency ?? "",
      });
    };

    void loadProfile();
  }, [open]);

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

  const handleSave = async () => {
    const current = auth.currentUser;
    if (!current) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (
      !formData.birthYear ||
      !formData.gender ||
      !formData.height ||
      !formData.weight
    ) {
      toast.error("필수 정보를 모두 입력해주세요.");
      return;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(formData.birthYear, 10);

    const profile: UserProfile = {
      birthYear: Number(formData.birthYear),
      age,
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      conditions: formData.conditions,
      diabetesType: formData.diabetesType || undefined,
      diagnosisPeriod: formData.diagnosisPeriod || undefined,
      medicationType: formData.medicationType || undefined,
      hba1c: formData.hba1c ? Number(formData.hba1c) : undefined,
      systolicBP: formData.systolicBP
        ? Number(formData.systolicBP)
        : undefined,
      diastolicBP: formData.diastolicBP
        ? Number(formData.diastolicBP)
        : undefined,
      alcoholFrequency: formData.alcoholFrequency || undefined,
      smokingStatus: formData.smokingStatus || undefined,
      exerciseFrequency: formData.exerciseFrequency || undefined,
      completedAt: new Date().toISOString(),
    };

    const ok = await updateUserProfile(profile);
    if (!ok) return;

    onUpdate();
    onOpenChange(false);
    toast.success("프로필이 업데이트되었습니다!");
  };

  const hasDiabetes = formData.conditions.includes("diabetes");
  const hasHypertension = formData.conditions.includes("hypertension");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="w-4 h-4" />
          수정
        </Button>
      </DialogTrigger>

      {/* 🔥 최종 해결: DialogContent 자체를 Flex 컨테이너로 만듭니다.
          - flex flex-col: 자식 요소들을 세로로 정렬
          - h-[80vh]: 높이를 화면의 80%로 강제 고정
          - p-0 gap-0: 기본 패딩과 간격 제거 (내부에서 제어)
          - overflow-hidden: 둥근 모서리 밖으로 내용이 나가는 것 방지
      */}
      <DialogContent className="flex flex-col w-[90vw] sm:w-[600px] max-w-[600px] h-[80vh] max-h-[80vh] p-0 gap-0 bg-white rounded-xl overflow-hidden border-0 shadow-lg outline-none">
        
        {/* 1. 헤더 (고정 영역) 
            - shrink-0: 절대 줄어들지 않음 (높이 유지)
        */}
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white text-left">
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            당뇨/고혈압 맞춤 건강 관리를 위한 정보를 입력하세요
          </DialogDescription>
        </DialogHeader>

        {/* 2. 본문 스크롤 영역 (가변 영역)
            - flex-1: 남은 공간을 모두 차지함
            - overflow-y-auto: 내용이 넘치면 스크롤 생성
            - min-h-0: ✨ 중요! 이게 없으면 내용이 많을 때 flex 컨테이너를 뚫고 나갑니다.
        */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-6">
          {/* 기본 신체 정보 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">기본 신체 정보</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-birthYear">출생연도</Label>
                <Input
                  id="edit-birthYear"
                  type="number"
                  placeholder="예: 1985"
                  value={formData.birthYear}
                  onChange={(e) =>
                    setFormData({ ...formData, birthYear: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">성별</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
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
                <Label htmlFor="edit-height">키 (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weight">체중 (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* 질환 관리 정보 */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold">질환 관리 정보 ⭐</h4>
            <div className="space-y-2">
              <Label>관리 중인 질환</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-diabetes"
                    checked={formData.conditions.includes("diabetes")}
                    onCheckedChange={() => handleConditionToggle("diabetes")}
                  />
                  <Label htmlFor="edit-diabetes" className="cursor-pointer">
                    🩸 당뇨병
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-hypertension"
                    checked={formData.conditions.includes("hypertension")}
                    onCheckedChange={() =>
                      handleConditionToggle("hypertension")
                    }
                  />
                  <Label
                    htmlFor="edit-hypertension"
                    className="cursor-pointer"
                  >
                    💓 고혈압
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-hyperlipidemia"
                    checked={formData.conditions.includes("hyperlipidemia")}
                    onCheckedChange={() =>
                      handleConditionToggle("hyperlipidemia")
                    }
                  />
                  <Label
                    htmlFor="edit-hyperlipidemia"
                    className="cursor-pointer"
                  >
                    💊 고지혈증
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-none"
                    checked={formData.conditions.includes("none")}
                    onCheckedChange={() => handleConditionToggle("none")}
                  />
                  <Label htmlFor="edit-none" className="cursor-pointer">
                    🛡️ 없음 (예방 목적)
                  </Label>
                </div>
              </div>
            </div>

            {/* 당뇨 추가 정보 */}
            {hasDiabetes && (
              <div className="bg-blue-50 p-3 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-blue-800 text-sm font-medium">
                  <Droplet className="w-4 h-4" />
                  <span>당뇨병 상세 정보</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-diabetesType">당뇨 유형</Label>
                  <Select
                    value={formData.diabetesType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, diabetesType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">제1형 당뇨</SelectItem>
                      <SelectItem value="type2">제2형 당뇨</SelectItem>
                      <SelectItem value="gestational">임신성 당뇨</SelectItem>
                      <SelectItem value="prediabetes">당뇨 전단계</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-hba1c">당화혈색소 (HbA1c)</Label>
                  <Input
                    id="edit-hba1c"
                    type="number"
                    placeholder="예: 6.5"
                    step="0.1"
                    value={formData.hba1c}
                    onChange={(e) =>
                      setFormData({ ...formData, hba1c: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* 고혈압 추가 정보 */}
            {hasHypertension && (
              <div className="bg-red-50 p-3 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-red-800 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>평소 혈압</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-systolicBP">수축기</Label>
                    <Input
                      id="edit-systolicBP"
                      type="number"
                      placeholder="130"
                      value={formData.systolicBP}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          systolicBP: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-diastolicBP">이완기</Label>
                    <Input
                      id="edit-diastolicBP"
                      type="number"
                      placeholder="85"
                      value={formData.diastolicBP}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diastolicBP: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {!formData.conditions.includes("none") &&
              formData.conditions.length > 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-diagnosisPeriod">진단 시기</Label>
                    <Select
                      value={formData.diagnosisPeriod}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          diagnosisPeriod: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under1year">1년 미만</SelectItem>
                        <SelectItem value="1to5years">1~5년</SelectItem>
                        <SelectItem value="over5years">5년 이상</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-medicationType">약물 복용</Label>
                    <Select
                      value={formData.medicationType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          medicationType: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral">먹는 약</SelectItem>
                        <SelectItem value="insulin">인슐린 주사</SelectItem>
                        <SelectItem value="both">약 + 주사</SelectItem>
                        <SelectItem value="lifestyle">
                          운동&식이요법
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
          </div>

          {/* 생활 습관 */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold">생활 습관</h4>
            <div className="space-y-2">
              <Label htmlFor="edit-alcoholFrequency">음주 빈도</Label>
              <Select
                value={formData.alcoholFrequency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    alcoholFrequency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">안 함</SelectItem>
                  <SelectItem value="1to2">주 1~2회</SelectItem>
                  <SelectItem value="3plus">주 3회 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-smokingStatus">흡연 상태</Label>
              <Select
                value={formData.smokingStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    smokingStatus: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">비흡연</SelectItem>
                  <SelectItem value="past">과거 흡연</SelectItem>
                  <SelectItem value="current">현재 흡연</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exerciseFrequency">운동 빈도</Label>
              <Select
                value={formData.exerciseFrequency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    exerciseFrequency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">안 함</SelectItem>
                  <SelectItem value="1to2">주 1~2회</SelectItem>
                  <SelectItem value="3to4">주 3~4회</SelectItem>
                  <SelectItem value="5plus">주 5회 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 3. 하단 버튼 (고정 영역) 
            - shrink-0: 절대 줄어들지 않음
        */}
        <div className="px-6 py-4 border-t bg-white shrink-0">
          <Button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}