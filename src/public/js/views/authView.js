import { graphqlRequest } from '../api/graphql.js';
import { getCurrentUser, logoutSession, setCurrentUser, setToken } from '../state/session.js';
import { showToast } from '../ui/notify.js';

const REGISTER_MUTATION = `
  mutation Register($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      pseudo
      role
      createdAt
      updatedAt
    }
  }
`;

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        pseudo
        role
      }
    }
  }
`;

export function refreshSessionStatus(statusElementId = 'sessionStatus') {
  const status = document.getElementById(statusElementId);
  if (!status) {
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    status.textContent = 'Non connecte';
    return;
  }

  status.textContent = `${user.pseudo} (${user.role})`;
}

export function bindLogoutButton(buttonElementId = 'logoutBtn', statusElementId = 'sessionStatus') {
  const logoutButton = document.getElementById(buttonElementId);
  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener('click', () => {
    logoutSession();
    refreshSessionStatus(statusElementId);
    showToast('Deconnexion reussie', 'success');
    window.location.href = './index.html';
  });
}

export function bindAuthForms() {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const input = {
      email: String(formData.get('email') || ''),
      pseudo: String(formData.get('pseudo') || ''),
      password: String(formData.get('password') || ''),
      role: String(formData.get('role') || 'Student'),
    };

    try {
      const data = await graphqlRequest(REGISTER_MUTATION, { input });
      showToast(`Utilisateur cree: ${data.createUser.email}`, 'success');
      form.reset();
      refreshSessionStatus();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const input = {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    };

    try {
      const data = await graphqlRequest(LOGIN_MUTATION, { input });
      setToken(data.login.token);
      setCurrentUser(data.login.user);
      refreshSessionStatus();
      showToast('Connexion reussie', 'success');
      setTimeout(() => {
        window.location.href = './users.html';
      }, 300);
    } catch (error) {
      logoutSession();
      refreshSessionStatus();
      showToast(error.message, 'error');
    }
  });

  refreshSessionStatus();
}
