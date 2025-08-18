import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  // Use NEXT_PUBLIC_BASE_URL if defined, otherwise fall back to localhost in development
  return process.env.NEXT_PUBLIC_BASE_URL;
}

export function showCopyToast(text: string, type: string) {
    navigator.clipboard.writeText(text);
    toast('Copied!', {
      description: `The ${type} has been copied to your clipboard.`,
      style: {
        background: 'rgb(217, 245, 139)',
        border: '1px solid rgb(69, 68, 128)',
        color: 'rgb(69, 68, 128)',
      },
    });  
}
