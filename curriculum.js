export const AREAS = [
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

export const UNITS = [
  {
    id: "sdd-python-01",
    areaId: "sdd",
    number: 1,
    title: "Getting started",
    description: "Sequence, print, strings, comments and reading Python errors.",
    order: 1
  },
  {
    id: "sdd-python-02",
    areaId: "sdd",
    number: 2,
    title: "Variables and data types",
    description: "Store, change and trace integer, real, string and Boolean values.",
    order: 2
  },
  {
    id: "sdd-python-03",
    areaId: "sdd",
    number: 3,
    title: "Input and conversion",
    description: "Receive values from the keyboard and convert them to suitable data types.",
    order: 3
  },
  {
    id: "sdd-python-04",
    areaId: "sdd",
    number: 4,
    title: "Calculations and expressions",
    description: "Arithmetic operators, order of operations and rounding.",
    order: 4
  }
];

const paper2025 = "https://www.sqa.org.uk/pastpapers/papers/papers/2025/N5_Computing-Science_QP_2025.pdf";

const lesson = (data) => ({ type: "lesson", required: true, estimatedMinutes: 5, ...data });
const quiz = (data) => ({ type: "quiz", required: true, estimatedMinutes: 5, ...data });
const code = (data) => ({ type: "code", required: true, estimatedMinutes: 10, hints: [], requirements: {}, ...data });
const exam = (data) => ({ type: "exam-style", required: true, estimatedMinutes: 8, ...data });
const official = (data) => ({ type: "official-paper", required: false, estimatedMinutes: 8, ...data });

export const ACTIVITIES = [
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
    markingPoints: ["Use meaningful variable names or meaningful identifiers.", "Use suitable indentation where appropriate."],
    modelAnswer: "Use meaningful variable names so that the purpose of each value is clear."
  }),
  official({
    id: "SDD-PY-01-O1", areaId: "sdd", unitId: "sdd-python-01", order: 10,
    title: "Official paper: Readability", prerequisiteIds: ["SDD-PY-01-09"], skills: ["readability", "comments", "identifiers"],
    year: 2025, questionReference: "Question 3(b)", pageReference: "Paper page 3",
    officialUrl: `${paper2025}#page=3`,
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
    description: "Open the official 2025 paper and attempt Question 3(a), which asks you to trace a calculation and state the stored value."
  })
];

export const ACTIVITY_TYPE_LABELS = {
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
