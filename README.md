# This is backend API between MetX games and Firebase

This API created using Express.js and node.js

1. Open terminal run 
  ```
  node index.js
  ```
2. Your api url will be 
  ```
  http://localhost:5000/
  ```
3. Go to Postman, import `Backend Node.js Firebase DB.postman_collection` to test the api.
4. Go to Backend Node.js Firebase DB -> Variables. Change or replace if needed.
5. Proceed tu `PUT Login` request. Click `Send`.
6. Copy the `token` from json return status.
7. Go to Backend Node.js Firebase DB -> Authorization. Click drop-down **Type** to `Bearer Token`.
8. Paste `token` you copied from return json in `PUT Login` to **Token**.
