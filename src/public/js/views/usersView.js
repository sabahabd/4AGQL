import { graphqlRequest } from '../api/graphql.js';
import { showToast } from '../ui/notify.js';
import { printJson } from '../utils/format.js';

const USERS_QUERY = `
  query Users {
    users {
      id
      email
      pseudo
      role
      createdAt
      updatedAt
    }
  }
`;

export function bindUsersView() {
  const refreshUsersBtn = document.getElementById('refreshUsersBtn');

  const loadUsers = async () => {
    try {
      const data = await graphqlRequest(USERS_QUERY);
      printJson('usersOutput', data.users);
      showToast('Liste des utilisateurs chargee', 'success');
    } catch (error) {
      printJson('usersOutput', { error: error.message });
      showToast(error.message, 'error');
    }
  };

  refreshUsersBtn?.addEventListener('click', loadUsers);
  loadUsers();
}
