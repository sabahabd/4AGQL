import { requireAuthentication } from '../state/session.js';
import { bindLogoutButton, refreshSessionStatus } from '../views/authView.js';
import { bindUsersView } from '../views/usersView.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuthentication()) {
    return;
  }

  refreshSessionStatus();
  bindLogoutButton();
  bindUsersView();
});
