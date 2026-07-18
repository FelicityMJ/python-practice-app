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
    description: "Requirements, relational design, referential integrity, SQL, testing and evaluation.",
    order: 2,
    active: true
  },
  {
    id: "cs",
    shortTitle: "CS",
    title: "Computer Systems",
    description: "Binary data, graphics, computer architecture, translators, environmental impact and security.",
    order: 3,
    active: true
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
  },
  {
    "id": "cs-binary-01",
    "areaId": "cs",
    "number": 1,
    "title": "Binary and place values",
    "description": "Represent positive integers using eight binary place values.",
    "order": 1
  },
  {
    "id": "cs-conversion-02",
    "areaId": "cs",
    "number": 2,
    "title": "Binary and denary conversion",
    "description": "Convert positive integers accurately in both directions.",
    "order": 2
  },
  {
    "id": "cs-floating-03",
    "areaId": "cs",
    "number": 3,
    "title": "Floating-point representation",
    "description": "Describe positive real numbers using a mantissa and exponent.",
    "order": 3
  },
  {
    "id": "cs-ascii-04",
    "areaId": "cs",
    "number": 4,
    "title": "Character representation",
    "description": "Explain how 8-bit extended ASCII represents characters.",
    "order": 4
  },
  {
    "id": "cs-graphics-05",
    "areaId": "cs",
    "number": 5,
    "title": "Graphics representation",
    "description": "Compare vector objects and bit-mapped pixel graphics.",
    "order": 5
  },
  {
    "id": "cs-processor-06",
    "areaId": "cs",
    "number": 6,
    "title": "Processor architecture",
    "description": "Understand registers, the ALU and the control unit.",
    "order": 6
  },
  {
    "id": "cs-memory-07",
    "areaId": "cs",
    "number": 7,
    "title": "Memory and buses",
    "description": "Explain memory addresses, the data bus and the address bus.",
    "order": 7
  },
  {
    "id": "cs-translators-08",
    "areaId": "cs",
    "number": 8,
    "title": "Compilers and interpreters",
    "description": "Explain why high-level code must be translated into machine code.",
    "order": 8
  },
  {
    "id": "cs-environment-09",
    "areaId": "cs",
    "number": 9,
    "title": "Environmental impact",
    "description": "Reduce the energy use and environmental impact of computer systems.",
    "order": 9
  },
  {
    "id": "cs-security-10",
    "areaId": "cs",
    "number": 10,
    "title": "Firewalls, encryption and mastery",
    "description": "Protect systems and communications, then combine all CS knowledge.",
    "order": 10
  }
];

