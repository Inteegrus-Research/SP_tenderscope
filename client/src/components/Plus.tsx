import React from 'react';
import { Plus as LucidePlus } from 'lucide-react';

const Plus: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return <LucidePlus size={size} className={className} />;
};

export default Plus;