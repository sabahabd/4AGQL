import { graphqlRequest } from '../api/graphql.js';
import { showToast } from '../ui/notify.js';
import { parseCsv, printJson } from '../utils/format.js';

const MY_GRADES_QUERY = `
  query MyGrades($courses: [String!]) {
    myGrades(courses: $courses) {
      course
      grades {
        id
        course
        value
        studentId
        classId
        createdAt
        updatedAt
      }
    }
  }
`;

export function bindMyGradesView() {
  const form = document.getElementById('myGradesForm');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawCourses = String(formData.get('courses') || '');
    const courses = parseCsv(rawCourses);

    try {
      const data = await graphqlRequest(MY_GRADES_QUERY, {
        courses: courses.length > 0 ? courses : undefined,
      });
      printJson('myGradesOutput', data.myGrades);
      showToast('Notes chargees', 'success');
    } catch (error) {
      printJson('myGradesOutput', { error: error.message });
      showToast(error.message, 'error');
    }
  });
}
