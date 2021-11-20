### Setup the repository to your local environment.💌
1. `Fork` the repository  - Creates a replica of repository to your local environment.
2. Clone the repository - Downloads all repo files to your machine, using
  ```git
  git clone https://github.com/YOUR-USERNAME/code-sync
  ``` 
3. Set working directory to the root directory of the project.
  ```sh
  cd code-sync
  ```
## Frontend ⚛️

Following are the steps to run the frontend of the community-website on your local. All the frontend code will go in the `client` directory. 

1. Navigate to `client` folder.
  ```sh
  cd client
  ```
2. Install all the required packages and dependencies.
  ```node
  npm install
  ```
3. Rename ```.env.example``` to ```.env``` & Fill data as described.


## Backend 💻

Following are the steps to run the backend of the community-website on your local. All the backend code will go in the `@root` folder.

1. Install all the required packages and dependencies on ```@Root``` folder under ```code-sync``` directory.
  ```node
  npm install
  ```
2. Rename ```.env.example``` to ```.env``` & Fill data as described.
  
## Run/Compile ⏱️
 - If you wanna run frontend and backend at one time then you can run command
 
   ```node
   npm run dev
   ```
 - For Just Frontend/Client
 
   ```node
   npm run client
   ```
 - For Backend/Server
  
   ```node
   npm run server
   ```
 - Backend Run on port ```localhost:ENV_PORT``` & Frontend Run on ```localhost:3000```
