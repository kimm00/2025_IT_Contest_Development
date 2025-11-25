import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { addHealthLog, type HealthLog } from "../utils/auth";
import { toast } from "sonner";

export interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordType: 'blood_sugar' | 'blood_pressure';
  onSuccess: () => void;
}

export default function HealthRecordModal({ 
  isOpen, 
  onClose, 
  recordType, 
  onSuccess 
}: HealthRecordModalProps) {
  
  const [bloodSugar, setBloodSugar] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [measuredTime, setMeasuredTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setBloodSugar("");
        setSystolic("");
        setDiastolic("");
        setMeasuredTime("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!measuredTime) {
        toast.error("측정 시간대를 선택해주세요.");
        return;
    }

    setLoading(true);

    try {
      let logData: Omit<HealthLog, 'id' | 'userId'>;

      if (recordType === 'blood_sugar') {
        const value = parseFloat(bloodSugar);
        if (isNaN(value) || value <= 0) {
          toast.error("올바른 혈당 수치를 입력해주세요.");
          setLoading(false);
          return;
        }

        logData = {
          type: 'blood_sugar',
          value,
          measuredTime,
          recordedAt: new Date().toISOString(),
        };

      } else {
        const sys = parseFloat(systolic);
        const dia = parseFloat(diastolic);
        
        if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) {
          toast.error("올바른 혈압 수치를 입력해주세요.");
          setLoading(false);
          return;
        }

        logData = {
          type: 'blood_pressure',
          systolic: sys,
          diastolic: dia,
          measuredTime,
          recordedAt: new Date().toISOString(),
        };
      }

      const result = await addHealthLog(logData);

      if (result === 'first_donation') {
        toast.success(`기록 완료! 🎉\n오늘의 첫 기록으로 100P가 기부되었습니다.`);
      } else if (result === 'normal_log') {
        toast.success("기록이 완료되었습니다!");
      }

      if (result) {
        onSuccess();
        onClose();
      }

    } catch (error) {
      console.error(error);
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {recordType === 'blood_sugar' ? '혈당 기록하기' : '혈압 기록하기'}
          </DialogTitle>
          <DialogDescription>
            {recordType === 'blood_sugar' 
              ? '오늘의 혈당 수치를 기록하세요. 첫 기록 시 100P가 기부됩니다.' 
              : '오늘의 혈압을 기록하세요. 첫 기록 시 100P가 기부됩니다.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {recordType === 'blood_sugar' ? (
              <div className="space-y-2">
                <Label htmlFor="bloodSugar">혈당 수치 (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  type="number"
                  step="0.1"
                  placeholder="예: 120"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="systolic">수축기 혈압 (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    step="1"
                    placeholder="예: 120"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">이완기 혈압 (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    step="1"
                    placeholder="예: 80"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
                <Label htmlFor="measuredTime">측정 시간대</Label>
                <Select value={measuredTime} onValueChange={setMeasuredTime}>
                <SelectTrigger id="measuredTime">
                    <SelectValue placeholder="측정 시간대를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                    {recordType === 'blood_sugar' ? (
                    <>
                        <SelectItem value="fasting">🌅 공복 (기상 직후)</SelectItem>
                        <SelectItem value="breakfast_after">🍳 아침 식후 2시간</SelectItem>
                        <SelectItem value="lunch_after">🍱 점심 식후 2시간</SelectItem>
                        <SelectItem value="dinner_after">🍽️ 저녁 식후 2시간</SelectItem>
                        <SelectItem value="bedtime">🌙 취침 전</SelectItem>
                    </>
                    ) : (
                    <>
                        <SelectItem value="morning">🌅 아침 (기상 후)</SelectItem>
                        <SelectItem value="afternoon">☀️ 오후 (점심 후)</SelectItem>
                        <SelectItem value="evening">🌙 저녁 (취침 전)</SelectItem>
                    </>
                    )}
                </SelectContent>
                </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "저장 중..." : "기록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}