UNITS.push(...[
  {
    "id": "ddd-foundations-01",
    "areaId": "ddd",
    "number": 1,
    "title": "Database foundations and requirements",
    "description": "Entities, attributes, records, fields, end users and functional requirements.",
    "order": 1
  },
  {
    "id": "ddd-relational-02",
    "areaId": "ddd",
    "number": 2,
    "title": "Flat files and relational databases",
    "description": "Data duplication, update and deletion anomalies, and splitting data into linked tables.",
    "order": 2
  },
  {
    "id": "ddd-keys-03",
    "areaId": "ddd",
    "number": 3,
    "title": "Primary and foreign keys",
    "description": "Choose suitable unique identifiers and link related records accurately.",
    "order": 3
  },
  {
    "id": "ddd-erd-04",
    "areaId": "ddd",
    "number": 4,
    "title": "Entity-relationship diagrams",
    "description": "Create two-entity one-to-many designs with keys, attributes and named relationships.",
    "order": 4
  },
  {
    "id": "ddd-dictionary-05",
    "areaId": "ddd",
    "number": 5,
    "title": "Data dictionaries",
    "description": "Plan field names, keys, data types, sizes, required status and validation.",
    "order": 5
  },
  {
    "id": "ddd-validation-06",
    "areaId": "ddd",
    "number": 6,
    "title": "Validation",
    "description": "Apply presence, restricted-choice, field-length and range checks.",
    "order": 6
  },
  {
    "id": "ddd-gdpr-07",
    "areaId": "ddd",
    "number": 7,
    "title": "Data protection and security",
    "description": "Apply data-protection principles and select appropriate security measures.",
    "order": 7
  },
  {
    "id": "ddd-integrity-08",
    "areaId": "ddd",
    "number": 8,
    "title": "Referential integrity",
    "description": "Keep primary-key and foreign-key links valid and prevent orphaned records.",
    "order": 8
  },
  {
    "id": "ddd-query-design-09",
    "areaId": "ddd",
    "number": 9,
    "title": "Designing database queries",
    "description": "Identify the tables, fields, criteria and sort order required before writing SQL.",
    "order": 9
  },
  {
    "id": "ddd-select-10",
    "areaId": "ddd",
    "number": 10,
    "title": "SQL SELECT and FROM",
    "description": "Retrieve all fields or selected fields from a single table.",
    "order": 10
  },
  {
    "id": "ddd-where-11",
    "areaId": "ddd",
    "number": 11,
    "title": "SQL WHERE criteria",
    "description": "Filter text, number and date values using comparison operators.",
    "order": 11
  },
  {
    "id": "ddd-logic-12",
    "areaId": "ddd",
    "number": 12,
    "title": "SQL AND and OR",
    "description": "Combine criteria accurately and predict which records are returned.",
    "order": 12
  },
  {
    "id": "ddd-order-13",
    "areaId": "ddd",
    "number": 13,
    "title": "SQL ORDER BY",
    "description": "Sort results in ascending or descending order using one or two fields.",
    "order": 13
  },
  {
    "id": "ddd-join-14",
    "areaId": "ddd",
    "number": 14,
    "title": "SQL equi-joins",
    "description": "Retrieve matching data from two linked tables using primary and foreign keys.",
    "order": 14
  },
  {
    "id": "ddd-insert-15",
    "areaId": "ddd",
    "number": 15,
    "title": "SQL INSERT",
    "description": "Add complete or partial records using fields and values in matching order.",
    "order": 15
  },
  {
    "id": "ddd-update-16",
    "areaId": "ddd",
    "number": 16,
    "title": "SQL UPDATE",
    "description": "Change one field, several fields or several records safely.",
    "order": 16
  },
  {
    "id": "ddd-delete-17",
    "areaId": "ddd",
    "number": 17,
    "title": "SQL DELETE",
    "description": "Remove precisely identified records without deleting unintended data.",
    "order": 17
  },
  {
    "id": "ddd-mastery-18",
    "areaId": "ddd",
    "number": 18,
    "title": "Integrated database mastery",
    "description": "Combine analysis, design, SQL, testing, debugging, referential integrity and evaluation.",
    "order": 18
  }
]);

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
      <p>A comment begins with <code>#</code>. Comments improve readability for people, and Python skips them during execution.</p>
      <p>Use separate <code>print()</code> instructions first. The <code>\n</code> newline shortcut appears later as an optional extension, after the clearer pattern is secure.</p>`,
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

const DDD_SQL_DATASETS = {
  "books": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Books (\n  bookID INTEGER PRIMARY KEY,\n  book_title TEXT NOT NULL,\n  author TEXT NOT NULL,\n  genre TEXT NOT NULL,\n  copies_sold INTEGER NOT NULL,\n  rating REAL NOT NULL,\n  published INTEGER NOT NULL\n);\nINSERT INTO Books VALUES\n(1,'Northern Lights','Philip Pullman','Fantasy',18,4.8,1995),\n(2,'The Explorer','Katherine Rundell','Adventure',7,4.7,2017),\n(3,'The Hobbit','J. R. R. Tolkien','Fantasy',25,4.9,1937),\n(4,'The Final Year','Matt Goodfellow','Poetry',6,4.6,2023),\n(5,'Wonder','R. J. Palacio','Contemporary',12,4.8,2012),\n(6,'The Last Bear','Hannah Gold','Adventure',9,4.9,2021);\n",
  "boats": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Dock (\n  dockID TEXT PRIMARY KEY,\n  dockName TEXT NOT NULL,\n  town TEXT NOT NULL\n);\nCREATE TABLE Boat (\n  boatID TEXT PRIMARY KEY,\n  model TEXT NOT NULL,\n  brand TEXT NOT NULL,\n  capacity INTEGER NOT NULL,\n  salePrice REAL NOT NULL,\n  dockID TEXT NOT NULL,\n  FOREIGN KEY (dockID) REFERENCES Dock(dockID) ON UPDATE RESTRICT ON DELETE RESTRICT\n);\nINSERT INTO Dock VALUES\n('D1','North Dock','Aberdeen'),\n('D2','River Dock','Dundee'),\n('D3','Clyde Dock','Glasgow'),\n('D4','Forth Dock','Edinburgh');\nINSERT INTO Boat VALUES\n('B101','WaveRunner','Yamaha',8,18500,'D1'),\n('B102','Targa 32','Fairline',10,72000,'D3'),\n('B103','Oceanis 30','Beneteau',6,54000,'D2'),\n('B104','FX Cruiser','Yamaha',3,14900,'D4'),\n('B105','Squadron 42','Fairline',12,118000,'D3'),\n('B106','Antares 8','Beneteau',8,46500,'D1');\n",
  "holidays": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Hotel (\n  hotelRef TEXT PRIMARY KEY,\n  hotelName TEXT NOT NULL,\n  town TEXT NOT NULL,\n  starRating INTEGER NOT NULL\n);\nCREATE TABLE Holiday (\n  holidayRef TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  destination TEXT NOT NULL,\n  country TEXT NOT NULL,\n  nights INTEGER NOT NULL,\n  hotelRef TEXT NOT NULL,\n  FOREIGN KEY (hotelRef) REFERENCES Hotel(hotelRef) ON UPDATE RESTRICT ON DELETE RESTRICT\n);\nINSERT INTO Hotel VALUES\n('H101','Harbour View','Aberdeen',4),\n('H102','Lochside Lodge','Inverness',5),\n('H103','City Central','Glasgow',3);\nINSERT INTO Holiday VALUES\n('P150','Northern Escape','Aberdeen','Scotland',3,'H101'),\n('P151','Highland Adventure','Inverness','Scotland',5,'H102'),\n('P152','City Weekend','Glasgow','Scotland',2,'H103'),\n('P153','Coastal Break','Aberdeen','Scotland',4,'H101');\n",
  "school": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Activity (\n  activityName TEXT PRIMARY KEY,\n  leader TEXT NOT NULL,\n  price REAL NOT NULL\n);\nCREATE TABLE Pupil (\n  pupilID INTEGER PRIMARY KEY,\n  forename TEXT NOT NULL,\n  surname TEXT NOT NULL,\n  className TEXT NOT NULL,\n  emergencyContact TEXT NOT NULL,\n  formReturned INTEGER NOT NULL,\n  activityName TEXT,\n  FOREIGN KEY (activityName) REFERENCES Activity(activityName) ON UPDATE RESTRICT ON DELETE RESTRICT\n);\nINSERT INTO Activity VALUES\n('Kayaking','Ms Reid',25),\n('Coding Challenge','Mr Khan',8),\n('Art Workshop','Mrs Hall',12),\n('Football','Mr Smith',5);\nINSERT INTO Pupil VALUES\n(101,'Ava','Brown','P7A','07111111111',1,'Kayaking'),\n(102,'Jamie','Singh','P7A','07222222222',1,'Coding Challenge'),\n(103,'Leah','Murray','P7B','07333333333',0,NULL),\n(104,'Noah','Wilson','P7B','07444444444',1,'Football'),\n(105,'Zara','Ahmed','P7A','07555555555',1,'Art Workshop');\n",
  "movies": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Movies (\n  movieID INTEGER PRIMARY KEY,\n  Name TEXT NOT NULL,\n  Type TEXT NOT NULL,\n  [Release Date] TEXT NOT NULL,\n  Length INTEGER NOT NULL,\n  Certificate INTEGER NOT NULL\n);\nINSERT INTO Movies VALUES\n(1,'Skybound','Adventure','2022-04-11',118,12),\n(2,'Quiet Street','Drama','2021-09-03',96,15),\n(3,'Robot School','Comedy','2024-02-16',111,12),\n(4,'Night Signal','Thriller','2020-10-30',124,15),\n(5,'Blue Planet','Documentary','2023-06-01',88,0);\n",
  "results": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Result (\n  pupilID INTEGER PRIMARY KEY,\n  forename TEXT NOT NULL,\n  surname TEXT NOT NULL,\n  test1 INTEGER NOT NULL,\n  test2 INTEGER NOT NULL\n);\nINSERT INTO Result VALUES\n(1,'Ava','Brown',72,81),\n(2,'Jamie','Singh',88,76),\n(3,'Leah','Murray',65,91),\n(4,'Noah','Wilson',88,69),\n(5,'Zara','Ahmed',72,95);\n",
  "shop": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Customer (\n  customerID TEXT PRIMARY KEY,\n  forename TEXT NOT NULL,\n  surname TEXT NOT NULL,\n  email TEXT NOT NULL\n);\nCREATE TABLE Orders (\n  orderID TEXT PRIMARY KEY,\n  orderDate TEXT NOT NULL,\n  total REAL NOT NULL,\n  status TEXT NOT NULL,\n  customerID TEXT NOT NULL,\n  FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON UPDATE RESTRICT ON DELETE RESTRICT\n);\nINSERT INTO Customer VALUES\n('C101','Katie','Shepherd','katie@example.com'),\n('C102','Lewis','Grant','lewis@example.com'),\n('C103','Mei','Chen','mei@example.com');\nINSERT INTO Orders VALUES\n('O501','2026-02-03',79.95,'Dispatched','C101'),\n('O502','2026-02-04',24.50,'Processing','C102'),\n('O503','2026-02-04',130.00,'Processing','C101'),\n('O504','2026-02-05',18.99,'Cancelled','C103');\n",
  "events": "\nPRAGMA foreign_keys = ON;\nCREATE TABLE Venue (\n  venueID TEXT PRIMARY KEY,\n  venueName TEXT NOT NULL,\n  town TEXT NOT NULL\n);\nCREATE TABLE Event (\n  eventID TEXT PRIMARY KEY,\n  eventName TEXT NOT NULL,\n  eventDate TEXT NOT NULL,\n  price REAL NOT NULL,\n  venueID TEXT NOT NULL,\n  FOREIGN KEY (venueID) REFERENCES Venue(venueID) ON UPDATE RESTRICT ON DELETE RESTRICT\n);\nINSERT INTO Venue VALUES\n('V1','Music Hall','Aberdeen'),\n('V2','Caird Hall','Dundee'),\n('V3','Concert Hall','Glasgow');\nINSERT INTO Event VALUES\n('E101','Youth Orchestra','2026-09-12',12.50,'V1'),\n('E102','Science Live','2026-10-02',8.00,'V2'),\n('E103','Comedy Night','2026-09-20',18.00,'V3'),\n('E104','Coding Expo','2026-11-05',5.00,'V1');\n"
};

const DDD_ACTIVITIES = [
  {
    "id": "DDD-01-01",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 1,
    "title": "Learn: What a database stores",
    "skills": [
      "database",
      "entity",
      "attribute",
      "record",
      "field"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A database is an organised collection of related data.</p>\n<p>An <strong>entity</strong> is a category of thing about which data is stored, such as Pupil or Event. In the implemented database, the <strong>entity name becomes the table name</strong>.</p>\n<div class=\"ddd-mini-table\"><div><strong>Table: Pupil</strong></div><div>pupilID</div><div>forename</div><div>className</div></div>\n<p>An <strong>attribute</strong> is a characteristic of the entity and becomes a field or column. A <strong>record</strong> is one complete row about one instance, such as one pupil, one event or one booking.</p>",
    "checkpoint": {
      "prompt": "Which word describes one complete row about one pupil?",
      "options": [
        "Record",
        "Field",
        "Entity/table"
      ],
      "answer": 0,
      "explanation": "A record is one complete row about one instance. The entity name is the table name."
    }
  },
  {
    "id": "DDD-01-02",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 2,
    "title": "Check: Entities, attributes, fields and records",
    "skills": [
      "entity",
      "attribute",
      "record",
      "field"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "In a library database, which is the most suitable entity?",
        "options": [
          "Book",
          "Book title",
          "Fantasy"
        ],
        "answer": 0,
        "explanation": "Book is the thing being described."
      },
      {
        "prompt": "Which is an attribute of a Book entity?",
        "options": [
          "author",
          "record",
          "database"
        ],
        "answer": 0,
        "explanation": "Author is one detail stored about each book."
      },
      {
        "prompt": "What does a database field hold?",
        "options": [
          "One category of data",
          "Every table in the system",
          "A complete backup"
        ],
        "answer": 0,
        "explanation": "A field stores one type of detail for each record."
      }
    ]
  },
  {
    "id": "DDD-01-03",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 3,
    "title": "Learn: End-user and functional requirements",
    "skills": [
      "end-user-requirement",
      "functional-requirement",
      "analysis"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<img class=\"ddd-resource-image\" src=\"ddd-requirements.png\" alt=\"Guide to writing end-user and functional requirements\">\n<p><strong>End-user requirement:</strong> what a named user should be able to display, edit, add or remove.</p>\n<p><strong>Functional requirement:</strong> what a query or database feature must do, such as selecting, inserting, updating or deleting specific data.</p>\n<p>Both must use details from the question context rather than vague wording.</p>",
    "checkpoint": {
      "prompt": "Which opening is appropriate for an end-user requirement?",
      "options": [
        "A user should be able to…",
        "SELECT * FROM…",
        "The field size is…"
      ],
      "answer": 0,
      "explanation": "End-user requirements describe what the user can do."
    }
  },
  {
    "id": "DDD-01-04",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 4,
    "title": "Check: Requirement types",
    "skills": [
      "end-user-requirement",
      "functional-requirement"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "“The organiser should be able to display pupils who have not returned a form.” What type is this?",
        "options": [
          "End-user requirement",
          "Data type",
          "Validation rule"
        ],
        "answer": 0,
        "explanation": "It describes what the organiser should be able to do."
      },
      {
        "prompt": "“A query to select pupil names where formReturned is False.” What type is this?",
        "options": [
          "Functional requirement",
          "End-user requirement",
          "Entity name"
        ],
        "answer": 0,
        "explanation": "It specifies a query operation."
      }
    ]
  },
  {
    "id": "DDD-01-05",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 5,
    "title": "Exam practice: Write an end-user requirement",
    "skills": [
      "end-user-requirement",
      "question-specific-evidence"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A school stores pupils and their chosen activity. The organiser needs to provide each activity leader with a list of pupil names, classes and emergency contacts.</p>\n<p>Write one suitable <strong>end-user requirement</strong>.</p>",
    "markingPoints": [
      "Begins with what the organiser or activity leader should be able to do.",
      "Uses the question-specific fields: pupil name, class and emergency contact.",
      "States the information should be displayed for a selected activity."
    ],
    "modelAnswer": "The organiser should be able to **display** each pupil’s **name, class and emergency contact details** for a selected activity."
  },
  {
    "id": "DDD-01-06",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 6,
    "title": "Exam practice: Write a functional requirement",
    "skills": [
      "functional-requirement",
      "select-query",
      "question-specific-evidence"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A boat retailer wants to find boats made by Yamaha or Fairline and display their model, capacity and sale price.</p>\n<p>Write one suitable <strong>functional requirement</strong>.</p>",
    "markingPoints": [
      "Identifies a SELECT/find query.",
      "States the Yamaha or Fairline criteria.",
      "States model, capacity and sale price should be displayed."
    ],
    "modelAnswer": "A query to **select and find** boats where the brand is **Yamaha or Fairline**, displaying the **model, capacity and sale price**."
  },
  {
    "id": "DDD-01-07",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "order": 7,
    "title": "Mastery: Database foundations",
    "skills": [
      "database",
      "requirements",
      "entity",
      "attribute"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which requirement must be specific to the question context?",
        "options": [
          "Both end-user and functional requirements",
          "Only end-user requirements",
          "Neither"
        ],
        "answer": 0,
        "explanation": "Both should use the actual users, fields and operations from the scenario."
      },
      {
        "prompt": "Which term means one detail stored about an entity?",
        "options": [
          "Attribute",
          "Record",
          "Relationship"
        ],
        "answer": 0,
        "explanation": "An attribute is a property or detail."
      },
      {
        "prompt": "Which statement is functional?",
        "options": [
          "A query to delete the cancelled event",
          "The organiser should be able to view events",
          "The user is a teacher"
        ],
        "answer": 0,
        "explanation": "It specifies a database operation."
      }
    ]
  },
  {
    "id": "DDD-02-01",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "order": 1,
    "title": "Learn: Problems with a flat-file database",
    "skills": [
      "flat-file",
      "data-duplication",
      "update-anomaly",
      "deletion-anomaly"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A <strong>flat-file database</strong> keeps everything in one table. This can create:</p>\n<ul><li><strong>Data duplication</strong> — the same details are stored repeatedly.</li><li><strong>Update anomaly</strong> — the same change must be made in several records.</li><li><strong>Deletion anomaly</strong> — deleting one record accidentally removes the only copy of other useful information.</li></ul>",
    "checkpoint": {
      "prompt": "A coach’s email appears in 20 pupil records. What problem is this?",
      "options": [
        "Data duplication",
        "Referential integrity",
        "Restricted choice"
      ],
      "answer": 0,
      "explanation": "The same information is repeated unnecessarily."
    }
  },
  {
    "id": "DDD-02-02",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "order": 2,
    "title": "Check: Identify flat-file problems",
    "skills": [
      "flat-file",
      "data-duplication",
      "update-anomaly",
      "deletion-anomaly"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "A phone number must be corrected in six records. Which problem is shown?",
        "options": [
          "Update anomaly",
          "Range check",
          "Equi-join"
        ],
        "answer": 0,
        "explanation": "The same fact has to be updated repeatedly."
      },
      {
        "prompt": "Deleting the final order also removes the only stored customer address. Which problem is shown?",
        "options": [
          "Deletion anomaly",
          "Data type error",
          "Presence check"
        ],
        "answer": 0,
        "explanation": "Useful related information is lost when a record is deleted."
      }
    ]
  },
  {
    "id": "DDD-02-03",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "order": 3,
    "title": "Learn: Split data into related tables",
    "skills": [
      "relational-database",
      "entity",
      "normalisation"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A relational database separates related subjects into tables. For an online shop:</p>\n<div class=\"erd-demo\"><div class=\"erd-entity\"><strong>Customer</strong><span>customerID (PK)</span><span>forename</span><span>email</span></div><div class=\"erd-link\"><strong>places</strong><span>1 ───── ∞</span></div><div class=\"erd-entity\"><strong>Orders</strong><span>orderID (PK)</span><span>orderDate</span><span>customerID (FK)</span></div></div>\n<p>Customer data is stored once, while each order stores the customer’s key.</p>",
    "checkpoint": {
      "prompt": "Where should a customer’s email be stored?",
      "options": [
        "Customer table only",
        "Every Orders record",
        "Both tables"
      ],
      "answer": 0,
      "explanation": "Store each fact in the entity it describes."
    }
  },
  {
    "id": "DDD-02-04",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "order": 4,
    "title": "Check: Choose the correct table",
    "skills": [
      "relational-database",
      "entity-design"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which field belongs in the Customer table?",
        "options": [
          "customerEmail",
          "orderTotal",
          "orderDate"
        ],
        "answer": 0,
        "explanation": "The email describes the customer."
      },
      {
        "prompt": "Which field belongs in the Orders table?",
        "options": [
          "orderID",
          "customerSurname repeated",
          "customerEmail repeated"
        ],
        "answer": 0,
        "explanation": "orderID uniquely identifies an order."
      },
      {
        "prompt": "What should link Orders to Customer?",
        "options": [
          "Customer primary key stored as a foreign key",
          "Customer surname copied into every order",
          "The table colour"
        ],
        "answer": 0,
        "explanation": "A foreign key creates the relationship."
      }
    ]
  },
  {
    "id": "DDD-02-05",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "order": 5,
    "title": "Exam practice: Explain why relational is better",
    "skills": [
      "relational-database",
      "data-duplication",
      "update-anomaly"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A sports club currently stores a coach’s name, email and every pupil they coach in one flat-file table.</p>\n<p>Explain one benefit of changing this to a relational database.</p>",
    "markingPoints": [
      "Names a flat-file problem such as duplication or update anomalies.",
      "Explains that coach details would be stored once in a Coach table.",
      "Links the tables using a key."
    ],
    "modelAnswer": "A relational database would reduce **data duplication** because each coach’s details would be stored once in a Coach table. Pupil records could link to the coach using a **foreign key**, so an email change would only need to be made once."
  },
  {
    "id": "DDD-02-06",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "order": 6,
    "title": "Mastery: Flat files and relations",
    "skills": [
      "flat-file",
      "relational-database",
      "anomalies"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which database design normally uses several linked tables?",
        "options": [
          "Relational database",
          "Flat file",
          "Text document"
        ],
        "answer": 0,
        "explanation": "Relational databases organise data into related tables."
      },
      {
        "prompt": "What is reduced when customer details are stored once?",
        "options": [
          "Data duplication",
          "Referential integrity",
          "Field size"
        ],
        "answer": 0,
        "explanation": "Repeated copies are removed."
      },
      {
        "prompt": "What does an update anomaly cause?",
        "options": [
          "The same fact must be changed in several places",
          "A value is always unique",
          "A query sorts correctly"
        ],
        "answer": 0,
        "explanation": "Repeated data creates inconsistent updates."
      }
    ]
  },
  {
    "id": "DDD-03-01",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "order": 1,
    "title": "Learn: Primary keys",
    "skills": [
      "primary-key",
      "uniqueness",
      "record-identification"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A <strong>primary key</strong> is an attribute that uniquely identifies each record. It must be unique and required.</p>\n<p>Good examples include <code>pupilID</code>, <code>orderID</code> or a genuinely unique email address. Names are usually unsuitable because two people can share the same name.</p>",
    "checkpoint": {
      "prompt": "Why is pupilID suitable as a primary key?",
      "options": [
        "It uniquely identifies each pupil",
        "It is always a surname",
        "It can be left blank"
      ],
      "answer": 0,
      "explanation": "A primary key must uniquely identify one record."
    }
  },
  {
    "id": "DDD-03-02",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "order": 2,
    "title": "Check: Choose a suitable primary key",
    "skills": [
      "primary-key",
      "uniqueness"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which is the best primary key for a Boat table?",
        "options": [
          "boatID",
          "brand",
          "capacity"
        ],
        "answer": 0,
        "explanation": "boatID can be made unique for every boat."
      },
      {
        "prompt": "Why is town usually unsuitable as a primary key?",
        "options": [
          "Many records can have the same town",
          "It is text",
          "It is too readable"
        ],
        "answer": 0,
        "explanation": "A primary key must be unique."
      }
    ]
  },
  {
    "id": "DDD-03-03",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "order": 3,
    "title": "Learn: Foreign keys",
    "skills": [
      "foreign-key",
      "relationship",
      "primary-key"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A <strong>foreign key</strong> is an attribute in one table that stores primary-key values from another table. It creates the link between related records.</p>\n<div class=\"key-link-example\"><span>Dock.<strong>dockID</strong> (PK)</span><span>→</span><span>Boat.<strong>dockID</strong> (FK)</span></div>",
    "checkpoint": {
      "prompt": "Where is the foreign key stored in a one-to-many relationship?",
      "options": [
        "On the many side",
        "Only on the one side",
        "In neither table"
      ],
      "answer": 0,
      "explanation": "Each record on the many side stores which one-side record it belongs to."
    }
  },
  {
    "id": "DDD-03-04",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "order": 4,
    "title": "Check: Primary or foreign key?",
    "skills": [
      "primary-key",
      "foreign-key",
      "one-to-many"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Hotel.hotelRef uniquely identifies each hotel. What key is it?",
        "options": [
          "Primary key",
          "Foreign key",
          "No key"
        ],
        "answer": 0,
        "explanation": "It uniquely identifies a Hotel record."
      },
      {
        "prompt": "Holiday.hotelRef stores the hotel used by each holiday. What key is it?",
        "options": [
          "Foreign key",
          "Primary key of Holiday",
          "Validation check"
        ],
        "answer": 0,
        "explanation": "It links each holiday to a valid hotel."
      },
      {
        "prompt": "In one Hotel to many Holidays, which table contains hotelRef as a foreign key?",
        "options": [
          "Holiday",
          "Hotel only",
          "Neither"
        ],
        "answer": 0,
        "explanation": "The foreign key is on the many side."
      }
    ]
  },
  {
    "id": "DDD-03-05",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "order": 5,
    "title": "Exam practice: Explain a foreign key",
    "skills": [
      "foreign-key",
      "relationship",
      "question-specific-evidence"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>The primary key of the Dock table is <code>dockID</code>. The Boat table also contains <code>dockID</code>.</p>\n<p>Explain the purpose of <code>dockID</code> in the Boat table.</p>",
    "markingPoints": [
      "States that dockID is a foreign key in Boat.",
      "States that it links a Boat record to its Dock record.",
      "Refers to the matching Dock.dockID primary key."
    ],
    "modelAnswer": "In the Boat table, **dockID is a foreign key**. It stores a value that matches the **dockID primary key in the Dock table**, linking each boat to the dock where it is located."
  },
  {
    "id": "DDD-03-06",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "order": 6,
    "title": "Mastery: Keys and links",
    "skills": [
      "primary-key",
      "foreign-key",
      "uniqueness"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which rule applies to every primary-key value?",
        "options": [
          "It must be unique",
          "It must be repeated",
          "It must be optional"
        ],
        "answer": 0,
        "explanation": "A primary key identifies exactly one record."
      },
      {
        "prompt": "What does a foreign key store?",
        "options": [
          "A matching primary-key value from another table",
          "A picture of the table",
          "A sort direction"
        ],
        "answer": 0,
        "explanation": "This creates the relationship."
      },
      {
        "prompt": "Which side normally contains the foreign key?",
        "options": [
          "Many side",
          "One side only",
          "Both sides as primary keys"
        ],
        "answer": 0,
        "explanation": "Each many-side record points to one parent record."
      }
    ]
  },
  {
    "id": "DDD-04-01",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 1,
    "title": "Learn: Read a one-to-many ERD",
    "skills": [
      "erd",
      "one-to-many",
      "entity",
      "relationship"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<div class=\"erd-demo large\"><div class=\"erd-entity\"><strong>Activity</strong><span>activityName (PK)</span><span>leader</span><span>price</span></div><div class=\"erd-link\"><strong>is selected by</strong><span>1 ───── ∞</span></div><div class=\"erd-entity\"><strong>Pupil</strong><span>pupilID (PK)</span><span>forename</span><span>activityName (FK)</span></div></div>\n<p>One activity can be selected by many pupils. Each pupil selects one activity. The relationship is therefore one-to-many.</p>",
    "checkpoint": {
      "prompt": "Which entity is on the many side?",
      "options": [
        "Pupil",
        "Activity",
        "Neither"
      ],
      "answer": 0,
      "explanation": "Many pupil records can refer to the same activity."
    }
  },
  {
    "id": "DDD-04-02",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 2,
    "title": "Check: One side or many side?",
    "skills": [
      "erd",
      "one-to-many"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "One team has many players; each player belongs to one team. Which is the one side?",
        "options": [
          "Team",
          "Player",
          "Both"
        ],
        "answer": 0,
        "explanation": "One team record relates to many player records."
      },
      {
        "prompt": "One customer places many orders. Where should customerID be a foreign key?",
        "options": [
          "Orders",
          "Customer",
          "Both as foreign keys"
        ],
        "answer": 0,
        "explanation": "Orders is the many side."
      }
    ]
  },
  {
    "id": "DDD-04-03",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 3,
    "title": "Learn: Add attributes and name the relationship",
    "skills": [
      "erd",
      "attributes",
      "relationship-name",
      "keys"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>An ERD should show:</p><ul><li>the two entity names;</li><li>appropriate attributes;</li><li>primary and foreign keys;</li><li>the one-to-many relationship;</li><li>a meaningful relationship name, such as <em>places</em>, <em>contains</em> or <em>selects</em>.</li></ul>\n<p>Read the design from both directions: a Customer <strong>places</strong> many Orders; each Order <strong>is placed by</strong> one Customer.</p>",
    "checkpoint": {
      "prompt": "Which relationship name best links Customer to Orders?",
      "options": [
        "places",
        "is a text field",
        "sorts"
      ],
      "answer": 0,
      "explanation": "Relationship names are verbs describing how entities relate."
    }
  },
  {
    "id": "DDD-04-04",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4,
    "title": "Check: Repair an ERD",
    "skills": [
      "erd",
      "foreign-key",
      "relationship"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "An ERD places customerID as an FK in Customer instead of Orders. What should change?",
        "options": [
          "Move the FK to Orders",
          "Delete both keys",
          "Make surname the FK"
        ],
        "answer": 0,
        "explanation": "The foreign key belongs on the many side."
      },
      {
        "prompt": "An ERD has two entities but no line between them. What is missing?",
        "options": [
          "Relationship",
          "Data type",
          "SQL semicolon"
        ],
        "answer": 0,
        "explanation": "The diagram must show how the entities relate."
      }
    ]
  },
  {
    "id": "DDD-04-05",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 5,
    "title": "Exam practice: Design the school activity ERD",
    "skills": [
      "erd",
      "one-to-many",
      "primary-key",
      "foreign-key"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A school stores 30 activities and 550 pupils. Each pupil selects one activity. Each activity has a unique activity name, leader and price. Pupil details include pupilID, name, class, emergency contact and whether a form was returned.</p>\n<p>Describe the two entities, their keys and the relationship that should appear in the ERD.</p>",
    "markingPoints": [
      "Names Activity and Pupil as the two entities.",
      "Uses activityName as a primary key in Activity and a foreign key in Pupil.",
      "Uses pupilID as the Pupil primary key.",
      "States one Activity to many Pupils and gives a relationship name such as selected by."
    ],
    "modelAnswer": "Use the entities **Activity** and **Pupil**. Activity has **activityName (PK)**, leader and price. Pupil has **pupilID (PK)**, pupil details and **activityName (FK)**. The relationship is **one Activity is selected by many Pupils**, while each Pupil selects one Activity."
  },
  {
    "id": "DDD-04-06",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 6,
    "title": "Mastery: ERDs",
    "skills": [
      "erd",
      "one-to-many",
      "keys"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What must an ERD relationship line communicate?",
        "options": [
          "How entities are related and the cardinality",
          "Only the font size",
          "The SQL result order"
        ],
        "answer": 0,
        "explanation": "The relationship and one/many sides are essential."
      },
      {
        "prompt": "Which attribute should be marked both PK and FK in the same table?",
        "options": [
          "Normally neither; a field’s role depends on the table",
          "Every surname",
          "Every price"
        ],
        "answer": 0,
        "explanation": "A parent key is PK in one table and the matching field is FK in the other."
      },
      {
        "prompt": "What is the maximum relationship complexity required here?",
        "options": [
          "Two entities with one-to-many",
          "Five entities with many-to-many",
          "No entities"
        ],
        "answer": 0,
        "explanation": "The National 5 design uses two related entities."
      }
    ]
  },
  {
    "id": "DDD-05-01",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "order": 1,
    "title": "Learn: What a data dictionary records",
    "skills": [
      "data-dictionary",
      "metadata",
      "attribute"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A <strong>data dictionary</strong> stores metadata — information about the database structure.</p>\n<table class=\"ddd-table\"><thead><tr><th>Attribute</th><th>Key</th><th>Type</th><th>Size</th><th>Required</th><th>Validation</th></tr></thead><tbody><tr><td>hotelRef</td><td>PK</td><td>Text</td><td>4</td><td>Yes</td><td>Length = 4</td></tr><tr><td>starRating</td><td></td><td>Number</td><td></td><td>Yes</td><td>Range 1–5</td></tr></tbody></table>",
    "checkpoint": {
      "prompt": "Which item is metadata?",
      "options": [
        "The data type assigned to a field",
        "One customer’s actual surname",
        "A query result"
      ],
      "answer": 0,
      "explanation": "The data dictionary describes the structure and rules."
    }
  },
  {
    "id": "DDD-05-02",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "order": 2,
    "title": "Check: Choose suitable data types",
    "skills": [
      "data-type",
      "text",
      "number",
      "boolean",
      "date",
      "time"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which type is suitable for formReturned?",
        "options": [
          "Boolean",
          "Date",
          "Text size 100"
        ],
        "answer": 0,
        "explanation": "The value has two states: true or false."
      },
      {
        "prompt": "Which type is suitable for dateRaised?",
        "options": [
          "Date",
          "Boolean",
          "Number of characters"
        ],
        "answer": 0,
        "explanation": "It stores a calendar date."
      },
      {
        "prompt": "A phone number begins with 0 and is not calculated. Which type is safest?",
        "options": [
          "Text",
          "Number",
          "Boolean"
        ],
        "answer": 0,
        "explanation": "Text preserves leading zeros."
      }
    ]
  },
  {
    "id": "DDD-05-03",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "order": 3,
    "title": "Check: Size and required status",
    "skills": [
      "field-size",
      "required",
      "primary-key"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which fields normally need a size at National 5?",
        "options": [
          "Text fields",
          "Every Boolean",
          "Every date"
        ],
        "answer": 0,
        "explanation": "Size limits the maximum text characters."
      },
      {
        "prompt": "Can a primary key be left empty?",
        "options": [
          "No, it must be required",
          "Yes, always",
          "Only when sorted"
        ],
        "answer": 0,
        "explanation": "Every record needs its unique identifier."
      }
    ]
  },
  {
    "id": "DDD-05-04",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "order": 4,
    "title": "Learn: Record foreign-key validation",
    "skills": [
      "data-dictionary",
      "foreign-key",
      "referential-integrity",
      "validation"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>For a foreign key, the validation should show that the value must already exist as a primary key in the related table.</p>\n<p>Example: <strong>Holiday.hotelRef (FK)</strong> — validation: <em>existing hotelRef from Hotel table</em>.</p>",
    "checkpoint": {
      "prompt": "Which validation is suitable for Holiday.hotelRef?",
      "options": [
        "Exists as a hotelRef in the Hotel table",
        "Range 1–5",
        "Length exactly 11"
      ],
      "answer": 0,
      "explanation": "The foreign key must match a valid parent key."
    }
  },
  {
    "id": "DDD-05-05",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "order": 5,
    "title": "Exam practice: Complete a data-dictionary row",
    "skills": [
      "data-dictionary",
      "data-type",
      "validation",
      "field-size"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A Hotel table contains <code>hotelRef</code>, a four-character primary key that cannot be left blank.</p>\n<p>State the key, data type, size, required status and one suitable validation rule.</p>",
    "markingPoints": [
      "Key is PK.",
      "Type is Text.",
      "Size is 4.",
      "Required is Yes.",
      "Validation is a length check of exactly four characters, or an appropriate restricted format."
    ],
    "modelAnswer": "<strong>hotelRef</strong>: **PK**, **Text**, size **4**, required **Yes**, validation **length = 4**."
  },
  {
    "id": "DDD-05-06",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "order": 6,
    "title": "Mastery: Data dictionaries",
    "skills": [
      "data-dictionary",
      "metadata",
      "validation"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What does each row in a data dictionary describe?",
        "options": [
          "One attribute",
          "One complete query",
          "One school"
        ],
        "answer": 0,
        "explanation": "Each row records rules for one attribute."
      },
      {
        "prompt": "What should be recorded for a restricted-choice validation?",
        "options": [
          "The actual allowed choices",
          "Only the words restricted choice",
          "A sort direction"
        ],
        "answer": 0,
        "explanation": "The exact choices make the rule usable."
      },
      {
        "prompt": "Which validation fits an FK?",
        "options": [
          "Value exists as a PK in the related table",
          "Always greater than 100",
          "Contains a space"
        ],
        "answer": 0,
        "explanation": "This preserves valid relationships."
      }
    ]
  },
  {
    "id": "DDD-06-01",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "order": 1,
    "title": "Learn: Four validation methods",
    "skills": [
      "validation",
      "presence-check",
      "restricted-choice",
      "length-check",
      "range-check"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<ul><li><strong>Presence check</strong>: a value must be entered.</li><li><strong>Restricted choice</strong>: the value must come from an allowed list.</li><li><strong>Field-length check</strong>: text must meet a minimum, maximum or exact length.</li><li><strong>Range check</strong>: a number, date or time must fall between limits.</li></ul>",
    "checkpoint": {
      "prompt": "Which validation makes sure a required email is not blank?",
      "options": [
        "Presence check",
        "Range check",
        "Sort"
      ],
      "answer": 0,
      "explanation": "A presence check prevents an empty field."
    }
  },
  {
    "id": "DDD-06-02",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "order": 2,
    "title": "Check: Match the validation",
    "skills": [
      "validation"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Star rating must be 1 to 5.",
        "options": [
          "Range check",
          "Presence check",
          "Equi-join"
        ],
        "answer": 0,
        "explanation": "The value must lie between numeric limits."
      },
      {
        "prompt": "Meal plan must be RO, BB, HB or FB.",
        "options": [
          "Restricted choice",
          "Length check",
          "Primary key"
        ],
        "answer": 0,
        "explanation": "Only listed options are accepted."
      },
      {
        "prompt": "A mobile number must contain exactly 11 characters.",
        "options": [
          "Length check",
          "Range check",
          "Boolean"
        ],
        "answer": 0,
        "explanation": "It checks the number of characters."
      }
    ]
  },
  {
    "id": "DDD-06-03",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "order": 3,
    "title": "Check: Choose the strongest rule",
    "skills": [
      "validation",
      "question-specific-evidence"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "A school activity price must be between £2 and £30. Which rule is specific enough?",
        "options": [
          "Range: >=2 and <=30",
          "Range check",
          "Required"
        ],
        "answer": 0,
        "explanation": "State the actual lower and upper limits."
      },
      {
        "prompt": "Town can only be Aberdeen, Dundee, Glasgow or Edinburgh. Which rule is complete?",
        "options": [
          "Restricted choice: Aberdeen, Dundee, Glasgow, Edinburgh",
          "Restricted choice",
          "Text"
        ],
        "answer": 0,
        "explanation": "The allowed values must be listed."
      }
    ]
  },
  {
    "id": "DDD-06-04",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "order": 4,
    "title": "Exam practice: Justify validation",
    "skills": [
      "validation",
      "range-check",
      "justification"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>The Activity table stores prices from £2 to £30.</p><p>State and justify a suitable validation rule for <code>price</code>.</p>",
    "markingPoints": [
      "Names a range check.",
      "States the limits >=2 and <=30.",
      "Explains that values outside the permitted price range are rejected."
    ],
    "modelAnswer": "Use a **range check: price >= 2 AND price <= 30**. This rejects prices outside the permitted £2–£30 range."
  },
  {
    "id": "DDD-06-05",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "order": 5,
    "title": "Debug: Spot weak validation answers",
    "skills": [
      "validation",
      "debugging"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "A pupil writes only “range check” for activity price. What is missing?",
        "options": [
          "The actual minimum and maximum values",
          "The table colour",
          "An ORDER BY clause"
        ],
        "answer": 0,
        "explanation": "The rule must be specific to the scenario."
      },
      {
        "prompt": "A pupil uses a range check for a list of four meal plans. What should replace it?",
        "options": [
          "Restricted choice with the four values",
          "Presence check only",
          "Primary key"
        ],
        "answer": 0,
        "explanation": "A fixed list needs restricted choice."
      }
    ]
  },
  {
    "id": "DDD-06-06",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "order": 6,
    "title": "Mastery: Validation",
    "skills": [
      "validation",
      "presence-check",
      "restricted-choice",
      "length-check",
      "range-check"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which validation is always appropriate for a primary key?",
        "options": [
          "Presence check",
          "Optional field",
          "No validation"
        ],
        "answer": 0,
        "explanation": "A record cannot have a missing primary key."
      },
      {
        "prompt": "Which validation is suited to a time between 14:00 and 16:00?",
        "options": [
          "Range check",
          "Restricted choice of every possible minute",
          "Primary key"
        ],
        "answer": 0,
        "explanation": "The time must fall within limits."
      },
      {
        "prompt": "Does validation prove entered data is true?",
        "options": [
          "No, it only checks that it is acceptable",
          "Yes, always",
          "Only after sorting"
        ],
        "answer": 0,
        "explanation": "Validation does not guarantee factual accuracy."
      }
    ]
  },
  {
    "id": "DDD-07-01",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "order": 1,
    "title": "Learn: Data-protection principles",
    "skills": [
      "data-protection",
      "lawful-processing",
      "purpose-limitation",
      "data-minimisation",
      "accuracy",
      "retention",
      "security"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Personal data should be:</p><ul><li>processed lawfully, fairly and transparently;</li><li>used only for the stated purpose;</li><li>limited to what is necessary;</li><li>kept accurate;</li><li>kept no longer than necessary;</li><li>protected securely.</li></ul>",
    "checkpoint": {
      "prompt": "A sports club collects passport numbers although it only needs emergency contacts. Which principle is broken?",
      "options": [
        "Data minimisation",
        "Purpose limitation",
        "Accuracy"
      ],
      "answer": 0,
      "explanation": "Data minimisation means collecting only the personal data needed for the declared purpose."
    }
  },
  {
    "id": "DDD-07-02",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "order": 2,
    "title": "Check: Apply data-protection principles",
    "skills": [
      "data-protection"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Old pupil emergency contacts are kept indefinitely after pupils leave. Which concern applies?",
        "options": [
          "Storage limitation",
          "Field length",
          "Primary key"
        ],
        "answer": 0,
        "explanation": "Personal data should not be kept longer than needed."
      },
      {
        "prompt": "A school leaves inaccurate phone numbers uncorrected. Which principle applies?",
        "options": [
          "Accuracy",
          "Sorting",
          "One-to-many"
        ],
        "answer": 0,
        "explanation": "Stored personal data should be kept accurate."
      },
      {
        "prompt": "A database is used for an unrelated purpose without telling users. Which principle applies?",
        "options": [
          "Purpose limitation and transparency",
          "ASC order",
          "Restricted choice"
        ],
        "answer": 0,
        "explanation": "Use should match the stated purpose and be transparent."
      }
    ]
  },
  {
    "id": "DDD-07-03",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "order": 3,
    "title": "Learn: Secure database access",
    "skills": [
      "security",
      "access-control",
      "authentication",
      "backup",
      "encryption"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Appropriate protections include strong authentication, access levels, encryption, secure backups and limiting staff to the data they need.</p>\n<p>Security choices should be justified using the risk in the scenario.</p>",
    "checkpoint": {
      "prompt": "Which control stops pupils opening the teacher’s database-management screen?",
      "options": [
        "Access levels",
        "A longer field name",
        "ORDER BY"
      ],
      "answer": 0,
      "explanation": "Access controls restrict features and data by role."
    }
  },
  {
    "id": "DDD-07-04",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "order": 4,
    "title": "Exam practice: Data protection in context",
    "skills": [
      "data-protection",
      "security",
      "question-specific-evidence"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A school activity database stores pupil names, classes and emergency contacts. State two actions the school should take to handle this personal data appropriately.</p>",
    "markingPoints": [
      "One relevant data-protection action, such as collecting only necessary details or deleting them when no longer needed.",
      "A second relevant action, such as keeping information accurate or restricting access.",
      "Uses the pupil/emergency-contact context."
    ],
    "modelAnswer": "The school should collect only the **necessary pupil and emergency-contact details** and delete them when they are no longer needed. Access should be restricted to authorised organisers and activity leaders so the personal data is kept **secure**."
  },
  {
    "id": "DDD-07-05",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "order": 5,
    "title": "Mastery: Protection and security",
    "skills": [
      "data-protection",
      "security"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which action supports data minimisation?",
        "options": [
          "Collect only fields needed for the stated task",
          "Collect every possible detail",
          "Keep duplicate copies everywhere"
        ],
        "answer": 0,
        "explanation": "Only necessary personal data should be collected."
      },
      {
        "prompt": "Which action supports accuracy?",
        "options": [
          "Correct known errors promptly",
          "Never allow updates",
          "Delete the primary key"
        ],
        "answer": 0,
        "explanation": "Personal data should be accurate and current."
      },
      {
        "prompt": "Which action supports security?",
        "options": [
          "Role-based access",
          "Public passwords",
          "No backups"
        ],
        "answer": 0,
        "explanation": "Only authorised users should access sensitive data."
      }
    ]
  },
  {
    "id": "DDD-08-01",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "order": 1,
    "title": "Learn: Referential integrity",
    "skills": [
      "referential-integrity",
      "foreign-key",
      "orphan-record"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p><strong>Referential integrity</strong> ensures that every foreign-key value matches an existing primary-key value in the related table.</p>\n<p>It prevents <strong>orphaned records</strong> and keeps the relationship accurate.</p>\n<div class=\"key-link-example\"><span>Hotel.H101 (PK)</span><span>✓</span><span>Holiday.H101 (FK)</span></div>\n<div class=\"key-link-example invalid\"><span>No Hotel.H999</span><span>✗</span><span>Holiday.H999 (FK)</span></div>",
    "checkpoint": {
      "prompt": "Why must Holiday.hotelRef match a Hotel.hotelRef?",
      "options": [
        "To prevent an orphaned Holiday record",
        "To sort alphabetically",
        "To set a field size"
      ],
      "answer": 0,
      "explanation": "Every foreign key must point to a valid parent record."
    }
  },
  {
    "id": "DDD-08-02",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "order": 2,
    "title": "Check: Referential-integrity rules",
    "skills": [
      "referential-integrity",
      "primary-key",
      "foreign-key"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Can a child record be added with a foreign key that does not exist in the parent table?",
        "options": [
          "No",
          "Yes, always",
          "Only when sorted"
        ],
        "answer": 0,
        "explanation": "The foreign key must match a valid primary key."
      },
      {
        "prompt": "Can a parent primary key be deleted while child records still reference it?",
        "options": [
          "No, not if that would leave orphans",
          "Yes, without consequence",
          "Only if it is text"
        ],
        "answer": 0,
        "explanation": "The relationship would be broken."
      },
      {
        "prompt": "Which table should normally be populated first?",
        "options": [
          "The one/parent table",
          "The many/child table with unknown foreign keys",
          "Neither"
        ],
        "answer": 0,
        "explanation": "Parent keys must exist before child foreign keys can reference them."
      }
    ]
  },
  {
    "id": "DDD-08-03",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "order": 3,
    "title": "SQL lab: Repair an invalid foreign key",
    "skills": [
      "referential-integrity",
      "insert",
      "foreign-key"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "holidays",
    "promptHtml": "<p>The starter query tries to add a holiday using hotel reference <code>H999</code>, which does not exist. Repair it so the record links to the Harbour View hotel (<code>H101</code>).</p>",
    "starterSql": "INSERT INTO Holiday (holidayRef, title, destination, country, nights, hotelRef)\nVALUES ('P160', 'Dune Sledging', 'Aberdeen', 'Scotland', 2, 'H999');",
    "solutionSql": "INSERT INTO Holiday (holidayRef, title, destination, country, nights, hotelRef)\nVALUES ('P160', 'Dune Sledging', 'Aberdeen', 'Scotland', 2, 'H101');",
    "checkSql": "SELECT holidayRef, title, hotelRef FROM Holiday ORDER BY holidayRef;",
    "previewTables": [
      "Hotel",
      "Holiday"
    ],
    "hints": [
      "The final value must match an existing Hotel.hotelRef.",
      "Harbour View has hotelRef H101."
    ]
  },
  {
    "id": "DDD-08-04",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "order": 4,
    "title": "Learn: Updates and deletes must preserve links",
    "skills": [
      "referential-integrity",
      "update",
      "delete"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Without cascading rules, a parent primary key cannot be updated or deleted if child records still refer to it.</p>\n<p>At National 5, explain that the operation is prevented because it would break the relationship and create orphaned records.</p>",
    "checkpoint": {
      "prompt": "Why might deleting Hotel H101 be prevented?",
      "options": [
        "Holidays still reference H101",
        "H101 is in ascending order",
        "The hotel name is text"
      ],
      "answer": 0,
      "explanation": "Deleting it would leave linked Holiday records without a parent."
    }
  },
  {
    "id": "DDD-08-05",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "order": 5,
    "title": "Exam practice: Explain referential integrity",
    "skills": [
      "referential-integrity",
      "orphan-record",
      "question-specific-evidence"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A Holiday record stores <code>hotelRef = H101</code>. A user tries to delete the Hotel record with primary key <code>H101</code>.</p><p>Explain why the database may prevent the deletion.</p>",
    "markingPoints": [
      "States that H101 is still used as a foreign key in Holiday.",
      "States that deletion would break the relationship or create an orphaned record.",
      "Names referential integrity."
    ],
    "modelAnswer": "The deletion is prevented by **referential integrity** because **Holiday.hotelRef H101** still refers to the Hotel record. Removing the Hotel would create an **orphaned Holiday record** with no matching primary key."
  },
  {
    "id": "DDD-08-06",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "order": 6,
    "title": "Mastery: Referential integrity",
    "skills": [
      "referential-integrity",
      "orphan-record"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What is an orphaned record?",
        "options": [
          "A child record whose foreign key has no matching parent primary key",
          "A sorted record",
          "A record with a long surname"
        ],
        "answer": 0,
        "explanation": "Its relationship points to nothing valid."
      },
      {
        "prompt": "Which rule validates a foreign key in a data dictionary?",
        "options": [
          "Exists as a primary key in the related table",
          "Always begins with A",
          "DESC"
        ],
        "answer": 0,
        "explanation": "The value must match a valid parent key."
      },
      {
        "prompt": "What does referential integrity protect?",
        "options": [
          "The validity of links between tables",
          "Only font size",
          "Only query capital letters"
        ],
        "answer": 0,
        "explanation": "It keeps relationships consistent."
      }
    ]
  },
  {
    "id": "DDD-09-01",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "order": 1,
    "title": "Learn: Plan a query before SQL",
    "skills": [
      "query-design",
      "tables",
      "fields",
      "criteria",
      "sort-order"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Before writing SQL, identify:</p><ol><li><strong>Tables required</strong></li><li><strong>Fields to display</strong></li><li><strong>Search criteria</strong></li><li><strong>Sort order</strong></li></ol>\n<p>Use the exact field and table names shown in the database.</p>",
    "checkpoint": {
      "prompt": "A question asks for boat model and price for Yamaha boats. Which is a criterion?",
      "options": [
        "brand = Yamaha",
        "model and price",
        "Boat table"
      ],
      "answer": 0,
      "explanation": "The criterion decides which records are included."
    }
  },
  {
    "id": "DDD-09-02",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "order": 2,
    "title": "Check: Identify query components",
    "skills": [
      "query-design"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "“Display model, capacity and salePrice.” What does this identify?",
        "options": [
          "Fields to display",
          "Search criteria",
          "Table relationship only"
        ],
        "answer": 0,
        "explanation": "These become the SELECT list."
      },
      {
        "prompt": "“Only boats with capacity less than 9.” What does this identify?",
        "options": [
          "Search criterion",
          "Sort order",
          "Entity name only"
        ],
        "answer": 0,
        "explanation": "It filters the records."
      },
      {
        "prompt": "“Highest salePrice first.” What does this identify?",
        "options": [
          "Sort order: salePrice DESC",
          "A primary key",
          "A presence check"
        ],
        "answer": 0,
        "explanation": "Highest first requires descending order."
      }
    ]
  },
  {
    "id": "DDD-09-03",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "order": 3,
    "title": "Learn: Use exact names and data formats",
    "skills": [
      "query-design",
      "field-name",
      "data-type"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>SQL must use the database’s exact field names. If a field contains spaces, place it in square brackets, such as <code>[Release Date]</code>.</p>\n<p>Text values use quotation marks; number values do not. Access-style dates commonly use hashtags, such as <code>#2024/12/31#</code>. The app accepts this format and translates it for its browser database.</p>",
    "checkpoint": {
      "prompt": "How should a field named Release Date be written?",
      "options": [
        "[Release Date]",
        "Release-Date",
        "“Release Date” as a value"
      ],
      "answer": 0,
      "explanation": "Square brackets identify a field name containing spaces."
    }
  },
  {
    "id": "DDD-09-04",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "order": 4,
    "title": "Check: Decode the wording",
    "skills": [
      "query-design",
      "comparison-operator"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "“At least 18” becomes which criterion?",
        "options": [
          "age >= 18",
          "age > 18",
          "age = 18 only"
        ],
        "answer": 0,
        "explanation": "At least includes 18."
      },
      {
        "prompt": "“Under £50” becomes which criterion?",
        "options": [
          "price < 50",
          "price <= 50",
          "price > 50"
        ],
        "answer": 0,
        "explanation": "Under means strictly less than."
      },
      {
        "prompt": "“Either red or blue” needs which operator?",
        "options": [
          "OR",
          "AND",
          "NOT"
        ],
        "answer": 0,
        "explanation": "Either condition may be true."
      }
    ]
  },
  {
    "id": "DDD-09-05",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "order": 5,
    "title": "Exam practice: Design a boat query",
    "skills": [
      "query-design",
      "tables",
      "fields",
      "criteria",
      "sort-order"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A customer wants the model, capacity and sale price of boats with capacity below 9. Results should show the highest sale price first.</p>\n<p>State the table, fields, criterion and sort order needed.</p>",
    "markingPoints": [
      "Table: Boat.",
      "Fields: model, capacity, salePrice.",
      "Criterion: capacity < 9.",
      "Sort: salePrice DESC."
    ],
    "modelAnswer": "Use the **Boat** table. Display **model, capacity and salePrice**. Use the criterion **capacity < 9** and sort by **salePrice DESC**."
  },
  {
    "id": "DDD-09-06",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "order": 6,
    "title": "Mastery: Query design",
    "skills": [
      "query-design"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which SQL clause is created from the fields-to-display plan?",
        "options": [
          "SELECT",
          "WHERE",
          "ORDER BY only"
        ],
        "answer": 0,
        "explanation": "SELECT lists output fields."
      },
      {
        "prompt": "Which plan item decides whether two tables are needed?",
        "options": [
          "Tables required",
          "Font size",
          "Field length"
        ],
        "answer": 0,
        "explanation": "The required fields may be stored across linked tables."
      },
      {
        "prompt": "Which plan item may contain two fields?",
        "options": [
          "Sort order",
          "Primary key definition",
          "Entity count"
        ],
        "answer": 0,
        "explanation": "National 5 queries can use two-level sorting."
      }
    ]
  },
  {
    "id": "DDD-10-01",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 1,
    "title": "Learn: SELECT and FROM",
    "skills": [
      "select",
      "from",
      "sql"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<pre class=\"sql-code\">SELECT field1, field2\nFROM TableName;</pre>\n<p><code>SELECT</code> lists the fields to display. Use <code>*</code> for every field. <code>FROM</code> states the table.</p>\n<p>Separate field names with commas and use exact spelling.</p>",
    "checkpoint": {
      "prompt": "Which symbol selects every field?",
      "options": [
        "*",
        "%",
        "#"
      ],
      "answer": 0,
      "explanation": "The asterisk means all fields."
    }
  },
  {
    "id": "DDD-10-02",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 2,
    "title": "SQL lab: Display every book field",
    "skills": [
      "select",
      "from",
      "sql"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Display every field and every record from the Books table.</p>",
    "starterSql": "SELECT \nFROM Books;",
    "solutionSql": "SELECT * FROM Books;",
    "checkSql": "",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "Use * after SELECT.",
      "The table name is Books."
    ]
  },
  {
    "id": "DDD-10-03",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 3,
    "title": "SQL lab: Select specific fields",
    "skills": [
      "select",
      "from",
      "sql"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Display only <code>book_title</code> and <code>author</code> from Books.</p>",
    "starterSql": "SELECT \nFROM Books;",
    "solutionSql": "SELECT book_title, author FROM Books;",
    "checkSql": "",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "Separate the two field names with a comma."
    ]
  },
  {
    "id": "DDD-10-04",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 4,
    "title": "SQL lab: A field name with spaces",
    "skills": [
      "select",
      "from",
      "square-brackets"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "movies",
    "promptHtml": "<p>Display movie <code>Name</code> and <code>Release Date</code>. The second field contains a space.</p>",
    "starterSql": "SELECT Name, Release Date\nFROM Movies;",
    "solutionSql": "SELECT Name, [Release Date] FROM Movies;",
    "checkSql": "",
    "previewTables": [
      "Movies"
    ],
    "hints": [
      "Place a field name containing spaces inside square brackets."
    ]
  },
  {
    "id": "DDD-10-05",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 5,
    "title": "Debug: SELECT mistakes",
    "skills": [
      "select",
      "from",
      "sql-debugging"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "The table is named Boat, but the query says FROM Boats. What is wrong?",
        "options": [
          "The table name is misspelled",
          "SELECT needs quotes",
          "ORDER BY is required"
        ],
        "answer": 0,
        "explanation": "SQL must use the exact table name."
      },
      {
        "prompt": "SELECT model capacity FROM Boat; What is missing?",
        "options": [
          "A comma between the field names",
          "A foreign key",
          "A range check"
        ],
        "answer": 0,
        "explanation": "Selected fields are comma-separated."
      }
    ]
  },
  {
    "id": "DDD-10-06",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 6,
    "title": "Exam practice: Basic SELECT",
    "skills": [
      "select",
      "from",
      "sql"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL query to display only the <code>forename</code> and <code>surname</code> fields from the Customer table.</p>",
    "markingPoints": [
      "SELECT lists forename and surname.",
      "FROM uses Customer.",
      "Fields are separated by a comma."
    ],
    "modelAnswer": "<pre>SELECT forename, surname\nFROM Customer;</pre>"
  },
  {
    "id": "DDD-10-07",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 7,
    "title": "Mastery: SELECT and FROM",
    "skills": [
      "select",
      "from",
      "sql"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What does FROM state?",
        "options": [
          "The table containing the data",
          "The result order",
          "The primary key rule"
        ],
        "answer": 0,
        "explanation": "FROM names the source table or tables."
      },
      {
        "prompt": "Can SQL field spelling differ from the table?",
        "options": [
          "No, use the exact field name",
          "Yes, any synonym works",
          "Only plurals work"
        ],
        "answer": 0,
        "explanation": "The database must recognise the field."
      },
      {
        "prompt": "What does SELECT * request?",
        "options": [
          "All fields",
          "Only the primary key",
          "No records"
        ],
        "answer": 0,
        "explanation": "* selects every column."
      }
    ]
  },
  {
    "id": "DDD-11-01",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 1,
    "title": "Learn: Filter with WHERE",
    "skills": [
      "where",
      "comparison-operator",
      "text-criteria",
      "number-criteria",
      "date-criteria"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<pre class=\"sql-code\">SELECT model, capacity\nFROM Boat\nWHERE capacity &lt; 9;</pre>\n<p>Text criteria need quotes. Numbers do not. Dates in Access-style SQL commonly use hashtags.</p>",
    "checkpoint": {
      "prompt": "Which clause filters records?",
      "options": [
        "WHERE",
        "FROM",
        "VALUES"
      ],
      "answer": 0,
      "explanation": "WHERE states the search criteria."
    }
  },
  {
    "id": "DDD-11-02",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 2,
    "title": "SQL lab: Number criterion",
    "skills": [
      "select",
      "where",
      "number-criteria"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "boats",
    "promptHtml": "<p>Display model, capacity and salePrice for boats with capacity less than 9.</p>",
    "starterSql": "SELECT model, capacity, salePrice\nFROM Boat\nWHERE ;",
    "solutionSql": "SELECT model, capacity, salePrice FROM Boat WHERE capacity < 9;",
    "checkSql": "",
    "previewTables": [
      "Boat"
    ],
    "hints": [
      "The criterion is capacity < 9.",
      "Numbers do not need quotation marks."
    ]
  },
  {
    "id": "DDD-11-03",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 3,
    "title": "SQL lab: Text criterion",
    "skills": [
      "select",
      "where",
      "text-criteria"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "boats",
    "promptHtml": "<p>Display every field for boats made by Yamaha.</p>",
    "starterSql": "SELECT *\nFROM Boat\nWHERE brand = ;",
    "solutionSql": "SELECT * FROM Boat WHERE brand = 'Yamaha';",
    "checkSql": "",
    "previewTables": [
      "Boat"
    ],
    "hints": [
      "Yamaha is text, so use quotation marks."
    ]
  },
  {
    "id": "DDD-11-04",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 4,
    "title": "SQL lab: Date criterion",
    "skills": [
      "select",
      "where",
      "date-criteria"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "events",
    "promptHtml": "<p>Display eventName and price for events on 20 September 2026. You may use <code>#20/09/2026#</code> or the stored ISO date.</p>",
    "starterSql": "SELECT eventName, price\nFROM Event\nWHERE eventDate = ;",
    "solutionSql": "SELECT eventName, price FROM Event WHERE eventDate = '2026-09-20';",
    "checkSql": "",
    "previewTables": [
      "Event"
    ],
    "hints": [
      "The app accepts #20/09/2026# and converts it to the stored date."
    ]
  },
  {
    "id": "DDD-11-05",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 5,
    "title": "Check: Comparison wording",
    "skills": [
      "where",
      "comparison-operator"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "“capacity of 9 or fewer” becomes:",
        "options": [
          "capacity <= 9",
          "capacity < 9",
          "capacity >= 9"
        ],
        "answer": 0,
        "explanation": "Or fewer includes 9."
      },
      {
        "prompt": "“rating above 4.8” becomes:",
        "options": [
          "rating > 4.8",
          "rating >= 4.8",
          "rating < 4.8"
        ],
        "answer": 0,
        "explanation": "Above is strictly greater than."
      },
      {
        "prompt": "Does the WHERE field have to be in SELECT?",
        "options": [
          "No",
          "Yes, always",
          "Only if it is text"
        ],
        "answer": 0,
        "explanation": "A query can filter using a field that is not displayed."
      }
    ]
  },
  {
    "id": "DDD-11-06",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 6,
    "title": "Exam practice: WHERE query",
    "skills": [
      "select",
      "where",
      "sql"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL query to display the <code>Name</code>, <code>Type</code> and <code>Release Date</code> of movies with a length greater than 110.</p>",
    "markingPoints": [
      "Correct SELECT fields.",
      "FROM Movies.",
      "WHERE Length > 110.",
      "Uses square brackets around Release Date."
    ],
    "modelAnswer": "<pre>SELECT Name, Type, [Release Date]\nFROM Movies\nWHERE Length > 110;</pre>"
  },
  {
    "id": "DDD-11-07",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 7,
    "title": "Mastery: WHERE",
    "skills": [
      "where",
      "criteria"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which values need quotation marks?",
        "options": [
          "Text values",
          "Every number",
          "Field names in all cases"
        ],
        "answer": 0,
        "explanation": "Text literals need quotes."
      },
      {
        "prompt": "Which operator means not equal?",
        "options": [
          "!=",
          "=<",
          "==="
        ],
        "answer": 0,
        "explanation": "!= means not equal."
      },
      {
        "prompt": "Which criterion finds books published before 2000?",
        "options": [
          "published < 2000",
          "published > 2000",
          "published = 'before'"
        ],
        "answer": 0,
        "explanation": "Before means a smaller year."
      }
    ]
  },
  {
    "id": "DDD-12-01",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 1,
    "title": "Learn: AND and OR in SQL",
    "skills": [
      "and",
      "or",
      "where",
      "logical-operator"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p><strong>AND</strong>: every condition must be true.</p><p><strong>OR</strong>: either condition may be true.</p>\n<pre class=\"sql-code\">WHERE brand = \"Yamaha\" OR brand = \"Fairline\"</pre>\n<pre class=\"sql-code\">WHERE capacity &lt; 9 AND salePrice &lt; 50000</pre>",
    "checkpoint": {
      "prompt": "Which operator is needed for boats that are Yamaha or Fairline?",
      "options": [
        "OR",
        "AND",
        "ORDER BY"
      ],
      "answer": 0,
      "explanation": "Either brand is acceptable."
    }
  },
  {
    "id": "DDD-12-02",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 2,
    "title": "SQL lab: Either brand",
    "skills": [
      "select",
      "where",
      "or"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "boats",
    "promptHtml": "<p>Display model, capacity and salePrice for boats whose brand is Yamaha or Fairline.</p>",
    "starterSql": "SELECT model, capacity, salePrice\nFROM Boat\nWHERE ;",
    "solutionSql": "SELECT model, capacity, salePrice FROM Boat WHERE brand = 'Yamaha' OR brand = 'Fairline';",
    "checkSql": "",
    "previewTables": [
      "Boat"
    ],
    "hints": [
      "Repeat the brand field in both conditions.",
      "Use OR because either brand is accepted."
    ]
  },
  {
    "id": "DDD-12-03",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 3,
    "title": "SQL lab: Both limits",
    "skills": [
      "select",
      "where",
      "and"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "boats",
    "promptHtml": "<p>Display model and salePrice for boats with capacity below 9 and salePrice below 50000.</p>",
    "starterSql": "SELECT model, salePrice\nFROM Boat\nWHERE ;",
    "solutionSql": "SELECT model, salePrice FROM Boat WHERE capacity < 9 AND salePrice < 50000;",
    "checkSql": "",
    "previewTables": [
      "Boat"
    ],
    "hints": [
      "Both conditions must be true, so use AND."
    ]
  },
  {
    "id": "DDD-12-04",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 4,
    "title": "SQL lab: Inclusive range",
    "skills": [
      "where",
      "and",
      "range"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Display book_title and rating for books with rating from 4.7 to 4.8 inclusive.</p>",
    "starterSql": "SELECT book_title, rating\nFROM Books\nWHERE ;",
    "solutionSql": "SELECT book_title, rating FROM Books WHERE rating >= 4.7 AND rating <= 4.8;",
    "checkSql": "",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "Inclusive limits use >= and <=.",
      "Repeat rating on both sides of AND."
    ]
  },
  {
    "id": "DDD-12-05",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 5,
    "title": "Debug: AND or OR?",
    "skills": [
      "and",
      "or",
      "sql-debugging"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "A query uses brand='Yamaha' AND brand='Fairline'. Why will it return no boats?",
        "options": [
          "One brand value cannot equal both at once",
          "The field needs no quotes",
          "SELECT cannot use model"
        ],
        "answer": 0,
        "explanation": "Use OR when either different value is accepted."
      },
      {
        "prompt": "A range uses age >=16 OR age <=18. Why is it too broad?",
        "options": [
          "Most ages satisfy at least one condition; use AND",
          "It should use DESC",
          "It needs two tables"
        ],
        "answer": 0,
        "explanation": "Both lower and upper limits must be met."
      }
    ]
  },
  {
    "id": "DDD-12-06",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 6,
    "title": "Exam practice: Combined criteria",
    "skills": [
      "select",
      "where",
      "and",
      "or"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL query to display book_title and author for books with fewer than 10 copies sold or a rating greater than 4.8.</p>",
    "markingPoints": [
      "SELECT book_title, author.",
      "FROM Books.",
      "WHERE copies_sold < 10 OR rating > 4.8."
    ],
    "modelAnswer": "<pre>SELECT book_title, author\nFROM Books\nWHERE copies_sold &lt; 10 OR rating &gt; 4.8;</pre>"
  },
  {
    "id": "DDD-12-07",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 7,
    "title": "Mastery: Logical criteria",
    "skills": [
      "and",
      "or",
      "where"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which operator is used when both conditions must be met?",
        "options": [
          "AND",
          "OR",
          "ASC"
        ],
        "answer": 0,
        "explanation": "AND requires both."
      },
      {
        "prompt": "Which operator joins alternative colours?",
        "options": [
          "OR",
          "AND",
          "FROM"
        ],
        "answer": 0,
        "explanation": "Any listed colour may match."
      },
      {
        "prompt": "Which condition finds values between 10 and 20 inclusive?",
        "options": [
          "value >= 10 AND value <= 20",
          "value >= 10 OR value <= 20",
          "value = 10,20"
        ],
        "answer": 0,
        "explanation": "Both limits must be met."
      }
    ]
  },
  {
    "id": "DDD-13-01",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 1,
    "title": "Learn: ORDER BY",
    "skills": [
      "order-by",
      "asc",
      "desc",
      "two-level-sort"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p><code>ORDER BY field ASC</code> sorts smallest-to-largest, A-to-Z or oldest-to-newest by date. <code>DESC</code> reverses the order.</p>\n<p>For two-level sorting, list the primary sort field first:</p><pre class=\"sql-code\">ORDER BY test1 ASC, test2 DESC;</pre>",
    "checkpoint": {
      "prompt": "Which direction puts the highest price first?",
      "options": [
        "DESC",
        "ASC",
        "WHERE"
      ],
      "answer": 0,
      "explanation": "Descending sorts largest to smallest."
    }
  },
  {
    "id": "DDD-13-02",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 2,
    "title": "SQL lab: Highest rating first",
    "skills": [
      "select",
      "order-by",
      "desc"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Display book_title and rating for every book, with the highest rating first.</p>",
    "starterSql": "SELECT book_title, rating\nFROM Books\nORDER BY ;",
    "solutionSql": "SELECT book_title, rating FROM Books ORDER BY rating DESC;",
    "checkSql": "",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "Highest first means DESC."
    ]
  },
  {
    "id": "DDD-13-03",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 3,
    "title": "SQL lab: Oldest publication first",
    "skills": [
      "select",
      "order-by",
      "asc"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Display book_title and published, with the oldest publication first.</p>",
    "starterSql": "SELECT book_title, published\nFROM Books\nORDER BY ;",
    "solutionSql": "SELECT book_title, published FROM Books ORDER BY published ASC;",
    "checkSql": "",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "Earlier years are smaller, so use ASC."
    ]
  },
  {
    "id": "DDD-13-04",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 4,
    "title": "SQL lab: Two-level sorting",
    "skills": [
      "select",
      "order-by",
      "two-level-sort"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "results",
    "promptHtml": "<p>Display forename, surname, test1 and test2. Sort by test1 ascending, then for equal test1 values put the highest test2 first.</p>",
    "starterSql": "SELECT forename, surname, test1, test2\nFROM Result\nORDER BY ;",
    "solutionSql": "SELECT forename, surname, test1, test2 FROM Result ORDER BY test1 ASC, test2 DESC;",
    "checkSql": "",
    "previewTables": [
      "Result"
    ],
    "hints": [
      "The first field is the primary sort.",
      "Separate the two sort instructions with a comma."
    ]
  },
  {
    "id": "DDD-13-05",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 5,
    "title": "Debug: Sorting mistakes",
    "skills": [
      "order-by",
      "sql-debugging"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "The question asks for highest price first but the query uses ASC. What should change?",
        "options": [
          "Use DESC",
          "Remove SELECT",
          "Add a primary key"
        ],
        "answer": 0,
        "explanation": "DESC sorts largest to smallest."
      },
      {
        "prompt": "The required order is colour, then highest price. Which ORDER BY is correct?",
        "options": [
          "ORDER BY colour ASC, price DESC",
          "ORDER BY price DESC, colour ASC",
          "ORDER BY colour AND price"
        ],
        "answer": 0,
        "explanation": "The primary sort field must appear first."
      }
    ]
  },
  {
    "id": "DDD-13-06",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 6,
    "title": "Exam practice: Filter and sort",
    "skills": [
      "select",
      "where",
      "order-by"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL query to display model, capacity and salePrice for boats with capacity below 9, showing the highest salePrice first.</p>",
    "markingPoints": [
      "Correct SELECT fields.",
      "FROM Boat.",
      "WHERE capacity < 9.",
      "ORDER BY salePrice DESC."
    ],
    "modelAnswer": "<pre>SELECT model, capacity, salePrice\nFROM Boat\nWHERE capacity &lt; 9\nORDER BY salePrice DESC;</pre>"
  },
  {
    "id": "DDD-13-07",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 7,
    "title": "Mastery: ORDER BY",
    "skills": [
      "order-by",
      "asc",
      "desc"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Is ASC required when ascending is intended?",
        "options": [
          "It may be omitted, but including it is clearer",
          "It is forbidden",
          "DESC means ascending"
        ],
        "answer": 0,
        "explanation": "ASC is the default."
      },
      {
        "prompt": "Which field controls the overall grouping in a two-field sort?",
        "options": [
          "The first field listed",
          "The second field only",
          "The primary key always"
        ],
        "answer": 0,
        "explanation": "The first field is the primary sort."
      },
      {
        "prompt": "Which direction normally puts A before Z?",
        "options": [
          "ASC",
          "DESC",
          "OR"
        ],
        "answer": 0,
        "explanation": "Ascending text order is A to Z."
      }
    ]
  },
  {
    "id": "DDD-14-01",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 1,
    "title": "Learn: Equi-join two tables",
    "skills": [
      "equi-join",
      "primary-key",
      "foreign-key",
      "select"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<pre class=\"sql-code\">SELECT Boat.model, Dock.dockName\nFROM Boat, Dock\nWHERE Dock.dockID = Boat.dockID;</pre>\n<p>The equi-join matches the primary key from the one table with the foreign key from the many table. Without it, every record can be combined with every other record incorrectly.</p>",
    "checkpoint": {
      "prompt": "What does the equi-join compare?",
      "options": [
        "Matching primary- and foreign-key fields",
        "Two sort directions",
        "Two field sizes"
      ],
      "answer": 0,
      "explanation": "The equality condition links related records."
    }
  },
  {
    "id": "DDD-14-02",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 2,
    "title": "SQL lab: Boats and docks",
    "skills": [
      "select",
      "equi-join",
      "two-tables"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "boats",
    "promptHtml": "<p>Display each boat model and the dockName where it is located.</p>",
    "starterSql": "SELECT Boat.model, Dock.dockName\nFROM Boat, Dock\nWHERE ;",
    "solutionSql": "SELECT Boat.model, Dock.dockName FROM Boat, Dock WHERE Dock.dockID = Boat.dockID;",
    "checkSql": "",
    "previewTables": [
      "Dock",
      "Boat"
    ],
    "hints": [
      "Link Dock.dockID to Boat.dockID.",
      "Both tables belong in FROM."
    ]
  },
  {
    "id": "DDD-14-03",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 3,
    "title": "SQL lab: Join with a further condition",
    "skills": [
      "select",
      "equi-join",
      "where",
      "and"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "boats",
    "promptHtml": "<p>Display boat model, brand and dockName for Fairline boats only.</p>",
    "starterSql": "SELECT Boat.model, Boat.brand, Dock.dockName\nFROM Boat, Dock\nWHERE Dock.dockID = Boat.dockID\n;",
    "solutionSql": "SELECT Boat.model, Boat.brand, Dock.dockName FROM Boat, Dock WHERE Dock.dockID = Boat.dockID AND Boat.brand = 'Fairline';",
    "checkSql": "",
    "previewTables": [
      "Dock",
      "Boat"
    ],
    "hints": [
      "Use AND to add the Fairline criterion after the equi-join."
    ]
  },
  {
    "id": "DDD-14-04",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 4,
    "title": "SQL lab: Holidays and hotels",
    "skills": [
      "select",
      "equi-join",
      "order-by"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "holidays",
    "promptHtml": "<p>Display Holiday.title, Hotel.hotelName and Hotel.starRating. Sort with the highest starRating first.</p>",
    "starterSql": "SELECT Holiday.title, Hotel.hotelName, Hotel.starRating\nFROM Holiday, Hotel\nWHERE \nORDER BY ;",
    "solutionSql": "SELECT Holiday.title, Hotel.hotelName, Hotel.starRating FROM Holiday, Hotel WHERE Hotel.hotelRef = Holiday.hotelRef ORDER BY Hotel.starRating DESC;",
    "checkSql": "",
    "previewTables": [
      "Hotel",
      "Holiday"
    ],
    "hints": [
      "The relationship uses hotelRef.",
      "Highest star rating first means DESC."
    ]
  },
  {
    "id": "DDD-14-05",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 5,
    "title": "Debug: Equi-join errors",
    "skills": [
      "equi-join",
      "sql-debugging"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "A query lists Boat and Dock in FROM but has no key-matching condition. What is missing?",
        "options": [
          "An equi-join in WHERE",
          "An INSERT statement",
          "A validation rule"
        ],
        "answer": 0,
        "explanation": "The tables must be linked using matching keys."
      },
      {
        "prompt": "Both tables contain dockID. How can the query make the field unambiguous?",
        "options": [
          "Use TableName.fieldName",
          "Rename every record",
          "Use quotes around the table"
        ],
        "answer": 0,
        "explanation": "Qualified names show which table supplies the field."
      },
      {
        "prompt": "What happens without an equi-join?",
        "options": [
          "Unrelated records are combined",
          "Referential integrity improves",
          "Only one record is shown"
        ],
        "answer": 0,
        "explanation": "A Cartesian product is produced."
      }
    ]
  },
  {
    "id": "DDD-14-06",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 6,
    "title": "Exam practice: Write an equi-join",
    "skills": [
      "select",
      "equi-join",
      "where"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL query to display each Holiday title and its Hotel name. The matching field is <code>hotelRef</code>.</p>",
    "markingPoints": [
      "SELECT includes Holiday.title and Hotel.hotelName.",
      "FROM includes Holiday and Hotel.",
      "WHERE matches Hotel.hotelRef = Holiday.hotelRef."
    ],
    "modelAnswer": "<pre>SELECT Holiday.title, Hotel.hotelName\nFROM Holiday, Hotel\nWHERE Hotel.hotelRef = Holiday.hotelRef;</pre>"
  },
  {
    "id": "DDD-14-07",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 7,
    "title": "Mastery: Equi-joins",
    "skills": [
      "equi-join",
      "two-tables"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Why are two tables needed in the boats-and-docks query?",
        "options": [
          "The requested fields are stored in different tables",
          "SQL always needs two tables",
          "To apply a length check"
        ],
        "answer": 0,
        "explanation": "The model and dock name come from different related tables."
      },
      {
        "prompt": "What connects the tables?",
        "options": [
          "PK = matching FK",
          "ASC = DESC",
          "SELECT = FROM"
        ],
        "answer": 0,
        "explanation": "The equality condition joins related rows."
      },
      {
        "prompt": "How is another search criterion added after the join?",
        "options": [
          "Using AND",
          "Using VALUES",
          "Using a second SELECT keyword"
        ],
        "answer": 0,
        "explanation": "AND combines the join condition with the filter."
      }
    ]
  },
  {
    "id": "DDD-15-01",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 1,
    "title": "Learn: INSERT records",
    "skills": [
      "insert",
      "values",
      "field-order"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<pre class=\"sql-code\">INSERT INTO Customer (customerID, forename, surname, email)\nVALUES ('C104', 'Amina', 'Ali', 'amina@example.com');</pre>\n<p>The field list and value list must contain the same number of items in the same order. Text and dates need suitable delimiters.</p>",
    "checkpoint": {
      "prompt": "What must match between the two lines?",
      "options": [
        "The number and order of fields and values",
        "The sort direction",
        "The relationship name"
      ],
      "answer": 0,
      "explanation": "Each value is inserted into its corresponding field."
    }
  },
  {
    "id": "DDD-15-02",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 2,
    "title": "SQL lab: Insert a customer",
    "skills": [
      "insert",
      "values",
      "primary-key"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "shop",
    "promptHtml": "<p>Add customer C104, Amina Ali, with email amina@example.com.</p>",
    "starterSql": "INSERT INTO Customer (customerID, forename, surname, email)\nVALUES ();",
    "solutionSql": "INSERT INTO Customer (customerID, forename, surname, email) VALUES ('C104','Amina','Ali','amina@example.com');",
    "checkSql": "SELECT * FROM Customer ORDER BY customerID;",
    "previewTables": [
      "Customer"
    ],
    "hints": [
      "Use four values in the same order as the four fields.",
      "C104 is text and must be quoted."
    ]
  },
  {
    "id": "DDD-15-03",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 3,
    "title": "SQL lab: Insert a linked order",
    "skills": [
      "insert",
      "foreign-key",
      "referential-integrity"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "shop",
    "promptHtml": "<p>Add order O505 dated 6 February 2026, total £46.25, status Processing, for customer C102.</p>",
    "starterSql": "INSERT INTO Orders (orderID, orderDate, total, status, customerID)\nVALUES ();",
    "solutionSql": "INSERT INTO Orders (orderID, orderDate, total, status, customerID) VALUES ('O505','2026-02-06',46.25,'Processing','C102');",
    "checkSql": "SELECT * FROM Orders ORDER BY orderID;",
    "previewTables": [
      "Customer",
      "Orders"
    ],
    "hints": [
      "The customerID foreign key must already exist.",
      "Keep the values in field order."
    ]
  },
  {
    "id": "DDD-15-04",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 4,
    "title": "SQL lab: Partial insert",
    "skills": [
      "insert",
      "partial-insert"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Add bookID 7, title New Worlds, author E. Stone, genre Science Fiction, copies_sold 0, rating 4.5 and published 2026.</p>",
    "starterSql": "INSERT INTO Books (bookID, book_title, author, genre, copies_sold, rating, published)\nVALUES ();",
    "solutionSql": "INSERT INTO Books (bookID, book_title, author, genre, copies_sold, rating, published) VALUES (7,'New Worlds','E. Stone','Science Fiction',0,4.5,2026);",
    "checkSql": "SELECT * FROM Books ORDER BY bookID;",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "There are seven fields, so provide seven values."
    ]
  },
  {
    "id": "DDD-15-05",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 5,
    "title": "Debug: INSERT mistakes",
    "skills": [
      "insert",
      "sql-debugging"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "An INSERT lists four fields but only three values. What is wrong?",
        "options": [
          "The number of values does not match",
          "ORDER BY is missing",
          "The FK should be a Boolean"
        ],
        "answer": 0,
        "explanation": "Every listed field needs a corresponding value."
      },
      {
        "prompt": "A new record reuses an existing primary key. What problem occurs?",
        "options": [
          "Duplicate primary key",
          "Two-level sorting",
          "Range validation"
        ],
        "answer": 0,
        "explanation": "Primary-key values must be unique."
      },
      {
        "prompt": "Values are in a different order from the fields. What can happen?",
        "options": [
          "Data is placed in the wrong columns",
          "The database sorts automatically",
          "The record becomes a relationship name"
        ],
        "answer": 0,
        "explanation": "Position determines which field receives each value."
      }
    ]
  },
  {
    "id": "DDD-15-06",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 6,
    "title": "Exam practice: INSERT",
    "skills": [
      "insert",
      "values"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL statement to add Dock D5, named Marina Dock, in Oban.</p>",
    "markingPoints": [
      "INSERT INTO Dock with the correct fields.",
      "VALUES contains D5, Marina Dock and Oban in matching order.",
      "Text values are quoted."
    ],
    "modelAnswer": "<pre>INSERT INTO Dock (dockID, dockName, town)\nVALUES ('D5', 'Marina Dock', 'Oban');</pre>"
  },
  {
    "id": "DDD-15-07",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "order": 7,
    "title": "Mastery: INSERT",
    "skills": [
      "insert",
      "values",
      "primary-key"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What follows INSERT INTO tableName?",
        "options": [
          "An optional field list in brackets",
          "ORDER BY only",
          "A relationship line"
        ],
        "answer": 0,
        "explanation": "The field list identifies where values go."
      },
      {
        "prompt": "Which error is caused by reusing C101?",
        "options": [
          "Duplicate primary key",
          "Missing sort",
          "Deletion anomaly"
        ],
        "answer": 0,
        "explanation": "The primary key must be unique."
      },
      {
        "prompt": "Can a child foreign key refer to a parent that does not exist?",
        "options": [
          "No, referential integrity prevents it",
          "Yes, always",
          "Only after UPDATE"
        ],
        "answer": 0,
        "explanation": "The relationship must remain valid."
      }
    ]
  },
  {
    "id": "DDD-16-01",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 1,
    "title": "Learn: UPDATE safely",
    "skills": [
      "update",
      "set",
      "where",
      "primary-key"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<pre class=\"sql-code\">UPDATE Customer\nSET surname = 'McSporran'\nWHERE customerID = 'C101';</pre>\n<p><code>UPDATE</code> names the table, <code>SET</code> states the change and <code>WHERE</code> identifies the intended record or records. Use a primary key when exactly one record must change.</p>",
    "checkpoint": {
      "prompt": "Which clause identifies the record to change?",
      "options": [
        "WHERE",
        "VALUES",
        "FROM in every update"
      ],
      "answer": 0,
      "explanation": "WHERE specifies the target record(s)."
    }
  },
  {
    "id": "DDD-16-02",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 2,
    "title": "SQL lab: Update one record",
    "skills": [
      "update",
      "set",
      "where",
      "primary-key"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "shop",
    "promptHtml": "<p>Change customer C101’s surname to McSporran.</p>",
    "starterSql": "UPDATE Customer\nSET surname = \nWHERE ;",
    "solutionSql": "UPDATE Customer SET surname = 'McSporran' WHERE customerID = 'C101';",
    "checkSql": "SELECT * FROM Customer ORDER BY customerID;",
    "previewTables": [
      "Customer"
    ],
    "hints": [
      "Use customerID because exactly one customer should change."
    ]
  },
  {
    "id": "DDD-16-03",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 3,
    "title": "SQL lab: Update several fields",
    "skills": [
      "update",
      "set",
      "multiple-fields"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "events",
    "promptHtml": "<p>For event E104, change the price to £6.50 and the date to 12 November 2026.</p>",
    "starterSql": "UPDATE Event\nSET \nWHERE eventID = 'E104';",
    "solutionSql": "UPDATE Event SET price = 6.50, eventDate = '2026-11-12' WHERE eventID = 'E104';",
    "checkSql": "SELECT * FROM Event ORDER BY eventID;",
    "previewTables": [
      "Event"
    ],
    "hints": [
      "Separate field assignments with a comma."
    ]
  },
  {
    "id": "DDD-16-04",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 4,
    "title": "SQL lab: Update several records",
    "skills": [
      "update",
      "where",
      "multiple-records"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "shop",
    "promptHtml": "<p>Change every Processing order to status Ready.</p>",
    "starterSql": "UPDATE Orders\nSET status = 'Ready'\nWHERE ;",
    "solutionSql": "UPDATE Orders SET status = 'Ready' WHERE status = 'Processing';",
    "checkSql": "SELECT * FROM Orders ORDER BY orderID;",
    "previewTables": [
      "Orders"
    ],
    "hints": [
      "Do not use one orderID because every Processing record must change."
    ]
  },
  {
    "id": "DDD-16-05",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 5,
    "title": "Debug: UPDATE mistakes",
    "skills": [
      "update",
      "sql-debugging",
      "primary-key"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Exactly one record should change, but WHERE uses surname='Smith'. What is the risk?",
        "options": [
          "Several records may be updated; use the primary key",
          "No record can ever update",
          "The SELECT list is wrong"
        ],
        "answer": 0,
        "explanation": "Non-unique criteria may match several records."
      },
      {
        "prompt": "The query updates price instead of status. What is wrong?",
        "options": [
          "The wrong field is named in SET",
          "FROM is missing",
          "The PK is duplicated"
        ],
        "answer": 0,
        "explanation": "SET must target the requested field."
      },
      {
        "prompt": "What happens if WHERE is omitted?",
        "options": [
          "Every record in the table may be updated",
          "Only the PK changes",
          "The table is deleted"
        ],
        "answer": 0,
        "explanation": "Without a filter, UPDATE affects all rows."
      }
    ]
  },
  {
    "id": "DDD-16-06",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 6,
    "title": "Exam practice: UPDATE",
    "skills": [
      "update",
      "set",
      "where"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL statement to change the starRating of Hotel H103 to 4.</p>",
    "markingPoints": [
      "UPDATE Hotel.",
      "SET starRating = 4.",
      "WHERE hotelRef = 'H103'."
    ],
    "modelAnswer": "<pre>UPDATE Hotel\nSET starRating = 4\nWHERE hotelRef = 'H103';</pre>"
  },
  {
    "id": "DDD-16-07",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "order": 7,
    "title": "Mastery: UPDATE",
    "skills": [
      "update",
      "set",
      "where"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which keyword introduces changed values?",
        "options": [
          "SET",
          "SELECT",
          "FROM"
        ],
        "answer": 0,
        "explanation": "SET states the new field values."
      },
      {
        "prompt": "When should a primary key normally be used in WHERE?",
        "options": [
          "When exactly one record must change",
          "When all matching categories must change",
          "Never"
        ],
        "answer": 0,
        "explanation": "A PK uniquely identifies one record."
      },
      {
        "prompt": "Can one UPDATE change several fields?",
        "options": [
          "Yes, separate assignments with commas",
          "No",
          "Only by deleting first"
        ],
        "answer": 0,
        "explanation": "Several field assignments can appear in SET."
      }
    ]
  },
  {
    "id": "DDD-17-01",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 1,
    "title": "Learn: DELETE precisely",
    "skills": [
      "delete",
      "where",
      "primary-key"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<pre class=\"sql-code\">DELETE FROM Orders\nWHERE orderID = 'O504';</pre>\n<p>Use the primary key when one specific record must be removed. A broad condition may delete several records. Omitting WHERE can delete every record.</p>",
    "checkpoint": {
      "prompt": "Which field is safest for deleting exactly one order?",
      "options": [
        "orderID primary key",
        "status",
        "orderDate"
      ],
      "answer": 0,
      "explanation": "The primary key uniquely identifies one order."
    }
  },
  {
    "id": "DDD-17-02",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 2,
    "title": "SQL lab: Delete one record",
    "skills": [
      "delete",
      "where",
      "primary-key"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "shop",
    "promptHtml": "<p>Delete the cancelled order O504.</p>",
    "starterSql": "DELETE FROM Orders\nWHERE ;",
    "solutionSql": "DELETE FROM Orders WHERE orderID = 'O504';",
    "checkSql": "SELECT * FROM Orders ORDER BY orderID;",
    "previewTables": [
      "Orders"
    ],
    "hints": [
      "Use the orderID primary key."
    ]
  },
  {
    "id": "DDD-17-03",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 3,
    "title": "SQL lab: Delete several matching records",
    "skills": [
      "delete",
      "where",
      "multiple-records"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "books",
    "promptHtml": "<p>Delete every book with fewer than 8 copies sold.</p>",
    "starterSql": "DELETE FROM Books\nWHERE ;",
    "solutionSql": "DELETE FROM Books WHERE copies_sold < 8;",
    "checkSql": "SELECT * FROM Books ORDER BY bookID;",
    "previewTables": [
      "Books"
    ],
    "hints": [
      "A criterion rather than one primary key is appropriate because several records may match."
    ]
  },
  {
    "id": "DDD-17-04",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 4,
    "title": "SQL lab: Respect referential integrity",
    "skills": [
      "delete",
      "referential-integrity",
      "foreign-key"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "holidays",
    "promptHtml": "<p>Remove Hotel H101 and every Holiday currently linked to it. Delete the child records first, then the parent record.</p>",
    "starterSql": "DELETE FROM Holiday WHERE ;\nDELETE FROM Hotel WHERE ;",
    "solutionSql": "DELETE FROM Holiday WHERE hotelRef = 'H101'; DELETE FROM Hotel WHERE hotelRef = 'H101';",
    "checkSql": "SELECT 'Hotel' AS recordType, hotelRef AS ref FROM Hotel UNION ALL SELECT 'Holiday', holidayRef FROM Holiday ORDER BY recordType, ref;",
    "previewTables": [
      "Hotel",
      "Holiday"
    ],
    "hints": [
      "Delete Holiday rows that use H101 before deleting Hotel H101.",
      "Two statements are needed."
    ]
  },
  {
    "id": "DDD-17-05",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 5,
    "title": "Debug: DELETE mistakes",
    "skills": [
      "delete",
      "sql-debugging",
      "primary-key"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "One pupil record should be removed, but WHERE uses className='P7A'. What is the risk?",
        "options": [
          "Every P7A pupil may be deleted",
          "No pupil can be deleted",
          "Only the class field changes"
        ],
        "answer": 0,
        "explanation": "The criterion is not unique."
      },
      {
        "prompt": "What happens if DELETE FROM Orders has no WHERE?",
        "options": [
          "All Orders records may be removed",
          "Only one record is removed",
          "The table is sorted"
        ],
        "answer": 0,
        "explanation": "No filter limits the deletion."
      },
      {
        "prompt": "Why can deleting a parent record fail?",
        "options": [
          "Child records still reference its primary key",
          "ASC is missing",
          "The primary key is unique"
        ],
        "answer": 0,
        "explanation": "Referential integrity prevents orphaned records."
      }
    ]
  },
  {
    "id": "DDD-17-06",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 6,
    "title": "Exam practice: DELETE",
    "skills": [
      "delete",
      "where",
      "primary-key"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>Write an SQL statement to delete the Boat record with primary key B106.</p>",
    "markingPoints": [
      "DELETE FROM Boat.",
      "WHERE boatID = 'B106'.",
      "Uses the primary key to target one record."
    ],
    "modelAnswer": "<pre>DELETE FROM Boat\nWHERE boatID = 'B106';</pre>"
  },
  {
    "id": "DDD-17-07",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "order": 7,
    "title": "Mastery: DELETE",
    "skills": [
      "delete",
      "where",
      "referential-integrity"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which keyword follows DELETE?",
        "options": [
          "FROM",
          "SET",
          "VALUES"
        ],
        "answer": 0,
        "explanation": "The form is DELETE FROM table."
      },
      {
        "prompt": "When can a non-PK criterion be appropriate?",
        "options": [
          "When every matching record should be deleted",
          "When exactly one unknown record must be deleted",
          "Never"
        ],
        "answer": 0,
        "explanation": "A broad criterion is suitable for an intended multi-record deletion."
      },
      {
        "prompt": "What should be checked after a delete?",
        "options": [
          "The expected number and identity of remaining records",
          "Only the font",
          "Only the field size"
        ],
        "answer": 0,
        "explanation": "Testing confirms the correct records were removed."
      }
    ]
  },
  {
    "id": "DDD-18-01",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 1,
    "title": "Learn: Work through a complete database problem",
    "skills": [
      "analysis",
      "design",
      "implementation",
      "testing",
      "evaluation"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>For a full database task:</p><ol><li>analyse the end users and functional requirements;</li><li>design entities, keys, relationships, data dictionaries and validation;</li><li>implement and run SQL;</li><li>test using expected results;</li><li>evaluate fitness for purpose and data integrity.</li></ol>",
    "checkpoint": {
      "prompt": "What should happen before SQL implementation?",
      "options": [
        "Analysis and design",
        "Delete every table",
        "Choose a random sort"
      ],
      "answer": 0,
      "explanation": "Requirements and structure must be planned first."
    }
  },
  {
    "id": "DDD-18-02",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 2,
    "title": "Integrated SQL: Search linked school data",
    "skills": [
      "select",
      "equi-join",
      "where",
      "order-by"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "school",
    "promptHtml": "<p>Display each pupil’s forename, surname, className and Activity.leader for pupils whose formReturned is 1. Sort by className, then surname.</p>",
    "starterSql": "SELECT \nFROM Pupil, Activity\nWHERE \nORDER BY ;",
    "solutionSql": "SELECT Pupil.forename, Pupil.surname, Pupil.className, Activity.leader FROM Pupil, Activity WHERE Activity.activityName = Pupil.activityName AND Pupil.formReturned = 1 ORDER BY Pupil.className ASC, Pupil.surname ASC;",
    "checkSql": "",
    "previewTables": [
      "Activity",
      "Pupil"
    ],
    "hints": [
      "Join using activityName.",
      "Add formReturned = 1 after the join.",
      "Use two sort fields."
    ]
  },
  {
    "id": "DDD-18-03",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 3,
    "title": "Integrated SQL: Find missing forms",
    "skills": [
      "select",
      "where",
      "boolean"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "school",
    "promptHtml": "<p>Display pupilID, forename, surname and className for pupils who have not returned a form.</p>",
    "starterSql": "SELECT pupilID, forename, surname, className\nFROM Pupil\nWHERE ;",
    "solutionSql": "SELECT pupilID, forename, surname, className FROM Pupil WHERE formReturned = 0;",
    "checkSql": "",
    "previewTables": [
      "Pupil"
    ],
    "hints": [
      "The stored Boolean uses 0 for False."
    ]
  },
  {
    "id": "DDD-18-04",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 4,
    "title": "Integrated SQL: Maintain linked records",
    "skills": [
      "insert",
      "update",
      "foreign-key",
      "referential-integrity"
    ],
    "type": "sql",
    "required": true,
    "estimatedMinutes": 10,
    "datasetId": "school",
    "promptHtml": "<p>Add pupil 106, Erin Fraser, class P7B, emergency contact 07666666666, form returned, choosing Coding Challenge. Then update Coding Challenge’s price to £10.</p>",
    "starterSql": "INSERT INTO Pupil (pupilID, forename, surname, className, emergencyContact, formReturned, activityName)\nVALUES ();\n\nUPDATE Activity\nSET \nWHERE ;",
    "solutionSql": "INSERT INTO Pupil (pupilID, forename, surname, className, emergencyContact, formReturned, activityName) VALUES (106,'Erin','Fraser','P7B','07666666666',1,'Coding Challenge'); UPDATE Activity SET price = 10 WHERE activityName = 'Coding Challenge';",
    "checkSql": "SELECT 'Pupil' AS source, CAST(pupilID AS TEXT) AS id, forename AS detail FROM Pupil UNION ALL SELECT 'Activity', activityName, CAST(price AS TEXT) FROM Activity ORDER BY source, id;",
    "previewTables": [
      "Activity",
      "Pupil"
    ],
    "hints": [
      "The activityName foreign key must match an existing Activity.",
      "Use the Activity primary key in the UPDATE WHERE condition."
    ]
  },
  {
    "id": "DDD-18-05",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 5,
    "title": "Test: Predict query output",
    "skills": [
      "testing",
      "query-output",
      "select",
      "where"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "For SELECT book_title, author FROM Books WHERE copies_sold < 10 OR rating > 4.8, which book definitely appears?",
        "options": [
          "The Last Bear",
          "Wonder only because 12 < 10",
          "No books"
        ],
        "answer": 0,
        "explanation": "The Last Bear has copies_sold 9 and rating 4.9, so it satisfies the condition."
      },
      {
        "prompt": "What should a query test include?",
        "options": [
          "Known input/database state and expected output",
          "Only the SQL font",
          "An unrelated password"
        ],
        "answer": 0,
        "explanation": "Testing compares the actual result with a predicted result."
      }
    ]
  },
  {
    "id": "DDD-18-06",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 6,
    "title": "Exam practice: Evaluate a database solution",
    "skills": [
      "evaluation",
      "fitness-for-purpose",
      "referential-integrity",
      "testing"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 10,
    "questionHtml": "<p>A school database can display activity lists and pupils who have not returned a form. It rejects a Pupil.activityName that does not exist in Activity.</p>\n<p>Evaluate the solution’s fitness for purpose and integrity using evidence from the scenario.</p>",
    "markingPoints": [
      "States that the solution is fit for purpose because required searches can be completed.",
      "Uses specific examples: activity lists and missing forms.",
      "Explains that foreign-key rejection demonstrates referential integrity and prevents orphan records."
    ],
    "modelAnswer": "The database is **fit for purpose** because it can display the required activity lists and find pupils who have not returned a form. It also maintains **referential integrity** because an invalid **Pupil.activityName foreign key** is rejected, preventing orphaned pupil records."
  },
  {
    "id": "DDD-18-07",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "order": 7,
    "title": "Final mastery: National 5 DDD",
    "skills": [
      "ddd-mastery",
      "requirements",
      "erd",
      "data-dictionary",
      "sql",
      "referential-integrity"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which design shows two entities and their one-to-many relationship?",
        "options": [
          "ERD",
          "Test table only",
          "Python traceback"
        ],
        "answer": 0,
        "explanation": "An ERD models entities, keys and relationships."
      },
      {
        "prompt": "Which SQL operation changes existing data?",
        "options": [
          "UPDATE",
          "SELECT",
          "ERD"
        ],
        "answer": 0,
        "explanation": "UPDATE changes stored values."
      },
      {
        "prompt": "Which rule prevents an invalid FK from being stored?",
        "options": [
          "Referential integrity",
          "Descending order",
          "Field alias"
        ],
        "answer": 0,
        "explanation": "Every FK must match a valid parent PK."
      },
      {
        "prompt": "Which artefact records type, size, key and validation?",
        "options": [
          "Data dictionary",
          "Query result only",
          "End-user list"
        ],
        "answer": 0,
        "explanation": "The data dictionary documents field rules."
      },
      {
        "prompt": "What should a model exam answer include where possible?",
        "options": [
          "Exact field, table or value details from the question",
          "Only generic definitions",
          "No technical terminology"
        ],
        "answer": 0,
        "explanation": "Specific evidence secures the computing point."
      }
    ]
  },
  {
    "id": "DDD-04-B1",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4.1,
    "title": "ERD fluency 1 of 6: Mark the library keys and sides",
    "skills": [
      "erd",
      "entity",
      "attribute",
      "primary-key",
      "foreign-key",
      "one-to-many"
    ],
    "type": "erd-builder",
    "required": true,
    "estimatedMinutes": 6,
    "scenario": "A library stores books and loans. One book can appear in many loan records. Book details include book ID, title and author. Loan details include loan ID, pupil name and date borrowed.",
    "starterState": {
      "mode": "table",
      "entities": [
        {
          "name": "Book",
          "side": "",
          "attributes": [
            {
              "name": "bookID",
              "key": ""
            },
            {
              "name": "title",
              "key": ""
            },
            {
              "name": "author",
              "key": ""
            }
          ]
        },
        {
          "name": "Loan",
          "side": "",
          "attributes": [
            {
              "name": "loanID",
              "key": ""
            },
            {
              "name": "pupilName",
              "key": ""
            },
            {
              "name": "dateBorrowed",
              "key": ""
            },
            {
              "name": "bookID",
              "key": ""
            }
          ]
        }
      ],
      "oneToManyVerb": "",
      "manyToOneVerb": ""
    },
    "expected": {
      "oneEntity": [
        "book"
      ],
      "manyEntity": [
        "loan"
      ],
      "onePk": [
        "bookid"
      ],
      "manyPk": [
        "loanid"
      ],
      "matchingForeignKey": true,
      "requiredAttributes": {
        "book": [
          "bookid",
          "title",
          "author"
        ],
        "loan": [
          "loanid",
          "pupilname",
          "dateborrowed",
          "bookid"
        ]
      }
    }
  },
  {
    "id": "DDD-04-B2",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4.2,
    "title": "ERD fluency 2 of 6: Complete Customer and Orders",
    "skills": [
      "erd",
      "entity",
      "attribute",
      "primary-key",
      "foreign-key",
      "one-to-many"
    ],
    "type": "erd-builder",
    "required": true,
    "estimatedMinutes": 7,
    "scenario": "An online shop stores customers and orders. One customer can place many orders. Customer details include customer ID, forename and email. Order details include order ID, order date and total.",
    "starterState": {
      "mode": "table",
      "entities": [
        {
          "name": "Customer",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        },
        {
          "name": "Orders",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        }
      ],
      "oneToManyVerb": "",
      "manyToOneVerb": ""
    },
    "expected": {
      "oneEntity": [
        "customer"
      ],
      "manyEntity": [
        "orders",
        "order"
      ],
      "onePk": [
        "customerid"
      ],
      "manyPk": [
        "orderid"
      ],
      "matchingForeignKey": true,
      "requiredAttributes": {
        "customer": [
          "customerid",
          "forename",
          "email"
        ],
        "orders": [
          "orderid",
          "orderdate",
          "total",
          "customerid"
        ]
      }
    }
  },
  {
    "id": "DDD-04-B3",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4.3,
    "title": "ERD fluency 3 of 6: Repair Team and Player",
    "skills": [
      "erd",
      "repair",
      "primary-key",
      "foreign-key",
      "one-to-many"
    ],
    "type": "erd-builder",
    "required": true,
    "estimatedMinutes": 6,
    "scenario": "One team has many players, and each player belongs to one team. Team details include team ID and team name. Player details include player ID, player name and position. The starter design contains a key error.",
    "starterState": {
      "mode": "table",
      "entities": [
        {
          "name": "Team",
          "side": "one",
          "attributes": [
            {
              "name": "teamID",
              "key": "PK"
            },
            {
              "name": "teamName",
              "key": ""
            },
            {
              "name": "playerID",
              "key": "FK"
            }
          ]
        },
        {
          "name": "Player",
          "side": "many",
          "attributes": [
            {
              "name": "playerID",
              "key": "PK"
            },
            {
              "name": "playerName",
              "key": ""
            },
            {
              "name": "position",
              "key": ""
            },
            {
              "name": "teamID",
              "key": ""
            }
          ]
        }
      ],
      "oneToManyVerb": "has",
      "manyToOneVerb": "belongs to"
    },
    "expected": {
      "oneEntity": [
        "team"
      ],
      "manyEntity": [
        "player"
      ],
      "onePk": [
        "teamid"
      ],
      "manyPk": [
        "playerid"
      ],
      "matchingForeignKey": true,
      "requiredAttributes": {
        "team": [
          "teamid",
          "teamname"
        ],
        "player": [
          "playerid",
          "playername",
          "position",
          "teamid"
        ]
      }
    }
  },
  {
    "id": "DDD-04-B4",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4.4,
    "title": "ERD fluency 4 of 6: Build Activity and Pupil",
    "skills": [
      "erd",
      "entity",
      "attribute",
      "primary-key",
      "foreign-key",
      "one-to-many"
    ],
    "type": "erd-builder",
    "required": true,
    "estimatedMinutes": 8,
    "scenario": "A school stores activities and pupils. Each pupil selects one activity, while one activity can be selected by many pupils. Activity details include activity name, leader and price. Pupil details include pupil ID, pupil name, class and emergency contact.",
    "starterState": {
      "mode": "table",
      "entities": [
        {
          "name": "",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        },
        {
          "name": "",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        }
      ],
      "oneToManyVerb": "",
      "manyToOneVerb": ""
    },
    "expected": {
      "oneEntity": [
        "activity"
      ],
      "manyEntity": [
        "pupil"
      ],
      "onePk": [
        "activityname"
      ],
      "manyPk": [
        "pupilid"
      ],
      "matchingForeignKey": true,
      "requiredAttributes": {
        "activity": [
          "activityname",
          "leader",
          "price"
        ],
        "pupil": [
          "pupilid",
          "pupilname",
          "class",
          "emergencycontact",
          "activityname"
        ]
      }
    }
  },
  {
    "id": "DDD-04-B5",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4.5,
    "title": "ERD fluency 5 of 6: Build Hotel and Booking in bubble view",
    "skills": [
      "erd",
      "bubble-erd",
      "entity",
      "attribute",
      "primary-key",
      "foreign-key",
      "one-to-many"
    ],
    "type": "erd-builder",
    "required": true,
    "estimatedMinutes": 8,
    "scenario": "A travel company stores hotels and bookings. One hotel can appear in many bookings. Hotel details include hotel reference, hotel name and town. Booking details include booking reference, customer name and arrival date.",
    "starterState": {
      "mode": "bubble",
      "entities": [
        {
          "name": "",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        },
        {
          "name": "",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        }
      ],
      "oneToManyVerb": "",
      "manyToOneVerb": ""
    },
    "expected": {
      "oneEntity": [
        "hotel"
      ],
      "manyEntity": [
        "booking"
      ],
      "onePk": [
        "hotelref",
        "hotelreference"
      ],
      "manyPk": [
        "bookingref",
        "bookingreference"
      ],
      "matchingForeignKey": true,
      "requiredAttributes": {
        "hotel": [
          "hotelref",
          "hotelname",
          "town"
        ],
        "booking": [
          "bookingref",
          "customername",
          "arrivaldate",
          "hotelref"
        ]
      }
    }
  },
  {
    "id": "DDD-04-B6",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "order": 4.6,
    "title": "ERD fluency 6 of 6: Independent Venue and Event design",
    "skills": [
      "erd",
      "entity",
      "attribute",
      "primary-key",
      "foreign-key",
      "one-to-many",
      "independent-design"
    ],
    "type": "erd-builder",
    "required": true,
    "estimatedMinutes": 9,
    "scenario": "An events company stores venues and events. One venue can host many events, while each event uses one venue. Venue details include venue ID, venue name and town. Event details include event ID, event name, event date and ticket price.",
    "starterState": {
      "mode": "table",
      "entities": [
        {
          "name": "",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        },
        {
          "name": "",
          "side": "",
          "attributes": [
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            },
            {
              "name": "",
              "key": ""
            }
          ]
        }
      ],
      "oneToManyVerb": "",
      "manyToOneVerb": ""
    },
    "expected": {
      "oneEntity": [
        "venue"
      ],
      "manyEntity": [
        "event"
      ],
      "onePk": [
        "venueid"
      ],
      "manyPk": [
        "eventid"
      ],
      "matchingForeignKey": true,
      "requiredAttributes": {
        "venue": [
          "venueid",
          "venuename",
          "town"
        ],
        "event": [
          "eventid",
          "eventname",
          "eventdate",
          "ticketprice",
          "venueid"
        ]
      }
    }
  },
  {
    "id": "DDD-10-X1",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 4.1,
    "title": "Extra SQL: Write SELECT from requirements",
    "skills": [
      "select",
      "from",
      "query-design"
    ],
    "type": "sql",
    "required": false,
    "estimatedMinutes": 8,
    "datasetId": "books",
    "instructions": "Display the book_title and author of every book.",
    "starterSql": "SELECT \nFROM Books;",
    "solutionSql": "SELECT book_title, author FROM Books;",
    "checkSql": "SELECT book_title, author FROM Books;"
  },
  {
    "id": "DDD-10-X2",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "order": 4.2,
    "title": "Extra practice: Reverse-engineer a SELECT",
    "skills": [
      "select",
      "from",
      "query-design"
    ],
    "type": "quiz",
    "required": false,
    "estimatedMinutes": 6,
    "codeSnippet": "SELECT model, salePrice\nFROM Boat;",
    "questions": [
      {
        "prompt": "Which requirement does this query meet?",
        "options": [
          "Display every boat model and sale price",
          "Display only boats below £20,000",
          "Change every boat price"
        ],
        "answer": 0,
        "explanation": "The SELECT list names the two displayed fields and there is no WHERE filter."
      }
    ]
  },
  {
    "id": "DDD-11-X1",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "order": 5.1,
    "title": "Extra SQL: Predict filtered records",
    "skills": [
      "where",
      "criteria",
      "predict-output"
    ],
    "type": "quiz",
    "required": false,
    "estimatedMinutes": 7,
    "codeSnippet": "SELECT book_title, rating\nFROM Books\nWHERE rating > 4.8;",
    "questions": [
      {
        "prompt": "Which books are returned?",
        "options": [
          "The Hobbit and The Last Bear",
          "Every book rated 4.8 or above",
          "Only Northern Lights"
        ],
        "answer": 0,
        "explanation": "The condition is strictly greater than 4.8, so 4.8 is excluded."
      }
    ]
  },
  {
    "id": "DDD-12-X1",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "order": 5.1,
    "title": "Extra SQL: Build a two-condition WHERE",
    "skills": [
      "where",
      "and",
      "or",
      "criteria"
    ],
    "type": "sql",
    "required": false,
    "estimatedMinutes": 8,
    "datasetId": "books",
    "instructions": "Display book_title and copies_sold for Fantasy books that sold more than 20 copies.",
    "starterSql": "SELECT book_title, copies_sold\nFROM Books\nWHERE ;",
    "solutionSql": "SELECT book_title, copies_sold FROM Books WHERE genre = 'Fantasy' AND copies_sold > 20;",
    "checkSql": "SELECT book_title, copies_sold FROM Books WHERE genre = 'Fantasy' AND copies_sold > 20;"
  },
  {
    "id": "DDD-13-X1",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "order": 5.1,
    "title": "Extra SQL: Predict two-level sorting",
    "skills": [
      "order-by",
      "two-level-sort",
      "predict-output"
    ],
    "type": "quiz",
    "required": false,
    "estimatedMinutes": 7,
    "codeSnippet": "SELECT forename, surname, test1, test2\nFROM Result\nORDER BY test1 ASC, test2 DESC;",
    "questions": [
      {
        "prompt": "When two pupils have the same test1 mark, what decides their order?",
        "options": [
          "The higher test2 mark appears first",
          "Surname is used automatically",
          "The lower test2 mark appears first"
        ],
        "answer": 0,
        "explanation": "test2 DESC is the secondary sort, so the larger test2 value appears first within a test1 tie."
      }
    ]
  },
  {
    "id": "DDD-14-X1",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "order": 5.1,
    "title": "Extra SQL: Complete the equi-join",
    "skills": [
      "equi-join",
      "primary-key",
      "foreign-key",
      "two-tables"
    ],
    "type": "sql",
    "required": false,
    "estimatedMinutes": 9,
    "datasetId": "school",
    "instructions": "Display each pupil forename and the leader of their selected activity.",
    "starterSql": "SELECT Pupil.forename, Activity.leader\nFROM Pupil, Activity\nWHERE ;",
    "solutionSql": "SELECT Pupil.forename, Activity.leader FROM Pupil, Activity WHERE Activity.activityName = Pupil.activityName;",
    "checkSql": "SELECT Pupil.forename, Activity.leader FROM Pupil, Activity WHERE Activity.activityName = Pupil.activityName;"
  }
];

ACTIVITIES.push(...DDD_ACTIVITIES);

ACTIVITIES.push(...[
  {
    "id": "CS-01-01",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 1,
    "title": "Learn: Binary place values",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Computers store data using two binary digits: <strong>0</strong> and <strong>1</strong>. In an 8-bit positive integer, display the bits as two groups of four called <strong>nibbles</strong>. The place values are:</p><div class=\"binary-place-strip\"><span>128</span><span>64</span><span>32</span><span>16</span><span>8</span><span>4</span><span>2</span><span>1</span></div><p>A 1 means include that place value. A 0 means do not include it.</p>",
    "checkpoint": {
      "prompt": "What is the value of the rightmost binary place?",
      "options": [
        "1",
        "2",
        "128"
      ],
      "answer": 0,
      "explanation": "The rightmost place has value 1."
    }
  },
  {
    "id": "CS-01-B1",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 2.1,
    "title": "Binary fluency 1 of 6: Read an 8-bit value",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "binary-to-denary",
    "target": 1,
    "bits": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "practiceNumber": 1,
    "practiceTotal": 6
  },
  {
    "id": "CS-01-B2",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 2.2,
    "title": "Binary fluency 2 of 6: Read an 8-bit value",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "binary-to-denary",
    "target": 5,
    "bits": [
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1
    ],
    "practiceNumber": 2,
    "practiceTotal": 6
  },
  {
    "id": "CS-01-B3",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 2.3,
    "title": "Binary fluency 3 of 6: Read an 8-bit value",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "binary-to-denary",
    "target": 13,
    "bits": [
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      1
    ],
    "practiceNumber": 3,
    "practiceTotal": 6
  },
  {
    "id": "CS-01-B4",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 2.4,
    "title": "Binary fluency 4 of 6: Read an 8-bit value",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "binary-to-denary",
    "target": 32,
    "bits": [
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0
    ],
    "practiceNumber": 4,
    "practiceTotal": 6
  },
  {
    "id": "CS-01-B5",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 2.5,
    "title": "Binary fluency 5 of 6: Read an 8-bit value",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "binary-to-denary",
    "target": 129,
    "bits": [
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "practiceNumber": 5,
    "practiceTotal": 6
  },
  {
    "id": "CS-01-B6",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 2.6,
    "title": "Binary fluency 6 of 6: Read an 8-bit value",
    "skills": [
      "binary",
      "positive-integers",
      "place-values"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "binary-to-denary",
    "target": 255,
    "bits": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    ],
    "practiceNumber": 6,
    "practiceTotal": 6
  },
  {
    "id": "CS-01-03",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 3,
    "title": "Check: Bits and place values",
    "skills": [
      "binary",
      "bits",
      "place-values"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which binary digit means that a place value is included?",
        "options": [
          "1",
          "0",
          "2"
        ],
        "answer": 0,
        "explanation": "A 1 includes the place value."
      },
      {
        "prompt": "Which is an 8-bit binary pattern?",
        "options": [
          "0010 1101",
          "201101",
          "101"
        ],
        "answer": 0,
        "explanation": "It contains eight bits, each 0 or 1."
      },
      {
        "prompt": "What is the highest place value in an 8-bit positive integer?",
        "options": [
          "128",
          "256",
          "64"
        ],
        "answer": 0,
        "explanation": "The eight place values run from 128 down to 1."
      }
    ]
  },
  {
    "id": "CS-01-04",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "order": 4,
    "title": "Exam practice: Explain binary representation",
    "skills": [
      "binary",
      "positive-integers"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Describe how an 8-bit binary pattern represents a positive integer. 2 marks</p>",
    "markingPoints": [
      "Each bit position has a place value based on a power of two.",
      "Add the place values wherever the bit is 1."
    ],
    "modelAnswer": "**Each bit position** has a power-of-two place value. Add the place values whose bits are **1** to calculate the positive integer."
  },
  {
    "id": "CS-02-01",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 1,
    "title": "Learn: Convert binary and denary",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>To convert binary to denary, add the place values with a 1.</p><pre class=\"lesson-code\">0010 1101 = 32 + 8 + 4 + 1 = 45</pre><p>To convert denary to binary, choose place values from largest to smallest and write 1 when each is used.</p>",
    "checkpoint": {
      "prompt": "What is 0000 1010 in denary?",
      "options": [
        "10",
        "8",
        "12"
      ],
      "answer": 0,
      "explanation": "8 + 2 = 10."
    }
  },
  {
    "id": "CS-02-D1",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 2.1,
    "title": "Denary-to-binary fluency 1 of 6",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "denary-to-binary",
    "target": 5,
    "bits": [],
    "practiceNumber": 1,
    "practiceTotal": 6
  },
  {
    "id": "CS-02-D2",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 2.2,
    "title": "Denary-to-binary fluency 2 of 6",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "denary-to-binary",
    "target": 10,
    "bits": [],
    "practiceNumber": 2,
    "practiceTotal": 6
  },
  {
    "id": "CS-02-D3",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 2.3,
    "title": "Denary-to-binary fluency 3 of 6",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "denary-to-binary",
    "target": 18,
    "bits": [],
    "practiceNumber": 3,
    "practiceTotal": 6
  },
  {
    "id": "CS-02-D4",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 2.4,
    "title": "Denary-to-binary fluency 4 of 6",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "denary-to-binary",
    "target": 45,
    "bits": [],
    "practiceNumber": 4,
    "practiceTotal": 6
  },
  {
    "id": "CS-02-D5",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 2.5,
    "title": "Denary-to-binary fluency 5 of 6",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "denary-to-binary",
    "target": 75,
    "bits": [],
    "practiceNumber": 5,
    "practiceTotal": 6
  },
  {
    "id": "CS-02-D6",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 2.6,
    "title": "Denary-to-binary fluency 6 of 6",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 4,
    "mode": "denary-to-binary",
    "target": 156,
    "bits": [],
    "practiceNumber": 6,
    "practiceTotal": 6
  },
  {
    "id": "CS-02-BX",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 3,
    "title": "Optional challenge: Read a harder binary value",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": false,
    "estimatedMinutes": 7,
    "mode": "binary-to-denary",
    "target": 156,
    "bits": [
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      0
    ]
  },
  {
    "id": "CS-02-04",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 4,
    "title": "Check: Conversion accuracy",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What is 1111 1111 in denary?",
        "options": [
          "255",
          "256",
          "128"
        ],
        "answer": 0,
        "explanation": "All eight place values add to 255."
      },
      {
        "prompt": "Which binary pattern represents 64?",
        "options": [
          "0100 0000",
          "1000 0000",
          "0010 0000"
        ],
        "answer": 0,
        "explanation": "The 64 place is the second bit."
      },
      {
        "prompt": "What is 0001 0001 in denary?",
        "options": [
          "17",
          "16",
          "18"
        ],
        "answer": 0,
        "explanation": "16 + 1 = 17."
      }
    ]
  },
  {
    "id": "CS-02-05",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "order": 5,
    "title": "Exam practice: Show a conversion",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Convert the denary value 75 into 8-bit binary. Show the place values you use.</p>",
    "markingPoints": [
      "64, 8, 2 and 1 are selected.",
      "The correct 8-bit result is 0100 1011."
    ],
    "modelAnswer": "75 = **64 + 8 + 2 + 1**, so the 8-bit binary value is **0100 1011**."
  },
  {
    "id": "CS-03-01",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "order": 1,
    "title": "Learn: Mantissa and exponent",
    "skills": [
      "floating-point",
      "mantissa",
      "exponent",
      "real-numbers"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Positive real numbers can be stored using floating-point representation.</p><ul><li>The <strong>mantissa</strong> stores the significant digits.</li><li>The <strong>exponent</strong> states how far the binary point moves.</li></ul><p>More bits for the mantissa can improve precision. More bits for the exponent can increase the range of values represented.</p>",
    "checkpoint": {
      "prompt": "Which part stores the significant digits?",
      "options": [
        "Mantissa",
        "Exponent",
        "Address bus"
      ],
      "answer": 0,
      "explanation": "The mantissa stores the significant digits."
    }
  },
  {
    "id": "CS-03-02",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "order": 2,
    "title": "Check: Mantissa or exponent?",
    "skills": [
      "floating-point",
      "mantissa",
      "exponent"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which part controls the range of values?",
        "options": [
          "Exponent",
          "Mantissa",
          "ASCII"
        ],
        "answer": 0,
        "explanation": "The exponent controls how far the point moves and therefore the range."
      },
      {
        "prompt": "Which part mainly affects precision?",
        "options": [
          "Mantissa",
          "Exponent",
          "Control unit"
        ],
        "answer": 0,
        "explanation": "More mantissa bits can store more significant digits."
      },
      {
        "prompt": "Why is floating point used?",
        "options": [
          "To represent real numbers with fractional parts",
          "To name memory locations",
          "To filter network traffic"
        ],
        "answer": 0,
        "explanation": "Floating point represents positive real values."
      }
    ]
  },
  {
    "id": "CS-03-03",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "order": 3,
    "title": "Predict: Change the bit allocation",
    "skills": [
      "floating-point",
      "mantissa",
      "exponent",
      "precision",
      "range"
    ],
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "More bits are assigned to the mantissa. What normally improves?",
        "options": [
          "Precision",
          "Firewall rules",
          "Memory address"
        ],
        "answer": 0,
        "explanation": "More significant digits can be stored."
      },
      {
        "prompt": "More bits are assigned to the exponent. What normally increases?",
        "options": [
          "Range",
          "Character set only",
          "Screen brightness"
        ],
        "answer": 0,
        "explanation": "A wider exponent supports a wider range of magnitudes."
      }
    ]
  },
  {
    "id": "CS-03-04",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "order": 4,
    "title": "Exam practice: Describe floating point",
    "skills": [
      "floating-point",
      "mantissa",
      "exponent"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Describe the purpose of the mantissa and exponent when representing a positive real number. 2 marks</p>",
    "markingPoints": [
      "The mantissa stores the significant digits.",
      "The exponent states how far the binary point moves / controls magnitude."
    ],
    "modelAnswer": "The **mantissa** stores the significant digits. The **exponent** states how far the binary point moves, controlling the magnitude of the represented value."
  },
  {
    "id": "CS-04-01",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "order": 1,
    "title": "Learn: Extended ASCII",
    "skills": [
      "ascii",
      "characters",
      "8-bit"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p><strong>Extended ASCII</strong> uses an 8-bit code to represent each character. Each binary pattern maps to a character such as a letter, number or symbol.</p><p>Eight bits provide 256 possible patterns, numbered 0 to 255.</p>",
    "checkpoint": {
      "prompt": "How many bits are used by extended ASCII?",
      "options": [
        "8",
        "7",
        "16"
      ],
      "answer": 0,
      "explanation": "Extended ASCII uses 8 bits."
    }
  },
  {
    "id": "CS-04-02",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "order": 2,
    "title": "Check: Character codes",
    "skills": [
      "ascii",
      "characters",
      "8-bit"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "What does one ASCII binary pattern represent?",
        "options": [
          "One character",
          "A complete image",
          "An entire program"
        ],
        "answer": 0,
        "explanation": "Each code maps to a character."
      },
      {
        "prompt": "How many different 8-bit patterns are possible?",
        "options": [
          "256",
          "255",
          "128"
        ],
        "answer": 0,
        "explanation": "2 to the power 8 is 256."
      },
      {
        "prompt": "Why must sender and receiver use the same character code?",
        "options": [
          "So the same pattern is interpreted as the same character",
          "To increase monitor brightness",
          "To create a foreign key"
        ],
        "answer": 0,
        "explanation": "A shared code gives the binary pattern the same meaning."
      }
    ]
  },
  {
    "id": "CS-04-03",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "order": 3,
    "title": "Build: Read an 8-bit character code",
    "skills": [
      "ascii",
      "binary",
      "conversion"
    ],
    "type": "binary-builder",
    "required": true,
    "estimatedMinutes": 7,
    "mode": "binary-to-denary",
    "target": 65,
    "bits": [
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1
    ]
  },
  {
    "id": "CS-04-04",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "order": 4,
    "title": "Exam practice: Explain character representation",
    "skills": [
      "ascii",
      "characters",
      "binary"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Explain how extended ASCII represents a character in a computer. 2 marks</p>",
    "markingPoints": [
      "A character is assigned an 8-bit binary code.",
      "The stored pattern is interpreted using the extended ASCII character set."
    ],
    "modelAnswer": "Each character is assigned an **8-bit binary code**. The computer uses the **extended ASCII character set** to interpret that pattern as the intended character."
  },
  {
    "id": "CS-05-01",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "order": 1,
    "title": "Learn: Vector graphics",
    "skills": [
      "vector-graphics",
      "coordinates",
      "fill-colour",
      "line-colour"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A vector graphic stores a picture as objects such as a <strong>rectangle, ellipse, line or polygon</strong>.</p><p>Each object is described using attributes including <strong>coordinates, fill colour and line colour</strong>.</p><div class=\"vector-demo\"><div class=\"vector-shape\"></div><ul><li>object: rectangle</li><li>coordinates: x and y positions</li><li>fill colour</li><li>line colour</li></ul></div>",
    "checkpoint": {
      "prompt": "Which is stored as a vector object?",
      "options": [
        "Ellipse",
        "Individual pixel only",
        "ASCII character"
      ],
      "answer": 0,
      "explanation": "Ellipse is one of the named vector objects."
    }
  },
  {
    "id": "CS-05-02",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "order": 2,
    "title": "Learn: Bit-mapped graphics",
    "skills": [
      "bitmap",
      "pixels",
      "graphics"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A bit-mapped graphic stores the colour of each <strong>pixel</strong> in a grid. The complete image is built from those individually stored pixels.</p><div class=\"pixel-grid\" aria-label=\"Example pixel grid\"><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"on\"></span><span class=\"on\"></span><span class=\"on\"></span><span class=\"on\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"on\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"on\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"on\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"on\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"on\"></span><span class=\"on\"></span><span class=\"on\"></span><span class=\"on\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span><span class=\"\"></span></div>",
    "checkpoint": {
      "prompt": "What is the basic stored element in a bitmap?",
      "options": [
        "Pixel",
        "Polygon object",
        "Memory bus"
      ],
      "answer": 0,
      "explanation": "A bitmap stores individual pixels."
    }
  },
  {
    "id": "CS-05-03",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "order": 3,
    "title": "Check: Vector or bitmap?",
    "skills": [
      "vector-graphics",
      "bitmap",
      "graphics"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which method stores coordinates and object attributes?",
        "options": [
          "Vector",
          "Bitmap",
          "ASCII"
        ],
        "answer": 0,
        "explanation": "Vector graphics store objects and their attributes."
      },
      {
        "prompt": "Which method stores a grid of pixels?",
        "options": [
          "Bitmap",
          "Vector",
          "Floating point"
        ],
        "answer": 0,
        "explanation": "A bitmap is built from pixels."
      },
      {
        "prompt": "Which set contains only named National 5 vector objects?",
        "options": [
          "rectangle, ellipse, line, polygon",
          "pixel, byte, bus, register",
          "circle, audio, table, character"
        ],
        "answer": 0,
        "explanation": "Those four objects are named in the course specification."
      }
    ]
  },
  {
    "id": "CS-05-04",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "order": 4,
    "title": "Exam practice: Compare graphic methods",
    "skills": [
      "vector-graphics",
      "bitmap",
      "comparison"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Describe one difference between vector and bit-mapped graphic representation. 2 marks</p>",
    "markingPoints": [
      "Vector graphics store objects and attributes such as coordinates/colours.",
      "Bitmaps store the colour of individual pixels in a grid."
    ],
    "modelAnswer": "A **vector graphic** stores objects such as rectangles or lines with coordinates and colour attributes. A **bit-mapped graphic** stores the colour of each individual pixel in a grid."
  },
  {
    "id": "CS-06-01",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "order": 1,
    "title": "Learn: Inside the processor",
    "skills": [
      "processor",
      "registers",
      "alu",
      "control-unit"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<div class=\"architecture-diagram\"><div class=\"arch-box cpu\"><strong>Processor</strong><div>Registers</div><div>ALU</div><div>Control unit</div></div></div><ul><li><strong>Registers</strong> are very small, fast storage locations inside the processor.</li><li>The <strong>ALU</strong> performs arithmetic and logical operations.</li><li>The <strong>control unit</strong> manages and coordinates instruction processing.</li></ul>",
    "checkpoint": {
      "prompt": "Which component performs arithmetic and logical operations?",
      "options": [
        "ALU",
        "Address bus",
        "Firewall"
      ],
      "answer": 0,
      "explanation": "The arithmetic and logic unit performs these operations."
    }
  },
  {
    "id": "CS-06-02",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "order": 2,
    "title": "Check: Processor components",
    "skills": [
      "processor",
      "registers",
      "alu",
      "control-unit"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which component coordinates the processor?",
        "options": [
          "Control unit",
          "ALU",
          "Data bus"
        ],
        "answer": 0,
        "explanation": "The control unit manages instruction processing."
      },
      {
        "prompt": "Where are small, fast temporary values held inside the processor?",
        "options": [
          "Registers",
          "Monitor",
          "Firewall"
        ],
        "answer": 0,
        "explanation": "Registers are fast storage locations inside the processor."
      },
      {
        "prompt": "Which component would perform an addition?",
        "options": [
          "ALU",
          "Control unit only",
          "Address bus"
        ],
        "answer": 0,
        "explanation": "Addition is an arithmetic operation."
      }
    ]
  },
  {
    "id": "CS-06-03",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "order": 3,
    "title": "Apply: Identify the active component",
    "skills": [
      "processor",
      "registers",
      "alu",
      "control-unit"
    ],
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "An instruction needs two stored values immediately. Where are they most likely held?",
        "options": [
          "Registers",
          "Hard-copy output",
          "Encryption key only"
        ],
        "answer": 0,
        "explanation": "Registers hold values currently being processed."
      },
      {
        "prompt": "A comparison is performed. Which component is responsible?",
        "options": [
          "ALU",
          "Monitor",
          "Compiler"
        ],
        "answer": 0,
        "explanation": "A comparison is a logical operation."
      }
    ]
  },
  {
    "id": "CS-06-04",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "order": 4,
    "title": "Exam practice: Describe the processor",
    "skills": [
      "processor",
      "registers",
      "alu",
      "control-unit"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Describe the purpose of the ALU and control unit. 2 marks</p>",
    "markingPoints": [
      "ALU performs arithmetic and logical operations.",
      "Control unit manages/co-ordinates execution of instructions."
    ],
    "modelAnswer": "The **ALU** performs arithmetic and logical operations. The **control unit** manages and coordinates the execution of instructions."
  },
  {
    "id": "CS-07-01",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "order": 1,
    "title": "Learn: Memory locations and buses",
    "skills": [
      "memory",
      "addresses",
      "data-bus",
      "address-bus"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<div class=\"memory-bus-demo\"><div class=\"memory-stack\"><span>Address 100</span><span>Address 101</span><span>Address 102</span></div><div class=\"bus-lines\"><strong>Address bus → selects a location</strong><strong>Data bus ↔ carries data</strong></div></div><p>Each memory location has a <strong>unique address</strong>. The <strong>address bus</strong> carries the address of the required location. The <strong>data bus</strong> carries data between components.</p>",
    "checkpoint": {
      "prompt": "Which bus carries the address of a memory location?",
      "options": [
        "Address bus",
        "Data bus",
        "Control unit"
      ],
      "answer": 0,
      "explanation": "The address bus identifies the location."
    }
  },
  {
    "id": "CS-07-02",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "order": 2,
    "title": "Check: Addresses and buses",
    "skills": [
      "memory",
      "addresses",
      "data-bus",
      "address-bus"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Why does each memory location need a unique address?",
        "options": [
          "So it can be identified and accessed",
          "So every value is encrypted",
          "So it becomes a vector object"
        ],
        "answer": 0,
        "explanation": "The address identifies the location."
      },
      {
        "prompt": "Which bus carries a value read from memory?",
        "options": [
          "Data bus",
          "Address bus",
          "Monitor bus"
        ],
        "answer": 0,
        "explanation": "The data bus carries data."
      },
      {
        "prompt": "Which bus carries 205 when location 205 is requested?",
        "options": [
          "Address bus",
          "Data bus",
          "ALU"
        ],
        "answer": 0,
        "explanation": "205 identifies the memory address."
      }
    ]
  },
  {
    "id": "CS-07-03",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "order": 3,
    "title": "Trace: A memory read",
    "skills": [
      "memory",
      "addresses",
      "data-bus",
      "address-bus"
    ],
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "First, the processor requests location 42. What travels on the address bus?",
        "options": [
          "42",
          "The final data value only",
          "A firewall rule"
        ],
        "answer": 0,
        "explanation": "The requested address travels on the address bus."
      },
      {
        "prompt": "The value 99 is stored there. What returns on the data bus?",
        "options": [
          "99",
          "42 only",
          "The word compiler"
        ],
        "answer": 0,
        "explanation": "The data bus carries the stored data."
      }
    ]
  },
  {
    "id": "CS-07-04",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "order": 4,
    "title": "Exam practice: Explain the buses",
    "skills": [
      "memory",
      "addresses",
      "data-bus",
      "address-bus"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Explain the different purposes of the address bus and data bus. 2 marks</p>",
    "markingPoints": [
      "Address bus carries the address of a memory location.",
      "Data bus carries data between processor, memory and other components."
    ],
    "modelAnswer": "The **address bus** carries the address of the memory location to access. The **data bus** carries the data being transferred between the processor, memory and other components."
  },
  {
    "id": "CS-08-01",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "order": 1,
    "title": "Learn: Why programs need translators",
    "skills": [
      "compiler",
      "interpreter",
      "machine-code",
      "high-level-language"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A processor executes binary <strong>machine-code instructions</strong>, not high-level source code. A translator is therefore needed.</p><ul><li>A <strong>compiler</strong> translates the complete program before it runs.</li><li>An <strong>interpreter</strong> translates and executes instructions as the program runs.</li></ul>",
    "checkpoint": {
      "prompt": "Why is translation needed?",
      "options": [
        "The processor executes machine code rather than high-level source code",
        "The monitor cannot display text",
        "Every program needs a foreign key"
      ],
      "answer": 0,
      "explanation": "High-level code must be translated into machine-code instructions."
    }
  },
  {
    "id": "CS-08-02",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "order": 2,
    "title": "Check: Compiler or interpreter?",
    "skills": [
      "compiler",
      "interpreter",
      "machine-code"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which translates the complete program before execution?",
        "options": [
          "Compiler",
          "Interpreter",
          "Firewall"
        ],
        "answer": 0,
        "explanation": "A compiler translates the full program."
      },
      {
        "prompt": "Which translates and executes as the program runs?",
        "options": [
          "Interpreter",
          "Compiler only",
          "ALU"
        ],
        "answer": 0,
        "explanation": "An interpreter works through instructions during execution."
      },
      {
        "prompt": "What is the target form for the processor?",
        "options": [
          "Binary machine-code instructions",
          "Pseudocode",
          "An ERD"
        ],
        "answer": 0,
        "explanation": "The processor executes machine code."
      }
    ]
  },
  {
    "id": "CS-08-03",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "order": 3,
    "title": "Apply: Choose a translator",
    "skills": [
      "compiler",
      "interpreter",
      "comparison"
    ],
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "A developer wants errors reported while each instruction is being attempted. Which approach fits best?",
        "options": [
          "Interpreter",
          "Address bus",
          "Vector graphic"
        ],
        "answer": 0,
        "explanation": "An interpreter works through the source during execution."
      },
      {
        "prompt": "A complete program is translated into an executable form first. What was used?",
        "options": [
          "Compiler",
          "Register",
          "Bitmap"
        ],
        "answer": 0,
        "explanation": "A compiler translates the full program before it runs."
      }
    ]
  },
  {
    "id": "CS-08-04",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "order": 4,
    "title": "Exam practice: Explain translation",
    "skills": [
      "compiler",
      "interpreter",
      "machine-code"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Explain why a compiler or interpreter is needed. 2 marks</p>",
    "markingPoints": [
      "High-level code cannot be executed directly by the processor.",
      "It translates the code into binary machine-code instructions."
    ],
    "modelAnswer": "The processor cannot execute **high-level source code** directly. A compiler or interpreter translates it into **binary machine-code instructions** that the processor can execute."
  },
  {
    "id": "CS-09-01",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "order": 1,
    "title": "Learn: Reduce environmental impact",
    "skills": [
      "environment",
      "energy-use",
      "monitor-settings",
      "power-down",
      "standby"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>Computer systems use electrical energy. Producing that energy can contribute to environmental harm.</p><p>Energy use can be reduced using suitable <strong>monitor settings</strong>, automatic <strong>power-down settings</strong>, and using <strong>standby</strong> rather than leaving a computer fully active when it is temporarily unused. For longer periods, powering down usually saves more energy than standby.</p>",
    "checkpoint": {
      "prompt": "Which setting can switch off an unused display automatically?",
      "options": [
        "Monitor power setting",
        "Foreign-key validation",
        "ASCII"
      ],
      "answer": 0,
      "explanation": "Monitor settings can reduce unnecessary energy use."
    }
  },
  {
    "id": "CS-09-02",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "order": 2,
    "title": "Check: Energy-saving choices",
    "skills": [
      "environment",
      "energy-use",
      "monitor-settings",
      "power-down",
      "standby"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which action normally saves the most during a long period of non-use?",
        "options": [
          "Power down the computer",
          "Leave it fully active",
          "Increase brightness"
        ],
        "answer": 0,
        "explanation": "Powering down avoids unnecessary running energy."
      },
      {
        "prompt": "Which change reduces display energy use?",
        "options": [
          "Lower brightness and shorten screen-off delay",
          "Increase colour depth in an ERD",
          "Disable the firewall"
        ],
        "answer": 0,
        "explanation": "Monitor settings can reduce energy use."
      },
      {
        "prompt": "Why does reducing energy use help the environment?",
        "options": [
          "Less electricity needs to be generated",
          "It increases binary range",
          "It creates more memory addresses"
        ],
        "answer": 0,
        "explanation": "Reduced electricity demand can reduce environmental impact."
      }
    ]
  },
  {
    "id": "CS-09-03",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "order": 3,
    "title": "Apply: Improve a computer room",
    "skills": [
      "environment",
      "energy-use",
      "settings"
    ],
    "type": "predict",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Thirty monitors remain bright during lunch. What is the best improvement?",
        "options": [
          "Use an automatic screen-off setting",
          "Add more registers",
          "Convert the room number to binary"
        ],
        "answer": 0,
        "explanation": "Automatic monitor settings reduce wasted energy."
      },
      {
        "prompt": "Computers are unused every night. What is the best action?",
        "options": [
          "Use automatic power down",
          "Leave them fully active",
          "Open every application"
        ],
        "answer": 0,
        "explanation": "Power-down settings avoid overnight energy use."
      }
    ]
  },
  {
    "id": "CS-09-04",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "order": 4,
    "title": "Exam practice: Reduce energy use",
    "skills": [
      "environment",
      "energy-use",
      "monitor-settings",
      "power-down",
      "standby"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>Describe two ways a school could reduce the environmental impact caused by the energy use of its computers. 2 marks</p>",
    "markingPoints": [
      "Use suitable monitor settings such as lower brightness/automatic screen-off.",
      "Use automatic power down or standby when systems are not being used."
    ],
    "modelAnswer": "The school could use **monitor power settings**, such as lower brightness and automatic screen-off. It could also configure **automatic power down** or standby when computers are not being used."
  },
  {
    "id": "CS-10-01",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "order": 1,
    "title": "Learn: Firewalls",
    "skills": [
      "firewall",
      "security",
      "network-traffic"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p>A <strong>firewall</strong> monitors and filters network traffic using rules. It can block unauthorised or suspicious connections while permitting approved communication.</p><p>A firewall is a protective barrier, but it does not replace safe passwords, updates or encryption.</p>",
    "checkpoint": {
      "prompt": "What does a firewall filter?",
      "options": [
        "Network traffic",
        "Binary place values",
        "Vector coordinates"
      ],
      "answer": 0,
      "explanation": "A firewall filters network communications according to rules."
    }
  },
  {
    "id": "CS-10-02",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "order": 2,
    "title": "Learn: Encryption in communications",
    "skills": [
      "encryption",
      "security",
      "electronic-communications"
    ],
    "type": "lesson",
    "required": true,
    "estimatedMinutes": 6,
    "contentHtml": "<p><strong>Encryption</strong> transforms readable data into an unreadable form. The intended recipient uses the correct key to decrypt it.</p><p>This protects the confidentiality of data travelling through electronic communications if it is intercepted.</p>",
    "checkpoint": {
      "prompt": "What does encryption protect when a message is intercepted?",
      "options": [
        "The confidentiality of its contents",
        "The monitor brightness",
        "The number of registers"
      ],
      "answer": 0,
      "explanation": "Without the correct key, the intercepted content should be unreadable."
    }
  },
  {
    "id": "CS-10-03",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "order": 3,
    "title": "Check: Firewall or encryption?",
    "skills": [
      "firewall",
      "encryption",
      "security"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 6,
    "questions": [
      {
        "prompt": "Which precaution blocks disallowed network connections?",
        "options": [
          "Firewall",
          "Mantissa",
          "Bitmap"
        ],
        "answer": 0,
        "explanation": "The firewall applies network rules."
      },
      {
        "prompt": "Which precaution makes intercepted communication unreadable?",
        "options": [
          "Encryption",
          "Address bus",
          "Standby"
        ],
        "answer": 0,
        "explanation": "Encryption protects the contents."
      },
      {
        "prompt": "Which statement is correct?",
        "options": [
          "A firewall filters traffic; encryption protects data content",
          "Encryption turns off monitors",
          "A firewall converts denary to binary"
        ],
        "answer": 0,
        "explanation": "The two precautions have different roles."
      }
    ]
  },
  {
    "id": "CS-10-04",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "order": 4,
    "title": "Exam practice: Protect a communication",
    "skills": [
      "firewall",
      "encryption",
      "security"
    ],
    "type": "exam-style",
    "required": true,
    "estimatedMinutes": 8,
    "marks": 2,
    "questionHtml": "<p>A school sends confidential pupil information electronically. Explain how encryption protects the information. 2 marks</p>",
    "markingPoints": [
      "The data is transformed into an unreadable/cipher form before or during transmission.",
      "Only a recipient with the correct key can decrypt/read the original information."
    ],
    "modelAnswer": "The data is **encrypted into an unreadable form** before transmission. Only a recipient with the **correct decryption key** can recover and read the original information."
  },
  {
    "id": "CS-10-05",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "order": 5,
    "title": "Computer Systems mastery checkpoint",
    "skills": [
      "binary",
      "floating-point",
      "ascii",
      "vector-graphics",
      "bitmap",
      "processor",
      "memory",
      "compiler",
      "environment",
      "firewall",
      "encryption"
    ],
    "type": "quiz",
    "required": true,
    "estimatedMinutes": 10,
    "questions": [
      {
        "prompt": "Which part of floating point stores significant digits?",
        "options": [
          "Mantissa",
          "Exponent",
          "Data bus"
        ],
        "answer": 0,
        "explanation": "The mantissa stores significant digits."
      },
      {
        "prompt": "Which component performs logical operations?",
        "options": [
          "ALU",
          "Control unit",
          "Address bus"
        ],
        "answer": 0,
        "explanation": "The ALU performs arithmetic and logic."
      },
      {
        "prompt": "Which bus identifies a memory location?",
        "options": [
          "Address bus",
          "Data bus",
          "Firewall"
        ],
        "answer": 0,
        "explanation": "The address bus carries an address."
      },
      {
        "prompt": "Which method stores rectangle objects and coordinates?",
        "options": [
          "Vector graphics",
          "Bitmap",
          "ASCII"
        ],
        "answer": 0,
        "explanation": "Vector graphics store objects and attributes."
      },
      {
        "prompt": "Which method stores individual pixels?",
        "options": [
          "Bitmap",
          "Vector",
          "Floating point"
        ],
        "answer": 0,
        "explanation": "A bitmap is a pixel grid."
      },
      {
        "prompt": "Why is a compiler or interpreter needed?",
        "options": [
          "To translate high-level code to machine code",
          "To increase screen brightness",
          "To validate a foreign key"
        ],
        "answer": 0,
        "explanation": "The processor executes machine code."
      },
      {
        "prompt": "Which action reduces overnight energy use?",
        "options": [
          "Automatic power down",
          "Increase brightness",
          "Disable standby timers"
        ],
        "answer": 0,
        "explanation": "Power-down settings reduce wasted energy."
      },
      {
        "prompt": "What is the role of a firewall?",
        "options": [
          "Filter network traffic",
          "Translate Python",
          "Store a mantissa"
        ],
        "answer": 0,
        "explanation": "A firewall permits or blocks traffic using rules."
      },
      {
        "prompt": "What is the role of encryption?",
        "options": [
          "Make communication unreadable without the correct key",
          "Select a memory address",
          "Draw a polygon"
        ],
        "answer": 0,
        "explanation": "Encryption protects message contents."
      },
      {
        "prompt": "How many patterns can 8 bits represent?",
        "options": [
          "256",
          "8",
          "128"
        ],
        "answer": 0,
        "explanation": "2^8 = 256."
      }
    ]
  }
]);

ACTIVITIES.push(...[
  {
    "id": "SDD-PY-01-F1",
    "areaId": "sdd",
    "unitId": "sdd-python-01",
    "order": 7.1,
    "title": "Fluency sprint: Display six messages",
    "skills": [
      "print",
      "strings",
      "fluency"
    ],
    "type": "quiz",
    "required": false,
    "estimatedMinutes": 8,
    "questions": [
      {
        "prompt": "Which line displays Game Over! correctly?",
        "options": [
          "print(\"Game Over!\")",
          "print(Game Over!)",
          "Print(\"Game Over!\")"
        ],
        "answer": 0,
        "explanation": "Use lowercase print, brackets and quotation marks."
      },
      {
        "prompt": "Which line displays Welcome to Ticketmaster!?",
        "options": [
          "print(\"Welcome to Ticketmaster!\")",
          "input(\"Welcome to Ticketmaster!\")",
          "print(Welcome to Ticketmaster!)"
        ],
        "answer": 0,
        "explanation": "The task asks for output, not input."
      },
      {
        "prompt": "Which line displays a divider?",
        "options": [
          "print(\"-----------------------\")",
          "print(-----------------------)",
          "\"-----------------------\""
        ],
        "answer": 0,
        "explanation": "The divider is string data and needs quotation marks."
      },
      {
        "prompt": "Which instruction displays You will be assigned a queue position at random.?",
        "options": [
          "print(\"You will be assigned a queue position at random.\")",
          "random(\"You will be assigned a queue position at random.\")",
          "Print(You will be assigned a queue position at random.)"
        ],
        "answer": 0,
        "explanation": "The exact message belongs inside print()."
      },
      {
        "prompt": "Which line displays Fitness Challenge: Step Tracker?",
        "options": [
          "print(\"Fitness Challenge: Step Tracker\")",
          "input(\"Fitness Challenge: Step Tracker\")",
          "print(Fitness Challenge: Step Tracker)"
        ],
        "answer": 0,
        "explanation": "Use print with the complete string."
      },
      {
        "prompt": "Which line displays Your daily target is 10,000 steps.?",
        "options": [
          "print(\"Your daily target is 10,000 steps.\")",
          "print(Your daily target is 10,000 steps.)",
          "PRINT(\"Your daily target is 10,000 steps.\")"
        ],
        "answer": 0,
        "explanation": "Quotation marks keep the whole sentence together as a string."
      }
    ]
  },
  {
    "id": "SDD-PY-01-F2",
    "areaId": "sdd",
    "unitId": "sdd-python-01",
    "order": 8.1,
    "title": "Fluency sprint: Pseudocode output",
    "skills": [
      "pseudocode",
      "translation",
      "print",
      "fluency"
    ],
    "type": "quiz",
    "required": false,
    "estimatedMinutes": 8,
    "questions": [
      {
        "prompt": "Translate: SEND \"Game Over!\" TO DISPLAY",
        "options": [
          "print(\"Game Over!\")",
          "input(\"Game Over!\")",
          "Game Over = print"
        ],
        "answer": 0,
        "explanation": "SEND ... TO DISPLAY translates to print(...)."
      },
      {
        "prompt": "Translate: SEND \"Access granted\" TO DISPLAY",
        "options": [
          "print(\"Access granted\")",
          "input(\"Access granted\")",
          "display = \"Access granted\""
        ],
        "answer": 0,
        "explanation": "Use print for output."
      },
      {
        "prompt": "Translate: SEND \"Queue position assigned\" TO DISPLAY",
        "options": [
          "print(\"Queue position assigned\")",
          "print(Queue position assigned)",
          "input(\"Queue position assigned\")"
        ],
        "answer": 0,
        "explanation": "The message is a string."
      },
      {
        "prompt": "Translate: SEND \"Daily target reached\" TO DISPLAY",
        "options": [
          "print(\"Daily target reached\")",
          "Print(\"Daily target reached\")",
          "input(\"Daily target reached\")"
        ],
        "answer": 0,
        "explanation": "Python uses lowercase print."
      },
      {
        "prompt": "Translate: SEND \"Evidence found\" TO DISPLAY",
        "options": [
          "print(\"Evidence found\")",
          "send(\"Evidence found\")",
          "print(Evidence found)"
        ],
        "answer": 0,
        "explanation": "Use Python print syntax."
      },
      {
        "prompt": "Translate: SEND \"System offline\" TO DISPLAY",
        "options": [
          "print(\"System offline\")",
          "offline = send",
          "input(\"System offline\")"
        ],
        "answer": 0,
        "explanation": "The pseudocode instruction is output."
      }
    ]
  },
  {
    "id": "SDD-PY-01-F3",
    "areaId": "sdd",
    "unitId": "sdd-python-01",
    "order": 8.2,
    "title": "Practise: Comments are for people",
    "skills": [
      "comments",
      "readability",
      "print"
    ],
    "type": "code",
    "required": false,
    "estimatedMinutes": 8,
    "instructions": "Add a suitable comment above the working print instruction. Run the program and notice that the comment does not appear in the output.",
    "starterCode": "print(\"System online\")",
    "expectedOutput": "System online",
    "hints": [
      "A Python comment begins with #.",
      "For example: # Display the opening message"
    ],
    "requirements": {
      "requiredCalls": [
        "print"
      ],
      "requiredPatterns": [
        "#.+[\\s\\S]*print\\s*\\("
      ]
    }
  },
  {
    "id": "SDD-PY-01-F4",
    "areaId": "sdd",
    "unitId": "sdd-python-01",
    "order": 8.3,
    "title": "Optional extension: New lines inside a string",
    "skills": [
      "print",
      "strings",
      "newline"
    ],
    "type": "code",
    "required": false,
    "estimatedMinutes": 7,
    "instructions": "Use one print instruction and \\n inside the string so Python, is and powerful appear on three separate lines.",
    "starterCode": "# Write one print instruction",
    "expectedOutput": "Python\nis\npowerful",
    "hints": [
      "The backslash and n belong inside the quotation marks.",
      "Pattern: print(\"First\\nSecond\")"
    ],
    "requirements": {
      "requiredCalls": [
        "print"
      ],
      "requiredPatterns": [
        "\\\\n"
      ]
    }
  },
  {
    "id": "SDD-PY-02-F1",
    "areaId": "sdd",
    "unitId": "sdd-python-02",
    "order": 1.5,
    "title": "Visual model: A variable is a labelled box",
    "skills": [
      "variables",
      "assignment",
      "meaningful-identifiers"
    ],
    "type": "lesson",
    "required": false,
    "estimatedMinutes": 6,
    "contentHtml": "<div class=\"variable-box-demo\"><div class=\"variable-label\">agentName</div><div class=\"variable-value\">\"Zara\" → \"Amira\"</div></div><p>The label is the variable name. The value inside is the current stored value. A later assignment replaces the previous value in the same box.</p><p>Variable names may use letters, numbers and underscores, cannot begin with a number, cannot contain spaces or hyphens, and should be meaningful.</p>",
    "checkpoint": {
      "prompt": "After agentName = \"Zara\" followed by agentName = \"Amira\", what is stored?",
      "options": [
        "Amira",
        "Zara and Amira in two boxes",
        "agentName"
      ],
      "answer": 0,
      "explanation": "The later assignment replaces the earlier value in the same variable."
    }
  }
]);

const ACTIVITY_TYPE_LABELS = {
  lesson: "Learn",
  video: "Video",
  quiz: "Quick check",
  predict: "Predict",
  visualiser: "Visualise",
  code: "Practise",
  debug: "Debug",
  sql: "SQL lab",
  "erd-builder": "Draw ERD",
  "binary-builder": "Binary builder",
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

Object.assign(SKILL_LABELS, {
  "fluency": "Fluency practice",
  "newline": "Newline escape sequence",
  "binary": "Binary representation",
  "positive-integers": "Positive integers",
  "place-values": "Binary place values",
  "bits": "Bits",
  "denary": "Denary numbers",
  "conversion": "Binary conversion",
  "floating-point": "Floating-point representation",
  "mantissa": "Mantissa",
  "exponent": "Exponent",
  "precision": "Precision",
  "range": "Number range",
  "ascii": "Extended ASCII",
  "characters": "Character representation",
  "8-bit": "8-bit codes",
  "vector-graphics": "Vector graphics",
  "bitmap": "Bit-mapped graphics",
  "pixels": "Pixels",
  "graphics": "Graphics representation",
  "coordinates": "Coordinates",
  "fill-colour": "Fill colour",
  "line-colour": "Line colour",
  "processor": "Processor",
  "registers": "Registers",
  "alu": "ALU",
  "control-unit": "Control unit",
  "memory": "Memory",
  "addresses": "Memory addresses",
  "data-bus": "Data bus",
  "address-bus": "Address bus",
  "compiler": "Compiler",
  "interpreter": "Interpreter",
  "machine-code": "Machine code",
  "high-level-language": "High-level language",
  "environment": "Environmental impact",
  "energy-use": "Energy use",
  "monitor-settings": "Monitor settings",
  "power-down": "Power-down settings",
  "standby": "Standby",
  "firewall": "Firewalls",
  "network-traffic": "Network traffic",
  "encryption": "Encryption",
  "electronic-communications": "Electronic communications",
  "security": "Security precautions",
  "erd": "Entity-relationship diagrams",
  "entity": "Entities/tables",
  "attribute": "Attributes/fields",
  "primary-key": "Primary keys",
  "foreign-key": "Foreign keys",
  "one-to-many": "One-to-many relationships",
  "referential-integrity": "Referential integrity"
});

SPACED_QUESTIONS.push(...[
  {
    "id": "SP-DDD-001",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "prompt": "In a library database, which is the most suitable entity?",
    "options": [
      "Book",
      "Book title",
      "Fantasy"
    ],
    "answer": 0,
    "explanation": "Book is the thing being described.",
    "skills": [
      "entity",
      "attribute",
      "record",
      "field"
    ]
  },
  {
    "id": "SP-DDD-002",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "prompt": "Which is an attribute of a Book entity?",
    "options": [
      "author",
      "record",
      "database"
    ],
    "answer": 0,
    "explanation": "Author is one detail stored about each book.",
    "skills": [
      "entity",
      "attribute",
      "record",
      "field"
    ]
  },
  {
    "id": "SP-DDD-003",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "prompt": "What does a database field hold?",
    "options": [
      "One category of data",
      "Every table in the system",
      "A complete backup"
    ],
    "answer": 0,
    "explanation": "A field stores one type of detail for each record.",
    "skills": [
      "entity",
      "attribute",
      "record",
      "field"
    ]
  },
  {
    "id": "SP-DDD-004",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "prompt": "“The organiser should be able to display pupils who have not returned a form.” What type is this?",
    "options": [
      "End-user requirement",
      "Data type",
      "Validation rule"
    ],
    "answer": 0,
    "explanation": "It describes what the organiser should be able to do.",
    "skills": [
      "end-user-requirement",
      "functional-requirement"
    ]
  },
  {
    "id": "SP-DDD-005",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "prompt": "“A query to select pupil names where formReturned is False.” What type is this?",
    "options": [
      "Functional requirement",
      "End-user requirement",
      "Entity name"
    ],
    "answer": 0,
    "explanation": "It specifies a query operation.",
    "skills": [
      "end-user-requirement",
      "functional-requirement"
    ]
  },
  {
    "id": "SP-DDD-006",
    "areaId": "ddd",
    "unitId": "ddd-foundations-01",
    "prompt": "Which requirement must be specific to the question context?",
    "options": [
      "Both end-user and functional requirements",
      "Only end-user requirements",
      "Neither"
    ],
    "answer": 0,
    "explanation": "Both should use the actual users, fields and operations from the scenario.",
    "skills": [
      "database",
      "requirements",
      "entity",
      "attribute"
    ]
  },
  {
    "id": "SP-DDD-007",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "prompt": "A phone number must be corrected in six records. Which problem is shown?",
    "options": [
      "Update anomaly",
      "Range check",
      "Equi-join"
    ],
    "answer": 0,
    "explanation": "The same fact has to be updated repeatedly.",
    "skills": [
      "flat-file",
      "data-duplication",
      "update-anomaly",
      "deletion-anomaly"
    ]
  },
  {
    "id": "SP-DDD-008",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "prompt": "Deleting the final order also removes the only stored customer address. Which problem is shown?",
    "options": [
      "Deletion anomaly",
      "Data type error",
      "Presence check"
    ],
    "answer": 0,
    "explanation": "Useful related information is lost when a record is deleted.",
    "skills": [
      "flat-file",
      "data-duplication",
      "update-anomaly",
      "deletion-anomaly"
    ]
  },
  {
    "id": "SP-DDD-009",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "prompt": "Which field belongs in the Customer table?",
    "options": [
      "customerEmail",
      "orderTotal",
      "orderDate"
    ],
    "answer": 0,
    "explanation": "The email describes the customer.",
    "skills": [
      "relational-database",
      "entity-design"
    ]
  },
  {
    "id": "SP-DDD-010",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "prompt": "Which field belongs in the Orders table?",
    "options": [
      "orderID",
      "customerSurname repeated",
      "customerEmail repeated"
    ],
    "answer": 0,
    "explanation": "orderID uniquely identifies an order.",
    "skills": [
      "relational-database",
      "entity-design"
    ]
  },
  {
    "id": "SP-DDD-011",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "prompt": "What should link Orders to Customer?",
    "options": [
      "Customer primary key stored as a foreign key",
      "Customer surname copied into every order",
      "The table colour"
    ],
    "answer": 0,
    "explanation": "A foreign key creates the relationship.",
    "skills": [
      "relational-database",
      "entity-design"
    ]
  },
  {
    "id": "SP-DDD-012",
    "areaId": "ddd",
    "unitId": "ddd-relational-02",
    "prompt": "Which database design normally uses several linked tables?",
    "options": [
      "Relational database",
      "Flat file",
      "Text document"
    ],
    "answer": 0,
    "explanation": "Relational databases organise data into related tables.",
    "skills": [
      "flat-file",
      "relational-database",
      "anomalies"
    ]
  },
  {
    "id": "SP-DDD-013",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "prompt": "Which is the best primary key for a Boat table?",
    "options": [
      "boatID",
      "brand",
      "capacity"
    ],
    "answer": 0,
    "explanation": "boatID can be made unique for every boat.",
    "skills": [
      "primary-key",
      "uniqueness"
    ]
  },
  {
    "id": "SP-DDD-014",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "prompt": "Why is town usually unsuitable as a primary key?",
    "options": [
      "Many records can have the same town",
      "It is text",
      "It is too readable"
    ],
    "answer": 0,
    "explanation": "A primary key must be unique.",
    "skills": [
      "primary-key",
      "uniqueness"
    ]
  },
  {
    "id": "SP-DDD-015",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "prompt": "Hotel.hotelRef uniquely identifies each hotel. What key is it?",
    "options": [
      "Primary key",
      "Foreign key",
      "No key"
    ],
    "answer": 0,
    "explanation": "It uniquely identifies a Hotel record.",
    "skills": [
      "primary-key",
      "foreign-key",
      "one-to-many"
    ]
  },
  {
    "id": "SP-DDD-016",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "prompt": "Holiday.hotelRef stores the hotel used by each holiday. What key is it?",
    "options": [
      "Foreign key",
      "Primary key of Holiday",
      "Validation check"
    ],
    "answer": 0,
    "explanation": "It links each holiday to a valid hotel.",
    "skills": [
      "primary-key",
      "foreign-key",
      "one-to-many"
    ]
  },
  {
    "id": "SP-DDD-017",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "prompt": "In one Hotel to many Holidays, which table contains hotelRef as a foreign key?",
    "options": [
      "Holiday",
      "Hotel only",
      "Neither"
    ],
    "answer": 0,
    "explanation": "The foreign key is on the many side.",
    "skills": [
      "primary-key",
      "foreign-key",
      "one-to-many"
    ]
  },
  {
    "id": "SP-DDD-018",
    "areaId": "ddd",
    "unitId": "ddd-keys-03",
    "prompt": "Which rule applies to every primary-key value?",
    "options": [
      "It must be unique",
      "It must be repeated",
      "It must be optional"
    ],
    "answer": 0,
    "explanation": "A primary key identifies exactly one record.",
    "skills": [
      "primary-key",
      "foreign-key",
      "uniqueness"
    ]
  },
  {
    "id": "SP-DDD-019",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "prompt": "One team has many players; each player belongs to one team. Which is the one side?",
    "options": [
      "Team",
      "Player",
      "Both"
    ],
    "answer": 0,
    "explanation": "One team record relates to many player records.",
    "skills": [
      "erd",
      "one-to-many"
    ]
  },
  {
    "id": "SP-DDD-020",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "prompt": "One customer places many orders. Where should customerID be a foreign key?",
    "options": [
      "Orders",
      "Customer",
      "Both as foreign keys"
    ],
    "answer": 0,
    "explanation": "Orders is the many side.",
    "skills": [
      "erd",
      "one-to-many"
    ]
  },
  {
    "id": "SP-DDD-021",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "prompt": "An ERD places customerID as an FK in Customer instead of Orders. What should change?",
    "options": [
      "Move the FK to Orders",
      "Delete both keys",
      "Make surname the FK"
    ],
    "answer": 0,
    "explanation": "The foreign key belongs on the many side.",
    "skills": [
      "erd",
      "foreign-key",
      "relationship"
    ]
  },
  {
    "id": "SP-DDD-022",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "prompt": "An ERD has two entities but no line between them. What is missing?",
    "options": [
      "Relationship",
      "Data type",
      "SQL semicolon"
    ],
    "answer": 0,
    "explanation": "The diagram must show how the entities relate.",
    "skills": [
      "erd",
      "foreign-key",
      "relationship"
    ]
  },
  {
    "id": "SP-DDD-023",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "prompt": "What must an ERD relationship line communicate?",
    "options": [
      "How entities are related and the cardinality",
      "Only the font size",
      "The SQL result order"
    ],
    "answer": 0,
    "explanation": "The relationship and one/many sides are essential.",
    "skills": [
      "erd",
      "one-to-many",
      "keys"
    ]
  },
  {
    "id": "SP-DDD-024",
    "areaId": "ddd",
    "unitId": "ddd-erd-04",
    "prompt": "Which attribute should be marked both PK and FK in the same table?",
    "options": [
      "Normally neither; a field’s role depends on the table",
      "Every surname",
      "Every price"
    ],
    "answer": 0,
    "explanation": "A parent key is PK in one table and the matching field is FK in the other.",
    "skills": [
      "erd",
      "one-to-many",
      "keys"
    ]
  },
  {
    "id": "SP-DDD-025",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "prompt": "Which type is suitable for formReturned?",
    "options": [
      "Boolean",
      "Date",
      "Text size 100"
    ],
    "answer": 0,
    "explanation": "The value has two states: true or false.",
    "skills": [
      "data-type",
      "text",
      "number",
      "boolean",
      "date",
      "time"
    ]
  },
  {
    "id": "SP-DDD-026",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "prompt": "Which type is suitable for dateRaised?",
    "options": [
      "Date",
      "Boolean",
      "Number of characters"
    ],
    "answer": 0,
    "explanation": "It stores a calendar date.",
    "skills": [
      "data-type",
      "text",
      "number",
      "boolean",
      "date",
      "time"
    ]
  },
  {
    "id": "SP-DDD-027",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "prompt": "A phone number begins with 0 and is not calculated. Which type is safest?",
    "options": [
      "Text",
      "Number",
      "Boolean"
    ],
    "answer": 0,
    "explanation": "Text preserves leading zeros.",
    "skills": [
      "data-type",
      "text",
      "number",
      "boolean",
      "date",
      "time"
    ]
  },
  {
    "id": "SP-DDD-028",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "prompt": "Which fields normally need a size at National 5?",
    "options": [
      "Text fields",
      "Every Boolean",
      "Every date"
    ],
    "answer": 0,
    "explanation": "Size limits the maximum text characters.",
    "skills": [
      "field-size",
      "required",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-029",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "prompt": "Can a primary key be left empty?",
    "options": [
      "No, it must be required",
      "Yes, always",
      "Only when sorted"
    ],
    "answer": 0,
    "explanation": "Every record needs its unique identifier.",
    "skills": [
      "field-size",
      "required",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-030",
    "areaId": "ddd",
    "unitId": "ddd-dictionary-05",
    "prompt": "What does each row in a data dictionary describe?",
    "options": [
      "One attribute",
      "One complete query",
      "One school"
    ],
    "answer": 0,
    "explanation": "Each row records rules for one attribute.",
    "skills": [
      "data-dictionary",
      "metadata",
      "validation"
    ]
  },
  {
    "id": "SP-DDD-031",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "prompt": "Star rating must be 1 to 5.",
    "options": [
      "Range check",
      "Presence check",
      "Equi-join"
    ],
    "answer": 0,
    "explanation": "The value must lie between numeric limits.",
    "skills": [
      "validation"
    ]
  },
  {
    "id": "SP-DDD-032",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "prompt": "Meal plan must be RO, BB, HB or FB.",
    "options": [
      "Restricted choice",
      "Length check",
      "Primary key"
    ],
    "answer": 0,
    "explanation": "Only listed options are accepted.",
    "skills": [
      "validation"
    ]
  },
  {
    "id": "SP-DDD-033",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "prompt": "A mobile number must contain exactly 11 characters.",
    "options": [
      "Length check",
      "Range check",
      "Boolean"
    ],
    "answer": 0,
    "explanation": "It checks the number of characters.",
    "skills": [
      "validation"
    ]
  },
  {
    "id": "SP-DDD-034",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "prompt": "A school activity price must be between £2 and £30. Which rule is specific enough?",
    "options": [
      "Range: >=2 and <=30",
      "Range check",
      "Required"
    ],
    "answer": 0,
    "explanation": "State the actual lower and upper limits.",
    "skills": [
      "validation",
      "question-specific-evidence"
    ]
  },
  {
    "id": "SP-DDD-035",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "prompt": "Town can only be Aberdeen, Dundee, Glasgow or Edinburgh. Which rule is complete?",
    "options": [
      "Restricted choice: Aberdeen, Dundee, Glasgow, Edinburgh",
      "Restricted choice",
      "Text"
    ],
    "answer": 0,
    "explanation": "The allowed values must be listed.",
    "skills": [
      "validation",
      "question-specific-evidence"
    ]
  },
  {
    "id": "SP-DDD-036",
    "areaId": "ddd",
    "unitId": "ddd-validation-06",
    "prompt": "A pupil writes only “range check” for activity price. What is missing?",
    "options": [
      "The actual minimum and maximum values",
      "The table colour",
      "An ORDER BY clause"
    ],
    "answer": 0,
    "explanation": "The rule must be specific to the scenario.",
    "skills": [
      "validation",
      "debugging"
    ]
  },
  {
    "id": "SP-DDD-037",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "prompt": "Old pupil emergency contacts are kept indefinitely after pupils leave. Which concern applies?",
    "options": [
      "Storage limitation",
      "Field length",
      "Primary key"
    ],
    "answer": 0,
    "explanation": "Personal data should not be kept longer than needed.",
    "skills": [
      "data-protection"
    ]
  },
  {
    "id": "SP-DDD-038",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "prompt": "A school leaves inaccurate phone numbers uncorrected. Which principle applies?",
    "options": [
      "Accuracy",
      "Sorting",
      "One-to-many"
    ],
    "answer": 0,
    "explanation": "Stored personal data should be kept accurate.",
    "skills": [
      "data-protection"
    ]
  },
  {
    "id": "SP-DDD-039",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "prompt": "A database is used for an unrelated purpose without telling users. Which principle applies?",
    "options": [
      "Purpose limitation and transparency",
      "ASC order",
      "Restricted choice"
    ],
    "answer": 0,
    "explanation": "Use should match the stated purpose and be transparent.",
    "skills": [
      "data-protection"
    ]
  },
  {
    "id": "SP-DDD-040",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "prompt": "Which action supports data minimisation?",
    "options": [
      "Collect only fields needed for the stated task",
      "Collect every possible detail",
      "Keep duplicate copies everywhere"
    ],
    "answer": 0,
    "explanation": "Only necessary personal data should be collected.",
    "skills": [
      "data-protection",
      "security"
    ]
  },
  {
    "id": "SP-DDD-041",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "prompt": "Which action supports accuracy?",
    "options": [
      "Correct known errors promptly",
      "Never allow updates",
      "Delete the primary key"
    ],
    "answer": 0,
    "explanation": "Personal data should be accurate and current.",
    "skills": [
      "data-protection",
      "security"
    ]
  },
  {
    "id": "SP-DDD-042",
    "areaId": "ddd",
    "unitId": "ddd-gdpr-07",
    "prompt": "Which action supports security?",
    "options": [
      "Role-based access",
      "Public passwords",
      "No backups"
    ],
    "answer": 0,
    "explanation": "Only authorised users should access sensitive data.",
    "skills": [
      "data-protection",
      "security"
    ]
  },
  {
    "id": "SP-DDD-043",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "prompt": "Can a child record be added with a foreign key that does not exist in the parent table?",
    "options": [
      "No",
      "Yes, always",
      "Only when sorted"
    ],
    "answer": 0,
    "explanation": "The foreign key must match a valid primary key.",
    "skills": [
      "referential-integrity",
      "primary-key",
      "foreign-key"
    ]
  },
  {
    "id": "SP-DDD-044",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "prompt": "Can a parent primary key be deleted while child records still reference it?",
    "options": [
      "No, not if that would leave orphans",
      "Yes, without consequence",
      "Only if it is text"
    ],
    "answer": 0,
    "explanation": "The relationship would be broken.",
    "skills": [
      "referential-integrity",
      "primary-key",
      "foreign-key"
    ]
  },
  {
    "id": "SP-DDD-045",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "prompt": "Which table should normally be populated first?",
    "options": [
      "The one/parent table",
      "The many/child table with unknown foreign keys",
      "Neither"
    ],
    "answer": 0,
    "explanation": "Parent keys must exist before child foreign keys can reference them.",
    "skills": [
      "referential-integrity",
      "primary-key",
      "foreign-key"
    ]
  },
  {
    "id": "SP-DDD-046",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "prompt": "What is an orphaned record?",
    "options": [
      "A child record whose foreign key has no matching parent primary key",
      "A sorted record",
      "A record with a long surname"
    ],
    "answer": 0,
    "explanation": "Its relationship points to nothing valid.",
    "skills": [
      "referential-integrity",
      "orphan-record"
    ]
  },
  {
    "id": "SP-DDD-047",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "prompt": "Which rule validates a foreign key in a data dictionary?",
    "options": [
      "Exists as a primary key in the related table",
      "Always begins with A",
      "DESC"
    ],
    "answer": 0,
    "explanation": "The value must match a valid parent key.",
    "skills": [
      "referential-integrity",
      "orphan-record"
    ]
  },
  {
    "id": "SP-DDD-048",
    "areaId": "ddd",
    "unitId": "ddd-integrity-08",
    "prompt": "What does referential integrity protect?",
    "options": [
      "The validity of links between tables",
      "Only font size",
      "Only query capital letters"
    ],
    "answer": 0,
    "explanation": "It keeps relationships consistent.",
    "skills": [
      "referential-integrity",
      "orphan-record"
    ]
  },
  {
    "id": "SP-DDD-049",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "prompt": "“Display model, capacity and salePrice.” What does this identify?",
    "options": [
      "Fields to display",
      "Search criteria",
      "Table relationship only"
    ],
    "answer": 0,
    "explanation": "These become the SELECT list.",
    "skills": [
      "query-design"
    ]
  },
  {
    "id": "SP-DDD-050",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "prompt": "“Only boats with capacity less than 9.” What does this identify?",
    "options": [
      "Search criterion",
      "Sort order",
      "Entity name only"
    ],
    "answer": 0,
    "explanation": "It filters the records.",
    "skills": [
      "query-design"
    ]
  },
  {
    "id": "SP-DDD-051",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "prompt": "“Highest salePrice first.” What does this identify?",
    "options": [
      "Sort order: salePrice DESC",
      "A primary key",
      "A presence check"
    ],
    "answer": 0,
    "explanation": "Highest first requires descending order.",
    "skills": [
      "query-design"
    ]
  },
  {
    "id": "SP-DDD-052",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "prompt": "“At least 18” becomes which criterion?",
    "options": [
      "age >= 18",
      "age > 18",
      "age = 18 only"
    ],
    "answer": 0,
    "explanation": "At least includes 18.",
    "skills": [
      "query-design",
      "comparison-operator"
    ]
  },
  {
    "id": "SP-DDD-053",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "prompt": "“Under £50” becomes which criterion?",
    "options": [
      "price < 50",
      "price <= 50",
      "price > 50"
    ],
    "answer": 0,
    "explanation": "Under means strictly less than.",
    "skills": [
      "query-design",
      "comparison-operator"
    ]
  },
  {
    "id": "SP-DDD-054",
    "areaId": "ddd",
    "unitId": "ddd-query-design-09",
    "prompt": "“Either red or blue” needs which operator?",
    "options": [
      "OR",
      "AND",
      "NOT"
    ],
    "answer": 0,
    "explanation": "Either condition may be true.",
    "skills": [
      "query-design",
      "comparison-operator"
    ]
  },
  {
    "id": "SP-DDD-055",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "prompt": "The table is named Boat, but the query says FROM Boats. What is wrong?",
    "options": [
      "The table name is misspelled",
      "SELECT needs quotes",
      "ORDER BY is required"
    ],
    "answer": 0,
    "explanation": "SQL must use the exact table name.",
    "skills": [
      "select",
      "from",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-056",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "prompt": "SELECT model capacity FROM Boat; What is missing?",
    "options": [
      "A comma between the field names",
      "A foreign key",
      "A range check"
    ],
    "answer": 0,
    "explanation": "Selected fields are comma-separated.",
    "skills": [
      "select",
      "from",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-057",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "prompt": "What does FROM state?",
    "options": [
      "The table containing the data",
      "The result order",
      "The primary key rule"
    ],
    "answer": 0,
    "explanation": "FROM names the source table or tables.",
    "skills": [
      "select",
      "from",
      "sql"
    ]
  },
  {
    "id": "SP-DDD-058",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "prompt": "Can SQL field spelling differ from the table?",
    "options": [
      "No, use the exact field name",
      "Yes, any synonym works",
      "Only plurals work"
    ],
    "answer": 0,
    "explanation": "The database must recognise the field.",
    "skills": [
      "select",
      "from",
      "sql"
    ]
  },
  {
    "id": "SP-DDD-059",
    "areaId": "ddd",
    "unitId": "ddd-select-10",
    "prompt": "What does SELECT * request?",
    "options": [
      "All fields",
      "Only the primary key",
      "No records"
    ],
    "answer": 0,
    "explanation": "* selects every column.",
    "skills": [
      "select",
      "from",
      "sql"
    ]
  },
  {
    "id": "SP-DDD-060",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "prompt": "“capacity of 9 or fewer” becomes:",
    "options": [
      "capacity <= 9",
      "capacity < 9",
      "capacity >= 9"
    ],
    "answer": 0,
    "explanation": "Or fewer includes 9.",
    "skills": [
      "where",
      "comparison-operator"
    ]
  },
  {
    "id": "SP-DDD-061",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "prompt": "“rating above 4.8” becomes:",
    "options": [
      "rating > 4.8",
      "rating >= 4.8",
      "rating < 4.8"
    ],
    "answer": 0,
    "explanation": "Above is strictly greater than.",
    "skills": [
      "where",
      "comparison-operator"
    ]
  },
  {
    "id": "SP-DDD-062",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "prompt": "Does the WHERE field have to be in SELECT?",
    "options": [
      "No",
      "Yes, always",
      "Only if it is text"
    ],
    "answer": 0,
    "explanation": "A query can filter using a field that is not displayed.",
    "skills": [
      "where",
      "comparison-operator"
    ]
  },
  {
    "id": "SP-DDD-063",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "prompt": "Which values need quotation marks?",
    "options": [
      "Text values",
      "Every number",
      "Field names in all cases"
    ],
    "answer": 0,
    "explanation": "Text literals need quotes.",
    "skills": [
      "where",
      "criteria"
    ]
  },
  {
    "id": "SP-DDD-064",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "prompt": "Which operator means not equal?",
    "options": [
      "!=",
      "=<",
      "==="
    ],
    "answer": 0,
    "explanation": "!= means not equal.",
    "skills": [
      "where",
      "criteria"
    ]
  },
  {
    "id": "SP-DDD-065",
    "areaId": "ddd",
    "unitId": "ddd-where-11",
    "prompt": "Which criterion finds books published before 2000?",
    "options": [
      "published < 2000",
      "published > 2000",
      "published = 'before'"
    ],
    "answer": 0,
    "explanation": "Before means a smaller year.",
    "skills": [
      "where",
      "criteria"
    ]
  },
  {
    "id": "SP-DDD-066",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "prompt": "A query uses brand='Yamaha' AND brand='Fairline'. Why will it return no boats?",
    "options": [
      "One brand value cannot equal both at once",
      "The field needs no quotes",
      "SELECT cannot use model"
    ],
    "answer": 0,
    "explanation": "Use OR when either different value is accepted.",
    "skills": [
      "and",
      "or",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-067",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "prompt": "A range uses age >=16 OR age <=18. Why is it too broad?",
    "options": [
      "Most ages satisfy at least one condition; use AND",
      "It should use DESC",
      "It needs two tables"
    ],
    "answer": 0,
    "explanation": "Both lower and upper limits must be met.",
    "skills": [
      "and",
      "or",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-068",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "prompt": "Which operator is used when both conditions must be met?",
    "options": [
      "AND",
      "OR",
      "ASC"
    ],
    "answer": 0,
    "explanation": "AND requires both.",
    "skills": [
      "and",
      "or",
      "where"
    ]
  },
  {
    "id": "SP-DDD-069",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "prompt": "Which operator joins alternative colours?",
    "options": [
      "OR",
      "AND",
      "FROM"
    ],
    "answer": 0,
    "explanation": "Any listed colour may match.",
    "skills": [
      "and",
      "or",
      "where"
    ]
  },
  {
    "id": "SP-DDD-070",
    "areaId": "ddd",
    "unitId": "ddd-logic-12",
    "prompt": "Which condition finds values between 10 and 20 inclusive?",
    "options": [
      "value >= 10 AND value <= 20",
      "value >= 10 OR value <= 20",
      "value = 10,20"
    ],
    "answer": 0,
    "explanation": "Both limits must be met.",
    "skills": [
      "and",
      "or",
      "where"
    ]
  },
  {
    "id": "SP-DDD-071",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "prompt": "The question asks for highest price first but the query uses ASC. What should change?",
    "options": [
      "Use DESC",
      "Remove SELECT",
      "Add a primary key"
    ],
    "answer": 0,
    "explanation": "DESC sorts largest to smallest.",
    "skills": [
      "order-by",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-072",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "prompt": "The required order is colour, then highest price. Which ORDER BY is correct?",
    "options": [
      "ORDER BY colour ASC, price DESC",
      "ORDER BY price DESC, colour ASC",
      "ORDER BY colour AND price"
    ],
    "answer": 0,
    "explanation": "The primary sort field must appear first.",
    "skills": [
      "order-by",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-073",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "prompt": "Is ASC required when ascending is intended?",
    "options": [
      "It may be omitted, but including it is clearer",
      "It is forbidden",
      "DESC means ascending"
    ],
    "answer": 0,
    "explanation": "ASC is the default.",
    "skills": [
      "order-by",
      "asc",
      "desc"
    ]
  },
  {
    "id": "SP-DDD-074",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "prompt": "Which field controls the overall grouping in a two-field sort?",
    "options": [
      "The first field listed",
      "The second field only",
      "The primary key always"
    ],
    "answer": 0,
    "explanation": "The first field is the primary sort.",
    "skills": [
      "order-by",
      "asc",
      "desc"
    ]
  },
  {
    "id": "SP-DDD-075",
    "areaId": "ddd",
    "unitId": "ddd-order-13",
    "prompt": "Which direction normally puts A before Z?",
    "options": [
      "ASC",
      "DESC",
      "OR"
    ],
    "answer": 0,
    "explanation": "Ascending text order is A to Z.",
    "skills": [
      "order-by",
      "asc",
      "desc"
    ]
  },
  {
    "id": "SP-DDD-076",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "prompt": "A query lists Boat and Dock in FROM but has no key-matching condition. What is missing?",
    "options": [
      "An equi-join in WHERE",
      "An INSERT statement",
      "A validation rule"
    ],
    "answer": 0,
    "explanation": "The tables must be linked using matching keys.",
    "skills": [
      "equi-join",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-077",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "prompt": "Both tables contain dockID. How can the query make the field unambiguous?",
    "options": [
      "Use TableName.fieldName",
      "Rename every record",
      "Use quotes around the table"
    ],
    "answer": 0,
    "explanation": "Qualified names show which table supplies the field.",
    "skills": [
      "equi-join",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-078",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "prompt": "What happens without an equi-join?",
    "options": [
      "Unrelated records are combined",
      "Referential integrity improves",
      "Only one record is shown"
    ],
    "answer": 0,
    "explanation": "A Cartesian product is produced.",
    "skills": [
      "equi-join",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-079",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "prompt": "Why are two tables needed in the boats-and-docks query?",
    "options": [
      "The requested fields are stored in different tables",
      "SQL always needs two tables",
      "To apply a length check"
    ],
    "answer": 0,
    "explanation": "The model and dock name come from different related tables.",
    "skills": [
      "equi-join",
      "two-tables"
    ]
  },
  {
    "id": "SP-DDD-080",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "prompt": "What connects the tables?",
    "options": [
      "PK = matching FK",
      "ASC = DESC",
      "SELECT = FROM"
    ],
    "answer": 0,
    "explanation": "The equality condition joins related rows.",
    "skills": [
      "equi-join",
      "two-tables"
    ]
  },
  {
    "id": "SP-DDD-081",
    "areaId": "ddd",
    "unitId": "ddd-join-14",
    "prompt": "How is another search criterion added after the join?",
    "options": [
      "Using AND",
      "Using VALUES",
      "Using a second SELECT keyword"
    ],
    "answer": 0,
    "explanation": "AND combines the join condition with the filter.",
    "skills": [
      "equi-join",
      "two-tables"
    ]
  },
  {
    "id": "SP-DDD-082",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "prompt": "An INSERT lists four fields but only three values. What is wrong?",
    "options": [
      "The number of values does not match",
      "ORDER BY is missing",
      "The FK should be a Boolean"
    ],
    "answer": 0,
    "explanation": "Every listed field needs a corresponding value.",
    "skills": [
      "insert",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-083",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "prompt": "A new record reuses an existing primary key. What problem occurs?",
    "options": [
      "Duplicate primary key",
      "Two-level sorting",
      "Range validation"
    ],
    "answer": 0,
    "explanation": "Primary-key values must be unique.",
    "skills": [
      "insert",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-084",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "prompt": "Values are in a different order from the fields. What can happen?",
    "options": [
      "Data is placed in the wrong columns",
      "The database sorts automatically",
      "The record becomes a relationship name"
    ],
    "answer": 0,
    "explanation": "Position determines which field receives each value.",
    "skills": [
      "insert",
      "sql-debugging"
    ]
  },
  {
    "id": "SP-DDD-085",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "prompt": "What follows INSERT INTO tableName?",
    "options": [
      "An optional field list in brackets",
      "ORDER BY only",
      "A relationship line"
    ],
    "answer": 0,
    "explanation": "The field list identifies where values go.",
    "skills": [
      "insert",
      "values",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-086",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "prompt": "Which error is caused by reusing C101?",
    "options": [
      "Duplicate primary key",
      "Missing sort",
      "Deletion anomaly"
    ],
    "answer": 0,
    "explanation": "The primary key must be unique.",
    "skills": [
      "insert",
      "values",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-087",
    "areaId": "ddd",
    "unitId": "ddd-insert-15",
    "prompt": "Can a child foreign key refer to a parent that does not exist?",
    "options": [
      "No, referential integrity prevents it",
      "Yes, always",
      "Only after UPDATE"
    ],
    "answer": 0,
    "explanation": "The relationship must remain valid.",
    "skills": [
      "insert",
      "values",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-088",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "prompt": "Exactly one record should change, but WHERE uses surname='Smith'. What is the risk?",
    "options": [
      "Several records may be updated; use the primary key",
      "No record can ever update",
      "The SELECT list is wrong"
    ],
    "answer": 0,
    "explanation": "Non-unique criteria may match several records.",
    "skills": [
      "update",
      "sql-debugging",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-089",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "prompt": "The query updates price instead of status. What is wrong?",
    "options": [
      "The wrong field is named in SET",
      "FROM is missing",
      "The PK is duplicated"
    ],
    "answer": 0,
    "explanation": "SET must target the requested field.",
    "skills": [
      "update",
      "sql-debugging",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-090",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "prompt": "What happens if WHERE is omitted?",
    "options": [
      "Every record in the table may be updated",
      "Only the PK changes",
      "The table is deleted"
    ],
    "answer": 0,
    "explanation": "Without a filter, UPDATE affects all rows.",
    "skills": [
      "update",
      "sql-debugging",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-091",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "prompt": "Which keyword introduces changed values?",
    "options": [
      "SET",
      "SELECT",
      "FROM"
    ],
    "answer": 0,
    "explanation": "SET states the new field values.",
    "skills": [
      "update",
      "set",
      "where"
    ]
  },
  {
    "id": "SP-DDD-092",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "prompt": "When should a primary key normally be used in WHERE?",
    "options": [
      "When exactly one record must change",
      "When all matching categories must change",
      "Never"
    ],
    "answer": 0,
    "explanation": "A PK uniquely identifies one record.",
    "skills": [
      "update",
      "set",
      "where"
    ]
  },
  {
    "id": "SP-DDD-093",
    "areaId": "ddd",
    "unitId": "ddd-update-16",
    "prompt": "Can one UPDATE change several fields?",
    "options": [
      "Yes, separate assignments with commas",
      "No",
      "Only by deleting first"
    ],
    "answer": 0,
    "explanation": "Several field assignments can appear in SET.",
    "skills": [
      "update",
      "set",
      "where"
    ]
  },
  {
    "id": "SP-DDD-094",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "prompt": "One pupil record should be removed, but WHERE uses className='P7A'. What is the risk?",
    "options": [
      "Every P7A pupil may be deleted",
      "No pupil can be deleted",
      "Only the class field changes"
    ],
    "answer": 0,
    "explanation": "The criterion is not unique.",
    "skills": [
      "delete",
      "sql-debugging",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-095",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "prompt": "What happens if DELETE FROM Orders has no WHERE?",
    "options": [
      "All Orders records may be removed",
      "Only one record is removed",
      "The table is sorted"
    ],
    "answer": 0,
    "explanation": "No filter limits the deletion.",
    "skills": [
      "delete",
      "sql-debugging",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-096",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "prompt": "Why can deleting a parent record fail?",
    "options": [
      "Child records still reference its primary key",
      "ASC is missing",
      "The primary key is unique"
    ],
    "answer": 0,
    "explanation": "Referential integrity prevents orphaned records.",
    "skills": [
      "delete",
      "sql-debugging",
      "primary-key"
    ]
  },
  {
    "id": "SP-DDD-097",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "prompt": "Which keyword follows DELETE?",
    "options": [
      "FROM",
      "SET",
      "VALUES"
    ],
    "answer": 0,
    "explanation": "The form is DELETE FROM table.",
    "skills": [
      "delete",
      "where",
      "referential-integrity"
    ]
  },
  {
    "id": "SP-DDD-098",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "prompt": "When can a non-PK criterion be appropriate?",
    "options": [
      "When every matching record should be deleted",
      "When exactly one unknown record must be deleted",
      "Never"
    ],
    "answer": 0,
    "explanation": "A broad criterion is suitable for an intended multi-record deletion.",
    "skills": [
      "delete",
      "where",
      "referential-integrity"
    ]
  },
  {
    "id": "SP-DDD-099",
    "areaId": "ddd",
    "unitId": "ddd-delete-17",
    "prompt": "What should be checked after a delete?",
    "options": [
      "The expected number and identity of remaining records",
      "Only the font",
      "Only the field size"
    ],
    "answer": 0,
    "explanation": "Testing confirms the correct records were removed.",
    "skills": [
      "delete",
      "where",
      "referential-integrity"
    ]
  },
  {
    "id": "SP-DDD-100",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "prompt": "For SELECT book_title, author FROM Books WHERE copies_sold < 10 OR rating > 4.8, which book definitely appears?",
    "options": [
      "The Last Bear",
      "Wonder only because 12 < 10",
      "No books"
    ],
    "answer": 0,
    "explanation": "The Last Bear has copies_sold 9 and rating 4.9, so it satisfies the condition.",
    "skills": [
      "testing",
      "query-output",
      "select",
      "where"
    ]
  },
  {
    "id": "SP-DDD-101",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "prompt": "What should a query test include?",
    "options": [
      "Known input/database state and expected output",
      "Only the SQL font",
      "An unrelated password"
    ],
    "answer": 0,
    "explanation": "Testing compares the actual result with a predicted result.",
    "skills": [
      "testing",
      "query-output",
      "select",
      "where"
    ]
  },
  {
    "id": "SP-DDD-102",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "prompt": "Which design shows two entities and their one-to-many relationship?",
    "options": [
      "ERD",
      "Test table only",
      "Python traceback"
    ],
    "answer": 0,
    "explanation": "An ERD models entities, keys and relationships.",
    "skills": [
      "ddd-mastery",
      "requirements",
      "erd",
      "data-dictionary",
      "sql",
      "referential-integrity"
    ]
  },
  {
    "id": "SP-DDD-103",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "prompt": "Which SQL operation changes existing data?",
    "options": [
      "UPDATE",
      "SELECT",
      "ERD"
    ],
    "answer": 0,
    "explanation": "UPDATE changes stored values.",
    "skills": [
      "ddd-mastery",
      "requirements",
      "erd",
      "data-dictionary",
      "sql",
      "referential-integrity"
    ]
  },
  {
    "id": "SP-DDD-104",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "prompt": "Which rule prevents an invalid FK from being stored?",
    "options": [
      "Referential integrity",
      "Descending order",
      "Field alias"
    ],
    "answer": 0,
    "explanation": "Every FK must match a valid parent PK.",
    "skills": [
      "ddd-mastery",
      "requirements",
      "erd",
      "data-dictionary",
      "sql",
      "referential-integrity"
    ]
  },
  {
    "id": "SP-DDD-105",
    "areaId": "ddd",
    "unitId": "ddd-mastery-18",
    "prompt": "Which artefact records type, size, key and validation?",
    "options": [
      "Data dictionary",
      "Query result only",
      "End-user list"
    ],
    "answer": 0,
    "explanation": "The data dictionary documents field rules.",
    "skills": [
      "ddd-mastery",
      "requirements",
      "erd",
      "data-dictionary",
      "sql",
      "referential-integrity"
    ]
  }
]);


SPACED_QUESTIONS.push(...[
  {
    "id": "SP-CS-001",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "prompt": "What is the value of the leftmost place in an 8-bit positive integer?",
    "options": [
      "128",
      "64",
      "256"
    ],
    "answer": 0,
    "explanation": "The place values begin 128, 64, 32...",
    "skills": [
      "binary",
      "place-values"
    ]
  },
  {
    "id": "SP-CS-002",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "prompt": "Which digits are binary digits?",
    "options": [
      "0 and 1",
      "0 to 9",
      "1 and 2"
    ],
    "answer": 0,
    "explanation": "Binary uses two digits.",
    "skills": [
      "binary",
      "bits"
    ]
  },
  {
    "id": "SP-CS-003",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "prompt": "What is 0000 0101 in denary?",
    "options": [
      "5",
      "6",
      "4"
    ],
    "answer": 0,
    "explanation": "4 + 1 = 5.",
    "skills": [
      "binary",
      "place-values"
    ]
  },
  {
    "id": "SP-CS-004",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "prompt": "Which pattern represents 8?",
    "options": [
      "0000 1000",
      "0000 0100",
      "0001 0000"
    ],
    "answer": 0,
    "explanation": "The 8 place is selected.",
    "skills": [
      "binary",
      "place-values"
    ]
  },
  {
    "id": "SP-CS-005",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "prompt": "What does a 0 mean in a binary place?",
    "options": [
      "Do not include that place value",
      "Add the place twice",
      "End the number"
    ],
    "answer": 0,
    "explanation": "Only 1 bits contribute.",
    "skills": [
      "binary",
      "bits"
    ]
  },
  {
    "id": "SP-CS-006",
    "areaId": "cs",
    "unitId": "cs-binary-01",
    "prompt": "What is the largest unsigned value in 8 bits?",
    "options": [
      "255",
      "256",
      "128"
    ],
    "answer": 0,
    "explanation": "All place values sum to 255.",
    "skills": [
      "binary",
      "positive-integers"
    ]
  },
  {
    "id": "SP-CS-007",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "prompt": "What is 0010 0000 in denary?",
    "options": [
      "32",
      "16",
      "64"
    ],
    "answer": 0,
    "explanation": "The 32 place is selected.",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ]
  },
  {
    "id": "SP-CS-008",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "prompt": "Which is 10 in 8-bit binary?",
    "options": [
      "0000 1010",
      "0001 0100",
      "0000 1001"
    ],
    "answer": 0,
    "explanation": "8 + 2 = 10.",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ]
  },
  {
    "id": "SP-CS-009",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "prompt": "What is 0100 0001 in denary?",
    "options": [
      "65",
      "64",
      "66"
    ],
    "answer": 0,
    "explanation": "64 + 1 = 65.",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ]
  },
  {
    "id": "SP-CS-010",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "prompt": "Which places make 75?",
    "options": [
      "64 + 8 + 2 + 1",
      "64 + 16",
      "32 + 16 + 8"
    ],
    "answer": 0,
    "explanation": "Those values total 75.",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ]
  },
  {
    "id": "SP-CS-011",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "prompt": "What is 1000 0000 in denary?",
    "options": [
      "128",
      "127",
      "256"
    ],
    "answer": 0,
    "explanation": "Only the 128 place is selected.",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ]
  },
  {
    "id": "SP-CS-012",
    "areaId": "cs",
    "unitId": "cs-conversion-02",
    "prompt": "Which is 255 in binary?",
    "options": [
      "1111 1111",
      "1000 0000",
      "0111 1111"
    ],
    "answer": 0,
    "explanation": "Every place is selected.",
    "skills": [
      "binary",
      "denary",
      "conversion"
    ]
  },
  {
    "id": "SP-CS-013",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "prompt": "Which term means significant digits?",
    "options": [
      "Mantissa",
      "Exponent",
      "Address"
    ],
    "answer": 0,
    "explanation": "The mantissa stores significant digits.",
    "skills": [
      "floating-point",
      "mantissa"
    ]
  },
  {
    "id": "SP-CS-014",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "prompt": "Which term controls how far the binary point moves?",
    "options": [
      "Exponent",
      "Mantissa",
      "Register"
    ],
    "answer": 0,
    "explanation": "The exponent controls movement of the point.",
    "skills": [
      "floating-point",
      "exponent"
    ]
  },
  {
    "id": "SP-CS-015",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "prompt": "More mantissa bits mainly improve what?",
    "options": [
      "Precision",
      "Network security",
      "Energy use"
    ],
    "answer": 0,
    "explanation": "They store more significant digits.",
    "skills": [
      "floating-point",
      "precision"
    ]
  },
  {
    "id": "SP-CS-016",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "prompt": "More exponent bits mainly increase what?",
    "options": [
      "Range",
      "Pixel count only",
      "ASCII code length"
    ],
    "answer": 0,
    "explanation": "They allow a wider magnitude range.",
    "skills": [
      "floating-point",
      "range"
    ]
  },
  {
    "id": "SP-CS-017",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "prompt": "Floating point is used for which type?",
    "options": [
      "Positive real numbers",
      "Table names",
      "Firewall rules"
    ],
    "answer": 0,
    "explanation": "It represents values with fractional parts.",
    "skills": [
      "floating-point",
      "real-numbers"
    ]
  },
  {
    "id": "SP-CS-018",
    "areaId": "cs",
    "unitId": "cs-floating-03",
    "prompt": "Which pair is correct?",
    "options": [
      "mantissa—digits; exponent—point movement",
      "mantissa—traffic; exponent—pixels",
      "mantissa—address; exponent—ALU"
    ],
    "answer": 0,
    "explanation": "These are the two floating-point roles.",
    "skills": [
      "floating-point",
      "mantissa",
      "exponent"
    ]
  },
  {
    "id": "SP-CS-019",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "prompt": "How many bits does extended ASCII use?",
    "options": [
      "8",
      "7",
      "16"
    ],
    "answer": 0,
    "explanation": "Extended ASCII uses 8 bits.",
    "skills": [
      "ascii",
      "8-bit"
    ]
  },
  {
    "id": "SP-CS-020",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "prompt": "What does one ASCII code represent?",
    "options": [
      "A character",
      "A full image",
      "A processor"
    ],
    "answer": 0,
    "explanation": "Each pattern maps to a character.",
    "skills": [
      "ascii",
      "characters"
    ]
  },
  {
    "id": "SP-CS-021",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "prompt": "How many 8-bit patterns are possible?",
    "options": [
      "256",
      "255",
      "8"
    ],
    "answer": 0,
    "explanation": "2^8 = 256.",
    "skills": [
      "ascii",
      "8-bit"
    ]
  },
  {
    "id": "SP-CS-022",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "prompt": "Why use a standard character code?",
    "options": [
      "So systems interpret patterns consistently",
      "To reduce screen brightness",
      "To create an ERD"
    ],
    "answer": 0,
    "explanation": "A common mapping gives patterns shared meanings.",
    "skills": [
      "ascii",
      "characters"
    ]
  },
  {
    "id": "SP-CS-023",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "prompt": "Which could extended ASCII represent?",
    "options": [
      "A letter or symbol",
      "An entire bitmap automatically",
      "A memory bus"
    ],
    "answer": 0,
    "explanation": "It represents individual characters.",
    "skills": [
      "ascii",
      "characters"
    ]
  },
  {
    "id": "SP-CS-024",
    "areaId": "cs",
    "unitId": "cs-ascii-04",
    "prompt": "Which is an 8-bit code?",
    "options": [
      "0100 0001",
      "0102",
      "111111111"
    ],
    "answer": 0,
    "explanation": "It has eight binary digits.",
    "skills": [
      "ascii",
      "8-bit"
    ]
  },
  {
    "id": "SP-CS-025",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "prompt": "Which method stores objects?",
    "options": [
      "Vector",
      "Bitmap",
      "ASCII"
    ],
    "answer": 0,
    "explanation": "Vector graphics store objects.",
    "skills": [
      "vector-graphics"
    ]
  },
  {
    "id": "SP-CS-026",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "prompt": "Which method stores pixels?",
    "options": [
      "Bitmap",
      "Vector",
      "Floating point"
    ],
    "answer": 0,
    "explanation": "A bitmap stores a pixel grid.",
    "skills": [
      "bitmap",
      "pixels"
    ]
  },
  {
    "id": "SP-CS-027",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "prompt": "Which is a vector attribute?",
    "options": [
      "Fill colour",
      "Mantissa",
      "Data bus"
    ],
    "answer": 0,
    "explanation": "Vector objects store fill colour.",
    "skills": [
      "vector-graphics",
      "fill-colour"
    ]
  },
  {
    "id": "SP-CS-028",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "prompt": "Which is a named vector object?",
    "options": [
      "Polygon",
      "Pixel code page",
      "Register"
    ],
    "answer": 0,
    "explanation": "Polygon is one of the named objects.",
    "skills": [
      "vector-graphics"
    ]
  },
  {
    "id": "SP-CS-029",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "prompt": "What describes a vector line position?",
    "options": [
      "Coordinates",
      "ASCII only",
      "Firewall rules"
    ],
    "answer": 0,
    "explanation": "Coordinates locate objects.",
    "skills": [
      "vector-graphics",
      "coordinates"
    ]
  },
  {
    "id": "SP-CS-030",
    "areaId": "cs",
    "unitId": "cs-graphics-05",
    "prompt": "Which answer correctly compares the methods?",
    "options": [
      "vector stores objects; bitmap stores pixels",
      "vector stores characters; bitmap stores buses",
      "both only store text"
    ],
    "answer": 0,
    "explanation": "The storage methods differ.",
    "skills": [
      "vector-graphics",
      "bitmap",
      "comparison"
    ]
  },
  {
    "id": "SP-CS-031",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "prompt": "Which component performs arithmetic?",
    "options": [
      "ALU",
      "Control unit",
      "Address bus"
    ],
    "answer": 0,
    "explanation": "The ALU performs arithmetic.",
    "skills": [
      "alu",
      "processor"
    ]
  },
  {
    "id": "SP-CS-032",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "prompt": "Which component performs logical comparisons?",
    "options": [
      "ALU",
      "Register only",
      "Monitor"
    ],
    "answer": 0,
    "explanation": "The ALU also performs logic.",
    "skills": [
      "alu",
      "processor"
    ]
  },
  {
    "id": "SP-CS-033",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "prompt": "Which component coordinates instructions?",
    "options": [
      "Control unit",
      "ALU",
      "Bitmap"
    ],
    "answer": 0,
    "explanation": "The control unit manages execution.",
    "skills": [
      "control-unit",
      "processor"
    ]
  },
  {
    "id": "SP-CS-034",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "prompt": "What are registers?",
    "options": [
      "Small fast storage inside the processor",
      "Network filters",
      "Graphics objects"
    ],
    "answer": 0,
    "explanation": "Registers hold current values/instructions.",
    "skills": [
      "registers",
      "processor"
    ]
  },
  {
    "id": "SP-CS-035",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "prompt": "Where might operands be held immediately before an ALU operation?",
    "options": [
      "Registers",
      "Monitor settings",
      "ASCII table only"
    ],
    "answer": 0,
    "explanation": "Registers supply fast temporary storage.",
    "skills": [
      "registers",
      "alu"
    ]
  },
  {
    "id": "SP-CS-036",
    "areaId": "cs",
    "unitId": "cs-processor-06",
    "prompt": "Which three belong inside the processor model?",
    "options": [
      "registers, ALU, control unit",
      "pixels, firewall, table",
      "compiler, monitor, FK"
    ],
    "answer": 0,
    "explanation": "These are the named processor components.",
    "skills": [
      "processor",
      "registers",
      "alu",
      "control-unit"
    ]
  },
  {
    "id": "SP-CS-037",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "prompt": "Why are memory addresses unique?",
    "options": [
      "To identify each location",
      "To encrypt every value",
      "To sort SQL"
    ],
    "answer": 0,
    "explanation": "A unique address selects one location.",
    "skills": [
      "memory",
      "addresses"
    ]
  },
  {
    "id": "SP-CS-038",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "prompt": "Which bus carries an address?",
    "options": [
      "Address bus",
      "Data bus",
      "USB only"
    ],
    "answer": 0,
    "explanation": "The address bus carries location addresses.",
    "skills": [
      "address-bus"
    ]
  },
  {
    "id": "SP-CS-039",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "prompt": "Which bus carries the stored value?",
    "options": [
      "Data bus",
      "Address bus",
      "Control unit"
    ],
    "answer": 0,
    "explanation": "The data bus transfers data.",
    "skills": [
      "data-bus"
    ]
  },
  {
    "id": "SP-CS-040",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "prompt": "Location 24 is requested. What travels on the address bus?",
    "options": [
      "24",
      "The value stored at 24 only",
      "A polygon"
    ],
    "answer": 0,
    "explanation": "The address identifies the location.",
    "skills": [
      "memory",
      "address-bus"
    ]
  },
  {
    "id": "SP-CS-041",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "prompt": "The value at location 24 is 91. What may return on the data bus?",
    "options": [
      "91",
      "24 only",
      "The word firewall"
    ],
    "answer": 0,
    "explanation": "The data bus carries the value.",
    "skills": [
      "memory",
      "data-bus"
    ]
  },
  {
    "id": "SP-CS-042",
    "areaId": "cs",
    "unitId": "cs-memory-07",
    "prompt": "Which pair is correct?",
    "options": [
      "address bus—location; data bus—value",
      "address bus—pixel; data bus—mantissa",
      "address bus—encryption; data bus—standby"
    ],
    "answer": 0,
    "explanation": "The buses have distinct roles.",
    "skills": [
      "address-bus",
      "data-bus"
    ]
  },
  {
    "id": "SP-CS-043",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "prompt": "Why must high-level code be translated?",
    "options": [
      "Processors execute machine code",
      "Monitors use SQL",
      "Firewalls need ERDs"
    ],
    "answer": 0,
    "explanation": "The processor executes binary instructions.",
    "skills": [
      "machine-code",
      "high-level-language"
    ]
  },
  {
    "id": "SP-CS-044",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "prompt": "Which translates a whole program first?",
    "options": [
      "Compiler",
      "Interpreter",
      "ALU"
    ],
    "answer": 0,
    "explanation": "A compiler translates the full program.",
    "skills": [
      "compiler"
    ]
  },
  {
    "id": "SP-CS-045",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "prompt": "Which translates during execution?",
    "options": [
      "Interpreter",
      "Compiler only",
      "Address bus"
    ],
    "answer": 0,
    "explanation": "An interpreter processes source as it runs.",
    "skills": [
      "interpreter"
    ]
  },
  {
    "id": "SP-CS-046",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "prompt": "What is machine code made from?",
    "options": [
      "Binary instructions",
      "Pseudocode paragraphs",
      "Vector colours"
    ],
    "answer": 0,
    "explanation": "Machine code is binary.",
    "skills": [
      "machine-code",
      "binary"
    ]
  },
  {
    "id": "SP-CS-047",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "prompt": "Which statement is correct?",
    "options": [
      "Both compiler and interpreter translate high-level code",
      "A compiler is a firewall",
      "An interpreter stores pixels"
    ],
    "answer": 0,
    "explanation": "Both are translators.",
    "skills": [
      "compiler",
      "interpreter"
    ]
  },
  {
    "id": "SP-CS-048",
    "areaId": "cs",
    "unitId": "cs-translators-08",
    "prompt": "A ready executable was produced before running. Which translator fits?",
    "options": [
      "Compiler",
      "Interpreter",
      "Register"
    ],
    "answer": 0,
    "explanation": "A compiler translates beforehand.",
    "skills": [
      "compiler"
    ]
  },
  {
    "id": "SP-CS-049",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "prompt": "Which change reduces monitor energy use?",
    "options": [
      "Lower brightness",
      "Increase brightness",
      "Disable screen-off"
    ],
    "answer": 0,
    "explanation": "Lower brightness uses less energy.",
    "skills": [
      "monitor-settings",
      "energy-use"
    ]
  },
  {
    "id": "SP-CS-050",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "prompt": "Which setting helps when computers are unused overnight?",
    "options": [
      "Automatic power down",
      "Maximum brightness",
      "No timeout"
    ],
    "answer": 0,
    "explanation": "Power down avoids unnecessary use.",
    "skills": [
      "power-down",
      "energy-use"
    ]
  },
  {
    "id": "SP-CS-051",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "prompt": "Standby normally uses what compared with fully active?",
    "options": [
      "Less energy",
      "More energy always",
      "Exactly no energy"
    ],
    "answer": 0,
    "explanation": "Standby reduces use but is not zero.",
    "skills": [
      "standby",
      "energy-use"
    ]
  },
  {
    "id": "SP-CS-052",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "prompt": "Why reduce computer energy use?",
    "options": [
      "To reduce environmental impact from electricity generation",
      "To increase ASCII codes",
      "To add registers"
    ],
    "answer": 0,
    "explanation": "Lower demand can reduce environmental harm.",
    "skills": [
      "environment",
      "energy-use"
    ]
  },
  {
    "id": "SP-CS-053",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "prompt": "A screen remains on during breaks. Best fix?",
    "options": [
      "Automatic screen-off",
      "Add a firewall",
      "Change mantissa"
    ],
    "answer": 0,
    "explanation": "Monitor settings address the waste.",
    "skills": [
      "monitor-settings"
    ]
  },
  {
    "id": "SP-CS-054",
    "areaId": "cs",
    "unitId": "cs-environment-09",
    "prompt": "For a long holiday, which is usually best?",
    "options": [
      "Power down",
      "Leave fully active",
      "Only increase volume"
    ],
    "answer": 0,
    "explanation": "Powering down saves more than leaving active.",
    "skills": [
      "power-down",
      "environment"
    ]
  },
  {
    "id": "SP-CS-055",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "prompt": "What does a firewall monitor and filter?",
    "options": [
      "Network traffic",
      "Binary place values",
      "SQL fields"
    ],
    "answer": 0,
    "explanation": "It applies rules to network traffic.",
    "skills": [
      "firewall",
      "network-traffic"
    ]
  },
  {
    "id": "SP-CS-056",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "prompt": "What does encryption do to readable data?",
    "options": [
      "Transforms it into an unreadable form",
      "Turns off the monitor",
      "Adds a primary key"
    ],
    "answer": 0,
    "explanation": "Encrypted data is unreadable without the correct key.",
    "skills": [
      "encryption"
    ]
  },
  {
    "id": "SP-CS-057",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "prompt": "Who should be able to decrypt a confidential message?",
    "options": [
      "An authorised recipient with the correct key",
      "Anyone who intercepts it",
      "Only the address bus"
    ],
    "answer": 0,
    "explanation": "The key controls access to readable content.",
    "skills": [
      "encryption",
      "security"
    ]
  },
  {
    "id": "SP-CS-058",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "prompt": "Which blocks a disallowed connection?",
    "options": [
      "Firewall",
      "Mantissa",
      "Bitmap"
    ],
    "answer": 0,
    "explanation": "A firewall filters connections.",
    "skills": [
      "firewall"
    ]
  },
  {
    "id": "SP-CS-059",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "prompt": "Which protects message contents during transmission?",
    "options": [
      "Encryption",
      "Standby",
      "Vector coordinates"
    ],
    "answer": 0,
    "explanation": "Encryption protects confidentiality.",
    "skills": [
      "encryption",
      "electronic-communications"
    ]
  },
  {
    "id": "SP-CS-060",
    "areaId": "cs",
    "unitId": "cs-security-10",
    "prompt": "Which comparison is correct?",
    "options": [
      "firewall filters traffic; encryption protects content",
      "firewall stores pixels; encryption powers down",
      "both only convert binary"
    ],
    "answer": 0,
    "explanation": "They provide different protections.",
    "skills": [
      "firewall",
      "encryption"
    ]
  }
]);

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

const APP_VERSION = "7.0.2";
console.info(`Python Practice v${APP_VERSION}: ${AREAS.filter(area => area.active).length} active areas, ${UNITS.length} units, ${ACTIVITIES.length} pathway activities, ${SPACED_QUESTIONS.length} spaced questions`);

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
let sqlJsModulePromise = null;
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
let debugGameOverRevealTimer = null;
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

function requiredActivities(areaId = null) {
  const activeAreaIds = new Set(AREAS.filter(area => area.active).map(area => area.id));
  return sortedActivities().filter(activity =>
    activeAreaIds.has(activity.areaId)
    && (!areaId || activity.areaId === areaId)
    && activity.required !== false
    && activity.published !== false
  );
}

function visibleActivities() {
  return sortedActivities().filter(activity => activity.published !== false);
}

function completedActivityIds() {
  return new Set([...currentProgress.entries()].filter(([, progress]) => progress.completed).map(([id]) => id));
}

function previousRequiredActivity(activity) {
  const required = requiredActivities(activity.areaId);
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
  const sameUnitRequired = requiredActivities(activity.areaId).filter(item => item.unitId === activity.unitId && Number(item.order) < Number(activity.order));
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
  const core = requiredActivities(selectedAreaId);
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

function nextPathwayActivity(activity) {
  if (!activity) return null;
  const areaActivities = sortedActivities(
    allActivities.filter(item => item.areaId === activity.areaId && item.published !== false)
  );
  const currentIndex = areaActivities.findIndex(item => item.id === activity.id);
  if (currentIndex < 0) return null;
  return areaActivities.slice(currentIndex + 1).find(item => isActivityUnlocked(item)) || null;
}

function removeNextQuestionButton(container) {
  container?.querySelector(".next-question-actions")?.remove();
}

function addNextQuestionButton(container, activity) {
  if (!container || !activity) return;
  removeNextQuestionButton(container);

  const next = nextPathwayActivity(activity);
  const actions = document.createElement("div");
  actions.className = "next-question-actions";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "next-question-button";
  button.textContent = next ? "Next question →" : "Return to pathway";

  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      if (currentActivity?.type === "official-paper" && officialResponseDirty) {
        await saveOfficialResponseDraft(currentActivity, { silent: true });
      }
      stopTracePlayback();
      resetOfficialResponseWorkspace();
      if (next) {
        openActivity(next);
      } else {
        showView("pupilView");
        await loadPupilDashboard();
      }
    } catch (error) {
      console.error("Could not open the next question:", error);
      button.disabled = false;
      showMessage(error.message || "The next question could not be opened.", "error");
    }
  });

  actions.appendChild(button);
  container.appendChild(actions);
}

function setGenericFeedback(text, type = "info") {
  elements.activityFeedback.textContent = text;
  elements.activityFeedback.className = `feedback ${type}`;
  removeNextQuestionButton(elements.activityFeedback);
  if (
    type === "success"
    && currentActivity
    && currentProgress.get(currentActivity.id)?.completed === true
  ) {
    addNextQuestionButton(elements.activityFeedback, currentActivity);
  }
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


function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const existing = [...document.scripts].find(script => script.src === src);
    if (existing?.dataset.loaded === "true") return resolve();
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error("The SQL engine could not be downloaded.")), { once: true });
    document.head.appendChild(script);
  });
}

async function ensureSqlJsModule() {
  if (sqlJsModulePromise) return sqlJsModulePromise;
  sqlJsModulePromise = (async () => {
    const scriptUrl = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
    await loadExternalScript(scriptUrl);
    if (typeof window.initSqlJs !== "function") {
      throw new Error("The SQL engine loaded incorrectly. Reload the page and try again.");
    }
    return window.initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });
  })();
  return sqlJsModulePromise;
}

function normaliseNational5Sql(value) {
  let sql = String(value || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  sql = sql.replace(/#(\d{1,4})\/(\d{1,2})\/(\d{2,4})#/g, (_match, first, second, third) => {
    let year;
    let month;
    let day;
    if (String(first).length === 4) {
      year = Number(first);
      month = Number(second);
      day = Number(third);
    } else {
      day = Number(first);
      month = Number(second);
      year = Number(third);
      if (year < 100) year += 2000;
    }
    return `'${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}'`;
  });

  return sql.trim();
}

async function createSqlActivityDatabase(activity) {
  const SQL = await ensureSqlJsModule();
  const setupSql = DDD_SQL_DATASETS[activity.datasetId];
  if (!setupSql) throw new Error(`Database dataset ${activity.datasetId} was not found.`);
  const database = new SQL.Database();
  database.exec(setupSql);
  database.run("PRAGMA foreign_keys = ON;");
  return database;
}

function lastSqlResult(results) {
  if (!Array.isArray(results) || !results.length) return { columns: [], values: [] };
  const result = results[results.length - 1];
  return {
    columns: Array.isArray(result.columns) ? result.columns : [],
    values: Array.isArray(result.values) ? result.values : []
  };
}

function normaliseSqlComparable(result) {
  return {
    columns: (result.columns || []).map(value => String(value).trim().toLowerCase()),
    values: (result.values || []).map(row => row.map(value => {
      if (value === null || value === undefined) return null;
      if (typeof value === "number") return Number.isInteger(value) ? value : Number(value.toFixed(8));
      return String(value);
    }))
  };
}

async function evaluateSqlActivity(activity, sqlText) {
  const database = await createSqlActivityDatabase(activity);
  try {
    const sql = normaliseNational5Sql(sqlText);
    if (!sql) throw new Error("Write an SQL statement before running it.");
    const statementResults = database.exec(sql);
    const result = activity.checkSql
      ? lastSqlResult(database.exec(normaliseNational5Sql(activity.checkSql)))
      : lastSqlResult(statementResults);
    return { result, sql };
  } finally {
    database.close();
  }
}

async function expectedSqlActivityResult(activity) {
  return evaluateSqlActivity(activity, activity.solutionSql);
}

function sqlResultTableMarkup(result, title = "Query result") {
  const columns = result?.columns || [];
  const rows = result?.values || [];
  if (!columns.length) {
    return `<div class="sql-empty-result"><strong>${escapeHtml(title)}</strong><p>The statement ran successfully and did not return a results table.</p></div>`;
  }
  return `<div class="sql-result-block">
    <div class="subsection-heading"><h4>${escapeHtml(title)}</h4><span class="activity-chip">${rows.length} record${rows.length === 1 ? "" : "s"}</span></div>
    <div class="table-wrap"><table class="sql-result-table"><thead><tr>${columns.map(column => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
    <tbody>${rows.length ? rows.map(row => `<tr>${row.map(value => `<td>${escapeHtml(value === null ? "NULL" : value)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">No records matched.</td></tr>`}</tbody></table></div>
  </div>`;
}

function friendlySqlError(error) {
  const message = String(error?.message || error || "Unknown SQL error");
  const lower = message.toLowerCase();
  if (lower.includes("no such table")) return `${message}\n\nCheck the exact table name after FROM, UPDATE, INSERT INTO or DELETE FROM.`;
  if (lower.includes("no such column")) return `${message}\n\nCheck the exact field name. Use [square brackets] when a field name contains spaces.`;
  if (lower.includes("syntax error")) return `${message}\n\nCheck the SQL keyword order, commas, quotation marks and the final condition.`;
  if (lower.includes("unique constraint failed")) return `${message}\n\nThe primary-key value already exists and cannot be reused.`;
  if (lower.includes("foreign key constraint failed")) return `${message}\n\nReferential integrity was broken. The foreign key must match an existing primary key, and a parent record cannot be removed while child records still use it.`;
  if (lower.includes("not null constraint failed")) return `${message}\n\nA required field has been left without a value.`;
  if (lower.includes("datatype mismatch")) return `${message}\n\nOne value does not match the field’s data type.`;
  return `${message}\n\nCheck the table names, field names, criteria and SQL clause order.`;
}

async function populateSqlPreview(activity, target) {
  target.innerHTML = `<p class="help-text">Loading the practice database…</p>`;
  try {
    const database = await createSqlActivityDatabase(activity);
    const markup = [];
    for (const tableName of activity.previewTables || []) {
      const safeTable = String(tableName).replace(/]/g, "]]");
      const result = lastSqlResult(database.exec(`SELECT * FROM [${safeTable}] LIMIT 8;`));
      markup.push(sqlResultTableMarkup(result, `${tableName} table`));
    }
    database.close();
    target.innerHTML = markup.join("") || `<p class="help-text">The database is ready.</p>`;
  } catch (error) {
    target.innerHTML = `<div class="feedback error">${escapeHtml(friendlySqlError(error))}</div>`;
  }
}

function renderSqlActivity(activity, progress) {
  elements.activityContent.innerHTML = `
    <div class="sql-task-introduction">
      ${activity.promptHtml || `<p>${escapeHtml(activity.description || "Write and run the required SQL.")}</p>`}
      <p class="help-text">This laboratory uses a fresh copy of the database each time. INSERT, UPDATE and DELETE cannot damage another activity.</p>
    </div>
    <div id="sqlDatabasePreview" class="sql-database-preview"></div>`;

  elements.activityInteraction.innerHTML = `
    <section class="sql-workspace">
      <div class="sql-workspace-heading">
        <div><p class="eyebrow">National 5 SQL laboratory</p><h3>Write and test your query</h3></div>
        <span id="sqlSaveStatus" class="save-status saved">Ready</span>
      </div>
      <label for="sqlEditor">SQL statement</label>
      <textarea id="sqlEditor" class="sql-editor" spellcheck="false">${escapeHtml(progress.sqlDraft ?? activity.starterSql ?? "")}</textarea>
      <div class="activity-actions">
        <button id="runSqlButton" type="button">Run SQL</button>
        <button id="checkSqlButton" type="button">Check answer</button>
        <button id="saveSqlButton" type="button" class="save-button">Save progress</button>
        <button id="resetSqlButton" type="button" class="secondary">Reset starter</button>
        ${(activity.hints || []).length ? `<button id="showSqlHintButton" type="button" class="secondary">Show hint</button>` : ""}
      </div>
      <div id="sqlHintPanel" class="hint-box hidden"></div>
      <div id="sqlOutputPanel" class="sql-output-panel"><p class="help-text">Run your SQL to see the result.</p></div>
    </section>`;

  const editor = elements.activityInteraction.querySelector("#sqlEditor");
  const output = elements.activityInteraction.querySelector("#sqlOutputPanel");
  const status = elements.activityInteraction.querySelector("#sqlSaveStatus");
  const runButton = elements.activityInteraction.querySelector("#runSqlButton");
  const checkButton = elements.activityInteraction.querySelector("#checkSqlButton");
  const saveButton = elements.activityInteraction.querySelector("#saveSqlButton");
  const resetButton = elements.activityInteraction.querySelector("#resetSqlButton");
  const hintButton = elements.activityInteraction.querySelector("#showSqlHintButton");
  const hintPanel = elements.activityInteraction.querySelector("#sqlHintPanel");
  let saveTimer = null;
  let hintIndex = 0;

  const saveDraft = async (silent = false) => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    status.textContent = "Saving…";
    status.className = "save-status saving";
    try {
      await saveGenericProgress(activity, { sqlDraft: editor.value });
      status.textContent = "Saved";
      status.className = "save-status saved";
      setGenericStatus(activity);
      if (!silent) setGenericFeedback("SQL draft saved. This does not count as an attempt.", "success");
    } catch (error) {
      status.textContent = "Not saved";
      status.className = "save-status unsaved";
      if (!silent) setGenericFeedback(error.message || "The SQL draft could not be saved.", "error");
    }
  };

  editor.addEventListener("input", () => {
    status.textContent = "Unsaved changes";
    status.className = "save-status unsaved";
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => void saveDraft(true), 4000);
  });

  saveButton.addEventListener("click", () => void saveDraft(false));
  resetButton.addEventListener("click", () => {
    editor.value = activity.starterSql || "";
    status.textContent = "Starter restored";
    status.className = "save-status unsaved";
    output.innerHTML = `<p class="help-text">Run your SQL to see the result.</p>`;
  });

  if (hintButton) {
    hintButton.addEventListener("click", () => {
      const hints = activity.hints || [];
      hintPanel.classList.remove("hidden");
      hintPanel.innerHTML = hints.slice(0, hintIndex + 1).map((hint, index) => `<p><strong>Hint ${index + 1}:</strong> ${escapeHtml(hint)}</p>`).join("");
      hintIndex = Math.min(hints.length - 1, hintIndex + 1);
      hintButton.disabled = hintIndex >= hints.length - 1;
      hintButton.textContent = hintButton.disabled ? "All hints shown" : "Show another hint";
    });
  }

  const setBusy = busy => {
    runButton.disabled = busy;
    checkButton.disabled = busy;
    runButton.textContent = busy ? "Running…" : "Run SQL";
  };

  runButton.addEventListener("click", async () => {
    setBusy(true);
    output.innerHTML = `<p class="help-text">Running SQL…</p>`;
    try {
      const execution = await evaluateSqlActivity(activity, editor.value);
      output.innerHTML = sqlResultTableMarkup(execution.result);
      setGenericFeedback("The SQL ran successfully. Check the displayed records, then use Check answer.", "info");
    } catch (error) {
      output.innerHTML = `<pre class="sql-error-box">${escapeHtml(friendlySqlError(error))}</pre>`;
      setGenericFeedback("The SQL did not run. Use the error information below to repair it.", "error");
    } finally {
      setBusy(false);
    }
  });

  checkButton.addEventListener("click", async () => {
    setBusy(true);
    output.innerHTML = `<p class="help-text">Checking the result…</p>`;
    let correct = false;
    try {
      const [student, expected] = await Promise.all([
        evaluateSqlActivity(activity, editor.value),
        expectedSqlActivityResult(activity)
      ]);
      correct = JSON.stringify(normaliseSqlComparable(student.result)) === JSON.stringify(normaliseSqlComparable(expected.result));
      output.innerHTML = sqlResultTableMarkup(student.result, "Your result");
      await saveGenericProgress(activity, {
        sqlDraft: editor.value,
        sqlCheckedAt: new Date().toISOString()
      }, { countAttempt: true, correct });

      if (correct) {
        setGenericFeedback("Correct — your SQL produces the required result. Activity complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      } else {
        setGenericFeedback("The SQL ran, but its result does not yet match the requirement. Check the fields, records and order shown.", "error");
      }
    } catch (error) {
      await saveGenericProgress(activity, { sqlDraft: editor.value }, { countAttempt: true, correct: false });
      output.innerHTML = `<pre class="sql-error-box">${escapeHtml(friendlySqlError(error))}</pre>`;
      setGenericFeedback("The SQL could not be checked because it stopped with an error.", "error");
    } finally {
      setBusy(false);
      status.textContent = "Saved";
      status.className = "save-status saved";
    }
  });

  void populateSqlPreview(activity, elements.activityContent.querySelector("#sqlDatabasePreview"));
}



function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}

function normaliseErdName(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function renderBinaryBuilder(activity, progress) {
  const correctPlaceValues = [128, 64, 32, 16, 8, 4, 2, 1];
  let bits = Array.isArray(progress.binaryBits) && progress.binaryBits.length === 8
    ? progress.binaryBits.map(Number)
    : (Array.isArray(activity.bits) && activity.bits.length === 8 ? activity.bits.map(Number) : Array(8).fill(0));
  let placeEntries = Array.isArray(progress.binaryPlaceEntries) && progress.binaryPlaceEntries.length === 8
    ? progress.binaryPlaceEntries.map(value => String(value ?? ""))
    : Array(8).fill("");
  let contributions = Array.isArray(progress.binaryContributions) && progress.binaryContributions.length === 8
    ? progress.binaryContributions.map(value => String(value ?? ""))
    : Array(8).fill("");

  const grouped = (items, className) => `<div class="${className} binary-grouped-row"><div class="binary-nibble">${items.slice(0,4).join("")}</div><div class="binary-nibble">${items.slice(4).join("")}</div></div>`;
  const practice = activity.practiceTotal ? `<p class="fluency-counter"><strong>Deliberate practice ${activity.practiceNumber} of ${activity.practiceTotal}</strong></p>` : "";
  const placeInputs = correctPlaceValues.map((_, index) => `<input data-place-index="${index}" inputmode="numeric" pattern="[0-9]*" value="${escapeHtml(placeEntries[index])}" aria-label="Place value ${index + 1}">`);
  const bitControls = bits.map((bit, index) => `<button type="button" data-bit-index="${index}" ${activity.mode === "binary-to-denary" ? "disabled" : ""}>${bit}</button>`);
  const contributionInputs = bits.map((bit, index) => `<input data-contribution-index="${index}" inputmode="numeric" pattern="[0-9]*" value="${escapeHtml(contributions[index])}" placeholder="${bit ? "value" : "0"}" aria-label="Contribution for bit ${index + 1}">`);

  elements.activityContent.innerHTML = `<div class="instructions">${practice}<p>${activity.mode === "denary-to-binary"
    ? `Represent the denary value <strong>${activity.target}</strong> using eight bits.`
    : `Convert the supplied eight-bit pattern into denary.`}</p><p>First type the eight place values. The bits are displayed as a <strong>high nibble</strong> and a <strong>low nibble</strong>.</p></div>`;
  elements.activityInteraction.innerHTML = `
    <div class="binary-builder enhanced" data-mode="${escapeHtml(activity.mode)}">
      <div class="binary-row-heading"><span>High nibble</span><span>Low nibble</span></div>
      <p class="binary-step-label"><strong>1. Type the place values</strong></p>
      ${grouped(placeInputs, "binary-place-entry-row")}
      <p class="binary-step-label"><strong>2. ${activity.mode === "denary-to-binary" ? "Build the binary pattern" : "Read the supplied binary pattern"}</strong></p>
      ${grouped(bitControls, "binary-bits")}
      ${activity.mode === "binary-to-denary" ? `
        <p class="binary-step-label"><strong>3. Type the value contributed by each bit</strong></p>
        <p class="help-text centered">For a 1, enter its place value. For a 0, enter 0.</p>
        ${grouped(contributionInputs, "binary-contribution-row")}` : `
        <p class="help-text centered">Select a bit to change it between 0 and 1.</p>`}
      <section class="binary-calculator" aria-label="Binary working calculator">
        <div><strong>Working calculator</strong><p id="binaryCalculatorExpression">Enter your values, then calculate.</p></div>
        <button id="calculateBinaryButton" type="button" class="secondary">Add my selected values</button>
        <output id="binaryCalculatorResult">?</output>
      </section>
      ${activity.mode === "binary-to-denary" ? `<label class="binary-final-answer">4. Your final denary answer <input id="binaryDenaryAnswer" inputmode="numeric" pattern="[0-9]*" value="${escapeHtml(progress.binaryAnswer ?? "")}"></label>` : ""}
      <details class="pattern-card"><summary>Need a place-value reminder?</summary><p>Start at 128 on the left and halve each time until you reach 1.</p></details>
      <div class="activity-actions"><button id="checkBinaryButton" type="button">Check answer</button><button id="resetBinaryButton" type="button" class="secondary">Reset</button></div>
    </div>`;

  const bitButtons = [...elements.activityInteraction.querySelectorAll("[data-bit-index]")];
  const placeInputsEls = [...elements.activityInteraction.querySelectorAll("[data-place-index]")];
  const contributionEls = [...elements.activityInteraction.querySelectorAll("[data-contribution-index]")];
  const calcExpression = elements.activityInteraction.querySelector("#binaryCalculatorExpression");
  const calcResult = elements.activityInteraction.querySelector("#binaryCalculatorResult");

  const readNumber = value => {
    const trimmed = String(value ?? "").trim();
    return trimmed === "" ? null : Number(trimmed);
  };
  const sync = () => {
    placeEntries = placeInputsEls.map(input => input.value.trim());
    contributions = contributionEls.map(input => input.value.trim());
    bitButtons.forEach((button, index) => {
      button.textContent = String(bits[index]);
      button.classList.toggle("on", bits[index] === 1);
      button.setAttribute("aria-label", `Bit ${index + 1}: ${bits[index]}`);
    });
    calcResult.textContent = "?";
    calcExpression.textContent = "Enter your values, then calculate.";
  };

  bitButtons.forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.bitIndex);
    bits[index] = bits[index] ? 0 : 1;
    sync();
  }));
  const attachValidatedAutoAdvance = (inputs, expectedValueForIndex) => {
    inputs.forEach((input, index) => {
      const update = ({ moveFocus = true } = {}) => {
        sync();
        const expected = Number(expectedValueForIndex(index));
        const entered = readNumber(input.value);
        const isCorrectEntry = entered !== null && Number.isFinite(entered) && entered === expected;
        input.classList.toggle("entry-correct", isCorrectEntry);

        if (
          moveFocus
          && isCorrectEntry
          && document.activeElement === input
          && index < inputs.length - 1
        ) {
          window.setTimeout(() => {
            if (document.activeElement !== input) return;
            const nextInput = inputs[index + 1];
            nextInput.focus();
            nextInput.select();
          }, 70);
        }
      };

      input.addEventListener("input", () => update());
      input.addEventListener("keydown", event => {
        if (event.key === "Backspace" && input.value === "" && index > 0) {
          event.preventDefault();
          const previousInput = inputs[index - 1];
          previousInput.focus();
          previousInput.select();
        }
      });
      update({ moveFocus: false });
    });
  };

  attachValidatedAutoAdvance(placeInputsEls, index => correctPlaceValues[index]);
  if (contributionEls.length) {
    attachValidatedAutoAdvance(
      contributionEls,
      index => bits[index] === 1 ? correctPlaceValues[index] : 0
    );
  }

  elements.activityInteraction.querySelector("#calculateBinaryButton").addEventListener("click", () => {
    sync();
    const typedPlaces = placeEntries.map(readNumber);
    let addends;
    if (activity.mode === "binary-to-denary") {
      addends = contributions.map(readNumber).filter(value => value !== null && Number.isFinite(value));
    } else {
      addends = typedPlaces.filter((value, index) => bits[index] === 1 && value !== null && Number.isFinite(value));
    }
    const total = addends.reduce((sum, value) => sum + value, 0);
    calcExpression.textContent = addends.length ? `${addends.join(" + ")} =` : "No values selected =";
    calcResult.textContent = String(total);
  });

  elements.activityInteraction.querySelector("#resetBinaryButton").addEventListener("click", () => {
    bits = activity.mode === "binary-to-denary" ? activity.bits.map(Number) : Array(8).fill(0);
    placeEntries = Array(8).fill("");
    contributions = Array(8).fill("");
    placeInputsEls.forEach(input => { input.value = ""; });
    contributionEls.forEach(input => { input.value = ""; });
    const answer = elements.activityInteraction.querySelector("#binaryDenaryAnswer");
    if (answer) answer.value = "";
    sync();
  });

  elements.activityInteraction.querySelector("#checkBinaryButton").addEventListener("click", async () => {
    sync();
    const typedPlaces = placeEntries.map(readNumber);
    const placeCorrect = typedPlaces.every((value, index) => value === correctPlaceValues[index]);
    const actualTotal = bits.reduce((sum, bit, index) => sum + bit * correctPlaceValues[index], 0);
    const answerInput = elements.activityInteraction.querySelector("#binaryDenaryAnswer");
    const answer = activity.mode === "binary-to-denary" ? readNumber(answerInput.value) : actualTotal;
    const expectedContributions = bits.map((bit, index) => bit ? correctPlaceValues[index] : 0);
    const typedContributions = contributions.map(value => readNumber(value) ?? 0);
    const contributionsCorrect = activity.mode !== "binary-to-denary" || typedContributions.every((value, index) => value === expectedContributions[index]);
    const correct = placeCorrect && contributionsCorrect && answer === Number(activity.target);

    await saveGenericProgress(activity, {
      binaryBits: bits,
      binaryPlaceEntries: placeEntries,
      binaryContributions: contributions,
      binaryAnswer: answer
    }, { countAttempt: true, correct });

    if (!placeCorrect) {
      setGenericFeedback("Check the place-value row. It must run from 128 down to 1, halving each time.", "error");
    } else if (!contributionsCorrect) {
      setGenericFeedback("Check the contribution row. Enter the place value under each 1 and 0 under each 0.", "error");
    } else if (answer !== Number(activity.target)) {
      setGenericFeedback("Your place values are secure, but the final conversion is not correct yet. Use the calculator to add your selected values.", "error");
    } else {
      setGenericFeedback(`Correct. ${activity.mode === "binary-to-denary" ? `The denary value is ${activity.target}.` : `${activity.target} is represented correctly in 8-bit binary.`}`, "success");
      setGenericStatus(activity);
      renderRelatedPractice(activity, elements.activityRelatedPractice);
    }
  });
  sync();
  const firstIncompletePlace = placeInputsEls.find((input, index) => readNumber(input.value) !== correctPlaceValues[index]);
  window.setTimeout(() => (firstIncompletePlace || placeInputsEls[0])?.focus(), 80);
}

function renderErdBuilder(activity, progress) {
  let state = progress.erdState ? clonePlain(progress.erdState) : clonePlain(activity.starterState);
  if (!state.mode) state.mode = "table";
  if (!Array.isArray(state.entities)) state.entities = [];

  elements.activityContent.innerHTML = `
    <div class="instructions">
      <p><strong>Scenario:</strong> ${escapeHtml(activity.scenario)}</p>
      <p>An <strong>entity</strong> becomes a table, so the entity name is the table name. An <strong>attribute</strong> becomes a field. A <strong>record</strong> is one complete row about one instance.</p>
      <p>The foreign key belongs in the <strong>many-side table</strong> and its values must match existing primary-key values to maintain <strong>referential integrity</strong>.</p>
    </div>`;
  elements.activityInteraction.innerHTML = `
    <div class="erd-builder-shell">
      <div class="erd-mode-toggle" role="group" aria-label="ERD drawing style">
        <button id="erdTableMode" type="button">Box/table ERD</button>
        <button id="erdBubbleMode" type="button">Bubble/attribute ERD</button>
      </div>
      <div class="erd-layout">
        <section class="erd-editor-panel"><h3>Edit the database design</h3><div id="erdEntityEditors"></div><button id="erdAddEntity" type="button" class="secondary">Add entity/table</button></section>
        <section><div id="erdCanvas" class="erd-canvas" aria-label="ERD preview"></div></section>
      </div>
      <div class="erd-relationship-words">
        <label>ONE to MANY wording <input id="erdOneVerb" value="${escapeHtml(state.oneToManyVerb || "relates to")}"></label>
        <label>MANY to ONE wording <input id="erdManyVerb" value="${escapeHtml(state.manyToOneVerb || "belongs to")}"></label>
      </div>
      <div class="activity-actions"><button id="erdSaveButton" type="button" class="save-button">Save design</button><button id="erdCheckButton" type="button">Check my ERD</button><button id="erdResetButton" type="button" class="secondary">Reset</button></div>
      <div id="erdCheckDetails" class="marking-points hidden"></div>
    </div>`;

  const editors = elements.activityInteraction.querySelector("#erdEntityEditors");
  const canvas = elements.activityInteraction.querySelector("#erdCanvas");
  const details = elements.activityInteraction.querySelector("#erdCheckDetails");

  const ensureTwoSides = (changedIndex, side) => {
    if (!side) return;
    state.entities.forEach((entity, index) => { if (index !== changedIndex && entity.side === side) entity.side = ""; });
  };

  const renderEditors = () => {
    editors.innerHTML = state.entities.map((entity, entityIndex) => `
      <article class="erd-entity-editor">
        <div class="erd-editor-heading"><strong>Entity/table ${entityIndex + 1}</strong><button type="button" data-remove-entity="${entityIndex}" class="danger-small">Remove</button></div>
        <label>Entity/table name <input data-entity-name="${entityIndex}" value="${escapeHtml(entity.name || "")}"></label>
        <label>Relationship side <select data-entity-side="${entityIndex}"><option value="">Choose</option><option value="one" ${entity.side === "one" ? "selected" : ""}>ONE side</option><option value="many" ${entity.side === "many" ? "selected" : ""}>MANY side</option></select></label>
        <div class="erd-attribute-list"><div class="erd-attribute-head"><span>Attribute/field</span><span>Key</span><span></span></div>${(entity.attributes || []).map((attribute, attributeIndex) => `
          <div class="erd-attribute-edit"><input data-attribute-name="${entityIndex}:${attributeIndex}" value="${escapeHtml(attribute.name || "")}" placeholder="fieldName"><select data-attribute-key="${entityIndex}:${attributeIndex}"><option value="" ${!attribute.key ? "selected" : ""}>None</option><option value="PK" ${attribute.key === "PK" ? "selected" : ""}>PK</option><option value="FK" ${attribute.key === "FK" ? "selected" : ""}>FK</option></select><button type="button" data-remove-attribute="${entityIndex}:${attributeIndex}">×</button></div>`).join("")}</div>
        <button type="button" data-add-attribute="${entityIndex}" class="secondary compact-button">+ Add attribute</button>
      </article>`).join("");

    editors.querySelectorAll("[data-entity-name]").forEach(input => input.addEventListener("input", () => { state.entities[Number(input.dataset.entityName)].name = input.value; renderCanvas(); }));
    editors.querySelectorAll("[data-entity-side]").forEach(select => select.addEventListener("change", () => { const i=Number(select.dataset.entitySide); state.entities[i].side=select.value; ensureTwoSides(i, select.value); renderEditors(); renderCanvas(); }));
    editors.querySelectorAll("[data-attribute-name]").forEach(input => input.addEventListener("input", () => { const [e,a]=input.dataset.attributeName.split(":").map(Number); state.entities[e].attributes[a].name=input.value; renderCanvas(); }));
    editors.querySelectorAll("[data-attribute-key]").forEach(select => select.addEventListener("change", () => { const [e,a]=select.dataset.attributeKey.split(":").map(Number); state.entities[e].attributes[a].key=select.value; renderCanvas(); }));
    editors.querySelectorAll("[data-add-attribute]").forEach(button => button.addEventListener("click", () => { state.entities[Number(button.dataset.addAttribute)].attributes.push({name:"",key:""}); renderEditors(); renderCanvas(); }));
    editors.querySelectorAll("[data-remove-attribute]").forEach(button => button.addEventListener("click", () => { const [e,a]=button.dataset.removeAttribute.split(":").map(Number); state.entities[e].attributes.splice(a,1); renderEditors(); renderCanvas(); }));
    editors.querySelectorAll("[data-remove-entity]").forEach(button => button.addEventListener("click", () => { state.entities.splice(Number(button.dataset.removeEntity),1); renderEditors(); renderCanvas(); }));
  };

  const keyDisplay = attribute => attribute.key === "PK" ? `<u>${escapeHtml(attribute.name)}</u>` : attribute.key === "FK" ? `${escapeHtml(attribute.name)}*` : escapeHtml(attribute.name);
  const renderTable = () => {
    const ordered = [...state.entities].sort((a,b) => (a.side === "one" ? 0 : 1) - (b.side === "one" ? 0 : 1));
    canvas.innerHTML = `<div class="erd-table-diagram">${ordered.map((entity,index) => `<div class="erd-table-box ${entity.side || ""}"><h4>${escapeHtml(entity.name || "Unnamed entity")}</h4>${(entity.attributes || []).filter(a=>a.name).map(a=>`<div><span>${keyDisplay(a)}</span><small>${a.key || ""}</small></div>`).join("")}</div>${index === 0 && ordered.length > 1 ? `<div class="erd-link"><span>1</span><i></i><strong>${escapeHtml(state.oneToManyVerb || "relates to")}</strong><i></i><span>M</span></div>` : ""}`).join("")}</div>`;
  };
  const renderBubble = () => {
    const ordered = [...state.entities].sort((a,b) => (a.side === "one" ? 0 : 1) - (b.side === "one" ? 0 : 1)).slice(0,2);
    const width = 1000, height = 640;
    const centers = [{x:270,y:320},{x:730,y:320}];
    const slots = [
      [{x:270,y:85},{x:105,y:175},{x:90,y:340},{x:120,y:500},{x:270,y:555},{x:390,y:505}],
      [{x:730,y:85},{x:895,y:175},{x:910,y:340},{x:880,y:500},{x:730,y:555},{x:610,y:505}]
    ];
    let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bubble style entity relationship diagram">`;
    if (ordered.length === 2) {
      const verb = String(state.oneToManyVerb || "relates to").trim() || "relates to";
      const words = verb.split(/\s+/); const line1 = words.slice(0,2).join(" "); const line2 = words.slice(2).join(" ");
      svg += `<line x1="350" y1="320" x2="445" y2="320" class="erd-svg-link"/><line x1="555" y1="320" x2="650" y2="320" class="erd-svg-link"/>`;
      svg += `<polygon points="500,280 555,320 500,360 445,320" class="erd-relationship-diamond"/>`;
      svg += `<text x="500" y="316" text-anchor="middle" class="erd-relationship-text"><tspan x="500" dy="0">${escapeHtml(line1)}</tspan>${line2?`<tspan x="500" dy="16">${escapeHtml(line2)}</tspan>`:""}</text>`;
      svg += `<text x="370" y="300" class="erd-cardinality">${ordered[0].side==='one'?'1':ordered[0].side==='many'?'M':'?'}</text><text x="620" y="300" class="erd-cardinality">${ordered[1].side==='many'?'M':ordered[1].side==='one'?'1':'?'}</text>`;
    }
    ordered.forEach((entity,i) => {
      const c=centers[i]; const attrs=(entity.attributes||[]).filter(a=>a.name).slice(0,6);
      svg += `<rect x="${c.x-80}" y="${c.y-36}" width="160" height="72" rx="7" class="erd-entity-rect ${entity.side || ""}"/><text x="${c.x}" y="${c.y+7}" text-anchor="middle" class="erd-entity-text">${escapeHtml(entity.name || "Unnamed entity")}</text>`;
      attrs.forEach((attribute,j) => {
        const p=slots[i][j]; const dx=p.x-c.x; const dy=p.y-c.y; const length=Math.hypot(dx,dy)||1; const sx=c.x+(dx/length)*88; const sy=c.y+(dy/length)*45; const ex=p.x-(dx/length)*78; const ey=p.y-(dy/length)*31;
        svg += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" class="erd-attribute-line"/><ellipse cx="${p.x}" cy="${p.y}" rx="76" ry="31" class="erd-attribute-bubble"/><text x="${p.x}" y="${p.y+5}" text-anchor="middle" class="erd-attribute-text">${escapeHtml(attribute.name)}${attribute.key==='FK'?'*':''}</text>${attribute.key==='PK'?`<line x1="${p.x-46}" y1="${p.y+11}" x2="${p.x+46}" y2="${p.y+11}" class="erd-pk-underline"/>`:''}`;
      });
    });
    svg += `</svg><p class="erd-symbol-note"><strong>Bubble notation:</strong> entity/table names are rectangles, attributes are ovals, primary keys are underlined and foreign keys are starred (*).</p>`;
    canvas.innerHTML = svg;
  };
  const renderCanvas = () => {
    elements.activityInteraction.querySelector("#erdTableMode").classList.toggle("active", state.mode === "table");
    elements.activityInteraction.querySelector("#erdBubbleMode").classList.toggle("active", state.mode === "bubble");
    state.mode === "bubble" ? renderBubble() : renderTable();
  };

  const check = () => {
    const issues=[], secure=[]; const expected=activity.expected||{};
    if (state.entities.length !== 2) issues.push("Use exactly two entities/tables for this National 5 ERD.");
    const one=state.entities.find(e=>e.side==='one'); const many=state.entities.find(e=>e.side==='many');
    if (!one) issues.push("Identify the table on the ONE side.");
    if (!many) issues.push("Identify the table on the MANY side.");
    state.entities.forEach(entity => { const pks=(entity.attributes||[]).filter(a=>a.key==='PK'&&a.name); if(!entity.name.trim()) issues.push("Every entity needs a table name."); if(pks.length!==1) issues.push(`${entity.name||'Each table'} needs exactly one primary key for this task.`); if((entity.attributes||[]).filter(a=>a.name).length<2) issues.push(`${entity.name||'Each table'} needs suitable attributes.`); });
    if(one&&many){
      const onePk=(one.attributes||[]).find(a=>a.key==='PK'&&a.name); const fks=(many.attributes||[]).filter(a=>a.key==='FK'&&a.name); const wrongFk=(one.attributes||[]).some(a=>a.key==='FK'&&a.name);
      if(wrongFk) issues.push(`The foreign key should be in ${many.name||'the MANY-side table'}, not ${one.name||'the ONE-side table'}.`);
      if(fks.length!==1) issues.push(`${many.name||'The MANY-side table'} needs one foreign key.`);
      if(onePk&&fks.length===1&&normaliseErdName(onePk.name)!==normaliseErdName(fks[0].name)) issues.push(`The foreign key ${fks[0].name} should match the primary key ${onePk.name}.`);
      if(onePk&&fks.length===1&&normaliseErdName(onePk.name)===normaliseErdName(fks[0].name)) secure.push(`${fks[0].name} correctly links the MANY-side table to the ONE-side table.`);
      const oneNames=(expected.oneEntity||[]).map(normaliseErdName); const manyNames=(expected.manyEntity||[]).map(normaliseErdName);
      if(oneNames.length&&!oneNames.includes(normaliseErdName(one.name))) issues.push(`The ONE-side entity/table should be ${expected.oneEntity[0]}.`);
      if(manyNames.length&&!manyNames.includes(normaliseErdName(many.name))) issues.push(`The MANY-side entity/table should be ${expected.manyEntity[0]}.`);
      const expectedOnePk=(expected.onePk||[]).map(normaliseErdName); const expectedManyPk=(expected.manyPk||[]).map(normaliseErdName);
      if(onePk&&expectedOnePk.length&&!expectedOnePk.includes(normaliseErdName(onePk.name))) issues.push(`Check the primary key in ${one.name}. It should uniquely identify one ${one.name} record.`);
      const manyPk=(many.attributes||[]).find(a=>a.key==='PK'&&a.name);
      if(manyPk&&expectedManyPk.length&&!expectedManyPk.includes(normaliseErdName(manyPk.name))) issues.push(`Check the primary key in ${many.name}. It should uniquely identify one ${many.name} record.`);
      const required=expected.requiredAttributes||{};
      [[one, expected.oneEntity?.[0]], [many, expected.manyEntity?.[0]]].forEach(([entity, expectedName]) => {
        if(!entity||!expectedName) return;
        const key=Object.keys(required).find(item=>normaliseErdName(item)===normaliseErdName(expectedName));
        if(!key) return;
        const actual=(entity.attributes||[]).filter(a=>a.name).map(a=>normaliseErdName(a.name));
        required[key].forEach(field=>{ if(!actual.includes(normaliseErdName(field))) issues.push(`${entity.name} is missing the attribute ${field}.`); });
      });
      if(!(state.oneToManyVerb||'').trim()) issues.push("Add a meaningful relationship verb, such as has, places, selects or contains.");
      secure.push(`The relationship is one ${one.name||'parent'} to many ${many.name||'child'} records.`);
    }
    return {issues,secure};
  };

  elements.activityInteraction.querySelector("#erdTableMode").addEventListener("click",()=>{state.mode='table';renderCanvas();});
  elements.activityInteraction.querySelector("#erdBubbleMode").addEventListener("click",()=>{state.mode='bubble';renderCanvas();});
  elements.activityInteraction.querySelector("#erdAddEntity").addEventListener("click",()=>{state.entities.push({name:'',side:'',attributes:[{name:'',key:''}]});renderEditors();renderCanvas();});
  elements.activityInteraction.querySelector("#erdOneVerb").addEventListener("input",e=>{state.oneToManyVerb=e.target.value;renderCanvas();});
  elements.activityInteraction.querySelector("#erdManyVerb").addEventListener("input",e=>{state.manyToOneVerb=e.target.value;});
  elements.activityInteraction.querySelector("#erdSaveButton").addEventListener("click",async()=>{await saveGenericProgress(activity,{erdState:state});setGenericFeedback("ERD draft saved.","success");setGenericStatus(activity);});
  elements.activityInteraction.querySelector("#erdResetButton").addEventListener("click",()=>{state=clonePlain(activity.starterState);renderEditors();renderCanvas();details.classList.add('hidden');});
  elements.activityInteraction.querySelector("#erdCheckButton").addEventListener("click",async()=>{const result=check(); const correct=result.issues.length===0; await saveGenericProgress(activity,{erdState:state,erdCheckIssues:result.issues},{countAttempt:true,correct}); details.classList.remove('hidden'); details.innerHTML=correct?`<h3>✓ ERD structure is secure</h3><ul>${result.secure.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:`<h3>Review this design</h3><ul>${result.issues.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>${result.secure.length?`<p><strong>Already correct:</strong></p><ul>${result.secure.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:''}`; setGenericFeedback(correct?"Correct — the entities, keys and one-to-many link are secure.":"Nearly there. Use the detailed ERD feedback to make the next change.",correct?"success":"error"); if(correct){setGenericStatus(activity);renderRelatedPractice(activity,elements.activityRelatedPractice);}});

  renderEditors(); renderCanvas();
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

  if (activity.type === "erd-builder") {
    renderErdBuilder(activity, progress);
  } else if (activity.type === "binary-builder") {
    renderBinaryBuilder(activity, progress);
  } else if (activity.type === "lesson" || activity.type === "video") {
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
  } else if (activity.type === "sql") {
    renderSqlActivity(activity, progress);
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
  if (progress.completed && elements.activityFeedback.classList.contains("hidden")) {
    elements.activityFeedback.textContent = "This activity is already complete.";
    elements.activityFeedback.className = "feedback success";
    addNextQuestionButton(elements.activityFeedback, activity);
  }
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
  removeNextQuestionButton(elements.feedbackBox);
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
  if (progress?.completed) {
    elements.feedbackBox.textContent = "This activity is already complete.";
    elements.feedbackBox.className = "feedback success";
    addNextQuestionButton(elements.feedbackBox, task);
  }
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
  removeNextQuestionButton(elements.feedbackBox);
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
  removeNextQuestionButton(elements.feedbackBox);
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
      addNextQuestionButton(elements.feedbackBox, currentTask);
    } else {
      removeNextQuestionButton(elements.feedbackBox);
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
    addNextQuestionButton(elements.feedbackBox, currentTask);
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

function positionDebugOceanAtStart() {
  const ocean = elements.debugFish.parentElement;
  const oceanWidth = Math.max(320, ocean.clientWidth || 900);
  const sharkWidth = elements.debugShark.getBoundingClientRect().width || 165;
  const fishWidth = elements.debugFish.getBoundingClientRect().width || 110;
  const fishStart = Math.max(oceanWidth * 0.27, sharkWidth + 28);
  elements.debugShark.style.left = "12px";
  elements.debugFish.style.left = `${Math.min(fishStart, oceanWidth - fishWidth - 24)}px`;
  elements.debugFish.style.top = "46%";
  elements.debugShark.style.top = "52%";
}

function updateDebugOcean() {
  const ocean = elements.debugFish.parentElement;
  const oceanWidth = Math.max(320, ocean.clientWidth || 900);
  const sharkWidth = elements.debugShark.getBoundingClientRect().width || 165;
  const fishWidth = elements.debugFish.getBoundingClientRect().width || 110;

  if (!debugGameState?.deadline) {
    elements.debugTimer.textContent = "Training mode — no timer";
    positionDebugOceanAtStart();
    return;
  }

  const remaining = Math.max(0, debugGameState.deadline - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  const duration = debugGameState.durationMs || 1;
  const progress = Math.min(1, Math.max(0, 1 - remaining / duration));

  // Both characters swim from left to right. The shark travels farther,
  // so the gap closes naturally as the timer runs down.
  const fishStart = Math.max(oceanWidth * 0.27, sharkWidth + 28);
  const fishEnd = Math.max(fishStart, oceanWidth - fishWidth - 26);
  const sharkStart = 12;
  const sharkEnd = Math.max(sharkStart, fishEnd - sharkWidth * 0.54);

  const fishX = fishStart + (fishEnd - fishStart) * progress;
  const sharkX = sharkStart + (sharkEnd - sharkStart) * progress;
  const fishBob = Math.sin(Date.now() / 420) * 2.2;
  const sharkBob = Math.sin(Date.now() / 560) * 1.2;

  elements.debugTimer.textContent = `${seconds}s remaining`;
  elements.debugShark.style.left = `${sharkX}px`;
  elements.debugFish.style.left = `${fishX}px`;
  elements.debugFish.style.top = `${46 + fishBob}%`;
  elements.debugShark.style.top = `${52 + sharkBob}%`;
  elements.debugTimer.classList.toggle("urgent", seconds <= 10);

  if (remaining <= 0) void debugTimeExpired();
}

function resetDebugGameOverButtons() {
  elements.playDebugGameOverButton.classList.add("hidden");
  elements.closeDebugGameOverButton.classList.add("hidden");
}

function hideDebugGameOver() {
  if (debugGameOverRevealTimer !== null) {
    clearTimeout(debugGameOverRevealTimer);
    debugGameOverRevealTimer = null;
  }

  try {
    elements.debugGameOverVideo.pause();
    elements.debugGameOverVideo.currentTime = 0;
  } catch (error) {
    console.warn("Could not reset game-over video:", error);
  }

  elements.debugGameOverOverlay.classList.add("hidden");
  elements.debugGameOverVideo.classList.remove("hidden");
  elements.debugGameOverGif.classList.add("hidden");
  elements.debugGameOverStatus.textContent =
    "Time ran out. Watch the sequence, then review the repair.";
  resetDebugGameOverButtons();
}

function revealDebugGameOverReviewButton() {
  if (debugGameOverRevealTimer !== null) {
    clearTimeout(debugGameOverRevealTimer);
    debugGameOverRevealTimer = null;
  }
  elements.playDebugGameOverButton.classList.add("hidden");
  elements.closeDebugGameOverButton.classList.remove("hidden");
  elements.closeDebugGameOverButton.focus();
}

function playDebugGifFallback() {
  const oldImage = elements.debugGameOverGif;
  const gifPath = oldImage.dataset.gifSrc || "game_over.gif";
  const freshImage = document.createElement("img");
  freshImage.id = "debugGameOverGif";
  freshImage.className = "";
  freshImage.dataset.gifSrc = gifPath;
  freshImage.alt = oldImage.alt || "Animated shark game-over sequence";

  freshImage.addEventListener("error", () => {
    elements.debugGameOverStatus.textContent =
      "The ending files could not be loaded. Check that game_over.mp4 and game_over.gif are both in GitHub.";
    elements.playDebugGameOverButton.classList.add("hidden");
    elements.closeDebugGameOverButton.classList.remove("hidden");
  }, { once: true });

  oldImage.replaceWith(freshImage);
  elements.debugGameOverGif = freshImage;
  elements.debugGameOverVideo.classList.add("hidden");

  requestAnimationFrame(() => {
    freshImage.src = `${gifPath}?play=${Date.now()}`;
  });

  debugGameOverRevealTimer = window.setTimeout(
    revealDebugGameOverReviewButton,
    4400
  );
}

async function playDebugGameOverVideo() {
  if (debugGameOverRevealTimer !== null) {
    clearTimeout(debugGameOverRevealTimer);
    debugGameOverRevealTimer = null;
  }

  resetDebugGameOverButtons();
  elements.debugGameOverGif.classList.add("hidden");
  elements.debugGameOverVideo.classList.remove("hidden");
  elements.debugGameOverStatus.textContent =
    "Time ran out. Watch the sequence, then review the repair.";

  const video = elements.debugGameOverVideo;

  try {
    video.pause();
    video.currentTime = 0;
    video.load();

    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      await playPromise;
    }
  } catch (error) {
    console.warn("Automatic MP4 playback was blocked or failed:", error);
    elements.debugGameOverStatus.textContent =
      "Select Play shark ending to start the animation.";
    elements.playDebugGameOverButton.classList.remove("hidden");
    elements.playDebugGameOverButton.focus();
  }
}

function showDebugGameOver() {
  hideDebugGameOver();
  elements.debugGameOverOverlay.classList.remove("hidden");

  // Wait until the overlay has been painted before asking Edge to play.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      void playDebugGameOverVideo();
    });
  });
}


function animateDebugFishEscape() {
  const ocean = elements.debugFish.parentElement;
  const oceanWidth = Math.max(320, ocean.clientWidth || 900);
  elements.debugFish.classList.add("fish-escaping");
  elements.debugFish.style.left = `${oceanWidth + 30}px`;
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
  hideDebugGameOver();
  elements.debugFish.classList.remove("fish-escaping");
  positionDebugOceanAtStart();
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
    animateDebugFishEscape();
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

  // The animation is classroom feedback and must not wait for Firestore.
  showDebugGameOver();

  elements.debugFeedback.innerHTML = `<strong>The shark reached the fish this time.</strong> ${escapeHtml(challenge.explanation)}<br><strong>One valid repair:</strong><pre class="lesson-code compact">${escapeHtml(debugSolutionFor(challenge))}</pre>`;
  elements.debugFeedback.className = "feedback error";
  elements.debugRepairPanel.classList.remove("locked-stage");
  elements.debugNextButton.classList.remove("hidden");

  try {
    await saveGameAttempt({
      game: "debug-rescue", mode: debugGameState.mode, level: debugGameState.level,
      challengeId: challenge.id, correct: false, points: 0, sessionScore: debugGameState.score,
      hintsUsed: debugGameState.hintsUsed, responseTimeSeconds: Math.round((debugGameState.durationMs || 0) / 1000),
      skillIds: challenge.skills, previewOnly: debugGameState.previewOnly,
      details: { timedOut: true }
    });
  } catch (error) {
    console.warn("Timed-out Debug Rescue result could not be saved:", error);
  }
}

function debugSolutionFor(challenge) {
  const solutions = {
    'DBG-B-01':'print("Hello")','DBG-B-02':'total = 20\npupils = 2\nshare = total / pupils\nprint(share)','DBG-B-03':'score = 55\nif score >= 50:\n    print("Pass")',
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
elements.backFromDebugGameButton.addEventListener('click', () => { stopDebugTimer(); hideDebugGameOver(); renderGamesLabMenu(); showView('gamesView'); });
elements.backFromLogicGameButton.addEventListener('click', () => { renderGamesLabMenu(); showView('gamesView'); });
elements.debugGameOverVideo.addEventListener("ended", revealDebugGameOverReviewButton);
elements.debugGameOverVideo.addEventListener("error", () => {
  console.warn("MP4 ending could not be loaded; using GIF fallback.");
  playDebugGifFallback();
});
elements.playDebugGameOverButton.addEventListener("click", () => {
  void playDebugGameOverVideo();
});
elements.closeDebugGameOverButton.addEventListener("click", hideDebugGameOver);
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
