# Javascript fetch handler

Handling the javascript fetch polyfill


## How to use

- If you try to get data with same origin, you will just add your path only. Don't need to mention absolute path of your router.

  **Examples**
  
  - GET REQUEST
  
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.get('/api/v1/user-details');
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```
    
    **Add query params along with get request**
    
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.get('/api/v1/user-details', { queryKey1: "queryValue1", queryKey2: "queryValue2" });
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```
    
  - POST REQUEST
  
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.post('/api/v1/user-details', { name: '<name>', position: '<position>' });
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```
    
  - UPDATE REQUEST
  
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.put('/api/v1/user-details/:id', { name: '<updated-name>', position: '<updated-position>' });
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```
    
  - DELETE REQUEST
  
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.delete('/api/v1/user-details/:id');
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```

- If you try to get data with different origin, You need to add full absolute path of your router,

  **Examples**
  
  - GET REQUEST
  
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.get('https://jsonplaceholder.typicode.com/todos');
        console.log(response); // Handle your success response here
      } catch (err) {
        console.error(error); // Handle your error response here.
      }

    }
    ```
    
    **Add query params along with get request**
    
    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.get('https://jsonplaceholder.typicode.com/todos', { queryKey1: "queryValue1", queryKey2: "queryValue2" });
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```
    
  - POST REQUEST

    ```javascript
    import request from './request';

    const getData = async () => {
      try {
        const response = await request.post('https://jsonplaceholder.typicode.com/todos', { title: '<title>' });
        console.log(response); // Handle your success response here.
      } catch (error) {
        console.error(error); // Handle your error response here.
      } 
    }
    ```
    
   - UPDATE REQUEST

      ```javascript
      import request from './request';

      const getData = async () => {
        try {
          const response = await request.put('https://jsonplaceholder.typicode.com/todos/:id', { title: '<updated-title>' });
          console.log(response); // Handle your success response here.
        } catch (error) {
          console.error(error); // Handle your error response here.
        } 
      }
      ```

    - DELETE REQUEST

      ```javascript
      import request from './request';

      const getData = async () => {
        try {
          const response = await request.delete('https://jsonplaceholder.typicode.com/todos/:id');
          console.log(response); // Handle your success response here.
        } catch (error) {
          console.error(error); // Handle your error response here.
        } 
      }
      ```
