import { graphqlRequest } from '../api/graphql.js';
import { showToast } from '../ui/notify.js';
import { parseOptionalNumber, printJson } from '../utils/format.js';

const ANALYTICS_QUERY = `
  query GradeAnalytics($filter: GradeAnalyticsFilterInput) {
    gradeAnalytics(filter: $filter) {
      statistics {
        count
        averageValue
        medianValue
        lowestGrade
        highestGrade
      }
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

export function bindAnalyticsView() {
  const form = document.getElementById('analyticsForm');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const filter = {
      studentId: parseOptionalNumber(formData.get('studentId')),
      course: String(formData.get('course') || '').trim() || undefined,
      classId: parseOptionalNumber(formData.get('classId')),
    };

    try {
      const data = await graphqlRequest(ANALYTICS_QUERY, { filter });
      printJson('analyticsOutput', data.gradeAnalytics);
      showToast('Analytics calculees', 'success');
    } catch (error) {
      printJson('analyticsOutput', { error: error.message });
      showToast(error.message, 'error');
    }
  });
}
