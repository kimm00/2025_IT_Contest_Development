import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { addHealthLog, getCurrentUser } from "../utils/auth";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastRecordDate = user.lastRecordDate?.split('T')[0];
    const isFirstToday = lastRecordDate !== today;

    if (recordType === 'blood_sugar') {
      const value = parseFloat(bloodSugar);
      if (isNaN(value) || value <= 0) {
        toast.error("올바른 혈당 수치를 입력해주세요.");
        return;
      }

      addHealthLog({
        userId: user.email,
        type: 'blood_sugar',
        value,
        recordedAt: new Date().toISOString(),
      });

      if (isFirstToday) {
        toast.success(`혈당 기록이 완료되었습니다! 🎉\n오늘의 첫 기록으로 100원이 기부되었습니다.`);
      } else {
        toast.success("혈당 기록이 완료되었습니다!");
      }
    } else {
      const sys = parseFloat(systolic);
      const dia = parseFloat(diastolic);
      
      if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) {
        toast.error("올바른 혈압 수치를 입력해주세요.");
        return;
      }

      addHealthLog({
        userId: user.email,
        type: 'blood_pressure',
        systolic: sys,
        diastolic: dia,
        recordedAt: new Date().toISOString(),
      });

      if (isFirstToday) {
        toast.success(`혈압 기록이 완료되었습니다! 🎉\n오늘의 첫 기록으로 100원이 기부되었습니다.`);
      } else {
        toast.success("혈압 기록이 완료되었습니다!");
      }
    }

    // Reset form
    setBloodSugar("");
    setSystolic("");
    setDiastolic("");
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              기록하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
