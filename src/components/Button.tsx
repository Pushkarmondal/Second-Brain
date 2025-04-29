import { ReactElement } from "react";

interface ButtonInterface {
      variant: 'primary' | 'secondary';
      text: string;
      startIcon: ReactElement;
}

export function Button({ variant, text, startIcon }: ButtonInterface) {
      const baseStyles = "inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-normal";
      const variantStyles = variant === 'primary' ? 'bg-[rgb(98,97,175)]' : 'bg-slate-600';

      return (
            <button className={`${baseStyles} ${variantStyles}`}>
                  <span className="inline-flex w-5 h-5">{startIcon}</span>
                  <span>{text}</span>
            </button>
      );
}
