let timeoutId = null;

export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.style.borderColor = type === 'error' ? '#bf4545' : '#334255';
  toast.classList.add('visible');

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2600);
}
