# **Tom's Online Coding Classroom**  

A real-time collaborative coding platform where students can practice JavaScript while Tom (the mentor) follows their progress.  

## **Features**  
✅ **Lobby Page** – Choose from predefined code blocks or create new ones.  
✅ **Code Block Page** – Students edit code in real-time; mentors observe.  
✅ **Live Updates** – Code changes sync instantly across users.  
✅ **Role Assignment** – The first user in a room is the mentor; others are students.  
✅ **Solution Check** – A smiley appears when the student's code matches the solution.  
✅ **Database-Backed** – Code blocks are stored in MongoDB for persistence.  

## **Code Blocks Solutions**
- **Async Case**
   : async function fetchData() { return 'Data fetched'; }
- **Promises**
   : function simulateTask() { return new Promise((resolve) => resolve('Task completed')); }
- **Loops**
   : for (let i = 0; i < 5; i++) { console.log(i); }
- **Functions**
   : function greet(name) { return \`Hello, \${name}!\`; }

  
## **Tech Stack**  
- **Frontend:** React, TypeScript, CodeMirror, Socket.io  
- **Backend:** Node.js, Express, Socket.io, MongoDB  
- **Deployment:** Client (Vercel), Server (Render)  

## **Setup & Run Locally**  
1. **Clone the repo:**  
   `git clone <repo-url>`  
   `cd <project-folder>`  

2. **Install dependencies:**  
   `npm install`  

3. **Start the server & client:**  
   `cd server && npm start`  
   `cd client && npm start`  

## **Links**  
🚀 **Live Demo**: [https://coding-web-ln7uw0zfl-danielleshanys-projects.vercel.app](https://coding-web-ln7uw0zfl-danielleshanys-projects.vercel.app)
 
