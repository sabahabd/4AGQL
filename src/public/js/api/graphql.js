import { getToken } from '../state/session.js';

export async function graphqlRequest(query, variables = {}) {
  const token = getToken();
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((item) => item.message).join('\n'));
  }

  return payload.data;
}
