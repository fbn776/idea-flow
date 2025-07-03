import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '' }) => {
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    return <Icons.HelpCircle size={size} className={className} />;
  }
  
  return <IconComponent size={size} className={className} />;
};