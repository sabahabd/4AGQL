export function bindNavigation() {
  const chips = Array.from(document.querySelectorAll('.chip'));

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-view');
      if (!key) {
        return;
      }

      for (const other of chips) {
        other.classList.toggle('is-active', other === chip);
      }

      const views = Array.from(document.querySelectorAll('.view'));
      for (const view of views) {
        view.classList.remove('is-active');
      }

      const activeView = document.getElementById(`view-${key}`);
      if (activeView) {
        activeView.classList.add('is-active');
      }
    });
  }
}
