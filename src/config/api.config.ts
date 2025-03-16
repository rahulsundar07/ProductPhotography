export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  workflowId: import.meta.env.VITE_WORKFLOW_ID,
  endpoints: {
    runs: '/api/v1/runs',
    output: '/api/v1/runs/output'
  },
  fields: {
    image: 'image_24294',
    text: 'text_71138'
  }
} as const;