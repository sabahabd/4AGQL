import { requireAuthentication } from '../state/session.js';
import { bindLogoutButton, refreshSessionStatus } from '../views/authView.js';
import { bindMyGradesView } from '../views/myGradesView.js';
import { bindGradeCrudView } from '../views/gradeCrudView.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuthentication()) {
    return;
  }

  refreshSessionStatus();
  bindLogoutButton();
  bindMyGradesView();
  bindGradeCrudView();
});
