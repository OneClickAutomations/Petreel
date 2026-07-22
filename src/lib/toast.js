/** Tiny event-based toast bus. toast.success(msg) / toast.error(msg). */
export const toast = {
  success: (message) => emit({ type: 'success', message }),
  error: (message) => emit({ type: 'error', message }),
  info: (message) => emit({ type: 'info', message }),
};

function emit(detail) {
  window.dispatchEvent(new CustomEvent('petreel:toast', { detail }));
}
