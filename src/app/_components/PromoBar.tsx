import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {};

const PromoBar = (props: Props) => {
  return (
    <div className="flex h-9 w-full items-center justify-center gap-8 bg-[#f4f4f4]">
      <ChevronLeft 
        size={20} 
        strokeWidth={1.75} 
      />
      <p className="text-sm font-medium">Get 10% off on business sign up</p>
      <ChevronRight 
        size={20} 
        strokeWidth={1.75} 
      />
    </div>
  );
};

export default PromoBar;
