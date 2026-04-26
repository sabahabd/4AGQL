import { requireAuthentication } from '../state/session.js';
import { bindLogoutButton, refreshSessionStatus } from '../views/authView.js';
import { bindAnalyticsView } from '../views/analyticsView.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuthentication()) {
    return;
  }

  refreshSessionStatus();
  bindLogoutButton();
  bindAnalyticsView();
});
