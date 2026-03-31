import { reactive } from 'vue';

const dialogState = reactive({
  open: false,
  type: 'alert',
  title: '',
  message: '',
  confirmText: 'Đồng ý',
  cancelText: 'Hủy'
});

let pendingResolve = null;

function openDialog(options) {
  dialogState.open = true;
  dialogState.type = options.type || 'alert';
  dialogState.title = options.title || '';
  dialogState.message = options.message || '';
  dialogState.confirmText = options.confirmText || 'Đồng ý';
  dialogState.cancelText = options.cancelText || 'Hủy';

  return new Promise((resolve) => {
    pendingResolve = resolve;
  });
}

function resolveDialog(value) {
  dialogState.open = false;
  const resolver = pendingResolve;
  pendingResolve = null;
  if (resolver) resolver(value);
}

function alertDialog(message, title) {
  return openDialog({
    type: 'alert',
    title: title || 'Thông báo',
    message,
    confirmText: 'OK'
  });
}

function confirmDialog(message, title) {
  return openDialog({
    type: 'confirm',
    title: title || 'Xác nhận',
    message,
    confirmText: 'Đồng ý',
    cancelText: 'Không'
  });
}

export function useDialog() {
  return {
    dialogState,
    alert: alertDialog,
    confirm: confirmDialog,
    onConfirm: () => resolveDialog(true),
    onCancel: () => resolveDialog(false)
  };
}
