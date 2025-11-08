import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge as BadgeUI } from "./ui/badge";
import { getBadgeById, type Badge } from "../utils/badges";

interface BadgeNotificationProps {
  badgeIds: string[];
  onClose: () => void;
}

export default function BadgeNotification({ badgeIds, onClose }: BadgeNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const badges = badgeIds.map(id => getBadgeById(id)).filter(Boolean) as Badge[];

  useEffect(() => {
    if (badges.length === 0) {
      onClose();
      return;
    }

    // 5초 후 자동으로 다음 뱃지 또는 닫기
    const timer = setTimeout(() => {
      if (currentIndex < badges.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, badges.length]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (badges.length === 0) return null;

  const currentBadge = badges[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <Card className="max-w-md w-full bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200 shadow-2xl overflow-hidden">
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      top: "50%",
                      left: "50%",
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: 0,
                      scale: 1
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5]
                    }}
                  />
                ))}
              </div>

              <CardContent className="p-8 relative">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 mb-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-emerald-700">뱃지 획득!</h3>
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  <p className="text-gray-600 text-sm">
                    축하합니다! 새로운 뱃지를 획득했어요 🎉
                  </p>
                </div>

                {/* Badge Display */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3
                  }}
                  className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100 mb-6"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-8xl mb-4"
                    >
                      {currentBadge.emoji}
                    </motion.div>
                    <BadgeUI className={`${currentBadge.color} border text-sm mb-3`}>
                      {currentBadge.category === 'routine' ? '루틴' : 
                       currentBadge.category === 'donation' ? '기부' : '도전'}
                    </BadgeUI>
                    <h4 className="text-gray-900 mb-2">{currentBadge.nameKo}</h4>
                    <p className="text-gray-600 text-sm mb-1">{currentBadge.name}</p>
                    <p className="text-gray-500 text-sm">{currentBadge.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        달성 조건: {currentBadge.condition}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Progress Indicator */}
                {badges.length > 1 && (
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {currentIndex + 1} / {badges.length}
                    </p>
                    <div className="flex gap-2 justify-center">
                      {badges.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all ${
                            index === currentIndex 
                              ? 'w-8 bg-emerald-500' 
                              : 'w-2 bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {currentIndex < badges.length - 1 ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                      >
                        나중에 보기
                      </Button>
                      <Button
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        다음 뱃지 보기
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleClose}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      확인
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
