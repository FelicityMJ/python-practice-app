import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  writeBatch,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
const AREAS = [
  {
    id: "sdd",
    shortTitle: "SDD",
    title: "Software Design and Development",
    description: "Python programming, problem solving, design notation, testing and evaluation.",
    order: 1,
    active: true
  },
  {
    id: "ddd",
    shortTitle: "DDD",
    title: "Database Design and Development",
    description: "Relational database design and SQL practice.",
    order: 2,
    active: false
  },
  {
    id: "cs",
    shortTitle: "CS",
    title: "Computer Systems",
    description: "Data representation, computer architecture, software and security theory.",
    order: 3,
    active: false
  }
];

const UNITS = [
  {
    "id": "sdd-python-01",
    "areaId": "sdd",
    "number": 1,
    "title": "Getting started",
    "description": "Sequence, print, strings, comments and reading Python errors.",
    "order": 1
  },
  {
    "id": "sdd-python-02",
    "areaId": "sdd",
    "number": 2,
    "title": "Variables and data types",
    "description": "Store, change and trace integer, real, string and Boolean values.",
    "order": 2
  },
  {
    "id": "sdd-python-03",
    "areaId": "sdd",
    "number": 3,
    "title": "Input and conversion",
    "description": "Receive values from the keyboard and convert them to suitable data types.",
    "order": 3
  },
  {
    "id": "sdd-python-04",
    "areaId": "sdd",
    "number": 4,
    "title": "Calculations and expressions",
    "description": "Arithmetic operators, order of operations, percentages and rounding.",
    "order": 4
  },
  {
    "id": "sdd-design-05",
    "areaId": "sdd",
    "number": 5,
    "title": "Program design representations",
    "description": "Read and translate pseudocode, flowcharts and structure diagrams.",
    "order": 5
  },
  {
    "id": "sdd-selection-06",
    "areaId": "sdd",
    "number": 6,
    "title": "Selection",
    "description": "Use if, elif and else with comparison operators to make decisions.",
    "order": 6
  },
  {
    "id": "sdd-logic-07",
    "areaId": "sdd",
    "number": 7,
    "title": "Logical operators",
    "description": "Build accurate conditions using AND, OR and NOT.",
    "order": 7
  },
  {
    "id": "sdd-functions-08",
    "areaId": "sdd",
    "number": 8,
    "title": "Predefined functions",
    "description": "Use length, round and random appropriately in programs and designs.",
    "order": 8
  },
  {
    "id": "sdd-loops-09",
    "areaId": "sdd",
    "number": 9,
    "title": "Fixed loops",
    "description": "Repeat code a known number of times using for and range.",
    "order": 9
  },
  {
    "id": "sdd-totals-10",
    "areaId": "sdd",
    "number": 10,
    "title": "Running totals and nested selection",
    "description": "Accumulate values efficiently and make a decision during each loop.",
    "order": 10
  },
  {
    "id": "sdd-while-11",
    "areaId": "sdd",
    "number": 11,
    "title": "Conditional loops",
    "description": "Repeat until a condition changes using while and a control variable.",
    "order": 11
  },
  {
    "id": "sdd-validation-12",
    "areaId": "sdd",
    "number": 12,
    "title": "Input validation",
    "description": "Reject invalid values and keep asking until acceptable data is entered.",
    "order": 12
  },
  {
    "id": "sdd-arrays-13",
    "areaId": "sdd",
    "number": 13,
    "title": "Arrays and storing values",
    "description": "Create, initialise, append to and update one-dimensional arrays.",
    "order": 13
  },
  {
    "id": "sdd-traversal-14",
    "areaId": "sdd",
    "number": 14,
    "title": "Traversing arrays",
    "description": "Visit every item, display values and calculate totals and averages.",
    "order": 14
  },
  {
    "id": "sdd-process-15",
    "areaId": "sdd",
    "number": 15,
    "title": "Software development process",
    "description": "Analysis, design, implementation, testing, documentation, evaluation and maintenance.",
    "order": 15
  },
  {
    "id": "sdd-testing-16",
    "areaId": "sdd",
    "number": 16,
    "title": "Testing",
    "description": "Select normal, extreme and exceptional data and predict expected results.",
    "order": 16
  },
  {
    "id": "sdd-errors-17",
    "areaId": "sdd",
    "number": 17,
    "title": "Errors and debugging",
    "description": "Identify syntax, execution and logic errors and repair realistic programs.",
    "order": 17
  },
  {
    "id": "sdd-evaluation-18",
    "areaId": "sdd",
    "number": 18,
    "title": "Evaluation and user interfaces",
    "description": "Evaluate fitness for purpose, efficiency, robustness, readability and interface design.",
    "order": 18
  },
  {
    "id": "sdd-capstone-19",
    "areaId": "sdd",
    "number": 19,
    "title": "Integrated exam mastery",
    "description": "Combine design, implementation, testing, debugging and evaluation in complete programs.",
    "order": 19
  }
];

const paper2025 = "https://www.sqa.org.uk/pastpapers/papers/papers/2025/N5_Computing-Science_QP_2025.pdf";

const lesson = (data) => ({ type: "lesson", required: true, estimatedMinutes: 5, ...data });
const quiz = (data) => ({ type: "quiz", required: true, estimatedMinutes: 5, ...data });
const code = (data) => ({ type: "code", required: true, estimatedMinutes: 10, hints: [], requirements: {}, ...data });
const exam = (data) => ({ type: "exam-style", required: true, estimatedMinutes: 8, ...data });
const official = (data) => ({ type: "official-paper", required: false, estimatedMinutes: 8, ...data });

const ACTIVITIES = [
  // UNIT 1 — GETTING STARTED
  lesson({
    id: "SDD-PY-01-01", areaId: "sdd", unitId: "sdd-python-01", order: 1,
    title: "Learn: Your first Python program", skills: ["sequence", "print", "strings"],
    videoTitle: "Teacher video: Your first Python program",
    videoUrl: "",
    contentHtml: `<p>Python normally carries out instructions from the top of the program to the bottom.</p>
      <pre class="lesson-code">print("Hello")\nprint("Welcome to Python")</pre>
      <p><code>print()</code> sends information to the screen. Text must be placed inside quotation marks.</p>
      <p>The video space is ready for your teacher to add an explanation. Until then, use the worked example above.</p>`,
    checkpoint: {
      prompt: "Which instruction displays the word Hello?",
      options: ["print(Hello)", "print(\"Hello\")", "Print(\"Hello\")"],
      answer: 1,
      explanation: "Text needs quotation marks and Python uses a lowercase p in print."
    }
  }),
  quiz({
    id: "SDD-PY-01-02", areaId: "sdd", unitId: "sdd-python-01", order: 2,
    title: "Check: Python syntax", skills: ["print", "syntax", "strings"],
    questions: [
      { prompt: "Which line is valid Python?", options: ["PRINT 'Hello'", "print(\"Hello\")", "display(Hello)"], answer: 1, explanation: "Python uses print followed by brackets. Text needs quotation marks." },
      { prompt: "What begins a comment in Python?", options: ["//", "#", "<!--"], answer: 1, explanation: "A Python comment begins with #." }
    ]
  }),
  quiz({
    id: "SDD-PY-01-03", areaId: "sdd", unitId: "sdd-python-01", order: 3,
    title: "Predict: Follow the sequence", skills: ["sequence", "predict-output"],
    type: "predict",
    codeSnippet: `print("First")\nprint("Second")\nprint("Third")`,
    questions: [
      { prompt: "What is displayed on the second line?", options: ["First", "Second", "Third"], answer: 1, explanation: "Instructions run from the top down." }
    ]
  }),
  code({
    id: "SDD-PY-01-04", areaId: "sdd", unitId: "sdd-python-01", order: 4,
    type: "visualiser", title: "Visualise: Three instructions", topic: "Getting started",
    skills: ["sequence", "print", "visualiser"],
    instructions: "Run the visualiser and watch the current line move through the program. The output should appear one line at a time.",
    starterCode: `print("Start")\nprint("Middle")\nprint("Finish")`,
    expectedOutput: "Start\nMiddle\nFinish",
    hints: ["Press Visualise, then use Next to move through the program."],
    requirements: { requiredCalls: ["print"], minPrintCalls: 3 }
  }),
  code({
    id: "SDD-PY-01-05", areaId: "sdd", unitId: "sdd-python-01", order: 5,
    title: "Practise: Display a welcome message", topic: "Getting started",
    skills: ["print", "strings"],
    instructions: "Write one line of Python that displays <code>Welcome to Computing Science</code>.",
    starterCode: `# Write your print instruction below\n`,
    expectedOutput: "Welcome to Computing Science",
    hints: ["Use print().", "Put the message inside quotation marks."],
    requirements: { requiredCalls: ["print"], requiredStringLiterals: ["Welcome to Computing Science"] }
  }),
  code({
    id: "SDD-PY-01-06", areaId: "sdd", unitId: "sdd-python-01", order: 6,
    type: "debug", title: "Debug: Fix the capital letter", topic: "Getting started",
    skills: ["debugging", "name-error", "print"],
    instructions: "This program should display <code>Hello</code>, but it contains an error. Run it, read the Python error, then fix it.",
    starterCode: `Print("Hello")`,
    expectedOutput: "Hello",
    hints: ["Python is case-sensitive.", "The print instruction begins with a lowercase p."],
    requirements: { requiredCalls: ["print"] }
  }),
  code({
    id: "SDD-PY-01-07", areaId: "sdd", unitId: "sdd-python-01", order: 7,
    title: "Apply: Create three lines of output", topic: "Getting started",
    skills: ["sequence", "print", "strings"],
    instructions: "Write a program that displays the following on three separate lines: <code>Python</code>, <code>is</code>, <code>powerful</code>.",
    starterCode: `# Write your program below\n`,
    expectedOutput: "Python\nis\npowerful",
    hints: ["Use three print instructions."],
    requirements: { requiredCalls: ["print"], minPrintCalls: 3 }
  }),
  quiz({
    id: "SDD-PY-01-08", areaId: "sdd", unitId: "sdd-python-01", order: 8,
    title: "Translate: Pseudocode to Python", skills: ["pseudocode", "translation", "print"],
    codeSnippet: `SEND "Ready" TO DISPLAY`,
    questions: [
      { prompt: "Which Python line correctly translates the pseudocode?", options: ["print(\"Ready\")", "input(\"Ready\")", "Ready = print"], answer: 0, explanation: "SEND ... TO DISPLAY is translated using print()." }
    ]
  }),
  exam({
    id: "SDD-PY-01-09", areaId: "sdd", unitId: "sdd-python-01", order: 9,
    title: "Exam practice: Improve readability", skills: ["readability", "comments", "identifiers"],
    questionHtml: `<p>A programmer has used no comments and has placed all instructions close together.</p><p><strong>State one other way the programmer could improve the readability of the code.</strong> <span class="mark-chip">1 mark</span></p>`,
    marks: 1,
    markingPoints: [
      "Use meaningful variable names or meaningful identifiers.",
      "Where the question provides variable names, refer to them directly and suggest a clearer replacement.",
      "Use suitable indentation where appropriate."
    ],
    modelAnswer: "Use **meaningful variable names** that describe what each value stores. For example, an unclear name such as abc could be replaced with total if it stores a total. This makes the code easier to understand."
  }),
  official({
    id: "SDD-PY-01-O1", areaId: "sdd", unitId: "sdd-python-01", order: 10,
    title: "Official paper: Readability", prerequisiteIds: ["SDD-PY-01-09"], skills: ["readability", "comments", "identifiers"],
    year: 2025, questionReference: "Question 3(b)", pageReference: "Paper page 3",
    officialUrl: `${paper2025}#page=3`,
    marks: 1,
    markingPoints: [
      "Refer to the unclear names abc and xyz and explain that they should be replaced with meaningful variable names.",
      "Give a suitable example linked to what the variable stores, such as total if abc stores a total or count if xyz stores a count.",
      "Use consistent indentation to make the program structure easier to follow."
    ],
    modelAnswer: "Replace unclear variable names such as abc and xyz with **meaningful variable names** that describe the data they store. For example, if abc stores a total, rename it total; if xyz stores a count, rename it count. This makes the program easier to read and understand.",
    description: "Open the official 2025 paper and attempt Question 3(b). The app links to the paper rather than reproducing the copyrighted question."
  }),

  // UNIT 2 — VARIABLES
  lesson({
    id: "SDD-PY-02-01", areaId: "sdd", unitId: "sdd-python-02", order: 1,
    title: "Learn: Variables and assignment", skills: ["variables", "assignment", "data-types"],
    videoTitle: "Teacher video: Variables and data types",
    videoUrl: "",
    contentHtml: `<p>A variable is a named place used to store a value.</p>
      <pre class="lesson-code">score = 7\nname = "Ava"\nprice = 4.50</pre>
      <p>The equals sign assigns the value on the right to the variable on the left.</p>`,
    checkpoint: { prompt: "After score = 7, what value is stored in score?", options: ["score", "7", "="], answer: 1, explanation: "The value 7 is assigned to score." }
  }),
  quiz({
    id: "SDD-PY-02-02", areaId: "sdd", unitId: "sdd-python-02", order: 2,
    title: "Check: Choose the data type", skills: ["data-types", "integer", "real", "string", "boolean"],
    questions: [
      { prompt: "Which data type is most suitable for a person's age?", options: ["Integer", "Real", "String"], answer: 0, explanation: "Age in whole years is stored as an integer." },
      { prompt: "Which data type is most suitable for a price such as 4.50?", options: ["Integer", "Real", "Boolean"], answer: 1, explanation: "A real number can contain a decimal part." },
      { prompt: "Which data type stores True or False?", options: ["String", "Boolean", "Character"], answer: 1, explanation: "A Boolean stores one of two logical values." }
    ]
  }),
  quiz({
    id: "SDD-PY-02-03", areaId: "sdd", unitId: "sdd-python-02", order: 3,
    type: "predict", title: "Predict: A variable changes", skills: ["variables", "assignment", "predict-output"],
    codeSnippet: `score = 5\nscore = 9\nprint(score)`,
    questions: [
      { prompt: "What is displayed?", options: ["5", "9", "score"], answer: 1, explanation: "The second assignment replaces the previous value." }
    ]
  }),
  code({
    id: "SDD-PY-02-04", areaId: "sdd", unitId: "sdd-python-02", order: 4,
    type: "visualiser", title: "Visualise: Watch a variable change", topic: "Variables",
    skills: ["variables", "assignment", "visualiser"],
    instructions: "Use Visualise to watch <code>score</code> change from 5 to 8.",
    starterCode: `score = 5\nscore = score + 3\nprint(score)`,
    expectedOutput: "8",
    hints: ["Look at the Variables table after each step."],
    requirements: { assignments: { score: 5 }, updatesVariable: "score", requiredCalls: ["print"] }
  }),
  code({
    id: "SDD-PY-02-05", areaId: "sdd", unitId: "sdd-python-02", order: 5,
    title: "Practise: Calculate a total", topic: "Variables",
    skills: ["variables", "addition", "output"],
    instructions: "Create variables called <code>score</code> and <code>bonus</code>. Set them to 7 and 3, then calculate and print their total.",
    starterCode: `score = 7\nbonus = 3\n\n# Calculate and print the total below\n`,
    expectedOutput: "10",
    hints: ["Use the + operator.", "Use both variable names in the calculation."],
    requirements: { assignments: { score: 7, bonus: 3 }, binOperation: { operator: "Add", names: ["score", "bonus"] } }
  }),
  code({
    id: "SDD-PY-02-06", areaId: "sdd", unitId: "sdd-python-02", order: 6,
    type: "debug", title: "Debug: Variable names are case-sensitive", topic: "Variables",
    skills: ["variables", "debugging", "name-error"],
    instructions: "Fix the program so it calculates and displays 10.",
    starterCode: `score = 7\nbonus = 3\nprint(Score + bonus)`,
    expectedOutput: "10",
    hints: ["Compare Score with score.", "Python treats capital and lowercase letters as different."],
    requirements: { assignments: { score: 7, bonus: 3 }, binOperation: { operator: "Add", names: ["score", "bonus"] } }
  }),
  code({
    id: "SDD-PY-02-07", areaId: "sdd", unitId: "sdd-python-02", order: 7,
    title: "Apply: Calculate the total cost", topic: "Variables",
    skills: ["variables", "multiplication", "output"],
    instructions: "Create <code>price</code> with the value 8 and <code>quantity</code> with the value 4. Multiply them and print the total cost.",
    starterCode: `# Create your variables and calculation below\n`,
    expectedOutput: "32",
    hints: ["Python uses * for multiplication."],
    requirements: { assignments: { price: 8, quantity: 4 }, binOperation: { operator: "Mult", names: ["price", "quantity"] } }
  }),
  quiz({
    id: "SDD-PY-02-08", areaId: "sdd", unitId: "sdd-python-02", order: 8,
    title: "Translate: Assignment pseudocode", skills: ["pseudocode", "assignment", "translation"],
    codeSnippet: `SET score TO 7`,
    questions: [
      { prompt: "Which Python line is the correct translation?", options: ["7 = score", "score == 7", "score = 7"], answer: 2, explanation: "Python places the variable on the left and the assigned value on the right." }
    ]
  }),
  exam({
    id: "SDD-PY-02-09", areaId: "sdd", unitId: "sdd-python-02", order: 9,
    title: "Exam practice: Trace a calculation", skills: ["variables", "assignment", "calculation"],
    questionHtml: `<pre class="lesson-code">SET number TO 4\nSET answer TO number ^ 2</pre><p><strong>State the value stored in answer.</strong> <span class="mark-chip">1 mark</span></p>`,
    marks: 1,
    markingPoints: ["16"],
    modelAnswer: "16"
  }),
  official({
    id: "SDD-PY-02-O1", areaId: "sdd", unitId: "sdd-python-02", order: 10,
    title: "Official paper: Data types", prerequisiteIds: ["SDD-PY-02-02"], skills: ["data-types", "integer", "string"],
    year: 2025, questionReference: "Question 7(a)", pageReference: "Paper page 4",
    officialUrl: `${paper2025}#page=4`,
    marks: 2,
    markingPoints: [
      "passengerAge should use the integer data type.",
      "destination should use the string data type."
    ],
    modelAnswer: "passengerAge: integer; destination: string.",
    description: "Open the official 2025 paper and attempt Question 7(a), which asks you to select suitable data types."
  }),

  // UNIT 3 — INPUT
  lesson({
    id: "SDD-PY-03-01", areaId: "sdd", unitId: "sdd-python-03", order: 1,
    title: "Learn: Keyboard input", skills: ["input", "conversion", "data-types"],
    videoTitle: "Teacher video: Input and conversion",
    videoUrl: "",
    contentHtml: `<p><code>input()</code> receives text from the keyboard.</p>
      <pre class="lesson-code">name = input("Enter your name: ")\nage = int(input("Enter your age: "))</pre>
      <p>Use <code>int()</code> or <code>float()</code> when the value will be used as a number.</p>`,
    checkpoint: { prompt: "Why is int() used around the age input?", options: ["To display the age", "To convert the text to an integer", "To repeat the input"], answer: 1, explanation: "input() gives text; int() converts suitable text into an integer." }
  }),
  quiz({
    id: "SDD-PY-03-02", areaId: "sdd", unitId: "sdd-python-03", order: 2,
    title: "Check: Input and conversion", skills: ["input", "int", "float", "string"],
    questions: [
      { prompt: "What data type does input() return before conversion?", options: ["String", "Integer", "Boolean"], answer: 0, explanation: "Keyboard input begins as text." },
      { prompt: "Which function converts suitable text to a whole number?", options: ["str()", "float()", "int()"], answer: 2, explanation: "int() converts suitable text to an integer." }
    ]
  }),
  quiz({
    id: "SDD-PY-03-03", areaId: "sdd", unitId: "sdd-python-03", order: 3,
    type: "predict", title: "Predict: Input without conversion", skills: ["input", "type-error", "predict-error"],
    codeSnippet: `age = input("Age: ")\nnextAge = age + 1\nprint(nextAge)`,
    questions: [
      { prompt: "What is most likely to happen when this program runs?", options: ["It displays the next age", "A TypeError occurs", "It always displays 1"], answer: 1, explanation: "age is a string, so Python cannot add the integer 1 to it." }
    ]
  }),
  code({
    id: "SDD-PY-03-04", areaId: "sdd", unitId: "sdd-python-03", order: 4,
    type: "visualiser", title: "Visualise: Receive and display a name", topic: "Input",
    skills: ["input", "string", "visualiser"],
    instructions: "The app will supply the test input <code>Ava</code>. Use Visualise to see when the variable <code>name</code> is created.",
    starterCode: `name = input("Name: ")\nprint("Hello", name)`,
    sampleInputs: ["Ava"],
    expectedOutput: "Name: Ava\nHello Ava",
    tests: [
      { inputs: ["Ava"], expectedOutput: "Name: Ava\nHello Ava" },
      { inputs: ["Sam"], expectedOutput: "Name: Sam\nHello Sam" }
    ],
    hints: ["Press Visualise and inspect name in the Variables table."],
    requirements: { requiredCalls: ["input", "print"], requiredPrintNames: ["name"] }
  }),
  code({
    id: "SDD-PY-03-05", areaId: "sdd", unitId: "sdd-python-03", order: 5,
    title: "Practise: Input an age", topic: "Input",
    skills: ["input", "integer", "conversion"],
    instructions: "Ask the user to enter their age, convert it to an integer and display the age. The app will test more than one value.",
    starterCode: `# Ask for an age and store it in age\n`,
    sampleInputs: ["14"],
    expectedOutput: "Enter age: 14\n14",
    tests: [
      { inputs: ["14"], expectedOutput: "Enter age: 14\n14" },
      { inputs: ["42"], expectedOutput: "Enter age: 42\n42" }
    ],
    hints: ["Use int(input(...)).", "Print the variable age."],
    requirements: { requiredCalls: ["input", "int", "print"], requiredPrintNames: ["age"] }
  }),
  code({
    id: "SDD-PY-03-06", areaId: "sdd", unitId: "sdd-python-03", order: 6,
    type: "debug", title: "Debug: Convert before calculating", topic: "Input",
    skills: ["input", "conversion", "type-error", "debugging"],
    instructions: "This program should display the user's age next year. The app supplies 14, so the sample output should end with 15. Fix the error.",
    starterCode: `age = input("Age: ")\nnextAge = age + 1\nprint(nextAge)`,
    sampleInputs: ["14"],
    expectedOutput: "Age: 14\n15",
    tests: [
      { inputs: ["14"], expectedOutput: "Age: 14\n15" },
      { inputs: ["30"], expectedOutput: "Age: 30\n31" }
    ],
    hints: ["input() returns a string.", "Convert the input using int()."],
    requirements: { requiredCalls: ["input", "int", "print"] }
  }),
  code({
    id: "SDD-PY-03-07", areaId: "sdd", unitId: "sdd-python-03", order: 7,
    title: "Apply: Price and quantity", topic: "Input",
    skills: ["input", "float", "integer", "multiplication"],
    instructions: "Ask for a price as a real number and a quantity as an integer. Calculate and display the total cost.",
    starterCode: `# Receive price and quantity, then display the total\n`,
    sampleInputs: ["2.5", "4"],
    expectedOutput: "Price: 2.5\nQuantity: 4\n10.0",
    tests: [
      { inputs: ["2.5", "4"], expectedOutput: "Price: 2.5\nQuantity: 4\n10.0" },
      { inputs: ["3.75", "2"], expectedOutput: "Price: 3.75\nQuantity: 2\n7.5" }
    ],
    hints: ["Use float() for price.", "Use int() for quantity.", "Multiply the two variables."],
    requirements: { requiredCalls: ["input", "float", "int", "print"], binOperation: { operator: "Mult", names: ["price", "quantity"] } }
  }),
  quiz({
    id: "SDD-PY-03-08", areaId: "sdd", unitId: "sdd-python-03", order: 8,
    title: "Translate: RECEIVE from keyboard", skills: ["pseudocode", "input", "translation"],
    codeSnippet: `RECEIVE age FROM (INTEGER) KEYBOARD`,
    questions: [
      { prompt: "Which Python line is the best translation?", options: ["age = input(\"Age: \" )", "age = int(input(\"Age: \"))", "print(age)"], answer: 1, explanation: "The pseudocode specifies INTEGER, so the keyboard input should be converted using int()." }
    ]
  }),
  exam({
    id: "SDD-PY-03-09", areaId: "sdd", unitId: "sdd-python-03", order: 9,
    title: "Exam practice: Identify inputs, processes and outputs", skills: ["analysis", "input", "process", "output"],
    questionHtml: `<p>A program asks for a pupil's name and two test marks. It calculates the total and displays the pupil's name and total.</p><p><strong>Identify one input, one process and one output.</strong> <span class="mark-chip">3 marks</span></p>`,
    marks: 3,
    markingPoints: ["Input: pupil name or either test mark.", "Process: add the two marks / calculate the total.", "Output: pupil name or total displayed."],
    modelAnswer: "Input: the two test marks. Process: add the marks. Output: display the pupil's name and total."
  }),
  official({
    id: "SDD-PY-03-O1", areaId: "sdd", unitId: "sdd-python-03", order: 10,
    title: "Official paper: Inputs, processes and outputs", prerequisiteIds: ["SDD-PY-03-09"], skills: ["analysis", "input", "process", "output"],
    year: 2025, questionReference: "Question 10(a)", pageReference: "Paper page 8",
    officialUrl: `${paper2025}#page=8`,
    marks: 3,
    markingPoints: [
      "Check that the username exists.",
      "Check that the password entered matches the user's password and has the required length.",
      "Validate that the gift-card number exists or is valid.",
      "Calculate or update the account balance using the gift-card value."
    ],
    modelAnswer: "Check that the username exists, check that the password matches the user's stored password, validate the gift-card number, and add the card value to update the account balance. Any three suitable processes would gain the three marks.",
    description: "Open the official 2025 paper and attempt Question 10(a), which asks you to identify program processes."
  }),

  // UNIT 4 — CALCULATIONS
  lesson({
    id: "SDD-PY-04-01", areaId: "sdd", unitId: "sdd-python-04", order: 1,
    title: "Learn: Arithmetic expressions", skills: ["arithmetic", "operators", "rounding"],
    videoTitle: "Teacher video: Calculations and expressions",
    videoUrl: "",
    contentHtml: `<p>Python uses <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code> for the main calculations.</p>
      <pre class="lesson-code">total = price * quantity\naverage = (mark1 + mark2) / 2\nrounded = round(average, 1)</pre>
      <p>Brackets make the intended order of operations clear.</p>`,
    checkpoint: { prompt: "Which operator is used for multiplication?", options: ["x", "*", "^"], answer: 1, explanation: "Python uses an asterisk for multiplication." }
  }),
  quiz({
    id: "SDD-PY-04-02", areaId: "sdd", unitId: "sdd-python-04", order: 2,
    title: "Check: Select the operator", skills: ["arithmetic", "operators"],
    questions: [
      { prompt: "Which expression divides total by count?", options: ["total / count", "total : count", "total \\ count"], answer: 0, explanation: "Python uses / for division." },
      { prompt: "Which expression squares number?", options: ["number * 2", "number ** 2", "number / 2"], answer: 1, explanation: "Python uses ** for exponentiation." }
    ]
  }),
  quiz({
    id: "SDD-PY-04-03", areaId: "sdd", unitId: "sdd-python-04", order: 3,
    type: "predict", title: "Predict: Order of operations", skills: ["arithmetic", "order-of-operations", "predict-output"],
    codeSnippet: `answer = 2 + 3 * 4\nprint(answer)`,
    questions: [
      { prompt: "What is displayed?", options: ["20", "14", "24"], answer: 1, explanation: "Multiplication is completed before addition." }
    ]
  }),
  code({
    id: "SDD-PY-04-04", areaId: "sdd", unitId: "sdd-python-04", order: 4,
    type: "visualiser", title: "Visualise: Build an average", topic: "Calculations",
    skills: ["variables", "addition", "division", "visualiser"],
    instructions: "Use Visualise to see the total created before the average.",
    starterCode: `test1 = 12\ntest2 = 18\ntotal = test1 + test2\naverage = total / 2\nprint(average)`,
    expectedOutput: "15.0",
    hints: ["Watch total and average appear in the Variables table."],
    requirements: { assignments: { test1: 12, test2: 18 }, requiredNamesInCalculation: ["test1", "test2"], requiredOperators: ["Add", "Div"] }
  }),
  code({
    id: "SDD-PY-04-05", areaId: "sdd", unitId: "sdd-python-04", order: 5,
    title: "Practise: Rectangle area", topic: "Calculations",
    skills: ["variables", "multiplication", "area"],
    instructions: "Create <code>length</code> as 8 and <code>width</code> as 5. Calculate and print the area.",
    starterCode: `length = 8\nwidth = 5\n\n# Calculate and display the area\n`,
    expectedOutput: "40",
    hints: ["Area is length multiplied by width."],
    requirements: { assignments: { length: 8, width: 5 }, binOperation: { operator: "Mult", names: ["length", "width"] } }
  }),
  code({
    id: "SDD-PY-04-06", areaId: "sdd", unitId: "sdd-python-04", order: 6,
    type: "debug", title: "Debug: Calculate the average correctly", topic: "Calculations",
    skills: ["average", "brackets", "debugging"],
    instructions: "The program should display 15.0. Fix the calculation so both marks are added before dividing by 2.",
    starterCode: `mark1 = 12\nmark2 = 18\naverage = mark1 + mark2 / 2\nprint(average)`,
    expectedOutput: "15.0",
    hints: ["Use brackets around the addition."],
    requirements: { assignments: { mark1: 12, mark2: 18 }, requiredNamesInCalculation: ["mark1", "mark2"], requiredOperators: ["Add", "Div"] }
  }),
  code({
    id: "SDD-PY-04-07", areaId: "sdd", unitId: "sdd-python-04", order: 7,
    title: "Apply: Calculate and round an average", topic: "Calculations",
    skills: ["input", "average", "rounding"],
    instructions: "Ask for two real test marks, calculate their average and display it rounded to one decimal place.",
    starterCode: `# Receive two marks, calculate the average and round it\n`,
    sampleInputs: ["13.5", "17.0"],
    expectedOutput: "First mark: 13.5\nSecond mark: 17.0\n15.3",
    tests: [
      { inputs: ["13.5", "17.0"], expectedOutput: "First mark: 13.5\nSecond mark: 17.0\n15.3" },
      { inputs: ["10", "11"], expectedOutput: "First mark: 10\nSecond mark: 11\n10.5" }
    ],
    hints: ["Use float() for each input.", "Add the marks and divide by 2.", "Use round(average, 1)."],
    requirements: { requiredCalls: ["input", "float", "round", "print"], requiredOperators: ["Add", "Div"] }
  }),
  quiz({
    id: "SDD-PY-04-08", areaId: "sdd", unitId: "sdd-python-04", order: 8,
    title: "Translate: Calculation pseudocode", skills: ["pseudocode", "calculation", "translation"],
    codeSnippet: `SET total TO price * quantity`,
    questions: [
      { prompt: "Which Python line is the correct translation?", options: ["total = price * quantity", "price * quantity = total", "print(price, quantity)"], answer: 0, explanation: "The result of the multiplication is assigned to total." }
    ]
  }),
  exam({
    id: "SDD-PY-04-09", areaId: "sdd", unitId: "sdd-python-04", order: 9,
    title: "Exam practice: Explain a calculation", skills: ["calculation", "variables", "explanation"],
    questionHtml: `<pre class="lesson-code">basicCost = timeInSeconds * animatorCharge</pre><p><strong>Describe how the value assigned to basicCost is created.</strong> <span class="mark-chip">1 mark</span></p>`,
    marks: 1,
    markingPoints: ["The value in timeInSeconds is multiplied by the value in animatorCharge, and the result is assigned to basicCost."],
    modelAnswer: "The program multiplies timeInSeconds by animatorCharge and stores the result in basicCost."
  }),
  official({
    id: "SDD-PY-04-O1", areaId: "sdd", unitId: "sdd-python-04", order: 10,
    title: "Official paper: Calculation and assignment", prerequisiteIds: ["SDD-PY-04-03"], skills: ["calculation", "assignment", "exponentiation"],
    year: 2025, questionReference: "Question 3(a)", pageReference: "Paper page 3",
    officialUrl: `${paper2025}#page=3`,
    marks: 1,
    markingPoints: ["Square the entered value: 3 × 3 = 9."],
    modelAnswer: "9",
    description: "Open the official 2025 paper and attempt Question 3(a), which asks you to trace a calculation and state the stored value."
  }),

  // UNIT 5 — PROGRAM DESIGN REPRESENTATIONS
  lesson({
    id: "SDD-DES-05-01", areaId: "sdd", unitId: "sdd-design-05", order: 1,
    title: "Learn: Three ways to design a program", skills: ["pseudocode", "flowcharts", "structure-diagrams", "design"],
    videoTitle: "Teacher video: Pseudocode, flowcharts and structure diagrams",
    videoUrl: "",
    contentHtml: `<p>Before writing Python, a program can be planned using different design representations.</p>
      <div class="representation-grid">
        <article class="representation-card"><h4>Pseudocode</h4><pre class="lesson-code">RECEIVE score FROM (INTEGER) KEYBOARD
SET doubled TO score * 2
SEND doubled TO DISPLAY</pre><p>Written instructions using standard design words.</p></article>
        <article class="representation-card"><h4>Flowchart</h4>
          <svg class="design-svg" viewBox="0 0 360 270" role="img" aria-label="Flowchart showing start, receive score, double score, display doubled, end">
            <ellipse cx="180" cy="25" rx="55" ry="20" class="flow-start-end"></ellipse><text x="180" y="31" text-anchor="middle">Start</text>
            <line x1="180" y1="45" x2="180" y2="68" class="flow-line"></line><polygon points="174,62 186,62 180,70" class="flow-arrow"></polygon>
            <polygon points="95,72 285,72 265,112 75,112" class="flow-input-output"></polygon><text x="180" y="96" text-anchor="middle">Receive score</text>
            <line x1="180" y1="112" x2="180" y2="132" class="flow-line"></line><polygon points="174,126 186,126 180,134" class="flow-arrow"></polygon>
            <rect x="95" y="136" width="170" height="40" rx="4" class="flow-process"></rect><text x="180" y="161" text-anchor="middle">doubled = score × 2</text>
            <line x1="180" y1="176" x2="180" y2="196" class="flow-line"></line><polygon points="174,190 186,190 180,198" class="flow-arrow"></polygon>
            <polygon points="95,202 285,202 265,242 75,242" class="flow-input-output"></polygon><text x="180" y="226" text-anchor="middle">Display doubled</text>
            <line x1="180" y1="242" x2="180" y2="252" class="flow-line"></line>
          </svg><p>Symbols and arrows show the order of operations.</p></article>
        <article class="representation-card"><h4>Structure diagram</h4>
          <svg class="design-svg" viewBox="0 0 420 210" role="img" aria-label="Structure diagram with main program and three submodules">
            <rect x="120" y="15" width="180" height="44" rx="7" class="structure-node-main"></rect><text x="210" y="42" text-anchor="middle">Double a score</text>
            <line x1="210" y1="59" x2="210" y2="91" class="structure-line"></line><line x1="70" y1="91" x2="350" y2="91" class="structure-line"></line>
            <line x1="70" y1="91" x2="70" y2="112" class="structure-line"></line><line x1="210" y1="91" x2="210" y2="112" class="structure-line"></line><line x1="350" y1="91" x2="350" y2="112" class="structure-line"></line>
            <rect x="10" y="112" width="120" height="50" rx="7" class="structure-node"></rect><text x="70" y="141" text-anchor="middle">Get score</text>
            <rect x="145" y="112" width="130" height="50" rx="7" class="structure-node"></rect><text x="210" y="135" text-anchor="middle"><tspan x="210">Calculate</tspan><tspan x="210" dy="17">doubled</tspan></text>
            <rect x="290" y="112" width="120" height="50" rx="7" class="structure-node"></rect><text x="350" y="135" text-anchor="middle"><tspan x="350">Display</tspan><tspan x="350" dy="17">answer</tspan></text>
          </svg><p>A hierarchy breaks the solution into smaller modules.</p></article>
      </div>`,
    checkpoint: {
      prompt: "Which representation uses connected symbols and arrows?",
      options: ["Flowchart", "Pseudocode", "Structure diagram"],
      answer: 0,
      explanation: "A flowchart uses symbols connected by arrows to show the sequence and decisions."
    }
  }),
  quiz({
    id: "SDD-DES-05-02", areaId: "sdd", unitId: "sdd-design-05", order: 2,
    title: "Check: Read pseudocode", skills: ["pseudocode", "sequence", "translation"],
    codeSnippet: `RECEIVE number FROM (INTEGER) KEYBOARD
SET answer TO number + 5
SEND answer TO DISPLAY`,
    questions: [
      { prompt: "Which instruction is the process?", options: ["RECEIVE number FROM (INTEGER) KEYBOARD", "SET answer TO number + 5", "SEND answer TO DISPLAY"], answer: 1, explanation: "The SET instruction performs the calculation and stores the result." },
      { prompt: "Which Python line translates the first instruction?", options: [`number = int(input("Number: "))`, "print(number)", "number = number + 5"], answer: 0, explanation: "The pseudocode receives an integer from the keyboard." }
    ]
  }),
  quiz({
    id: "SDD-DES-05-03", areaId: "sdd", unitId: "sdd-design-05", order: 3,
    title: "Check: Flowchart symbols", skills: ["flowcharts", "symbols", "design"],
    questions: [
      { prompt: "Which flowchart symbol represents a decision?", options: ["Diamond", "Rectangle", "Parallelogram"], answer: 0, explanation: "A diamond represents a decision or condition." },
      { prompt: "Which symbol normally represents input or output?", options: ["Parallelogram", "Diamond", "Oval"], answer: 0, explanation: "A parallelogram represents input or output." }
    ]
  }),
  quiz({
    id: "SDD-DES-05-04", areaId: "sdd", unitId: "sdd-design-05", order: 4,
    type: "predict", title: "Read: Follow a flowchart", skills: ["flowcharts", "sequence", "trace-design"],
    codeSnippet: `START
RECEIVE age
SET nextAge TO age + 1
SEND nextAge TO DISPLAY
END`,
    questions: [
      { prompt: "If age is 14, what is displayed?", options: ["14", "15", "141"], answer: 1, explanation: "The process adds 1 before the value is displayed." }
    ]
  }),
  lesson({
    id: "SDD-DES-05-05", areaId: "sdd", unitId: "sdd-design-05", order: 5,
    title: "Learn: Read a structure diagram", skills: ["structure-diagrams", "modules", "decomposition"],
    contentHtml: `<p>A structure diagram shows how a problem is divided into modules. The main module appears at the top and smaller submodules appear beneath it.</p>
      <svg class="design-svg wide-design-svg" viewBox="0 0 620 245" role="img" aria-label="Structure diagram for calculate class average">
        <rect x="205" y="15" width="210" height="48" rx="7" class="structure-node-main"></rect><text x="310" y="44" text-anchor="middle">Calculate class average</text>
        <line x1="310" y1="63" x2="310" y2="100" class="structure-line"></line><line x1="90" y1="100" x2="530" y2="100" class="structure-line"></line>
        <line x1="90" y1="100" x2="90" y2="125" class="structure-line"></line><line x1="310" y1="100" x2="310" y2="125" class="structure-line"></line><line x1="530" y1="100" x2="530" y2="125" class="structure-line"></line>
        <rect x="15" y="125" width="150" height="55" rx="7" class="structure-node"></rect><text x="90" y="157" text-anchor="middle">Get marks</text>
        <rect x="225" y="125" width="170" height="55" rx="7" class="structure-node"></rect><text x="310" y="157" text-anchor="middle">Calculate average</text>
        <rect x="455" y="125" width="150" height="55" rx="7" class="structure-node"></rect><text x="530" y="151" text-anchor="middle"><tspan x="530">Display</tspan><tspan x="530" dy="18">average</tspan></text>
      </svg>
      <p>The diagram shows decomposition. It does not show every Python instruction or the exact order inside each module.</p>`,
    checkpoint: { prompt: "Which module performs the calculation?", options: ["Get marks", "Calculate average", "Display average"], answer: 1, explanation: "The module name states that it calculates the average." }
  }),
  quiz({
    id: "SDD-DES-05-06", areaId: "sdd", unitId: "sdd-design-05", order: 6,
    title: "Check: Structure diagrams", skills: ["structure-diagrams", "modules", "decomposition"],
    questions: [
      { prompt: "What does the top box normally represent?", options: ["The main problem or main module", "A single variable", "An error message"], answer: 0, explanation: "The top box represents the overall problem or main module." },
      { prompt: "What do the boxes beneath the main module represent?", options: ["Smaller submodules", "Python comments", "Test data only"], answer: 0, explanation: "The lower boxes show the smaller modules used to solve the main problem." }
    ]
  }),
  exam({
    id: "SDD-DES-05-07", areaId: "sdd", unitId: "sdd-design-05", order: 7,
    title: "Exam practice: Choose a design representation", skills: ["pseudocode", "flowcharts", "structure-diagrams", "comparison"],
    questionHtml: `<p>A programmer wants to show how a large problem is divided into smaller modules.</p><p><strong>State the most suitable design representation and explain why.</strong> <span class="mark-chip">2 marks</span></p>`,
    marks: 2,
    markingPoints: ["State structure diagram.", "Explain that it shows the hierarchy or decomposition into smaller modules."],
    modelAnswer: "Use a **structure diagram** because it shows how the main problem is decomposed into smaller modules."
  })
,

  {
    "id": "SDD-PY-06-01",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Decisions with if, elif and else",
    "skills": [
      "selection",
      "if",
      "elif",
      "else",
      "comparison-operators"
    ],
    "videoTitle": "Teacher explanation: Decisions with if, elif and else",
    "videoUrl": "",
    "contentHtml": "<p>Selection lets a program follow different paths.</p><pre class=\"lesson-code\">mark = 64\nif mark &gt;= 70:\n    print(\"A\")\nelif mark &gt;= 60:\n    print(\"B\")\nelse:\n    print(\"Below B\")</pre><p>Python checks conditions from top to bottom. Once one condition is true, its indented block runs and the remaining branches are skipped.</p><div class=\"trigger-box\"><strong>Question clues:</strong> if, depending on, only when, otherwise.</div>",
    "checkpoint": {
      "prompt": "What happens after the first true branch in an if/elif/else statement?",
      "options": [
        "Every remaining condition is checked",
        "The branch runs and the remaining branches are skipped",
        "The program always runs else"
      ],
      "answer": 1,
      "explanation": "Only the first matching branch runs."
    }
  },
  {
    "id": "SDD-PY-06-02",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Comparison operators",
    "skills": [
      "selection",
      "comparison-operators"
    ],
    "questions": [
      {
        "prompt": "Which operator means equal to?",
        "options": [
          "=",
          "==",
          "!="
        ],
        "answer": 1,
        "explanation": "A single = assigns. A double == compares."
      },
      {
        "prompt": "Which operator means at least 18?",
        "options": [
          "> 18",
          ">= 18",
          "<= 18"
        ],
        "answer": 1,
        "explanation": "At least includes 18, so use >=."
      },
      {
        "prompt": "Which operator means not equal to?",
        "options": [
          "!=",
          "==",
          "<>"
        ],
        "answer": 0,
        "explanation": "Python uses != for not equal."
      }
    ]
  },
  {
    "id": "SDD-PY-06-03",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Which branch runs?",
    "skills": [
      "selection",
      "trace-code",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed?",
        "options": [
          "Low",
          "Medium",
          "High"
        ],
        "answer": 1,
        "explanation": "650 is not below 300, but it is at most 1200, so the elif branch runs."
      }
    ],
    "codeSnippet": "watts = 650\nif watts < 300:\n    print(\"Low\")\nelif watts <= 1200:\n    print(\"Medium\")\nelse:\n    print(\"High\")"
  },
  {
    "id": "SDD-PY-06-04",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Follow an if/elif/else chain",
    "topic": "Follow an if/elif/else chain",
    "skills": [
      "selection",
      "elif",
      "visualiser"
    ],
    "instructions": "Run the visualiser and watch Python test each condition. The stored value is already provided.",
    "starterCode": "temperature = 18\nif temperature < 10:\n    message = \"Cold\"\nelif temperature < 20:\n    message = \"Mild\"\nelse:\n    message = \"Warm\"\nprint(message)",
    "expectedOutput": "Mild",
    "hints": [
      "Watch the current line and the value of message."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "requiredElif": true,
      "requiredElse": true,
      "requiredPrintNames": [
        "message"
      ]
    }
  },
  {
    "id": "SDD-PY-06-05",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Display a warning only when needed",
    "topic": "Display a warning only when needed",
    "skills": [
      "selection",
      "if",
      "comparison-operators"
    ],
    "instructions": "The variable <code>altitude</code> is already set. Display <code>You are entering thin air</code> only when altitude is above 2500.",
    "starterCode": "altitude = 2800\n# Add the selection below\n",
    "expectedOutput": "You are entering thin air",
    "hints": [
      "Use if altitude > 2500:",
      "Indent the print instruction."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "ifUsesNames": [
        "altitude"
      ],
      "comparison": {
        "name": "altitude",
        "operator": "Gt",
        "value": 2500
      },
      "requiredStringLiterals": [
        "You are entering thin air"
      ]
    }
  },
  {
    "id": "SDD-PY-06-06",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Assignment is not comparison",
    "topic": "Assignment is not comparison",
    "skills": [
      "debugging",
      "syntax-error",
      "selection",
      "comparison-operators"
    ],
    "instructions": "The program should display <code>Correct</code>. Repair the condition.",
    "starterCode": "answer = 12\nif answer = 12:\n    print(\"Correct\")",
    "expectedOutput": "Correct",
    "hints": [
      "A condition compares values.",
      "Use == rather than =."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "comparison": {
        "name": "answer",
        "operator": "Eq",
        "value": 12
      },
      "requiredStringLiterals": [
        "Correct"
      ]
    }
  },
  {
    "id": "SDD-PY-06-07",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Selection from pseudocode",
    "skills": [
      "pseudocode",
      "translation",
      "selection"
    ],
    "questions": [
      {
        "prompt": "Which Python line translates IF age <= 12 THEN?",
        "options": [
          "if age <= 12:",
          "if age =< 12 then",
          "IF(age <= 12)"
        ],
        "answer": 0,
        "explanation": "Python uses lowercase if, <= and a colon."
      },
      {
        "prompt": "Which Python keyword translates ELSE IF?",
        "options": [
          "elseif",
          "elif",
          "otherwise"
        ],
        "answer": 1,
        "explanation": "Python uses elif."
      }
    ],
    "codeSnippet": "IF age <= 12 THEN\n    SEND \"Child ticket\" TO DISPLAY\nEND IF"
  },
  {
    "id": "SDD-PY-06-08",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Make three checks efficient",
    "topic": "Make three checks efficient",
    "skills": [
      "selection",
      "elif",
      "efficiency"
    ],
    "instructions": "Rewrite the three separate checks as one efficient <code>if/elif/else</code> chain. With 850 watts, display <code>Medium usage</code>.",
    "starterCode": "watts = 850\n# Write one efficient selection structure\n",
    "expectedOutput": "Medium usage",
    "hints": [
      "Check the lowest band first.",
      "Use elif for the middle band and else for the final band."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "requiredElif": true,
      "requiredElse": true,
      "ifUsesNames": [
        "watts"
      ]
    }
  },
  {
    "id": "SDD-PY-06-09",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Explain efficient selection",
    "skills": [
      "selection",
      "efficiency",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program uses three separate <code>if</code> statements to assign <code>usageBand</code>. Only one band can be correct.</p><p><strong>Explain why an if/elif/else structure would be more efficient.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that conditions are checked from top to bottom until one is true.",
      "Explain that the remaining conditions are then skipped, reducing unnecessary checks."
    ],
    "modelAnswer": "An **if/elif/else** structure is more efficient because once the condition for <code>usageBand</code> is true, the remaining conditions are skipped. This prevents unnecessary checks."
  },
  {
    "id": "SDD-PY-06-10",
    "areaId": "sdd",
    "unitId": "sdd-selection-06",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Selection",
    "skills": [
      "selection",
      "comparison-operators",
      "elif",
      "else"
    ],
    "questions": [
      {
        "prompt": "Which construct is most suitable for three mutually exclusive bands?",
        "options": [
          "Three unrelated if statements",
          "if/elif/else",
          "A print statement"
        ],
        "answer": 1,
        "explanation": "An if/elif/else chain selects one branch efficiently."
      },
      {
        "prompt": "What must appear at the end of an if line?",
        "options": [
          "A semicolon",
          "A colon",
          "A full stop"
        ],
        "answer": 1,
        "explanation": "Python selection headers end with a colon."
      },
      {
        "prompt": "What does else represent?",
        "options": [
          "A condition that is always checked first",
          "The path used when no earlier condition is true",
          "A fixed loop"
        ],
        "answer": 1,
        "explanation": "else is the final fallback branch."
      }
    ]
  },
  {
    "id": "SDD-PY-07-01",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: AND, OR and NOT",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not",
      "conditions"
    ],
    "videoTitle": "Teacher explanation: AND, OR and NOT",
    "videoUrl": "",
    "contentHtml": "<p>Logical operators join or reverse conditions.</p><ul><li><strong>and</strong>: both conditions must be true.</li><li><strong>or</strong>: at least one condition must be true.</li><li><strong>not</strong>: reverses True and False.</li></ul><pre class=\"lesson-code\">if age &gt;= 12 and age &lt;= 16:\n    print(\"Eligible\")</pre><p>For invalid values outside a range, the condition commonly uses <code>or</code>: <code>age &lt; 12 or age &gt; 16</code>.</p>",
    "checkpoint": {
      "prompt": "Which operator is used when both conditions must be true?",
      "options": [
        "or",
        "and",
        "not"
      ],
      "answer": 1,
      "explanation": "AND requires both conditions to be true."
    }
  },
  {
    "id": "SDD-PY-07-02",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Logical truth",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ],
    "questions": [
      {
        "prompt": "True AND False gives...",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "AND is true only when both sides are true."
      },
      {
        "prompt": "True OR False gives...",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "OR is true when at least one side is true."
      },
      {
        "prompt": "NOT True gives...",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "NOT reverses the Boolean value."
      }
    ]
  },
  {
    "id": "SDD-PY-07-03",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Inclusive range",
    "skills": [
      "logical-operators",
      "and",
      "selection",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed?",
        "options": [
          "Valid",
          "Invalid",
          "Nothing"
        ],
        "answer": 0,
        "explanation": "15 is at least 8 and no more than 20."
      }
    ],
    "codeSnippet": "length = 15\nif length >= 8 and length <= 20:\n    print(\"Valid\")\nelse:\n    print(\"Invalid\")"
  },
  {
    "id": "SDD-PY-07-04",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: A compound condition",
    "topic": "A compound condition",
    "skills": [
      "logical-operators",
      "and",
      "visualiser"
    ],
    "instructions": "Step through the condition and see that both comparisons are true.",
    "starterCode": "score = 72\nattendance = 91\nif score >= 70 and attendance >= 90:\n    result = \"Award\"\nelse:\n    result = \"No award\"\nprint(result)",
    "expectedOutput": "Award",
    "hints": [
      "Inspect score and attendance before the if line."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "requiredBoolOperators": [
        "And"
      ],
      "requiredPrintNames": [
        "result"
      ]
    }
  },
  {
    "id": "SDD-PY-07-05",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Check an inclusive range",
    "topic": "Check an inclusive range",
    "skills": [
      "logical-operators",
      "and",
      "selection"
    ],
    "instructions": "The variable <code>reading</code> stores 75. Display <code>Accepted</code> when it is between 0 and 100 inclusive; otherwise display <code>Invalid</code>.",
    "starterCode": "reading = 75\n# Write the compound selection\n",
    "expectedOutput": "Accepted",
    "hints": [
      "Use >= 0 and <= 100.",
      "Include an else branch."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "requiredBoolOperators": [
        "And"
      ],
      "ifUsesNames": [
        "reading"
      ],
      "requiredElse": true
    }
  },
  {
    "id": "SDD-PY-07-06",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: An impossible invalid condition",
    "topic": "An impossible invalid condition",
    "skills": [
      "debugging",
      "logical-operators",
      "or",
      "conditions"
    ],
    "instructions": "The program should identify 100 as invalid because it is outside 5 to 75. Repair the logical operator.",
    "starterCode": "value = 100\nif value < 5 and value > 75:\n    print(\"Invalid\")\nelse:\n    print(\"Valid\")",
    "expectedOutput": "Invalid",
    "hints": [
      "Can one number be below 5 and above 75 at the same time?",
      "Outside the range means one condition OR the other."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "requiredBoolOperators": [
        "Or"
      ],
      "ifUsesNames": [
        "value"
      ]
    }
  },
  {
    "id": "SDD-PY-07-07",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: NOT a valid range",
    "skills": [
      "pseudocode",
      "translation",
      "logical-operators",
      "not"
    ],
    "questions": [
      {
        "prompt": "Which Python condition translates WHILE NOT (age >= 0 AND age <= 18)?",
        "options": [
          "while not(age >= 0 and age <= 18):",
          "while age >= 0 or age <= 18:",
          "while NOT age 0 TO 18"
        ],
        "answer": 0,
        "explanation": "Python uses lowercase while/not/and and a colon."
      },
      {
        "prompt": "Which equivalent condition also means invalid?",
        "options": [
          "age < 0 or age > 18",
          "age < 0 and age > 18",
          "age == 0 and age == 18"
        ],
        "answer": 0,
        "explanation": "A value is invalid when it is below the minimum OR above the maximum."
      }
    ]
  },
  {
    "id": "SDD-PY-07-08",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Accept one of four department codes",
    "topic": "Accept one of four department codes",
    "skills": [
      "logical-operators",
      "or",
      "selection"
    ],
    "instructions": "The variable <code>department</code> contains <code>C</code>. Display <code>Department accepted</code> when it is A, B, C or D.",
    "starterCode": "department = \"C\"\n# Write the selection below\n",
    "expectedOutput": "Department accepted",
    "hints": [
      "Join equality comparisons with or."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "requiredBoolOperators": [
        "Or"
      ],
      "ifUsesNames": [
        "department"
      ],
      "requiredStringLiterals": [
        "Department accepted"
      ]
    }
  },
  {
    "id": "SDD-PY-07-09",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Explain the logical error",
    "skills": [
      "logical-operators",
      "or",
      "question-specific-examples"
    ],
    "questionHtml": "<p>The condition <code>value &lt; 5 and value &gt; 75</code> is intended to find values outside the valid range 5–75.</p><p><strong>Explain why it does not work and state the correction.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "Explain that one value cannot be less than 5 and greater than 75 at the same time.",
      "Replace AND with OR: value < 5 or value > 75."
    ],
    "modelAnswer": "The condition can never be true because <code>value</code> cannot be below 5 **and** above 75 at the same time. It should use **or**: <code>value &lt; 5 or value &gt; 75</code>."
  },
  {
    "id": "SDD-PY-07-10",
    "areaId": "sdd",
    "unitId": "sdd-logic-07",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Logical operators",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ],
    "questions": [
      {
        "prompt": "A password must be at least 8 and at most 20 characters. Which operator joins the checks?",
        "options": [
          "and",
          "or",
          "not"
        ],
        "answer": 0,
        "explanation": "Both limits must be satisfied."
      },
      {
        "prompt": "An input is invalid when below 0 or above 100. Which operator joins the invalid checks?",
        "options": [
          "and",
          "or",
          "not"
        ],
        "answer": 1,
        "explanation": "Either invalid situation is enough."
      },
      {
        "prompt": "What does not(valid) mean?",
        "options": [
          "The same as valid",
          "The opposite of valid",
          "A syntax error"
        ],
        "answer": 1,
        "explanation": "NOT reverses a Boolean result."
      }
    ]
  },
  {
    "id": "SDD-PY-08-01",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: length, round and random",
    "skills": [
      "predefined-functions",
      "len",
      "round",
      "random"
    ],
    "videoTitle": "Teacher explanation: length, round and random",
    "videoUrl": "",
    "contentHtml": "<p>National 5 questions commonly use three predefined functions.</p><div class=\"concept-grid\"><div><strong>len(value)</strong><p>Counts characters in a string or items in an array.</p></div><div><strong>round(value, places)</strong><p>Rounds a real number to a chosen number of decimal places.</p></div><div><strong>random.randint(low, high)</strong><p>Generates an inclusive random integer after <code>import random</code>.</p></div></div><p>Choose the function from clues such as <em>length</em>, <em>rounded</em> or <em>randomly selected</em>.</p>",
    "checkpoint": {
      "prompt": "Which function counts the characters in a message?",
      "options": [
        "round()",
        "len()",
        "random.randint()"
      ],
      "answer": 1,
      "explanation": "len() returns the length of a string or array."
    }
  },
  {
    "id": "SDD-PY-08-02",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Choose the predefined function",
    "skills": [
      "predefined-functions",
      "len",
      "round",
      "random"
    ],
    "questions": [
      {
        "prompt": "A price must be shown to two decimal places. Which function is needed?",
        "options": [
          "round()",
          "len()",
          "int()"
        ],
        "answer": 0,
        "explanation": "round(value, 2) rounds to two decimal places."
      },
      {
        "prompt": "A program needs the number of items in an array. Which function is needed?",
        "options": [
          "random.randint()",
          "len()",
          "float()"
        ],
        "answer": 1,
        "explanation": "len(arrayName) returns the number of elements."
      },
      {
        "prompt": "Which statement is true about random.randint(1, 6)?",
        "options": [
          "It can return 1 through 6 inclusive",
          "It returns only 1 or 6",
          "It cannot return 6"
        ],
        "answer": 0,
        "explanation": "Both endpoints are included."
      }
    ]
  },
  {
    "id": "SDD-PY-08-03",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Length of text",
    "skills": [
      "len",
      "strings",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed?",
        "options": [
          "7",
          "8",
          "9"
        ],
        "answer": 1,
        "explanation": "The space between Red and Kite is also a character."
      }
    ],
    "codeSnippet": "message = \"Red Kite\"\nprint(len(message))"
  },
  {
    "id": "SDD-PY-08-04",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Round a calculated value",
    "topic": "Round a calculated value",
    "skills": [
      "round",
      "calculation",
      "visualiser"
    ],
    "instructions": "Step through the calculation and the rounding operation.",
    "starterCode": "total = 10\nquantity = 3\naverage = total / quantity\nroundedAverage = round(average, 2)\nprint(roundedAverage)",
    "expectedOutput": "3.33",
    "hints": [
      "Watch average before and after round()."
    ],
    "requirements": {
      "requiredCalls": [
        "round",
        "print"
      ],
      "requiredPrintNames": [
        "roundedAverage"
      ]
    }
  },
  {
    "id": "SDD-PY-08-05",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Calculate a banner price using length",
    "topic": "Calculate a banner price using length",
    "skills": [
      "len",
      "calculation",
      "input"
    ],
    "instructions": "Ask for <code>bannerText</code>. Calculate <code>bannerPrice</code> as £6.50 plus £0.35 for each character, then display it rounded to two decimal places.",
    "starterCode": "# Receive bannerText, calculate bannerPrice and display it\n",
    "expectedOutput": "Banner text: School Fair\n10.35",
    "hints": [
      "Use len(bannerText).",
      "Use round(bannerPrice, 2)."
    ],
    "requirements": {
      "requiredCalls": [
        "input",
        "len",
        "round",
        "print"
      ],
      "requiredNamesInCalculation": [
        "bannerText"
      ],
      "requiredOperators": [
        "Mult",
        "Add"
      ]
    },
    "sampleInputs": [
      "School Fair"
    ],
    "tests": [
      {
        "inputs": [
          "School Fair"
        ],
        "expectedOutput": "Banner text: School Fair\n10.35"
      },
      {
        "inputs": [
          "Hi"
        ],
        "expectedOutput": "Banner text: Hi\n7.2"
      }
    ]
  },
  {
    "id": "SDD-PY-08-06",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Use the last valid array index",
    "topic": "Use the last valid array index",
    "skills": [
      "debugging",
      "len",
      "arrays",
      "index-error"
    ],
    "instructions": "The program should display <code>blue</code>, the final item. Repair the index.",
    "starterCode": "colours = [\"red\", \"green\", \"blue\"]\nprint(colours[len(colours)])",
    "expectedOutput": "blue",
    "hints": [
      "len(colours) is 3.",
      "The valid indexes are 0, 1 and 2."
    ],
    "requirements": {
      "requiredCalls": [
        "len",
        "print"
      ],
      "requiredSubscriptNames": [
        "colours"
      ]
    }
  },
  {
    "id": "SDD-PY-08-07",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Predefined functions in pseudocode",
    "skills": [
      "pseudocode",
      "translation",
      "len",
      "round"
    ],
    "questions": [
      {
        "prompt": "Which Python line translates SET characters TO LENGTH OF message?",
        "options": [
          "characters = len(message)",
          "characters = message.length",
          "len = characters(message)"
        ],
        "answer": 0,
        "explanation": "Python uses len(message)."
      },
      {
        "prompt": "Which Python line translates SEND average ROUNDED TO 2 DECIMAL PLACES TO DISPLAY?",
        "options": [
          "print(round(average, 2))",
          "round(print(average), 2)",
          "print(average, round 2)"
        ],
        "answer": 0,
        "explanation": "Round the value, then pass it to print()."
      }
    ]
  },
  {
    "id": "SDD-PY-08-08",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 8,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Apply: Random selection from an array",
    "skills": [
      "random",
      "arrays",
      "len",
      "indexing"
    ],
    "questions": [
      {
        "prompt": "Which line generates a valid random index for events?",
        "options": [
          "index = random.randint(0, len(events) - 1)",
          "index = random.randint(1, len(events))",
          "index = len(events)"
        ],
        "answer": 0,
        "explanation": "Indexes begin at 0 and the last valid index is length minus one."
      },
      {
        "prompt": "What must appear before random.randint is used?",
        "options": [
          "input random",
          "import random",
          "random = True"
        ],
        "answer": 1,
        "explanation": "The random module must be imported."
      }
    ],
    "codeSnippet": "events = [\"Music\", \"Sport\", \"Art\"]"
  },
  {
    "id": "SDD-PY-08-09",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Explain length minus one",
    "skills": [
      "random",
      "arrays",
      "len",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program selects an item from <code>events</code> using:</p><pre class=\"lesson-code\">random.randint(0, len(events) - 1)</pre><p><strong>Explain why 1 is subtracted from the length.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that len(events) gives the number of items.",
      "Explain that array indexes start at 0, so the final valid index is one less than the length."
    ],
    "modelAnswer": "<code>len(events)</code> gives the number of items, but array indexes start at **0**. Therefore the last valid position in <code>events</code> is <code>len(events) - 1</code>."
  },
  {
    "id": "SDD-PY-08-10",
    "areaId": "sdd",
    "unitId": "sdd-functions-08",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Predefined functions",
    "skills": [
      "predefined-functions",
      "len",
      "round",
      "random"
    ],
    "questions": [
      {
        "prompt": "Which expression gives the number of characters in password?",
        "options": [
          "len(password)",
          "round(password)",
          "password.count"
        ],
        "answer": 0,
        "explanation": "Use len()."
      },
      {
        "prompt": "Which expression rounds cost to one decimal place?",
        "options": [
          "round(cost, 1)",
          "round(1, cost)",
          "int(cost, 1)"
        ],
        "answer": 0,
        "explanation": "The value comes first and the number of decimal places second."
      },
      {
        "prompt": "What is the highest possible result of random.randint(4, 9)?",
        "options": [
          "8",
          "9",
          "10"
        ],
        "answer": 1,
        "explanation": "The upper boundary is inclusive."
      }
    ]
  },
  {
    "id": "SDD-PY-09-01",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Fixed repetition with for and range",
    "skills": [
      "fixed-loops",
      "for-loop",
      "range",
      "iteration"
    ],
    "videoTitle": "Teacher explanation: Fixed repetition with for and range",
    "videoUrl": "",
    "contentHtml": "<p>A fixed loop is used when the number of repetitions is known.</p><pre class=\"lesson-code\">for counter in range(5):\n    print(\"Processing\")</pre><p><code>range(5)</code> produces 0, 1, 2, 3 and 4: five repetitions. Everything inside the loop is indented.</p><div class=\"trigger-box\"><strong>Question clues:</strong> repeat 5 times, for each, every item, each day.</div>",
    "checkpoint": {
      "prompt": "How many times does for counter in range(5) repeat?",
      "options": [
        "4",
        "5",
        "6"
      ],
      "answer": 1,
      "explanation": "It repeats once for each value 0 to 4."
    }
  },
  {
    "id": "SDD-PY-09-02",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Fixed loops and range",
    "skills": [
      "fixed-loops",
      "range",
      "for-loop"
    ],
    "questions": [
      {
        "prompt": "Which loop repeats exactly six times?",
        "options": [
          "for i in range(6):",
          "for i in range(1, 6):",
          "while i < 6:"
        ],
        "answer": 0,
        "explanation": "range(6) contains six values: 0 to 5."
      },
      {
        "prompt": "Which range displays 5, 6, 7 and 8?",
        "options": [
          "range(5, 8)",
          "range(5, 9)",
          "range(4, 8)"
        ],
        "answer": 1,
        "explanation": "The stop value is excluded, so use 9."
      },
      {
        "prompt": "What must be indented?",
        "options": [
          "Only the for line",
          "The instructions repeated by the loop",
          "The code before the loop"
        ],
        "answer": 1,
        "explanation": "The loop body is indented."
      }
    ]
  },
  {
    "id": "SDD-PY-09-03",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Range boundaries",
    "skills": [
      "fixed-loops",
      "range",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is the final value displayed?",
        "options": [
          "3",
          "4",
          "5"
        ],
        "answer": 1,
        "explanation": "range(1, 5) produces 1, 2, 3 and 4."
      }
    ],
    "codeSnippet": "for number in range(1, 5):\n    print(number)"
  },
  {
    "id": "SDD-PY-09-04",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Watch the loop counter change",
    "topic": "Watch the loop counter change",
    "skills": [
      "fixed-loops",
      "range",
      "visualiser"
    ],
    "instructions": "Run the visualiser and watch <code>counter</code> change from 0 to 2.",
    "starterCode": "for counter in range(3):\n    print(\"Loop\", counter)",
    "expectedOutput": "Loop 0\nLoop 1\nLoop 2",
    "hints": [
      "Each new loop round updates counter."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "rangeArgs": [
        3
      ],
      "requiredCalls": [
        "print"
      ]
    }
  },
  {
    "id": "SDD-PY-09-05",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Display a message six times",
    "topic": "Display a message six times",
    "skills": [
      "fixed-loops",
      "for-loop",
      "range"
    ],
    "instructions": "Use efficient code to display <code>Processing...</code> exactly six times.",
    "starterCode": "# Write a fixed loop below\n",
    "expectedOutput": "Processing...\nProcessing...\nProcessing...\nProcessing...\nProcessing...\nProcessing...",
    "hints": [
      "Use range(6).",
      "Place one print instruction inside the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "rangeArgs": [
        6
      ],
      "requiredStringLiterals": [
        "Processing..."
      ]
    }
  },
  {
    "id": "SDD-PY-09-06",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Repair the loop header and indentation",
    "topic": "Repair the loop header and indentation",
    "skills": [
      "debugging",
      "syntax-error",
      "indentation-error",
      "fixed-loops"
    ],
    "instructions": "The program should display <code>Ready</code> three times. Repair all errors.",
    "starterCode": "for counter in range(3)\nprint(\"Ready\")",
    "expectedOutput": "Ready\nReady\nReady",
    "hints": [
      "The for line needs a colon.",
      "The repeated instruction must be indented."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "rangeArgs": [
        3
      ],
      "requiredStringLiterals": [
        "Ready"
      ]
    }
  },
  {
    "id": "SDD-PY-09-07",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: A fixed loop",
    "skills": [
      "pseudocode",
      "translation",
      "fixed-loops"
    ],
    "questions": [
      {
        "prompt": "Which Python code translates LOOP 4 TIMES?",
        "options": [
          "for counter in range(4):",
          "for counter in range(1, 4):",
          "while counter == 4:"
        ],
        "answer": 0,
        "explanation": "range(4) gives four repetitions."
      },
      {
        "prompt": "Which pseudocode best matches for day in range(1, 8)?",
        "options": [
          "LOOP day FROM 1 TO 7",
          "LOOP day FROM 1 TO 8",
          "WHILE day < 8"
        ],
        "answer": 0,
        "explanation": "Python excludes 8, so the displayed values are 1 to 7."
      }
    ]
  },
  {
    "id": "SDD-PY-09-08",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Print four delivery labels",
    "topic": "Print four delivery labels",
    "skills": [
      "fixed-loops",
      "input",
      "output"
    ],
    "instructions": "Ask for a delivery name four times and display <code>Label printed for: NAME</code> after each entry.",
    "starterCode": "# Use one fixed loop\n",
    "expectedOutput": "Delivery: North\nLabel printed for: North\nDelivery: South\nLabel printed for: South\nDelivery: East\nLabel printed for: East\nDelivery: West\nLabel printed for: West",
    "hints": [
      "Use range(4).",
      "Put input and output inside the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "rangeArgs": [
        4
      ],
      "requiredCalls": [
        "input",
        "print"
      ]
    },
    "sampleInputs": [
      "North",
      "South",
      "East",
      "West"
    ],
    "tests": [
      {
        "inputs": [
          "North",
          "South",
          "East",
          "West"
        ],
        "expectedOutput": "Delivery: North\nLabel printed for: North\nDelivery: South\nLabel printed for: South\nDelivery: East\nLabel printed for: East\nDelivery: West\nLabel printed for: West"
      },
      {
        "inputs": [
          "A",
          "B",
          "C",
          "D"
        ],
        "expectedOutput": "Delivery: A\nLabel printed for: A\nDelivery: B\nLabel printed for: B\nDelivery: C\nLabel printed for: C\nDelivery: D\nLabel printed for: D"
      }
    ]
  },
  {
    "id": "SDD-PY-09-09",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Justify a fixed loop",
    "skills": [
      "fixed-loops",
      "efficiency",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program must ask for the weights of exactly seven containers.</p><p><strong>Explain why a fixed loop is suitable.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that the number of repetitions is known in advance.",
      "Link the answer to the seven container weights / repeat exactly seven times."
    ],
    "modelAnswer": "A **fixed loop** is suitable because the number of repetitions is known in advance: the input must be repeated exactly **seven times**, once for each container."
  },
  {
    "id": "SDD-PY-09-10",
    "areaId": "sdd",
    "unitId": "sdd-loops-09",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Fixed loops",
    "skills": [
      "fixed-loops",
      "range",
      "iteration"
    ],
    "questions": [
      {
        "prompt": "How many values are in range(2, 7)?",
        "options": [
          "4",
          "5",
          "6"
        ],
        "answer": 1,
        "explanation": "It produces 2, 3, 4, 5 and 6."
      },
      {
        "prompt": "Where is the loop counter created?",
        "options": [
          "In the for header",
          "Inside print()",
          "After the loop"
        ],
        "answer": 0,
        "explanation": "The loop variable is named in the for header."
      },
      {
        "prompt": "Which phrase most strongly suggests a fixed loop?",
        "options": [
          "Until valid",
          "For each of the 12 pupils",
          "While not finished"
        ],
        "answer": 1,
        "explanation": "The exact number of repetitions is known."
      }
    ]
  },
  {
    "id": "SDD-PY-10-01",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: The running-total standard algorithm",
    "skills": [
      "running-total",
      "standard-algorithms",
      "fixed-loops"
    ],
    "videoTitle": "Teacher explanation: The running-total standard algorithm",
    "videoUrl": "",
    "contentHtml": "<p>A running total accumulates values one at a time.</p><ol><li>Initialise the total before the loop.</li><li>Receive or access a value inside the loop.</li><li>Update the total inside the loop.</li><li>Use or display the total after the loop.</li></ol><pre class=\"lesson-code\">total = 0\nfor counter in range(5):\n    value = int(input(\"Value: \"))\n    total = total + value\nprint(total)</pre>",
    "checkpoint": {
      "prompt": "Where must total be initialised?",
      "options": [
        "Inside the loop",
        "Before the loop",
        "After it is displayed"
      ],
      "answer": 1,
      "explanation": "Initialising inside the loop would reset it every repetition."
    }
  },
  {
    "id": "SDD-PY-10-02",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Running-total order",
    "skills": [
      "running-total",
      "standard-algorithms"
    ],
    "questions": [
      {
        "prompt": "Which line updates a running total?",
        "options": [
          "total = value",
          "total = total + value",
          "value = total"
        ],
        "answer": 1,
        "explanation": "The old total is combined with the new value."
      },
      {
        "prompt": "Why is total usually set to 0 first?",
        "options": [
          "To create a starting value before accumulation",
          "To stop the loop",
          "To convert the input"
        ],
        "answer": 0,
        "explanation": "The variable must exist before it is updated."
      },
      {
        "prompt": "Where should the final total normally be displayed?",
        "options": [
          "Before the loop",
          "After the loop",
          "Inside every condition"
        ],
        "answer": 1,
        "explanation": "After the loop, all values have been included."
      }
    ]
  },
  {
    "id": "SDD-PY-10-03",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Trace a running total",
    "skills": [
      "running-total",
      "trace-code",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed?",
        "options": [
          "3",
          "6",
          "9"
        ],
        "answer": 1,
        "explanation": "The loop adds 1, then 2, then 3: total = 6."
      }
    ],
    "codeSnippet": "total = 0\nfor number in range(1, 4):\n    total = total + number\nprint(total)"
  },
  {
    "id": "SDD-PY-10-04",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Total three values",
    "topic": "Total three values",
    "skills": [
      "running-total",
      "visualiser",
      "fixed-loops"
    ],
    "instructions": "Watch the total change after each array value is added.",
    "starterCode": "values = [4, 7, 2]\ntotal = 0\nfor index in range(3):\n    total = total + values[index]\nprint(total)",
    "expectedOutput": "13",
    "hints": [
      "Watch total after each iteration."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "updatesVariable": "total",
      "requiredSubscriptNames": [
        "values"
      ],
      "requiredPrintNames": [
        "total"
      ]
    }
  },
  {
    "id": "SDD-PY-10-05",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Total six rod weights",
    "topic": "Total six rod weights",
    "skills": [
      "running-total",
      "fixed-loops",
      "input"
    ],
    "instructions": "Ask for six integer rod weights, calculate the total and display it.",
    "starterCode": "# Initialise total, loop six times, update and display\n",
    "expectedOutput": "Weight: 2\nWeight: 3\nWeight: 4\nWeight: 5\nWeight: 6\nWeight: 7\n27",
    "hints": [
      "Set total to 0 before the loop.",
      "Use total = total + weight inside it."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "rangeArgs": [
        6
      ],
      "updatesVariable": "total",
      "requiredCalls": [
        "input",
        "int",
        "print"
      ]
    },
    "sampleInputs": [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "tests": [
      {
        "inputs": [
          "2",
          "3",
          "4",
          "5",
          "6",
          "7"
        ],
        "expectedOutput": "Weight: 2\nWeight: 3\nWeight: 4\nWeight: 5\nWeight: 6\nWeight: 7\n27"
      },
      {
        "inputs": [
          "1",
          "1",
          "1",
          "1",
          "1",
          "1"
        ],
        "expectedOutput": "Weight: 1\nWeight: 1\nWeight: 1\nWeight: 1\nWeight: 1\nWeight: 1\n6"
      }
    ]
  },
  {
    "id": "SDD-PY-10-06",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Stop resetting the total",
    "topic": "Stop resetting the total",
    "skills": [
      "debugging",
      "running-total",
      "logic-error"
    ],
    "instructions": "The program should display 12. Repair the logic error.",
    "starterCode": "values = [3, 4, 5]\nfor index in range(3):\n    total = 0\n    total = total + values[index]\nprint(total)",
    "expectedOutput": "12",
    "hints": [
      "The total is being reset every loop round.",
      "Move the initialisation before the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "updatesVariable": "total",
      "requiredSubscriptNames": [
        "values"
      ],
      "requiredPrintNames": [
        "total"
      ]
    }
  },
  {
    "id": "SDD-PY-10-07",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Running total to Python",
    "skills": [
      "pseudocode",
      "translation",
      "running-total"
    ],
    "questions": [
      {
        "prompt": "Which Python line translates SET total TO total + amount?",
        "options": [
          "total = total + amount",
          "amount = total",
          "print(total + amount)"
        ],
        "answer": 0,
        "explanation": "The updated result is stored back in total."
      },
      {
        "prompt": "Which line must appear before LOOP 5 TIMES?",
        "options": [
          "total = 0",
          "total = total + amount",
          "print(total)"
        ],
        "answer": 0,
        "explanation": "The accumulator must be initialised first."
      }
    ],
    "codeSnippet": "SET total TO 0\nLOOP 5 TIMES\n    RECEIVE amount FROM KEYBOARD AS INTEGER\n    SET total TO total + amount\nEND LOOP\nSEND total TO DISPLAY"
  },
  {
    "id": "SDD-PY-10-08",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Running total with nested selection",
    "topic": "Running total with nested selection",
    "skills": [
      "running-total",
      "nested-selection",
      "fixed-loops"
    ],
    "instructions": "Five tickets are sold. Each costs £7, but a member ticket costs £5. Ask for Y or N for each ticket and display the final total.",
    "starterCode": "# Use a fixed loop, nested selection and a running total\n",
    "expectedOutput": "Member Y/N: Y\nMember Y/N: N\nMember Y/N: Y\nMember Y/N: N\nMember Y/N: Y\n29",
    "hints": [
      "Set total to 0.",
      "Inside the loop, add 5 for Y and 7 otherwise."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "If"
      ],
      "rangeArgs": [
        5
      ],
      "updatesVariable": "total",
      "requiredCalls": [
        "input",
        "print"
      ]
    },
    "sampleInputs": [
      "Y",
      "N",
      "Y",
      "N",
      "Y"
    ],
    "tests": [
      {
        "inputs": [
          "Y",
          "N",
          "Y",
          "N",
          "Y"
        ],
        "expectedOutput": "Member Y/N: Y\nMember Y/N: N\nMember Y/N: Y\nMember Y/N: N\nMember Y/N: Y\n29"
      },
      {
        "inputs": [
          "N",
          "N",
          "N",
          "N",
          "N"
        ],
        "expectedOutput": "Member Y/N: N\nMember Y/N: N\nMember Y/N: N\nMember Y/N: N\nMember Y/N: N\n35"
      }
    ]
  },
  {
    "id": "SDD-PY-10-09",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Complete the total update",
    "skills": [
      "running-total",
      "fixed-loops",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A bakery loops through six days. <code>croissants</code> stores the number made on the current day. Each croissant sells for £1.40 and <code>totalRevenue</code> is the running total.</p><p><strong>Write the line that calculates and updates totalRevenue.</strong> <span class=\"mark-chip\">1 mark</span></p>",
    "marks": 1,
    "markingPoints": [
      "Use totalRevenue = totalRevenue + (croissants * 1.40), or an equivalent correct update."
    ],
    "modelAnswer": "<code>totalRevenue = totalRevenue + (croissants * 1.40)</code>"
  },
  {
    "id": "SDD-PY-10-10",
    "areaId": "sdd",
    "unitId": "sdd-totals-10",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Running totals",
    "skills": [
      "running-total",
      "nested-selection",
      "standard-algorithms"
    ],
    "questions": [
      {
        "prompt": "Which variable is the accumulator in total = total + price?",
        "options": [
          "price",
          "total",
          "Neither"
        ],
        "answer": 1,
        "explanation": "total stores the growing result."
      },
      {
        "prompt": "What happens if total = 0 is inside the loop?",
        "options": [
          "The total is reset every repetition",
          "The loop runs faster",
          "An array is created"
        ],
        "answer": 0,
        "explanation": "Previous values are lost."
      },
      {
        "prompt": "Why might an if statement be placed inside the loop?",
        "options": [
          "To make a decision for each value",
          "To stop using indentation",
          "To initialise the total"
        ],
        "answer": 0,
        "explanation": "Nested selection handles each item differently."
      }
    ]
  },
  {
    "id": "SDD-PY-11-01",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Conditional loops and process control",
    "skills": [
      "conditional-loops",
      "while-loop",
      "control-variable"
    ],
    "videoTitle": "Teacher explanation: Conditional loops and process control",
    "videoUrl": "",
    "contentHtml": "<p>A conditional loop is used when the number of repetitions is not known in advance.</p><pre class=\"lesson-code\">choice = 0\nwhile choice != 3:\n    choice = int(input(\"Choice: \"))\nprint(\"Finished\")</pre><p>The control variable is initialised before the loop and updated inside it. The loop repeats while its condition is true.</p><div class=\"trigger-box\"><strong>Question clues:</strong> until finished, while not complete, unknown number of times.</div>",
    "checkpoint": {
      "prompt": "What must happen to the control variable inside a process-control loop?",
      "options": [
        "It must eventually change",
        "It must always remain 0",
        "It must be a string"
      ],
      "answer": 0,
      "explanation": "Without an update, the condition may never become false."
    }
  },
  {
    "id": "SDD-PY-11-02",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Fixed or conditional?",
    "skills": [
      "conditional-loops",
      "fixed-loops",
      "while-loop"
    ],
    "questions": [
      {
        "prompt": "Repeat until the user chooses Exit. Which loop?",
        "options": [
          "Fixed loop",
          "Conditional loop"
        ],
        "answer": 1,
        "explanation": "The number of choices is unknown."
      },
      {
        "prompt": "Repeat for every one of 12 pupils. Which loop?",
        "options": [
          "Fixed loop",
          "Conditional loop"
        ],
        "answer": 0,
        "explanation": "The number of repetitions is known."
      },
      {
        "prompt": "Which keyword begins a Python conditional loop?",
        "options": [
          "for",
          "while",
          "repeat"
        ],
        "answer": 1,
        "explanation": "Python uses while."
      }
    ]
  },
  {
    "id": "SDD-PY-11-03",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: When does the loop stop?",
    "skills": [
      "conditional-loops",
      "trace-code",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed after the loop?",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": 1,
        "explanation": "The loop stops once count reaches 3 because count < 3 becomes false."
      }
    ],
    "codeSnippet": "count = 0\nwhile count < 3:\n    count = count + 1\nprint(count)"
  },
  {
    "id": "SDD-PY-11-04",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: A conditional counter loop",
    "topic": "A conditional counter loop",
    "skills": [
      "conditional-loops",
      "while-loop",
      "visualiser"
    ],
    "instructions": "Watch <code>count</code> update until the condition is false.",
    "starterCode": "count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1",
    "expectedOutput": "1\n2\n3",
    "hints": [
      "Watch the condition before each iteration."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "whileUsesNames": [
        "count"
      ],
      "updatesVariable": "count"
    }
  },
  {
    "id": "SDD-PY-11-05",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Menu until Exit",
    "topic": "Menu until Exit",
    "skills": [
      "conditional-loops",
      "while-loop",
      "control-variable",
      "input"
    ],
    "instructions": "Keep asking for an integer choice until the user enters 3. Then display <code>Exit selected</code>.",
    "starterCode": "choice = 0\n# Add the conditional loop\n",
    "expectedOutput": "Choice: 1\nChoice: 2\nChoice: 3\nExit selected",
    "hints": [
      "Use while choice != 3.",
      "Update choice using input inside the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "whileUsesNames": [
        "choice"
      ],
      "requiredCalls": [
        "input",
        "int",
        "print"
      ]
    },
    "sampleInputs": [
      "1",
      "2",
      "3"
    ],
    "tests": [
      {
        "inputs": [
          "1",
          "2",
          "3"
        ],
        "expectedOutput": "Choice: 1\nChoice: 2\nChoice: 3\nExit selected"
      },
      {
        "inputs": [
          "3"
        ],
        "expectedOutput": "Choice: 3\nExit selected"
      }
    ]
  },
  {
    "id": "SDD-PY-11-06",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Repair an infinite loop",
    "topic": "Repair an infinite loop",
    "skills": [
      "debugging",
      "conditional-loops",
      "infinite-loop"
    ],
    "instructions": "The program should display 1, 2 and 3 and then stop. Repair it.",
    "starterCode": "number = 1\nwhile number <= 3:\n    print(number)",
    "expectedOutput": "1\n2\n3",
    "hints": [
      "The condition never changes.",
      "Update number inside the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "whileUsesNames": [
        "number"
      ],
      "updatesVariable": "number"
    }
  },
  {
    "id": "SDD-PY-11-07",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Process-control pseudocode",
    "skills": [
      "pseudocode",
      "translation",
      "conditional-loops"
    ],
    "questions": [
      {
        "prompt": "Which Python line translates WHILE choice DOES NOT EQUAL 3 THEN?",
        "options": [
          "while choice != 3:",
          "while choice = 3:",
          "for choice in 3:"
        ],
        "answer": 0,
        "explanation": "Python uses != and a colon."
      },
      {
        "prompt": "Where should RECEIVE choice appear?",
        "options": [
          "Only before the loop",
          "Inside the loop so the condition can change",
          "After END WHILE only"
        ],
        "answer": 1,
        "explanation": "The control value must be updated during repetition."
      }
    ]
  },
  {
    "id": "SDD-PY-11-08",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Keep asking until the password is correct",
    "topic": "Keep asking until the password is correct",
    "skills": [
      "conditional-loops",
      "while-loop",
      "strings"
    ],
    "instructions": "Keep asking until the user enters <code>open</code>. Then display <code>Access granted</code>.",
    "starterCode": "password = \"\"\n# Add the conditional loop\n",
    "expectedOutput": "Password: wrong\nPassword: open\nAccess granted",
    "hints": [
      "Repeat while password != \"open\"."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "whileUsesNames": [
        "password"
      ],
      "requiredCalls": [
        "input",
        "print"
      ]
    },
    "sampleInputs": [
      "wrong",
      "open"
    ],
    "tests": [
      {
        "inputs": [
          "wrong",
          "open"
        ],
        "expectedOutput": "Password: wrong\nPassword: open\nAccess granted"
      },
      {
        "inputs": [
          "open"
        ],
        "expectedOutput": "Password: open\nAccess granted"
      }
    ]
  },
  {
    "id": "SDD-PY-11-09",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Explain a control variable",
    "skills": [
      "conditional-loops",
      "control-variable",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A menu repeats using <code>while choice != 3</code>.</p><p><strong>Explain the purpose of the variable choice in the loop.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that choice controls whether the loop repeats or stops.",
      "Refer to updating choice from the user and stopping when it becomes 3."
    ],
    "modelAnswer": "<code>choice</code> is the **control variable**. It is updated from the user inside the loop, and when it becomes <code>3</code> the condition is false, so the loop stops."
  },
  {
    "id": "SDD-PY-11-10",
    "areaId": "sdd",
    "unitId": "sdd-while-11",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Conditional loops",
    "skills": [
      "conditional-loops",
      "while-loop",
      "control-variable"
    ],
    "questions": [
      {
        "prompt": "When is a while loop most suitable?",
        "options": [
          "When repetitions are unknown",
          "When exactly five repetitions are required",
          "When no condition exists"
        ],
        "answer": 0,
        "explanation": "A conditional loop responds to a changing condition."
      },
      {
        "prompt": "What can cause an infinite loop?",
        "options": [
          "Updating the control variable",
          "Never changing a value used in the condition",
          "Using print()"
        ],
        "answer": 1,
        "explanation": "The condition may remain true forever."
      },
      {
        "prompt": "When is the while condition checked?",
        "options": [
          "Before each iteration",
          "Only at the end of the program",
          "Only once after the loop"
        ],
        "answer": 0,
        "explanation": "Python checks before entering each loop round."
      }
    ]
  },
  {
    "id": "SDD-PY-12-01",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: The input-validation standard algorithm",
    "skills": [
      "input-validation",
      "standard-algorithms",
      "while-loop"
    ],
    "videoTitle": "Teacher explanation: The input-validation standard algorithm",
    "videoUrl": "",
    "contentHtml": "<p>Validation checks that data is acceptable before it is used.</p><pre class=\"lesson-code\">age = int(input(\"Age: \"))\nwhile age &lt; 0 or age &gt; 18:\n    print(\"Invalid age\")\n    age = int(input(\"Age: \"))</pre><p>The standard pattern is: <strong>first input → invalid condition → error message → re-entry</strong>. If the first value is valid, the loop body does not run.</p>",
    "checkpoint": {
      "prompt": "What condition should a validation loop test?",
      "options": [
        "That the value is invalid",
        "That the value is always valid",
        "That the program has finished"
      ],
      "answer": 0,
      "explanation": "A while loop repeats while the data is invalid."
    }
  },
  {
    "id": "SDD-PY-12-02",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Validation patterns",
    "skills": [
      "input-validation",
      "conditions",
      "while-loop"
    ],
    "questions": [
      {
        "prompt": "Which condition rejects values outside 1 to 10?",
        "options": [
          "value < 1 or value > 10",
          "value < 1 and value > 10",
          "value >= 1 and value <= 10"
        ],
        "answer": 0,
        "explanation": "Either invalid boundary should repeat the input."
      },
      {
        "prompt": "What should happen inside the validation loop?",
        "options": [
          "Display an error and ask again",
          "End the program immediately",
          "Reset every variable"
        ],
        "answer": 0,
        "explanation": "The user needs another attempt."
      },
      {
        "prompt": "Why is the first input taken before the loop?",
        "options": [
          "So the condition has a value to test",
          "To make the loop fixed",
          "To avoid using a variable"
        ],
        "answer": 0,
        "explanation": "The condition cannot test a value that does not exist."
      }
    ]
  },
  {
    "id": "SDD-PY-12-03",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Valid first attempt",
    "skills": [
      "input-validation",
      "while-loop",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "If the user enters 14 first, how many times is Invalid printed?",
        "options": [
          "0",
          "1",
          "14"
        ],
        "answer": 0,
        "explanation": "14 is valid, so the while condition is false immediately."
      }
    ],
    "codeSnippet": "age = int(input(\"Age: \"))\nwhile age < 0 or age > 18:\n    print(\"Invalid\")\n    age = int(input(\"Age: \"))"
  },
  {
    "id": "SDD-PY-12-04",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Reject then accept",
    "topic": "Reject then accept",
    "skills": [
      "input-validation",
      "while-loop",
      "visualiser"
    ],
    "instructions": "The sample inputs are 200 and then 14. Watch the invalid value get replaced.",
    "starterCode": "age = int(input(\"Age: \"))\nwhile age < 0 or age > 18:\n    print(\"Invalid age\")\n    age = int(input(\"Age: \"))\nprint(\"Accepted\", age)",
    "expectedOutput": "Age: 200\nInvalid age\nAge: 14\nAccepted 14",
    "hints": [
      "Watch age before and after re-entry."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "requiredBoolOperators": [
        "Or"
      ],
      "whileUsesNames": [
        "age"
      ],
      "requiredCalls": [
        "input",
        "int",
        "print"
      ]
    },
    "sampleInputs": [
      "200",
      "14"
    ],
    "tests": [
      {
        "inputs": [
          "200",
          "14"
        ],
        "expectedOutput": "Age: 200\nInvalid age\nAge: 14\nAccepted 14"
      }
    ]
  },
  {
    "id": "SDD-PY-12-05",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Validate a temperature",
    "topic": "Validate a temperature",
    "skills": [
      "input-validation",
      "while-loop",
      "logical-operators"
    ],
    "instructions": "Ask for <code>temperature</code> and accept only values from -20 to 50 inclusive. Print <code>Invalid temperature</code> after an invalid attempt, then display the accepted value.",
    "starterCode": "# Take the first input, validate it, then display it\n",
    "expectedOutput": "Temperature: 80\nInvalid temperature\nTemperature: 20\n20",
    "hints": [
      "Invalid means below -20 OR above 50.",
      "Take the input again inside the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "requiredBoolOperators": [
        "Or"
      ],
      "whileUsesNames": [
        "temperature"
      ],
      "requiredCalls": [
        "input",
        "int",
        "print"
      ],
      "requiredStringLiterals": [
        "Invalid temperature"
      ]
    },
    "sampleInputs": [
      "80",
      "20"
    ],
    "tests": [
      {
        "inputs": [
          "80",
          "20"
        ],
        "expectedOutput": "Temperature: 80\nInvalid temperature\nTemperature: 20\n20"
      },
      {
        "inputs": [
          "-20"
        ],
        "expectedOutput": "Temperature: -20\n-20"
      }
    ]
  },
  {
    "id": "SDD-PY-12-06",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Add the missing re-entry",
    "topic": "Add the missing re-entry",
    "skills": [
      "debugging",
      "input-validation",
      "infinite-loop"
    ],
    "instructions": "The sample inputs are 0 and then 5. The program should stop after accepting 5. Add the missing instruction.",
    "starterCode": "number = int(input(\"Number: \"))\nwhile number < 1 or number > 10:\n    print(\"Invalid\")\nprint(number)",
    "expectedOutput": "Number: 0\nInvalid\nNumber: 5\n5",
    "hints": [
      "The invalid number must be replaced inside the loop."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "whileUsesNames": [
        "number"
      ],
      "requiredCalls": [
        "input",
        "int",
        "print"
      ]
    },
    "sampleInputs": [
      "0",
      "5"
    ],
    "tests": [
      {
        "inputs": [
          "0",
          "5"
        ],
        "expectedOutput": "Number: 0\nInvalid\nNumber: 5\n5"
      }
    ]
  },
  {
    "id": "SDD-PY-12-07",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Validation to pseudocode",
    "skills": [
      "pseudocode",
      "translation",
      "input-validation"
    ],
    "questions": [
      {
        "prompt": "Which pseudocode line matches while value < 1 or value > 10:?",
        "options": [
          "WHILE value < 1 OR value > 10 THEN",
          "IF value BETWEEN 1 AND 10",
          "LOOP 10 TIMES"
        ],
        "answer": 0,
        "explanation": "The invalid condition controls a WHILE loop."
      },
      {
        "prompt": "Which step must be inside the WHILE?",
        "options": [
          "Receive value again",
          "Initialise every variable",
          "End the program"
        ],
        "answer": 0,
        "explanation": "Re-entry gives the user another chance and changes the condition."
      }
    ]
  },
  {
    "id": "SDD-PY-12-08",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Validate and store three weights",
    "topic": "Validate and store three weights",
    "skills": [
      "input-validation",
      "arrays",
      "append",
      "fixed-loops"
    ],
    "instructions": "Create an empty array <code>weights</code>. Loop three times. Each weight must be greater than 0; print <code>Invalid weight</code> and re-enter until valid. Append each valid weight, then display the array.",
    "starterCode": "# Create weights and collect three valid real numbers\n",
    "expectedOutput": "Weight: -1\nInvalid weight\nWeight: 2.5\nWeight: 3\nWeight: 4.5\n[2.5, 3.0, 4.5]",
    "hints": [
      "Use weights = [].",
      "Use a for loop outside and a while loop inside.",
      "Append only after validation."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "While",
        "List"
      ],
      "rangeArgs": [
        3
      ],
      "requiredDottedCalls": [
        "weights.append"
      ],
      "requiredCalls": [
        "input",
        "float",
        "print"
      ]
    },
    "sampleInputs": [
      "-1",
      "2.5",
      "3",
      "4.5"
    ],
    "tests": [
      {
        "inputs": [
          "-1",
          "2.5",
          "3",
          "4.5"
        ],
        "expectedOutput": "Weight: -1\nInvalid weight\nWeight: 2.5\nWeight: 3\nWeight: 4.5\n[2.5, 3.0, 4.5]"
      },
      {
        "inputs": [
          "1",
          "2",
          "3"
        ],
        "expectedOutput": "Weight: 1\nWeight: 2\nWeight: 3\n[1.0, 2.0, 3.0]"
      }
    ]
  },
  {
    "id": "SDD-PY-12-09",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Design efficient validation",
    "skills": [
      "input-validation",
      "pseudocode",
      "design"
    ],
    "questionHtml": "<p>A number must be between 1 and 10 inclusive.</p><p><strong>Using pseudocode, design an efficient solution that accepts only valid values.</strong> <span class=\"mark-chip\">4 marks</span></p>",
    "marks": 4,
    "markingPoints": [
      "Receive the first value before the loop.",
      "Use a conditional loop while the value is below 1 OR above 10.",
      "Display an error message inside the loop.",
      "Receive the value again inside the loop."
    ],
    "modelAnswer": "RECEIVE value FROM KEYBOARD AS INTEGER\nWHILE value &lt; 1 OR value &gt; 10 THEN\n&nbsp;&nbsp;SEND \"Invalid\" TO DISPLAY\n&nbsp;&nbsp;RECEIVE value FROM KEYBOARD AS INTEGER\nEND WHILE"
  },
  {
    "id": "SDD-PY-12-10",
    "areaId": "sdd",
    "unitId": "sdd-validation-12",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Input validation",
    "skills": [
      "input-validation",
      "while-loop",
      "standard-algorithms"
    ],
    "questions": [
      {
        "prompt": "Which part prevents an infinite loop after invalid input?",
        "options": [
          "Taking the input again inside the loop",
          "Printing the error only",
          "Initialising a total"
        ],
        "answer": 0,
        "explanation": "The value used by the condition must change."
      },
      {
        "prompt": "What happens if the first input is valid?",
        "options": [
          "The loop body is skipped",
          "The loop repeats once",
          "A SyntaxError occurs"
        ],
        "answer": 0,
        "explanation": "The invalid condition is false."
      },
      {
        "prompt": "Which phrase most strongly signals validation?",
        "options": [
          "Repeat exactly five times",
          "Only accept values from 0 to 100",
          "Display the total"
        ],
        "answer": 1,
        "explanation": "Only accept signals that invalid values must be rejected."
      }
    ]
  },
  {
    "id": "SDD-PY-13-01",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Arrays store related values",
    "skills": [
      "arrays",
      "data-structures",
      "initialisation",
      "append"
    ],
    "videoTitle": "Teacher explanation: Arrays store related values",
    "videoUrl": "",
    "contentHtml": "<p>An array stores several related values under one meaningful name.</p><pre class=\"lesson-code\">names = []\nmarks = [0] * 5\ntasks = [\"\"] * 3</pre><p>An empty array can grow with <code>append()</code>. A pre-sized array can be filled by index. Choose an array when several values need to be stored and used later.</p>",
    "checkpoint": {
      "prompt": "Why is an array suitable for five related test marks?",
      "options": [
        "It stores all related values under one name",
        "It removes the need for a loop",
        "It can only store text"
      ],
      "answer": 0,
      "explanation": "An array groups related values and can be processed efficiently."
    }
  },
  {
    "id": "SDD-PY-13-02",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Initialise an array",
    "skills": [
      "arrays",
      "initialisation",
      "data-types"
    ],
    "questions": [
      {
        "prompt": "Which line creates an empty array?",
        "options": [
          "names = []",
          "names = 0",
          "names = \"\""
        ],
        "answer": 0,
        "explanation": "Square brackets create a list/array."
      },
      {
        "prompt": "Which line creates space for five integers initially set to 0?",
        "options": [
          "marks = [0] * 5",
          "marks = [] * 5",
          "marks = 5"
        ],
        "answer": 0,
        "explanation": "[0] * 5 creates five integer values."
      },
      {
        "prompt": "Which method adds a new value to the end?",
        "options": [
          "append()",
          "round()",
          "len()"
        ],
        "answer": 0,
        "explanation": "append() adds one item to the end."
      }
    ]
  },
  {
    "id": "SDD-PY-13-03",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Array indexes",
    "skills": [
      "arrays",
      "indexing",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed?",
        "options": [
          "red",
          "green",
          "blue"
        ],
        "answer": 1,
        "explanation": "Index 1 is the second item because indexes start at 0."
      }
    ],
    "codeSnippet": "colours = [\"red\", \"green\", \"blue\"]\nprint(colours[1])"
  },
  {
    "id": "SDD-PY-13-04",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Append values to an array",
    "topic": "Append values to an array",
    "skills": [
      "arrays",
      "append",
      "visualiser"
    ],
    "instructions": "Watch the array grow after each append.",
    "starterCode": "names = []\nnames.append(\"Ava\")\nnames.append(\"Sam\")\nnames.append(\"Kai\")\nprint(names)",
    "expectedOutput": "['Ava', 'Sam', 'Kai']",
    "hints": [
      "Inspect names after every line."
    ],
    "requirements": {
      "requiredDottedCalls": [
        "names.append"
      ],
      "requiredNodes": [
        "List"
      ],
      "requiredPrintNames": [
        "names"
      ]
    }
  },
  {
    "id": "SDD-PY-13-05",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Fill an array using append",
    "topic": "Fill an array using append",
    "skills": [
      "arrays",
      "append",
      "fixed-loops",
      "input"
    ],
    "instructions": "Create an empty array called <code>names</code>. Ask for three names in a fixed loop, append each one, then display the finished array.",
    "starterCode": "# Build the names array\n",
    "expectedOutput": "Name: Ana\nName: Ben\nName: Cara\n['Ana', 'Ben', 'Cara']",
    "hints": [
      "Start with names = [].",
      "Use names.append(name)."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "List"
      ],
      "rangeArgs": [
        3
      ],
      "requiredDottedCalls": [
        "names.append"
      ],
      "requiredCalls": [
        "input",
        "print"
      ]
    },
    "sampleInputs": [
      "Ana",
      "Ben",
      "Cara"
    ],
    "tests": [
      {
        "inputs": [
          "Ana",
          "Ben",
          "Cara"
        ],
        "expectedOutput": "Name: Ana\nName: Ben\nName: Cara\n['Ana', 'Ben', 'Cara']"
      },
      {
        "inputs": [
          "X",
          "Y",
          "Z"
        ],
        "expectedOutput": "Name: X\nName: Y\nName: Z\n['X', 'Y', 'Z']"
      }
    ]
  },
  {
    "id": "SDD-PY-13-06",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Array size and index",
    "topic": "Array size and index",
    "skills": [
      "debugging",
      "arrays",
      "index-error"
    ],
    "instructions": "The loop stores seven rainfall values. Repair the array size so no IndexError occurs.",
    "starterCode": "rainfall = [0] * 5\nfor day in range(7):\n    rainfall[day] = day + 1\nprint(rainfall)",
    "expectedOutput": "[1, 2, 3, 4, 5, 6, 7]",
    "hints": [
      "The loop writes to indexes 0 through 6.",
      "The array needs seven positions."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "List"
      ],
      "rangeArgs": [
        7
      ],
      "requiredSubscriptNames": [
        "rainfall"
      ],
      "requiredPrintNames": [
        "rainfall"
      ]
    }
  },
  {
    "id": "SDD-PY-13-07",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Arrays in pseudocode",
    "skills": [
      "pseudocode",
      "translation",
      "arrays"
    ],
    "questions": [
      {
        "prompt": "Which Python line translates SET names TO EMPTY ARRAY?",
        "options": [
          "names = []",
          "names = \"EMPTY\"",
          "names = None"
        ],
        "answer": 0,
        "explanation": "An empty list is written with square brackets."
      },
      {
        "prompt": "Which Python line translates APPEND candidateName TO names?",
        "options": [
          "names.append(candidateName)",
          "append(names, candidateName)",
          "names = candidateName"
        ],
        "answer": 0,
        "explanation": "append is called on the array."
      }
    ]
  },
  {
    "id": "SDD-PY-13-08",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Fill a pre-sized integer array",
    "topic": "Fill a pre-sized integer array",
    "skills": [
      "arrays",
      "indexing",
      "fixed-loops",
      "input"
    ],
    "instructions": "Create <code>marks = [0] * 3</code>. Ask for three integer marks and store each one directly at <code>marks[index]</code>. Display the finished array.",
    "starterCode": "# Create and fill the pre-sized array\n",
    "expectedOutput": "Mark: 10\nMark: 20\nMark: 30\n[10, 20, 30]",
    "hints": [
      "Use marks[index] on the left of =."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "List"
      ],
      "rangeArgs": [
        3
      ],
      "requiredSubscriptNames": [
        "marks"
      ],
      "requiredCalls": [
        "input",
        "int",
        "print"
      ]
    },
    "sampleInputs": [
      "10",
      "20",
      "30"
    ],
    "tests": [
      {
        "inputs": [
          "10",
          "20",
          "30"
        ],
        "expectedOutput": "Mark: 10\nMark: 20\nMark: 30\n[10, 20, 30]"
      },
      {
        "inputs": [
          "1",
          "2",
          "3"
        ],
        "expectedOutput": "Mark: 1\nMark: 2\nMark: 3\n[1, 2, 3]"
      }
    ]
  },
  {
    "id": "SDD-PY-13-09",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Justify an array",
    "skills": [
      "arrays",
      "data-structures",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program collects five validated pH readings and uses every reading again later.</p><p><strong>State the suitable data structure and explain why it is suitable.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State array / one-dimensional array.",
      "Explain that it stores multiple related pH readings together so they can be accessed later."
    ],
    "modelAnswer": "Use an **array** because it can store all five related <code>pH readings</code> under one name and allows each stored value to be accessed later."
  },
  {
    "id": "SDD-PY-13-10",
    "areaId": "sdd",
    "unitId": "sdd-arrays-13",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Arrays",
    "skills": [
      "arrays",
      "append",
      "indexing",
      "initialisation"
    ],
    "questions": [
      {
        "prompt": "What is the first valid index in an array?",
        "options": [
          "0",
          "1",
          "-1 only"
        ],
        "answer": 0,
        "explanation": "Python arrays start at index 0."
      },
      {
        "prompt": "When is append especially useful?",
        "options": [
          "When building an initially empty array",
          "When rounding a number",
          "When comparing two values"
        ],
        "answer": 0,
        "explanation": "append grows the array by one item."
      },
      {
        "prompt": "What does values[2] access?",
        "options": [
          "The second item",
          "The third item",
          "The array length"
        ],
        "answer": 1,
        "explanation": "Index 2 is the third position."
      }
    ]
  },
  {
    "id": "SDD-PY-14-01",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Traverse a one-dimensional array",
    "skills": [
      "array-traversal",
      "standard-algorithms",
      "arrays",
      "len"
    ],
    "videoTitle": "Teacher explanation: Traverse a one-dimensional array",
    "videoUrl": "",
    "contentHtml": "<p>Traversing means visiting each array item one at a time.</p><pre class=\"lesson-code\">for index in range(len(values)):\n    print(values[index])</pre><p>The loop index accesses each position. Using <code>len(values)</code> means the loop matches the current array size.</p>",
    "checkpoint": {
      "prompt": "What does values[index] represent during traversal?",
      "options": [
        "The current array item",
        "The number of arrays",
        "The loop condition"
      ],
      "answer": 0,
      "explanation": "The index selects one item on each loop round."
    }
  },
  {
    "id": "SDD-PY-14-02",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Traversal and length",
    "skills": [
      "array-traversal",
      "len",
      "indexing"
    ],
    "questions": [
      {
        "prompt": "Which loop traverses every item in scores?",
        "options": [
          "for index in range(len(scores)):",
          "for index in range(1):",
          "while scores == index:"
        ],
        "answer": 0,
        "explanation": "The range contains one index for every array item."
      },
      {
        "prompt": "Why is len(scores) useful?",
        "options": [
          "It returns the number of items",
          "It returns the final item",
          "It sorts the array"
        ],
        "answer": 0,
        "explanation": "The length determines the correct loop size."
      },
      {
        "prompt": "Which expression accesses the current item?",
        "options": [
          "scores[index]",
          "scores(len)",
          "index[scores]"
        ],
        "answer": 0,
        "explanation": "Use the array name followed by the index in brackets."
      }
    ]
  },
  {
    "id": "SDD-PY-14-03",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Total values from an array",
    "skills": [
      "array-traversal",
      "running-total",
      "predict-output"
    ],
    "questions": [
      {
        "prompt": "What is displayed?",
        "options": [
          "4",
          "10",
          "24"
        ],
        "answer": 1,
        "explanation": "The loop adds 1 + 2 + 3 + 4."
      }
    ],
    "codeSnippet": "values = [1, 2, 3, 4]\ntotal = 0\nfor index in range(len(values)):\n    total = total + values[index]\nprint(total)"
  },
  {
    "id": "SDD-PY-14-04",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: Traverse and display",
    "topic": "Traverse and display",
    "skills": [
      "array-traversal",
      "visualiser",
      "arrays"
    ],
    "instructions": "Watch <code>index</code> select a different element each loop.",
    "starterCode": "animals = [\"panda\", \"tiger\", \"otter\"]\nfor index in range(len(animals)):\n    print(animals[index])",
    "expectedOutput": "panda\ntiger\notter",
    "hints": [
      "Compare index with the selected array item."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "requiredCalls": [
        "len",
        "print"
      ],
      "requiredSubscriptNames": [
        "animals"
      ]
    }
  },
  {
    "id": "SDD-PY-14-05",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Display all stored prices",
    "topic": "Display all stored prices",
    "skills": [
      "array-traversal",
      "arrays",
      "len"
    ],
    "instructions": "Traverse the given <code>prices</code> array and display each value on a separate line.",
    "starterCode": "prices = [2.5, 4.0, 1.75]\n# Traverse and display\n",
    "expectedOutput": "2.5\n4.0\n1.75",
    "hints": [
      "Use range(len(prices)).",
      "Print prices[index]."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "requiredCalls": [
        "len",
        "print"
      ],
      "requiredSubscriptNames": [
        "prices"
      ]
    }
  },
  {
    "id": "SDD-PY-14-06",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Match the loop to the array length",
    "topic": "Match the loop to the array length",
    "skills": [
      "debugging",
      "array-traversal",
      "index-error"
    ],
    "instructions": "The program should display every name without crashing. Repair the range.",
    "starterCode": "names = [\"Ava\", \"Bo\", \"Cara\"]\nfor index in range(5):\n    print(names[index])",
    "expectedOutput": "Ava\nBo\nCara",
    "hints": [
      "There are only three items.",
      "Using len(names) is safer."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "requiredCalls": [
        "len",
        "print"
      ],
      "requiredSubscriptNames": [
        "names"
      ]
    }
  },
  {
    "id": "SDD-PY-14-07",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Traverse an array",
    "skills": [
      "pseudocode",
      "translation",
      "array-traversal"
    ],
    "questions": [
      {
        "prompt": "Which Python loop translates LOOP LENGTH OF prices TIMES?",
        "options": [
          "for index in range(len(prices)):",
          "for index in prices.length:",
          "while prices:"
        ],
        "answer": 0,
        "explanation": "range(len(prices)) creates all valid indexes."
      },
      {
        "prompt": "Which line translates SEND prices[index] TO DISPLAY?",
        "options": [
          "print(prices[index])",
          "print(index)",
          "prices.append(index)"
        ],
        "answer": 0,
        "explanation": "Display the current array element."
      }
    ]
  },
  {
    "id": "SDD-PY-14-08",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 8,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Calculate an array average",
    "topic": "Calculate an array average",
    "skills": [
      "array-traversal",
      "running-total",
      "average",
      "round"
    ],
    "instructions": "Calculate the total of all values in <code>marks</code>, then calculate and display the average rounded to one decimal place.",
    "starterCode": "marks = [12, 18, 15, 20]\n# Traverse, total, average and display\n",
    "expectedOutput": "16.2",
    "hints": [
      "Initialise total before the loop.",
      "Divide by len(marks).",
      "Use round(average, 1)."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "requiredCalls": [
        "len",
        "round",
        "print"
      ],
      "requiredSubscriptNames": [
        "marks"
      ],
      "updatesVariable": "total",
      "requiredPrintNames": [
        "average"
      ]
    }
  },
  {
    "id": "SDD-PY-14-09",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Explain traversal",
    "skills": [
      "array-traversal",
      "standard-algorithms",
      "question-specific-examples"
    ],
    "questionHtml": "<p>The loop below processes <code>readings</code>.</p><pre class=\"lesson-code\">for index in range(len(readings)):\n    print(readings[index])</pre><p><strong>Explain what the loop does.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that the loop traverses every element in readings.",
      "Explain that readings[index] displays the current stored value on each repetition."
    ],
    "modelAnswer": "The loop **traverses the readings array** from the first index to the last. On each repetition, <code>readings[index]</code> accesses and displays the current stored reading."
  },
  {
    "id": "SDD-PY-14-10",
    "areaId": "sdd",
    "unitId": "sdd-traversal-14",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Array algorithms",
    "skills": [
      "array-traversal",
      "running-total",
      "standard-algorithms"
    ],
    "questions": [
      {
        "prompt": "Which three standard algorithms are central at National 5?",
        "options": [
          "Input validation, running total and array traversal",
          "Sorting, searching and recursion",
          "Encryption, compression and routing"
        ],
        "answer": 0,
        "explanation": "These are the core SDD standard algorithms."
      },
      {
        "prompt": "Where should total be initialised during an array total?",
        "options": [
          "Before traversal",
          "Inside traversal",
          "After printing"
        ],
        "answer": 0,
        "explanation": "It must retain previous additions."
      },
      {
        "prompt": "Why use range(len(arrayName))?",
        "options": [
          "It creates exactly the valid indexes",
          "It adds a new item",
          "It converts values to strings"
        ],
        "answer": 0,
        "explanation": "The range length matches the array size."
      }
    ]
  },
  {
    "id": "SDD-PY-15-01",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: The iterative software-development process",
    "skills": [
      "development-process",
      "analysis",
      "design",
      "implementation",
      "testing",
      "documentation",
      "evaluation",
      "maintenance"
    ],
    "videoTitle": "Teacher explanation: The iterative software-development process",
    "videoUrl": "",
    "contentHtml": "<p>Software is developed through connected stages:</p><div class=\"process-strip\"><span>1 Analysis</span><span>2 Design</span><span>3 Implementation</span><span>4 Testing</span><span>5 Documentation</span><span>6 Evaluation</span><span>7 Maintenance</span></div><p>The process is <strong>iterative</strong>: testing or evaluation may reveal a problem, so developers return to an earlier stage, improve the solution and test again.</p>",
    "checkpoint": {
      "prompt": "What does iterative mean?",
      "options": [
        "Stages may be revisited and repeated",
        "Every stage happens exactly once",
        "Testing is skipped"
      ],
      "answer": 0,
      "explanation": "An iterative process returns to earlier stages when improvements are needed."
    }
  },
  {
    "id": "SDD-PY-15-02",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Identify the development stage",
    "skills": [
      "development-process",
      "analysis",
      "design",
      "testing",
      "maintenance"
    ],
    "questions": [
      {
        "prompt": "Gathering user needs and functional requirements belongs to...",
        "options": [
          "Analysis",
          "Implementation",
          "Maintenance"
        ],
        "answer": 0,
        "explanation": "Analysis defines what the solution must do."
      },
      {
        "prompt": "Writing Python code belongs to...",
        "options": [
          "Design",
          "Implementation",
          "Evaluation"
        ],
        "answer": 1,
        "explanation": "Implementation creates the working program."
      },
      {
        "prompt": "Changing software after release belongs to...",
        "options": [
          "Maintenance",
          "Analysis only",
          "Testing only"
        ],
        "answer": 0,
        "explanation": "Maintenance fixes or adapts the released system."
      }
    ]
  },
  {
    "id": "SDD-PY-15-03",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Where should the team return?",
    "skills": [
      "development-process",
      "testing",
      "design"
    ],
    "questions": [
      {
        "prompt": "Testing reveals that the proposed solution cannot meet a functional requirement. Which stage should be revisited before recoding?",
        "options": [
          "Design",
          "Documentation",
          "Maintenance"
        ],
        "answer": 0,
        "explanation": "The solution design must be reworked before implementation is changed."
      }
    ]
  },
  {
    "id": "SDD-PY-15-04",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 4,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Functional requirements and IPO",
    "skills": [
      "functional-requirements",
      "analysis",
      "ipo"
    ],
    "videoTitle": "Teacher explanation: Functional requirements and IPO",
    "videoUrl": "",
    "contentHtml": "<p>A functional requirement states something the completed program must do.</p><blockquote>The program must calculate and display the total cost.</blockquote><p>During analysis, identify:</p><ul><li><strong>Inputs</strong>: data entering the system.</li><li><strong>Processes</strong>: calculations or decisions.</li><li><strong>Outputs</strong>: information produced.</li></ul>",
    "checkpoint": {
      "prompt": "Which statement is a functional requirement?",
      "options": [
        "The program must display the total cost",
        "The code should use a blue background",
        "The programmer likes Python"
      ],
      "answer": 0,
      "explanation": "A functional requirement describes required behaviour."
    }
  },
  {
    "id": "SDD-PY-15-05",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 5,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Input, process or output?",
    "skills": [
      "analysis",
      "ipo",
      "functional-requirements"
    ],
    "questions": [
      {
        "prompt": "Receive quantity from the keyboard is...",
        "options": [
          "Input",
          "Process",
          "Output"
        ],
        "answer": 0,
        "explanation": "Data enters the program."
      },
      {
        "prompt": "Calculate quantity * price is...",
        "options": [
          "Input",
          "Process",
          "Output"
        ],
        "answer": 1,
        "explanation": "A calculation processes data."
      },
      {
        "prompt": "Display finalCost is...",
        "options": [
          "Input",
          "Process",
          "Output"
        ],
        "answer": 2,
        "explanation": "Information leaves the program."
      }
    ]
  },
  {
    "id": "SDD-PY-15-06",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 6,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Apply: Refine an algorithm step",
    "skills": [
      "design",
      "refinement",
      "calculation"
    ],
    "questions": [
      {
        "prompt": "Which refinement best expands Calculate order total for primer at £54, finishing paint at £89 and delivery at £32?",
        "options": [
          "SET orderTotal TO (primer * 54) + (finishing * 89) + 32",
          "DISPLAY orderTotal",
          "RECEIVE companyName"
        ],
        "answer": 0,
        "explanation": "The refined step shows the detailed calculation using the given data."
      },
      {
        "prompt": "Why refine an algorithm?",
        "options": [
          "To break a broad step into enough detail to implement",
          "To remove all variable names",
          "To avoid testing"
        ],
        "answer": 0,
        "explanation": "Refinement develops the solution progressively."
      }
    ]
  },
  {
    "id": "SDD-PY-15-07",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 7,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: User-interface controls",
    "skills": [
      "user-interface",
      "analysis",
      "fit-for-purpose"
    ],
    "videoTitle": "Teacher explanation: User-interface controls",
    "videoUrl": "",
    "contentHtml": "<p>Interface choices should match the input.</p><ul><li><strong>Typing box:</strong> free text such as a name or address.</li><li><strong>Button or choice control:</strong> a small set of known options.</li><li><strong>Navigation controls:</strong> move to the next or previous screen.</li><li><strong>Submit/confirm:</strong> complete an action.</li></ul><p>A touchscreen interface should use controls large enough to tap and avoid unnecessary typing where choices are known.</p>",
    "checkpoint": {
      "prompt": "Which control is most suitable for choosing one of five ratings?",
      "options": [
        "A large free-text box",
        "Five clear selectable buttons",
        "A paragraph"
      ],
      "answer": 1,
      "explanation": "Known options are faster and less error-prone as selectable controls."
    }
  },
  {
    "id": "SDD-PY-15-08",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 8,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Is the interface fit for purpose?",
    "skills": [
      "user-interface",
      "fit-for-purpose"
    ],
    "questions": [
      {
        "prompt": "A form has name, email and age boxes but no Submit button. What is the main problem?",
        "options": [
          "The user cannot complete the task",
          "The font is too readable",
          "There are too many arrays"
        ],
        "answer": 0,
        "explanation": "A required control is missing."
      },
      {
        "prompt": "A touchscreen asks users to type Yes or No. What is a stronger design?",
        "options": [
          "Two large choice buttons",
          "A longer typing box",
          "Remove the question"
        ],
        "answer": 0,
        "explanation": "Buttons are touch-friendly and reduce input mistakes."
      }
    ]
  },
  {
    "id": "SDD-PY-15-09",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 9,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Why return to design?",
    "skills": [
      "development-process",
      "design",
      "testing"
    ],
    "questionHtml": "<p>Testing shows that a program does not meet one of its functional requirements.</p><p><strong>Explain why the developer should return to the design stage.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that the proposed solution needs to change to meet the requirement.",
      "Explain that the design should be corrected before the program is implemented/tested again."
    ],
    "modelAnswer": "The current solution does not meet the **functional requirement**, so the algorithm must be changed at the **design stage**. The improved design can then be implemented and tested again."
  },
  {
    "id": "SDD-PY-15-10",
    "areaId": "sdd",
    "unitId": "sdd-process-15",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Development process",
    "skills": [
      "development-process",
      "functional-requirements",
      "user-interface"
    ],
    "questions": [
      {
        "prompt": "Which stage normally comes before implementation?",
        "options": [
          "Design",
          "Maintenance",
          "Documentation only"
        ],
        "answer": 0,
        "explanation": "The solution is designed before it is coded."
      },
      {
        "prompt": "What makes a requirement functional?",
        "options": [
          "It states what the system must do",
          "It states a preferred colour only",
          "It names the programmer"
        ],
        "answer": 0,
        "explanation": "Functional requirements describe behaviour."
      },
      {
        "prompt": "Which word describes revisiting stages?",
        "options": [
          "Iterative",
          "Random",
          "Linear only"
        ],
        "answer": 0,
        "explanation": "Iterative development cycles through stages as needed."
      }
    ]
  },
  {
    "id": "SDD-PY-16-01",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Normal, extreme and exceptional test data",
    "skills": [
      "testing",
      "normal-data",
      "extreme-data",
      "exceptional-data"
    ],
    "videoTitle": "Teacher explanation: Normal, extreme and exceptional test data",
    "videoUrl": "",
    "contentHtml": "<p>Use <strong>NEXT</strong> to remember testing types.</p><ul><li><strong>Normal:</strong> typical valid data.</li><li><strong>Extreme:</strong> valid values at the accepted boundaries.</li><li><strong>Exceptional:</strong> invalid data that should be rejected.</li></ul><p>For a valid range 1–10: 5 is normal, 1 and 10 are extreme, and 0 or 11 is exceptional.</p>",
    "checkpoint": {
      "prompt": "For a valid range 1–10, which is an extreme value?",
      "options": [
        "5",
        "1",
        "50"
      ],
      "answer": 1,
      "explanation": "Extreme data is valid but at a boundary."
    }
  },
  {
    "id": "SDD-PY-16-02",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Classify test data",
    "skills": [
      "testing",
      "normal-data",
      "extreme-data",
      "exceptional-data"
    ],
    "questions": [
      {
        "prompt": "Range 0–100: value 50 is...",
        "options": [
          "Normal",
          "Extreme",
          "Exceptional"
        ],
        "answer": 0,
        "explanation": "50 is a typical valid value."
      },
      {
        "prompt": "Range 0–100: value 100 is...",
        "options": [
          "Normal",
          "Extreme",
          "Exceptional"
        ],
        "answer": 1,
        "explanation": "100 is the highest valid boundary."
      },
      {
        "prompt": "Range 0–100: value 101 is...",
        "options": [
          "Normal",
          "Extreme",
          "Exceptional"
        ],
        "answer": 2,
        "explanation": "101 is outside the valid range."
      }
    ]
  },
  {
    "id": "SDD-PY-16-03",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 3,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Test tables and expected results",
    "skills": [
      "testing",
      "test-table",
      "expected-results"
    ],
    "videoTitle": "Teacher explanation: Test tables and expected results",
    "videoUrl": "",
    "contentHtml": "<p>A test table should state the test data, its type, the expected result and the actual result.</p><table class=\"coverage-table\"><thead><tr><th>Data</th><th>Type</th><th>Expected result</th></tr></thead><tbody><tr><td>5</td><td>Normal</td><td>Accepted</td></tr><tr><td>1</td><td>Extreme</td><td>Accepted</td></tr><tr><td>0</td><td>Exceptional</td><td>Error and re-entry</td></tr></tbody></table><p>The expected result is decided before running the test.</p>",
    "checkpoint": {
      "prompt": "Why record an expected result?",
      "options": [
        "To compare intended behaviour with the actual result",
        "To avoid choosing test data",
        "To rename variables"
      ],
      "answer": 0,
      "explanation": "A mismatch shows that the program may contain an error."
    }
  },
  {
    "id": "SDD-PY-16-04",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 4,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Apply: Choose a complete test set",
    "skills": [
      "testing",
      "test-data",
      "boundaries"
    ],
    "questions": [
      {
        "prompt": "A valid age is 12–16 inclusive. Which set includes normal, both extremes and two exceptional values?",
        "options": [
          "14, 12, 16, 11, 17",
          "12, 13, 14, 15, 16",
          "1, 2, 3, 4, 5"
        ],
        "answer": 0,
        "explanation": "It covers a typical valid value, both valid boundaries and invalid values just outside."
      },
      {
        "prompt": "Why are values just outside boundaries useful?",
        "options": [
          "They test that invalid data is rejected",
          "They are normal data",
          "They always cause syntax errors"
        ],
        "answer": 0,
        "explanation": "They expose incorrect boundary conditions."
      }
    ]
  },
  {
    "id": "SDD-PY-16-05",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 5,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Expected validation result",
    "skills": [
      "testing",
      "input-validation",
      "expected-results"
    ],
    "questions": [
      {
        "prompt": "For input 101, what should the expected result be?",
        "options": [
          "Accepted",
          "Error message and ask again",
          "Program calculates with 101"
        ],
        "answer": 1,
        "explanation": "101 lies outside 0–100 and should be rejected."
      }
    ],
    "codeSnippet": "Valid range: 0 to 100 inclusive"
  },
  {
    "id": "SDD-PY-16-06",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 6,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Debug through testing: Boundary error",
    "skills": [
      "testing",
      "logic-error",
      "boundaries"
    ],
    "questions": [
      {
        "prompt": "The valid range includes 0, but the code uses if value > 0 and value <= 100. Which test reveals the error?",
        "options": [
          "50",
          "0",
          "101"
        ],
        "answer": 1,
        "explanation": "0 should be accepted but the condition rejects it."
      },
      {
        "prompt": "What correction is required?",
        "options": [
          "value >= 0",
          "value > 1",
          "value == 0 only"
        ],
        "answer": 0,
        "explanation": "The lower boundary must be inclusive."
      }
    ]
  },
  {
    "id": "SDD-PY-16-07",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 7,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: State suitable test data",
    "skills": [
      "testing",
      "normal-data",
      "extreme-data",
      "exceptional-data"
    ],
    "questionHtml": "<p>A program accepts a mark between 0 and 30 inclusive.</p><p><strong>State one normal, two extreme and two exceptional test values.</strong> <span class=\"mark-chip\">5 marks</span></p>",
    "marks": 5,
    "markingPoints": [
      "Normal: any typical valid value such as 15.",
      "Extreme minimum: 0.",
      "Extreme maximum: 30.",
      "Exceptional below: -1 or another value below 0.",
      "Exceptional above: 31 or another value above 30."
    ],
    "modelAnswer": "Normal: <code>15</code>. Extreme: <code>0</code> and <code>30</code>. Exceptional: <code>-1</code> and <code>31</code>."
  },
  {
    "id": "SDD-PY-16-08",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 8,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Predict an expected result",
    "skills": [
      "testing",
      "expected-results",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A password must contain from 8 to 20 characters inclusive. The test value is <code>\"cat\"</code>.</p><p><strong>State the test type and expected result.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "Exceptional test data because it is shorter than the valid minimum.",
      "Expected result: rejected / error message / user asked to enter another password."
    ],
    "modelAnswer": "<code>\"cat\"</code> is **exceptional** because its length is below 8. The program should reject it, display an error and ask for another password."
  },
  {
    "id": "SDD-PY-16-09",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 9,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: What does a failed test mean?",
    "skills": [
      "testing",
      "debugging",
      "actual-results"
    ],
    "questions": [
      {
        "prompt": "The actual result differs from the expected result. What should happen next?",
        "options": [
          "Investigate and debug the program",
          "Change the expected result automatically",
          "Ignore the test"
        ],
        "answer": 0,
        "explanation": "The mismatch is evidence of a possible fault."
      },
      {
        "prompt": "Why retest after a repair?",
        "options": [
          "To check the correction works and did not introduce another fault",
          "To reduce documentation",
          "To remove the design"
        ],
        "answer": 0,
        "explanation": "Testing confirms the repaired behaviour."
      }
    ]
  },
  {
    "id": "SDD-PY-16-10",
    "areaId": "sdd",
    "unitId": "sdd-testing-16",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Testing",
    "skills": [
      "testing",
      "test-table",
      "test-data"
    ],
    "questions": [
      {
        "prompt": "Which test type is valid boundary data?",
        "options": [
          "Normal",
          "Extreme",
          "Exceptional"
        ],
        "answer": 1,
        "explanation": "Extreme values are valid boundaries."
      },
      {
        "prompt": "Which result is written before the program is run?",
        "options": [
          "Expected result",
          "Actual result",
          "Maintenance result"
        ],
        "answer": 0,
        "explanation": "The expected result states intended behaviour."
      },
      {
        "prompt": "What should exceptional data test?",
        "options": [
          "That invalid input is handled safely",
          "That a normal calculation works",
          "That variable names are meaningful"
        ],
        "answer": 0,
        "explanation": "Exceptional data should be rejected or handled."
      }
    ]
  },
  {
    "id": "SDD-PY-17-01",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Syntax, execution and logic errors",
    "skills": [
      "errors",
      "syntax-error",
      "execution-error",
      "logic-error"
    ],
    "videoTitle": "Teacher explanation: Syntax, execution and logic errors",
    "videoUrl": "",
    "contentHtml": "<ul><li><strong>Syntax error:</strong> the code breaks the rules of the programming language, such as a missing quotation mark, bracket, colon or required indentation.</li><li><strong>Execution error:</strong> the code starts running but stops unexpectedly, for example when it divides by zero, tries to open a file that does not exist, or accesses an array position outside the valid range.</li><li><strong>Logic error:</strong> the program runs but produces the wrong result because the algorithm or condition is incorrect.</li></ul><p>For National 5, identify one of these three categories. IDLE may also show a more precise technical name such as <code>ZeroDivisionError</code>, <code>FileNotFoundError</code> or <code>IndexError</code>.</p><p>Avoid using <code>Print(&quot;Hello&quot;)</code> as a category question: Python reports <code>NameError</code>, so it is less clear than the standard National 5 examples above.</p>",
    "checkpoint": {
      "prompt": "Which error type allows the program to run but gives the wrong result?",
      "options": [
        "Syntax error",
        "Execution error",
        "Logic error"
      ],
      "answer": 2,
      "explanation": "Logic errors produce incorrect behaviour without necessarily crashing."
    }
  },
  {
    "id": "SDD-PY-17-02",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Classify common errors",
    "skills": [
      "errors",
      "debugging"
    ],
    "questions": [
      {
        "prompt": "A missing colon after if causes...",
        "options": [
          "Syntax error",
          "Logic error",
          "No error"
        ],
        "answer": 0,
        "explanation": "The code structure is invalid."
      },
      {
        "prompt": "Accessing array[8] when the array has five items causes...",
        "options": [
          "Execution error",
          "Logic error only",
          "A comment"
        ],
        "answer": 0,
        "explanation": "An IndexError occurs while the program runs."
      },
      {
        "prompt": "Using price + quantity instead of price * quantity causes...",
        "options": [
          "Logic error",
          "Syntax error",
          "NameError"
        ],
        "answer": 0,
        "explanation": "The program runs but calculates the wrong result."
      }
    ]
  },
  {
    "id": "SDD-PY-17-03",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Print with a capital P",
    "skills": [
      "name-error",
      "case-sensitivity",
      "predict-error"
    ],
    "questions": [
      {
        "prompt": "What does IDLE report for Print(\"Hello\")?",
        "options": [
          "SyntaxError",
          "NameError: name 'Print' is not defined",
          "No error"
        ],
        "answer": 1,
        "explanation": "The syntax is structurally valid, but Python cannot find a function named Print. Python is case-sensitive."
      }
    ],
    "codeSnippet": "Print(\"Hello\")"
  },
  {
    "id": "SDD-PY-17-04",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 4,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Missing colon",
    "topic": "Missing colon",
    "skills": [
      "debugging",
      "syntax-error",
      "selection"
    ],
    "instructions": "Repair the syntax so the program displays <code>Pass</code>.",
    "starterCode": "mark = 60\nif mark >= 50\n    print(\"Pass\")",
    "expectedOutput": "Pass",
    "hints": [
      "Selection headers end with a colon."
    ],
    "requirements": {
      "requiredNodes": [
        "If"
      ],
      "comparison": {
        "name": "mark",
        "operator": "GtE",
        "value": 50
      },
      "requiredStringLiterals": [
        "Pass"
      ]
    }
  },
  {
    "id": "SDD-PY-17-05",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 5,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Index out of range",
    "topic": "Index out of range",
    "skills": [
      "debugging",
      "execution-error",
      "arrays"
    ],
    "instructions": "The program should display all three values without crashing. Repair the loop.",
    "starterCode": "values = [8, 4, 2]\nfor index in range(4):\n    print(values[index])",
    "expectedOutput": "8\n4\n2",
    "hints": [
      "The highest valid index is 2.",
      "Use len(values)."
    ],
    "requirements": {
      "requiredNodes": [
        "For"
      ],
      "requiredCalls": [
        "len",
        "print"
      ],
      "requiredSubscriptNames": [
        "values"
      ]
    }
  },
  {
    "id": "SDD-PY-17-06",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 6,
    "type": "debug",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Debug: Repair a logic error",
    "topic": "Repair a logic error",
    "skills": [
      "debugging",
      "logic-error",
      "calculation"
    ],
    "instructions": "The program should display 30, the total cost of six items at £5 each.",
    "starterCode": "quantity = 6\nprice = 5\ntotal = quantity + price\nprint(total)",
    "expectedOutput": "30",
    "hints": [
      "The total cost needs multiplication."
    ],
    "requirements": {
      "binOperation": {
        "operator": "Mult",
        "names": [
          "quantity",
          "price"
        ]
      },
      "requiredPrintNames": [
        "total"
      ]
    }
  },
  {
    "id": "SDD-PY-17-07",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Read a traceback carefully",
    "skills": [
      "debugging",
      "traceback",
      "syntax-error"
    ],
    "questions": [
      {
        "prompt": "Python highlights an if line, but the previous input line is missing a closing bracket. Where should you check first?",
        "options": [
          "Only the highlighted if line",
          "The highlighted line and the line immediately above",
          "The final print only"
        ],
        "answer": 1,
        "explanation": "An unfinished bracket or quotation mark can make the following line appear faulty."
      },
      {
        "prompt": "What does IndentationError usually mean?",
        "options": [
          "A block is not indented as Python expects",
          "A number is too large",
          "An array is empty"
        ],
        "answer": 0,
        "explanation": "Construct bodies must use consistent indentation."
      }
    ]
  },
  {
    "id": "SDD-PY-17-08",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 8,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Explain an execution error",
    "skills": [
      "errors",
      "execution-error",
      "arrays",
      "question-specific-examples"
    ],
    "questionHtml": "<p><code>rainfall</code> is created with five positions, but a loop stores seven readings using indexes 0–6.</p><p><strong>Name the error and explain why it occurs.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State execution error / IndexError / index out of range.",
      "Explain that the array has only five positions but the loop attempts to access indexes beyond the final valid position."
    ],
    "modelAnswer": "An **execution error (IndexError)** occurs because <code>rainfall</code> has only five positions, but the loop tries to store values at indexes 5 and 6, which are outside the array."
  },
  {
    "id": "SDD-PY-17-09",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 9,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Apply: Match error to repair",
    "skills": [
      "errors",
      "debugging",
      "syntax-error",
      "execution-error",
      "logic-error"
    ],
    "questions": [
      {
        "prompt": "if average = 15: should be repaired by...",
        "options": [
          "Changing = to ==",
          "Adding an array",
          "Using float()"
        ],
        "answer": 0,
        "explanation": "A condition needs comparison, not assignment."
      },
      {
        "prompt": "NameError: index is not defined should be repaired by...",
        "options": [
          "Creating/using the correct loop variable before access",
          "Removing all quotation marks",
          "Changing print to Print"
        ],
        "answer": 0,
        "explanation": "The name must exist and be spelled consistently."
      },
      {
        "prompt": "Wrong total because every value is added twice is...",
        "options": [
          "A logic error",
          "A syntax error",
          "An indentation requirement only"
        ],
        "answer": 0,
        "explanation": "The program runs but the algorithm is wrong."
      }
    ]
  },
  {
    "id": "SDD-PY-17-10",
    "areaId": "sdd",
    "unitId": "sdd-errors-17",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Errors and debugging",
    "skills": [
      "errors",
      "debugging"
    ],
    "questions": [
      {
        "prompt": "Which error type stops code before it can be understood?",
        "options": [
          "Syntax error",
          "Logic error",
          "Evaluation error"
        ],
        "answer": 0,
        "explanation": "Invalid syntax prevents compilation."
      },
      {
        "prompt": "Which error type includes an array index outside its valid range?",
        "options": [
          "Execution error",
          "Logic error",
          "Syntax error"
        ],
        "answer": 0,
        "explanation": "The program starts, but stops when it tries to access an array position that does not exist. IDLE commonly reports IndexError."
      },
      {
        "prompt": "A program attempts to divide a value by zero. Which National 5 error type is this?",
        "options": [
          "Execution error",
          "Logic error",
          "Syntax error"
        ],
        "answer": 0,
        "explanation": "The instruction is valid syntax, but the program stops while running. IDLE reports ZeroDivisionError."
      },
      {
        "prompt": "A program tries to open an input file that does not exist. Which National 5 error type is this?",
        "options": [
          "Execution error",
          "Logic error",
          "Syntax error"
        ],
        "answer": 0,
        "explanation": "The program stops while running because the file cannot be found. IDLE commonly reports FileNotFoundError."
      },
      {
        "prompt": "What is the first debugging habit?",
        "options": [
          "Read the exact error and inspect the stated line plus nearby code",
          "Rewrite the whole program immediately",
          "Ignore the traceback"
        ],
        "answer": 0,
        "explanation": "The error message provides evidence about the fault."
      }
    ]
  },
  {
    "id": "SDD-PY-18-01",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Four evaluation headings",
    "skills": [
      "evaluation",
      "fitness-for-purpose",
      "efficiency",
      "robustness",
      "readability"
    ],
    "videoTitle": "Teacher explanation: Four evaluation headings",
    "videoUrl": "",
    "contentHtml": "<div class=\"concept-grid\"><div><strong>Fitness for purpose</strong><p>Have all functional requirements been met?</p></div><div><strong>Efficiency</strong><p>Does the solution avoid unnecessary code, checks or storage?</p></div><div><strong>Robustness</strong><p>Does validation help prevent user mistakes?</p></div><div><strong>Readability</strong><p>Do meaningful variable names, white space, indentation and comments make code easy to understand?</p></div></div><p>Strong answers name the evaluation heading, make the point and give a specific example from the program.</p>",
    "checkpoint": {
      "prompt": "Which heading is most directly improved by input validation?",
      "options": [
        "Robustness",
        "Readability",
        "Documentation only"
      ],
      "answer": 0,
      "explanation": "Validation prevents unacceptable input from being used."
    }
  },
  {
    "id": "SDD-PY-18-02",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Choose the evaluation heading",
    "skills": [
      "evaluation",
      "fitness-for-purpose",
      "efficiency",
      "robustness",
      "readability"
    ],
    "questions": [
      {
        "prompt": "The program calculates every required total correctly. This supports...",
        "options": [
          "Fitness for purpose",
          "Readability",
          "Exceptional testing"
        ],
        "answer": 0,
        "explanation": "The functional requirements are being met."
      },
      {
        "prompt": "The program uses one array instead of ten separate variables. This supports...",
        "options": [
          "Efficiency",
          "Syntax",
          "Normal data"
        ],
        "answer": 0,
        "explanation": "Related values are stored and processed economically."
      },
      {
        "prompt": "The code uses totalCost rather than xyz. This supports...",
        "options": [
          "Readability",
          "Robustness",
          "Maintenance only"
        ],
        "answer": 0,
        "explanation": "The variable purpose is clear."
      }
    ]
  },
  {
    "id": "SDD-PY-18-03",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 3,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Make evaluation answers specific",
    "skills": [
      "readability",
      "meaningful-identifiers",
      "question-specific-examples"
    ],
    "videoTitle": "Teacher explanation: Make evaluation answers specific",
    "videoUrl": "",
    "contentHtml": "<p>A weak answer says: <em>Use better names.</em></p><p>A stronger answer says:</p><blockquote>Replace <code>abc</code> and <code>xyz</code> with <strong>meaningful variable names</strong>, such as <code>totalScore</code>, so the stored values are clear.</blockquote><p>Use exact variable names, loops, arrays, validation rules or interface controls from the question whenever possible.</p>",
    "checkpoint": {
      "prompt": "Which phrase is an important readability keyword?",
      "options": [
        "Meaningful variable names",
        "More calculations",
        "Exceptional data only"
      ],
      "answer": 0,
      "explanation": "Meaningful variable names is a key evaluation term."
    }
  },
  {
    "id": "SDD-PY-18-04",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 4,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Evaluate readability",
    "skills": [
      "readability",
      "meaningful-identifiers",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program uses variables called <code>abc</code> and <code>xyz</code>.</p><p><strong>Explain one way to improve readability, using evidence from the program.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "State that meaningful variable names should be used.",
      "Refer to abc/xyz and suggest or describe clearer names that show what is stored."
    ],
    "modelAnswer": "Replace <code>abc</code> and <code>xyz</code> with **meaningful variable names**, such as <code>totalScore</code> or <code>pupilCount</code>, so it is clear what each value stores."
  },
  {
    "id": "SDD-PY-18-05",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 5,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Evaluate robustness",
    "skills": [
      "robustness",
      "input-validation",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program accepts a temperature and immediately uses it without checking a range.</p><p><strong>Explain why the program is not robust and state an improvement.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "Explain that invalid/unacceptable temperatures can be entered and used.",
      "Add input validation using a conditional loop and suitable range."
    ],
    "modelAnswer": "The program is not **robust** because it can use an invalid <code>temperature</code>. Add **input validation** with a conditional loop so only values in the permitted range are accepted."
  },
  {
    "id": "SDD-PY-18-06",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 6,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Evaluate efficiency",
    "skills": [
      "efficiency",
      "arrays",
      "fixed-loops",
      "elif",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A program stores ten related scores in ten separate variables and repeats the same processing code ten times.</p><p><strong>Explain one way to improve efficiency.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "Use one array to store the ten related scores.",
      "Use a fixed loop to process the array, reducing repeated variables/lines of code."
    ],
    "modelAnswer": "Store the ten scores in one **array** and process them using a **fixed loop**. This reduces repeated variables and duplicated lines of code."
  },
  {
    "id": "SDD-PY-18-07",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 7,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Learn: Evaluate a user interface",
    "skills": [
      "user-interface",
      "fit-for-purpose",
      "accessibility"
    ],
    "videoTitle": "Teacher explanation: Evaluate a user interface",
    "videoUrl": "",
    "contentHtml": "<p>An interface is fit for purpose only when users can complete all required tasks accurately.</p><p>Check for:</p><ul><li>all required input and output controls;</li><li>clear labels and instructions;</li><li>submit, navigation, delete or back controls where needed;</li><li>large touch targets for touchscreen use;</li><li>appropriate typing boxes versus selectable options.</li></ul>",
    "checkpoint": {
      "prompt": "A registration form has no submit button. What is the key issue?",
      "options": [
        "Users cannot complete the registration task",
        "The array is too long",
        "The code has a SyntaxError"
      ],
      "answer": 0,
      "explanation": "A required interface function is missing."
    }
  },
  {
    "id": "SDD-PY-18-08",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 8,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Interface fitness for purpose",
    "skills": [
      "user-interface",
      "fit-for-purpose",
      "question-specific-examples"
    ],
    "questionHtml": "<p>A touchscreen survey asks users to type one of five ratings into a small text box and provides no button to move to the next question.</p><p><strong>Explain two improvements.</strong> <span class=\"mark-chip\">2 marks</span></p>",
    "marks": 2,
    "markingPoints": [
      "Replace the typing box with large selectable rating buttons/options suitable for touch.",
      "Add a clear Next/navigation button so the user can continue."
    ],
    "modelAnswer": "Use large selectable **rating buttons** instead of requiring typed input, and add a clear **Next button** so the user can move through the survey."
  },
  {
    "id": "SDD-PY-18-09",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 9,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Build a strong evaluation answer",
    "skills": [
      "evaluation",
      "exam-technique",
      "question-specific-examples"
    ],
    "questions": [
      {
        "prompt": "Which answer is strongest?",
        "options": [
          "The code is readable.",
          "The code is readable because it uses meaningful variable names such as totalRevenue, making the stored value clear.",
          "Use names."
        ],
        "answer": 1,
        "explanation": "It uses the key term, gives a reason and cites exact evidence."
      },
      {
        "prompt": "Which evidence best supports robustness?",
        "options": [
          "A while loop validates age from 0 to 18",
          "The title is blue",
          "The program has five comments"
        ],
        "answer": 0,
        "explanation": "The validation prevents unacceptable input."
      }
    ]
  },
  {
    "id": "SDD-PY-18-10",
    "areaId": "sdd",
    "unitId": "sdd-evaluation-18",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Mastery checkpoint: Evaluation",
    "skills": [
      "evaluation",
      "fitness-for-purpose",
      "efficiency",
      "robustness",
      "readability"
    ],
    "questions": [
      {
        "prompt": "All functional requirements met means...",
        "options": [
          "Fit for purpose",
          "Exceptional",
          "A logic error"
        ],
        "answer": 0,
        "explanation": "Fitness for purpose is judged against requirements."
      },
      {
        "prompt": "Which features support readability?",
        "options": [
          "Meaningful names, white space, indentation and comments",
          "Random values only",
          "More separate variables"
        ],
        "answer": 0,
        "explanation": "These make program structure and purpose clear."
      },
      {
        "prompt": "What should every strong evaluation answer include?",
        "options": [
          "A specific example from the solution",
          "Only the word efficient",
          "A test value with no explanation"
        ],
        "answer": 0,
        "explanation": "Evidence anchors the judgement to the program."
      }
    ]
  },
  {
    "id": "SDD-PY-19-01",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 1,
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Capstone: Read the annotated signal program",
    "skills": [
      "capstone",
      "arrays",
      "input-validation",
      "fixed-loops",
      "selection",
      "round",
      "array-traversal"
    ],
    "videoTitle": "Teacher explanation: Capstone: Read the annotated signal program",
    "videoUrl": "",
    "contentHtml": "<p>This complete program collects five readings, validates each value, rounds and stores it, builds a signal pattern, then traverses the stored array.</p><img class=\"resource-image\" src=\"reading-signal-annotated.png\" alt=\"Annotated National 5 Reading and Signal Python program\"><p>Study the arrows carefully. The program combines all three standard algorithms: validation, a running construction of <code>signal</code>, and traversal of <code>readings</code>.</p>",
    "checkpoint": {
      "prompt": "Why must readings be an array?",
      "options": [
        "All five values are stored and used again later",
        "Only one value is ever needed",
        "Arrays automatically validate data"
      ],
      "answer": 0,
      "explanation": "The final loop needs access to every stored reading."
    }
  },
  {
    "id": "SDD-PY-19-02",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 2,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Check: Understand the capstone structure",
    "skills": [
      "capstone",
      "arrays",
      "fixed-loops",
      "input-validation"
    ],
    "questions": [
      {
        "prompt": "Why is readings initialised before the first loop?",
        "options": [
          "It must exist before valid values can be appended",
          "It stops selection",
          "It prints the pattern"
        ],
        "answer": 0,
        "explanation": "The loop adds values to the existing array."
      },
      {
        "prompt": "Why is the while loop inside the for loop?",
        "options": [
          "Each of the five readings must be validated separately",
          "The program needs ten readings",
          "It replaces rounding"
        ],
        "answer": 0,
        "explanation": "Every reading must be valid before storage."
      },
      {
        "prompt": "Why is the second for loop after the signal is printed?",
        "options": [
          "It traverses and displays all stored readings",
          "It validates the same input again",
          "It resets the array"
        ],
        "answer": 0,
        "explanation": "The array is used later to display each reading."
      }
    ]
  },
  {
    "id": "SDD-PY-19-03",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 3,
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Predict: Build a signal pattern",
    "skills": [
      "selection",
      "strings",
      "trace-code",
      "capstone"
    ],
    "questions": [
      {
        "prompt": "What signal is produced for [90, 20, 55, 81, 30]?",
        "options": [
          "SPMSM",
          "SPMSS",
          "SMPMS"
        ],
        "answer": 0,
        "explanation": "Over 80 gives S; below 30 gives P; every other value gives M. A value of exactly 30 is M."
      }
    ],
    "codeSnippet": "if reading > 80: add \"S\"\nelif reading < 30: add \"P\"\nelse: add \"M\""
  },
  {
    "id": "SDD-PY-19-04",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 4,
    "type": "visualiser",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Visualise: A smaller signal program",
    "topic": "A smaller signal program",
    "skills": [
      "capstone",
      "fixed-loops",
      "arrays",
      "selection",
      "visualiser"
    ],
    "instructions": "This three-reading version has no keyboard input. Step through the loop, array access and signal construction.",
    "starterCode": "readings = [90, 25, 55]\nsignal = \"\"\nfor index in range(len(readings)):\n    reading = readings[index]\n    if reading > 80:\n        signal = signal + \"S\"\n    elif reading < 30:\n        signal = signal + \"P\"\n    else:\n        signal = signal + \"M\"\nprint(signal)",
    "expectedOutput": "SPM",
    "hints": [
      "Watch reading and signal during every iteration."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "If"
      ],
      "requiredElif": true,
      "requiredElse": true,
      "requiredCalls": [
        "len",
        "print"
      ],
      "requiredSubscriptNames": [
        "readings"
      ]
    }
  },
  {
    "id": "SDD-PY-19-05",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 5,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Practise: Validate one signal reading",
    "topic": "Validate one signal reading",
    "skills": [
      "capstone",
      "input-validation",
      "round"
    ],
    "instructions": "Ask for a real <code>reading</code>. Accept only 0–100 inclusive, displaying the exact error message <code>Invalid input! Must be between 0 and 100.</code> when needed. Round and display the accepted reading.",
    "starterCode": "# Validate one reading, round it and display it\n",
    "expectedOutput": "Reading: 120\nInvalid input! Must be between 0 and 100.\nReading: 76.6\n77",
    "hints": [
      "Use a while loop with the invalid condition.",
      "Use reading = round(reading) after validation."
    ],
    "requirements": {
      "requiredNodes": [
        "While"
      ],
      "requiredBoolOperators": [
        "Or"
      ],
      "requiredCalls": [
        "input",
        "float",
        "round",
        "print"
      ],
      "whileUsesNames": [
        "reading"
      ]
    },
    "sampleInputs": [
      "120",
      "76.6"
    ],
    "tests": [
      {
        "inputs": [
          "120",
          "76.6"
        ],
        "expectedOutput": "Reading: 120\nInvalid input! Must be between 0 and 100.\nReading: 76.6\n77"
      },
      {
        "inputs": [
          "20.2"
        ],
        "expectedOutput": "Reading: 20.2\n20"
      }
    ]
  },
  {
    "id": "SDD-PY-19-06",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 6,
    "type": "code",
    "required": true,
    "estimatedMinutes": 10,
    "title": "Apply: Store readings and build the pattern",
    "topic": "Store readings and build the pattern",
    "skills": [
      "capstone",
      "arrays",
      "append",
      "selection",
      "fixed-loops"
    ],
    "instructions": "Use the supplied valid array <code>source</code>. Loop through it, append each value to <code>readings</code> and build <code>signal</code> using S for over 80, P for below 30 and M otherwise. Display signal and readings.",
    "starterCode": "source = [90, 25, 55, 82, 30]\nreadings = []\nsignal = \"\"\n# Complete the fixed loop and output\n",
    "expectedOutput": "SPMSM\n[90, 25, 55, 82, 30]",
    "hints": [
      "Append source[index].",
      "Use if/elif/else to add one letter each loop."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "If"
      ],
      "requiredElif": true,
      "requiredElse": true,
      "requiredDottedCalls": [
        "readings.append"
      ],
      "requiredSubscriptNames": [
        "source"
      ],
      "requiredPrintNames": [
        "signal",
        "readings"
      ]
    }
  },
  {
    "id": "SDD-PY-19-07",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 7,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Translate: Capstone algorithm to pseudocode",
    "skills": [
      "capstone",
      "pseudocode",
      "translation",
      "arrays"
    ],
    "questions": [
      {
        "prompt": "Which pseudocode represents readings.append(reading)?",
        "options": [
          "APPEND reading TO readings",
          "SET readings TO reading",
          "SEND readings TO DISPLAY"
        ],
        "answer": 0,
        "explanation": "APPEND adds the valid value to the array."
      },
      {
        "prompt": "Which pseudocode represents for counter in range(5)?",
        "options": [
          "LOOP 5 TIMES",
          "WHILE counter = 5",
          "IF counter < 5"
        ],
        "answer": 0,
        "explanation": "A fixed loop repeats five times."
      },
      {
        "prompt": "Which pseudocode represents signal = signal + \"S\"?",
        "options": [
          "SET signal TO signal & \"S\"",
          "SEND \"S\" TO DISPLAY",
          "SET signal TO EMPTY ARRAY"
        ],
        "answer": 0,
        "explanation": "The string is updated by concatenation."
      }
    ]
  },
  {
    "id": "SDD-PY-19-08",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 8,
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "title": "Exam practice: Evaluate the signal program",
    "skills": [
      "capstone",
      "evaluation",
      "efficiency",
      "robustness",
      "readability"
    ],
    "questionHtml": "<p>The signal program uses <code>readings</code>, a fixed loop, input validation and meaningful section comments.</p><p><strong>Evaluate the program under two different headings.</strong> <span class=\"mark-chip\">4 marks</span></p>",
    "marks": 4,
    "markingPoints": [
      "One valid heading and judgement, such as robustness because each reading is validated from 0–100.",
      "Specific evidence supporting the first heading.",
      "A second valid heading and judgement, such as efficiency/readability.",
      "Specific evidence such as the readings array, fixed loops, meaningful names, white space or comments."
    ],
    "modelAnswer": "The program is **robust** because a conditional loop rejects any <code>reading</code> outside 0–100 before it is stored. It is also **efficient** because the five related readings are stored in one <code>readings</code> array and processed using fixed loops rather than repeated variables and code."
  },
  {
    "id": "SDD-PY-19-09",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 9,
    "type": "code",
    "required": true,
    "estimatedMinutes": 20,
    "title": "Summit challenge: Complete Reading and Signal",
    "topic": "Complete Reading and Signal",
    "skills": [
      "capstone",
      "input-validation",
      "arrays",
      "fixed-loops",
      "selection",
      "round",
      "array-traversal"
    ],
    "instructions": "Create the complete program. Collect five valid real readings from 0–100. For each valid reading: round to zero decimal places, append to <code>readings</code>, and add S/P/M to <code>signal</code> using the given thresholds. Then display <code>The signal pattern is: PATTERN</code> and each reading as <code>Reading N: VALUE</code>. Use the exact input prompt <code>Reading: </code> and error message shown in the hints.",
    "starterCode": "readings = []\nsignal = \"\"\n\n# Complete the full program\n",
    "expectedOutput": "Reading: 90\nReading: 25\nReading: 55\nReading: 101\nInvalid input! Must be between 0 and 100.\nReading: 75\nReading: 82\nThe signal pattern is: SPMMS\nReading 1: 90\nReading 2: 25\nReading 3: 55\nReading 4: 75\nReading 5: 82",
    "hints": [
      "Use for counter in range(5).",
      "Inside it: input, validation, round, append and selection.",
      "Invalid input! Must be between 0 and 100.",
      "Use a second fixed loop to traverse readings."
    ],
    "requirements": {
      "requiredNodes": [
        "For",
        "While",
        "If"
      ],
      "requiredElif": true,
      "requiredElse": true,
      "requiredBoolOperators": [
        "Or"
      ],
      "requiredDottedCalls": [
        "readings.append"
      ],
      "requiredCalls": [
        "input",
        "float",
        "round",
        "print"
      ],
      "requiredSubscriptNames": [
        "readings"
      ],
      "requiredComments": true
    },
    "sampleInputs": [
      "90",
      "25",
      "55",
      "101",
      "75",
      "82"
    ],
    "tests": [
      {
        "inputs": [
          "90",
          "25",
          "55",
          "101",
          "75",
          "82"
        ],
        "expectedOutput": "Reading: 90\nReading: 25\nReading: 55\nReading: 101\nInvalid input! Must be between 0 and 100.\nReading: 75\nReading: 82\nThe signal pattern is: SPMMS\nReading 1: 90\nReading 2: 25\nReading 3: 55\nReading 4: 75\nReading 5: 82"
      },
      {
        "inputs": [
          "0",
          "29.6",
          "30",
          "80",
          "100"
        ],
        "expectedOutput": "Reading: 0\nReading: 29.6\nReading: 30\nReading: 80\nReading: 100\nThe signal pattern is: PMMMS\nReading 1: 0\nReading 2: 30\nReading 3: 30\nReading 4: 80\nReading 5: 100"
      }
    ]
  },
  {
    "id": "SDD-PY-19-10",
    "areaId": "sdd",
    "unitId": "sdd-capstone-19",
    "order": 10,
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "title": "Final SDD mastery checkpoint",
    "skills": [
      "capstone",
      "standard-algorithms",
      "development-process",
      "testing",
      "evaluation"
    ],
    "questions": [
      {
        "prompt": "Which set contains the three National 5 standard algorithms?",
        "options": [
          "Input validation, running total, array traversal",
          "Selection, comments, output",
          "Analysis, design, maintenance"
        ],
        "answer": 0,
        "explanation": "These algorithms must be recognised and implemented."
      },
      {
        "prompt": "Which design techniques may be requested?",
        "options": [
          "Pseudocode, flowchart or structure diagram",
          "Spreadsheet and database only",
          "HTML and CSS only"
        ],
        "answer": 0,
        "explanation": "These are the main SDD design representations."
      },
      {
        "prompt": "What makes an exam explanation secure?",
        "options": [
          "Key terminology plus exact evidence from the question",
          "A vague general sentence",
          "Only copying the question"
        ],
        "answer": 0,
        "explanation": "Name the concept, use specific evidence and explain why."
      },
      {
        "prompt": "What should happen after a failed test?",
        "options": [
          "Debug, improve and retest",
          "Ignore it",
          "Delete the expected result"
        ],
        "answer": 0,
        "explanation": "Development is iterative."
      }
    ]
  }
];

const ACTIVITY_TYPE_LABELS = {
  lesson: "Learn",
  video: "Video",
  quiz: "Quick check",
  predict: "Predict",
  visualiser: "Visualise",
  code: "Practise",
  debug: "Debug",
  "exam-style": "Exam practice",
  "official-paper": "Official paper"
};


const SPACED_QUESTIONS = [
  {
    "id": "SP-01-01",
    "unitId": "sdd-python-01",
    "prompt": "Which line correctly displays Hello?",
    "options": [
      "print(Hello)",
      "print(\"Hello\")",
      "Print(\"Hello\")"
    ],
    "answer": 1,
    "explanation": "Text needs quotation marks and print begins with a lowercase p.",
    "skills": [
      "print",
      "strings",
      "syntax"
    ]
  },
  {
    "id": "SP-01-02",
    "unitId": "sdd-python-01",
    "prompt": "Which symbol begins a Python comment?",
    "options": [
      "//",
      "#",
      "<!--"
    ],
    "answer": 1,
    "explanation": "Python comments begin with #.",
    "skills": [
      "comments",
      "syntax"
    ]
  },
  {
    "id": "SP-01-03",
    "unitId": "sdd-python-01",
    "prompt": "What is displayed on the second line?",
    "codeSnippet": "print(\"Start\")\\nprint(\"Middle\")\\nprint(\"Finish\")",
    "options": [
      "Start",
      "Middle",
      "Finish"
    ],
    "answer": 1,
    "explanation": "Python normally follows the instructions from top to bottom.",
    "skills": [
      "sequence",
      "predict-output"
    ]
  },
  {
    "id": "SP-01-04",
    "unitId": "sdd-python-01",
    "prompt": "Which is the best improvement for the variable name abc when it stores a total score?",
    "options": [
      "a",
      "totalScore",
      "number"
    ],
    "answer": 1,
    "explanation": "totalScore is a meaningful variable name because it describes the stored value.",
    "skills": [
      "meaningful-identifiers",
      "readability"
    ]
  },
  {
    "id": "SP-01-05",
    "unitId": "sdd-python-01",
    "prompt": "Why are meaningful variable names useful?",
    "options": [
      "They make the program run faster",
      "They make the purpose of stored values clear",
      "They prevent all syntax errors"
    ],
    "answer": 1,
    "explanation": "Meaningful variable names improve readability by describing what each value represents.",
    "skills": [
      "meaningful-identifiers",
      "readability"
    ]
  },
  {
    "id": "SP-01-06",
    "unitId": "sdd-python-01",
    "prompt": "Which change makes the structure of a program easier to follow?",
    "options": [
      "Consistent indentation",
      "Removing all spaces",
      "Using only one-letter names"
    ],
    "answer": 0,
    "explanation": "Consistent indentation makes blocks and program structure clear.",
    "skills": [
      "indentation",
      "readability"
    ]
  },
  {
    "id": "SP-01-07",
    "unitId": "sdd-python-01",
    "prompt": "When reading a Python traceback, which part should you usually read first?",
    "options": [
      "The final line containing the error type and message",
      "The first line only",
      "The longest line"
    ],
    "answer": 0,
    "explanation": "The final line usually names the error and explains the immediate problem.",
    "skills": [
      "errors",
      "debugging"
    ]
  },
  {
    "id": "SP-01-08",
    "unitId": "sdd-python-01",
    "prompt": "Which Python line translates SEND \"Ready\" TO DISPLAY?",
    "options": [
      "input(\"Ready\")",
      "print(\"Ready\")",
      "Ready = display"
    ],
    "answer": 1,
    "explanation": "SEND ... TO DISPLAY is represented by print().",
    "skills": [
      "pseudocode",
      "translation",
      "print"
    ]
  },
  {
    "id": "SP-01-09",
    "unitId": "sdd-python-01",
    prompt: `What error is caused by writing Print("Hello") instead of print("Hello")?`,
    "options": [
      "NameError",
      "SyntaxError",
      "TypeError"
    ],
    "answer": 0,
    "explanation": "NameError is correct. The brackets and quotation marks form valid Python syntax, but Print is an undefined name because Python is case-sensitive.",
    "skills": [
      "name-error",
      "debugging",
      "case-sensitivity"
    ]
  },
  {
    "id": "SP-01-11",
    "unitId": "sdd-python-01",
    "prompt": "Which line causes a SyntaxError?",
    "options": [
      `Print("Hello")`,
      `print("Hello"`,
      "print(Hello)"
    ],
    "answer": 1,
    "explanation": "The missing closing bracket makes the instruction grammatically incomplete, so Python raises SyntaxError. The other two lines have valid syntax but would normally raise NameError when run.",
    "skills": [
      "syntax-error",
      "debugging",
      "syntax"
    ]
  },
  {
    "id": "SP-01-10",
    "unitId": "sdd-python-01",
    "prompt": "Which answer is strongest for a readability question about variables abc and xyz?",
    "options": [
      "Use better names",
      "Replace abc and xyz with meaningful variable names such as totalScore and pupilCount so the stored values are clear",
      "Add more code"
    ],
    "answer": 1,
    "explanation": "The strongest answer uses the key term and specific examples from the question.",
    "skills": [
      "meaningful-identifiers",
      "question-specific-examples",
      "exam-technique"
    ]
  },
  {
    "id": "SP-02-01",
    "unitId": "sdd-python-02",
    "prompt": "What does the equals sign do in score = 7?",
    "options": [
      "Compares score with 7",
      "Assigns 7 to score",
      "Displays 7"
    ],
    "answer": 1,
    "explanation": "The equals sign assigns the value on the right to the variable on the left.",
    "skills": [
      "variables",
      "assignment"
    ]
  },
  {
    "id": "SP-02-02",
    "unitId": "sdd-python-02",
    "prompt": "Which data type is most suitable for the number of pupils in a class?",
    "options": [
      "Integer",
      "String",
      "Boolean"
    ],
    "answer": 0,
    "explanation": "A pupil count is a whole number, so integer is suitable.",
    "skills": [
      "data-types",
      "integer"
    ]
  },
  {
    "id": "SP-02-03",
    "unitId": "sdd-python-02",
    "prompt": "Which data type is most suitable for a pupil's name?",
    "options": [
      "Real",
      "String",
      "Boolean"
    ],
    "answer": 1,
    "explanation": "A name is text, so string is suitable.",
    "skills": [
      "data-types",
      "string"
    ]
  },
  {
    "id": "SP-02-04",
    "unitId": "sdd-python-02",
    "prompt": "Which data type is most suitable for a price such as 4.75?",
    "options": [
      "Real",
      "Integer",
      "Boolean"
    ],
    "answer": 0,
    "explanation": "A value with a decimal part is represented as a real number.",
    "skills": [
      "data-types",
      "real"
    ]
  },
  {
    "id": "SP-02-05",
    "unitId": "sdd-python-02",
    "prompt": "Which value is Boolean?",
    "options": [
      "\"True\"",
      "True",
      "1.0"
    ],
    "answer": 1,
    "explanation": "True without quotation marks is a Boolean value.",
    "skills": [
      "data-types",
      "boolean"
    ]
  },
  {
    "id": "SP-02-06",
    "unitId": "sdd-python-02",
    "prompt": "What is displayed?",
    "codeSnippet": "score = 4\\nscore = score + 3\\nprint(score)",
    "options": [
      "4",
      "7",
      "43"
    ],
    "answer": 1,
    "explanation": "The second assignment replaces score with 4 + 3, which is 7.",
    "skills": [
      "variables",
      "assignment",
      "trace-code"
    ]
  },
  {
    "id": "SP-02-07",
    "unitId": "sdd-python-02",
    "prompt": "Which variable name is most meaningful for storing a pupil's age?",
    "options": [
      "x",
      "age",
      "data"
    ],
    "answer": 1,
    "explanation": "age directly describes the stored value.",
    "skills": [
      "meaningful-identifiers",
      "variables"
    ]
  },
  {
    "id": "SP-02-08",
    "unitId": "sdd-python-02",
    "prompt": "What is the final value of total?",
    "codeSnippet": "total = 5\\nbonus = 2\\ntotal = total + bonus",
    "options": [
      "2",
      "5",
      "7"
    ],
    "answer": 2,
    "explanation": "The final assignment adds bonus to the existing total.",
    "skills": [
      "variables",
      "trace-code",
      "addition"
    ]
  },
  {
    "id": "SP-02-09",
    "unitId": "sdd-python-02",
    "prompt": "Which line creates a string variable called town?",
    "options": [
      "town = Aberdeen",
      "town = \"Aberdeen\"",
      "\"town\" = Aberdeen"
    ],
    "answer": 1,
    "explanation": "String values need quotation marks and the variable name is placed on the left.",
    "skills": [
      "variables",
      "string",
      "assignment"
    ]
  },
  {
    "id": "SP-02-10",
    "unitId": "sdd-python-02",
    "prompt": "Why is pupilCount stronger than xyz for storing the number of pupils?",
    "options": [
      "It is longer",
      "It is a meaningful variable name that explains the value",
      "It always stores an integer"
    ],
    "answer": 1,
    "explanation": "The name describes the purpose of the value and improves readability.",
    "skills": [
      "meaningful-identifiers",
      "readability",
      "question-specific-examples"
    ]
  },
  {
    "id": "SP-03-01",
    "unitId": "sdd-python-03",
    "prompt": "What data type does input() return before conversion?",
    "options": [
      "String",
      "Integer",
      "Boolean"
    ],
    "answer": 0,
    "explanation": "Keyboard input is initially received as text.",
    "skills": [
      "input",
      "string",
      "type-conversion"
    ]
  },
  {
    "id": "SP-03-02",
    "unitId": "sdd-python-03",
    "prompt": "Which line receives a whole-number age?",
    "options": [
      "age = input(\"Age: \")",
      "age = int(input(\"Age: \"))",
      "int = age(input())"
    ],
    "answer": 1,
    "explanation": "input() receives text and int() converts it to a whole number.",
    "skills": [
      "input",
      "integer",
      "type-conversion"
    ]
  },
  {
    "id": "SP-03-03",
    "unitId": "sdd-python-03",
    "prompt": "Which conversion is suitable for a price such as 12.50?",
    "options": [
      "str()",
      "float()",
      "bool()"
    ],
    "answer": 1,
    "explanation": "float() converts text into a real number.",
    "skills": [
      "input",
      "real",
      "type-conversion"
    ]
  },
  {
    "id": "SP-03-04",
    "unitId": "sdd-python-03",
    "prompt": "What error is likely if int() is used on the text hello?",
    "options": [
      "ValueError",
      "NameError",
      "ZeroDivisionError"
    ],
    "answer": 0,
    "explanation": "hello cannot be converted into an integer value.",
    "skills": [
      "value-error",
      "type-conversion",
      "debugging"
    ]
  },
  {
    "id": "SP-03-05",
    "unitId": "sdd-python-03",
    "prompt": "In IPO, what does the P stand for?",
    "options": [
      "Print",
      "Process",
      "Program"
    ],
    "answer": 1,
    "explanation": "IPO means Input, Process and Output.",
    "skills": [
      "ipo",
      "design"
    ]
  },
  {
    "id": "SP-03-06",
    "unitId": "sdd-python-03",
    "prompt": "Which is an input in a program that calculates an average of two marks?",
    "options": [
      "The two marks entered",
      "Adding the marks",
      "The average displayed"
    ],
    "answer": 0,
    "explanation": "The marks are supplied to the program as input.",
    "skills": [
      "ipo",
      "input",
      "analysis"
    ]
  },
  {
    "id": "SP-03-07",
    "unitId": "sdd-python-03",
    "prompt": "Which is the process in a program that calculates an average?",
    "options": [
      "Enter mark1",
      "Add the marks and divide by 2",
      "Display the result"
    ],
    "answer": 1,
    "explanation": "The calculation is the process.",
    "skills": [
      "ipo",
      "process",
      "average"
    ]
  },
  {
    "id": "SP-03-08",
    "unitId": "sdd-python-03",
    "prompt": "Why should a prompt be included inside input()?",
    "options": [
      "To tell the user what to enter",
      "To convert the value automatically",
      "To create a comment"
    ],
    "answer": 0,
    "explanation": "A clear prompt helps the user provide the expected data.",
    "skills": [
      "input",
      "user-interface",
      "prompts"
    ]
  },
  {
    "id": "SP-03-09",
    "unitId": "sdd-python-03",
    "prompt": "What is displayed if the user enters 5?",
    "codeSnippet": "number = int(input(\"Number: \"))\\nprint(number + 2)",
    "options": [
      "52",
      "7",
      "number + 2"
    ],
    "answer": 1,
    "explanation": "The input is converted to an integer, then 2 is added.",
    "skills": [
      "input",
      "integer",
      "addition",
      "trace-code"
    ]
  },
  {
    "id": "SP-03-10",
    "unitId": "sdd-python-03",
    "prompt": "Which design statement is correct for a name-and-age program?",
    "options": [
      "Name is an input and displaying the message is an output",
      "Displaying is an input",
      "The name is a process"
    ],
    "answer": 0,
    "explanation": "The user provides the name; the program displays the resulting message.",
    "skills": [
      "ipo",
      "input",
      "output",
      "design"
    ]
  },
  {
    "id": "SP-04-01",
    "unitId": "sdd-python-04",
    "prompt": "Which operator is used for multiplication in Python?",
    "options": [
      "x",
      "*",
      "^"
    ],
    "answer": 1,
    "explanation": "Python uses an asterisk for multiplication.",
    "skills": [
      "operators",
      "multiplication"
    ]
  },
  {
    "id": "SP-04-02",
    "unitId": "sdd-python-04",
    "prompt": "Which operator is used for exponentiation?",
    "options": [
      "^",
      "**",
      "x"
    ],
    "answer": 1,
    "explanation": "Python uses ** for exponentiation.",
    "skills": [
      "operators",
      "exponentiation"
    ]
  },
  {
    "id": "SP-04-03",
    "unitId": "sdd-python-04",
    "prompt": "What is the result of 2 + 3 * 4?",
    "options": [
      "20",
      "14",
      "24"
    ],
    "answer": 1,
    "explanation": "Multiplication happens before addition.",
    "skills": [
      "order-of-operations",
      "arithmetic"
    ]
  },
  {
    "id": "SP-04-04",
    "unitId": "sdd-python-04",
    "prompt": "Which expression correctly calculates the average of mark1 and mark2?",
    "options": [
      "mark1 + mark2 / 2",
      "(mark1 + mark2) / 2",
      "mark1 + (mark2 / 2)"
    ],
    "answer": 1,
    "explanation": "Brackets ensure both marks are added before division.",
    "skills": [
      "average",
      "brackets",
      "order-of-operations"
    ]
  },
  {
    "id": "SP-04-05",
    "unitId": "sdd-python-04",
    "prompt": "What does round(value, 1) do?",
    "options": [
      "Rounds value to one decimal place",
      "Rounds value to the nearest ten",
      "Converts value to an integer"
    ],
    "answer": 0,
    "explanation": "The second argument states the number of decimal places.",
    "skills": [
      "rounding",
      "functions"
    ]
  },
  {
    "id": "SP-04-06",
    "unitId": "sdd-python-04",
    "prompt": "What value is stored in area?",
    "codeSnippet": "length = 8\\nwidth = 5\\narea = length * width",
    "options": [
      "13",
      "40",
      "85"
    ],
    "answer": 1,
    "explanation": "Area is calculated by multiplying length by width.",
    "skills": [
      "multiplication",
      "variables",
      "trace-code"
    ]
  },
  {
    "id": "SP-04-07",
    "unitId": "sdd-python-04",
    "prompt": "Which statement best describes basicCost = timeInSeconds * animatorCharge?",
    "options": [
      "The two values are added",
      "timeInSeconds is multiplied by animatorCharge and stored in basicCost",
      "basicCost is displayed"
    ],
    "answer": 1,
    "explanation": "The expression multiplies the two named values and assigns the result.",
    "skills": [
      "calculation",
      "assignment",
      "explanation"
    ]
  },
  {
    "id": "SP-04-08",
    "unitId": "sdd-python-04",
    "prompt": "What is 3 ** 2?",
    "options": [
      "6",
      "9",
      "32"
    ],
    "answer": 1,
    "explanation": "3 squared is 3 multiplied by 3, which is 9.",
    "skills": [
      "exponentiation",
      "arithmetic"
    ]
  },
  {
    "id": "SP-04-09",
    "unitId": "sdd-python-04",
    "prompt": "Which line translates SET total TO price * quantity?",
    "options": [
      "total = price * quantity",
      "price * quantity = total",
      "print(total, price, quantity)"
    ],
    "answer": 0,
    "explanation": "The calculated value is assigned to total.",
    "skills": [
      "pseudocode",
      "translation",
      "multiplication",
      "assignment"
    ]
  },
  {
    "id": "SP-04-10",
    "unitId": "sdd-python-04",
    "prompt": "Which answer is strongest when explaining a calculation?",
    "options": [
      "It does maths",
      "The program multiplies timeInSeconds by animatorCharge and stores the result in basicCost",
      "basicCost changes"
    ],
    "answer": 1,
    "explanation": "The strongest answer names the exact variables, operation and destination from the question.",
    "skills": [
      "calculation",
      "question-specific-examples",
      "exam-technique"
    ]
  },
  {
    id: "SP-05-01", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which instruction is the process?",
    codeSnippet: `RECEIVE mark FROM (INTEGER) KEYBOARD
SET doubled TO mark * 2
SEND doubled TO DISPLAY`,
    options: ["RECEIVE mark FROM (INTEGER) KEYBOARD", "SET doubled TO mark * 2", "SEND doubled TO DISPLAY"],
    answer: 1,
    explanation: "The SET instruction performs the calculation and stores the result.",
    skills: ["pseudocode", "process", "design"]
  },
  {
    id: "SP-05-02", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which flowchart symbol contains the calculation?",
    diagramHtml: `<svg class="spaced-design-svg" viewBox="0 0 520 250" role="img" aria-label="Flowchart with input, process and output symbols">
      <ellipse cx="260" cy="25" rx="55" ry="20" class="flow-start-end"></ellipse><text x="260" y="31" text-anchor="middle">Start</text>
      <line x1="260" y1="45" x2="260" y2="65" class="flow-line"></line>
      <polygon points="180,70 350,70 330,110 160,110" class="flow-input-output"></polygon><text x="255" y="95" text-anchor="middle">Receive number</text>
      <line x1="260" y1="110" x2="260" y2="130" class="flow-line"></line>
      <rect x="175" y="135" width="170" height="42" rx="5" class="flow-process"></rect><text x="260" y="161" text-anchor="middle">answer = number + 5</text>
      <line x1="260" y1="177" x2="260" y2="197" class="flow-line"></line>
      <polygon points="180,202 350,202 330,242 160,242" class="flow-input-output"></polygon><text x="255" y="227" text-anchor="middle">Display answer</text>
    </svg>`,
    options: ["The parallelogram labelled Receive number", "The rectangle labelled answer = number + 5", "The parallelogram labelled Display answer"],
    answer: 1,
    explanation: "A rectangle represents a process such as a calculation.",
    skills: ["flowcharts", "process", "symbols"]
  },
  {
    id: "SP-05-03", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which flowchart symbol represents a decision?",
    diagramHtml: `<div class="symbol-choice-row"><div><svg viewBox="0 0 120 80" class="symbol-svg"><rect x="18" y="18" width="84" height="44" rx="3" class="flow-process"></rect></svg><span>A</span></div><div><svg viewBox="0 0 120 80" class="symbol-svg"><polygon points="60,8 108,40 60,72 12,40" class="flow-decision"></polygon></svg><span>B</span></div><div><svg viewBox="0 0 120 80" class="symbol-svg"><polygon points="25,18 105,18 95,62 15,62" class="flow-input-output"></polygon></svg><span>C</span></div></div>`,
    options: ["A", "B", "C"], answer: 1,
    explanation: "The diamond, labelled B, represents a decision or condition.",
    skills: ["flowcharts", "decision", "symbols"]
  },
  {
    id: "SP-05-04", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which submodule performs the calculation?",
    diagramHtml: `<svg class="spaced-design-svg" viewBox="0 0 620 230" role="img" aria-label="Structure diagram for calculate class average">
      <rect x="205" y="15" width="210" height="48" rx="7" class="structure-node-main"></rect><text x="310" y="44" text-anchor="middle">Calculate class average</text>
      <line x1="310" y1="63" x2="310" y2="98" class="structure-line"></line><line x1="90" y1="98" x2="530" y2="98" class="structure-line"></line>
      <line x1="90" y1="98" x2="90" y2="122" class="structure-line"></line><line x1="310" y1="98" x2="310" y2="122" class="structure-line"></line><line x1="530" y1="98" x2="530" y2="122" class="structure-line"></line>
      <rect x="15" y="122" width="150" height="55" rx="7" class="structure-node"></rect><text x="90" y="154" text-anchor="middle">Get marks</text>
      <rect x="225" y="122" width="170" height="55" rx="7" class="structure-node"></rect><text x="310" y="154" text-anchor="middle">Calculate average</text>
      <rect x="455" y="122" width="150" height="55" rx="7" class="structure-node"></rect><text x="530" y="148" text-anchor="middle"><tspan x="530">Display</tspan><tspan x="530" dy="18">average</tspan></text>
    </svg>`,
    options: ["Get marks", "Calculate average", "Display average"], answer: 1,
    explanation: "The Calculate average submodule performs the calculation.",
    skills: ["structure-diagrams", "modules", "decomposition"]
  },
  {
    id: "SP-05-05", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "What is the main purpose of a structure diagram?",
    options: ["Show the exact Python syntax", "Show how a problem is divided into smaller modules", "Show test data in a table"], answer: 1,
    explanation: "A structure diagram shows decomposition and the hierarchy of modules.",
    skills: ["structure-diagrams", "decomposition", "design"]
  },
  {
    id: "SP-05-06", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which representation is best for showing a decision with Yes and No paths?",
    options: ["Flowchart", "Structure diagram", "Variable table"], answer: 0,
    explanation: "A flowchart uses a decision diamond with separate branches such as Yes and No.",
    skills: ["flowcharts", "decision", "comparison"]
  },
  {
    id: "SP-05-07", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which Python line translates SEND total TO DISPLAY?",
    options: ["print(total)", "total = input()", "SEND(total)"], answer: 0,
    explanation: "SEND ... TO DISPLAY is translated using print().",
    skills: ["pseudocode", "translation", "print"]
  },
  {
    id: "SP-05-08", unitId: "sdd-design-05", formatGroup: "design-representation",
    prompt: "Which statement correctly compares the representations?",
    options: ["A structure diagram shows modules, while a flowchart shows the sequence and decisions", "A flowchart only shows variable names", "Pseudocode cannot describe input"], answer: 0,
    explanation: "Structure diagrams show decomposition; flowcharts show the route through the algorithm.",
    skills: ["flowcharts", "structure-diagrams", "comparison"]
  }
,

  {
    "id": "SP-06-01",
    "unitId": "sdd-selection-06",
    "prompt": "Which operator compares two values for equality?",
    "options": [
      "=",
      "==",
      "!="
    ],
    "answer": 1,
    "explanation": "Use == for comparison; = assigns a value.",
    "skills": [
      "selection",
      "comparison-operators"
    ]
  },
  {
    "id": "SP-06-02",
    "unitId": "sdd-selection-06",
    "prompt": "What is displayed?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 1,
    "explanation": "64 meets the elif mark >= 60 condition.",
    "skills": [
      "selection",
      "trace-code"
    ],
    "codeSnippet": "mark = 64\nif mark >= 70:\n    print(\"A\")\nelif mark >= 60:\n    print(\"B\")\nelse:\n    print(\"C\")"
  },
  {
    "id": "SP-06-03",
    "unitId": "sdd-selection-06",
    "prompt": "Which keyword means otherwise, if another condition is true?",
    "options": [
      "else",
      "elif",
      "while"
    ],
    "answer": 1,
    "explanation": "Python uses elif.",
    "skills": [
      "selection",
      "elif"
    ]
  },
  {
    "id": "SP-06-04",
    "unitId": "sdd-selection-06",
    "prompt": "Why is if/elif/else efficient for mutually exclusive choices?",
    "options": [
      "It stops checking after the first true branch",
      "It runs every branch",
      "It removes indentation"
    ],
    "answer": 0,
    "explanation": "Remaining branches are skipped.",
    "skills": [
      "selection",
      "efficiency"
    ]
  },
  {
    "id": "SP-06-05",
    "unitId": "sdd-selection-06",
    "prompt": "Which condition means age is no more than 16?",
    "options": [
      "age < 16",
      "age <= 16",
      "age >= 16"
    ],
    "answer": 1,
    "explanation": "No more than includes 16.",
    "skills": [
      "comparison-operators",
      "selection"
    ]
  },
  {
    "id": "SP-06-06",
    "unitId": "sdd-selection-06",
    "prompt": "What must follow an if condition in Python?",
    "options": [
      "A colon",
      "A semicolon",
      "END IF"
    ],
    "answer": 0,
    "explanation": "Python headers end with a colon.",
    "skills": [
      "syntax",
      "selection"
    ]
  },
  {
    "id": "SP-07-01",
    "unitId": "sdd-logic-07",
    "prompt": "Which operator is true only when both conditions are true?",
    "options": [
      "and",
      "or",
      "not"
    ],
    "answer": 0,
    "explanation": "AND requires both sides.",
    "skills": [
      "logical-operators",
      "and"
    ]
  },
  {
    "id": "SP-07-02",
    "unitId": "sdd-logic-07",
    "prompt": "Which invalid condition rejects values outside 0–100?",
    "options": [
      "value < 0 or value > 100",
      "value < 0 and value > 100",
      "value >= 0 and value <= 100"
    ],
    "answer": 0,
    "explanation": "Either invalid boundary is enough.",
    "skills": [
      "logical-operators",
      "or"
    ]
  },
  {
    "id": "SP-07-03",
    "unitId": "sdd-logic-07",
    "prompt": "What is NOT False?",
    "options": [
      "False",
      "True",
      "0"
    ],
    "answer": 1,
    "explanation": "NOT reverses the Boolean result.",
    "skills": [
      "logical-operators",
      "not"
    ]
  },
  {
    "id": "SP-07-04",
    "unitId": "sdd-logic-07",
    "prompt": "A password must be 8–20 characters inclusive. Which join is correct?",
    "options": [
      "and",
      "or",
      "not"
    ],
    "answer": 0,
    "explanation": "Both minimum and maximum checks must hold.",
    "skills": [
      "logical-operators",
      "and",
      "len"
    ]
  },
  {
    "id": "SP-07-05",
    "unitId": "sdd-logic-07",
    "prompt": "Why can value < 5 and value > 75 never identify an invalid value?",
    "options": [
      "One number cannot satisfy both comparisons",
      "AND always means valid",
      "75 is a string"
    ],
    "answer": 0,
    "explanation": "Outside a range needs OR.",
    "skills": [
      "logical-operators",
      "conditions"
    ]
  },
  {
    "id": "SP-07-06",
    "unitId": "sdd-logic-07",
    "prompt": "Which condition is equivalent to not(age >= 0 and age <= 18)?",
    "options": [
      "age < 0 or age > 18",
      "age < 0 and age > 18",
      "age == 0"
    ],
    "answer": 0,
    "explanation": "It describes the two invalid sides.",
    "skills": [
      "logical-operators",
      "not",
      "or"
    ]
  },
  {
    "id": "SP-08-01",
    "unitId": "sdd-functions-08",
    "prompt": "Which function counts characters or array items?",
    "options": [
      "len()",
      "round()",
      "random.randint()"
    ],
    "answer": 0,
    "explanation": "Use len().",
    "skills": [
      "predefined-functions",
      "len"
    ]
  },
  {
    "id": "SP-08-02",
    "unitId": "sdd-functions-08",
    "prompt": "What is round(7.46, 1)?",
    "options": [
      "7.4",
      "7.5",
      "7"
    ],
    "answer": 1,
    "explanation": "7.46 rounds to 7.5 to one decimal place.",
    "skills": [
      "round",
      "predefined-functions"
    ]
  },
  {
    "id": "SP-08-03",
    "unitId": "sdd-functions-08",
    "prompt": "What values can random.randint(2, 5) return?",
    "options": [
      "2, 3, 4 or 5",
      "2, 3 or 4 only",
      "5 only"
    ],
    "answer": 0,
    "explanation": "Both endpoints are inclusive.",
    "skills": [
      "random",
      "predefined-functions"
    ]
  },
  {
    "id": "SP-08-04",
    "unitId": "sdd-functions-08",
    "prompt": "Why use len(events) - 1 as the highest random array index?",
    "options": [
      "Indexes start at 0",
      "len() is always one too large by mistake",
      "Arrays start at 1"
    ],
    "answer": 0,
    "explanation": "The final valid index is one less than the item count.",
    "skills": [
      "len",
      "random",
      "arrays"
    ]
  },
  {
    "id": "SP-08-05",
    "unitId": "sdd-functions-08",
    "prompt": "What is displayed?",
    "options": [
      "6",
      "7",
      "8"
    ],
    "answer": 1,
    "explanation": "The space is included in the string length.",
    "skills": [
      "len",
      "strings"
    ],
    "codeSnippet": "print(len(\"Red Fox\"))"
  },
  {
    "id": "SP-08-06",
    "unitId": "sdd-functions-08",
    "prompt": "Which clue suggests round()?",
    "options": [
      "to two decimal places",
      "number of characters",
      "random choice"
    ],
    "answer": 0,
    "explanation": "Decimal places indicates rounding.",
    "skills": [
      "round",
      "exam-technique"
    ]
  },
  {
    "id": "SP-09-01",
    "unitId": "sdd-loops-09",
    "prompt": "How many times does range(4) repeat?",
    "options": [
      "3",
      "4",
      "5"
    ],
    "answer": 1,
    "explanation": "It produces 0,1,2,3.",
    "skills": [
      "fixed-loops",
      "range"
    ]
  },
  {
    "id": "SP-09-02",
    "unitId": "sdd-loops-09",
    "prompt": "Which range produces 5,6,7,8?",
    "options": [
      "range(5,8)",
      "range(5,9)",
      "range(4,8)"
    ],
    "answer": 1,
    "explanation": "The stop value 9 is excluded.",
    "skills": [
      "range",
      "fixed-loops"
    ]
  },
  {
    "id": "SP-09-03",
    "unitId": "sdd-loops-09",
    "prompt": "Which phrase suggests a fixed loop?",
    "options": [
      "for each of 20 pupils",
      "until valid",
      "while not finished"
    ],
    "answer": 0,
    "explanation": "The number is known.",
    "skills": [
      "fixed-loops",
      "exam-technique"
    ]
  },
  {
    "id": "SP-09-04",
    "unitId": "sdd-loops-09",
    "prompt": "What is the first value of counter?",
    "options": [
      "0",
      "1",
      "5"
    ],
    "answer": 0,
    "explanation": "range(5) begins at 0.",
    "skills": [
      "range",
      "iteration"
    ],
    "codeSnippet": "for counter in range(5):\n    print(counter)"
  },
  {
    "id": "SP-09-05",
    "unitId": "sdd-loops-09",
    "prompt": "What must be indented under a for line?",
    "options": [
      "The repeated instructions",
      "The code before it",
      "Only comments"
    ],
    "answer": 0,
    "explanation": "The loop body is indented.",
    "skills": [
      "indentation",
      "fixed-loops"
    ]
  },
  {
    "id": "SP-09-06",
    "unitId": "sdd-loops-09",
    "prompt": "Which pseudocode matches for i in range(3)?",
    "options": [
      "LOOP 3 TIMES",
      "LOOP 2 TIMES",
      "WHILE i = 3"
    ],
    "answer": 0,
    "explanation": "range(3) repeats three times.",
    "skills": [
      "pseudocode",
      "translation",
      "fixed-loops"
    ]
  },
  {
    "id": "SP-10-01",
    "unitId": "sdd-totals-10",
    "prompt": "Which line updates a running total?",
    "options": [
      "total = total + value",
      "total = value",
      "value = 0"
    ],
    "answer": 0,
    "explanation": "It combines the previous total with the new value.",
    "skills": [
      "running-total"
    ]
  },
  {
    "id": "SP-10-02",
    "unitId": "sdd-totals-10",
    "prompt": "Where should total = 0 appear?",
    "options": [
      "Before the loop",
      "Inside every iteration",
      "After print(total)"
    ],
    "answer": 0,
    "explanation": "The accumulator must not reset.",
    "skills": [
      "running-total",
      "standard-algorithms"
    ]
  },
  {
    "id": "SP-10-03",
    "unitId": "sdd-totals-10",
    "prompt": "What is displayed?",
    "options": [
      "3",
      "6",
      "9"
    ],
    "answer": 1,
    "explanation": "1+2+3 = 6.",
    "skills": [
      "running-total",
      "trace-code"
    ],
    "codeSnippet": "total = 0\nfor n in range(1,4):\n    total = total + n\nprint(total)"
  },
  {
    "id": "SP-10-04",
    "unitId": "sdd-totals-10",
    "prompt": "Why place an if inside a loop?",
    "options": [
      "To make a decision for each repeated item",
      "To initialise the loop",
      "To avoid variables"
    ],
    "answer": 0,
    "explanation": "Nested selection handles each value individually.",
    "skills": [
      "nested-selection",
      "fixed-loops"
    ]
  },
  {
    "id": "SP-10-05",
    "unitId": "sdd-totals-10",
    "prompt": "Which standard algorithm adds values one at a time?",
    "options": [
      "Running total",
      "Input validation",
      "Array initialisation"
    ],
    "answer": 0,
    "explanation": "A running total accumulates values.",
    "skills": [
      "running-total",
      "standard-algorithms"
    ]
  },
  {
    "id": "SP-10-06",
    "unitId": "sdd-totals-10",
    "prompt": "What logic error occurs if total = 0 is inside the loop?",
    "options": [
      "Previous additions are lost",
      "The loop becomes conditional",
      "The array grows"
    ],
    "answer": 0,
    "explanation": "The total resets each time.",
    "skills": [
      "logic-error",
      "running-total"
    ]
  },
  {
    "id": "SP-11-01",
    "unitId": "sdd-while-11",
    "prompt": "Which loop is suitable when repetitions are unknown?",
    "options": [
      "while",
      "for only",
      "print"
    ],
    "answer": 0,
    "explanation": "A conditional loop responds to a condition.",
    "skills": [
      "conditional-loops",
      "while-loop"
    ]
  },
  {
    "id": "SP-11-02",
    "unitId": "sdd-while-11",
    "prompt": "What must change to prevent an infinite loop?",
    "options": [
      "A value used in the condition",
      "The program title",
      "Every string literal"
    ],
    "answer": 0,
    "explanation": "The condition must eventually become false.",
    "skills": [
      "conditional-loops",
      "infinite-loop"
    ]
  },
  {
    "id": "SP-11-03",
    "unitId": "sdd-while-11",
    "prompt": "What is displayed after the loop?",
    "options": [
      "2",
      "3",
      "4"
    ],
    "answer": 1,
    "explanation": "count reaches 3 then count < 3 becomes false.",
    "skills": [
      "conditional-loops",
      "trace-code"
    ],
    "codeSnippet": "count = 0\nwhile count < 3:\n    count = count + 1\nprint(count)"
  },
  {
    "id": "SP-11-04",
    "unitId": "sdd-while-11",
    "prompt": "Which phrase suggests a conditional loop?",
    "options": [
      "until the user chooses Exit",
      "for each of five values",
      "repeat exactly ten times"
    ],
    "answer": 0,
    "explanation": "The number of choices is unknown.",
    "skills": [
      "conditional-loops",
      "exam-technique"
    ]
  },
  {
    "id": "SP-11-05",
    "unitId": "sdd-while-11",
    "prompt": "What is a control variable?",
    "options": [
      "A value used to decide whether repetition continues",
      "A comment",
      "An array item only"
    ],
    "answer": 0,
    "explanation": "Its changing value controls the loop.",
    "skills": [
      "control-variable",
      "conditional-loops"
    ]
  },
  {
    "id": "SP-11-06",
    "unitId": "sdd-while-11",
    "prompt": "Which Python operator means does not equal?",
    "options": [
      "!=",
      "==",
      "=!"
    ],
    "answer": 0,
    "explanation": "Use !=.",
    "skills": [
      "comparison-operators",
      "conditional-loops"
    ]
  },
  {
    "id": "SP-12-01",
    "unitId": "sdd-validation-12",
    "prompt": "What is the correct validation order?",
    "options": [
      "Input, while invalid, error, input again",
      "While valid, input once, stop",
      "Error, no input, fixed loop"
    ],
    "answer": 0,
    "explanation": "Take a first value before testing it.",
    "skills": [
      "input-validation",
      "standard-algorithms"
    ]
  },
  {
    "id": "SP-12-02",
    "unitId": "sdd-validation-12",
    "prompt": "Which condition rejects a value above 50 or below -20?",
    "options": [
      "temperature < -20 or temperature > 50",
      "temperature < -20 and temperature > 50",
      "temperature >= -20 and temperature <= 50"
    ],
    "answer": 0,
    "explanation": "The loop should test invalid values.",
    "skills": [
      "input-validation",
      "logical-operators"
    ]
  },
  {
    "id": "SP-12-03",
    "unitId": "sdd-validation-12",
    "prompt": "If the first value is valid, what happens?",
    "options": [
      "The while body is skipped",
      "The error always prints once",
      "The program crashes"
    ],
    "answer": 0,
    "explanation": "The invalid condition is false.",
    "skills": [
      "input-validation",
      "while-loop"
    ]
  },
  {
    "id": "SP-12-04",
    "unitId": "sdd-validation-12",
    "prompt": "What instruction is essential inside a validation loop?",
    "options": [
      "Receive the value again",
      "Reset every total",
      "Create a second program"
    ],
    "answer": 0,
    "explanation": "Re-entry lets the condition change.",
    "skills": [
      "input-validation",
      "infinite-loop"
    ]
  },
  {
    "id": "SP-12-05",
    "unitId": "sdd-validation-12",
    "prompt": "Which keyword in a question signals validation?",
    "options": [
      "only accept",
      "display once",
      "calculate total"
    ],
    "answer": 0,
    "explanation": "Only accept means reject and repeat invalid input.",
    "skills": [
      "input-validation",
      "exam-technique"
    ]
  },
  {
    "id": "SP-12-06",
    "unitId": "sdd-validation-12",
    "prompt": "Why should an error message be displayed?",
    "options": [
      "So the user knows the input was unacceptable",
      "To make the loop fixed",
      "To initialise an array"
    ],
    "answer": 0,
    "explanation": "The user needs clear guidance before re-entry.",
    "skills": [
      "input-validation",
      "user-interface"
    ]
  },
  {
    "id": "SP-13-01",
    "unitId": "sdd-arrays-13",
    "prompt": "Which line creates an empty array?",
    "options": [
      "values = []",
      "values = 0",
      "values = \"\""
    ],
    "answer": 0,
    "explanation": "Square brackets create a list.",
    "skills": [
      "arrays",
      "initialisation"
    ]
  },
  {
    "id": "SP-13-02",
    "unitId": "sdd-arrays-13",
    "prompt": "Which method adds one value to the end?",
    "options": [
      "append()",
      "round()",
      "input()"
    ],
    "answer": 0,
    "explanation": "Use append().",
    "skills": [
      "arrays",
      "append"
    ]
  },
  {
    "id": "SP-13-03",
    "unitId": "sdd-arrays-13",
    "prompt": "What is displayed?",
    "options": [
      "10",
      "20",
      "30"
    ],
    "answer": 1,
    "explanation": "Index 1 is the second item.",
    "skills": [
      "arrays",
      "indexing"
    ],
    "codeSnippet": "values = [10,20,30]\nprint(values[1])"
  },
  {
    "id": "SP-13-04",
    "unitId": "sdd-arrays-13",
    "prompt": "Why use an array for five readings?",
    "options": [
      "They are related and needed later",
      "It automatically validates them",
      "It removes all loops"
    ],
    "answer": 0,
    "explanation": "An array stores several related values under one name.",
    "skills": [
      "arrays",
      "data-structures"
    ]
  },
  {
    "id": "SP-13-05",
    "unitId": "sdd-arrays-13",
    "prompt": "Which line creates five integer positions initially set to zero?",
    "options": [
      "marks = [0] * 5",
      "marks = [] * 0",
      "marks = 5"
    ],
    "answer": 0,
    "explanation": "[0] * 5 creates five values.",
    "skills": [
      "arrays",
      "initialisation"
    ]
  },
  {
    "id": "SP-13-06",
    "unitId": "sdd-arrays-13",
    "prompt": "What causes an IndexError?",
    "options": [
      "Accessing a position outside the array",
      "Using meaningful names",
      "Using len()"
    ],
    "answer": 0,
    "explanation": "The requested index does not exist.",
    "skills": [
      "arrays",
      "index-error"
    ]
  },
  {
    "id": "SP-14-01",
    "unitId": "sdd-traversal-14",
    "prompt": "What does traversing an array mean?",
    "options": [
      "Visiting every item one at a time",
      "Deleting every item",
      "Creating one variable"
    ],
    "answer": 0,
    "explanation": "Traversal processes each element.",
    "skills": [
      "array-traversal",
      "standard-algorithms"
    ]
  },
  {
    "id": "SP-14-02",
    "unitId": "sdd-traversal-14",
    "prompt": "Which loop safely traverses values?",
    "options": [
      "for index in range(len(values)):",
      "for index in range(len(values)+1):",
      "for index in range(1):"
    ],
    "answer": 0,
    "explanation": "It creates exactly the valid indexes.",
    "skills": [
      "array-traversal",
      "len"
    ]
  },
  {
    "id": "SP-14-03",
    "unitId": "sdd-traversal-14",
    "prompt": "What is displayed?",
    "options": [
      "5",
      "15",
      "25"
    ],
    "answer": 1,
    "explanation": "The values 4,5,6 total 15.",
    "skills": [
      "array-traversal",
      "running-total"
    ],
    "codeSnippet": "values=[4,5,6]\ntotal=0\nfor index in range(len(values)):\n    total=total+values[index]\nprint(total)"
  },
  {
    "id": "SP-14-04",
    "unitId": "sdd-traversal-14",
    "prompt": "Which expression accesses the current element?",
    "options": [
      "values[index]",
      "index[values]",
      "len[index]"
    ],
    "answer": 0,
    "explanation": "Array name then index in brackets.",
    "skills": [
      "array-traversal",
      "indexing"
    ]
  },
  {
    "id": "SP-14-05",
    "unitId": "sdd-traversal-14",
    "prompt": "Why is len(arrayName) useful in traversal?",
    "options": [
      "The loop adapts to the array size",
      "It adds values",
      "It rounds indexes"
    ],
    "answer": 0,
    "explanation": "The number of loop iterations matches item count.",
    "skills": [
      "array-traversal",
      "len"
    ]
  },
  {
    "id": "SP-14-06",
    "unitId": "sdd-traversal-14",
    "prompt": "Which standard algorithm displays or processes each array element?",
    "options": [
      "Traverse a 1D array",
      "Input validation",
      "Selection only"
    ],
    "answer": 0,
    "explanation": "Traversal visits each item.",
    "skills": [
      "array-traversal",
      "standard-algorithms"
    ]
  },
  {
    "id": "SP-15-01",
    "unitId": "sdd-process-15",
    "prompt": "Which stage gathers functional requirements?",
    "options": [
      "Analysis",
      "Implementation",
      "Maintenance"
    ],
    "answer": 0,
    "explanation": "Analysis establishes what is needed.",
    "skills": [
      "development-process",
      "analysis"
    ]
  },
  {
    "id": "SP-15-02",
    "unitId": "sdd-process-15",
    "prompt": "Which stage creates Python code?",
    "options": [
      "Implementation",
      "Evaluation",
      "Documentation"
    ],
    "answer": 0,
    "explanation": "Implementation builds the solution.",
    "skills": [
      "development-process",
      "implementation"
    ]
  },
  {
    "id": "SP-15-03",
    "unitId": "sdd-process-15",
    "prompt": "What does iterative development mean?",
    "options": [
      "Stages can be revisited",
      "Testing happens once only",
      "Design is skipped"
    ],
    "answer": 0,
    "explanation": "Feedback causes cycles of improvement.",
    "skills": [
      "development-process",
      "iterative"
    ]
  },
  {
    "id": "SP-15-04",
    "unitId": "sdd-process-15",
    "prompt": "Which is a functional requirement?",
    "options": [
      "The program must display a total",
      "The programmer prefers green",
      "The code is 20 lines"
    ],
    "answer": 0,
    "explanation": "It describes required behaviour.",
    "skills": [
      "functional-requirements",
      "analysis"
    ]
  },
  {
    "id": "SP-15-05",
    "unitId": "sdd-process-15",
    "prompt": "Which interface control suits one of five fixed ratings?",
    "options": [
      "Selectable buttons",
      "A long text box",
      "No control"
    ],
    "answer": 0,
    "explanation": "Known options should be directly selectable.",
    "skills": [
      "user-interface",
      "fit-for-purpose"
    ]
  },
  {
    "id": "SP-15-06",
    "unitId": "sdd-process-15",
    "prompt": "Why return to design after a failed test?",
    "options": [
      "The solution needs changing before recoding",
      "To avoid implementation",
      "To remove requirements"
    ],
    "answer": 0,
    "explanation": "The algorithm should be corrected first.",
    "skills": [
      "development-process",
      "design",
      "testing"
    ]
  },
  {
    "id": "SP-16-01",
    "unitId": "sdd-testing-16",
    "prompt": "For range 1–10, what type is 5?",
    "options": [
      "Normal",
      "Extreme",
      "Exceptional"
    ],
    "answer": 0,
    "explanation": "5 is a typical valid value.",
    "skills": [
      "testing",
      "normal-data"
    ]
  },
  {
    "id": "SP-16-02",
    "unitId": "sdd-testing-16",
    "prompt": "For range 1–10, what type is 10?",
    "options": [
      "Normal",
      "Extreme",
      "Exceptional"
    ],
    "answer": 1,
    "explanation": "10 is a valid boundary.",
    "skills": [
      "testing",
      "extreme-data"
    ]
  },
  {
    "id": "SP-16-03",
    "unitId": "sdd-testing-16",
    "prompt": "For range 1–10, what type is 11?",
    "options": [
      "Normal",
      "Extreme",
      "Exceptional"
    ],
    "answer": 2,
    "explanation": "11 is invalid.",
    "skills": [
      "testing",
      "exceptional-data"
    ]
  },
  {
    "id": "SP-16-04",
    "unitId": "sdd-testing-16",
    "prompt": "What is written before the test is run?",
    "options": [
      "Expected result",
      "Actual result",
      "Maintenance change"
    ],
    "answer": 0,
    "explanation": "Expected behaviour is predicted first.",
    "skills": [
      "testing",
      "expected-results"
    ]
  },
  {
    "id": "SP-16-05",
    "unitId": "sdd-testing-16",
    "prompt": "Which values best test both valid boundaries of 0–30?",
    "options": [
      "0 and 30",
      "1 and 29",
      "-1 and 31"
    ],
    "answer": 0,
    "explanation": "The boundaries are extreme valid data.",
    "skills": [
      "testing",
      "extreme-data"
    ]
  },
  {
    "id": "SP-16-06",
    "unitId": "sdd-testing-16",
    "prompt": "What should happen when actual and expected results differ?",
    "options": [
      "Debug and retest",
      "Ignore it",
      "Change the requirement secretly"
    ],
    "answer": 0,
    "explanation": "The mismatch identifies a possible fault.",
    "skills": [
      "testing",
      "debugging"
    ]
  },
  {
    "id": "SP-17-01",
    "unitId": "sdd-errors-17",
    "prompt": "What error does Print(\"Hello\") cause?",
    "options": [
      "SyntaxError",
      "NameError",
      "IndexError"
    ],
    "answer": 1,
    "explanation": "Python cannot find a name called Print.",
    "skills": [
      "name-error",
      "case-sensitivity"
    ]
  },
  {
    "id": "SP-17-02",
    "unitId": "sdd-errors-17",
    "prompt": "A missing colon causes which type?",
    "options": [
      "Syntax error",
      "Logic error",
      "No error"
    ],
    "answer": 0,
    "explanation": "Python cannot parse the construct.",
    "skills": [
      "syntax-error",
      "errors"
    ]
  },
  {
    "id": "SP-17-03",
    "unitId": "sdd-errors-17",
    "prompt": "Wrong multiplication replaced by addition is usually...",
    "options": [
      "Logic error",
      "Syntax error",
      "NameError"
    ],
    "answer": 0,
    "explanation": "The program runs but calculates incorrectly.",
    "skills": [
      "logic-error",
      "errors"
    ]
  },
  {
    "id": "SP-17-04",
    "unitId": "sdd-errors-17",
    "prompt": "Array index outside the valid range causes...",
    "options": [
      "Execution error",
      "Readability improvement",
      "Normal test"
    ],
    "answer": 0,
    "explanation": "IndexError occurs during execution.",
    "skills": [
      "execution-error",
      "index-error"
    ]
  },
  {
    "id": "SP-17-05",
    "unitId": "sdd-errors-17",
    "prompt": "Where else should you inspect when a traceback points at a correct-looking line?",
    "options": [
      "The line above for an unclosed bracket or quote",
      "Only the footer",
      "The first variable only"
    ],
    "answer": 0,
    "explanation": "Earlier incomplete syntax can affect the next line.",
    "skills": [
      "traceback",
      "debugging"
    ]
  },
  {
    "id": "SP-17-06",
    "unitId": "sdd-errors-17",
    "prompt": "What does IndentationError mean?",
    "options": [
      "The block is not indented as required",
      "A value is too large",
      "A function is random"
    ],
    "answer": 0,
    "explanation": "Python uses indentation to define blocks.",
    "skills": [
      "indentation-error",
      "debugging"
    ]
  },
  {
    "id": "SP-18-01",
    "unitId": "sdd-evaluation-18",
    "prompt": "Which heading asks whether all functional requirements are met?",
    "options": [
      "Fitness for purpose",
      "Readability",
      "Robustness"
    ],
    "answer": 0,
    "explanation": "Fitness for purpose is judged against requirements.",
    "skills": [
      "fitness-for-purpose",
      "evaluation"
    ]
  },
  {
    "id": "SP-18-02",
    "unitId": "sdd-evaluation-18",
    "prompt": "Which heading is improved by input validation?",
    "options": [
      "Robustness",
      "Readability",
      "Testing type"
    ],
    "answer": 0,
    "explanation": "Validation prevents user mistakes.",
    "skills": [
      "robustness",
      "evaluation"
    ]
  },
  {
    "id": "SP-18-03",
    "unitId": "sdd-evaluation-18",
    "prompt": "Which phrase is a key readability point?",
    "options": [
      "Meaningful variable names",
      "Random values",
      "Exceptional loops"
    ],
    "answer": 0,
    "explanation": "Meaningful names make stored values clear.",
    "skills": [
      "readability",
      "meaningful-identifiers"
    ]
  },
  {
    "id": "SP-18-04",
    "unitId": "sdd-evaluation-18",
    "prompt": "Why can an array improve efficiency?",
    "options": [
      "It stores related values together and supports loop processing",
      "It removes all memory use",
      "It validates every value automatically"
    ],
    "answer": 0,
    "explanation": "It reduces repeated variables/code.",
    "skills": [
      "efficiency",
      "arrays"
    ]
  },
  {
    "id": "SP-18-05",
    "unitId": "sdd-evaluation-18",
    "prompt": "Which answer is strongest?",
    "options": [
      "Use better names",
      "Use meaningful variable names such as totalScore so the stored value is clear",
      "Readable"
    ],
    "answer": 1,
    "explanation": "It uses terminology, evidence and explanation.",
    "skills": [
      "evaluation",
      "exam-technique",
      "question-specific-examples"
    ]
  },
  {
    "id": "SP-18-06",
    "unitId": "sdd-evaluation-18",
    "prompt": "A touchscreen has tiny typing boxes for five fixed choices. Best improvement?",
    "options": [
      "Large selectable buttons",
      "More typing",
      "Remove labels"
    ],
    "answer": 0,
    "explanation": "Buttons reduce errors and are easier to tap.",
    "skills": [
      "user-interface",
      "fit-for-purpose"
    ]
  },
  {
    "id": "SP-19-01",
    "unitId": "sdd-capstone-19",
    "prompt": "Why does the signal program store readings in an array?",
    "options": [
      "They are needed again for final output",
      "Only one reading exists",
      "The array performs validation"
    ],
    "answer": 0,
    "explanation": "All values are reused later.",
    "skills": [
      "capstone",
      "arrays"
    ]
  },
  {
    "id": "SP-19-02",
    "unitId": "sdd-capstone-19",
    "prompt": "Which letter is added for a reading of exactly 30?",
    "options": [
      "S",
      "P",
      "M"
    ],
    "answer": 2,
    "explanation": "P is only for below 30; 30 reaches else.",
    "skills": [
      "capstone",
      "selection"
    ]
  },
  {
    "id": "SP-19-03",
    "unitId": "sdd-capstone-19",
    "prompt": "Which letter is added for 81?",
    "options": [
      "S",
      "P",
      "M"
    ],
    "answer": 0,
    "explanation": "Over 80 gives S.",
    "skills": [
      "capstone",
      "selection"
    ]
  },
  {
    "id": "SP-19-04",
    "unitId": "sdd-capstone-19",
    "prompt": "Which operations happen before a reading is appended?",
    "options": [
      "Input validation and rounding",
      "Final traversal only",
      "Maintenance"
    ],
    "answer": 0,
    "explanation": "Only a valid rounded reading is stored.",
    "skills": [
      "capstone",
      "input-validation",
      "round"
    ]
  },
  {
    "id": "SP-19-05",
    "unitId": "sdd-capstone-19",
    "prompt": "Which standard algorithm is used in the final display loop?",
    "options": [
      "Array traversal",
      "Input validation",
      "Running total"
    ],
    "answer": 0,
    "explanation": "It visits every stored reading.",
    "skills": [
      "capstone",
      "array-traversal"
    ]
  },
  {
    "id": "SP-19-06",
    "unitId": "sdd-capstone-19",
    "prompt": "What makes the capstone program robust?",
    "options": [
      "It rejects readings outside 0–100",
      "It uses a title comment only",
      "It prints five lines"
    ],
    "answer": 0,
    "explanation": "Validation stops unacceptable input.",
    "skills": [
      "capstone",
      "robustness",
      "input-validation"
    ]
  }
];

const SKILL_LABELS = {
  "print": "Print and output",
  "strings": "Strings",
  "syntax": "Python syntax",
  "comments": "Comments",
  "sequence": "Sequence",
  "predict-output": "Predicting output",
  "meaningful-identifiers": "Meaningful variable names",
  "readability": "Readability",
  "indentation": "Indentation",
  "errors": "Reading errors",
  "debugging": "Debugging",
  "pseudocode": "Pseudocode",
  "flowcharts": "Flowcharts",
  "structure-diagrams": "Structure diagrams",
  "symbols": "Design symbols",
  "modules": "Program modules",
  "decomposition": "Decomposition",
  "trace-design": "Tracing a design",
  "comparison": "Comparing representations",
  "syntax-error": "SyntaxError",
  "translation": "Translation",
  "name-error": "NameError",
  "case-sensitivity": "Case sensitivity",
  "question-specific-examples": "Using question details",
  "exam-technique": "Exam technique",
  "variables": "Variables",
  "assignment": "Assignment",
  "data-types": "Data types",
  "integer": "Integer",
  "string": "String",
  "real": "Real numbers",
  "boolean": "Boolean",
  "trace-code": "Tracing code",
  "addition": "Addition",
  "input": "Input",
  "type-conversion": "Type conversion",
  "value-error": "ValueError",
  "ipo": "Input, process and output",
  "design": "Software design",
  "analysis": "Analysis",
  "process": "Processes",
  "average": "Average",
  "user-interface": "User interface",
  "prompts": "Input prompts",
  "output": "Output",
  "operators": "Operators",
  "multiplication": "Multiplication",
  "exponentiation": "Exponentiation",
  "order-of-operations": "Order of operations",
  "arithmetic": "Arithmetic",
  "brackets": "Brackets",
  "rounding": "Rounding",
  "functions": "Built-in functions",
  "calculation": "Calculations",
  "explanation": "Explaining code",
  "selection": "Selection",
  "if": "If statements",
  "elif": "Elif branches",
  "else": "Else branches",
  "comparison-operators": "Comparison operators",
  "conditions": "Conditions",
  "logical-operators": "Logical operators",
  "and": "AND operator",
  "or": "OR operator",
  "not": "NOT operator",
  "predefined-functions": "Predefined functions",
  "len": "Length function",
  "round": "Round function",
  "random": "Random function",
  "indexing": "Array indexing",
  "fixed-loops": "Fixed loops",
  "for-loop": "For loops",
  "range": "Range",
  "iteration": "Iteration",
  "running-total": "Running total",
  "standard-algorithms": "Standard algorithms",
  "nested-selection": "Nested selection",
  "conditional-loops": "Conditional loops",
  "while-loop": "While loops",
  "control-variable": "Control variables",
  "infinite-loop": "Infinite loops",
  "input-validation": "Input validation",
  "data-structures": "Data structures",
  "initialisation": "Array initialisation",
  "append": "Appending values",
  "arrays": "Arrays",
  "index-error": "IndexError",
  "array-traversal": "Array traversal",
  "development-process": "Development process",
  "implementation": "Implementation",
  "documentation": "Documentation",
  "evaluation": "Evaluation",
  "maintenance": "Maintenance",
  "iterative": "Iterative development",
  "functional-requirements": "Functional requirements",
  "refinement": "Algorithm refinement",
  "fit-for-purpose": "Fitness for purpose",
  "accessibility": "Accessibility",
  "testing": "Testing",
  "normal-data": "Normal test data",
  "extreme-data": "Extreme test data",
  "exceptional-data": "Exceptional test data",
  "test-table": "Test tables",
  "expected-results": "Expected results",
  "test-data": "Test data",
  "boundaries": "Boundary values",
  "actual-results": "Actual results",
  "errors": "Error types",
  "execution-error": "Execution errors",
  "logic-error": "Logic errors",
  "traceback": "Tracebacks",
  "indentation-error": "IndentationError",
  "robustness": "Robustness",
  "efficiency": "Efficiency",
  "capstone": "Integrated programming"
};


const DEBUG_ERROR_LABELS = {
  syntax: "Syntax error",
  execution: "Execution error",
  logic: "Logic error"
};

function debugErrorLabel(value) {
  return DEBUG_ERROR_LABELS[value] || value || "Unknown error";
}

function debugIdleDetail(challenge) {
  if (!challenge || !challenge.idleError) return "";
  return ` <span class="muted">IDLE detail: ${escapeHtml(challenge.idleError)}</span>`;
}

const DEBUG_CHALLENGES = [
  {
    "id": "DBG-B-01",
    "level": "Beginner",
    "title": "Close the quotation marks",
    "errorType": "syntax",
    "prompt": "The greeting should display Hello.",
    "buggyCode": "print(\"Hello)",
    "bugLine": 1,
    "explanationOptions": [
      "The string is missing its closing quotation mark.",
      "Python does not allow the word Hello.",
      "print must start with a capital letter."
    ],
    "explanationAnswer": 0,
    "explanation": "A string must have matching opening and closing quotation marks.",
    "hint": "Look at the quotation marks around Hello.",
    "skills": [
      "syntax-error",
      "strings",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Hello"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "print\\s*\\(\\s*[\"\\']Hello[\"\\']\\s*\\)"
      ]
    },
    "idleError": "SyntaxError"
  },
  {
    "id": "DBG-B-02",
    "level": "Beginner",
    "title": "Do not divide by zero",
    "errorType": "execution",
    "prompt": "Twenty points should be shared equally between two pupils.",
    "buggyCode": "total = 20\npupils = 0\nshare = total / pupils\nprint(share)",
    "bugLine": 3,
    "explanationOptions": [
      "The program attempts to divide by zero while it is running.",
      "The print instruction needs a capital letter.",
      "The variable total must be an array."
    ],
    "explanationAnswer": 0,
    "explanation": "The code follows Python syntax, but it stops during execution because a number cannot be divided by zero. IDLE reports ZeroDivisionError.",
    "hint": "Check the value used after the division symbol.",
    "skills": [
      "execution-error",
      "zero-division",
      "debugging",
      "arithmetic"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "10.0"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "\\btotal\\s*=\\s*20\\b",
        "\\bpupils\\s*=\\s*2\\b",
        "\\bshare\\s*=\\s*total\\s*/\\s*pupils\\b",
        "\\bprint\\s*\\(\\s*share\\s*\\)"
      ]
    },
    "idleError": "ZeroDivisionError"
  },
  {
    "id": "DBG-B-03",
    "level": "Beginner",
    "title": "Add the missing colon",
    "errorType": "syntax",
    "prompt": "Display Pass when score is at least 50.",
    "buggyCode": "score = 55\nif score >= 50\n    print(\"Pass\")",
    "bugLine": 2,
    "explanationOptions": [
      "A colon is required after an if condition.",
      "The comparison must use one equals sign.",
      "The print instruction needs no brackets."
    ],
    "explanationAnswer": 0,
    "explanation": "Selection headers such as if, elif and else end with a colon.",
    "hint": "Check the end of the if line.",
    "skills": [
      "syntax-error",
      "selection",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Pass"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "if\\s+score\\s*>=\\s*50\\s*:"
      ]
    },
    "idleError": "SyntaxError"
  },
  {
    "id": "DBG-B-04",
    "level": "Beginner",
    "title": "Indent the controlled instruction",
    "errorType": "syntax",
    "prompt": "Display Take a coat when the weather is rain.",
    "buggyCode": "weather = \"rain\"\nif weather == \"rain\":\nprint(\"Take a coat\")",
    "bugLine": 3,
    "explanationOptions": [
      "The print line must be indented inside the if statement.",
      "The variable weather must be deleted.",
      "The condition should use one equals sign."
    ],
    "explanationAnswer": 0,
    "explanation": "Python uses indentation to show which instructions are controlled by the if statement.",
    "hint": "The instruction controlled by if should move to the right.",
    "skills": [
      "indentation-error",
      "selection",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Take a coat"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "if\\s+weather\\s*==\\s*[\"\\']rain[\"\\']\\s*:\\s*\\n\\s+print"
      ]
    },
    "idleError": "IndentationError"
  },
  {
    "id": "DBG-B-05",
    "level": "Beginner",
    "title": "Compare rather than assign",
    "errorType": "syntax",
    "prompt": "Display Correct age when age is 15.",
    "buggyCode": "age = 15\nif age = 15:\n    print(\"Correct age\")",
    "bugLine": 2,
    "explanationOptions": [
      "Use == to compare two values.",
      "Use + to compare two values.",
      "Remove the if statement."
    ],
    "explanationAnswer": 0,
    "explanation": "One equals sign assigns a value. Two equals signs compare values in a condition.",
    "hint": "Conditions compare values using two equals signs.",
    "skills": [
      "syntax-error",
      "comparison-operators",
      "selection",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Correct age"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "if\\s+age\\s*==\\s*15\\s*:"
      ]
    },
    "idleError": "SyntaxError"
  },
  {
    "id": "DBG-B-06",
    "level": "Beginner",
    "title": "Close the print instruction",
    "errorType": "syntax",
    "prompt": "Display Hello Ava using the variable.",
    "buggyCode": "name = \"Ava\"\nprint(\"Hello \" + name",
    "bugLine": 2,
    "explanationOptions": [
      "The print call is missing a closing bracket.",
      "The variable name must be a number.",
      "Concatenation requires a comma only."
    ],
    "explanationAnswer": 0,
    "explanation": "Every opening bracket in this print call needs a matching closing bracket.",
    "hint": "Count the opening and closing brackets on line 2.",
    "skills": [
      "syntax-error",
      "brackets",
      "concatenation",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Hello Ava"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "name\\s*=",
        "print\\s*\\([^\\n]+\\)"
      ]
    },
    "idleError": "SyntaxError"
  },
  {
    "id": "DBG-B-07",
    "level": "Beginner",
    "title": "Correct the variable name",
    "errorType": "execution",
    "prompt": "Display the value stored in total.",
    "buggyCode": "total = 12\nprint(totl)",
    "bugLine": 2,
    "explanationOptions": [
      "The variable name is misspelled.",
      "The number 12 is too large.",
      "print cannot display variables."
    ],
    "explanationAnswer": 0,
    "explanation": "Python raises NameError when a name has not been defined. Variable spelling must match exactly.",
    "hint": "Compare the spelling where the variable is created and used.",
    "skills": [
      "execution-error",
      "name-error",
      "variables",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "12"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "total\\s*=\\s*12",
        "print\\s*\\(\\s*total\\s*\\)"
      ],
      "forbiddenPatterns": [
        "\\btotl\\b"
      ]
    },
    "idleError": "NameError"
  },
  {
    "id": "DBG-B-08",
    "level": "Beginner",
    "title": "Convert the keyboard input",
    "errorType": "execution",
    "prompt": "An age of 18 should display Allowed.",
    "buggyCode": "age = input(\"Enter age: \")\nif age >= 16:\n    print(\"Allowed\")",
    "bugLine": 2,
    "explanationOptions": [
      "input() returns text, so the age must be converted to an integer.",
      "The comparison operator must be removed.",
      "The input instruction needs to be inside an array."
    ],
    "explanationAnswer": 0,
    "explanation": "input() returns a string. int() is needed before comparing the value with an integer.",
    "hint": "Look at the data type returned by input().",
    "skills": [
      "execution-error",
      "type-conversion",
      "input",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [
          "18"
        ],
        "expectedOutput": "Enter age: 18\nAllowed"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "age\\s*=\\s*int\\s*\\(\\s*input"
      ]
    },
    "idleError": "TypeError"
  },
  {
    "id": "DBG-I-01",
    "level": "Intermediate",
    "title": "Stay inside the array",
    "errorType": "execution",
    "prompt": "Display each value in the three-item array.",
    "buggyCode": "values = [10, 20, 30]\nfor index in range(4):\n    print(values[index])",
    "bugLine": 2,
    "explanationOptions": [
      "The loop tries to access an index that does not exist.",
      "Arrays begin at index 1.",
      "The values must be converted to strings before print."
    ],
    "explanationAnswer": 0,
    "explanation": "The valid indexes are 0, 1 and 2. The loop should run three times or use len(values).",
    "hint": "Compare the loop range with the number of array items.",
    "skills": [
      "execution-error",
      "index-error",
      "arrays",
      "array-traversal",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "10\n20\n30"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "for\\s+index\\s+in\\s+range\\s*\\((3|len\\s*\\(\\s*values\\s*\\))\\)"
      ]
    },
    "idleError": "IndexError"
  },
  {
    "id": "DBG-I-02",
    "level": "Intermediate",
    "title": "Keep the running total",
    "errorType": "logic",
    "prompt": "The program should display the total 20.",
    "buggyCode": "numbers = [4, 6, 10]\nfor index in range(len(numbers)):\n    total = 0\n    total = total + numbers[index]\nprint(total)",
    "bugLine": 3,
    "explanationOptions": [
      "total is reset to 0 during every loop.",
      "The array contains too many values.",
      "A running total must use subtraction."
    ],
    "explanationAnswer": 0,
    "explanation": "A running total is initialised once before the loop and updated inside the loop.",
    "hint": "Find the instruction that wipes out earlier totals.",
    "skills": [
      "logic-error",
      "running-total",
      "array-traversal",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "20"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "total\\s*=\\s*0[\\s\\S]*for\\s+index",
        "total\\s*=\\s*total\\s*\\+\\s*numbers\\s*\\[\\s*index\\s*\\]"
      ]
    },
    "idleError": "No exception — incorrect result"
  },
  {
    "id": "DBG-I-03",
    "level": "Intermediate",
    "title": "Include the boundary value",
    "errorType": "logic",
    "prompt": "A mark of exactly 50 should display Pass.",
    "buggyCode": "mark = 50\nif mark > 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")",
    "bugLine": 2,
    "explanationOptions": [
      "The condition excludes the boundary value 50.",
      "The else statement always runs first.",
      "The variable mark should be text."
    ],
    "explanationAnswer": 0,
    "explanation": "At least 50 includes 50, so the condition needs >= rather than >.",
    "hint": "What does at least 50 mean?",
    "skills": [
      "logic-error",
      "boundaries",
      "comparison-operators",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Pass"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "mark\\s*>=\\s*50"
      ]
    },
    "idleError": "No exception — incorrect result"
  },
  {
    "id": "DBG-I-04",
    "level": "Intermediate",
    "title": "Repair the validation condition",
    "errorType": "logic",
    "prompt": "An invalid age of 150 should be rejected, then 30 accepted.",
    "buggyCode": "age = 150\nwhile age < 0 and age > 120:\n    print(\"Invalid\")\n    age = int(input(\"Enter age: \"))\nprint(\"Accepted\")",
    "bugLine": 2,
    "explanationOptions": [
      "An age cannot be below 0 and above 120 at the same time; use OR.",
      "The loop should be a fixed loop.",
      "The input should not be converted."
    ],
    "explanationAnswer": 0,
    "explanation": "Invalid means below the minimum OR above the maximum.",
    "hint": "Can one number satisfy both invalid conditions at once?",
    "skills": [
      "logic-error",
      "input-validation",
      "or",
      "conditional-loops",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [
          "30"
        ],
        "expectedOutput": "Invalid\nEnter age: 30\nAccepted"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "while\\s+age\\s*<\\s*0\\s+or\\s+age\\s*>\\s*120"
      ]
    },
    "idleError": "No exception — validation fails"
  },
  {
    "id": "DBG-I-05",
    "level": "Intermediate",
    "title": "Display the calculated result",
    "errorType": "logic",
    "prompt": "The program should display 16.",
    "buggyCode": "first = 7\nsecond = 9\ntotal = first + second\nprint(first)",
    "bugLine": 4,
    "explanationOptions": [
      "The program displays the wrong variable.",
      "The addition should use multiplication.",
      "The variable total should be removed."
    ],
    "explanationAnswer": 0,
    "explanation": "The calculation is correct, but the output instruction displays first instead of total.",
    "hint": "Which variable contains the final answer?",
    "skills": [
      "logic-error",
      "variables",
      "output",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "16"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "print\\s*\\(\\s*total\\s*\\)"
      ]
    },
    "idleError": "No exception — wrong value displayed"
  },
  {
    "id": "DBG-I-06",
    "level": "Intermediate",
    "title": "Create the value before using it",
    "errorType": "execution",
    "prompt": "The program should display 10.0.",
    "buggyCode": "print(average)\ntotal = 30\naverage = total / 3",
    "bugLine": 1,
    "explanationOptions": [
      "average is used before it has been assigned a value.",
      "Division is not allowed in Python.",
      "The program needs a fixed loop."
    ],
    "explanationAnswer": 0,
    "explanation": "Instructions run from top to bottom. average must be calculated before it is displayed.",
    "hint": "Trace the code in order from the first line.",
    "skills": [
      "execution-error",
      "name-error",
      "sequence",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "10.0"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "average\\s*=\\s*total\\s*/\\s*3[\\s\\S]*print\\s*\\(\\s*average\\s*\\)"
      ]
    },
    "idleError": "NameError"
  },
  {
    "id": "DBG-I-07",
    "level": "Intermediate",
    "title": "Fix the loop endpoint",
    "errorType": "logic",
    "prompt": "Display the numbers 1 to 5 inclusive.",
    "buggyCode": "for number in range(1, 5):\n    print(number)",
    "bugLine": 1,
    "explanationOptions": [
      "The stop value in range() is not included.",
      "range() always begins at 0.",
      "The print instruction needs str()."
    ],
    "explanationAnswer": 0,
    "explanation": "range(1, 5) stops before 5. Use a stop value of 6 to include 5.",
    "hint": "Remember that the second range value is excluded.",
    "skills": [
      "logic-error",
      "range",
      "fixed-loops",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "1\n2\n3\n4\n5"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "range\\s*\\(\\s*1\\s*,\\s*6\\s*\\)"
      ]
    },
    "idleError": "No exception — loop boundary error"
  },
  {
    "id": "DBG-I-08",
    "level": "Intermediate",
    "title": "Update the control variable",
    "errorType": "logic",
    "prompt": "Display 0, 1 and 2, then stop.",
    "buggyCode": "count = 0\nwhile count < 3:\n    print(count)",
    "bugLine": 3,
    "explanationOptions": [
      "count never changes, so the condition never becomes false.",
      "The loop should use else.",
      "The number 3 must be printed first."
    ],
    "explanationAnswer": 0,
    "explanation": "A conditional loop needs an update that eventually makes its condition false.",
    "hint": "What instruction will move count towards 3?",
    "skills": [
      "logic-error",
      "conditional-loops",
      "control-variable",
      "infinite-loop",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "0\n1\n2"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "while\\s+count\\s*<\\s*3",
        "count\\s*=\\s*count\\s*\\+\\s*1|count\\s*\\+=\\s*1"
      ]
    },
    "idleError": "No exception — infinite loop"
  },
  {
    "id": "DBG-A-01",
    "level": "Advanced",
    "title": "Order the selection correctly",
    "errorType": "logic",
    "prompt": "A mark of 85 should display A.",
    "buggyCode": "mark = 85\nif mark >= 50:\n    print(\"C\")\nelif mark >= 70:\n    print(\"B\")\nelif mark >= 80:\n    print(\"A\")\nelse:\n    print(\"Fail\")",
    "bugLine": 2,
    "explanationOptions": [
      "The broadest condition is checked first and catches 85 too early.",
      "elif statements run before if statements.",
      "The variable must be converted to a real number."
    ],
    "explanationAnswer": 0,
    "explanation": "An if/elif chain stops at the first true condition. Highest thresholds should be checked first.",
    "hint": "Which true condition does Python reach first?",
    "skills": [
      "logic-error",
      "selection",
      "boundaries",
      "efficiency",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "A"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "if\\s+mark\\s*>=\\s*80[\\s\\S]*elif\\s+mark\\s*>=\\s*70[\\s\\S]*elif\\s+mark\\s*>=\\s*50"
      ]
    },
    "idleError": "No exception — conditions in the wrong order"
  },
  {
    "id": "DBG-A-02",
    "level": "Advanced",
    "title": "Match the array size to the loop",
    "errorType": "execution",
    "prompt": "Store and display the five values 0 to 4.",
    "buggyCode": "readings = [0] * 3\nfor index in range(5):\n    readings[index] = index\nprint(readings)",
    "bugLine": 3,
    "explanationOptions": [
      "The loop needs five available array positions.",
      "The first array index is 1.",
      "Arrays cannot store integers."
    ],
    "explanationAnswer": 0,
    "explanation": "The storage must be large enough for every index used, or values can be appended to an empty array.",
    "hint": "Compare the number of loop repetitions with the array size.",
    "skills": [
      "execution-error",
      "index-error",
      "arrays",
      "initialisation",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "[0, 1, 2, 3, 4]"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "readings\\s*=\\s*\\[0\\]\\s*\\*\\s*5|readings\\s*=\\s*\\[\\][\\s\\S]*append"
      ]
    },
    "idleError": "IndexError"
  },
  {
    "id": "DBG-A-03",
    "level": "Advanced",
    "title": "Stop when either valid option is entered",
    "errorType": "logic",
    "prompt": "Reject x, then accept option a.",
    "buggyCode": "choice = \"x\"\nwhile choice != \"a\" or choice != \"b\":\n    print(\"Invalid\")\n    choice = input(\"Choose a or b: \")\nprint(\"Accepted\")",
    "bugLine": 2,
    "explanationOptions": [
      "The value is always not equal to at least one option; use AND.",
      "The loop should use a fixed range.",
      "NOT cannot be used with strings."
    ],
    "explanationAnswer": 0,
    "explanation": "The input is invalid only when it is not a AND not b.",
    "hint": "Try the condition with choice equal to a.",
    "skills": [
      "logic-error",
      "input-validation",
      "and",
      "conditional-loops",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [
          "a"
        ],
        "expectedOutput": "Invalid\nChoose a or b: a\nAccepted"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "while\\s+choice\\s*!=\\s*[\"\\']a[\"\\']\\s+and\\s+choice\\s*!=\\s*[\"\\']b[\"\\']"
      ]
    },
    "idleError": "No exception — condition is always true"
  },
  {
    "id": "DBG-A-04",
    "level": "Advanced",
    "title": "Use the changing array index",
    "errorType": "logic",
    "prompt": "The total of the array should be 30.",
    "buggyCode": "numbers = [5, 10, 15]\ntotal = 0\nfor index in range(len(numbers)):\n    total = total + numbers[0]\nprint(total)",
    "bugLine": 4,
    "explanationOptions": [
      "The loop repeatedly adds only the first value.",
      "The total must start at 1.",
      "len() returns the final index."
    ],
    "explanationAnswer": 0,
    "explanation": "Traversal should use numbers[index] so a different element is processed on each loop.",
    "hint": "Which part of the array access should change each loop?",
    "skills": [
      "logic-error",
      "array-traversal",
      "running-total",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "30"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "numbers\\s*\\[\\s*index\\s*\\]"
      ],
      "forbiddenPatterns": [
        "numbers\\s*\\[\\s*0\\s*\\]"
      ]
    },
    "idleError": "No exception — wrong array position used"
  },
  {
    "id": "DBG-A-05",
    "level": "Advanced",
    "title": "Repair the combined condition",
    "errorType": "logic",
    "prompt": "A 17-year-old with a ticket should be allowed to enter.",
    "buggyCode": "age = 17\nhasTicket = True\nif age < 16:\n    if hasTicket == True:\n        print(\"Enter\")\n    else:\n        print(\"No ticket\")\nelse:\n    print(\"Too old\")",
    "bugLine": 3,
    "explanationOptions": [
      "The age boundary is too low for the stated rule.",
      "Boolean values must be strings.",
      "Nested selection can never be used."
    ],
    "explanationAnswer": 0,
    "explanation": "The condition should include all permitted ages. A valid repair can use age < 18 or age <= 17.",
    "hint": "Translate under 18 into a comparison.",
    "skills": [
      "logic-error",
      "nested-selection",
      "boundaries",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "Enter"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "age\\s*<\\s*18|age\\s*<=\\s*17"
      ]
    },
    "idleError": "No exception — incorrect combined condition"
  },
  {
    "id": "DBG-A-06",
    "level": "Advanced",
    "title": "Protect the signal boundaries",
    "errorType": "logic",
    "prompt": "The readings should create the signal pattern MMSP.",
    "buggyCode": "readings = [80, 30, 81, 29]\nsignal = \"\"\nfor reading in readings:\n    if reading >= 80:\n        signal = signal + \"S\"\n    elif reading <= 30:\n        signal = signal + \"P\"\n    else:\n        signal = signal + \"M\"\nprint(signal)",
    "bugLine": 4,
    "explanationOptions": [
      "The boundaries 80 and 30 belong in the middle category.",
      "The array must be sorted first.",
      "The signal should start with a space."
    ],
    "explanationAnswer": 0,
    "explanation": "The stated rules are above 80 and below 30. Exactly 80 or 30 should reach else.",
    "hint": "Pay attention to the words above and below.",
    "skills": [
      "logic-error",
      "selection",
      "boundaries",
      "capstone",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "MMSP"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "reading\\s*>\\s*80",
        "reading\\s*<\\s*30"
      ],
      "forbiddenPatterns": [
        "reading\\s*>=\\s*80",
        "reading\\s*<=\\s*30"
      ]
    },
    "idleError": "No exception — incorrect boundary handling"
  },
  {
    "id": "DBG-A-07",
    "level": "Advanced",
    "title": "Traverse every stored value",
    "errorType": "logic",
    "prompt": "The array total should be 10.",
    "buggyCode": "values = [1, 2, 3, 4]\ntotal = 0\nfor index in range(1, len(values)):\n    total = total + values[index]\nprint(total)",
    "bugLine": 3,
    "explanationOptions": [
      "Starting at index 1 skips the first element.",
      "The array contains an invalid value.",
      "A total should use multiplication."
    ],
    "explanationAnswer": 0,
    "explanation": "Array traversal normally begins at index 0.",
    "hint": "Which array position is never visited?",
    "skills": [
      "logic-error",
      "array-traversal",
      "range",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [],
        "expectedOutput": "10"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "range\\s*\\(\\s*len\\s*\\(\\s*values\\s*\\)\\s*\\)|range\\s*\\(\\s*0\\s*,\\s*len\\s*\\(\\s*values\\s*\\)\\s*\\)"
      ]
    },
    "idleError": "No exception — first item skipped"
  },
  {
    "id": "DBG-A-08",
    "level": "Advanced",
    "title": "Validate before storing",
    "errorType": "logic",
    "prompt": "Reject 120, then store and display the valid reading 75.",
    "buggyCode": "readings = []\nreading = 120\nwhile reading >= 0 and reading <= 100:\n    print(\"Invalid\")\n    reading = int(input(\"Enter reading: \"))\nreadings.append(reading)\nprint(readings[0])",
    "bugLine": 3,
    "explanationOptions": [
      "The loop repeats for valid values instead of invalid values.",
      "append() can only store strings.",
      "The array must contain five values."
    ],
    "explanationAnswer": 0,
    "explanation": "Validation loops while the value is outside the permitted range.",
    "hint": "Write the condition for less than 0 OR greater than 100.",
    "skills": [
      "logic-error",
      "input-validation",
      "arrays",
      "or",
      "debugging"
    ],
    "tests": [
      {
        "inputs": [
          "75"
        ],
        "expectedOutput": "Invalid\nEnter reading: 75\n75"
      }
    ],
    "requirements": {
      "requiredPatterns": [
        "while\\s+reading\\s*<\\s*0\\s+or\\s+reading\\s*>\\s*100",
        "readings\\.append\\s*\\(\\s*reading\\s*\\)"
      ]
    },
    "idleError": "No exception — invalid values are accepted"
  }
];
const LOGIC_EXPRESSIONS = {
  "Beginner": [
    "A AND B",
    "A OR B"
  ],
  "Intermediate": [
    "A AND (B OR C)",
    "(A AND B) OR C",
    "(A OR B) AND C",
    "A OR (B AND C)"
  ],
  "Advanced": [
    "NOT A AND B",
    "A OR (B AND NOT C)",
    "NOT (A OR B)",
    "(A AND B) OR (C AND NOT D)"
  ]
};
const LOGIC_BUILD_QUESTIONS = [
  {
    "id": "BLD-B-01",
    "level": "Beginner",
    "prompt": "A pupil may enter only if they have a ticket AND they are under 16. Which condition matches?",
    "options": [
      "hasTicket == True and age < 16",
      "hasTicket == True or age < 16",
      "not hasTicket and age < 16"
    ],
    "answer": 0,
    "explanation": "Both requirements must be true, so AND is required.",
    "skills": [
      "logical-operators",
      "and",
      "conditions"
    ]
  },
  {
    "id": "BLD-B-02",
    "level": "Beginner",
    "prompt": "A warning is shown if the temperature is below 0 OR above 30. Which condition matches?",
    "options": [
      "temperature < 0 or temperature > 30",
      "temperature < 0 and temperature > 30",
      "not temperature > 30"
    ],
    "answer": 0,
    "explanation": "Either extreme should trigger the warning, so OR is required.",
    "skills": [
      "logical-operators",
      "or",
      "conditions"
    ]
  },
  {
    "id": "BLD-I-01",
    "level": "Intermediate",
    "prompt": "A discount applies when the customer is a student and the total is at least £20.",
    "options": [
      "isStudent == True and total >= 20",
      "isStudent == True or total >= 20",
      "not isStudent and total >= 20"
    ],
    "answer": 0,
    "explanation": "The customer must satisfy both conditions.",
    "skills": [
      "logical-operators",
      "and",
      "boundaries"
    ]
  },
  {
    "id": "BLD-I-02",
    "level": "Intermediate",
    "prompt": "Input is invalid when choice is neither yes nor no.",
    "options": [
      "choice != \"yes\" and choice != \"no\"",
      "choice != \"yes\" or choice != \"no\"",
      "choice == \"yes\" and choice == \"no\""
    ],
    "answer": 0,
    "explanation": "For an invalid value, it must be different from both valid options.",
    "skills": [
      "logical-operators",
      "and",
      "input-validation"
    ]
  },
  {
    "id": "BLD-A-01",
    "level": "Advanced",
    "prompt": "Access is allowed when the user is an administrator OR when they are active and have passed security.",
    "options": [
      "isAdmin or (isActive and passedSecurity)",
      "(isAdmin or isActive) and passedSecurity",
      "isAdmin and (isActive or passedSecurity)"
    ],
    "answer": 0,
    "explanation": "The brackets preserve the two separate routes to access.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "conditions"
    ]
  },
  {
    "id": "BLD-A-02",
    "level": "Advanced",
    "prompt": "A value is valid when it is NOT below 0 and NOT above 100.",
    "options": [
      "not (value < 0 or value > 100)",
      "not value < 0 or value > 100",
      "value < 0 and value > 100"
    ],
    "answer": 0,
    "explanation": "NOT reverses the complete outside-range condition.",
    "skills": [
      "logical-operators",
      "not",
      "input-validation"
    ]
  }
];
const LOGIC_FAULTY_QUESTIONS = [
  {
    "id": "FLT-B-01",
    "level": "Beginner",
    "prompt": "This condition is meant to identify a mark outside 0–100:\nif mark < 0 and mark > 100:",
    "options": [
      "if mark < 0 or mark > 100:",
      "if mark < 0 and mark > 100:",
      "if mark == 0 or 100:"
    ],
    "answer": 0,
    "explanation": "One value cannot be below 0 and above 100 at once.",
    "skills": [
      "logical-operators",
      "or",
      "input-validation"
    ]
  },
  {
    "id": "FLT-B-02",
    "level": "Beginner",
    "prompt": "This condition should accept red or blue:\nif colour == \"red\" and colour == \"blue\":",
    "options": [
      "if colour == \"red\" or colour == \"blue\":",
      "if colour != \"red\" and colour != \"blue\":",
      "if colour == \"red\" and colour != \"blue\":"
    ],
    "answer": 0,
    "explanation": "Either accepted colour is enough.",
    "skills": [
      "logical-operators",
      "or",
      "conditions"
    ]
  },
  {
    "id": "FLT-I-01",
    "level": "Intermediate",
    "prompt": "This validation loop never stops for a or b:\nwhile choice != \"a\" or choice != \"b\":",
    "options": [
      "while choice != \"a\" and choice != \"b\":",
      "while choice == \"a\" and choice == \"b\":",
      "while not choice:"
    ],
    "answer": 0,
    "explanation": "Invalid means different from a and different from b.",
    "skills": [
      "logical-operators",
      "and",
      "input-validation"
    ]
  },
  {
    "id": "FLT-I-02",
    "level": "Intermediate",
    "prompt": "The program should accept values from 1 to 10 inclusive:\nif value > 1 and value < 10:",
    "options": [
      "if value >= 1 and value <= 10:",
      "if value >= 1 or value <= 10:",
      "if value > 1 or value < 10:"
    ],
    "answer": 0,
    "explanation": "Inclusive boundaries use >= and <= with AND.",
    "skills": [
      "logical-operators",
      "and",
      "boundaries"
    ]
  },
  {
    "id": "FLT-A-01",
    "level": "Advanced",
    "prompt": "The intended rule is: admin, OR active user with permission. Which repair preserves that meaning?",
    "options": [
      "if isAdmin or (isActive and hasPermission):",
      "if (isAdmin or isActive) and hasPermission:",
      "if isAdmin and isActive or hasPermission:"
    ],
    "answer": 0,
    "explanation": "Brackets keep the active-and-permission route together.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "conditions"
    ]
  },
  {
    "id": "FLT-A-02",
    "level": "Advanced",
    "prompt": "The code should repeat while the password is wrong and attempts remain:\nwhile password != correct or attempts < 3:",
    "options": [
      "while password != correct and attempts < 3:",
      "while password == correct and attempts < 3:",
      "while not attempts < 3:"
    ],
    "answer": 0,
    "explanation": "Both facts must remain true for another attempt.",
    "skills": [
      "logical-operators",
      "and",
      "conditional-loops"
    ]
  }
];
const LOGIC_TRACE_QUESTIONS = [
  {
    "id": "TRC-B-01",
    "level": "Beginner",
    "expression": "A AND B",
    "env": {
      "A": true,
      "B": false
    },
    "focus": "What is the final result?",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "AND needs both values to be True.",
    "skills": [
      "logical-operators",
      "and"
    ]
  },
  {
    "id": "TRC-B-02",
    "level": "Beginner",
    "expression": "A OR B",
    "env": {
      "A": false,
      "B": true
    },
    "focus": "What is the final result?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "OR is True when at least one value is True.",
    "skills": [
      "logical-operators",
      "or"
    ]
  },
  {
    "id": "TRC-I-01",
    "level": "Intermediate",
    "expression": "A AND (B OR C)",
    "env": {
      "A": true,
      "B": false,
      "C": true
    },
    "focus": "Evaluate the brackets first. What is B OR C?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "False OR True is True. The full expression is then True AND True.",
    "skills": [
      "logical-operators",
      "and",
      "or"
    ]
  },
  {
    "id": "TRC-I-02",
    "level": "Intermediate",
    "expression": "NOT A OR B",
    "env": {
      "A": true,
      "B": false
    },
    "focus": "What is NOT A?",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "NOT reverses True to False. The full result is False OR False.",
    "skills": [
      "logical-operators",
      "not",
      "or"
    ]
  },
  {
    "id": "TRC-A-01",
    "level": "Advanced",
    "expression": "A OR (B AND NOT C)",
    "env": {
      "A": false,
      "B": true,
      "C": false
    },
    "focus": "After evaluating NOT C, what is B AND NOT C?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "NOT False is True, so True AND True is True.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ]
  },
  {
    "id": "TRC-A-02",
    "level": "Advanced",
    "expression": "NOT (A OR B) AND C",
    "env": {
      "A": false,
      "B": false,
      "C": true
    },
    "focus": "What is NOT (A OR B)?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "A OR B is False, and NOT False is True.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ]
  }
];

LOGIC_BUILD_QUESTIONS.push(...[
  {
    "id": "BLD-B-03",
    "level": "Beginner",
    "prompt": "A player wins if score is at least 10 AND lives are greater than 0.",
    "options": [
      "score >= 10 and lives > 0",
      "score >= 10 or lives > 0",
      "not score >= 10 and lives > 0"
    ],
    "answer": 0,
    "explanation": "Both conditions are required for a win.",
    "skills": [
      "logical-operators",
      "and",
      "boundaries"
    ]
  },
  {
    "id": "BLD-B-04",
    "level": "Beginner",
    "prompt": "A message appears when the day is Saturday OR Sunday.",
    "options": [
      "day == \"Saturday\" or day == \"Sunday\"",
      "day == \"Saturday\" and day == \"Sunday\"",
      "day != \"Saturday\" and day != \"Sunday\""
    ],
    "answer": 0,
    "explanation": "Either weekend day should make the condition True.",
    "skills": [
      "logical-operators",
      "or",
      "conditions"
    ]
  },
  {
    "id": "BLD-B-05",
    "level": "Beginner",
    "prompt": "A pupil may borrow a laptop if permission is True AND a laptop is available.",
    "options": [
      "permission == True and available == True",
      "permission == True or available == True",
      "not permission and available"
    ],
    "answer": 0,
    "explanation": "Permission and availability are both essential.",
    "skills": [
      "logical-operators",
      "and",
      "conditions"
    ]
  },
  {
    "id": "BLD-B-06",
    "level": "Beginner",
    "prompt": "A value is exceptional if it is less than 1 OR greater than 10.",
    "options": [
      "value < 1 or value > 10",
      "value < 1 and value > 10",
      "value >= 1 and value <= 10"
    ],
    "answer": 0,
    "explanation": "Either outside boundary makes the value exceptional.",
    "skills": [
      "logical-operators",
      "or",
      "test-data",
      "boundaries"
    ]
  },
  {
    "id": "BLD-I-03",
    "level": "Intermediate",
    "prompt": "A user can continue when the password is correct and attempts are no more than 3.",
    "options": [
      "password == correct and attempts <= 3",
      "password == correct or attempts <= 3",
      "password != correct and attempts <= 3"
    ],
    "answer": 0,
    "explanation": "Both the correct password and attempt limit are required.",
    "skills": [
      "logical-operators",
      "and",
      "conditional-loops"
    ]
  },
  {
    "id": "BLD-I-04",
    "level": "Intermediate",
    "prompt": "A booking is rejected when guests are below 1 or above 8.",
    "options": [
      "guests < 1 or guests > 8",
      "guests < 1 and guests > 8",
      "guests >= 1 or guests <= 8"
    ],
    "answer": 0,
    "explanation": "Either invalid boundary should reject the booking.",
    "skills": [
      "logical-operators",
      "or",
      "input-validation"
    ]
  },
  {
    "id": "BLD-I-05",
    "level": "Intermediate",
    "prompt": "A student passes when mark is at least 50 and attendance is at least 80.",
    "options": [
      "mark >= 50 and attendance >= 80",
      "mark >= 50 or attendance >= 80",
      "not mark >= 50 and attendance >= 80"
    ],
    "answer": 0,
    "explanation": "The scenario requires both thresholds.",
    "skills": [
      "logical-operators",
      "and",
      "boundaries"
    ]
  },
  {
    "id": "BLD-I-06",
    "level": "Intermediate",
    "prompt": "The loop should repeat while the answer is not yes and not no.",
    "options": [
      "answer != \"yes\" and answer != \"no\"",
      "answer != \"yes\" or answer != \"no\"",
      "answer == \"yes\" and answer == \"no\""
    ],
    "answer": 0,
    "explanation": "An invalid response differs from both allowed values.",
    "skills": [
      "logical-operators",
      "and",
      "input-validation"
    ]
  },
  {
    "id": "BLD-A-03",
    "level": "Advanced",
    "prompt": "A user gets access if they are staff and either have a keycard or are accompanied.",
    "options": [
      "isStaff and (hasKeycard or accompanied)",
      "(isStaff and hasKeycard) or accompanied",
      "isStaff or hasKeycard and accompanied"
    ],
    "answer": 0,
    "explanation": "Staff status is required for both alternative routes.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "conditions"
    ]
  },
  {
    "id": "BLD-A-04",
    "level": "Advanced",
    "prompt": "A warning is not shown when the value is within 0–100 inclusive.",
    "options": [
      "not (value < 0 or value > 100)",
      "not value < 0 and value > 100",
      "value < 0 or value > 100"
    ],
    "answer": 0,
    "explanation": "NOT reverses the entire outside-range test.",
    "skills": [
      "logical-operators",
      "not",
      "or",
      "input-validation"
    ]
  },
  {
    "id": "BLD-A-05",
    "level": "Advanced",
    "prompt": "A candidate qualifies if they passed the test OR completed both the course and interview.",
    "options": [
      "passedTest or (completedCourse and passedInterview)",
      "(passedTest or completedCourse) and passedInterview",
      "passedTest and completedCourse or passedInterview"
    ],
    "answer": 0,
    "explanation": "There are two routes: the test, or both course and interview.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "conditions"
    ]
  },
  {
    "id": "BLD-A-06",
    "level": "Advanced",
    "prompt": "The record is selected when it is active and not archived.",
    "options": [
      "isActive and not isArchived",
      "isActive or not isArchived",
      "not (isActive and isArchived)"
    ],
    "answer": 0,
    "explanation": "The record must be active while archived is False.",
    "skills": [
      "logical-operators",
      "and",
      "not",
      "conditions"
    ]
  }
]);
LOGIC_FAULTY_QUESTIONS.push(...[
  {
    "id": "FLT-B-03",
    "level": "Beginner",
    "prompt": "The code should allow ages from 12 to 17 inclusive:\nif age > 12 and age < 17:",
    "options": [
      "if age >= 12 and age <= 17:",
      "if age >= 12 or age <= 17:",
      "if age < 12 and age > 17:"
    ],
    "answer": 0,
    "explanation": "Inclusive values require >= and <=.",
    "skills": [
      "logical-operators",
      "and",
      "boundaries"
    ]
  },
  {
    "id": "FLT-B-04",
    "level": "Beginner",
    "prompt": "The message should show for rain or snow:\nif weather == \"rain\" and weather == \"snow\":",
    "options": [
      "if weather == \"rain\" or weather == \"snow\":",
      "if weather != \"rain\" and weather != \"snow\":",
      "if not weather == \"rain\":"
    ],
    "answer": 0,
    "explanation": "One weather value cannot equal rain and snow at once.",
    "skills": [
      "logical-operators",
      "or",
      "conditions"
    ]
  },
  {
    "id": "FLT-B-05",
    "level": "Beginner",
    "prompt": "Both a username and password are required:\nif username != \"\" or password != \"\":",
    "options": [
      "if username != \"\" and password != \"\":",
      "if username == \"\" and password == \"\":",
      "if not username or password:"
    ],
    "answer": 0,
    "explanation": "Both fields must contain values.",
    "skills": [
      "logical-operators",
      "and",
      "conditions"
    ]
  },
  {
    "id": "FLT-B-06",
    "level": "Beginner",
    "prompt": "A number is valid from 1 to 5:\nif number >= 1 or number <= 5:",
    "options": [
      "if number >= 1 and number <= 5:",
      "if number < 1 or number > 5:",
      "if number >= 1 or number <= 5:"
    ],
    "answer": 0,
    "explanation": "A valid range needs both boundaries to be satisfied.",
    "skills": [
      "logical-operators",
      "and",
      "boundaries"
    ]
  },
  {
    "id": "FLT-I-03",
    "level": "Intermediate",
    "prompt": "Repeat until finish or quit is typed:\nwhile command != \"finish\" or command != \"quit\":",
    "options": [
      "while command != \"finish\" and command != \"quit\":",
      "while command == \"finish\" and command == \"quit\":",
      "while not command:"
    ],
    "answer": 0,
    "explanation": "Continue only while the command differs from both stopping words.",
    "skills": [
      "logical-operators",
      "and",
      "conditional-loops"
    ]
  },
  {
    "id": "FLT-I-04",
    "level": "Intermediate",
    "prompt": "A discount requires membership and a spend of £50:\nif member == True or spend >= 50:",
    "options": [
      "if member == True and spend >= 50:",
      "if member == False and spend >= 50:",
      "if not member or spend >= 50:"
    ],
    "answer": 0,
    "explanation": "Both requirements must be met.",
    "skills": [
      "logical-operators",
      "and",
      "conditions"
    ]
  },
  {
    "id": "FLT-I-05",
    "level": "Intermediate",
    "prompt": "The condition should identify values outside 10–20:\nif value < 10 and value > 20:",
    "options": [
      "if value < 10 or value > 20:",
      "if value >= 10 and value <= 20:",
      "if value != 10 or value != 20:"
    ],
    "answer": 0,
    "explanation": "Outside means below the low boundary or above the high boundary.",
    "skills": [
      "logical-operators",
      "or",
      "input-validation"
    ]
  },
  {
    "id": "FLT-I-06",
    "level": "Intermediate",
    "prompt": "Entry needs a ticket and either child or senior status. Which repair is correct?",
    "options": [
      "if hasTicket and (isChild or isSenior):",
      "if (hasTicket and isChild) or isSenior:",
      "if hasTicket or isChild and isSenior:"
    ],
    "answer": 0,
    "explanation": "The ticket requirement applies to both age-status alternatives.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "conditions"
    ]
  },
  {
    "id": "FLT-A-03",
    "level": "Advanced",
    "prompt": "The system should repeat while the input is invalid and attempts remain:\nwhile invalid or attempts < 3:",
    "options": [
      "while invalid and attempts < 3:",
      "while invalid or attempts > 3:",
      "while not invalid and attempts < 3:"
    ],
    "answer": 0,
    "explanation": "Both continued invalidity and remaining attempts are needed.",
    "skills": [
      "logical-operators",
      "and",
      "conditional-loops"
    ]
  },
  {
    "id": "FLT-A-04",
    "level": "Advanced",
    "prompt": "Access is denied only when the user is neither staff nor a guest:\nif not isStaff or not isGuest:",
    "options": [
      "if not (isStaff or isGuest):",
      "if not isStaff and isGuest:",
      "if isStaff or isGuest:"
    ],
    "answer": 0,
    "explanation": "NOT must reverse the complete staff-or-guest condition.",
    "skills": [
      "logical-operators",
      "not",
      "or",
      "conditions"
    ]
  },
  {
    "id": "FLT-A-05",
    "level": "Advanced",
    "prompt": "A result is accepted if it is verified, or if both sources agree. Which grouping is correct?",
    "options": [
      "if verified or (sourceA and sourceB):",
      "if (verified or sourceA) and sourceB:",
      "if verified and sourceA or sourceB:"
    ],
    "answer": 0,
    "explanation": "Agreement of both sources is the second complete route.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "conditions"
    ]
  },
  {
    "id": "FLT-A-06",
    "level": "Advanced",
    "prompt": "A value should be rejected unless it is from 0 to 100. Which invalid condition is clearest?",
    "options": [
      "if value < 0 or value > 100:",
      "if not value >= 0 or value <= 100:",
      "if value < 0 and value > 100:"
    ],
    "answer": 0,
    "explanation": "The two outside regions are joined with OR.",
    "skills": [
      "logical-operators",
      "or",
      "input-validation"
    ]
  }
]);
LOGIC_TRACE_QUESTIONS.push(...[
  {
    "id": "TRC-B-03",
    "level": "Beginner",
    "expression": "A AND B",
    "env": {
      "A": true,
      "B": true
    },
    "focus": "What is the final result?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Both values are True.",
    "skills": [
      "logical-operators",
      "and"
    ]
  },
  {
    "id": "TRC-B-04",
    "level": "Beginner",
    "expression": "A OR B",
    "env": {
      "A": false,
      "B": false
    },
    "focus": "What is the final result?",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "OR is False when both values are False.",
    "skills": [
      "logical-operators",
      "or"
    ]
  },
  {
    "id": "TRC-B-05",
    "level": "Beginner",
    "expression": "A OR B",
    "env": {
      "A": true,
      "B": true
    },
    "focus": "What is the final result?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "At least one True is enough for OR.",
    "skills": [
      "logical-operators",
      "or"
    ]
  },
  {
    "id": "TRC-B-06",
    "level": "Beginner",
    "expression": "A AND B",
    "env": {
      "A": false,
      "B": false
    },
    "focus": "What is the final result?",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "AND is False unless both values are True.",
    "skills": [
      "logical-operators",
      "and"
    ]
  },
  {
    "id": "TRC-I-03",
    "level": "Intermediate",
    "expression": "(A OR B) AND C",
    "env": {
      "A": false,
      "B": true,
      "C": false
    },
    "focus": "What is A OR B?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "False OR True is True; the final AND with False is False.",
    "skills": [
      "logical-operators",
      "and",
      "or"
    ]
  },
  {
    "id": "TRC-I-04",
    "level": "Intermediate",
    "expression": "NOT A AND B",
    "env": {
      "A": false,
      "B": true
    },
    "focus": "What is NOT A?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "NOT reverses False to True.",
    "skills": [
      "logical-operators",
      "not",
      "and"
    ]
  },
  {
    "id": "TRC-I-05",
    "level": "Intermediate",
    "expression": "A OR (B AND C)",
    "env": {
      "A": false,
      "B": true,
      "C": false
    },
    "focus": "What is B AND C?",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "True AND False is False.",
    "skills": [
      "logical-operators",
      "and",
      "or"
    ]
  },
  {
    "id": "TRC-I-06",
    "level": "Intermediate",
    "expression": "NOT (A OR B)",
    "env": {
      "A": false,
      "B": true
    },
    "focus": "What is A OR B before NOT is applied?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "False OR True is True; NOT then reverses it.",
    "skills": [
      "logical-operators",
      "not",
      "or"
    ]
  },
  {
    "id": "TRC-A-03",
    "level": "Advanced",
    "expression": "(A AND B) OR (C AND NOT D)",
    "env": {
      "A": false,
      "B": true,
      "C": true,
      "D": false
    },
    "focus": "What is C AND NOT D?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "NOT False is True, then True AND True is True.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ]
  },
  {
    "id": "TRC-A-04",
    "level": "Advanced",
    "expression": "NOT (A AND B) OR C",
    "env": {
      "A": true,
      "B": true,
      "C": false
    },
    "focus": "What is NOT (A AND B)?",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "A AND B is True, so NOT makes it False.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ]
  },
  {
    "id": "TRC-A-05",
    "level": "Advanced",
    "expression": "A AND NOT (B OR C)",
    "env": {
      "A": true,
      "B": false,
      "C": false
    },
    "focus": "What is NOT (B OR C)?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "B OR C is False; NOT makes it True.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ]
  },
  {
    "id": "TRC-A-06",
    "level": "Advanced",
    "expression": "NOT A OR (B AND C)",
    "env": {
      "A": true,
      "B": true,
      "C": true
    },
    "focus": "What is B AND C?",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Both B and C are True.",
    "skills": [
      "logical-operators",
      "and",
      "or",
      "not"
    ]
  }
]);

const firebaseConfig = {
  apiKey: "AIzaSyCNCOKfjQf6FHQQj3squE6NZtZYdyuwsLw",
  authDomain: "python-practice-5b289.firebaseapp.com",
  projectId: "python-practice-5b289",
  storageBucket: "python-practice-5b289.firebasestorage.app",
  messagingSenderId: "680319448297",
  appId: "1:680319448297:web:619e79bbbea37764832c78"
};

const APP_VERSION = "5.1.2";
console.info(`Python Practice v${APP_VERSION}: ${UNITS.length} SDD units, ${ACTIVITIES.length} pathway activities, ${SPACED_QUESTIONS.length} spaced questions`);

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const elements = Object.fromEntries(
  [...document.querySelectorAll("[id]")].map(element => [element.id, element])
);

let currentProfile = null;
let currentTask = null;
let currentActivity = null;
let currentProgress = new Map();
let customActivities = [];
let allActivities = [...ACTIVITIES];
let selectedAreaId = "sdd";
let editingCustomActivityId = "";
let currentHintIndex = 0;
let pyodide = null;
let pyodidePromise = null;
let accountSetupInProgress = false;
let errorViewMode = "standard";
let traceSteps = [];
let traceIndex = 0;
let tracePlayTimer = null;
let autoSaveTimer = null;
let codeIsDirty = false;
let saveInProgress = false;
let visualiserCompletionSaving = false;
let officialResponseAutoSaveTimer = null;
let officialResponseDirty = false;
let officialResponseSaving = false;
let activeOfficialResponseInput = null;
let activeOfficialSaveStatus = null;
let currentReviewStates = new Map();
let currentReviewAttempts = [];
let currentClassQuestionStats = new Map();
let spacedSession = null;
let spacedQuestionStartedAt = 0;
let spacedCountdownTimer = null;
let currentClassSettings = {};
let activePeerReview = null;
let currentGameAttempts = [];
let debugGameState = null;
let debugTimerId = null;
let logicGameState = null;
let activeTeacherClass = null;
let peerGreenTokens = new Set();
let peerRedTokens = new Set();
const SPACED_INTERVAL_DAYS = [1, 2, 4, 7, 14, 30, 60];

const LEGACY_ACTIVITY_MAP = {
  "variables-01": "SDD-PY-02-05",
  "variables-02": "SDD-PY-02-07",
  "variables-03": "SDD-PY-04-04"
};

function showMessage(text, type = "info") {
  elements.messageBox.textContent = text;
  elements.messageBox.className = `message ${type}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearMessage() {
  elements.messageBox.textContent = "";
  elements.messageBox.className = "message hidden";
}

function showView(viewId) {
  ["authView", "teacherView", "pupilView", "gamesView", "debugGameView", "logicGameView", "spacedView", "peerReviewView", "activityView", "challengeView"].forEach(id => {
    elements[id].classList.toggle("hidden", id !== viewId);
  });
  elements.homeButton.classList.toggle("hidden", viewId === "authView");
}

function normaliseClassCode(value) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normaliseUsername(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function pupilInternalEmail(classCode, username) {
  return `${normaliseClassCode(classCode).toLowerCase()}.${normaliseUsername(username)}@students.pythonpractice.app`;
}

function humanDate(timestamp) {
  if (!timestamp) return "Not yet";
  const date = typeof timestamp.toDate === "function"
    ? timestamp.toDate()
    : (timestamp instanceof Date ? timestamp : new Date(timestamp));
  if (Number.isNaN(date.getTime())) return "Not yet";
  return date.toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });
}

function statCard(value, label) {
  return `<div class="stat-card"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTeacherText(value) {
  const escaped = escapeHtml(value || "");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function unitById(unitId) {
  return UNITS.find(unit => unit.id === unitId) || null;
}

function areaById(areaId) {
  return AREAS.find(area => area.id === areaId) || { id: areaId || "sdd", shortTitle: String(areaId || "SDD").toUpperCase(), title: String(areaId || "SDD").toUpperCase() };
}

function spacedQuestionAreaId(question) {
  return question.areaId || unitById(question.unitId)?.areaId || "sdd";
}

function spacedQuestionModuleLabel(question) {
  const unit = unitById(question.unitId);
  return unit?.title || question.moduleTitle || "Review";
}

const SPACED_REASON_LABELS = {
  current_topic: "Current topic",
  due_review: "Due for review",
  earlier_learning: "Earlier learning",
  interleaved_area: "Interleaved topic",
  needs_practice: "Needs more practice",
  class_misconception: "Common class misconception",
  long_term: "Long-term retention",
  design_representation: "Design representation",
  new_retrieval: "New retrieval question"
};

function latestLearningContext() {
  const rows = [...currentProgress.entries()].map(([activityId, progress]) => {
    const activity = allActivities.find(item => item.id === activityId);
    return {
      activity,
      time: timestampMillis(progress.lastActivityAt || progress.lastSavedAt || progress.completedAt || progress.lastAttemptAt)
    };
  }).filter(row => row.activity).sort((a, b) => b.time - a.time);
  return rows[0]?.activity || allActivities.find(item => item.required) || { areaId: "sdd", unitId: "sdd-python-01" };
}

function currentLearningContext() {
  const latest = latestLearningContext();
  const focusAreaId = currentClassSettings.reviewFocusAreaId && currentClassSettings.reviewFocusAreaId !== "auto"
    ? currentClassSettings.reviewFocusAreaId
    : latest.areaId;
  const focusUnitId = currentClassSettings.reviewFocusUnitId || (latest.areaId === focusAreaId ? latest.unitId : "");
  return { areaId: focusAreaId || "sdd", unitId: focusUnitId || "" };
}

function activityTypeLabel(activity) {
  return ACTIVITY_TYPE_LABELS[activity.type] || "Activity";
}

function sortedActivities(activities = allActivities) {
  return [...activities].sort((a, b) => {
    const unitA = unitById(a.unitId)?.order ?? 999;
    const unitB = unitById(b.unitId)?.order ?? 999;
    return unitA - unitB || Number(a.order || 0) - Number(b.order || 0) || a.title.localeCompare(b.title);
  });
}

function requiredActivities() {
  return sortedActivities().filter(activity => activity.areaId === "sdd" && activity.required !== false && activity.published !== false);
}

function visibleActivities() {
  return sortedActivities().filter(activity => activity.published !== false);
}

function completedActivityIds() {
  return new Set([...currentProgress.entries()].filter(([, progress]) => progress.completed).map(([id]) => id));
}

function previousRequiredActivity(activity) {
  const required = requiredActivities();
  const index = required.findIndex(item => item.id === activity.id);
  return index > 0 ? required[index - 1] : null;
}

function isActivityUnlocked(activity) {
  const progress = currentProgress.get(activity.id);
  if (progress?.completed) return true;
  if (activity.required !== false) {
    const previous = previousRequiredActivity(activity);
    return !previous || currentProgress.get(previous.id)?.completed === true;
  }
  const prerequisites = activity.prerequisiteIds || [];
  if (prerequisites.length) return prerequisites.every(id => currentProgress.get(id)?.completed === true);
  const sameUnitRequired = requiredActivities().filter(item => item.unitId === activity.unitId && Number(item.order) < Number(activity.order));
  const previous = sameUnitRequired.at(-1);
  return !previous || currentProgress.get(previous.id)?.completed === true;
}

function mergeActivities(staticItems, customItems) {
  return sortedActivities([
    ...staticItems,
    ...customItems.map(item => ({
      ...item,
      skills: Array.isArray(item.skills) ? item.skills : [],
      required: item.required === true,
      published: item.published !== false,
      custom: true
    }))
  ]);
}

function customActivityDocumentId() {
  return `custom-${auth.currentUser.uid}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normaliseSkills(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim().toLowerCase()).filter(Boolean);
  return String(value || "").split(",").map(item => item.trim().toLowerCase()).filter(Boolean);
}

function videoEmbedUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  try {
    const parsed = new URL(value);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).at(-1);
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch (_) { /* display as a normal link */ }
  return "";
}

async function ensureTeacherProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) return existing.data();

  const email = (user.email || "").toLowerCase();
  const invite = await getDoc(doc(db, "teacherInvites", email));
  if (!invite.exists() || invite.data().active !== true) {
    throw new Error("This Google account has not been approved as a teacher yet.");
  }

  const profile = {
    role: "teacher",
    displayName: user.displayName || email,
    email,
    createdAt: serverTimestamp()
  };
  await setDoc(userRef, profile);
  return profile;
}

async function loadProfile(user) {
  let snapshot = await getDoc(doc(db, "users", user.uid));
  if (!snapshot.exists() && user.providerData.some(provider => provider.providerId === "google.com")) {
    await ensureTeacherProfile(user);
    snapshot = await getDoc(doc(db, "users", user.uid));
  }
  if (!snapshot.exists()) throw new Error("Your account profile could not be found.");
  return snapshot.data();
}

async function routeSignedInUser(user) {
  try {
    currentProfile = await loadProfile(user);
    elements.signedInControls.classList.remove("hidden");
    elements.currentUserLabel.textContent = currentProfile.displayName || currentProfile.username || "Signed in";
    clearMessage();

    if (currentProfile.role === "teacher") {
      // Optional teacher-added content must never block account sign-in.
      await loadTeacherCustomActivitiesSafely();
      showView("teacherView");
      await loadTeacherDashboard();
    } else if (currentProfile.role === "student") {
      await loadUserPreferences();
      // Optional teacher-added content must never block account sign-in.
      await loadPupilCustomActivitiesSafely();
      showView("pupilView");
      await loadPupilDashboard();
    } else {
      throw new Error("This account has an unknown role.");
    }
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The account could not be opened.", "error");
    await signOut(auth);
  }
}

onAuthStateChanged(auth, async user => {
  if (user) {
    if (accountSetupInProgress) return;
    await routeSignedInUser(user);
  } else {
    currentProfile = null;
    currentTask = null;
    currentActivity = null;
    currentProgress = new Map();
    customActivities = [];
    allActivities = [...ACTIVITIES];
    currentReviewStates = new Map();
    currentReviewAttempts = [];
    currentClassQuestionStats = new Map();
    spacedSession = null;
    stopTracePlayback();
    clearScheduledAutoSave();
    errorViewMode = "standard";
    elements.signedInControls.classList.add("hidden");
    showView("authView");
  }
});

elements.teacherGoogleButton.addEventListener("click", async () => {
  clearMessage();
  elements.teacherGoogleButton.disabled = true;
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Google sign-in failed.", "error");
  } finally {
    elements.teacherGoogleButton.disabled = false;
  }
});

elements.pupilLoginTab.addEventListener("click", () => {
  elements.pupilLoginTab.classList.add("active");
  elements.pupilRegisterTab.classList.remove("active");
  elements.pupilLoginForm.classList.remove("hidden");
  elements.pupilRegisterForm.classList.add("hidden");
});

elements.pupilRegisterTab.addEventListener("click", () => {
  elements.pupilRegisterTab.classList.add("active");
  elements.pupilLoginTab.classList.remove("active");
  elements.pupilRegisterForm.classList.remove("hidden");
  elements.pupilLoginForm.classList.add("hidden");
});

elements.pupilLoginForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();
  const code = normaliseClassCode(elements.loginClassCode.value);
  const username = normaliseUsername(elements.loginUsername.value);
  const password = elements.loginPassword.value;

  if (!code || !username) {
    showMessage("Enter a valid class code and username.", "error");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, pupilInternalEmail(code, username), password);
  } catch (error) {
    console.error(error);
    showMessage("The class code, username or password was not recognised.", "error");
  }
});

elements.pupilRegisterForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();

  const code = normaliseClassCode(elements.registerClassCode.value);
  const username = normaliseUsername(elements.registerUsername.value);
  const displayName = elements.registerDisplayName.value.trim();
  const password = elements.registerPassword.value;
  const confirmation = elements.registerPasswordConfirm.value;

  if (code.length < 5 || username.length < 3 || displayName.length < 1) {
    showMessage("Check the class code, display name and username.", "error");
    return;
  }
  if (password.length < 8) {
    showMessage("Choose a password containing at least 8 characters.", "error");
    return;
  }
  if (password !== confirmation) {
    showMessage("The two passwords do not match.", "error");
    return;
  }

  let newUser = null;
  accountSetupInProgress = true;
  try {
    const joinSnapshot = await getDoc(doc(db, "joinCodes", code));
    if (!joinSnapshot.exists() || joinSnapshot.data().active !== true) {
      throw new Error("That class code is not valid.");
    }

    const joinData = joinSnapshot.data();
    const credential = await createUserWithEmailAndPassword(
      auth,
      pupilInternalEmail(code, username),
      password
    );
    newUser = credential.user;

    const batch = writeBatch(db);
    batch.set(doc(db, "users", newUser.uid), {
      role: "student",
      username,
      displayName,
      classId: joinData.classId,
      className: joinData.className,
      joinCode: code,
      createdAt: serverTimestamp()
    });
    batch.set(doc(db, "classes", joinData.classId, "members", newUser.uid), {
      userId: newUser.uid,
      role: "student",
      username,
      displayName,
      joinCode: code,
      joinedAt: serverTimestamp()
    });
    await batch.commit();
    accountSetupInProgress = false;
    showMessage("Account created successfully.", "success");
    await routeSignedInUser(newUser);
  } catch (error) {
    accountSetupInProgress = false;
    console.error(error);
    if (newUser) {
      try { await deleteUser(newUser); } catch (cleanupError) { console.error(cleanupError); }
    }
    const friendly = error.code === "auth/email-already-in-use"
      ? "That username is already being used in this class."
      : (error.message || "The pupil account could not be created.");
    showMessage(friendly, "error");
  }
});

elements.logoutButton.addEventListener("click", async () => {
  if (currentProfile?.role === "student" && currentTask && codeIsDirty) {
    try { await saveProgressDraft({ silent: true }); } catch (_) { /* sign out anyway */ }
  }
  await signOut(auth);
});

elements.homeButton.addEventListener("click", async () => {
  clearMessage();
  stopDebugTimer();
  if (currentProfile?.role === "teacher") {
    await loadTeacherCustomActivitiesSafely();
    showView("teacherView");
    await loadTeacherDashboard();
  } else if (currentProfile?.role === "student") {
    if (currentTask && codeIsDirty) {
      try { await saveProgressDraft({ silent: true }); } catch (_) { /* keep navigating */ }
    }
    stopTracePlayback();
    await loadPupilCustomActivitiesSafely();
    showView("pupilView");
    await loadPupilDashboard();
  }
});

function generateClassCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return [...values].map(value => alphabet[value % alphabet.length]).join("");
}

async function uniqueClassCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateClassCode();
    if (!(await getDoc(doc(db, "joinCodes", code))).exists()) return code;
  }
  throw new Error("A class code could not be generated. Try again.");
}

elements.showCreateClassButton.addEventListener("click", () => {
  elements.createClassPanel.classList.remove("hidden");
  elements.classNameInput.focus();
});

elements.cancelCreateClassButton.addEventListener("click", () => {
  elements.createClassPanel.classList.add("hidden");
  elements.createClassForm.reset();
});

elements.createClassForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();
  const className = elements.classNameInput.value.trim();
  if (!className) return;

  const classRef = doc(collection(db, "classes"));
  let code = null;
  try {
    code = await uniqueClassCode();
    await setDoc(classRef, {
      name: className,
      ownerId: auth.currentUser.uid,
      ownerName: currentProfile.displayName,
      joinCode: code,
      active: true,
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, "joinCodes", code), {
      classId: classRef.id,
      className,
      ownerId: auth.currentUser.uid,
      active: true,
      createdAt: serverTimestamp()
    });
    elements.createClassForm.reset();
    elements.createClassPanel.classList.add("hidden");
    showMessage(`Class created. The pupil code is ${code}.`, "success");
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    try { await deleteDoc(classRef); } catch (_) { /* ignore cleanup */ }
    showMessage(error.message || "The class could not be created.", "error");
  }
});

function populateContentUnitOptions() {
  if (!elements.contentUnitInput) return;
  elements.contentUnitInput.innerHTML = UNITS
    .filter(unit => unit.areaId === "sdd")
    .sort((a, b) => a.order - b.order)
    .map(unit => `<option value="${escapeHtml(unit.id)}">${unit.number}. ${escapeHtml(unit.title)}</option>`)
    .join("");
}

async function loadTeacherCustomActivities() {
  if (!auth.currentUser || currentProfile?.role !== "teacher") return [];
  const snapshot = await getDocs(query(
    collection(db, "customActivities"),
    where("ownerId", "==", auth.currentUser.uid)
  ));
  customActivities = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  allActivities = mergeActivities(ACTIVITIES, customActivities);
  return customActivities;
}

async function loadPupilCustomActivities() {
  if (!auth.currentUser || currentProfile?.role !== "student") return [];
  const classSnapshot = await getDoc(doc(db, "classes", currentProfile.classId));
  if (!classSnapshot.exists()) {
    customActivities = [];
    allActivities = [...ACTIVITIES];
    return [];
  }
  const ownerId = classSnapshot.data().ownerId;
  const snapshot = await getDocs(query(
    collection(db, "customActivities"),
    where("ownerId", "==", ownerId),
    where("published", "==", true)
  ));
  customActivities = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  allActivities = mergeActivities(ACTIVITIES, customActivities);
  return customActivities;
}

async function loadTeacherCustomActivitiesSafely() {
  try {
    return await loadTeacherCustomActivities();
  } catch (error) {
    console.warn("Teacher-added content could not be loaded. Continuing with the built-in curriculum.", error);
    customActivities = [];
    allActivities = [...ACTIVITIES];
    return [];
  }
}

async function loadPupilCustomActivitiesSafely() {
  try {
    return await loadPupilCustomActivities();
  } catch (error) {
    console.warn("Teacher-added content could not be loaded. Continuing with the built-in curriculum.", error);
    customActivities = [];
    allActivities = [...ACTIVITIES];
    return [];
  }
}

function updateContentTypeFields() {
  const isVideo = elements.contentTypeInput.value === "video";
  elements.contentCheckpointLabel.classList.toggle("hidden", !isVideo);
  elements.contentOptionsLabel.classList.toggle("hidden", !isVideo);
  elements.contentAnswerLabel.classList.toggle("hidden", !isVideo);
  elements.contentYearLabel.classList.toggle("hidden", isVideo);
  elements.contentQuestionLabel.classList.toggle("hidden", isVideo);
  elements.contentMarksLabel.classList.toggle("hidden", isVideo);
  elements.contentMarkingPointsLabel.classList.toggle("hidden", isVideo);
  elements.contentModelAnswerLabel.classList.toggle("hidden", isVideo);
}

function resetContentForm() {
  elements.contentActivityForm.reset();
  elements.editingActivityId.value = "";
  editingCustomActivityId = "";
  elements.contentTypeInput.value = "video";
  elements.contentOrderInput.value = "1.5";
  elements.contentYearInput.value = "2025";
  elements.contentMarksInput.value = "1";
  elements.contentMarkingPointsInput.value = "";
  elements.contentModelAnswerInput.value = "";
  elements.contentAnswerInput.value = "1";
  elements.contentPublishedInput.checked = true;
  elements.contentRequiredInput.checked = false;
  elements.saveContentActivityButton.textContent = "Add activity";
  elements.cancelEditContentButton.classList.add("hidden");
  updateContentTypeFields();
}

function renderCustomContentList() {
  if (!elements.customContentList) return;
  if (!customActivities.length) {
    elements.customContentList.innerHTML = `<p class="help-text">You have not added any videos or official-paper links yet.</p>`;
    return;
  }
  elements.customContentList.innerHTML = "";
  sortedActivities(customActivities).forEach(activity => {
    const unit = unitById(activity.unitId);
    const item = document.createElement("article");
    item.className = "content-item";
    item.innerHTML = `
      <div>
        <h5>${escapeHtml(activity.title)}</h5>
        <p>${escapeHtml(activityTypeLabel(activity))} · Unit ${escapeHtml(unit?.number || "?")} · order ${escapeHtml(activity.order)} · ${activity.published === false ? "Hidden" : "Published"}</p>
      </div>
      <div class="content-item-actions">
        <button type="button" class="secondary edit-content">Edit</button>
        <button type="button" class="secondary toggle-content">${activity.published === false ? "Publish" : "Hide"}</button>
        <button type="button" class="danger-button delete-content">Delete</button>
      </div>`;
    item.querySelector(".edit-content").addEventListener("click", () => beginEditCustomActivity(activity));
    item.querySelector(".toggle-content").addEventListener("click", () => toggleCustomActivity(activity));
    item.querySelector(".delete-content").addEventListener("click", () => deleteCustomActivity(activity));
    elements.customContentList.appendChild(item);
  });
}

function beginEditCustomActivity(activity) {
  editingCustomActivityId = activity.id;
  elements.editingActivityId.value = activity.id;
  elements.contentTypeInput.value = activity.type;
  elements.contentUnitInput.value = activity.unitId;
  elements.contentOrderInput.value = activity.order;
  elements.contentTitleInput.value = activity.title || "";
  elements.contentDescriptionInput.value = activity.description || "";
  elements.contentUrlInput.value = activity.videoUrl || activity.officialUrl || "";
  elements.contentSkillsInput.value = (activity.skills || []).join(", ");
  elements.contentYearInput.value = activity.year || 2025;
  elements.contentQuestionInput.value = activity.questionReference || "";
  elements.contentMarksInput.value = activity.marks || 1;
  elements.contentMarkingPointsInput.value = (activity.markingPoints || []).join("\n");
  elements.contentModelAnswerInput.value = activity.modelAnswer || "";
  elements.contentCheckpointInput.value = activity.checkpoint?.prompt || "";
  elements.contentOptionsInput.value = (activity.checkpoint?.options || []).join("\n");
  elements.contentAnswerInput.value = Number(activity.checkpoint?.answer ?? 0) + 1;
  elements.contentRequiredInput.checked = activity.required === true;
  elements.contentPublishedInput.checked = activity.published !== false;
  elements.saveContentActivityButton.textContent = "Save changes";
  elements.cancelEditContentButton.classList.remove("hidden");
  updateContentTypeFields();
  elements.contentManagerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function toggleCustomActivity(activity) {
  try {
    await setDoc(doc(db, "customActivities", activity.id), {
      published: activity.published === false,
      updatedAt: serverTimestamp()
    }, { merge: true });
    await loadTeacherCustomActivities();
    renderCustomContentList();
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The activity could not be updated.", "error");
  }
}

async function deleteCustomActivity(activity) {
  if (!window.confirm(`Delete “${activity.title}”? Existing pupil progress records will remain, but the activity will no longer appear.`)) return;
  try {
    await deleteDoc(doc(db, "customActivities", activity.id));
    if (editingCustomActivityId === activity.id) resetContentForm();
    await loadTeacherCustomActivities();
    renderCustomContentList();
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The activity could not be deleted.", "error");
  }
}

elements.showContentManagerButton.addEventListener("click", async () => {
  elements.contentManagerPanel.classList.remove("hidden");
  await loadTeacherCustomActivities();
  renderCustomContentList();
  elements.contentManagerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.closeContentManagerButton.addEventListener("click", () => {
  elements.contentManagerPanel.classList.add("hidden");
  resetContentForm();
});

elements.contentTypeInput.addEventListener("change", updateContentTypeFields);
elements.cancelEditContentButton.addEventListener("click", resetContentForm);

elements.contentActivityForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();
  const type = elements.contentTypeInput.value;
  const options = elements.contentOptionsInput.value.split("\n").map(item => item.trim()).filter(Boolean);
  const answer = Math.max(0, Number(elements.contentAnswerInput.value || 1) - 1);
  const id = editingCustomActivityId || customActivityDocumentId();
  const data = {
    ownerId: auth.currentUser.uid,
    areaId: "sdd",
    unitId: elements.contentUnitInput.value,
    type,
    order: Number(elements.contentOrderInput.value || 1.5),
    title: elements.contentTitleInput.value.trim(),
    description: elements.contentDescriptionInput.value.trim(),
    skills: normaliseSkills(elements.contentSkillsInput.value),
    required: elements.contentRequiredInput.checked,
    published: elements.contentPublishedInput.checked,
    estimatedMinutes: type === "video" ? 6 : 10,
    updatedAt: serverTimestamp()
  };
  if (type === "video") {
    data.videoUrl = elements.contentUrlInput.value.trim();
    data.videoTitle = data.title;
    data.checkpoint = elements.contentCheckpointInput.value.trim() && options.length >= 2
      ? { prompt: elements.contentCheckpointInput.value.trim(), options, answer: Math.min(answer, options.length - 1), explanation: "Review the video if you are unsure." }
      : null;
  } else {
    data.officialUrl = elements.contentUrlInput.value.trim();
    data.year = Number(elements.contentYearInput.value || 2025);
    data.questionReference = elements.contentQuestionInput.value.trim();
    data.pageReference = "";
    data.marks = Math.max(1, Number(elements.contentMarksInput.value || 1));
    data.markingPoints = elements.contentMarkingPointsInput.value
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);
    data.modelAnswer = elements.contentModelAnswerInput.value.trim();
  }
  if (!editingCustomActivityId) data.createdAt = serverTimestamp();
  try {
    await setDoc(doc(db, "customActivities", id), data, { merge: Boolean(editingCustomActivityId) });
    showMessage(editingCustomActivityId ? "Activity updated." : "Activity added to the pathway.", "success");
    resetContentForm();
    await loadTeacherCustomActivities();
    renderCustomContentList();
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The activity could not be saved.", "error");
  }
});

populateContentUnitOptions();
resetContentForm();

async function getTeacherClasses() {
  const snapshot = await getDocs(query(
    collection(db, "classes"),
    where("ownerId", "==", auth.currentUser.uid)
  ));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

async function classDataWithStats(classItem) {
  const [memberSnapshot, progressSnapshot, reviewAttemptSnapshot, reviewStateSnapshot, reviewSessionSnapshot, questionStatsSnapshot, peerReviewSnapshot, gameAttemptSnapshot] = await Promise.all([
    getDocs(collection(db, "classes", classItem.id, "members")),
    getDocs(query(collection(db, "progress"), where("classId", "==", classItem.id))),
    getDocs(query(collection(db, "reviewAttempts"), where("classId", "==", classItem.id))),
    getDocs(query(collection(db, "reviewStates"), where("classId", "==", classItem.id))),
    getDocs(query(collection(db, "reviewSessions"), where("classId", "==", classItem.id))),
    getDocs(query(collection(db, "reviewQuestionStats"), where("classId", "==", classItem.id))),
    getDocs(collection(db, "classes", classItem.id, "peerReviews")),
    getDocs(query(collection(db, "gameAttempts"), where("classId", "==", classItem.id)))
  ]);
  const members = memberSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  const progress = progressSnapshot.docs.map(item => item.data());
  const reviewAttempts = reviewAttemptSnapshot.docs.map(item => item.data());
  const reviewStates = reviewStateSnapshot.docs.map(item => item.data());
  const reviewSessions = reviewSessionSnapshot.docs.map(item => item.data());
  const questionStats = questionStatsSnapshot.docs.map(item => item.data());
  const peerReviews = peerReviewSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  const gameAttempts = gameAttemptSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  return { ...classItem, members, progress, reviewAttempts, reviewStates, reviewSessions, questionStats, peerReviews, gameAttempts };
}

async function loadTeacherDashboard() {
  elements.classCards.innerHTML = "<p>Loading classes…</p>";
  elements.classDetailPanel.classList.add("hidden");
  try {
    await loadTeacherCustomActivities();
    const coreIds = new Set(requiredActivities().map(activity => activity.id));
    const coreCount = coreIds.size;
    const classes = await getTeacherClasses();
    const fullClasses = await Promise.all(classes.map(classDataWithStats));
    const pupilCount = fullClasses.reduce((sum, item) => sum + item.members.length, 0);
    const completed = fullClasses.reduce((sum, item) => sum + item.progress.filter(p => p.completed && coreIds.has(p.taskId)).length, 0);
    const attempts = fullClasses.reduce((sum, item) => sum + item.progress.reduce((a, p) => a + (p.attempts || 0), 0), 0);

    elements.teacherSummary.innerHTML = [
      statCard(fullClasses.length, "Classes"),
      statCard(pupilCount, "Pupils"),
      statCard(completed, "Core activities completed"),
      statCard(attempts, "Total attempts")
    ].join("");

    if (!fullClasses.length) {
      elements.classCards.innerHTML = "<div class=\"card\"><p>You have not created a class yet.</p></div>";
      return;
    }

    elements.classCards.innerHTML = "";
    fullClasses.forEach(item => {
      const possible = item.members.length * coreCount;
      const completedCount = item.progress.filter(progress => progress.completed && coreIds.has(progress.taskId)).length;
      const percent = possible ? Math.round((completedCount / possible) * 100) : 0;
      const card = document.createElement("article");
      card.className = "class-card";
      card.innerHTML = `
        <h3>${escapeHtml(item.name)}</h3>
        <p>Class code: <span class="code-chip">${escapeHtml(item.joinCode)}</span></p>
        <p>${item.members.length} pupil${item.members.length === 1 ? "" : "s"}</p>
        <div class="progress-bar"><span style="width:${percent}%"></span></div>
        <p>${percent}% of the required Python pathway completed</p>
        <div class="card-actions"><button>View class</button></div>`;
      card.querySelector("button").addEventListener("click", () => showClassDetails(item));
      elements.classCards.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    elements.classCards.innerHTML = "";
    showMessage(error.message || "The teacher dashboard could not be loaded.", "error");
  }
}


function progressStatus(progress) {
  if (progress?.completed) return { label: "Complete", className: "complete" };
  if ((progress?.attempts || 0) > 0) return { label: "Needs work", className: "needs-work" };
  if (progress?.lastCode !== undefined) return { label: "In progress", className: "working" };
  return { label: "Not started", className: "" };
}


function paperResponseStatus(response) {
  if (response.peerReviewStatus === "queued" || response.peerReviewStatus === "assigned") return "Peer check pending";
  if (response.peerReviewStatus === "finalised") return "Peer reviewed";
  if (response.completed) return "Reviewed";
  if (response.submitted) return "Submitted";
  if (response.writtenResponse !== undefined) return "Draft saved";
  return "Opened";
}

function showPaperResponseDetails(response, member, activity) {
  elements.paperResponseViewer.classList.remove("hidden");
  elements.paperResponseViewer.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Official-paper response</p>
        <h4>${escapeHtml(member?.displayName || "Pupil")} — ${escapeHtml(activity?.title || response.activityTitle || response.taskTitle || response.taskId)}</h4>
        <p class="help-text">${escapeHtml(activity?.questionReference || "")} · ${paperResponseStatus(response)}</p>
      </div>
      <button id="closePaperResponseViewer" type="button" class="secondary small">Close response</button>
    </div>
    <div class="response-review-grid">
      <section>
        <h5>First submitted answer</h5>
        <div class="response-text">${escapeHtml(response.originalSubmission || "No submitted answer yet.")}</div>
      </section>
      <section>
        <h5>Latest saved answer</h5>
        <div class="response-text">${escapeHtml(response.writtenResponse || "No answer saved.")}</div>
      </section>
    </div>
    <div class="response-summary-row">
      <span><strong>Self-assessed mark:</strong> ${response.selfAssessedMark !== undefined ? `${escapeHtml(response.selfAssessedMark)}/${escapeHtml(activity?.marks || "?")}` : "Not completed"}</span>
      <span><strong>Model viewed:</strong> ${response.modelAnswerViewed ? "Yes" : "No"}</span>
      <span><strong>Last activity:</strong> ${humanDate(response.lastActivityAt || response.lastSavedAt)}</span>
    </div>
    <section>
      <h5>Pupil reflection</h5>
      <div class="response-text">${escapeHtml(response.reflection || "No reflection recorded.")}</div>
    </section>`;
  elements.paperResponseViewer.querySelector("#closePaperResponseViewer").addEventListener("click", () => {
    elements.paperResponseViewer.classList.add("hidden");
    elements.paperResponseViewer.innerHTML = "";
  });
  elements.paperResponseViewer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderPaperResponses(classItem) {
  const memberMap = new Map(classItem.members.map(member => [member.userId, member]));
  const responses = classItem.progress
    .filter(item => item.activityType === "official-paper" && (
      item.paperOpened || item.writtenResponse !== undefined || item.submitted || item.completed
    ))
    .sort((a, b) => ((b.lastActivityAt || b.lastSavedAt)?.seconds || 0) - ((a.lastActivityAt || a.lastSavedAt)?.seconds || 0));

  elements.paperResponseCount.textContent = `${responses.length} response${responses.length === 1 ? "" : "s"}`;
  elements.paperResponsesBody.innerHTML = "";
  responses.forEach(response => {
    const member = memberMap.get(response.userId);
    const activity = allActivities.find(item => item.id === response.taskId) || null;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${escapeHtml(member?.displayName || "Unknown pupil")}</strong></td>
      <td>${escapeHtml(activity?.title || response.activityTitle || response.taskTitle || response.taskId)}</td>
      <td>${paperResponseStatus(response)}</td>
      <td>${response.selfAssessedMark !== undefined ? `${escapeHtml(response.selfAssessedMark)}/${escapeHtml(activity?.marks || "?")}` : "—"}</td>
      <td>${humanDate(response.lastActivityAt || response.lastSavedAt)}</td>
      <td><button type="button" class="secondary small">View answer</button></td>`;
    row.querySelector("button").addEventListener("click", () => showPaperResponseDetails(response, member, activity));
    elements.paperResponsesBody.appendChild(row);
  });
  if (!responses.length) {
    elements.paperResponsesBody.innerHTML = `<tr><td colspan="6">No official-paper answers have been saved yet.</td></tr>`;
  }
  elements.paperResponseViewer.classList.add("hidden");
  elements.paperResponseViewer.innerHTML = "";
}

function timestampMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  return new Date(value).getTime() || 0;
}

function renderSpacedClassOverview(classItem) {
  const attempts = classItem.reviewAttempts || [];
  const states = classItem.reviewStates || [];
  const sessions = classItem.reviewSessions || [];
  const now = Date.now();
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const activePupils = new Set(sessions.filter(item => timestampMillis(item.completedAt) >= weekAgo).map(item => item.userId));
  const correct = attempts.filter(item => item.correct === true).length;
  const recall = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
  const overduePupils = new Set(states.filter(item => timestampMillis(item.nextReviewAt) <= now).map(item => item.userId));

  const bySkill = new Map();
  attempts.forEach(attempt => {
    (attempt.skillIds || []).forEach(skillId => {
      const row = bySkill.get(skillId) || { attempts: 0, correct: 0 };
      row.attempts += 1;
      if (attempt.correct) row.correct += 1;
      bySkill.set(skillId, row);
    });
  });
  const dueBySkill = new Map();
  states.filter(item => timestampMillis(item.nextReviewAt) <= now).forEach(item => {
    if (!dueBySkill.has(item.skillId)) dueBySkill.set(item.skillId, new Set());
    dueBySkill.get(item.skillId).add(item.userId);
  });

  const skillRows = [...new Set([...bySkill.keys(), ...dueBySkill.keys()])]
    .map(skillId => ({ skillId, ...(bySkill.get(skillId) || { attempts: 0, correct: 0 }), due: dueBySkill.get(skillId)?.size || 0 }))
    .sort((a, b) => {
      const rateA = a.attempts ? a.correct / a.attempts : 1;
      const rateB = b.attempts ? b.correct / b.attempts : 1;
      return rateA - rateB || b.due - a.due || b.attempts - a.attempts;
    });
  const weakest = skillRows.find(row => row.attempts >= 2);

  elements.spacedReviewCount.textContent = `${attempts.length} review${attempts.length === 1 ? "" : "s"}`;
  elements.spacedClassStats.innerHTML = [
    statCard(`${activePupils.size}/${classItem.members.length}`, "Reviewed this week"),
    statCard(`${recall}%`, "Average recall"),
    statCard(overduePupils.size, "Pupils with reviews due"),
    statCard(weakest ? escapeHtml(SKILL_LABELS[weakest.skillId] || weakest.skillId) : "—", "Most insecure skill")
  ].join("");

  const byArea = new Map();
  attempts.forEach(attempt => {
    const areaId = attempt.areaId || "sdd";
    const row = byArea.get(areaId) || { attempts: 0, correct: 0 };
    row.attempts += 1;
    if (attempt.correct) row.correct += 1;
    byArea.set(areaId, row);
  });
  elements.spacedAreaStats.innerHTML = AREAS.map(area => {
    const row = byArea.get(area.id) || { attempts: 0, correct: 0 };
    const rate = row.attempts ? Math.round((row.correct / row.attempts) * 100) : 0;
    return `<div class="area-recall-card"><span class="area-badge area-${escapeHtml(area.id)}">${escapeHtml(area.shortTitle)}</span><strong>${row.attempts ? `${rate}%` : "—"}</strong><span>${row.attempts} response${row.attempts === 1 ? "" : "s"}</span></div>`;
  }).join("");

  elements.spacedSkillStatsBody.innerHTML = skillRows.slice(0, 12).map(row => {
    const rate = row.attempts ? Math.round((row.correct / row.attempts) * 100) : 0;
    return `<tr><td><strong>${escapeHtml(SKILL_LABELS[row.skillId] || row.skillId)}</strong></td><td>${row.attempts}</td><td>${row.attempts ? `${rate}%` : "No attempts"}</td><td>${row.due}</td></tr>`;
  }).join("") || `<tr><td colspan="4">No spaced-learning responses have been collected yet.</td></tr>`;
}


function renderGamesClassOverview(classItem) {
  const attempts = classItem.gameAttempts || [];
  const debugAttempts = attempts.filter(item => item.game === "debug-rescue");
  const logicAttempts = attempts.filter(item => item.game === "logic-showdown");
  const rate = items => items.length ? Math.round((items.filter(item => item.correct).length / items.length) * 100) : 0;
  const bySkill = new Map();
  attempts.forEach(item => (item.skillIds || []).forEach(skillId => {
    const row = bySkill.get(skillId) || { attempts: 0, correct: 0 };
    row.attempts += 1;
    if (item.correct) row.correct += 1;
    bySkill.set(skillId, row);
  }));
  const weakest = [...bySkill.entries()]
    .filter(([, row]) => row.attempts >= 2)
    .sort((a, b) => (a[1].correct / a[1].attempts) - (b[1].correct / b[1].attempts))[0];
  elements.gameAttemptCount.textContent = `${attempts.length} response${attempts.length === 1 ? "" : "s"}`;
  elements.gameClassStats.innerHTML = [
    statCard(debugAttempts.length ? `${rate(debugAttempts)}%` : "—", "Debug success"),
    statCard(logicAttempts.length ? `${rate(logicAttempts)}%` : "—", "Logic accuracy"),
    statCard(new Set(attempts.map(item => item.userId)).size, "Pupils played"),
    statCard(weakest ? escapeHtml(SKILL_LABELS[weakest[0]] || weakest[0]) : "—", "Game skill to revisit")
  ].join("");
  const memberMap = new Map(classItem.members.map(member => [member.userId, member]));
  const rows = classItem.members.map(member => {
    const own = attempts.filter(item => item.userId === member.userId);
    const debugOwn = own.filter(item => item.game === "debug-rescue");
    const logicOwn = own.filter(item => item.game === "logic-showdown");
    const hints = debugOwn.reduce((sum, item) => sum + Number(item.hintsUsed || 0), 0);
    return { member, own, debugOwn, logicOwn, hints };
  }).filter(row => row.own.length).sort((a, b) => a.member.displayName.localeCompare(b.member.displayName));
  elements.gamePupilStatsBody.innerHTML = rows.map(row => `<tr>
    <td><strong>${escapeHtml(row.member.displayName)}</strong></td>
    <td>${row.debugOwn.length ? `${rate(row.debugOwn)}%` : "—"}</td>
    <td>${row.logicOwn.length ? `${rate(row.logicOwn)}%` : "—"}</td>
    <td>${row.hints}</td>
    <td>${humanDate(row.own.sort((a,b) => timestampMillis(b.completedAt)-timestampMillis(a.completedAt))[0]?.completedAt)}</td>
  </tr>`).join("") || `<tr><td colspan="5">No Games Lab responses yet.</td></tr>`;
}

function renderPeerReviewOverview(classItem) {
  const memberMap = new Map(classItem.members.map(member => [member.userId, member]));
  const reviews = classItem.peerReviews || [];
  elements.peerReviewCount.textContent = `${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
  elements.peerReviewBody.innerHTML = reviews.map(review => {
    const author = memberMap.get(review.authorId);
    const reviewer = memberMap.get(review.reviewerId);
    return `<tr>
      <td><strong>${escapeHtml(author?.displayName || "Unknown pupil")}</strong></td>
      <td>${escapeHtml(review.activityTitle || review.activityId || "Official-paper answer")}</td>
      <td>${review.selfAssessedMark !== undefined ? `${review.selfAssessedMark}/${review.maxMarks}` : "—"}</td>
      <td>${review.peerSuggestedMark !== undefined ? `${review.peerSuggestedMark}/${review.maxMarks}` : "—"}</td>
      <td>${review.finalMark !== undefined ? `${review.finalMark}/${review.maxMarks}` : "—"}</td>
      <td>${escapeHtml(review.status || "queued")}</td>
      <td>${escapeHtml(reviewer?.displayName || (review.status === "queued" ? "Waiting" : "Anonymous pupil"))}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="7">No peer-marking requests yet.</td></tr>`;
}

function populateClassFocusControls(classItem) {
  activeTeacherClass = classItem;
  const areaInput = elements.classFocusAreaInput;
  const unitInput = elements.classFocusUnitInput;
  areaInput.value = classItem.reviewFocusAreaId || "auto";
  const populateUnits = () => {
    const areaId = areaInput.value;
    const units = UNITS.filter(unit => areaId === "auto" || unit.areaId === areaId);
    unitInput.innerHTML = `<option value="">Automatic / whole area</option>${units.map(unit => `<option value="${escapeHtml(unit.id)}">${escapeHtml(unit.title)}</option>`).join("")}`;
    unitInput.value = classItem.reviewFocusUnitId || "";
  };
  areaInput.onchange = populateUnits;
  populateUnits();
  elements.classFocusSaveStatus.textContent = "";
}


function activityAreaId(activity) {
  return UNITS.find(unit => unit.id === activity?.unitId)?.areaId || activity?.areaId || "sdd";
}

function progressLastMillis(progress) {
  return timestampMillis(progress?.lastActivityAt || progress?.lastAttemptAt || progress?.lastSavedAt || progress?.submittedAt);
}

function reviewAttemptMillis(attempt) {
  return timestampMillis(attempt?.reviewedAt || attempt?.createdAt);
}

function memberLastActiveMillis(classItem, userId) {
  const progressTimes = (classItem.progress || []).filter(item => item.userId === userId).map(progressLastMillis);
  const reviewTimes = (classItem.reviewAttempts || []).filter(item => item.userId === userId).map(reviewAttemptMillis);
  const sessionTimes = (classItem.reviewSessions || []).filter(item => item.userId === userId).map(item => timestampMillis(item.completedAt || item.startedAt));
  const gameTimes = (classItem.gameAttempts || []).filter(item => item.userId === userId).map(item => timestampMillis(item.completedAt));
  return Math.max(0, ...progressTimes, ...reviewTimes, ...sessionTimes, ...gameTimes);
}

function skillEvidenceForPupil(classItem, userId, skillId) {
  const reviewEvidence = (classItem.reviewAttempts || [])
    .filter(item => item.userId === userId && !item.retry && (item.skillIds || []).includes(skillId))
    .sort((a, b) => reviewAttemptMillis(b) - reviewAttemptMillis(a))
    .slice(0, 5)
    .map(item => ({
      score: item.correct ? 1 : 0,
      kind: "Spaced review",
      correct: Boolean(item.correct),
      at: reviewAttemptMillis(item),
      questionId: item.questionId || ""
    }));

  const gameEvidence = (classItem.gameAttempts || [])
    .filter(item => item.userId === userId && (item.skillIds || []).includes(skillId))
    .sort((a, b) => timestampMillis(b.completedAt) - timestampMillis(a.completedAt))
    .slice(0, 5)
    .map(item => ({
      score: item.correct ? 1 : 0,
      kind: item.game === "debug-rescue" ? "Debug Rescue" : "Logic Showdown",
      correct: Boolean(item.correct),
      at: timestampMillis(item.completedAt),
      challengeId: item.challengeId || ""
    }));

  const progressEvidence = (classItem.progress || [])
    .filter(item => {
      if (item.userId !== userId) return false;
      const activity = allActivities.find(candidate => candidate.id === item.taskId);
      return Boolean(activity && (activity.skills || []).includes(skillId)) && (
        item.completed || Number(item.attempts || 0) > 0 || item.lastCode !== undefined || item.writtenResponse !== undefined
      );
    })
    .sort((a, b) => progressLastMillis(b) - progressLastMillis(a))
    .slice(0, 4)
    .map(item => {
      const activity = allActivities.find(candidate => candidate.id === item.taskId);
      return {
        score: item.completed ? 1 : (Number(item.attempts || 0) > 0 ? 0 : 0.5),
        kind: item.completed ? "Activity completed" : "Activity attempted",
        correct: Boolean(item.completed),
        at: progressLastMillis(item),
        activityId: item.taskId,
        activityTitle: activity?.title || item.taskTitle || item.taskId
      };
    });

  const combined = [...reviewEvidence, ...gameEvidence, ...progressEvidence]
    .sort((a, b) => b.at - a.at)
    .slice(0, 6);
  const evidenceCount = combined.length;
  const rate = evidenceCount ? Math.round((combined.reduce((sum, item) => sum + item.score, 0) / evidenceCount) * 100) : 0;
  const lastTwoWrong = reviewEvidence.length >= 2 && reviewEvidence.slice(0, 2).every(item => !item.correct);

  let status = "grey";
  let label = evidenceCount ? "Limited evidence" : "No evidence";
  if (evidenceCount >= 2 && (rate < 60 || lastTwoWrong)) {
    status = "red";
    label = "Needs support";
  } else if (evidenceCount >= 3 && rate >= 80) {
    status = "green";
    label = "Secure";
  } else if (evidenceCount >= 2) {
    status = "orange";
    label = "Developing";
  }

  return {
    skillId,
    status,
    label,
    rate,
    evidenceCount,
    reviewEvidence,
    gameEvidence,
    progressEvidence,
    combined,
    lastEvidenceAt: combined[0]?.at || 0
  };
}

function allEvidenceSkills(classItem) {
  const skills = new Set();
  (classItem.reviewAttempts || []).forEach(item => (item.skillIds || []).forEach(skill => skills.add(skill)));
  (classItem.gameAttempts || []).forEach(item => (item.skillIds || []).forEach(skill => skills.add(skill)));
  (classItem.progress || []).forEach(item => {
    const activity = allActivities.find(candidate => candidate.id === item.taskId);
    if (activity && (item.completed || Number(item.attempts || 0) > 0 || item.lastCode !== undefined || item.writtenResponse !== undefined)) {
      (activity.skills || []).forEach(skill => skills.add(skill));
    }
  });
  return skills;
}

function skillAreaId(skillId) {
  const activity = allActivities.find(item => (item.skills || []).includes(skillId));
  return activityAreaId(activity);
}

function heatmapSkillsForClass(classItem) {
  const scope = elements.heatmapScopeInput?.value || "focus";
  const evidenceSkills = allEvidenceSkills(classItem);
  let candidateActivities = allActivities;

  if (scope === "focus") {
    if (classItem.reviewFocusUnitId) {
      candidateActivities = allActivities.filter(item => item.unitId === classItem.reviewFocusUnitId);
    } else if (classItem.reviewFocusAreaId && classItem.reviewFocusAreaId !== "auto") {
      candidateActivities = allActivities.filter(item => activityAreaId(item) === classItem.reviewFocusAreaId);
    } else {
      const latestActivity = [...(classItem.progress || [])]
        .sort((a, b) => progressLastMillis(b) - progressLastMillis(a))
        .map(item => allActivities.find(activity => activity.id === item.taskId))
        .find(Boolean);
      candidateActivities = latestActivity
        ? allActivities.filter(item => item.unitId === latestActivity.unitId)
        : allActivities.filter(item => activityAreaId(item) === "sdd");
    }
  } else if (["sdd", "ddd", "cs"].includes(scope)) {
    candidateActivities = allActivities.filter(item => activityAreaId(item) === scope);
  } else if (scope === "studied") {
    candidateActivities = allActivities.filter(item => (item.skills || []).some(skill => evidenceSkills.has(skill)));
  }

  const candidates = new Set(candidateActivities.flatMap(item => item.skills || []));
  if (scope === "studied") evidenceSkills.forEach(skill => candidates.add(skill));

  const ranked = [...candidates].map(skillId => {
    let pupilsWithEvidence = 0;
    let totalEvidence = 0;
    classItem.members.forEach(member => {
      const evidence = skillEvidenceForPupil(classItem, member.userId, skillId);
      if (evidence.evidenceCount) pupilsWithEvidence += 1;
      totalEvidence += evidence.evidenceCount;
    });
    return { skillId, pupilsWithEvidence, totalEvidence };
  }).sort((a, b) => b.pupilsWithEvidence - a.pupilsWithEvidence || b.totalEvidence - a.totalEvidence || (SKILL_LABELS[a.skillId] || a.skillId).localeCompare(SKILL_LABELS[b.skillId] || b.skillId));

  return ranked.slice(0, 12).map(item => item.skillId);
}

function masterySymbol(status, evidenceCount) {
  if (status === "green") return "✓";
  if (status === "orange") return "~";
  if (status === "red") return "!";
  return evidenceCount ? "·" : "—";
}

function showSkillInsight(classItem, member, skillId) {
  const evidence = skillEvidenceForPupil(classItem, member.userId, skillId);
  const relatedProgress = (classItem.progress || [])
    .filter(item => {
      const activity = allActivities.find(candidate => candidate.id === item.taskId);
      return item.userId === member.userId && activity && (activity.skills || []).includes(skillId);
    })
    .sort((a, b) => progressLastMillis(b) - progressLastMillis(a));
  const relatedReviews = (classItem.reviewAttempts || [])
    .filter(item => item.userId === member.userId && (item.skillIds || []).includes(skillId))
    .sort((a, b) => reviewAttemptMillis(b) - reviewAttemptMillis(a))
    .slice(0, 8);
  const relatedGames = (classItem.gameAttempts || [])
    .filter(item => item.userId === member.userId && (item.skillIds || []).includes(skillId))
    .sort((a, b) => timestampMillis(b.completedAt) - timestampMillis(a.completedAt))
    .slice(0, 8);

  elements.skillInsightViewer.classList.remove("hidden");
  elements.skillInsightViewer.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Skill evidence</p>
        <h4>${escapeHtml(member.displayName)} — ${escapeHtml(SKILL_LABELS[skillId] || skillId)}</h4>
        <p class="help-text"><span class="mastery-inline mastery-${evidence.status}">${masterySymbol(evidence.status, evidence.evidenceCount)} ${escapeHtml(evidence.label)}</span> · ${evidence.evidenceCount} recent evidence item${evidence.evidenceCount === 1 ? "" : "s"}${evidence.evidenceCount ? ` · ${evidence.rate}% evidence score` : ""}</p>
      </div>
      <button id="closeSkillInsightButton" type="button" class="secondary small">Close</button>
    </div>
    <div class="insight-two-column">
      <section>
        <h5>Related pathway activities</h5>
        <div class="compact-evidence-list">${relatedProgress.length ? relatedProgress.slice(0, 8).map(item => {
          const activity = allActivities.find(candidate => candidate.id === item.taskId);
          const status = progressStatus(item);
          return `<div><span>${escapeHtml(activity?.title || item.taskTitle || item.taskId)}</span><span class="status-pill ${status.className}">${escapeHtml(status.label)}</span></div>`;
        }).join("") : "<p class=\"help-text\">No related pathway activity evidence yet.</p>"}</div>
      </section>
      <section>
        <h5>Recent spaced retrieval</h5>
        <div class="review-dot-row">${relatedReviews.length ? relatedReviews.map(item => `<span class="review-dot ${item.correct ? "correct" : "incorrect"}" title="${item.correct ? "Correct" : "Incorrect"} · ${humanDate(item.reviewedAt)}">${item.correct ? "✓" : "×"}</span>`).join("") : "<span class=\"help-text\">No spaced reviews yet.</span>"}</div>
        <p class="help-text">Most recent first. Green ticks were correct; red crosses were incorrect.</p>
        <h5>Games Lab evidence</h5>
        <div class="review-dot-row">${relatedGames.length ? relatedGames.map(item => `<span class="review-dot ${item.correct ? "correct" : "incorrect"}" title="${escapeHtml(item.game === "debug-rescue" ? "Debug Rescue" : "Logic Showdown")} · ${humanDate(item.completedAt)}">${item.correct ? "✓" : "×"}</span>`).join("") : `<span class="help-text">No related game evidence yet.</span>`}</div>
      </section>
    </div>`;
  elements.skillInsightViewer.querySelector("#closeSkillInsightButton").addEventListener("click", () => {
    elements.skillInsightViewer.classList.add("hidden");
    elements.skillInsightViewer.innerHTML = "";
  });
  elements.skillInsightViewer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderMasteryHeatmap(classItem) {
  const skills = heatmapSkillsForClass(classItem);
  const pupilFilter = elements.heatmapPupilFilterInput?.value || "all";
  let rows = classItem.members
    .slice()
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map(member => ({
      member,
      evidence: skills.map(skillId => skillEvidenceForPupil(classItem, member.userId, skillId))
    }));

  if (pupilFilter === "attention") rows = rows.filter(row => row.evidence.some(item => item.status === "red" || item.status === "orange"));
  if (pupilFilter === "support") rows = rows.filter(row => row.evidence.some(item => item.status === "red"));

  if (!skills.length) {
    elements.masteryHeatmapContainer.innerHTML = `<p class="help-text">No skill evidence is available for this filter yet.</p>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "mastery-heatmap";
  table.innerHTML = `<thead><tr><th class="sticky-pupil-column">Pupil</th>${skills.map(skillId => `<th title="${escapeHtml(SKILL_LABELS[skillId] || skillId)}"><span>${escapeHtml(SKILL_LABELS[skillId] || skillId)}</span></th>`).join("")}</tr></thead><tbody></tbody>`;
  const body = table.querySelector("tbody");
  rows.forEach(rowData => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.className = "sticky-pupil-column";
    const nameButton = document.createElement("button");
    nameButton.type = "button";
    nameButton.className = "text-button";
    nameButton.textContent = rowData.member.displayName;
    nameButton.addEventListener("click", () => showPupilInsight(classItem, rowData.member));
    nameCell.appendChild(nameButton);
    row.appendChild(nameCell);

    rowData.evidence.forEach((evidence, index) => {
      const cell = document.createElement("td");
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mastery-cell mastery-${evidence.status}`;
      button.textContent = masterySymbol(evidence.status, evidence.evidenceCount);
      button.setAttribute("aria-label", `${rowData.member.displayName}, ${SKILL_LABELS[skills[index]] || skills[index]}: ${evidence.label}`);
      button.title = `${evidence.label}${evidence.evidenceCount ? ` · ${evidence.rate}% · ${evidence.evidenceCount} evidence items` : ""}`;
      button.addEventListener("click", () => showSkillInsight(classItem, rowData.member, skills[index]));
      cell.appendChild(button);
      row.appendChild(cell);
    });
    body.appendChild(row);
  });

  elements.masteryHeatmapContainer.innerHTML = "";
  elements.masteryHeatmapContainer.appendChild(table);
  if (!rows.length) elements.masteryHeatmapContainer.innerHTML = `<p class="help-text">No pupils match this heatmap filter.</p>`;
}

function pupilMetrics(classItem, member) {
  const coreIds = new Set(requiredActivities().map(activity => activity.id));
  const progress = (classItem.progress || []).filter(item => item.userId === member.userId);
  const completed = progress.filter(item => item.completed && coreIds.has(item.taskId)).length;
  const inProgress = progress.filter(item => !item.completed && (item.lastCode !== undefined || item.writtenResponse !== undefined || Number(item.attempts || 0) > 0)).length;
  const totalAttempts = progress.reduce((sum, item) => sum + Number(item.attempts || 0), 0);
  const firstTimeCorrect = progress.filter(item => item.completed && item.firstAttemptCorrect === true && coreIds.has(item.taskId)).length;
  const firstTimeRate = completed ? Math.round((firstTimeCorrect / completed) * 100) : 0;
  const reviews = (classItem.reviewAttempts || []).filter(item => item.userId === member.userId && !item.retry).sort((a, b) => reviewAttemptMillis(b) - reviewAttemptMillis(a));
  const recentReviews = reviews.slice(0, 20);
  const recall = recentReviews.length ? Math.round((recentReviews.filter(item => item.correct).length / recentReviews.length) * 100) : 0;
  const games = (classItem.gameAttempts || []).filter(item => item.userId === member.userId).sort((a, b) => timestampMillis(b.completedAt) - timestampMillis(a.completedAt));
  const gameAccuracy = games.length ? Math.round((games.filter(item => item.correct).length / games.length) * 100) : 0;
  const skills = [...allEvidenceSkills(classItem)];
  const mastery = skills.map(skillId => skillEvidenceForPupil(classItem, member.userId, skillId));
  const counts = { green: 0, orange: 0, red: 0, grey: 0 };
  mastery.forEach(item => { counts[item.status] += 1; });
  return {
    member,
    progress,
    completed,
    inProgress,
    totalAttempts,
    firstTimeRate,
    reviews,
    recentReviews,
    recall,
    games,
    gameAccuracy,
    lastActive: memberLastActiveMillis(classItem, member.userId),
    mastery,
    counts,
    expected: Number(classItem.expectedCompletedActivities || 0)
  };
}

function pupilFlags(classItem, metrics) {
  const flags = [];
  const daysInactive = metrics.lastActive ? Math.floor((Date.now() - metrics.lastActive) / 86400000) : null;
  const redSkills = metrics.mastery.filter(item => item.status === "red");
  const completedExpected = metrics.expected > 0;

  if (!metrics.lastActive) {
    flags.push({ type: "warning", title: "Not started", detail: "No recorded activity yet.", action: "Check access and help the pupil begin." });
  } else if (daysInactive >= 7) {
    flags.push({ type: "warning", title: "Check-in needed", detail: `No recorded activity for ${daysInactive} days.`, action: "Check attendance, access or unfinished work." });
  }

  if (completedExpected && metrics.completed <= metrics.expected - 2) {
    flags.push({ type: "danger", title: "Behind expected pace", detail: `${metrics.completed} complete; class expectation is ${metrics.expected}.`, action: "Prioritise the next required activities." });
  }

  if (redSkills.length >= 2 || (metrics.recentReviews.length >= 5 && metrics.recall < 60) || (metrics.completed >= 4 && metrics.firstTimeRate < 50)) {
    const weakest = redSkills.slice(0, 2).map(item => SKILL_LABELS[item.skillId] || item.skillId).join(" and ");
    flags.push({ type: "danger", title: "Targeted support", detail: weakest ? `Repeated difficulty in ${weakest}.` : `Recent recall is ${metrics.recall}%.`, action: "Open the pupil profile and assign focused retrieval or guided practice." });
  }

  if (redSkills.length && metrics.completed >= 3 && metrics.recentReviews.length >= 3) {
    flags.push({ type: "warning", title: "Knowledge fading", detail: `${redSkills.length} previously encountered skill${redSkills.length === 1 ? " is" : "s are"} currently red.`, action: "Use spaced retrieval before reteaching the whole unit." });
  }

  if (completedExpected && metrics.completed >= metrics.expected + 3 && metrics.recentReviews.length >= 4 && metrics.recall < 65) {
    flags.push({ type: "warning", title: "Possible rushing", detail: `Ahead on completion but recent recall is ${metrics.recall}%.`, action: "Check depth of understanding before further acceleration." });
  }

  if (completedExpected && metrics.completed >= metrics.expected && metrics.recentReviews.length >= 5 && metrics.recall >= 80 && metrics.firstTimeRate >= 75 && redSkills.length === 0) {
    flags.push({ type: "success", title: "Extension ready", detail: `${metrics.recall}% recall and ${metrics.firstTimeRate}% first-time success.`, action: "Offer stretch, transfer or exam-style extension work." });
  }

  return flags;
}

function renderClassUnitProgress(classItem) {
  const required = requiredActivities();
  const units = UNITS.filter(unit => required.some(activity => activity.unitId === unit.id));
  const memberCount = classItem.members.length;
  elements.classUnitProgressChart.innerHTML = units.map(unit => {
    const activities = required.filter(activity => activity.unitId === unit.id);
    const total = memberCount * activities.length;
    let complete = 0;
    let developing = 0;
    classItem.members.forEach(member => {
      activities.forEach(activity => {
        const progress = classItem.progress.find(item => item.userId === member.userId && item.taskId === activity.id);
        if (progress?.completed) complete += 1;
        else if (progress && (Number(progress.attempts || 0) > 0 || progress.lastCode !== undefined || progress.writtenResponse !== undefined)) developing += 1;
      });
    });
    const notStarted = Math.max(0, total - complete - developing);
    const completePct = total ? (complete / total) * 100 : 0;
    const developingPct = total ? (developing / total) * 100 : 0;
    const notStartedPct = Math.max(0, 100 - completePct - developingPct);
    return `<div class="unit-progress-row">
      <div class="unit-progress-label"><strong>${escapeHtml(areaById(unit.areaId)?.shortTitle || unit.areaId.toUpperCase())} · ${escapeHtml(unit.title)}</strong><span>${complete}/${total || 0} activity places complete</span></div>
      <div class="stacked-progress" role="img" aria-label="${Math.round(completePct)}% complete, ${Math.round(developingPct)}% developing, ${Math.round(notStartedPct)}% not started">
        <span class="stack-complete" style="width:${completePct}%"></span>
        <span class="stack-developing" style="width:${developingPct}%"></span>
        <span class="stack-not-started" style="width:${notStartedPct}%"></span>
      </div>
      <div class="unit-progress-values"><span>${Math.round(completePct)}% complete</span><span>${Math.round(developingPct)}% developing</span><span>${notStarted} not started</span></div>
    </div>`;
  }).join("") || `<p class="help-text">No required unit data yet.</p>`;
}

function renderTeacherAttentionList(classItem) {
  const signals = [];
  classItem.members.forEach(member => {
    const metrics = pupilMetrics(classItem, member);
    pupilFlags(classItem, metrics).forEach(flag => signals.push({ member, metrics, ...flag }));
  });
  const order = { danger: 0, warning: 1, success: 2 };
  signals.sort((a, b) => order[a.type] - order[b.type] || a.member.displayName.localeCompare(b.member.displayName));
  elements.teacherAttentionCount.textContent = `${signals.length} signal${signals.length === 1 ? "" : "s"}`;
  elements.teacherAttentionList.innerHTML = signals.length ? signals.map((signal, index) => `
    <article class="attention-item attention-${signal.type}">
      <div><span class="attention-badge">${signal.type === "danger" ? "!" : signal.type === "success" ? "★" : "●"}</span></div>
      <div><strong>${escapeHtml(signal.member.displayName)} — ${escapeHtml(signal.title)}</strong><p>${escapeHtml(signal.detail)}</p><span class="help-text">${escapeHtml(signal.action)}</span></div>
      <button type="button" class="secondary small" data-attention-index="${index}">Open profile</button>
    </article>`).join("") : `<div class="empty-insight-state"><strong>No current signals</strong><p>Set an expected progress point to activate pace and extension flags. Mastery signals appear as pupil evidence grows.</p></div>`;
  elements.teacherAttentionList.querySelectorAll("[data-attention-index]").forEach(button => {
    button.addEventListener("click", () => showPupilInsight(classItem, signals[Number(button.dataset.attentionIndex)].member));
  });
}

function pupilUnitProgressMarkup(classItem, member) {
  const required = requiredActivities();
  return UNITS.filter(unit => required.some(activity => activity.unitId === unit.id)).map(unit => {
    const activities = required.filter(activity => activity.unitId === unit.id);
    const complete = activities.filter(activity => classItem.progress.some(item => item.userId === member.userId && item.taskId === activity.id && item.completed)).length;
    const percent = activities.length ? Math.round((complete / activities.length) * 100) : 0;
    return `<div class="pupil-unit-row"><div><strong>${escapeHtml(unit.title)}</strong><span>${complete}/${activities.length}</span></div><div class="pupil-unit-bar"><span style="width:${percent}%"></span></div></div>`;
  }).join("");
}

function showPupilInsight(classItem, member) {
  const metrics = pupilMetrics(classItem, member);
  const flags = pupilFlags(classItem, metrics);
  const recentProgress = [...metrics.progress].sort((a, b) => progressLastMillis(b) - progressLastMillis(a)).slice(0, 10);
  const weakest = metrics.mastery.filter(item => item.status === "red" || item.status === "orange").sort((a, b) => a.rate - b.rate).slice(0, 6);

  elements.pupilInsightPanel.classList.remove("hidden");
  elements.pupilInsightPanel.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Pupil insight profile</p>
        <h4>${escapeHtml(member.displayName)}</h4>
        <p class="help-text">${escapeHtml(member.username || "")} · Last active ${metrics.lastActive ? humanDate(new Date(metrics.lastActive)) : "Never"}</p>
      </div>
      <button id="closePupilInsightButton" type="button" class="secondary small">Close profile</button>
    </div>
    <div class="stats-grid compact pupil-profile-stats">
      ${statCard(metrics.completed, "Required complete")}
      ${statCard(`${metrics.firstTimeRate}%`, "First-time success")}
      ${statCard(metrics.recentReviews.length ? `${metrics.recall}%` : "—", "Recent spaced recall")}
      ${statCard(metrics.games.length ? `${metrics.gameAccuracy}%` : "—", "Games Lab accuracy")}
      ${statCard(metrics.counts.red, "Red skills")}
    </div>
    <div class="profile-flag-row">${flags.length ? flags.map(flag => `<span class="profile-flag flag-${flag.type}" title="${escapeHtml(flag.detail)}">${escapeHtml(flag.title)}</span>`).join("") : `<span class="profile-flag flag-neutral">No current automatic flags</span>`}</div>
    <div class="pupil-profile-grid">
      <section class="profile-section">
        <h5>Progress through units</h5>
        ${pupilUnitProgressMarkup(classItem, member)}
      </section>
      <section class="profile-section">
        <h5>Recent spaced retrieval</h5>
        <div class="review-dot-row large">${metrics.recentReviews.length ? metrics.recentReviews.slice(0, 16).map(item => `<span class="review-dot ${item.correct ? "correct" : "incorrect"}" title="${escapeHtml(SKILL_LABELS[(item.skillIds || [])[0]] || (item.skillIds || [])[0] || "Review")} · ${humanDate(item.reviewedAt)}">${item.correct ? "✓" : "×"}</span>`).join("") : `<span class="help-text">No spaced-learning evidence yet.</span>`}</div>
        <p class="help-text">Most recent first. This shows retention, not just task completion.</p>
        <h5>Games Lab</h5>
        <div class="game-profile-summary">${metrics.games.length ? `<strong>${metrics.games.filter(item => item.correct).length}/${metrics.games.length}</strong><span>successful game responses</span><span>${metrics.games.filter(item => item.game === "debug-rescue").length} debug · ${metrics.games.filter(item => item.game === "logic-showdown").length} logic</span>` : `<span class="help-text">No Games Lab evidence yet.</span>`}</div>
        <h5>Skills to inspect</h5>
        <div class="profile-skill-list">${weakest.length ? weakest.map(item => `<button type="button" class="profile-skill-button mastery-${item.status}" data-profile-skill="${escapeHtml(item.skillId)}"><span>${escapeHtml(SKILL_LABELS[item.skillId] || item.skillId)}</span><strong>${masterySymbol(item.status, item.evidenceCount)} ${item.evidenceCount >= 2 ? `${item.rate}%` : item.label}</strong></button>`).join("") : `<p class="help-text">No red or orange skill evidence.</p>`}</div>
      </section>
    </div>
    <section class="profile-section">
      <h5>Recent pathway activity</h5>
      <div class="table-wrap"><table><thead><tr><th>Activity</th><th>Status</th><th>Attempts</th><th>Last active</th></tr></thead><tbody>${recentProgress.length ? recentProgress.map(item => {
        const activity = allActivities.find(candidate => candidate.id === item.taskId);
        const status = progressStatus(item);
        return `<tr><td>${escapeHtml(activity?.title || item.taskTitle || item.taskId)}</td><td><span class="status-pill ${status.className}">${escapeHtml(status.label)}</span></td><td>${Number(item.attempts || 0)}</td><td>${humanDate(item.lastActivityAt || item.lastAttemptAt || item.lastSavedAt)}</td></tr>`;
      }).join("") : `<tr><td colspan="4">No activity yet.</td></tr>`}</tbody></table></div>
    </section>`;
  elements.pupilInsightPanel.querySelector("#closePupilInsightButton").addEventListener("click", () => {
    elements.pupilInsightPanel.classList.add("hidden");
    elements.pupilInsightPanel.innerHTML = "";
  });
  elements.pupilInsightPanel.querySelectorAll("[data-profile-skill]").forEach(button => {
    button.addEventListener("click", () => showSkillInsight(classItem, member, button.dataset.profileSkill));
  });
  elements.pupilInsightPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTeacherInsights(classItem) {
  renderClassUnitProgress(classItem);
  renderTeacherAttentionList(classItem);
  renderMasteryHeatmap(classItem);
  elements.pupilInsightPanel.classList.add("hidden");
  elements.pupilInsightPanel.innerHTML = "";
  elements.skillInsightViewer.classList.add("hidden");
  elements.skillInsightViewer.innerHTML = "";
}

function showClassDetails(classItem) {
  const coreIds = new Set(requiredActivities().map(activity => activity.id));
  const coreCount = coreIds.size;
  elements.classDetailTitle.textContent = classItem.name;
  elements.classDetailMeta.textContent = `Class code: ${classItem.joinCode}`;
  populateClassFocusControls(classItem);
  elements.classExpectedCompletedInput.max = coreCount;
  elements.classExpectedCompletedInput.value = Number(classItem.expectedCompletedActivities || 0);
  elements.heatmapScopeInput.value = "focus";
  elements.heatmapPupilFilterInput.value = "all";
  elements.heatmapScopeInput.onchange = () => renderMasteryHeatmap(classItem);
  elements.heatmapPupilFilterInput.onchange = () => renderMasteryHeatmap(classItem);

  const completedCount = classItem.progress.filter(item => item.completed && coreIds.has(item.taskId)).length;
  const activeCount = classItem.progress.filter(item => !item.completed).length;
  const attempts = classItem.progress.reduce((sum, item) => sum + (item.attempts || 0), 0);
  const paperResponseTotal = classItem.progress.filter(item => item.activityType === "official-paper" && (item.writtenResponse !== undefined || item.submitted)).length;
  elements.classStats.innerHTML = [
    statCard(classItem.members.length, "Pupils"),
    statCard(completedCount, "Core activities completed"),
    statCard(activeCount, "Activities in progress"),
    statCard(paperResponseTotal, "Paper answers")
  ].join("");

  elements.pupilStatsBody.innerHTML = "";
  classItem.members
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .forEach(member => {
      const pupilProgress = classItem.progress.filter(item => item.userId === member.userId);
      const pupilCompleted = pupilProgress.filter(item => item.completed && coreIds.has(item.taskId)).length;
      const pupilInProgress = pupilProgress.filter(item => !item.completed).length;
      const pupilAttempts = pupilProgress.reduce((sum, item) => sum + (item.attempts || 0), 0);
      const pupilFirstTime = pupilProgress.filter(item => item.firstAttemptCorrect === true && coreIds.has(item.taskId)).length;
      const firstTimeRate = pupilCompleted ? Math.round((pupilFirstTime / pupilCompleted) * 100) : 0;
      const last = pupilProgress
        .map(item => item.lastActivityAt || item.lastAttemptAt || item.lastSavedAt)
        .filter(Boolean)
        .sort((a, b) => (b.seconds || 0) - (a.seconds || 0))[0];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><button type="button" class="text-button pupil-name-button"><strong>${escapeHtml(member.displayName)}</strong></button><br><span class="help-text">${escapeHtml(member.username)}</span></td>
        <td>${pupilCompleted}/${coreCount}</td>
        <td>${pupilInProgress}</td>
        <td>${pupilAttempts}</td>
        <td>${firstTimeRate}%</td>
        <td>${humanDate(last)}</td>
        <td><button type="button" class="secondary small open-pupil-profile">Open profile</button></td>`;
      row.querySelector(".pupil-name-button").addEventListener("click", () => showPupilInsight(classItem, member));
      row.querySelector(".open-pupil-profile").addEventListener("click", () => showPupilInsight(classItem, member));
      elements.pupilStatsBody.appendChild(row);
    });

  if (!classItem.members.length) {
    elements.pupilStatsBody.innerHTML = `<tr><td colspan="7">No pupils have joined yet.</td></tr>`;
  }

  renderTeacherInsights(classItem);
  renderSpacedClassOverview(classItem);
  renderGamesClassOverview(classItem);
  renderPaperResponses(classItem);
  renderPeerReviewOverview(classItem);
  elements.classDetailPanel.classList.remove("hidden");
  elements.classDetailPanel.scrollIntoView({ behavior: "smooth" });
}

elements.closeClassDetailButton.addEventListener("click", () => {
  elements.classDetailPanel.classList.add("hidden");
});

elements.saveClassFocusButton.addEventListener("click", async () => {
  if (!activeTeacherClass) return;
  elements.classFocusSaveStatus.textContent = "Saving…";
  try {
    const data = {
      reviewFocusAreaId: elements.classFocusAreaInput.value,
      reviewFocusUnitId: elements.classFocusUnitInput.value,
      expectedCompletedActivities: Math.max(0, Number(elements.classExpectedCompletedInput.value || 0)),
      reviewFocusUpdatedAt: serverTimestamp()
    };
    await setDoc(doc(db, "classes", activeTeacherClass.id), data, { merge: true });
    Object.assign(activeTeacherClass, data);
    elements.classFocusSaveStatus.textContent = "Focus and expected progress saved";
    renderTeacherInsights(activeTeacherClass);
  } catch (error) {
    console.error(error);
    elements.classFocusSaveStatus.textContent = "Could not save focus";
  }
});

async function loadUserPreferences() {
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  try {
    const snapshot = await getDoc(doc(db, "preferences", auth.currentUser.uid));
    if (snapshot.exists() && ["standard", "friendly"].includes(snapshot.data().errorMode)) {
      errorViewMode = snapshot.data().errorMode;
    } else {
      errorViewMode = "standard";
    }
  } catch (error) {
    console.warn("Preference could not be loaded:", error);
    errorViewMode = "standard";
  }
  applyErrorViewMode();
}

async function saveErrorPreference() {
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  await setDoc(doc(db, "preferences", auth.currentUser.uid), {
    userId: auth.currentUser.uid,
    errorMode: errorViewMode,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function applyErrorViewMode() {
  const standard = errorViewMode === "standard";
  elements.standardErrorTab.classList.toggle("active", standard);
  elements.friendlyErrorTab.classList.toggle("active", !standard);
  elements.standardErrorBox.classList.toggle("hidden", !standard);
  elements.friendlyErrorBox.classList.toggle("hidden", standard);
}

async function setErrorViewMode(mode) {
  if (!["standard", "friendly"].includes(mode)) return;
  errorViewMode = mode;
  applyErrorViewMode();
  try {
    await saveErrorPreference();
  } catch (error) {
    console.warn("Preference could not be saved:", error);
  }
}

elements.standardErrorTab.addEventListener("click", () => setErrorViewMode("standard"));
elements.friendlyErrorTab.addEventListener("click", () => setErrorViewMode("friendly"));

async function loadPupilProgress() {
  const snapshot = await getDocs(query(
    collection(db, "progress"),
    where("userId", "==", auth.currentUser.uid)
  ));
  const progressItems = snapshot.docs
    .map(item => item.data())
    .filter(item => item.classId === currentProfile.classId);
  currentProgress = new Map(progressItems.map(item => [item.taskId, item]));
  progressItems.forEach(item => {
    const replacementId = LEGACY_ACTIVITY_MAP[item.taskId];
    if (replacementId && !currentProgress.has(replacementId)) {
      currentProgress.set(replacementId, { ...item, taskId: replacementId, activityId: replacementId });
    }
  });
}

function activityStatus(activity) {
  const progress = currentProgress.get(activity.id);
  if (progress?.completed) return { label: "Complete", className: "complete", icon: "✓" };
  if (!isActivityUnlocked(activity)) return { label: "Locked", className: "", icon: "🔒" };
  if (progress?.submitted) return { label: "Submitted", className: "working", icon: "↗" };
  if ((progress?.attempts || 0) > 0) return { label: "Needs work", className: "needs-work", icon: "!" };
  if (progress?.lastCode !== undefined || progress?.writtenResponse !== undefined || progress?.status === "in_progress") {
    return { label: "In progress", className: "working", icon: "◐" };
  }
  return { label: "Ready", className: "", icon: "○" };
}

function activitiesForUnit(unitId) {
  return visibleActivities().filter(activity => activity.unitId === unitId);
}

function renderAreaCards() {
  elements.areaCards.innerHTML = "";
  AREAS.sort((a, b) => a.order - b.order).forEach(area => {
    const card = document.createElement("article");
    card.className = `area-card ${area.active ? "active-area" : "coming-soon"}`;
    card.innerHTML = `
      <span class="area-badge">${escapeHtml(area.shortTitle)}</span>
      <h3>${escapeHtml(area.title)}</h3>
      <p>${escapeHtml(area.description)}</p>
      <div class="card-actions">
        <button ${area.active ? "" : "disabled"}>${area.active ? "Open pathway" : "Coming later"}</button>
      </div>`;
    if (area.active) {
      card.querySelector("button").addEventListener("click", () => {
        selectedAreaId = area.id;
        elements.pathwayPanel.classList.remove("hidden");
        renderPathway();
        elements.pathwayPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    elements.areaCards.appendChild(card);
  });
}

function renderPathway() {
  const units = UNITS.filter(unit => unit.areaId === selectedAreaId).sort((a, b) => a.order - b.order);
  const core = requiredActivities();
  const firstIncomplete = core.find(activity => !currentProgress.get(activity.id)?.completed && isActivityUnlocked(activity));
  elements.continueActivityButton.disabled = !firstIncomplete;
  elements.continueActivityButton.textContent = firstIncomplete ? `Continue: ${firstIncomplete.title}` : "Pathway complete";
  elements.continueActivityButton.onclick = firstIncomplete ? () => openActivity(firstIncomplete) : null;

  elements.unitList.innerHTML = "";
  units.forEach(unit => {
    const activities = activitiesForUnit(unit.id);
    const unitCore = activities.filter(activity => activity.required !== false);
    const completed = unitCore.filter(activity => currentProgress.get(activity.id)?.completed).length;
    const percent = unitCore.length ? Math.round((completed / unitCore.length) * 100) : 0;
    const unitCard = document.createElement("section");
    unitCard.className = "unit-card";
    unitCard.innerHTML = `
      <div class="unit-header">
        <span class="unit-number">${unit.number}</span>
        <div class="unit-title">
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(unit.description)}</p>
        </div>
        <div class="unit-progress">
          <span>${completed}/${unitCore.length} required</span>
          <div class="progress-bar"><span style="width:${percent}%"></span></div>
        </div>
      </div>
      <ol class="activity-list"></ol>`;
    const list = unitCard.querySelector(".activity-list");
    activities.forEach((activity, index) => {
      const status = activityStatus(activity);
      const unlocked = isActivityUnlocked(activity);
      const progress = currentProgress.get(activity.id);
      const row = document.createElement("li");
      row.className = `activity-row ${unlocked ? "" : "locked"} ${activity.required === false ? "optional" : ""}`;
      const attempts = progress?.attempts ? ` · ${progress.attempts} attempt${progress.attempts === 1 ? "" : "s"}` : "";
      row.innerHTML = `
        <span class="activity-status-icon" aria-hidden="true">${status.icon}</span>
        <div class="activity-main">
          <h4>${unit.number}.${index + 1} ${escapeHtml(activity.title)}</h4>
          <p>${escapeHtml(activityTypeLabel(activity))} · about ${escapeHtml(activity.estimatedMinutes || 5)} minutes${attempts}</p>
          <div class="activity-meta">
            <span class="activity-chip">${escapeHtml(activityTypeLabel(activity))}</span>
            ${activity.required === false ? '<span class="activity-chip optional">Optional exam practice</span>' : ""}
            ${activity.custom ? '<span class="activity-chip">Teacher added</span>' : ""}
          </div>
        </div>
        <button ${unlocked ? "" : "disabled"}>${progress?.completed ? "Open again" : progress ? "Continue" : activity.type === "official-paper" ? "Open paper task" : "Start"}</button>`;
      row.querySelector("button").addEventListener("click", () => openActivity(activity));
      list.appendChild(row);
    });
    elements.unitList.appendChild(unitCard);
  });
}

function reviewStateDocumentId(skillId) {
  return `${auth.currentUser.uid}__${skillId}`;
}

function questionStatDocumentId(questionId) {
  return `${currentProfile.classId}__${questionId}`;
}

function eligibleSpacedQuestions() {
  const completedUnits = new Set(
    [...currentProgress.entries()]
      .filter(([, progress]) => progress.completed)
      .map(([activityId]) => allActivities.find(item => item.id === activityId)?.unitId)
      .filter(Boolean)
  );
  return SPACED_QUESTIONS
    .map(question => ({ ...question, areaId: spacedQuestionAreaId(question) }))
    .filter(question => completedUnits.has(question.unitId));
}

async function loadSpacedLearningData() {
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  const [stateSnapshot, attemptSnapshot, statSnapshot] = await Promise.all([
    getDocs(query(collection(db, "reviewStates"), where("userId", "==", auth.currentUser.uid))),
    getDocs(query(collection(db, "reviewAttempts"), where("userId", "==", auth.currentUser.uid))),
    getDocs(query(collection(db, "reviewQuestionStats"), where("classId", "==", currentProfile.classId)))
  ]);
  currentReviewStates = new Map(stateSnapshot.docs.map(item => [item.data().skillId, item.data()]));
  currentReviewAttempts = attemptSnapshot.docs.map(item => item.data()).filter(item => item.classId === currentProfile.classId);
  currentClassQuestionStats = new Map(statSnapshot.docs.map(item => [item.data().questionId, item.data()]));
}

function questionStage(question) {
  const states = (question.skills || []).map(skill => currentReviewStates.get(skill)).filter(Boolean);
  if (!states.length) return 0;
  return Math.min(...states.map(state => Number(state.stage || 0)));
}

function questionNextReview(question) {
  const states = (question.skills || []).map(skill => currentReviewStates.get(skill)).filter(Boolean);
  if (!states.length) return 0;
  return Math.min(...states.map(state => timestampMillis(state.nextReviewAt) || 0));
}

function questionLastReviewed(question) {
  const attempts = currentReviewAttempts.filter(item => item.questionId === question.id);
  return Math.max(0, ...attempts.map(item => timestampMillis(item.reviewedAt)));
}

function classQuestionRate(question) {
  const stat = currentClassQuestionStats.get(question.id);
  return stat?.attempts ? Number(stat.correct || 0) / Number(stat.attempts) : 1;
}

function ownSkillAccuracy() {
  const map = new Map();
  currentReviewAttempts.forEach(attempt => {
    (attempt.skillIds || []).forEach(skillId => {
      const row = map.get(skillId) || { attempts: 0, correct: 0 };
      row.attempts += 1;
      if (attempt.correct) row.correct += 1;
      map.set(skillId, row);
    });
  });
  return map;
}

function personalQuestionSort(items) {
  const now = Date.now();
  const skillAccuracy = ownSkillAccuracy();
  const weakness = question => {
    const rows = (question.skills || []).map(skill => skillAccuracy.get(skill)).filter(Boolean);
    if (!rows.length) return 0.5;
    return 1 - Math.min(...rows.map(row => row.attempts ? row.correct / row.attempts : 0.5));
  };
  return [...items].sort((a, b) => {
    const dueA = questionNextReview(a);
    const dueB = questionNextReview(b);
    const isDueA = dueA > 0 && dueA <= now ? 0 : 1;
    const isDueB = dueB > 0 && dueB <= now ? 0 : 1;
    return isDueA - isDueB || weakness(b) - weakness(a) || questionStage(a) - questionStage(b) || questionLastReviewed(a) - questionLastReviewed(b);
  });
}

function selectSpacedQuestions() {
  const pool = eligibleSpacedQuestions();
  const context = currentLearningContext();
  const now = Date.now();
  const selected = [];
  const used = new Set();
  const add = (question, reason) => {
    if (!question || used.has(question.id) || selected.length >= 10) return false;
    used.add(question.id);
    selected.push({ question, reason });
    return true;
  };
  const addFrom = (items, limit, reason) => {
    let count = 0;
    personalQuestionSort(items).forEach(question => {
      if (count < limit && add(question, typeof reason === "function" ? reason(question) : reason)) count += 1;
    });
  };

  const currentUnit = context.unitId ? pool.filter(question => question.unitId === context.unitId) : [];
  const currentArea = pool.filter(question => question.areaId === context.areaId && question.unitId !== context.unitId);
  const otherAreas = pool.filter(question => question.areaId !== context.areaId);
  const due = pool.filter(question => questionNextReview(question) > 0 && questionNextReview(question) <= now);

  // The intended mix is mainly current learning, with earlier and interleaved material.
  addFrom(currentUnit.length ? currentUnit : pool.filter(question => question.areaId === context.areaId), 5, "current_topic");
  const representationQuestions = pool.filter(question => question.formatGroup === "design-representation");
  addFrom(representationQuestions, 1, "design_representation");
  addFrom(currentArea, 2, question => questionNextReview(question) > 0 && questionNextReview(question) <= now ? "due_review" : "earlier_learning");
  addFrom(otherAreas, 2, question => questionNextReview(question) > 0 && questionNextReview(question) <= now ? "due_review" : "interleaved_area");

  const skillAccuracy = ownSkillAccuracy();
  const weak = pool.filter(question => (question.skills || []).some(skill => {
    const row = skillAccuracy.get(skill);
    return row?.attempts && (row.correct / row.attempts) < 0.7;
  }));
  addFrom(weak, 1, "needs_practice");
  addFrom(due, 10, "due_review");

  const classMisconceptions = pool
    .filter(question => Number(currentClassQuestionStats.get(question.id)?.attempts || 0) >= 3)
    .sort((a, b) => classQuestionRate(a) - classQuestionRate(b));
  addFrom(classMisconceptions, 1, "class_misconception");

  const masteredOld = pool.filter(question => questionStage(question) >= 3);
  addFrom(masteredOld, 1, "long_term");
  const unseen = pool.filter(question => !currentReviewAttempts.some(item => item.questionId === question.id));
  addFrom(unseen, 10, "new_retrieval");
  addFrom(pool, 10, "earlier_learning");
  return selected.slice(0, 10);
}

function eligibleReviewSkillIds() {
  return new Set(eligibleSpacedQuestions().flatMap(question => question.skills || []));
}

function spacedScheduleInfo() {
  const eligibleSkills = eligibleReviewSkillIds();
  const states = [...currentReviewStates.values()].filter(state => eligibleSkills.has(state.skillId));
  const now = Date.now();
  if (!states.length) return { due: 0, next: 0, initial: true };
  const due = states.filter(state => timestampMillis(state.nextReviewAt) <= now).length;
  const future = states.map(state => timestampMillis(state.nextReviewAt)).filter(value => value > now).sort((a, b) => a - b);
  return { due, next: future[0] || 0, initial: false };
}

function formatCountdown(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function updateSpacedCountdown() {
  if (!elements.spacedCountdownText) return;
  const info = spacedScheduleInfo();
  if (info.initial) {
    elements.spacedCountdownText.textContent = "Your first spaced-learning session is ready now.";
    return;
  }
  if (info.due > 0) {
    elements.spacedCountdownText.textContent = `${info.due} skill${info.due === 1 ? " is" : "s are"} due for review now.`;
    return;
  }
  if (info.next) {
    elements.spacedCountdownText.textContent = `Next scheduled review in ${formatCountdown(info.next - Date.now())}. Extra practice is available now.`;
    return;
  }
  elements.spacedCountdownText.textContent = "No scheduled reviews are waiting. Extra mixed practice is available.";
}

function renderSpacedPracticeCard() {
  const info = spacedScheduleInfo();
  const eligible = eligibleSpacedQuestions().length;
  const studiedAreas = new Set(eligibleSpacedQuestions().map(question => question.areaId));
  elements.spacedPracticeDescription.textContent = info.due
    ? "Your session will prioritise due skills, then interleave current and earlier course areas."
    : "You can practise early. The session mainly focuses on your current topic and interleaves earlier modules you have studied.";
  elements.spacedPracticeMeta.innerHTML = `<span class="activity-chip">${Math.min(10, eligible)} main questions</span><span class="activity-chip">${studiedAreas.size} course area${studiedAreas.size === 1 ? "" : "s"}</span><span class="activity-chip">Personalised</span>`;
  elements.startSpacedPracticeButton.textContent = info.due || info.initial ? "Start my spaced practice" : "Start extra practice";
  elements.startSpacedPracticeButton.disabled = eligible === 0;
  if (spacedCountdownTimer !== null) clearInterval(spacedCountdownTimer);
  updateSpacedCountdown();
  spacedCountdownTimer = setInterval(updateSpacedCountdown, 1000);
}

function updateReviewStateData(old, skillId, correct, confidence) {
  const oldStage = Number(old?.stage || 0);
  let stage;
  let days;
  if (!correct) {
    stage = Math.max(0, oldStage - 1);
    days = 1;
  } else if (Number(confidence) === 1) {
    stage = Math.max(1, oldStage);
    days = 2;
  } else {
    stage = Math.min(SPACED_INTERVAL_DAYS.length - 1, oldStage + 1);
    days = SPACED_INTERVAL_DAYS[stage];
  }
  const nextReviewAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return {
    userId: auth.currentUser.uid,
    classId: currentProfile.classId,
    skillId,
    stage,
    nextReviewAt,
    lastReviewedAt: serverTimestamp(),
    correctCount: Number(old?.correctCount || 0) + (correct ? 1 : 0),
    incorrectCount: Number(old?.incorrectCount || 0) + (correct ? 0 : 1),
    consecutiveCorrect: correct ? Number(old?.consecutiveCorrect || 0) + 1 : 0,
    lastCorrect: correct,
    updatedAt: serverTimestamp()
  };
}

async function saveSpacedAnswer(question, selectedAnswer, confidence, correct, retry) {
  const responseSeconds = Math.max(1, Math.round((Date.now() - spacedQuestionStartedAt) / 1000));
  const attemptRef = doc(collection(db, "reviewAttempts"));
  const batch = writeBatch(db);
  batch.set(attemptRef, {
    userId: auth.currentUser.uid,
    classId: currentProfile.classId,
    questionId: question.id,
    areaId: spacedQuestionAreaId(question),
    unitId: question.unitId,
    moduleTitle: spacedQuestionModuleLabel(question),
    skillIds: question.skills || [],
    selectedAnswer,
    correct,
    confidence: Number(confidence),
    responseTimeSeconds: responseSeconds,
    retry: Boolean(retry),
    reviewedAt: serverTimestamp()
  });
  (question.skills || []).forEach(skillId => {
    const old = currentReviewStates.get(skillId) || {};
    const data = updateReviewStateData(old, skillId, correct, confidence);
    batch.set(doc(db, "reviewStates", reviewStateDocumentId(skillId)), data, { merge: Boolean(currentReviewStates.has(skillId)) });
    currentReviewStates.set(skillId, { ...old, ...data });
  });
  await batch.commit();

  const statRef = doc(db, "reviewQuestionStats", questionStatDocumentId(question.id));
  let classStatisticSaved = false;
  try {
    await runTransaction(db, async transaction => {
      const snapshot = await transaction.get(statRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        transaction.update(statRef, {
          attempts: Number(data.attempts || 0) + 1,
          correct: Number(data.correct || 0) + (correct ? 1 : 0),
          updatedAt: serverTimestamp()
        });
      } else {
        transaction.set(statRef, {
          classId: currentProfile.classId,
          questionId: question.id,
          attempts: 1,
          correct: correct ? 1 : 0,
          updatedAt: serverTimestamp()
        });
      }
    });
    classStatisticSaved = true;
  } catch (error) {
    // The pupil's personal attempt and review schedule were already saved above.
    // A class-level anonymous statistic must never stop the pupil continuing.
    console.warn("Class question statistic could not be updated:", error);
  }

  const localAttempt = {
    questionId: question.id,
    skillIds: question.skills || [],
    correct,
    confidence: Number(confidence),
    retry: Boolean(retry),
    reviewedAt: new Date()
  };
  currentReviewAttempts.push(localAttempt);

  if (classStatisticSaved) {
    const oldStat = currentClassQuestionStats.get(question.id) || { attempts: 0, correct: 0 };
    currentClassQuestionStats.set(question.id, {
      ...oldStat,
      attempts: Number(oldStat.attempts || 0) + 1,
      correct: Number(oldStat.correct || 0) + (correct ? 1 : 0)
    });
  }
  return localAttempt;
}

function resetSpacedSessionView() {
  elements.spacedIntroPanel.classList.remove("hidden");
  elements.spacedQuestionPanel.classList.add("hidden");
  elements.spacedSummaryPanel.classList.add("hidden");
  elements.spacedSummaryPanel.innerHTML = "";
  elements.spacedSessionProgress.textContent = "Ready";
  elements.spacedSessionTitle.textContent = "Your mixed retrieval session";
  spacedSession = null;
}

function renderSpacedQuestion() {
  const item = spacedSession?.queue[spacedSession.index];
  if (!item) return finishSpacedSession();
  const question = item.question;
  const area = areaById(spacedQuestionAreaId(question));
  const mainNumber = item.retry ? "Quick retry" : `Question ${Math.min(spacedSession.mainAnswered + 1, spacedSession.mainTarget)} of ${spacedSession.mainTarget}`;
  elements.spacedSessionProgress.textContent = mainNumber;
  elements.spacedQuestionMeta.innerHTML = `<span class="area-badge area-${escapeHtml(area.id)}">${escapeHtml(area.shortTitle)}</span><span class="activity-chip">${escapeHtml(spacedQuestionModuleLabel(question))}</span><span class="activity-chip reason-chip">${escapeHtml(item.retry ? "Quick retry" : (SPACED_REASON_LABELS[item.reason] || "Personalised review"))}</span>`;
  elements.spacedQuestionPrompt.textContent = question.prompt;
  elements.spacedQuestionOptions.innerHTML = question.options.map((option, index) => `<label class="option-label"><input type="radio" name="spaced-answer" value="${index}"> <span>${escapeHtml(option)}</span></label>`).join("");
  if (question.diagramHtml) {
    elements.spacedQuestionCode.classList.remove("hidden");
    elements.spacedQuestionCode.innerHTML = `<div class="spaced-diagram">${question.diagramHtml}</div>`;
  } else if (question.codeSnippet) {
    const displayCode = String(question.codeSnippet).replace(/\\n/g, "\n");
    elements.spacedQuestionCode.classList.remove("hidden");
    elements.spacedQuestionCode.innerHTML = `<pre class="lesson-code">${escapeHtml(displayCode)}</pre>`;
  } else {
    elements.spacedQuestionCode.classList.add("hidden");
    elements.spacedQuestionCode.innerHTML = "";
  }
  elements.spacedConfidenceInput.value = "2";
  elements.submitSpacedAnswerButton.disabled = false;
  elements.submitSpacedAnswerButton.classList.remove("hidden");
  elements.nextSpacedQuestionButton.classList.add("hidden");
  elements.spacedQuestionFeedback.className = "feedback hidden";
  elements.spacedQuestionFeedback.textContent = "";
  spacedQuestionStartedAt = Date.now();
}

async function submitSpacedAnswer() {
  const item = spacedSession?.queue[spacedSession.index];
  if (!item || item.answered) return;
  const selected = elements.spacedQuestionOptions.querySelector('input[name="spaced-answer"]:checked');
  if (!selected) {
    elements.spacedQuestionFeedback.textContent = "Choose an answer before checking.";
    elements.spacedQuestionFeedback.className = "feedback error";
    return;
  }
  elements.submitSpacedAnswerButton.disabled = true;
  const answer = Number(selected.value);
  const confidence = Number(elements.spacedConfidenceInput.value || 2);
  const correct = answer === Number(item.question.answer);
  try {
    await saveSpacedAnswer(item.question, answer, confidence, correct, item.retry);
    item.answered = true;
    item.correct = correct;
    item.selectedAnswer = answer;
    if (item.retry) spacedSession.retryAnswered += 1;
    else {
      spacedSession.mainAnswered += 1;
      if (correct) spacedSession.mainCorrect += 1;
      const areaId = spacedQuestionAreaId(item.question);
      const row = spacedSession.areaResults[areaId] || { questions: 0, correct: 0 };
      row.questions += 1;
      if (correct) row.correct += 1;
      spacedSession.areaResults[areaId] = row;
    }
    if (!correct && !item.retry && !spacedSession.retryQuestionIds.has(item.question.id)) {
      spacedSession.retryQuestionIds.add(item.question.id);
      const insertAt = Math.min(spacedSession.queue.length, spacedSession.index + 4);
      spacedSession.queue.splice(insertAt, 0, { question: item.question, reason: "due_review", retry: true, answered: false });
    }
    elements.spacedQuestionFeedback.innerHTML = correct
      ? `<strong>Correct.</strong> ${escapeHtml(item.question.explanation)}`
      : `<strong>Not yet.</strong> The correct answer is <strong>${escapeHtml(item.question.options[item.question.answer])}</strong>. ${escapeHtml(item.question.explanation)}${item.retry ? "" : " This skill will return in a quick retry and an earlier future review."}`;
    elements.spacedQuestionFeedback.className = `feedback ${correct ? "success" : "error"}`;
    elements.submitSpacedAnswerButton.classList.add("hidden");
    elements.nextSpacedQuestionButton.classList.remove("hidden");
    elements.nextSpacedQuestionButton.textContent = spacedSession.index >= spacedSession.queue.length - 1 ? "Finish session" : "Next question";
  } catch (error) {
    console.error(error);
    elements.submitSpacedAnswerButton.disabled = false;
    elements.spacedQuestionFeedback.textContent = error.message || "The answer could not be saved.";
    elements.spacedQuestionFeedback.className = "feedback error";
  }
}

async function finishSpacedSession() {
  const percentage = spacedSession.mainTarget ? Math.round((spacedSession.mainCorrect / spacedSession.mainTarget) * 100) : 0;
  const skillRows = [...currentReviewStates.values()].sort((a, b) => Number(a.stage || 0) - Number(b.stage || 0));
  const reviewSoon = skillRows.filter(item => timestampMillis(item.nextReviewAt) <= Date.now() + 4 * 24 * 60 * 60 * 1000).slice(0, 5);
  const secure = skillRows.filter(item => Number(item.stage || 0) >= 3).slice(0, 5);
  try {
    await setDoc(doc(collection(db, "reviewSessions")), {
      userId: auth.currentUser.uid,
      classId: currentProfile.classId,
      mainQuestions: spacedSession.mainTarget,
      correct: spacedSession.mainCorrect,
      retryQuestions: spacedSession.retryAnswered,
      percentage,
      areaResults: spacedSession.areaResults,
      completedAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("Session summary could not be saved:", error);
  }
  elements.spacedQuestionPanel.classList.add("hidden");
  elements.spacedSummaryPanel.classList.remove("hidden");
  elements.spacedSessionProgress.textContent = `${spacedSession.mainCorrect}/${spacedSession.mainTarget}`;
  elements.spacedSummaryPanel.innerHTML = `
    <div class="spaced-result-hero"><span class="spaced-result-score">${percentage}%</span><div><h3>Spaced practice complete</h3><p>${spacedSession.mainCorrect}/${spacedSession.mainTarget} main questions correct${spacedSession.retryAnswered ? ` · ${spacedSession.retryAnswered} quick retr${spacedSession.retryAnswered === 1 ? "y" : "ies"}` : ""}</p></div></div>
    <div class="area-result-grid">${Object.entries(spacedSession.areaResults).map(([areaId, row]) => { const area = areaById(areaId); return `<div class="area-result-card"><span class="area-badge area-${escapeHtml(area.id)}">${escapeHtml(area.shortTitle)}</span><strong>${row.correct}/${row.questions}</strong><span>correct</span></div>`; }).join("")}</div>
    <div class="spaced-summary-grid">
      <section><h4>Secure or strengthening</h4>${secure.length ? `<ul>${secure.map(item => `<li>${escapeHtml(SKILL_LABELS[item.skillId] || item.skillId)}</li>`).join("")}</ul>` : "<p>Keep reviewing to build secure long-term recall.</p>"}</section>
      <section><h4>Review soon</h4>${reviewSoon.length ? `<ul>${reviewSoon.map(item => `<li>${escapeHtml(SKILL_LABELS[item.skillId] || item.skillId)}</li>`).join("")}</ul>` : "<p>No urgent reviews are due.</p>"}</section>
    </div>
    <div class="activity-actions"><button id="returnFromSpacedSummaryButton" type="button">Return to dashboard</button><button id="anotherSpacedSessionButton" type="button" class="secondary">Build another test</button></div>`;
  elements.spacedSummaryPanel.querySelector("#returnFromSpacedSummaryButton").addEventListener("click", async () => {
    showView("pupilView");
    await loadPupilDashboard();
  });
  elements.spacedSummaryPanel.querySelector("#anotherSpacedSessionButton").addEventListener("click", async () => {
    await loadSpacedLearningData();
    startSpacedSession();
  });
}

function startSpacedSession() {
  const selected = selectSpacedQuestions();
  if (!selected.length) {
    showMessage("Complete at least one learning activity before starting spaced practice.", "error");
    return;
  }
  spacedSession = {
    queue: selected.map(item => ({ question: item.question, reason: item.reason, retry: false, answered: false })),
    index: 0,
    mainTarget: selected.length,
    mainAnswered: 0,
    mainCorrect: 0,
    retryAnswered: 0,
    retryQuestionIds: new Set(),
    areaResults: {}
  };
  elements.spacedIntroPanel.classList.add("hidden");
  elements.spacedSummaryPanel.classList.add("hidden");
  elements.spacedQuestionPanel.classList.remove("hidden");
  renderSpacedQuestion();
}

async function loadPupilDashboard() {
  await loadPupilCustomActivities();
  await loadPupilProgress();
  try {
    const classSnapshot = await getDoc(doc(db, "classes", currentProfile.classId));
    currentClassSettings = classSnapshot.exists() ? { id: classSnapshot.id, ...classSnapshot.data() } : {};
  } catch (error) {
    console.warn("Class review focus could not be loaded:", error);
    currentClassSettings = {};
  }
  await loadSpacedLearningData();
  await loadPupilGameAttempts();
  currentTask = null;
  currentActivity = null;
  resetOfficialResponseWorkspace();
  clearScheduledAutoSave();
  stopTracePlayback();
  elements.pupilWelcome.textContent = `Hello, ${currentProfile.displayName}`;
  elements.pupilClassLabel.textContent = currentProfile.className;

  const coreIds = new Set(requiredActivities().map(activity => activity.id));
  const completed = [...currentProgress.entries()].filter(([id, item]) => item.completed && coreIds.has(id)).length;
  const inProgress = [...currentProgress.entries()].filter(([id, item]) => coreIds.has(id) && !item.completed).length;
  const attempts = [...currentProgress.values()].reduce((sum, item) => sum + (item.attempts || 0), 0);
  const coreCount = coreIds.size;
  const percent = coreCount ? Math.round((completed / coreCount) * 100) : 0;
  elements.pupilProgressBadge.textContent = `${completed}/${coreCount} required complete`;
  elements.topicSummary.innerHTML = [
    statCard(`${percent}%`, "Python pathway"),
    statCard(completed, "Required completed"),
    statCard(inProgress, "Started but incomplete"),
    statCard(attempts, "Attempts")
  ].join("");

  renderSpacedPracticeCard();
  renderGamesLabCard();
  await loadOrClaimPeerReview();
  renderAreaCards();
  elements.pathwayPanel.classList.remove("hidden");
  renderPathway();
}

elements.startSpacedPracticeButton.addEventListener("click", async () => {
  clearMessage();
  resetSpacedSessionView();
  showView("spacedView");
});

elements.beginSpacedSessionButton.addEventListener("click", startSpacedSession);
elements.submitSpacedAnswerButton.addEventListener("click", submitSpacedAnswer);
elements.nextSpacedQuestionButton.addEventListener("click", () => {
  if (!spacedSession) return;
  spacedSession.index += 1;
  if (spacedSession.index >= spacedSession.queue.length) void finishSpacedSession();
  else renderSpacedQuestion();
});
elements.backFromSpacedButton.addEventListener("click", async () => {
  showView("pupilView");
  await loadPupilDashboard();
});

function openActivity(activity) {
  if (!isActivityUnlocked(activity)) {
    showMessage("Complete the previous required activity first.", "error");
    return;
  }
  currentActivity = activity;
  if (["code", "debug", "visualiser"].includes(activity.type)) {
    openTask(activity);
  } else {
    renderGenericActivity(activity);
  }
}

function baseGenericProgressData(activity, old = {}) {
  return {
    classId: currentProfile.classId,
    userId: auth.currentUser.uid,
    taskId: activity.id,
    activityId: activity.id,
    taskTitle: activity.title,
    activityTitle: activity.title,
    activityType: activity.type,
    unitId: activity.unitId,
    areaId: activity.areaId,
    topic: unitById(activity.unitId)?.title || activity.topic || "",
    completed: Boolean(old.completed),
    attempts: old.attempts || 0,
    incorrectAttempts: old.incorrectAttempts || 0,
    hintsUsed: old.hintsUsed || 0,
    firstAttemptCorrect: Boolean(old.firstAttemptCorrect),
    visualiserUses: old.visualiserUses || 0,
    errorCounts: old.errorCounts || {}
  };
}

async function saveGenericProgress(activity, updates = {}, { countAttempt = false, correct = false } = {}) {
  const progressRef = doc(db, "progress", progressDocumentId(activity.id));
  const old = currentProgress.get(activity.id) || {};
  const attempts = countAttempt ? (old.attempts || 0) + 1 : (old.attempts || 0);
  const completed = Boolean(old.completed || updates.completed || correct);
  const data = {
    ...baseGenericProgressData(activity, old),
    ...updates,
    completed,
    status: completed ? "complete" : (countAttempt ? "needs_work" : "in_progress"),
    attempts,
    incorrectAttempts: (old.incorrectAttempts || 0) + (countAttempt && !correct ? 1 : 0),
    firstAttemptCorrect: countAttempt && (old.attempts || 0) === 0 ? Boolean(correct) : Boolean(old.firstAttemptCorrect),
    lastActivityAt: serverTimestamp(),
    lastSavedAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(activity.id) });
  currentProgress.set(activity.id, { ...old, ...data });
  return data;
}

function setGenericFeedback(text, type = "info") {
  elements.activityFeedback.textContent = text;
  elements.activityFeedback.className = `feedback ${type}`;
}

function setGenericStatus(activity) {
  const status = activityStatus(activity);
  elements.activityStatus.textContent = status.label;
  elements.activityStatus.className = `status-pill ${status.className}`;
}

function renderRelatedPractice(activity, targetElement) {
  const skills = new Set(activity.skills || []);
  const related = visibleActivities()
    .filter(item => item.type === "official-paper" && item.id !== activity.id)
    .map(item => ({ item, score: (item.skills || []).filter(skill => skills.has(skill)).length }))
    .filter(result => result.score > 0 && isActivityUnlocked(result.item))
    .sort((a, b) => b.score - a.score || Number(a.item.order) - Number(b.item.order))
    .slice(0, 2)
    .map(result => result.item);

  if (!related.length) {
    targetElement.classList.add("hidden");
    targetElement.innerHTML = "";
    return;
  }
  targetElement.classList.remove("hidden");
  targetElement.innerHTML = `<h3>Related official-paper practice</h3><p>These official questions use skills you have practised.</p><div class="related-grid"></div>`;
  const grid = targetElement.querySelector(".related-grid");
  related.forEach(item => {
    const card = document.createElement("article");
    card.className = "related-item";
    card.innerHTML = `<h4>${escapeHtml(item.year || "")} ${escapeHtml(item.questionReference || item.title)}</h4><p>${escapeHtml(item.pageReference || "Open the official paper")}</p><button type="button">Open activity</button>`;
    card.querySelector("button").addEventListener("click", () => openActivity(item));
    grid.appendChild(card);
  });
}

function checkpointMarkup(checkpoint, prefix = "checkpoint") {
  if (!checkpoint?.prompt || !Array.isArray(checkpoint.options) || checkpoint.options.length < 2) return "";
  return `<div class="activity-question"><fieldset class="question-block"><legend>${escapeHtml(checkpoint.prompt)}</legend>${checkpoint.options.map((option, index) => `
    <label class="option-label"><input type="radio" name="${prefix}" value="${index}"> <span>${escapeHtml(option)}</span></label>`).join("")}</fieldset><button id="checkCheckpointButton" type="button">Check answer</button></div>`;
}


function clearOfficialResponseAutoSave() {
  if (officialResponseAutoSaveTimer !== null) {
    clearTimeout(officialResponseAutoSaveTimer);
    officialResponseAutoSaveTimer = null;
  }
}

function resetOfficialResponseWorkspace() {
  clearOfficialResponseAutoSave();
  officialResponseDirty = false;
  officialResponseSaving = false;
  activeOfficialResponseInput = null;
  activeOfficialSaveStatus = null;
}

function setOfficialResponseSaveStatus(text, mode = "saved") {
  if (!activeOfficialSaveStatus) return;
  activeOfficialSaveStatus.textContent = text;
  activeOfficialSaveStatus.className = `save-status ${mode}`;
}

async function saveOfficialResponseDraft(activity, { silent = false, automatic = false } = {}) {
  if (
    !activity
    || activity.type !== "official-paper"
    || !activeOfficialResponseInput
    || officialResponseSaving
    || currentProfile?.role !== "student"
  ) return;

  officialResponseSaving = true;
  clearOfficialResponseAutoSave();
  setOfficialResponseSaveStatus(automatic ? "Autosaving…" : "Saving…", "saving");
  try {
    await saveGenericProgress(activity, {
      writtenResponse: activeOfficialResponseInput.value,
      responseDraftSaved: true
    });
    officialResponseDirty = false;
    setOfficialResponseSaveStatus(automatic ? "Autosaved" : "Answer saved", "saved");
    setGenericStatus(activity);
    if (!silent) setGenericFeedback("Your answer has been saved. It has not been submitted yet.", "success");
  } catch (error) {
    console.error("Official-paper answer save failed:", error);
    setOfficialResponseSaveStatus("Save failed", "error");
    if (!silent) setGenericFeedback(error.message || "Your answer could not be saved.", "error");
  } finally {
    officialResponseSaving = false;
  }
}

function scheduleOfficialResponseAutoSave(activity) {
  officialResponseDirty = true;
  setOfficialResponseSaveStatus("Unsaved changes", "unsaved");
  clearOfficialResponseAutoSave();
  officialResponseAutoSaveTimer = setTimeout(() => {
    officialResponseAutoSaveTimer = null;
    if (officialResponseDirty) void saveOfficialResponseDraft(activity, { silent: true, automatic: true });
  }, 5000);
}

function peerReviewDocRef(reviewId) {
  return doc(db, "classes", currentProfile.classId, "peerReviews", reviewId);
}

function peerReviewCollection() {
  return collection(db, "classes", currentProfile.classId, "peerReviews");
}

function peerTokens(text) {
  return String(text || "").replaceAll("**", "").match(/\s+|[\p{L}\p{N}_']+|[^\s]/gu) || [];
}

function peerTokenMarkup(text, selectedIndexes = [], mode = "green") {
  const selected = new Set((selectedIndexes || []).map(Number));
  return peerTokens(text).map((token, index) => {
    if (/^\s+$/.test(token)) return escapeHtml(token);
    const chosen = selected.has(index) ? ` selected ${mode}` : "";
    return `<button type="button" class="highlight-token${chosen}" data-token-index="${index}">${escapeHtml(token)}</button>`;
  }).join("");
}

function highlightedPeerText(text, selectedIndexes = [], mode = "green") {
  const selected = new Set((selectedIndexes || []).map(Number));
  return peerTokens(text).map((token, index) => {
    if (/^\s+$/.test(token)) return escapeHtml(token);
    return selected.has(index) ? `<mark class="peer-mark-${mode}">${escapeHtml(token)}</mark>` : escapeHtml(token);
  }).join("");
}

async function requestAnonymousPeerReview(activity, selfMark, reflection) {
  const progress = currentProgress.get(activity.id) || {};
  if (progress.peerReviewId) return progress.peerReviewId;
  const response = (progress.originalSubmission || progress.writtenResponse || activeOfficialResponseInput?.value || "").trim();
  if (!response) throw new Error("Submit an answer before requesting peer marking.");
  const reviewRef = doc(peerReviewCollection());
  const data = {
    classId: currentProfile.classId,
    authorId: auth.currentUser.uid,
    activityId: activity.id,
    activityTitle: activity.title,
    questionReference: activity.questionReference || "",
    areaId: activity.areaId || "sdd",
    answerText: response,
    modelAnswer: activity.modelAnswer || "",
    markingPoints: activity.markingPoints || [],
    maxMarks: Math.max(1, Number(activity.marks || 1)),
    selfAssessedMark: Number(selfMark || 0),
    reflection: reflection || "",
    reviewerId: "",
    status: "queued",
    createdAt: serverTimestamp()
  };
  await setDoc(reviewRef, data);
  await saveGenericProgress(activity, {
    peerReviewId: reviewRef.id,
    peerReviewStatus: "queued",
    selfAssessedMark: Number(selfMark || 0),
    reflection: reflection || "",
    selfReviewCompleted: true
  });
  return reviewRef.id;
}

async function loadOwnPeerReview(activity, progress) {
  if (!progress?.peerReviewId) return null;
  try {
    const snapshot = await getDoc(peerReviewDocRef(progress.peerReviewId));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch (error) {
    console.warn("Peer review could not be loaded:", error);
    return null;
  }
}

async function finalisePeerReview(activity, review, finalMark, decision) {
  await setDoc(peerReviewDocRef(review.id), {
    status: "finalised",
    finalMark: Number(finalMark),
    authorDecision: decision,
    finalisedAt: serverTimestamp()
  }, { merge: true });
  await saveGenericProgress(activity, {
    completed: true,
    peerReviewStatus: "finalised",
    peerSuggestedMark: Number(review.peerSuggestedMark || 0),
    finalSelfMark: Number(finalMark),
    peerDecision: decision,
    peerReviewCompletedAt: serverTimestamp()
  }, { correct: true });
}

async function renderOwnPeerReviewPanel(activity, progress, container) {
  if (!container) return;
  const review = await loadOwnPeerReview(activity, progress);
  if (!review) {
    container.innerHTML = "";
    return;
  }
  if (["queued", "assigned"].includes(review.status)) {
    container.innerHTML = `<div class="peer-status-panel"><strong>Anonymous peer check requested</strong><p>${review.status === "assigned" ? "A classmate is checking your answer now." : "Waiting for an eligible classmate who has already attempted this question."}</p></div>`;
    return;
  }
  container.innerHTML = `<section class="peer-result-panel">
    <p class="eyebrow">Anonymous peer check</p>
    <h4>Peer suggested mark: ${Number(review.peerSuggestedMark || 0)}/${Number(review.maxMarks || 1)}</h4>
    <div class="peer-review-grid">
      <div><h5>Evidence awarded in your answer</h5><div class="response-text">${highlightedPeerText(review.answerText, review.greenTokenIndexes, "green")}</div></div>
      <div><h5>Model content your peer thought was missing</h5><div class="response-text">${highlightedPeerText(review.modelAnswer, review.redTokenIndexes, "red")}</div></div>
    </div>
    ${(review.missedPointIndexes || []).length ? `<h5>Marking points flagged as missing</h5><ul>${review.missedPointIndexes.map(index => `<li>${escapeHtml((review.markingPoints || [])[index] || "Marking point")}</li>`).join("")}</ul>` : ""}
    ${review.status === "finalised" ? `<p><strong>Final self-reviewed mark:</strong> ${Number(review.finalMark || 0)}/${Number(review.maxMarks || 1)}</p>` : `<div class="activity-actions"><button id="acceptPeerMarkButton" type="button">Accept peer mark</button><button id="reviewFinalMarkButton" type="button" class="secondary">Review my final mark</button></div><div id="finalMarkChooser" class="hidden"></div>`}
  </section>`;
  if (review.status === "finalised") return;
  container.querySelector("#acceptPeerMarkButton").addEventListener("click", async () => {
    await finalisePeerReview(activity, review, review.peerSuggestedMark, "accepted");
    setGenericFeedback("Peer mark accepted and your final self-review has been saved.", "success");
    setGenericStatus(activity);
    await renderOwnPeerReviewPanel(activity, currentProgress.get(activity.id), container);
  });
  container.querySelector("#reviewFinalMarkButton").addEventListener("click", () => {
    const chooser = container.querySelector("#finalMarkChooser");
    chooser.classList.remove("hidden");
    chooser.innerHTML = `<label>My final mark <select id="finalPeerMarkInput">${Array.from({ length: Number(review.maxMarks || 1) + 1 }, (_, value) => `<option value="${value}" ${value === Number(review.peerSuggestedMark || 0) ? "selected" : ""}>${value}/${review.maxMarks}</option>`).join("")}</select></label><button id="saveFinalPeerMarkButton" type="button">Save final mark</button>`;
    chooser.querySelector("#saveFinalPeerMarkButton").addEventListener("click", async () => {
      const finalMark = Number(chooser.querySelector("#finalPeerMarkInput").value);
      await finalisePeerReview(activity, review, finalMark, "reviewed");
      setGenericFeedback("Your final mark has been saved after reviewing the peer check.", "success");
      setGenericStatus(activity);
      await renderOwnPeerReviewPanel(activity, currentProgress.get(activity.id), container);
    });
  });
}

async function loadOrClaimPeerReview() {
  activePeerReview = null;
  elements.peerMarkingCard.classList.add("hidden");
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  try {
    const assigned = await getDocs(query(peerReviewCollection(), where("reviewerId", "==", auth.currentUser.uid)));
    const existing = assigned.docs.map(item => ({ id: item.id, ...item.data() })).find(item => item.status === "assigned");
    if (existing) activePeerReview = existing;
    if (!activePeerReview) {
      const attemptedActivityIds = [...currentProgress.entries()].filter(([, progress]) => progress.submitted === true).map(([id]) => id);
      for (const activityId of attemptedActivityIds) {
        const queued = await getDocs(query(peerReviewCollection(), where("status", "==", "queued"), where("activityId", "==", activityId)));
        const candidateDoc = queued.docs.find(item => item.data().authorId !== auth.currentUser.uid);
        if (!candidateDoc) continue;
        const claimed = await runTransaction(db, async transaction => {
          const fresh = await transaction.get(candidateDoc.ref);
          if (!fresh.exists() || fresh.data().status !== "queued" || fresh.data().authorId === auth.currentUser.uid) return null;
          transaction.update(candidateDoc.ref, { reviewerId: auth.currentUser.uid, status: "assigned", assignedAt: serverTimestamp() });
          return { id: candidateDoc.id, ...fresh.data(), reviewerId: auth.currentUser.uid, status: "assigned" };
        });
        if (claimed) { activePeerReview = claimed; break; }
      }
    }
    if (activePeerReview) {
      elements.peerMarkingDescription.textContent = `${activePeerReview.activityTitle || "Official-paper answer"} · ${activePeerReview.maxMarks || 1} mark${Number(activePeerReview.maxMarks || 1) === 1 ? "" : "s"}`;
      elements.peerMarkingCard.classList.remove("hidden");
    }
  } catch (error) {
    console.warn("Peer review queue could not be checked:", error);
  }
}

function renderPeerReviewWorkspace() {
  if (!activePeerReview) return;
  peerGreenTokens = new Set((activePeerReview.greenTokenIndexes || []).map(Number));
  peerRedTokens = new Set((activePeerReview.redTokenIndexes || []).map(Number));
  elements.peerReviewTitle.textContent = activePeerReview.activityTitle || "Mark a classmate's answer";
  elements.peerReviewQuestionMeta.textContent = `${activePeerReview.questionReference || "Official-paper question"} · ${activePeerReview.maxMarks || 1} mark${Number(activePeerReview.maxMarks || 1) === 1 ? "" : "s"}`;
  elements.peerAnswerTokens.innerHTML = peerTokenMarkup(activePeerReview.answerText, [...peerGreenTokens], "green");
  elements.peerModelTokens.innerHTML = peerTokenMarkup(activePeerReview.modelAnswer, [...peerRedTokens], "red");
  elements.peerMarkingPoints.innerHTML = (activePeerReview.markingPoints || []).map((point, index) => `<label class="form-check peer-point"><input type="checkbox" class="peer-missed-point" value="${index}"> <span>${escapeHtml(point)}</span></label>`).join("") || `<p>No separate marking points were supplied.</p>`;
  elements.peerSuggestedMarkInput.innerHTML = Array.from({ length: Number(activePeerReview.maxMarks || 1) + 1 }, (_, value) => `<option value="${value}">${value}/${activePeerReview.maxMarks || 1}</option>`).join("");
  elements.peerReviewFeedback.className = "feedback hidden";
  const bindTokens = (container, set, mode) => {
    container.querySelectorAll(".highlight-token").forEach(button => button.addEventListener("click", () => {
      const index = Number(button.dataset.tokenIndex);
      if (set.has(index)) set.delete(index); else set.add(index);
      button.classList.toggle("selected", set.has(index));
      button.classList.toggle(mode, set.has(index));
    }));
  };
  bindTokens(elements.peerAnswerTokens, peerGreenTokens, "green");
  bindTokens(elements.peerModelTokens, peerRedTokens, "red");
  showView("peerReviewView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function officialModelPanelMarkup(activity, progress = {}) {
  const marks = Math.max(1, Number(activity.marks || 1));
  const options = Array.from({ length: marks + 1 }, (_, value) =>
    `<option value="${value}" ${Number(progress.selfAssessedMark) === value ? "selected" : ""}>${value}/${marks}</option>`
  ).join("");
  return `
    <div class="model-answer-panel">
      <p class="eyebrow">Teacher model answer</p>
      <h3>Compare your answer</h3>
      <p class="model-answer-note">Notice how the model answer uses specific details from the question where possible.</p>
      <div class="model-answer-text">${formatTeacherText(activity.modelAnswer || "Your teacher has not added a model answer yet.")}</div>
      ${(activity.markingPoints || []).length ? `<h4>Points that could gain marks</h4><ul>${activity.markingPoints.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : ""}
      <div class="self-review-grid">
        <label>My estimated mark
          <select id="officialSelfMarkInput">${options}</select>
        </label>
        <label class="wide-field">What did I miss or what will I improve next time?
          <textarea id="officialReflectionInput" class="small-textarea" placeholder="For example: I needed to explain why the data type was suitable.">${escapeHtml(progress.reflection || "")}</textarea>
        </label>
      </div>
      <div class="activity-actions peer-choice-actions">
        <button id="completeOfficialReviewButton" type="button" class="save-button">Save my self-review</button>
        <button id="requestPeerReviewButton" type="button">Request anonymous peer check</button>
        <button id="completeWithoutPeerButton" type="button" class="secondary">Complete without peer check</button>
      </div>
      <div id="ownPeerReviewPanel"></div>
    </div>`;
}

function specificAnswerGuidanceMarkup() {
  return `
    <aside class="answer-quality-tip">
      <strong>Make your answer secure</strong>
      <ol>
        <li>State the computing point clearly.</li>
        <li>Use exact details from the question where possible — for example variable names, values, field names or code.</li>
        <li>Explain how or why your point answers the question.</li>
      </ol>
      <p>Examples strengthen an answer, although they are not always a separate mark.</p>
    </aside>`;
}

function renderGenericActivity(activity) {
  resetOfficialResponseWorkspace();
  currentTask = null;
  currentActivity = activity;
  clearMessage();
  const unit = unitById(activity.unitId);
  elements.activityTypeLabel.textContent = activityTypeLabel(activity);
  elements.activityTitle.textContent = activity.title;
  elements.activityUnitLabel.textContent = `Unit ${unit?.number || ""}: ${unit?.title || ""}`;
  elements.activityContent.innerHTML = "";
  elements.activityInteraction.innerHTML = "";
  elements.activityFeedback.className = "feedback hidden";
  elements.activityFeedback.textContent = "";
  setGenericStatus(activity);

  const progress = currentProgress.get(activity.id) || {};

  if (activity.type === "lesson" || activity.type === "video") {
    const embed = videoEmbedUrl(activity.videoUrl);
    elements.activityContent.innerHTML = `
      ${activity.description ? `<p>${escapeHtml(activity.description)}</p>` : ""}
      ${activity.videoUrl ? (embed
        ? `<iframe class="video-frame" src="${escapeHtml(embed)}" title="${escapeHtml(activity.videoTitle || activity.title)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
        : `<div class="video-placeholder"><p>This video opens on its hosting website.</p><a class="button-link" href="${escapeHtml(activity.videoUrl)}" target="_blank" rel="noopener">Open video explanation</a></div>`)
        : `<div class="video-placeholder"><strong>Video space ready</strong><p>Your teacher can add a video from the Content Manager. Use the explanation below for now.</p></div>`}
      <div class="instructions">${activity.contentHtml || ""}</div>`;
    if (activity.checkpoint) {
      elements.activityInteraction.innerHTML = checkpointMarkup(activity.checkpoint, `checkpoint-${activity.id}`);
      elements.activityInteraction.querySelector("#checkCheckpointButton").addEventListener("click", async () => {
        const selected = elements.activityInteraction.querySelector(`input[name="checkpoint-${CSS.escape(activity.id)}"]:checked`);
        if (!selected) return setGenericFeedback("Choose an answer first.", "error");
        const correct = Number(selected.value) === Number(activity.checkpoint.answer);
        await saveGenericProgress(activity, { checkpointAnswer: Number(selected.value) }, { countAttempt: true, correct });
        if (correct) {
          setGenericFeedback(`Correct. ${activity.checkpoint.explanation || "Activity complete."}`, "success");
          setGenericStatus(activity);
          renderRelatedPractice(activity, elements.activityRelatedPractice);
        } else {
          setGenericFeedback("Not yet. Review the explanation or video and try again.", "error");
        }
      });
    } else {
      elements.activityInteraction.innerHTML = `<div class="activity-actions"><button id="completeLessonButton" type="button">Mark as complete</button></div>`;
      elements.activityInteraction.querySelector("#completeLessonButton").addEventListener("click", async () => {
        await saveGenericProgress(activity, { completed: true }, { correct: true });
        setGenericFeedback("Lesson marked complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      });
    }
  } else if (activity.type === "quiz" || activity.type === "predict") {
    elements.activityContent.innerHTML = `${activity.codeSnippet ? `<pre class="lesson-code">${escapeHtml(activity.codeSnippet)}</pre>` : ""}`;
    elements.activityInteraction.innerHTML = (activity.questions || []).map((question, questionIndex) => `
      <fieldset class="question-block">
        <legend>${questionIndex + 1}. ${escapeHtml(question.prompt)}</legend>
        ${question.options.map((option, optionIndex) => `<label class="option-label"><input type="radio" name="question-${questionIndex}" value="${optionIndex}"> <span>${escapeHtml(option)}</span></label>`).join("")}
      </fieldset>`).join("") + `<button id="checkQuizButton" type="button">Check answers</button>`;
    elements.activityInteraction.querySelector("#checkQuizButton").addEventListener("click", async () => {
      const answers = [];
      let allAnswered = true;
      let correct = true;
      (activity.questions || []).forEach((question, questionIndex) => {
        const selected = elements.activityInteraction.querySelector(`input[name="question-${questionIndex}"]:checked`);
        if (!selected) { allAnswered = false; return; }
        answers.push(Number(selected.value));
        if (Number(selected.value) !== Number(question.answer)) correct = false;
      });
      if (!allAnswered) return setGenericFeedback("Answer every question before checking.", "error");
      await saveGenericProgress(activity, { quizAnswers: answers }, { countAttempt: true, correct });
      if (correct) {
        setGenericFeedback("All answers are correct. Activity complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      } else {
        const explanations = (activity.questions || []).map((question, index) => `${index + 1}. ${question.explanation || "Review this question."}`).join("\n");
        setGenericFeedback(`Not all answers are correct.\n\n${explanations}`, "error");
      }
    });
  } else if (activity.type === "exam-style") {
    elements.activityContent.innerHTML = activity.questionHtml || `<p>${escapeHtml(activity.description || "Complete the exam-style question.")}</p>`;
    elements.activityInteraction.innerHTML = `
      ${specificAnswerGuidanceMarkup()}
      <label>Your answer
        <textarea id="writtenResponseInput" class="written-response" placeholder="Write a precise answer. Use names, values or examples from the question where possible.">${escapeHtml(progress.writtenResponse || "")}</textarea>
      </label>
      <div class="activity-actions">
        <button id="saveWrittenResponseButton" type="button" class="save-button">Save progress</button>
        <button id="revealMarkingButton" type="button" class="secondary">Reveal marking points</button>
      </div>
      <div id="markingPointsPanel" class="marking-points hidden"></div>`;
    const responseInput = elements.activityInteraction.querySelector("#writtenResponseInput");
    elements.activityInteraction.querySelector("#saveWrittenResponseButton").addEventListener("click", async () => {
      await saveGenericProgress(activity, { writtenResponse: responseInput.value });
      setGenericFeedback("Your answer has been saved. This does not mark it complete.", "success");
      setGenericStatus(activity);
    });
    elements.activityInteraction.querySelector("#revealMarkingButton").addEventListener("click", async () => {
      if (!responseInput.value.trim()) return setGenericFeedback("Write an answer before revealing the marking points.", "error");
      await saveGenericProgress(activity, { writtenResponse: responseInput.value, markingPointsViewed: true });
      const panel = elements.activityInteraction.querySelector("#markingPointsPanel");
      panel.classList.remove("hidden");
      panel.innerHTML = `<h3>Marking points</h3><ul>${(activity.markingPoints || []).map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul>${activity.modelAnswer ? `<p><strong>Model answer:</strong> ${formatTeacherText(activity.modelAnswer)}</p>` : ""}<button id="selfMarkCompleteButton" type="button">I have checked my answer</button>`;
      panel.querySelector("#selfMarkCompleteButton").addEventListener("click", async () => {
        await saveGenericProgress(activity, { completed: true, writtenResponse: responseInput.value, selfMarked: true }, { correct: true });
        setGenericFeedback("Exam practice marked complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      });
    });
  } else if (activity.type === "official-paper") {
    const marks = Math.max(1, Number(activity.marks || 1));
    elements.activityContent.innerHTML = `
      <div class="official-paper-box">
        <h3>${escapeHtml(activity.year || "Official")} National 5 Computing Science</h3>
        <p><strong>${escapeHtml(activity.questionReference || activity.title)}</strong>${activity.pageReference ? ` · ${escapeHtml(activity.pageReference)}` : ""} · ${marks} mark${marks === 1 ? "" : "s"}</p>
        <p>${escapeHtml(activity.description || "Open the official paper and attempt the referenced question.")}</p>
        <p class="help-text">The question is not copied into this app. It opens on the official awarding-body website.</p>
        <div class="activity-actions">
          <a id="openOfficialPaperLink" class="button-link" href="${escapeHtml(activity.officialUrl)}" target="_blank" rel="noopener">Open official paper</a>
        </div>
      </div>`;

    elements.activityInteraction.innerHTML = `
      <section class="exam-answer-workspace">
        ${specificAnswerGuidanceMarkup()}
        <div class="workspace-heading">
          <div>
            <p class="eyebrow">My answer</p>
            <h3>Write your response</h3>
            <p class="help-text">Your work autosaves. Submit your answer before opening the teacher model answer.</p>
          </div>
          <span id="officialSaveStatus" class="save-status">${progress.writtenResponse !== undefined ? "Saved answer loaded" : "No unsaved changes"}</span>
        </div>
        <textarea id="officialResponseInput" class="written-response official-response" placeholder="Write a precise answer. Refer to exact names, values or code from the question where possible.">${escapeHtml(progress.writtenResponse || "")}</textarea>
        ${progress.originalSubmission ? `<div class="submission-note"><strong>First submission preserved.</strong> You may improve the working answer above, but your teacher can still see your original response.</div>` : ""}
        <div class="activity-actions">
          <button id="saveOfficialAnswerButton" type="button" class="save-button">Save answer</button>
          <button id="submitOfficialAnswerButton" type="button">${progress.submitted ? "Submit revised answer" : "Submit answer"}</button>
          <button id="showOfficialModelButton" type="button" class="secondary" ${progress.submitted ? "" : "disabled"}>Show teacher model answer</button>
        </div>
        <div id="officialModelPanel" class="marking-points ${progress.modelAnswerViewed ? "" : "hidden"}"></div>
      </section>`;

    activeOfficialResponseInput = elements.activityInteraction.querySelector("#officialResponseInput");
    activeOfficialSaveStatus = elements.activityInteraction.querySelector("#officialSaveStatus");
    const modelPanel = elements.activityInteraction.querySelector("#officialModelPanel");
    const showModelButton = elements.activityInteraction.querySelector("#showOfficialModelButton");

    const renderModelPanel = () => {
      const latest = currentProgress.get(activity.id) || progress;
      modelPanel.classList.remove("hidden");
      modelPanel.innerHTML = officialModelPanelMarkup(activity, latest);
      const selfMarkInput = modelPanel.querySelector("#officialSelfMarkInput");
      const reflectionInput = modelPanel.querySelector("#officialReflectionInput");
      const peerPanel = modelPanel.querySelector("#ownPeerReviewPanel");
      modelPanel.querySelector("#completeOfficialReviewButton").addEventListener("click", async () => {
        await saveGenericProgress(activity, {
          submitted: true,
          writtenResponse: activeOfficialResponseInput.value,
          selfAssessedMark: Number(selfMarkInput.value),
          reflection: reflectionInput.value,
          selfReviewCompleted: true,
          reviewedAt: serverTimestamp()
        });
        setGenericFeedback("Your self-review has been saved. You can now request an anonymous peer check or complete without one.", "success");
        setGenericStatus(activity);
      });
      modelPanel.querySelector("#requestPeerReviewButton").addEventListener("click", async () => {
        try {
          const reviewId = await requestAnonymousPeerReview(activity, Number(selfMarkInput.value), reflectionInput.value);
          setGenericFeedback("Anonymous peer check requested. It will be offered to an eligible classmate who has already attempted this question.", "success");
          await renderOwnPeerReviewPanel(activity, currentProgress.get(activity.id), peerPanel);
          modelPanel.querySelector("#requestPeerReviewButton").disabled = true;
          modelPanel.querySelector("#requestPeerReviewButton").textContent = "Peer check requested";
        } catch (error) {
          setGenericFeedback(error.message || "The peer check could not be requested.", "error");
        }
      });
      modelPanel.querySelector("#completeWithoutPeerButton").addEventListener("click", async () => {
        await saveGenericProgress(activity, {
          completed: true,
          submitted: true,
          writtenResponse: activeOfficialResponseInput.value,
          selfAssessedMark: Number(selfMarkInput.value),
          finalSelfMark: Number(selfMarkInput.value),
          reflection: reflectionInput.value,
          selfReviewCompleted: true,
          peerDecision: "not_requested",
          reviewedAt: serverTimestamp()
        }, { correct: true });
        setGenericFeedback("Self-review complete without a peer check.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      });
      if ((currentProgress.get(activity.id) || {}).peerReviewId) {
        modelPanel.querySelector("#requestPeerReviewButton").disabled = true;
        modelPanel.querySelector("#requestPeerReviewButton").textContent = "Peer check requested";
      }
      void renderOwnPeerReviewPanel(activity, currentProgress.get(activity.id) || latest, peerPanel);
    };

    if (progress.modelAnswerViewed) renderModelPanel();

    activeOfficialResponseInput.addEventListener("input", () => scheduleOfficialResponseAutoSave(activity));

    elements.activityContent.querySelector("#openOfficialPaperLink").addEventListener("click", async () => {
      try { await saveGenericProgress(activity, { paperOpened: true, paperOpenedAt: serverTimestamp() }); } catch (error) { console.warn(error); }
      setGenericStatus(activity);
    });

    elements.activityInteraction.querySelector("#saveOfficialAnswerButton").addEventListener("click", () => {
      void saveOfficialResponseDraft(activity);
    });

    elements.activityInteraction.querySelector("#submitOfficialAnswerButton").addEventListener("click", async () => {
      const response = activeOfficialResponseInput.value.trim();
      if (!response) return setGenericFeedback("Write an answer before submitting it.", "error");
      clearOfficialResponseAutoSave();
      const oldProgress = currentProgress.get(activity.id) || {};
      await saveGenericProgress(activity, {
        writtenResponse: activeOfficialResponseInput.value,
        submitted: true,
        originalSubmission: oldProgress.originalSubmission || activeOfficialResponseInput.value,
        submittedAt: oldProgress.submittedAt || serverTimestamp()
      });
      officialResponseDirty = false;
      setOfficialResponseSaveStatus("Submitted", "saved");
      showModelButton.disabled = false;
      showModelButton.textContent = "Show teacher model answer";
      setGenericFeedback("Answer submitted. The teacher model answer is now available.", "success");
      setGenericStatus(activity);
    });

    showModelButton.addEventListener("click", async () => {
      const latest = currentProgress.get(activity.id) || {};
      if (!latest.submitted) return setGenericFeedback("Submit your answer before opening the model answer.", "error");
      await saveGenericProgress(activity, {
        modelAnswerViewed: true,
        modelAnswerViewedAt: serverTimestamp(),
        writtenResponse: activeOfficialResponseInput.value
      });
      renderModelPanel();
      showModelButton.textContent = "Model answer opened";
      setGenericFeedback("Compare your answer with the model, then estimate your mark and record one improvement.", "info");
    });
  }

  renderRelatedPractice(activity, elements.activityRelatedPractice);
  showView("activityView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

elements.backFromActivityButton.addEventListener("click", async () => {
  if (currentActivity?.type === "official-paper" && officialResponseDirty) {
    try { await saveOfficialResponseDraft(currentActivity, { silent: true }); } catch (_) { /* continue */ }
  }
  resetOfficialResponseWorkspace();
  showView("pupilView");
  await loadPupilDashboard();
});

function clearTaskPanels() {
  elements.outputBox.textContent = "Press Run to test your program.";
  elements.feedbackBox.className = "feedback hidden";
  elements.feedbackBox.textContent = "";
  hideExecutionError();
  elements.visualiserPanel.classList.add("hidden");
  traceSteps = [];
  traceIndex = 0;
  stopTracePlayback();
}

function openTask(task) {
  currentTask = task;
  currentActivity = task;
  currentHintIndex = 0;
  visualiserCompletionSaving = false;
  clearScheduledAutoSave();
  const progress = currentProgress.get(task.id);
  const status = activityStatus(task);
  const unit = unitById(task.unitId);
  elements.challengeTopic.textContent = `${activityTypeLabel(task)} · Unit ${unit?.number || ""} ${unit?.title || task.topic || ""}`;
  elements.challengeTitle.textContent = task.title;
  elements.challengeInstructions.innerHTML = task.instructions;
  elements.expectedOutput.textContent = task.expectedOutput;
  elements.codeEditor.value = progress?.lastCode ?? task.starterCode;
  elements.challengeStatus.textContent = status.label;
  elements.challengeStatus.className = `status-pill ${status.className}`;
  if (Array.isArray(task.sampleInputs) && task.sampleInputs.length) {
    elements.sampleInputNote.textContent = `The Run and Visualise buttons will use this sample keyboard input: ${task.sampleInputs.join(", ")}. Check answer also uses hidden test values.`;
    elements.sampleInputNote.classList.remove("hidden");
  } else {
    elements.sampleInputNote.textContent = "";
    elements.sampleInputNote.classList.add("hidden");
  }
  codeIsDirty = false;
  setSaveStatus(progress ? "saved" : "idle", progress ? "Saved progress loaded" : "No unsaved changes");
  clearTaskPanels();
  renderRelatedPractice(task, elements.challengeRelatedPractice);
  showView("challengeView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

elements.backToTasksButton.addEventListener("click", async () => {
  if (currentTask && codeIsDirty) {
    try { await saveProgressDraft({ silent: true }); } catch (_) { /* continue */ }
  }
  stopTracePlayback();
  showView("pupilView");
  await loadPupilDashboard();
});

elements.resetButton.addEventListener("click", () => {
  if (!currentTask) return;
  elements.codeEditor.value = currentTask.starterCode;
  clearTaskPanels();
  markCodeDirty();
});

elements.hintButton.addEventListener("click", async () => {
  if (!currentTask) return;
  const hint = currentTask.hints[Math.min(currentHintIndex, currentTask.hints.length - 1)];
  currentHintIndex += 1;
  elements.feedbackBox.textContent = `Hint: ${hint}`;
  elements.feedbackBox.className = "feedback info";
  try {
    await saveHintUse();
  } catch (error) {
    console.error("Hint save failed:", error);
  }
});

elements.codeEditor.addEventListener("keydown", event => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = elements.codeEditor.selectionStart;
    const end = elements.codeEditor.selectionEnd;
    elements.codeEditor.value = elements.codeEditor.value.slice(0, start) + "    " + elements.codeEditor.value.slice(end);
    elements.codeEditor.selectionStart = elements.codeEditor.selectionEnd = start + 4;
    markCodeDirty();
  }
});

elements.codeEditor.addEventListener("input", markCodeDirty);

function clearScheduledAutoSave() {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
}

function setSaveStatus(state, text) {
  elements.saveStatus.className = `save-status ${state === "idle" ? "" : state}`;
  elements.saveStatus.textContent = text;
}

function markCodeDirty() {
  if (!currentTask || currentProfile?.role !== "student") return;
  codeIsDirty = true;
  setSaveStatus("unsaved", "Unsaved changes");
  clearScheduledAutoSave();
  autoSaveTimer = setTimeout(async () => {
    autoSaveTimer = null;
    if (!codeIsDirty) return;
    try {
      await saveProgressDraft({ silent: true, automatic: true });
    } catch (error) {
      console.error("Autosave failed:", error);
      setSaveStatus("error", "Autosave failed — use Save progress");
    }
  }, 5000);
}

function progressDocumentId(taskId) {
  return `${currentProfile.classId}_${auth.currentUser.uid}_${taskId}`;
}

function baseProgressData(task, old = {}) {
  return {
    classId: currentProfile.classId,
    userId: auth.currentUser.uid,
    taskId: task.id,
    activityId: task.id,
    taskTitle: task.title,
    activityTitle: task.title,
    activityType: task.type || "code",
    unitId: task.unitId || "",
    areaId: task.areaId || "sdd",
    topic: unitById(task.unitId)?.title || task.topic || "",
    completed: Boolean(old.completed),
    attempts: old.attempts || 0,
    incorrectAttempts: old.incorrectAttempts || 0,
    hintsUsed: old.hintsUsed || 0,
    firstAttemptCorrect: Boolean(old.firstAttemptCorrect),
    visualiserUses: old.visualiserUses || 0,
    errorCounts: old.errorCounts || {}
  };
}

async function saveProgressDraft({ silent = false, automatic = false } = {}) {
  if (!currentTask || !auth.currentUser || currentProfile?.role !== "student" || saveInProgress) return;
  saveInProgress = true;
  clearScheduledAutoSave();
  setSaveStatus("saving", automatic ? "Autosaving…" : "Saving…");
  elements.saveProgressButton.disabled = true;
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const data = {
    ...baseProgressData(currentTask, old),
    status: old.completed ? "complete" : (old.attempts || 0) > 0 ? "needs_work" : "in_progress",
    lastCode: elements.codeEditor.value,
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  try {
    await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
    currentProgress.set(currentTask.id, { ...old, ...data });
    codeIsDirty = false;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setSaveStatus("saved", `${automatic ? "Autosaved" : "Saved"} at ${time}`);
    if (!old.completed) {
      elements.challengeStatus.textContent = (old.attempts || 0) > 0 ? "Needs work" : "In progress";
      elements.challengeStatus.className = `status-pill ${(old.attempts || 0) > 0 ? "needs-work" : "working"}`;
    }
    if (!silent) {
      elements.feedbackBox.textContent = "Progress saved. This does not count as an attempt.";
      elements.feedbackBox.className = "feedback success";
    }
  } finally {
    saveInProgress = false;
    elements.saveProgressButton.disabled = false;
  }
}

elements.saveProgressButton.addEventListener("click", async () => {
  try {
    await saveProgressDraft();
  } catch (error) {
    console.error("Save progress failed:", error);
    const code = error.code ? ` [${error.code}]` : "";
    setSaveStatus("error", "Progress was not saved");
    elements.feedbackBox.textContent = `${error.message || "Progress could not be saved."}${code}`;
    elements.feedbackBox.className = "feedback error";
  }
});

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!pyodidePromise) {
    elements.pythonStatus.textContent = "Loading Python…";
    pyodidePromise = loadPyodide().then(instance => {
      pyodide = instance;
      elements.pythonStatus.textContent = "Python is ready.";
      return instance;
    }).catch(error => {
      pyodidePromise = null;
      elements.pythonStatus.textContent = "Python could not load.";
      throw error;
    });
  }
  return pyodidePromise;
}

async function runCode(code, inputs = []) {
  const python = await ensurePyodide();
  python.globals.set("student_code", code);
  python.globals.set("input_values_json", JSON.stringify((inputs || []).map(value => String(value))));
  const raw = await python.runPythonAsync(`
import io, sys, traceback, json
_buffer = io.StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout = _buffer
sys.stderr = _buffer
_error = None
_steps = {"count": 0}
_input_values = json.loads(input_values_json)
_input_index = {"value": 0}

def _safe_input(prompt=""):
    if prompt:
        print(str(prompt), end="")
    if _input_index["value"] >= len(_input_values):
        raise EOFError("No more test input values were supplied by the app.")
    value = str(_input_values[_input_index["value"]])
    _input_index["value"] += 1
    print(value)
    return value

def _guard(frame, event, arg):
    if frame.f_code.co_filename == "<student>" and event == "line":
        _steps["count"] += 1
        if _steps["count"] > 12000:
            raise RuntimeError("Stopped: too many steps (possible infinite loop).")
    return _guard

try:
    _compiled = compile(student_code, "<student>", "exec")
    sys.settrace(_guard)
    _env = {"__name__": "__main__", "input": _safe_input}
    exec(_compiled, _env, _env)
except BaseException:
    _error = traceback.format_exc()
finally:
    sys.settrace(None)
    sys.stdout, sys.stderr = _old_stdout, _old_stderr
json.dumps({"output": _buffer.getvalue(), "error": _error, "inputsUsed": _input_index["value"]})
  `);
  return JSON.parse(String(raw));
}

async function gradeCode(code, task, output) {
  const python = await ensurePyodide();
  python.globals.set("student_code", code);
  python.globals.set("requirements_json", JSON.stringify(task.requirements || {}));
  python.globals.set("expected_output", task.expectedOutput);
  python.globals.set("actual_output", output);

  const raw = await python.runPythonAsync(`
import ast, json
requirements = json.loads(requirements_json)
feedback = []
try:
    tree = ast.parse(student_code)
except SyntaxError as error:
    _result = json.dumps({"correct": False, "feedback": ["Syntax error on line " + str(error.lineno) + ": " + str(error.msg)]})
else:
    def literal(node):
        try:
            return ast.literal_eval(node)
        except Exception:
            return object()

    def assignment_found(name, value):
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                targets = [target.id for target in node.targets if isinstance(target, ast.Name)]
                if name in targets and literal(node.value) == value:
                    return True
        return False

    for name, value in requirements.get("assignments", {}).items():
        if not assignment_found(name, value):
            feedback.append("Create " + name + " and set it to " + repr(value) + ".")

    operation = requirements.get("binOperation")
    if operation:
        operator_class = getattr(ast, operation["operator"])
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.BinOp) and isinstance(node.op, operator_class):
                names = {child.id for child in ast.walk(node) if isinstance(child, ast.Name)}
                if set(operation.get("names", [])).issubset(names):
                    found = True
                    break
        if not found:
            feedback.append("Use the required variables in the calculation rather than printing a fixed answer.")

    required_names = set(requirements.get("requiredNamesInCalculation", []))
    required_ops = requirements.get("requiredOperators", [])
    if required_names or required_ops:
        calc_names = set()
        calc_ops = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.BinOp):
                calc_names.update(child.id for child in ast.walk(node) if isinstance(child, ast.Name))
                calc_ops.add(type(node.op).__name__)
        if not required_names.issubset(calc_names):
            feedback.append("Use all of the named variables in your calculation.")
        for operator_name in required_ops:
            if operator_name not in calc_ops:
                feedback.append("Your calculation needs a " + operator_name + " operation.")

    for node_name in requirements.get("requiredNodes", []):
        node_class = getattr(ast, node_name)
        if not any(isinstance(node, node_class) for node in ast.walk(tree)):
            feedback.append("Use a " + node_name.lower() + " statement as requested.")

    if_names = set(requirements.get("ifUsesNames", []))
    if if_names:
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.If):
                names = {child.id for child in ast.walk(node.test) if isinstance(child, ast.Name)}
                if if_names.issubset(names):
                    found = True
                    break
        if not found:
            feedback.append("Use the named variable in the if condition.")

    comparison = requirements.get("comparison")
    if comparison:
        op_class = getattr(ast, comparison["operator"])
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.Compare) and isinstance(node.left, ast.Name) and node.left.id == comparison["name"]:
                if node.ops and isinstance(node.ops[0], op_class) and node.comparators and literal(node.comparators[0]) == comparison["value"]:
                    found = True
                    break
        if not found:
            feedback.append("Check the variable, comparison operator and value in your condition.")

    range_args = requirements.get("rangeArgs")
    if range_args is not None:
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "range":
                if [literal(arg) for arg in node.args] == range_args:
                    found = True
                    break
        if not found:
            feedback.append("Use range(" + ", ".join(map(str, range_args)) + ").")

    iter_name = requirements.get("forIteratesName")
    if iter_name:
        found = any(isinstance(node, ast.For) and isinstance(node.iter, ast.Name) and node.iter.id == iter_name for node in ast.walk(tree))
        if not found:
            feedback.append("Traverse the " + iter_name + " array with your loop.")

    update_name = requirements.get("updatesVariable")
    if update_name:
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.AugAssign) and isinstance(node.target, ast.Name) and node.target.id == update_name and isinstance(node.op, ast.Add):
                found = True
            if isinstance(node, ast.Assign):
                targets = [target.id for target in node.targets if isinstance(target, ast.Name)]
                if update_name in targets and isinstance(node.value, ast.BinOp) and isinstance(node.value.op, ast.Add):
                    names = {child.id for child in ast.walk(node.value) if isinstance(child, ast.Name)}
                    if update_name in names:
                        found = True
        if not found:
            feedback.append("Update " + update_name + " inside the loop to create a running total.")

    def dotted_name(node):
        if isinstance(node, ast.Name):
            return node.id
        if isinstance(node, ast.Attribute):
            prefix = dotted_name(node.value)
            return (prefix + "." if prefix else "") + node.attr
        return ""

    required_calls = set(requirements.get("requiredCalls", []))
    required_dotted_calls = set(requirements.get("requiredDottedCalls", []))
    calls_found = []
    dotted_calls_found = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            full_name = dotted_name(node.func)
            if full_name:
                dotted_calls_found.append(full_name)
            if isinstance(node.func, ast.Name):
                calls_found.append(node.func.id)
    for call_name in required_calls:
        if call_name not in calls_found:
            feedback.append("Use " + call_name + "() as requested.")
    for call_name in required_dotted_calls:
        if call_name not in dotted_calls_found:
            feedback.append("Use " + call_name + "() as requested.")

    imports_found = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports_found.update(alias.name for alias in node.names)
        if isinstance(node, ast.ImportFrom) and node.module:
            imports_found.add(node.module)
    for module_name in requirements.get("requiredImports", []):
        if module_name not in imports_found:
            feedback.append("Import " + module_name + " before using it.")

    bool_ops_found = {type(node.op).__name__ for node in ast.walk(tree) if isinstance(node, ast.BoolOp)}
    for operator_name in requirements.get("requiredBoolOperators", []):
        if operator_name not in bool_ops_found:
            feedback.append("Use the logical operator " + operator_name.upper() + " in the condition.")

    unary_ops_found = {type(node.op).__name__ for node in ast.walk(tree) if isinstance(node, ast.UnaryOp)}
    for operator_name in requirements.get("requiredUnaryOperators", []):
        if operator_name not in unary_ops_found:
            feedback.append("Use " + operator_name.upper() + " as requested.")

    while_names = set(requirements.get("whileUsesNames", []))
    if while_names:
        while_ok = False
        for node in ast.walk(tree):
            if isinstance(node, ast.While):
                names = {child.id for child in ast.walk(node.test) if isinstance(child, ast.Name)}
                if while_names.issubset(names):
                    while_ok = True
                    break
        if not while_ok:
            feedback.append("Use the named control value in the while condition.")

    subscript_names = set(requirements.get("requiredSubscriptNames", []))
    if subscript_names:
        found_subscripts = {node.value.id for node in ast.walk(tree) if isinstance(node, ast.Subscript) and isinstance(node.value, ast.Name)}
        for name in subscript_names:
            if name not in found_subscripts:
                feedback.append("Access values from the " + name + " array using an index.")

    if requirements.get("requiredElif"):
        elif_found = any(isinstance(node, ast.If) and any(isinstance(child, ast.If) for child in node.orelse) for node in ast.walk(tree))
        if not elif_found:
            feedback.append("Use an elif branch as requested.")

    if requirements.get("requiredElse"):
        else_found = any(isinstance(node, ast.If) and node.orelse and not all(isinstance(child, ast.If) for child in node.orelse) for node in ast.walk(tree))
        if not else_found:
            feedback.append("Include an else branch as requested.")

    if requirements.get("requiredComments") and "#" not in student_code:
        feedback.append("Include internal commentary using # to label or explain sections of the program.")

    min_print_calls = int(requirements.get("minPrintCalls", 0) or 0)
    if min_print_calls and calls_found.count("print") < min_print_calls:
        feedback.append("Use at least " + str(min_print_calls) + " print() instructions.")

    required_strings = set(requirements.get("requiredStringLiterals", []))
    string_literals = {node.value for node in ast.walk(tree) if isinstance(node, ast.Constant) and isinstance(node.value, str)}
    for value in required_strings:
        if value not in string_literals:
            feedback.append("Include the required text " + repr(value) + " in your program.")

    required_print_names = set(requirements.get("requiredPrintNames", []))
    if required_print_names:
        printed_names = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "print":
                printed_names.update(child.id for child in ast.walk(node) if isinstance(child, ast.Name))
        for name in required_print_names:
            if name not in printed_names:
                feedback.append("Display the value stored in " + name + " rather than a fixed answer.")

    forbidden = set(requirements.get("forbiddenCalls", []))
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in forbidden:
            feedback.append("Do not use " + node.func.id + "() for this task.")

    if expected_output and actual_output.strip() != expected_output.strip():
        feedback.append("The output should be exactly: " + repr(expected_output) + ".")

    _result = json.dumps({"correct": len(feedback) == 0, "feedback": feedback})
_result
  `);
  return JSON.parse(String(raw));
}

async function runTaskTests(code, task) {
  const tests = Array.isArray(task.tests) && task.tests.length
    ? task.tests
    : [{ inputs: task.sampleInputs || [], expectedOutput: task.expectedOutput }];
  const failures = [];
  let firstExecution = null;
  for (let index = 0; index < tests.length; index += 1) {
    const test = tests[index];
    const execution = await runCode(code, test.inputs || []);
    if (!firstExecution) firstExecution = execution;
    if (execution.error) {
      return {
        correct: false,
        feedback: [`Test ${index + 1} stopped with a Python error.`],
        firstExecution,
        error: execution.error
      };
    }
    if (String(execution.output || "").trim() !== String(test.expectedOutput || "").trim()) {
      failures.push(`Test ${index + 1} did not produce the expected output.`);
    }
  }
  return {
    correct: failures.length === 0,
    feedback: failures,
    firstExecution,
    error: null
  };
}

function parsePythonError(tracebackText) {
  const text = String(tracebackText || "").trim();
  const lines = text.split("\n").map(line => line.trimEnd()).filter(Boolean);
  const finalLine = lines.at(-1) || "RuntimeError: The program stopped.";
  const typeMatch = finalLine.match(/^([A-Za-z][A-Za-z0-9_]*Error|SystemExit|KeyboardInterrupt):?\s*(.*)$/);
  const errorType = typeMatch?.[1] || "RuntimeError";
  const detail = typeMatch?.[2] || finalLine;
  const lineMatches = [...text.matchAll(/File "<student>", line (\d+)/g)];
  const lineNumber = lineMatches.length ? Number(lineMatches.at(-1)[1]) : null;
  return { text, finalLine, errorType, detail, lineNumber };
}

function friendlyErrorExplanation(tracebackText) {
  const parsed = parsePythonError(tracebackText);
  const lineText = parsed.lineNumber ? `The error happened on line ${parsed.lineNumber}.\n\n` : "";
  const messages = {
    SyntaxError: [
      "Python cannot understand the structure of this line.",
      "Check for a missing colon after if, elif, else, for or while.",
      "Check brackets and quotation marks, and make sure you have not used = where == is needed."
    ],
    IndentationError: [
      "The indentation does not match Python's expected structure.",
      "After a colon, the following line must be indented.",
      "Make sure elif and else line up with the matching if."
    ],
    NameError: [
      "Python cannot find that variable or function name.",
      "Check that the variable was created before it was used.",
      "Compare the spelling and capital letters carefully. Python is case-sensitive."
    ],
    TypeError: [
      "The program used incompatible types together.",
      "Check whether input needs int() or float().",
      "Look for a calculation that mixes text with a number."
    ],
    ValueError: [
      "The function received a value it could not convert or use.",
      "Check what was passed into int() or float().",
      "Make sure the value has the format your program expects."
    ],
    IndexError: [
      "The program tried to use an array position that does not exist.",
      "Remember that the first array index is 0.",
      "Check the array length and the loop range."
    ],
    ZeroDivisionError: [
      "The program tried to divide by zero.",
      "Check the value used after the division symbol.",
      "Use a condition to make sure the divisor is not 0 before dividing."
    ],
    ImportError: [
      "The requested module could not be imported.",
      "Check the module name and whether it is available in this browser version of Python."
    ],
    ModuleNotFoundError: [
      "Python could not find the requested module.",
      "Check the spelling of the module name and whether the app supports it."
    ],
    RuntimeError: [
      parsed.detail.includes("too many steps")
        ? "The program was stopped because it may contain an infinite loop."
        : "The program stopped while it was running.",
      parsed.detail.includes("too many steps")
        ? "Check whether the variable in the while condition is updated inside the loop."
        : "Read the final line of the Python error first, then inspect the indicated code line.",
      "Use Visualise to inspect the variable values immediately before the error."
    ]
  };
  const advice = messages[parsed.errorType] || messages.RuntimeError;
  return `${parsed.errorType}\n\n${lineText}${advice.map(item => `• ${item}`).join("\n")}\n\nPython's final message:\n${parsed.finalLine}`;
}

function showExecutionError(errorText) {
  elements.standardErrorBox.textContent = String(errorText || "Unknown Python error");
  elements.friendlyErrorBox.textContent = friendlyErrorExplanation(errorText);
  elements.errorPanel.classList.remove("hidden");
  applyErrorViewMode();
}

function hideExecutionError() {
  elements.errorPanel.classList.add("hidden");
  elements.standardErrorBox.textContent = "";
  elements.friendlyErrorBox.textContent = "";
}

function setRunningButtons(disabled) {
  elements.runButton.disabled = disabled;
  elements.checkButton.disabled = disabled;
  elements.visualiseButton.disabled = disabled;
}

elements.runButton.addEventListener("click", async () => {
  if (!currentTask) return;
  clearMessage();
  setRunningButtons(true);
  elements.outputBox.textContent = "Running…";
  try {
    const result = await runCode(elements.codeEditor.value, currentTask.sampleInputs || []);
    elements.outputBox.textContent = result.output || "(No output)";
    if (result.error) {
      showExecutionError(result.error);
      elements.feedbackBox.textContent = "Python stopped with an error. Use the two error views below to investigate it.";
      elements.feedbackBox.className = "feedback error";
    } else {
      hideExecutionError();
      elements.feedbackBox.className = "feedback hidden";
    }
  } catch (error) {
    console.error(error);
    elements.outputBox.textContent = "(No output)";
    showExecutionError(String(error));
    elements.feedbackBox.textContent = "Python could not run. Check the internet connection and reload the page.";
    elements.feedbackBox.className = "feedback error";
  } finally {
    setRunningButtons(false);
  }
});

elements.checkButton.addEventListener("click", async () => {
  if (!currentTask) return;
  setRunningButtons(true);
  elements.outputBox.textContent = "Checking…";
  try {
    const tests = await runTaskTests(elements.codeEditor.value, currentTask);
    const execution = tests.firstExecution || { output: "", error: tests.error };
    elements.outputBox.textContent = execution.output || "(No output)";
    let grading;
    if (tests.error) {
      showExecutionError(tests.error);
      grading = { correct: false, feedback: ["Fix the Python error shown below, then check the answer again."] };
    } else {
      hideExecutionError();
      const structural = await gradeCode(elements.codeEditor.value, currentTask, execution.output);
      grading = {
        correct: structural.correct && tests.correct,
        feedback: [...structural.feedback, ...tests.feedback]
      };
    }

    elements.feedbackBox.textContent = grading.correct
      ? "Correct — well done! Your progress has been saved."
      : grading.feedback.join("\n");
    elements.feedbackBox.className = `feedback ${grading.correct ? "success" : "error"}`;
    await saveAttempt(grading.correct, tests.error, grading.feedback);
    if (grading.correct) {
      elements.challengeStatus.textContent = "Complete";
      elements.challengeStatus.className = "status-pill complete";
      renderRelatedPractice(currentTask, elements.challengeRelatedPractice);
    } else {
      elements.challengeStatus.textContent = "Needs work";
      elements.challengeStatus.className = "status-pill needs-work";
    }
  } catch (error) {
    console.error("Check/save failed:", error.code, error.message, error);
    const code = error.code ? ` [${error.code}]` : "";
    elements.feedbackBox.textContent = `${error.message || "The answer could not be checked."}${code}`;
    elements.feedbackBox.className = "feedback error";
  } finally {
    setRunningButtons(false);
  }
});

async function saveAttempt(correct, executionError = null, gradingFeedback = []) {
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const attempts = (old.attempts || 0) + 1;
  const errorType = executionError ? parsePythonError(executionError).errorType : "";
  const errorCounts = { ...(old.errorCounts || {}) };
  if (errorType) errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
  const data = {
    ...baseProgressData(currentTask, old),
    completed: Boolean(old.completed || correct),
    status: Boolean(old.completed || correct) ? "complete" : "needs_work",
    attempts,
    incorrectAttempts: (old.incorrectAttempts || 0) + (correct ? 0 : 1),
    firstAttemptCorrect: (old.attempts || 0) === 0 ? Boolean(correct) : Boolean(old.firstAttemptCorrect),
    lastCode: elements.codeEditor.value,
    lastErrorType: errorType || old.lastErrorType || "",
    errorCounts,
    lastIssue: correct ? "" : (gradingFeedback?.[0] || errorType || "Answer did not pass"),
    lastAttemptAt: serverTimestamp(),
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
  currentProgress.set(currentTask.id, { ...old, ...data });
  codeIsDirty = false;
  clearScheduledAutoSave();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  setSaveStatus("saved", `Saved at ${time}`);
}

async function saveHintUse() {
  if (!currentTask || !auth.currentUser || currentProfile?.role !== "student") return;
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const data = {
    ...baseProgressData(currentTask, old),
    status: old.completed ? "complete" : (old.attempts || 0) > 0 ? "needs_work" : "in_progress",
    hintsUsed: (old.hintsUsed || 0) + 1,
    lastCode: elements.codeEditor.value,
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
  currentProgress.set(currentTask.id, { ...old, ...data });
  codeIsDirty = false;
  clearScheduledAutoSave();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  setSaveStatus("saved", `Saved at ${time}`);
}

async function traceCode(code, inputs = []) {
  const python = await ensurePyodide();
  python.globals.set("student_code", code);
  python.globals.set("input_values_json", JSON.stringify((inputs || []).map(value => String(value))));
  const raw = await python.runPythonAsync(`
import io, sys, traceback, json
_lines = student_code.splitlines()
_steps = []
_counter = {"n": 0}
_buffer = io.StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout = _buffer
sys.stderr = _buffer
_error = None
_input_values = json.loads(input_values_json)
_input_index = {"value": 0}

def _safe_input(prompt=""):
    if prompt:
        print(str(prompt), end="")
    if _input_index["value"] >= len(_input_values):
        raise EOFError("No more test input values were supplied by the app.")
    value = str(_input_values[_input_index["value"]])
    _input_index["value"] += 1
    print(value)
    return value

def _safe_repr(value):
    try:
        text = repr(value)
        return text if len(text) <= 240 else text[:237] + "..."
    except Exception:
        return "<unprintable>"

def _snapshot(frame):
    result = {}
    for name, value in frame.f_locals.items():
        if not name.startswith("__") and name != "input":
            result[name] = _safe_repr(value)
    return result

def _tracer(frame, event, arg):
    if frame.f_code.co_filename != "<student>":
        return _tracer
    if event == "line":
        _counter["n"] += 1
        if _counter["n"] > 500:
            raise RuntimeError("Stopped: too many steps (possible infinite loop).")
        _steps.append({
            "line": frame.f_lineno,
            "event": "line",
            "variables": _snapshot(frame),
            "output": _buffer.getvalue()
        })
    return _tracer

_env = {"__name__": "__main__", "input": _safe_input}
try:
    _compiled = compile(student_code, "<student>", "exec")
    sys.settrace(_tracer)
    exec(_compiled, _env, _env)
    sys.settrace(None)
    _steps.append({
        "line": 0,
        "event": "done",
        "variables": {name: _safe_repr(value) for name, value in _env.items() if not name.startswith("__") and name != "input"},
        "output": _buffer.getvalue()
    })
except BaseException as exc:
    sys.settrace(None)
    _error = traceback.format_exc()
    _line = getattr(exc, "lineno", None)
    if not _line and _steps:
        _line = _steps[-1].get("line", 0)
    _steps.append({
        "line": int(_line or 0),
        "event": "error",
        "variables": {name: _safe_repr(value) for name, value in _env.items() if not name.startswith("__") and name != "input"},
        "output": _buffer.getvalue()
    })
finally:
    sys.settrace(None)
    sys.stdout, sys.stderr = _old_stdout, _old_stderr
json.dumps({"steps": _steps, "error": _error, "output": _buffer.getvalue()})
  `);
  return JSON.parse(String(raw));
}

function stopTracePlayback() {
  if (tracePlayTimer) {
    clearInterval(tracePlayTimer);
    tracePlayTimer = null;
  }
  if (elements.playTraceButton) elements.playTraceButton.textContent = "Play";
}

async function completeVisualiserActivityAtFinish() {
  if (
    visualiserCompletionSaving
    || !currentTask
    || currentTask.type !== "visualiser"
    || !auth.currentUser
    || currentProfile?.role !== "student"
  ) {
    return;
  }

  const finalStep = traceSteps[traceSteps.length - 1];
  if (
    !finalStep
    || traceIndex !== traceSteps.length - 1
    || finalStep.event !== "done"
  ) {
    return;
  }

  const old = currentProgress.get(currentTask.id) || {};
  if (old.completed) return;

  visualiserCompletionSaving = true;

  try {
    const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
    const data = {
      ...baseProgressData(currentTask, old),
      completed: true,
      status: "complete",
      lastCode: elements.codeEditor.value,
      completedAt: serverTimestamp(),
      lastSavedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp()
    };

    await setDoc(
      progressRef,
      data,
      { merge: currentProgress.has(currentTask.id) }
    );

    currentProgress.set(currentTask.id, { ...old, ...data });
    elements.challengeStatus.textContent = "Complete";
    elements.challengeStatus.className = "status-pill complete";
    elements.feedbackBox.textContent =
      "Visualiser activity complete. The next activity is now unlocked.";
    elements.feedbackBox.className = "feedback success";
  } catch (error) {
    console.error("Could not complete visualiser activity:", error);
    elements.feedbackBox.textContent =
      "The visualiser finished, but completion could not be saved. Please try the final step again.";
    elements.feedbackBox.className = "feedback error";
  } finally {
    visualiserCompletionSaving = false;
  }
}

function renderTraceStep(index) {
  if (!traceSteps.length || !currentTask) return;
  traceIndex = Math.max(0, Math.min(index, traceSteps.length - 1));
  const step = traceSteps[traceIndex];
  const previous = traceIndex > 0 ? traceSteps[traceIndex - 1] : { variables: {} };
  const lines = elements.codeEditor.value.split("\n");

  elements.visualiserCode.innerHTML = lines.map((line, i) => {
    const lineNumber = i + 1;
    const current = step.line === lineNumber ? " current" : "";
    return `<div class="code-line${current}"><span class="code-line-number">${lineNumber}</span><span class="code-line-text">${escapeHtml(line || " ")}</span></div>`;
  }).join("");

  const variables = step.variables || {};
  const names = Object.keys(variables).sort();
  if (!names.length) {
    elements.visualiserVariables.innerHTML = `<tr><td colspan="2" class="empty-table">No variables have been created yet.</td></tr>`;
  } else {
    elements.visualiserVariables.innerHTML = names.map(name => {
      const changed = previous.variables?.[name] !== variables[name] ? "changed" : "";
      return `<tr class="${changed}"><td>${escapeHtml(name)}</td><td>${escapeHtml(variables[name])}</td></tr>`;
    }).join("");
  }

  elements.visualiserOutput.textContent = step.output || "(no output)";
  const description = step.event === "done"
    ? "Program finished"
    : step.event === "error"
      ? `Program stopped with an error near line ${step.line || "?"}`
      : `About to run line ${step.line}`;
  elements.visualiserStepLabel.textContent = `Step ${traceIndex + 1} of ${traceSteps.length} · ${description}`;

  elements.firstStepButton.disabled = traceIndex === 0;
  elements.previousStepButton.disabled = traceIndex === 0;
  elements.nextStepButton.disabled = traceIndex === traceSteps.length - 1;
  elements.lastStepButton.disabled = traceIndex === traceSteps.length - 1;

  if (
    currentTask.type === "visualiser"
    && step.event === "done"
    && traceIndex === traceSteps.length - 1
  ) {
    void completeVisualiserActivityAtFinish();
  }
}

async function recordVisualiserUse() {
  if (!currentTask || !auth.currentUser || currentProfile?.role !== "student") return;
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const data = {
    ...baseProgressData(currentTask, old),
    status: old.completed ? "complete" : (old.attempts || 0) > 0 ? "needs_work" : "in_progress",
    visualiserUses: (old.visualiserUses || 0) + 1,
    lastCode: elements.codeEditor.value,
    lastVisualisedAt: serverTimestamp(),
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
  currentProgress.set(currentTask.id, { ...old, ...data });
  codeIsDirty = false;
  clearScheduledAutoSave();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  setSaveStatus("saved", `Saved at ${time}`);
}

elements.visualiseButton.addEventListener("click", async () => {
  if (!currentTask) return;
  setRunningButtons(true);
  elements.visualiserPanel.classList.remove("hidden");
  elements.visualiserStepLabel.textContent = "Building the line-by-line replay…";
  elements.visualiserCode.innerHTML = "";
  elements.visualiserVariables.innerHTML = `<tr><td colspan="2" class="empty-table">Loading…</td></tr>`;
  elements.visualiserOutput.textContent = "(no output)";
  try {
    const result = await traceCode(elements.codeEditor.value, currentTask.sampleInputs || []);
    traceSteps = result.steps || [];
    if (!traceSteps.length) {
      traceSteps = [{ line: 0, event: "error", variables: {}, output: result.output || "" }];
    }
    renderTraceStep(0);
    if (result.error) showExecutionError(result.error);
    else hideExecutionError();
    await recordVisualiserUse();
    elements.visualiserPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Visualiser failed:", error);
    showExecutionError(String(error));
    elements.visualiserStepLabel.textContent = "The visualiser could not run this program.";
  } finally {
    setRunningButtons(false);
  }
});

elements.closeVisualiserButton.addEventListener("click", () => {
  stopTracePlayback();
  elements.visualiserPanel.classList.add("hidden");
});

elements.firstStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(0);
});
elements.previousStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(traceIndex - 1);
});
elements.nextStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(traceIndex + 1);
});
elements.lastStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(traceSteps.length - 1);
});
elements.playTraceButton.addEventListener("click", () => {
  if (!traceSteps.length) return;
  if (tracePlayTimer) {
    stopTracePlayback();
    return;
  }
  if (traceIndex >= traceSteps.length - 1) renderTraceStep(0);
  elements.playTraceButton.textContent = "Pause";
  tracePlayTimer = setInterval(() => {
    if (traceIndex >= traceSteps.length - 1) {
      stopTracePlayback();
      return;
    }
    renderTraceStep(traceIndex + 1);
  }, 900);
});

window.addEventListener("beforeunload", event => {
  if (currentProfile?.role === "student" && currentTask && codeIsDirty) {
    event.preventDefault();
  }
});





function gameAttemptMillis(attempt) {
  return timestampMillis(attempt?.completedAt);
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

async function loadPupilGameAttempts() {
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  try {
    const snapshot = await getDocs(query(collection(db, "gameAttempts"), where("userId", "==", auth.currentUser.uid)));
    currentGameAttempts = snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
      .filter(item => item.classId === currentProfile.classId)
      .sort((a, b) => gameAttemptMillis(b) - gameAttemptMillis(a));
  } catch (error) {
    console.warn("Games Lab history could not be loaded:", error);
    currentGameAttempts = [];
  }
}

function hasCompletedUnit(unitId) {
  return [...currentProgress.entries()].some(([activityId, progress]) => {
    const activity = allActivities.find(item => item.id === activityId);
    return progress.completed === true && activity?.unitId === unitId;
  });
}

function gameUnlockState(game) {
  const unitId = game === "debug-rescue" ? "sdd-python-17" : "sdd-python-07";
  const unit = unitById(unitId);
  const unlocked = hasCompletedUnit(unitId);
  return { unlocked, unitId, unitTitle: unit?.title || "the related unit" };
}

function gameStats(game) {
  const rows = currentGameAttempts.filter(item => item.game === game);
  const correct = rows.filter(item => item.correct).length;
  return {
    attempts: rows.length,
    correct,
    accuracy: rows.length ? Math.round((correct / rows.length) * 100) : 0,
    bestScore: rows.reduce((best, item) => Math.max(best, Number(item.sessionScore || 0)), 0)
  };
}

function renderGamesLabCard() {
  const debugStats = gameStats("debug-rescue");
  const logicStats = gameStats("logic-showdown");
  const total = debugStats.attempts + logicStats.attempts;
  const successful = debugStats.correct + logicStats.correct;
  elements.gamesLabDescription.textContent = total
    ? `${successful}/${total} successful responses so far. Game results feed your personalised review schedule.`
    : "Practise debugging and logical operators through short, adaptive challenges.";
  elements.gamesLabMeta.innerHTML = `<span class="activity-chip">${debugStats.attempts} debug attempts</span><span class="activity-chip">${logicStats.attempts} logic responses</span><span class="activity-chip">Linked to mastery</span>`;
}

function renderGamesLabMenu() {
  const debugUnlock = gameUnlockState("debug-rescue");
  const logicUnlock = gameUnlockState("logic-showdown");
  const debugStats = gameStats("debug-rescue");
  const logicStats = gameStats("logic-showdown");
  elements.gamesLabSummary.innerHTML = [
    statCard(debugStats.attempts ? `${debugStats.accuracy}%` : "—", "Debug accuracy"),
    statCard(logicStats.attempts ? `${logicStats.accuracy}%` : "—", "Logic accuracy"),
    statCard(currentGameAttempts.length, "Saved responses"),
    statCard(currentGameAttempts.filter(item => item.correct).length, "Successful responses")
  ].join("");
  elements.debugGameUnlockText.textContent = debugUnlock.unlocked
    ? "Unlocked. Results save to your mastery profile and spaced-learning schedule."
    : `Complete an activity in ${debugUnlock.unitTitle} to save results. Training preview is available now.`;
  elements.logicGameUnlockText.textContent = logicUnlock.unlocked
    ? "Unlocked. Results save to your mastery profile and spaced-learning schedule."
    : `Complete an activity in ${logicUnlock.unitTitle} to save results. Training preview is available now.`;
  elements.openDebugGameButton.textContent = debugUnlock.unlocked ? "Play Debug Rescue" : "Preview Debug Rescue";
  elements.openLogicGameButton.textContent = logicUnlock.unlocked ? "Play Logic Showdown" : "Preview Logic Showdown";
}

async function saveGameAttempt(data) {
  if (!auth.currentUser || currentProfile?.role !== "student" || data.previewOnly) return null;
  const attemptRef = doc(collection(db, "gameAttempts"));
  const batch = writeBatch(db);
  const stored = {
    userId: auth.currentUser.uid,
    classId: currentProfile.classId,
    game: data.game,
    mode: data.mode || "training",
    level: data.level || "Beginner",
    challengeId: data.challengeId,
    correct: Boolean(data.correct),
    points: Number(data.points || 0),
    sessionScore: Number(data.sessionScore || 0),
    hintsUsed: Number(data.hintsUsed || 0),
    responseTimeSeconds: Number(data.responseTimeSeconds || 0),
    skillIds: data.skillIds || [],
    details: data.details || {},
    completedAt: serverTimestamp()
  };
  batch.set(attemptRef, stored);
  const confidence = stored.correct ? (stored.hintsUsed ? 2 : 3) : 1;
  (stored.skillIds || []).forEach(skillId => {
    const old = currentReviewStates.get(skillId) || {};
    const state = updateReviewStateData(old, skillId, stored.correct, confidence);
    batch.set(doc(db, "reviewStates", reviewStateDocumentId(skillId)), state, { merge: currentReviewStates.has(skillId) });
    currentReviewStates.set(skillId, { ...old, ...state });
  });
  await batch.commit();
  const local = { id: attemptRef.id, ...stored, completedAt: new Date() };
  currentGameAttempts.unshift(local);
  return local;
}

// ---------------- Debug Rescue ----------------
function stopDebugTimer() {
  if (debugTimerId !== null) clearInterval(debugTimerId);
  debugTimerId = null;
}

function debugSecondsFor(level, mode) {
  if (mode === "training") return 0;
  const base = level === "Beginner" ? 55 : level === "Intermediate" ? 70 : 85;
  return mode === "challenge" ? Math.max(35, base - 20) : base;
}

function updateDebugOcean() {
  if (!debugGameState?.deadline) {
    elements.debugTimer.textContent = "Training mode — no timer";
    elements.debugShark.style.left = "7%";
    elements.debugFish.style.left = "80%";
    return;
  }
  const remaining = Math.max(0, debugGameState.deadline - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  const duration = debugGameState.durationMs || 1;
  const progress = Math.min(1, Math.max(0, 1 - remaining / duration));
  elements.debugTimer.textContent = `${seconds}s remaining`;
  elements.debugShark.style.left = `${7 + progress * 62}%`;
  elements.debugFish.style.left = `${80 + Math.sin(Date.now() / 500) * 2}%`;
  elements.debugTimer.classList.toggle("urgent", seconds <= 10);
  if (remaining <= 0) void debugTimeExpired();
}

function startDebugTimer() {
  stopDebugTimer();
  if (!debugGameState) return;
  const seconds = debugSecondsFor(debugGameState.level, debugGameState.mode);
  debugGameState.durationMs = seconds * 1000;
  debugGameState.deadline = seconds ? Date.now() + seconds * 1000 : 0;
  updateDebugOcean();
  if (seconds) debugTimerId = setInterval(updateDebugOcean, 250);
}

function debugLineButtons(code) {
  return String(code).split("\n").map((line, index) => `<button type="button" class="debug-code-line" data-debug-line="${index + 1}"><span>${index + 1}</span><code>${escapeHtml(line || " ")}</code></button>`).join("");
}

function renderDebugChallenge() {
  stopDebugTimer();
  const challenge = debugGameState?.queue[debugGameState.index];
  if (!challenge) return finishDebugSession();
  debugGameState.current = challenge;
  debugGameState.selectedLine = 0;
  debugGameState.diagnosisChecked = false;
  debugGameState.repairPassed = false;
  debugGameState.hintsUsed = 0;
  debugGameState.startedAt = Date.now();
  debugGameState.completedCurrent = false;
  elements.debugProgress.textContent = `Challenge ${debugGameState.index + 1} of ${debugGameState.queue.length}`;
  elements.debugChallengeTitle.textContent = challenge.title;
  elements.debugChallengePrompt.textContent = challenge.prompt;
  elements.debugCodeLines.innerHTML = debugLineButtons(challenge.buggyCode);
  elements.debugEditor.value = challenge.buggyCode;
  elements.debugOutput.textContent = "Run your repaired program when you are ready.";
  elements.debugFeedback.className = "feedback hidden";
  elements.debugFeedback.textContent = "";
  elements.debugHintBox.classList.add("hidden");
  elements.debugHintBox.textContent = "";
  elements.debugRepairPanel.classList.add("locked-stage");
  elements.debugExplanationPanel.classList.add("hidden");
  elements.debugNextButton.classList.add("hidden");
  elements.checkDebugDiagnosisButton.disabled = false;
  elements.runDebugRepairButton.disabled = true;
  elements.submitDebugExplanationButton.disabled = false;
  elements.debugErrorTypeOptions.querySelectorAll("input").forEach(input => { input.checked = false; });
  elements.debugCodeLines.querySelectorAll("[data-debug-line]").forEach(button => {
    button.addEventListener("click", () => {
      elements.debugCodeLines.querySelectorAll(".selected").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      debugGameState.selectedLine = Number(button.dataset.debugLine);
    });
  });
  startDebugTimer();
}

function startDebugSession() {
  const level = elements.debugLevelInput.value;
  const mode = elements.debugModeInput.value;
  const unlocked = gameUnlockState("debug-rescue").unlocked;
  let target = mode === "training" ? 4 : mode === "rescue" ? 6 : 8;
  const pool = DEBUG_CHALLENGES.filter(item => item.level === level);
  if (!pool.length) return;
  debugGameState = {
    level,
    mode,
    previewOnly: !unlocked,
    queue: shuffled(pool).slice(0, Math.min(target, pool.length)),
    index: 0,
    score: 0,
    rescued: 0,
    timedOut: 0
  };
  elements.debugSetupPanel.classList.add("hidden");
  elements.debugPlayPanel.classList.remove("hidden");
  elements.debugSummaryPanel.classList.add("hidden");
  elements.debugPreviewNotice.classList.toggle("hidden", unlocked);
  renderDebugChallenge();
}

function checkDebugDiagnosis() {
  if (!debugGameState?.current) return;
  const selectedType = elements.debugErrorTypeOptions.querySelector('input[name="debug-error-type"]:checked')?.value || "";
  if (!selectedType || !debugGameState.selectedLine) {
    elements.debugFeedback.textContent = "Choose an error type and click the line where you think the problem begins.";
    elements.debugFeedback.className = "feedback error";
    return;
  }
  const challenge = debugGameState.current;
  debugGameState.typeCorrect = selectedType === challenge.errorType;
  debugGameState.lineCorrect = debugGameState.selectedLine === Number(challenge.bugLine);
  debugGameState.diagnosisChecked = true;
  elements.debugFeedback.innerHTML = `<strong>${debugGameState.typeCorrect ? `✓ ${escapeHtml(debugErrorLabel(challenge.errorType))}` : `Correct answer: ${escapeHtml(debugErrorLabel(challenge.errorType))}`}</strong>${debugIdleDetail(challenge)} · <strong>${debugGameState.lineCorrect ? "✓ Line located" : `Problem begins around line ${challenge.bugLine}`}</strong><br>You can now repair and run the code.`;
  elements.debugFeedback.className = `feedback ${debugGameState.typeCorrect && debugGameState.lineCorrect ? "success" : "info"}`;
  elements.debugRepairPanel.classList.remove("locked-stage");
  elements.runDebugRepairButton.disabled = false;
  elements.checkDebugDiagnosisButton.disabled = true;
}

async function validateDebugRepair(challenge, code) {
  const requirements = challenge.requirements || {};
  for (const pattern of requirements.requiredPatterns || []) {
    if (!new RegExp(pattern, "m").test(code)) return { correct: false, message: "The program runs differently from the required repair. Keep the intended variables and construct." };
  }
  for (const pattern of requirements.forbiddenPatterns || []) {
    if (new RegExp(pattern, "m").test(code)) return { correct: false, message: "The original faulty pattern is still present." };
  }
  let firstExecution = null;
  for (const test of challenge.tests || []) {
    const execution = await runCode(code, test.inputs || []);
    if (!firstExecution) firstExecution = execution;
    if (execution.error) return { correct: false, message: "Python still stops with an error.", execution };
    if (String(execution.output || "").trim() !== String(test.expectedOutput || "").trim()) {
      return { correct: false, message: `The program ran, but the output was not correct for the test.`, execution };
    }
  }
  return { correct: true, message: "The program now runs correctly for the test case.", execution: firstExecution };
}

async function runDebugRepair() {
  if (!debugGameState?.current || !debugGameState.diagnosisChecked) return;
  elements.runDebugRepairButton.disabled = true;
  elements.debugOutput.textContent = "Loading Python and checking the repair…";
  try {
    const result = await validateDebugRepair(debugGameState.current, elements.debugEditor.value);
    if (!result.correct) {
      elements.debugOutput.textContent = result.execution?.error || result.execution?.output || result.message;
      elements.debugFeedback.textContent = result.message;
      elements.debugFeedback.className = "feedback error";
      elements.runDebugRepairButton.disabled = false;
      return;
    }
    stopDebugTimer();
    debugGameState.repairPassed = true;
    elements.debugOutput.textContent = result.execution?.output || "Program completed.";
    elements.debugFeedback.textContent = "Fish rescued — now explain why the repair works.";
    elements.debugFeedback.className = "feedback success";
    elements.debugExplanationPrompt.textContent = "Why did the original program fail or produce the wrong result?";
    elements.debugExplanationOptions.innerHTML = debugGameState.current.explanationOptions.map((option, index) => `<label class="option-label"><input type="radio" name="debug-explanation" value="${index}"> <span>${escapeHtml(option)}</span></label>`).join("");
    elements.debugExplanationPanel.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    elements.debugOutput.textContent = error.message || "The repair could not be checked.";
    elements.runDebugRepairButton.disabled = false;
  }
}

async function submitDebugExplanation() {
  if (!debugGameState?.repairPassed || debugGameState.completedCurrent) return;
  const selected = elements.debugExplanationOptions.querySelector('input[name="debug-explanation"]:checked');
  if (!selected) {
    elements.debugFeedback.textContent = "Choose the explanation that best describes the bug.";
    elements.debugFeedback.className = "feedback error";
    return;
  }
  const challenge = debugGameState.current;
  const explanationCorrect = Number(selected.value) === Number(challenge.explanationAnswer);
  const responseTimeSeconds = Math.max(1, Math.round((Date.now() - debugGameState.startedAt) / 1000));
  const points = (debugGameState.typeCorrect ? 1 : 0) + (debugGameState.lineCorrect ? 1 : 0) + 4 + (explanationCorrect ? 2 : 0) + (debugGameState.hintsUsed ? 0 : 1);
  debugGameState.score += points;
  debugGameState.rescued += 1;
  debugGameState.completedCurrent = true;
  try {
    await saveGameAttempt({
      game: "debug-rescue", mode: debugGameState.mode, level: debugGameState.level,
      challengeId: challenge.id, correct: true, points, sessionScore: debugGameState.score,
      hintsUsed: debugGameState.hintsUsed, responseTimeSeconds, skillIds: challenge.skills,
      previewOnly: debugGameState.previewOnly,
      details: { errorTypeCorrect: Boolean(debugGameState.typeCorrect), lineCorrect: Boolean(debugGameState.lineCorrect), explanationCorrect }
    });
  } catch (error) {
    console.warn("Debug result could not be saved:", error);
  }
  elements.debugFeedback.innerHTML = `<strong>${explanationCorrect ? "Correct explanation." : "Repair successful; review the explanation."}</strong> ${escapeHtml(challenge.explanation)}`;
  elements.debugFeedback.className = `feedback ${explanationCorrect ? "success" : "info"}`;
  elements.submitDebugExplanationButton.disabled = true;
  elements.debugNextButton.classList.remove("hidden");
}

async function debugTimeExpired() {
  if (!debugGameState || debugGameState.completedCurrent) return;
  stopDebugTimer();
  debugGameState.completedCurrent = true;
  debugGameState.timedOut += 1;
  const challenge = debugGameState.current;
  try {
    await saveGameAttempt({
      game: "debug-rescue", mode: debugGameState.mode, level: debugGameState.level,
      challengeId: challenge.id, correct: false, points: 0, sessionScore: debugGameState.score,
      hintsUsed: debugGameState.hintsUsed, responseTimeSeconds: Math.round((debugGameState.durationMs || 0) / 1000),
      skillIds: challenge.skills, previewOnly: debugGameState.previewOnly,
      details: { timedOut: true }
    });
  } catch (error) { console.warn(error); }
  elements.debugFeedback.innerHTML = `<strong>The shark reached the fish this time.</strong> ${escapeHtml(challenge.explanation)}<br><strong>One valid repair:</strong><pre class="lesson-code compact">${escapeHtml(debugSolutionFor(challenge))}</pre>`;
  elements.debugFeedback.className = "feedback error";
  elements.debugRepairPanel.classList.remove("locked-stage");
  elements.debugNextButton.classList.remove("hidden");
}

function debugSolutionFor(challenge) {
  const solutions = {
    'DBG-B-01':'print("Hello")','DBG-B-02':'print("Hello")','DBG-B-03':'score = 55\nif score >= 50:\n    print("Pass")',
    'DBG-B-04':'weather = "rain"\nif weather == "rain":\n    print("Take a coat")','DBG-B-05':'age = 15\nif age == 15:\n    print("Correct age")',
    'DBG-B-06':'name = "Ava"\nprint("Hello " + name)','DBG-B-07':'total = 12\nprint(total)','DBG-B-08':'age = int(input("Enter age: "))\nif age >= 16:\n    print("Allowed")',
    'DBG-I-01':'values = [10, 20, 30]\nfor index in range(len(values)):\n    print(values[index])','DBG-I-02':'numbers = [4, 6, 10]\ntotal = 0\nfor index in range(len(numbers)):\n    total = total + numbers[index]\nprint(total)',
    'DBG-I-03':'mark = 50\nif mark >= 50:\n    print("Pass")\nelse:\n    print("Fail")','DBG-I-04':'age = 150\nwhile age < 0 or age > 120:\n    print("Invalid")\n    age = int(input("Enter age: "))\nprint("Accepted")',
    'DBG-I-05':'first = 7\nsecond = 9\ntotal = first + second\nprint(total)','DBG-I-06':'total = 30\naverage = total / 3\nprint(average)',
    'DBG-I-07':'for number in range(1, 6):\n    print(number)','DBG-I-08':'count = 0\nwhile count < 3:\n    print(count)\n    count = count + 1',
    'DBG-A-01':'mark = 85\nif mark >= 80:\n    print("A")\nelif mark >= 70:\n    print("B")\nelif mark >= 50:\n    print("C")\nelse:\n    print("Fail")',
    'DBG-A-02':'readings = [0] * 5\nfor index in range(5):\n    readings[index] = index\nprint(readings)',
    'DBG-A-03':'choice = "x"\nwhile choice != "a" and choice != "b":\n    print("Invalid")\n    choice = input("Choose a or b: ")\nprint("Accepted")',
    'DBG-A-04':'numbers = [5, 10, 15]\ntotal = 0\nfor index in range(len(numbers)):\n    total = total + numbers[index]\nprint(total)',
    'DBG-A-05':'age = 17\nhasTicket = True\nif age < 18:\n    if hasTicket == True:\n        print("Enter")\n    else:\n        print("No ticket")\nelse:\n    print("Too old")',
    'DBG-A-06':'readings = [80, 30, 81, 29]\nsignal = ""\nfor reading in readings:\n    if reading > 80:\n        signal = signal + "S"\n    elif reading < 30:\n        signal = signal + "P"\n    else:\n        signal = signal + "M"\nprint(signal)',
    'DBG-A-07':'values = [1, 2, 3, 4]\ntotal = 0\nfor index in range(len(values)):\n    total = total + values[index]\nprint(total)',
    'DBG-A-08':'readings = []\nreading = 120\nwhile reading < 0 or reading > 100:\n    print("Invalid")\n    reading = int(input("Enter reading: "))\nreadings.append(reading)\nprint(readings[0])'
  };
  return solutions[challenge.id] || challenge.buggyCode;
}

function showDebugHint() {
  if (!debugGameState?.current) return;
  debugGameState.hintsUsed += 1;
  elements.debugHintBox.textContent = debugGameState.current.hint;
  elements.debugHintBox.classList.remove("hidden");
}

function nextDebugChallenge() {
  if (!debugGameState) return;
  debugGameState.index += 1;
  if (debugGameState.index >= debugGameState.queue.length) finishDebugSession();
  else renderDebugChallenge();
}

function finishDebugSession() {
  stopDebugTimer();
  if (!debugGameState) return;
  const total = debugGameState.queue.length;
  elements.debugPlayPanel.classList.add("hidden");
  elements.debugSummaryPanel.classList.remove("hidden");
  elements.debugSummaryPanel.innerHTML = `<div class="game-result-hero"><span>🐟</span><div><h3>${debugGameState.rescued} fish rescued</h3><p>${debugGameState.score} points · ${debugGameState.timedOut} timed out</p></div></div>
    <p>${debugGameState.previewOnly ? "Preview complete. Finish the Errors and Debugging unit to save future results." : "Your debugging skills and personalised review schedule have been updated."}</p>
    <div class="activity-actions"><button id="debugPlayAgainButton" type="button">Play again</button><button id="debugReturnGamesButton" type="button" class="secondary">Return to Games Lab</button></div>`;
  elements.debugSummaryPanel.querySelector('#debugPlayAgainButton').addEventListener('click', () => {
    elements.debugSummaryPanel.classList.add('hidden'); elements.debugSetupPanel.classList.remove('hidden');
  });
  elements.debugSummaryPanel.querySelector('#debugReturnGamesButton').addEventListener('click', () => {
    renderGamesLabMenu(); showView('gamesView');
  });
}

// ---------------- Logic Showdown ----------------
function logicVariables(expression) {
  return [...new Set(String(expression).match(/\b[A-E]\b/g) || [])].sort();
}

function evaluateLogicExpression(expression, env) {
  let source = String(expression);
  Object.entries(env).forEach(([name, value]) => { source = source.replace(new RegExp(`\\b${name}\\b`, 'g'), value ? 'true' : 'false'); });
  source = source.replace(/\bAND\b/g, '&&').replace(/\bOR\b/g, '||').replace(/\bNOT\b/g, '!');
  return Boolean(Function(`"use strict"; return (${source});`)());
}

function booleanRows(names) {
  const rows = [];
  const count = 2 ** names.length;
  for (let number = 0; number < count; number += 1) {
    const env = {};
    names.forEach((name, index) => { env[name] = Boolean((number >> (names.length - index - 1)) & 1); });
    rows.push(env);
  }
  return rows;
}

function logicSkillsForExpression(expression) {
  const skills = ['logical-operators'];
  if (/\bAND\b/.test(expression)) skills.push('and');
  if (/\bOR\b/.test(expression)) skills.push('or');
  if (/\bNOT\b/.test(expression)) skills.push('not');
  return skills;
}

function makeLogicQuestion(mode, level) {
  if (mode === 'judge') {
    const expression = shuffled(LOGIC_EXPRESSIONS[level])[0];
    const names = logicVariables(expression);
    const env = Object.fromEntries(names.map(name => [name, Math.random() >= 0.5]));
    return { id: `JDG-${level}-${Date.now()}-${Math.random()}`, type: 'judge', expression, env, answer: evaluateLogicExpression(expression, env), skills: logicSkillsForExpression(expression) };
  }
  if (mode === 'truth-table') {
    const expression = shuffled(LOGIC_EXPRESSIONS[level])[0];
    const names = logicVariables(expression).slice(0, level === 'Advanced' ? 3 : 2);
    // Expressions selected for truth tables must only contain the retained names.
    const compatible = LOGIC_EXPRESSIONS[level].filter(item => logicVariables(item).every(name => names.includes(name)) && logicVariables(item).length <= (level === 'Advanced' ? 3 : 2));
    const finalExpression = compatible.length ? shuffled(compatible)[0] : (level === 'Beginner' ? 'A AND B' : 'A OR (B AND C)');
    return { id: `TBL-${level}-${Date.now()}-${Math.random()}`, type: 'truth-table', expression: finalExpression, names: logicVariables(finalExpression), skills: logicSkillsForExpression(finalExpression) };
  }
  const bank = mode === 'build-rule' ? LOGIC_BUILD_QUESTIONS : mode === 'faulty-condition' ? LOGIC_FAULTY_QUESTIONS : LOGIC_TRACE_QUESTIONS;
  return { ...shuffled(bank.filter(item => item.level === level))[0], type: mode };
}

function startLogicSession() {
  const level = elements.logicLevelInput.value;
  const mode = elements.logicModeInput.value;
  const unlocked = gameUnlockState('logic-showdown').unlocked;
  const total = mode === 'truth-table' ? 4 : 6;
  logicGameState = { level, mode, previewOnly: !unlocked, total, index: 0, correct: 0, selectedAnswer: null, startedAt: Date.now(), usedIds: new Set() };
  elements.logicSetupPanel.classList.add('hidden');
  elements.logicQuestionPanel.classList.remove('hidden');
  elements.logicSummaryPanel.classList.add('hidden');
  elements.logicPreviewNotice.classList.toggle('hidden', unlocked);
  renderLogicQuestion();
}

function renderJudgeQuestion(question) {
  const judges = Object.entries(question.env).map(([name, value]) => `<div class="logic-judge ${value ? 'judge-true' : 'judge-false'}"><span>Judge ${name}</span><strong>${value ? '✓ True' : '× False'}</strong></div>`).join('');
  elements.logicQuestionContent.innerHTML = `<div class="logic-expression">${escapeHtml(question.expression)}</div><div class="logic-judges">${judges}</div><p>Should the contestant move on?</p><div class="logic-choice-grid"><button type="button" data-logic-answer="true" class="logic-true-button">Move On — True</button><button type="button" data-logic-answer="false" class="logic-false-button">Eliminated — False</button></div>`;
  elements.logicQuestionContent.querySelectorAll('[data-logic-answer]').forEach(button => button.addEventListener('click', () => {
    elements.logicQuestionContent.querySelectorAll('.selected').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected'); logicGameState.selectedAnswer = button.dataset.logicAnswer === 'true';
  }));
}

function renderTruthTableQuestion(question) {
  const rows = booleanRows(question.names);
  question.rows = rows;
  elements.logicQuestionContent.innerHTML = `<div class="logic-expression">${escapeHtml(question.expression)}</div><div class="truth-table-wrap"><table class="truth-table"><thead><tr>${question.names.map(name => `<th>${name}</th>`).join('')}<th>Result</th></tr></thead><tbody>${rows.map((env,index) => `<tr data-truth-row="${index}">${question.names.map(name => `<td>${env[name] ? 'True' : 'False'}</td>`).join('')}<td><select class="truth-result-input"><option value="">Choose…</option><option value="true">True</option><option value="false">False</option></select></td></tr>`).join('')}</tbody></table></div>`;
}

function renderOptionLogicQuestion(question) {
  const expression = question.expression ? `<div class="logic-expression">${escapeHtml(question.expression)}</div>` : '';
  const env = question.env ? `<div class="logic-env">${Object.entries(question.env).map(([name,value]) => `<span>${name} = ${value ? 'True' : 'False'}</span>`).join('')}</div>` : '';
  const prompt = question.focus || question.prompt || '';
  elements.logicQuestionContent.innerHTML = `${expression}${env}<p class="logic-prompt">${escapeHtml(prompt).replaceAll('\n','<br>')}</p><div class="logic-option-list">${question.options.map((option,index) => `<label class="option-label"><input type="radio" name="logic-option" value="${index}"> <span><code>${escapeHtml(option)}</code></span></label>`).join('')}</div>`;
}

function renderLogicQuestion() {
  if (!logicGameState || logicGameState.index >= logicGameState.total) return finishLogicSession();
  let question;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    question = makeLogicQuestion(logicGameState.mode, logicGameState.level);
    if (!logicGameState.usedIds.has(question.id)) break;
  }
  logicGameState.current = question;
  logicGameState.usedIds.add(question.id);
  logicGameState.selectedAnswer = null;
  logicGameState.questionStartedAt = Date.now();
  elements.logicProgress.textContent = `Question ${logicGameState.index + 1} of ${logicGameState.total}`;
  elements.logicModeLabel.textContent = elements.logicModeInput.options[elements.logicModeInput.selectedIndex].text;
  elements.logicFeedback.className = 'feedback hidden';
  elements.logicFeedback.textContent = '';
  elements.logicNextButton.classList.add('hidden');
  elements.submitLogicAnswerButton.disabled = false;
  if (question.type === 'judge') renderJudgeQuestion(question);
  else if (question.type === 'truth-table') renderTruthTableQuestion(question);
  else renderOptionLogicQuestion(question);
}

async function submitLogicAnswer() {
  if (!logicGameState?.current) return;
  const question = logicGameState.current;
  let correct = false;
  let explanation = question.explanation || '';
  if (question.type === 'judge') {
    if (logicGameState.selectedAnswer === null) return showLogicNeedAnswer();
    correct = logicGameState.selectedAnswer === Boolean(question.answer);
    explanation = `${question.expression} evaluates to ${question.answer ? 'True' : 'False'}.`;
  } else if (question.type === 'truth-table') {
    const inputs = [...elements.logicQuestionContent.querySelectorAll('.truth-result-input')];
    if (inputs.some(input => input.value === '')) return showLogicNeedAnswer();
    correct = true;
    inputs.forEach((input,index) => {
      const expected = evaluateLogicExpression(question.expression, question.rows[index]);
      const rowCorrect = (input.value === 'true') === expected;
      input.closest('tr').classList.toggle('truth-correct', rowCorrect);
      input.closest('tr').classList.toggle('truth-incorrect', !rowCorrect);
      if (!rowCorrect) correct = false;
    });
    explanation = correct ? 'Every row is correct.' : 'Rows in red need another look. Evaluate brackets and NOT before AND and OR.';
  } else {
    const selected = elements.logicQuestionContent.querySelector('input[name="logic-option"]:checked');
    if (!selected) return showLogicNeedAnswer();
    correct = Number(selected.value) === Number(question.answer);
  }
  if (correct) logicGameState.correct += 1;
  const responseTimeSeconds = Math.max(1, Math.round((Date.now() - logicGameState.questionStartedAt) / 1000));
  try {
    await saveGameAttempt({
      game: 'logic-showdown', mode: logicGameState.mode, level: logicGameState.level,
      challengeId: question.id, correct, points: correct ? 1 : 0,
      sessionScore: logicGameState.correct, hintsUsed: 0, responseTimeSeconds,
      skillIds: question.skills || logicSkillsForExpression(question.expression || ''),
      previewOnly: logicGameState.previewOnly,
      details: { expression: question.expression || '', questionType: question.type }
    });
  } catch (error) { console.warn('Logic result could not be saved:', error); }
  elements.logicFeedback.innerHTML = `<strong>${correct ? 'Correct.' : 'Not quite.'}</strong> ${escapeHtml(explanation)}`;
  elements.logicFeedback.className = `feedback ${correct ? 'success' : 'error'}`;
  elements.submitLogicAnswerButton.disabled = true;
  elements.logicNextButton.classList.remove('hidden');
}

function showLogicNeedAnswer() {
  elements.logicFeedback.textContent = 'Complete the answer before submitting.';
  elements.logicFeedback.className = 'feedback error';
}

function nextLogicQuestion() {
  if (!logicGameState) return;
  logicGameState.index += 1;
  renderLogicQuestion();
}

function finishLogicSession() {
  if (!logicGameState) return;
  const percentage = Math.round((logicGameState.correct / logicGameState.total) * 100);
  const badge = percentage === 100 ? 'Logic Champion' : percentage >= 80 ? 'Logic Investigator' : percentage >= 60 ? 'Developing Logician' : 'Logic Apprentice';
  elements.logicQuestionPanel.classList.add('hidden');
  elements.logicSummaryPanel.classList.remove('hidden');
  elements.logicSummaryPanel.innerHTML = `<div class="game-result-hero"><span>⚖️</span><div><h3>${badge}</h3><p>${logicGameState.correct}/${logicGameState.total} correct · ${percentage}%</p></div></div>
    <p>${logicGameState.previewOnly ? 'Preview complete. Finish the Logical Operators unit to save future results.' : 'Your logical-operator mastery and review schedule have been updated.'}</p>
    <div class="activity-actions"><button id="logicPlayAgainButton" type="button">Play again</button><button id="logicReturnGamesButton" type="button" class="secondary">Return to Games Lab</button></div>`;
  elements.logicSummaryPanel.querySelector('#logicPlayAgainButton').addEventListener('click', () => { elements.logicSummaryPanel.classList.add('hidden'); elements.logicSetupPanel.classList.remove('hidden'); });
  elements.logicSummaryPanel.querySelector('#logicReturnGamesButton').addEventListener('click', () => { renderGamesLabMenu(); showView('gamesView'); });
}

// Games Lab navigation and controls
elements.openGamesLabButton.addEventListener('click', () => { renderGamesLabMenu(); showView('gamesView'); });
elements.backFromGamesButton.addEventListener('click', async () => { showView('pupilView'); await loadPupilDashboard(); });
elements.openDebugGameButton.addEventListener('click', () => {
  elements.debugSetupPanel.classList.remove('hidden'); elements.debugPlayPanel.classList.add('hidden'); elements.debugSummaryPanel.classList.add('hidden');
  showView('debugGameView');
});
elements.openLogicGameButton.addEventListener('click', () => {
  elements.logicSetupPanel.classList.remove('hidden'); elements.logicQuestionPanel.classList.add('hidden'); elements.logicSummaryPanel.classList.add('hidden');
  showView('logicGameView');
});
elements.backFromDebugGameButton.addEventListener('click', () => { stopDebugTimer(); renderGamesLabMenu(); showView('gamesView'); });
elements.backFromLogicGameButton.addEventListener('click', () => { renderGamesLabMenu(); showView('gamesView'); });
elements.startDebugGameButton.addEventListener('click', startDebugSession);
elements.checkDebugDiagnosisButton.addEventListener('click', checkDebugDiagnosis);
elements.runDebugRepairButton.addEventListener('click', runDebugRepair);
elements.submitDebugExplanationButton.addEventListener('click', submitDebugExplanation);
elements.debugHintButton.addEventListener('click', showDebugHint);
elements.debugNextButton.addEventListener('click', nextDebugChallenge);
elements.startLogicGameButton.addEventListener('click', startLogicSession);
elements.submitLogicAnswerButton.addEventListener('click', submitLogicAnswer);
elements.logicNextButton.addEventListener('click', nextLogicQuestion);


elements.openPeerReviewButton.addEventListener("click", renderPeerReviewWorkspace);
elements.backFromPeerReviewButton.addEventListener("click", async () => {
  showView("pupilView");
  await loadPupilDashboard();
});
elements.clearPeerHighlightsButton.addEventListener("click", () => {
  peerGreenTokens.clear();
  peerRedTokens.clear();
  renderPeerReviewWorkspace();
});
elements.submitPeerReviewButton.addEventListener("click", async () => {
  if (!activePeerReview) return;
  elements.submitPeerReviewButton.disabled = true;
  try {
    const missedPointIndexes = [...elements.peerMarkingPoints.querySelectorAll(".peer-missed-point:checked")].map(input => Number(input.value));
    await setDoc(peerReviewDocRef(activePeerReview.id), {
      status: "completed",
      peerSuggestedMark: Number(elements.peerSuggestedMarkInput.value || 0),
      greenTokenIndexes: [...peerGreenTokens].sort((a, b) => a - b),
      redTokenIndexes: [...peerRedTokens].sort((a, b) => a - b),
      missedPointIndexes,
      completedAt: serverTimestamp()
    }, { merge: true });
    elements.peerReviewFeedback.textContent = "Anonymous peer check submitted. No written comment or identity was shared.";
    elements.peerReviewFeedback.className = "feedback success";
    activePeerReview = null;
    setTimeout(async () => { showView("pupilView"); await loadPupilDashboard(); }, 900);
  } catch (error) {
    console.error(error);
    elements.submitPeerReviewButton.disabled = false;
    elements.peerReviewFeedback.textContent = error.message || "The peer check could not be submitted.";
    elements.peerReviewFeedback.className = "feedback error";
  }
});

window.PYTHON_PRACTICE_READY = true;
window.dispatchEvent(new Event("python-practice-ready"));
