import request from '../request.js';

(async () => {
  try {
    const response = await request.get('https://jsonplaceholder.typicode.com/todos');
    console.table(response); // Handle your success response here
  } catch (error) {
    console.error(error); // Handle your error response here.
  }
})();