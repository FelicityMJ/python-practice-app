export const TASKS = [
  {
    id: "variables-01",
    topic: "Variables",
    title: "Calculate the total",
    instructions: "Create variables called <code>score</code> and <code>bonus</code>. Set them to 7 and 3, then calculate and print their total.",
    starterCode: `score = 7\nbonus = 3\n\n# Calculate and print the total below\n`,
    expectedOutput: "10",
    hints: [
      "Use the + operator to add the variables.",
      "Put the calculation inside print().",
      "Try: print(score + bonus)"
    ],
    requirements: {
      assignments: { score: 7, bonus: 3 },
      binOperation: { operator: "Add", names: ["score", "bonus"] }
    }
  },
  {
    id: "variables-02",
    topic: "Variables",
    title: "Calculate the total cost",
    instructions: "Create <code>price</code> with the value 8 and <code>quantity</code> with the value 4. Multiply them and print the total cost.",
    starterCode: `# Create your variables below\n`,
    expectedOutput: "32",
    hints: [
      "Python uses * for multiplication.",
      "The calculation should use both variable names.",
      "Try: print(price * quantity)"
    ],
    requirements: {
      assignments: { price: 8, quantity: 4 },
      binOperation: { operator: "Mult", names: ["price", "quantity"] }
    }
  },
  {
    id: "variables-03",
    topic: "Variables",
    title: "Calculate the average",
    instructions: "Create variables <code>test1</code> and <code>test2</code> with the values 12 and 18. Calculate their average and print it.",
    starterCode: `test1 = 12\ntest2 = 18\n\n# Calculate and print the average below\n`,
    expectedOutput: "15.0",
    hints: [
      "Add the two results first.",
      "Divide the total by 2 using /.",
      "Use both variable names in the calculation."
    ],
    requirements: {
      assignments: { test1: 12, test2: 18 },
      requiredNamesInCalculation: ["test1", "test2"],
      requiredOperators: ["Add", "Div"]
    }
  },
  {
    id: "selection-01",
    topic: "Selection",
    title: "Large or small",
    instructions: "The variable <code>number</code> is set to 12. Use an <code>if</code> statement to print <code>Large</code> when the number is greater than 10. Otherwise, print <code>Small</code>.",
    starterCode: `number = 12\n\n# Add your if statement below\n`,
    expectedOutput: "Large",
    hints: [
      "Your condition should compare number with 10.",
      "Remember the colon after the condition.",
      "You also need an else branch."
    ],
    requirements: {
      assignments: { number: 12 },
      requiredNodes: ["If"],
      ifUsesNames: ["number"],
      comparison: { name: "number", operator: "Gt", value: 10 }
    }
  },
  {
    id: "loops-01",
    topic: "For loops",
    title: "Count from 1 to 5",
    instructions: "Use a <code>for</code> loop and <code>range()</code> to print the numbers 1 to 5, with each number on a new line.",
    starterCode: `# Write your for loop below\n`,
    expectedOutput: "1\n2\n3\n4\n5",
    hints: [
      "range() stops before its second value.",
      "To include 5, the stopping value should be 6.",
      "Try a range beginning at 1."
    ],
    requirements: {
      requiredNodes: ["For"],
      rangeArgs: [1, 6]
    }
  },
  {
    id: "arrays-01",
    topic: "Arrays",
    title: "Running total",
    instructions: "The array <code>scores</code> contains 4, 7 and 2. Use a loop and a running total to calculate and print the total. Do not use <code>sum()</code>.",
    starterCode: `scores = [4, 7, 2]\ntotal = 0\n\n# Traverse the array and update total below\n`,
    expectedOutput: "13",
    hints: [
      "Use a for loop to visit each value in scores.",
      "Add each value to total inside the loop.",
      "Print total after the loop has finished."
    ],
    requirements: {
      assignments: { scores: [4, 7, 2], total: 0 },
      requiredNodes: ["For"],
      forIteratesName: "scores",
      updatesVariable: "total",
      forbiddenCalls: ["sum"]
    }
  }
];
