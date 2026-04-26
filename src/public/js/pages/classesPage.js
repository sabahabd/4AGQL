import { requireAuthentication } from '../state/session.js';
import { bindLogoutButton, refreshSessionStatus } from '../views/authView.js';
import { bindClassesView } from '../views/classesView.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuthentication()) {
    return;
  }

  refreshSessionStatus();
  bindLogoutButton();
  bindClassesView();
});
