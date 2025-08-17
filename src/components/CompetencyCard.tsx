import React from 'react';
import { Monitor, Users, Settings, Megaphone, BarChart3, Shield, DivideIcon as LucideIcon } from 'lucide-react';

interface CompetencyCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const competencyIcons: Record<string, LucideIcon> = {
  'Digital Transformation Area': Monitor,
  'Human Development Area': Users,
  'Process & Optimization Area': Settings,
  'Brand & Communication Area': Megaphone,
  'Insight & Impact Area': BarChart3,
  'Compliance & Governance Area': Shield,
};

export function getCompetencyIcon(competency: string): LucideIcon {
  return competencyIcons[competency] || Users;
}

export default function CompetencyCard({ 
  title, 
  description, 
  icon: Icon, 
  isSelected = false, 
  onClick,
  className = ''
}: CompetencyCardProps) {
  return (
    <div 
      className={`
        p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:scale-105 transform
        ${isSelected 
          ? 'border-[#284B46] bg-gradient-to-br from-green-50 to-white shadow-md' 
          : 'border-green-100 bg-white hover:border-[#4A6965]'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          p-3 rounded-lg flex-shrink-0
          ${isSelected 
            ? 'bg-[#284B46] text-white' 
            : 'bg-green-100 text-[#284B46]'
          }
        `}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className={`
            text-lg font-semibold mb-2
            ${isSelected ? 'text-[#284B46]' : 'text-gray-800'}
          `} style={{ fontFamily: 'Playfair Display, serif' }}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}