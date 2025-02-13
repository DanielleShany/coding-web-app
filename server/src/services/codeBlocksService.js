const CodeBlock = require('../models/CodeBlock');

const initializeCodeBlocks = async () => {
    console.log("🔄 Resetting database...");

    // ✅ Delete existing code blocks
    await CodeBlock.deleteMany({});

    // ✅ Insert detailed instruction blocks
    const initialBlocks = [
        {
            name: "Async Case",
            code: `// 🚀 TASK: Create an async function that returns 'Data fetched'.
// 🔹 1. Define an async function called fetchData.
// 🔹 2. Inside the function, use the 'return' statement to return the string 'Data fetched'.
// 🔹 3. Ensure the function is properly defined as 'async'.
// 🔹 4. Call fetchData() and log the result to the console.
`,
            solution: `async function fetchData() { return 'Data fetched'; }`
        },
        {
            name: "Promises",
            code: `// 🚀 TASK: Implement a function that returns a resolved promise with 'Task completed'.
// 🔹 1. Define a function called simulateTask.
// 🔹 2. Inside, return a new Promise that immediately resolves with 'Task completed'.
// 🔹 3. Call simulateTask(), then use .then() to log the result.
`,
            solution: `function simulateTask() { return new Promise((resolve) => resolve('Task completed')); }`
        },
        {
            name: "Loops",
            code: `// 🚀 TASK: Write a loop that prints numbers from 0 to 4.
// 🔹 1. Use a 'for' loop.
// 🔹 2. Initialize a variable (let i = 0).
// 🔹 3. Set a condition to run the loop while i is less than 5.
// 🔹 4. Log 'i' in each iteration.
// 🔹 5. Increment 'i' each time.
`,
            solution: `for (let i = 0; i < 5; i++) { console.log(i); }`
        },
        {
            name: "Functions",
            code: `// 🚀 TASK: Create a function that takes a name and returns 'Hello, [name]!'.
// 🔹 1. Define a function named 'greet'.
// 🔹 2. The function should take a 'name' parameter.
// 🔹 3. Inside, return the string 'Hello, name!' using template literals.
`,
            solution: `function greet(name) { return \`Hello, \${name}!\`; }`
        }
    ];

    await CodeBlock.insertMany(initialBlocks);
    console.log("✅ Database initialized with structured code blocks.");
};

const getCodeBlockById = async (id) => {
  return await CodeBlock.findById(id);
};

const updateCode = async (roomId, code) => {
  return await CodeBlock.findByIdAndUpdate(roomId, { code });
};

const getAllCodeBlocks = async () => {
  return await CodeBlock.find();
};

const createCodeBlock = async (name) => {
  const newBlock = new CodeBlock({ name, solution: "" });
  return await newBlock.save();
};

module.exports = { initializeCodeBlocks, getCodeBlockById, updateCode, getAllCodeBlocks, createCodeBlock };
