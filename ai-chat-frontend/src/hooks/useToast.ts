export { useToast } from '../contexts/ToastContext';

// Экспортируем также типы для удобства использования
export type {
  ToastType,
  ToastPosition,
  ToastData,
} from '../components/ui/Toast';

// Дополнительные утилиты для toast
export const createToastOptions = (
  title: string,
  description?: string,
  duration?: number
) => ({ title, description, duration });

// Предустановленные конфигурации для частых случаев
export const toastPresets = {
  saveSuccess: () => ({
    title: 'Saved successfully',
    description: 'Your changes have been saved.',
    duration: 3000,
  }),

  saveError: (error?: string) => ({
    title: 'Failed to save',
    description: error || 'Something went wrong while saving your changes.',
    duration: 7000,
  }),

  deleteSuccess: (itemName?: string) => ({
    title: 'Deleted successfully',
    description: itemName
      ? `${itemName} has been deleted.`
      : 'Item has been deleted.',
    duration: 4000,
  }),

  deleteError: (error?: string) => ({
    title: 'Failed to delete',
    description: error || 'Something went wrong while deleting the item.',
    duration: 7000,
  }),

  loginSuccess: (username?: string) => ({
    title: 'Welcome back!',
    description: username
      ? `Hello, ${username}`
      : 'You have successfully logged in.',
    duration: 3000,
  }),

  loginError: (error?: string) => ({
    title: 'Login failed',
    description: error || 'Invalid credentials. Please try again.',
    duration: 6000,
  }),

  networkError: () => ({
    title: 'Connection problem',
    description: 'Please check your internet connection and try again.',
    duration: 8000,
  }),

  formValidationError: () => ({
    title: 'Form validation failed',
    description: 'Please check the highlighted fields and try again.',
    duration: 5000,
  }),

  copySuccess: () => ({
    title: 'Copied!',
    description: 'Content has been copied to clipboard.',
    duration: 2000,
  }),

  uploadSuccess: (fileName?: string) => ({
    title: 'Upload completed',
    description: fileName
      ? `${fileName} has been uploaded.`
      : 'File has been uploaded successfully.',
    duration: 4000,
  }),

  uploadError: (error?: string) => ({
    title: 'Upload failed',
    description: error || 'Failed to upload the file. Please try again.',
    duration: 7000,
  }),
};
