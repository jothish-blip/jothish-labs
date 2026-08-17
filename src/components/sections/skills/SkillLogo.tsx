import Image from "next/image";
import { useState } from "react";
import { Wrench } from "lucide-react";

interface Props {
  logo?: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
  size?: number;
  className?: string;
}

export default function SkillLogo({ logo, icon: Icon, size = 32, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);

  // If a valid image path is provided
  if (logo && !imgError) {
    return (
      <div 
        className={`relative flex items-center justify-center shrink-0 ${className}`} 
        style={{ width: size, height: size }}
      >
        <Image
          src={logo}
          alt="Skill logo"
          fill
          sizes={`${size}px`}
          className="object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // If a Lucide Icon component is provided instead
  if (Icon) {
    return <Icon size={size} className={`shrink-0 ${className}`} />;
  }

  // Ultimate fallback if nothing works
  return <Wrench size={size} className={`shrink-0 ${className}`} />;
}