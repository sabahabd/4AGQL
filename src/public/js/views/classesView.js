import { graphqlRequest } from '../api/graphql.js';
import { showToast } from '../ui/notify.js';
import { parseOptionalNumber, printJson } from '../utils/format.js';

const CLASSES_QUERY = `
  query Classes($sortOrder: SortOrder) {
    classes(sortOrder: $sortOrder) {
      id
      name
      professorId
      students {
        id
        email
        pseudo
        role
      }
      createdAt
      updatedAt
    }
  }
`;

const CLASS_QUERY = `
  query OneClass($id: Int!) {
    class(id: $id) {
      id
      name
      professorId
      students {
        id
        email
        pseudo
        role
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_CLASS_MUTATION = `
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      id
      name
      professorId
      students {
        id
        email
        pseudo
        role
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_CLASS_MUTATION = `
  mutation UpdateClass($id: Int!, $input: UpdateClassInput!) {
    updateClass(id: $id, input: $input) {
      id
      name
      professorId
      students {
        id
        email
        pseudo
        role
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_CLASS_MUTATION = `
  mutation DeleteClass($id: Int!) {
    deleteClass(id: $id)
  }
`;

const ADD_STUDENT_TO_CLASS_MUTATION = `
  mutation AddStudentToClass($classId: Int!, $studentId: Int!) {
    addStudentToClass(classId: $classId, studentId: $studentId) {
      id
      name
      professorId
      students {
        id
        email
        pseudo
        role
      }
      createdAt
      updatedAt
    }
  }
`;

function output(data) {
  printJson('classesOutput', data);
}

export function bindClassesView() {
  const listForm = document.getElementById('listClassesForm');
  const getForm = document.getElementById('getClassForm');
  const createForm = document.getElementById('createClassForm');
  const updateForm = document.getElementById('updateClassForm');
  const deleteForm = document.getElementById('deleteClassForm');
  const addStudentForm = document.getElementById('addStudentToClassForm');

  listForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sortOrder = String(formData.get('sortOrder') || 'ASC');

    try {
      const data = await graphqlRequest(CLASSES_QUERY, { sortOrder });
      output(data.classes);
      showToast('Classes chargees', 'success');
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });

  getForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = Number(formData.get('id'));

    try {
      const data = await graphqlRequest(CLASS_QUERY, { id });
      output(data.class);
      showToast('Classe chargee', 'success');
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });

  createForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const input = {
      name: String(formData.get('name') || ''),
      professorId: parseOptionalNumber(formData.get('professorId')),
    };

    try {
      const data = await graphqlRequest(CREATE_CLASS_MUTATION, { input });
      output(data.createClass);
      showToast('Classe creee', 'success');
      form.reset();
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });

  updateForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const id = Number(formData.get('id'));
    const input = {
      name: String(formData.get('name') || '').trim() || undefined,
      professorId: parseOptionalNumber(formData.get('professorId')),
    };

    try {
      const data = await graphqlRequest(UPDATE_CLASS_MUTATION, { id, input });
      output(data.updateClass);
      showToast('Classe mise a jour', 'success');
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
      const data = await graphqlRequest(DELETE_CLASS_MUTATION, { id });
      output(data);
      showToast('Classe supprimee', 'success');
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });

  addStudentForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const classId = Number(formData.get('classId'));
    const studentId = Number(formData.get('studentId'));

    try {
      const data = await graphqlRequest(ADD_STUDENT_TO_CLASS_MUTATION, { classId, studentId });
      output(data.addStudentToClass);
      showToast('Etudiant ajoute a la classe', 'success');
    } catch (error) {
      output({ error: error.message });
      showToast(error.message, 'error');
    }
  });
}
