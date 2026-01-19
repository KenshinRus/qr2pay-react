import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showCopyToast(text: string, type: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      toast('Copied!', {
        description: `The ${type} has been copied to your clipboard.`,
        style: {
          background: 'rgb(217, 245, 139)',
          border: '1px solid rgb(69, 68, 128)',
          color: 'rgb(69, 68, 128)',
        },
      });
    } else {
      // Fallback for insecure contexts (HTTP)
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast('Copied!', {
          description: `The ${type} has been copied to your clipboard.`,
          style: {
            background: 'rgb(217, 245, 139)',
            border: '1px solid rgb(69, 68, 128)',
            color: 'rgb(69, 68, 128)',
          },
        });
      } catch (err) {
        toast('Copy failed', {
          description: 'Please use HTTPS or localhost to enable clipboard access.',
          style: {
            background: 'rgb(254, 226, 226)',
            border: '1px solid rgb(239, 68, 68)',
            color: 'rgb(127, 29, 29)',
          },
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
}
