import { isAuthenticated, logoutSession } from '../state/session.js';
import { bindAuthForms, bindLogoutButton, refreshSessionStatus } from '../views/authView.js';

document.addEventListener('DOMContentLoaded', () => {
  bindAuthForms();

  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const logoutFromAuthBtn = document.getElementById('logoutFromAuthBtn');

  if (isAuthenticated()) {
    if (openDashboardBtn) {
      openDashboardBtn.hidden = false;
      openDashboardBtn.addEventListener('click', () => {
        window.location.href = './users.html';
      });
    }

    if (logoutFromAuthBtn) {
      logoutFromAuthBtn.hidden = false;
    }

    bindLogoutButton('logoutFromAuthBtn', 'sessionStatus');
  } else {
    if (openDashboardBtn) {
      openDashboardBtn.hidden = true;
    }

    if (logoutFromAuthBtn) {
      logoutFromAuthBtn.hidden = true;
      logoutFromAuthBtn.addEventListener('click', () => {
        logoutSession();
        refreshSessionStatus();
      });
    }
  }
});
