import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addHealthLog, type HealthLog } from "../utils/auth";
import { toast } from "sonner";

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordType: 'blood_sugar' | 'blood_pressure';
  onSuccess: () => void;
}

export default function HealthRecordModal({ isOpen, onClose, recordType, onSuccess }: HealthRecordModalProps) {
  const [bloodSugar, setBloodSugar] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // YYYY-MM-DD 형식
      const today = now.toISOString().split('T')[0];
      // HH:MM 형식 (한국 시간 기준 보정)
      const kstOffset = 9 * 60 * 60 * 1000;
      const kstDate = new Date(now.getTime() + kstOffset);
      const currentTime = kstDate.toISOString().split('T')[1].slice(0, 5);

      setDate(today);
      setTime(currentTime);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dateTimeString = `${date}T${time}:00`;
    const recordedAtDate = new Date(dateTimeString);

    if (isNaN(recordedAtDate.getTime())) {
      toast.error("올바른 날짜와 시간을 선택해주세요.");
      return;
    }

    const recordedAtISO = recordedAtDate.toISOString();

    let logData: Omit<HealthLog, 'id' | 'userId'>;

    if (recordType === 'blood_sugar') {
      const value = parseFloat(bloodSugar);
      if (isNaN(value) || value <= 0) {
        toast.error("올바른 혈당 수치를 입력해주세요.");
        return;
      }
      logData = {
        type: 'blood_sugar',
        value,
        recordedAt: recordedAtISO,
      };
    } else {
      const sys = parseFloat(systolic);
      const dia = parseFloat(diastolic);
      if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) {
        toast.error("올바른 혈압 수치를 입력해주세요.");
        return;
      }
      logData = {
        type: 'blood_pressure',
        systolic: sys,
        diastolic: dia,
        recordedAt: recordedAtISO,
      };
    }

    setLoading(true);

    try {
      const result = await addHealthLog(logData);

      if (result === 'first_donation') {
        toast.success(`기록이 완료되었습니다! 🎉\n오늘의 첫 기록으로 100원이 기부되었습니다.`);
      } else if (result === 'normal_log') {
        toast.success("기록이 완료되었습니다!");
      }

      if (result) {
        resetFormAndClose();
        onSuccess();
      }
    } catch (error) {
      console.error("Handle Submit Error:", error);
      toast.error("기록 저장 중 예기치 못한 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetFormAndClose = () => {
    setBloodSugar("");
    setSystolic("");
    setDiastolic("");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && resetFormAndClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {recordType === 'blood_sugar' ? '혈당 기록하기' : '혈압 기록하기'}
          </DialogTitle>
          <DialogDescription>
            {recordType === 'blood_sugar' 
              ? '오늘의 혈당 수치를 기록하세요. 첫 기록 시 100원이 자동으로 기부됩니다.' 
              : '오늘의 혈압을 기록하세요. 첫 기록 시 100원이 자동으로 기부됩니다.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">날짜</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">시간</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            
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
                <p className="text-xs text-gray-500">
                  정상 범위: 공복 70-100 mg/dL, 식후 2시간 90-140 mg/dL
                </p>
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
                <p className="text-xs text-gray-500">
                  정상 범위: 수축기 90-120 mmHg, 이완기 60-80 mmHg
                </p>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetFormAndClose} disabled={loading}>
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