import toast from 'react-hot-toast';

export function showErrorToast(message: string): void {
  toast.error(message, {
    style: {
      background: 'var(--color-background-mute)',
      color: 'var(--color-text)',
    },
    position: 'bottom-center',
  });
}

export function showSuccessToast(message: string, duration?: number): void {
  toast.success(message, {
    style: {
      background: 'var(--color-background-mute)',
      color: 'var(--color-text)',
    },
    position: 'bottom-center',
    duration: duration,
  });
}
