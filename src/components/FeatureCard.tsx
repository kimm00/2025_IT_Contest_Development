import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  badge?: string;
  iconColor?: string;
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  features,
  badge,
  iconColor = "text-emerald-600"
}: FeatureCardProps) {
  return (
    <Card className="p-8 hover:shadow-xl transition-all border-2 border-gray-100 hover:border-emerald-200 relative">
      {badge && (
        <Badge className="absolute top-4 right-4 bg-emerald-600">
          {badge}
        </Badge>
      )}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-2xl text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-emerald-600 mt-1">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
