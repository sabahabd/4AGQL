import { graphqlRequest } from '../api/graphql.js';
import { showToast } from '../ui/notify.js';
import { parseOptionalNumber, printJson } from '../utils/format.js';

const CREATE_GRADE_MUTATION = `
  mutation CreateGrade($input: CreateGradeInput!) {
    createGrade(input: $input) {
      id
      course
      value
      studentId
      classId
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_GRADE_MUTATION = `
  mutation UpdateGrade($id: Int!, $input: UpdateGradeInput!) {
    updateGrade(id: $id, input: $input) {
      id
      course
      value
      studentId
      classId
      createdAt
      updatedAt
    }
  }
`;

const DELETE_GRADE_MUTATION = `
  mutation DeleteGrade($id: Int!) {
    deleteGrade(id: $id)
  }
`;

function output(data) {
  printJson('gradeCrudOutput', data);
}

export function bindGradeCrudView() {
  const createForm = document.getElementById('createGradeForm');
  const updateForm = document.getElementById('updateGradeForm');
  const deleteForm = document.getElementById('deleteGradeForm');

  createForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const input = {
      course: String(formData.get('course') || ''),
      value: Number(formData.get('value')),
      studentId: Number(formData.get('studentId')),
      classId: Number(formData.get('classId')),
    };

    try {
      const data = await graphqlRequest(CREATE_GRADE_MUTATION, { input });
      output(data.createGrade);
      showToast('Note creee', 'success');
      form.reset();
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });

  updateForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const id = Number(formData.get('id'));
    const input = {
      course: String(formData.get('course') || '').trim() || undefined,
      value: parseOptionalNumber(formData.get('value')),
      studentId: parseOptionalNumber(formData.get('studentId')),
      classId: parseOptionalNumber(formData.get('classId')),
    };

    try {
      const data = await graphqlRequest(UPDATE_GRADE_MUTATION, { id, input });
      output(data.updateGrade);
      showToast('Note mise a jour', 'success');
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });

  deleteForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = Number(formData.get('id'));

    try {
      const data = await graphqlRequest(DELETE_GRADE_MUTATION, { id });
      output(data);
      showToast('Note supprimee', 'success');
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });
}
