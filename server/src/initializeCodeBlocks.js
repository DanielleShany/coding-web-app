// server/src/initializeCodeBlocks.js

const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');

// MongoDB Connection
mongoose.connect('mongodb+srv://tomsClassroom:Thailand123@cluster0.abc123.mongodb.net/codingWebApp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Initial Code Blocks
const initialBlocks = [
  {
    name: "Async Case",
    code: `// TODO: Complete the async function to fetch data
async function fetchData() {
  // Your code here
}

fetchData();`,
    solution: `async function fetchData() {
  return "Data fetched successfully!";
}

fetchData();`,
  },
  {
    name: "Promises",
    code: `// TODO: Create a function that returns a Promise
function simulateTask() {
  // Your code here
}

simulateTask().then(result => console.log(result));`,
    solution: `function simulateTask() {
  return Promise.resolve("Task completed!");
}

simulateTask().then(result => console.log(result));`,
  },
  {
    name: "Loops",
    code: `// TODO: Print numbers from 1 to 5 using a loop
function printNumbers() {
  // Your code here
}

printNumbers();`,
    solution: `function printNumbers() {
  for (let i = 1; i <= 5; i++) {
    console.log(i);
  }
}

printNumbers();`,
  },
  {
    name: "Functions",
    code: `// TODO: Complete the greet function to return a greeting message
function greet(name) {
  // Your code here
}

console.log(greet("Tom"));`,
    solution: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Tom"));`,
  },
];

// Insert Function
const insertInitialBlocks = async () => {
  try {
    await CodeBlock.deleteMany({}); 
    await CodeBlock.insertMany(initialBlocks);
    console.log('✅ Initial code blocks inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting code blocks:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertInitialBlocks();
