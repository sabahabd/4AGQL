import { bindAuthForms } from './views/authView.js';
import { bindNavigation } from './views/navigationView.js';
import { bindUsersView } from './views/usersView.js';
import { bindMyGradesView } from './views/myGradesView.js';
import { bindGradeCrudView } from './views/gradeCrudView.js';
import { bindClassesView } from './views/classesView.js';
import { bindAnalyticsView } from './views/analyticsView.js';

document.addEventListener('DOMContentLoaded', () => {
  bindNavigation();
  bindAuthForms();
  bindUsersView();
  bindMyGradesView();
  bindGradeCrudView();
  bindClassesView();
  bindAnalyticsView();
});
