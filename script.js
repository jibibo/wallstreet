const input = document.getElementById("fileInput");
const table = document.getElementById("table");

let allTransactions = [];
let users = [
  { id: 1, name: "daan", transactions: [] },
  { id: 2, name: "tim", transactions: [] },
];
let selectedTransactionIds = new Set();

const csvString = `type,amount,description
deposit,10,tim
withdraw,20,"hello i need money kind regards julian"
withdraw,20,beer
deposit,10,daans`;

// Handle adding user to the users array
const handleAddUser = (event) => {
  event.preventDefault();

  // Check if empty, dont add
  if (event.target.name.value === "") return;

  const user = {
    id: users.length + 1,
    name: event.target.name.value,
    transactions: [],
  };

  // Add user to users array
  users.push(user);

  // Clean input box
  event.target.reset();
  refreshUsersDiv();
};

// input.addEventListener('change', function() {
//   const file = input.files[0];
//   const reader = new FileReader();

//   reader.addEventListener('load', function() {
//     data = parseCSV(reader.result);
//     setTableData(data);
//   });

//   reader.readAsText(file);
// });

const setTableData = (data) => {
  const tableData = data
    .map((transaction) => {
      const { type, amount, description, id } = transaction;
      return `
      <tr class="transaction-row" onclick="onClickTransaction(event, ${id})" data-id="${id}">
        <td>${type}</td>
        <td>${amount}</td>
        <td>${description}</td>
      </tr>
    `;
    })
    .join("");
  table.innerHTML = tableData;
};

function parseCSV(csvString) {
  // Split the CSV string on new lines to get an array of rows
  let rows = csvString.split("\n");
  console.log(rows);

  // Use the first row to get the keys for each column
  let keys = rows[0].split(",");

  // Create an array to hold the final data
  let data = [];

  // Loop through the rows
  for (let i = 1; i < rows.length; i++) {
    // Split the row on commas to get an array of columns
    let columns = rows[i].split(",");

    // Create an object for this row of data
    let row = {};

    // Use the keys array to set the values for each column
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j].trim();
      const value = columns[j].trim();

      row[key] = value;
    }

    // Push the row object onto the data array
    row.id = i;
    data.push(row);
  }

  setTableData(data);
  allTransactions = data;
}

parseCSV(csvString);

const handleUser = (id) => {
  console.log("Clicking user..");
  const user = users.find((user) => user.id === id);
  const { transactions } = user;

  if (selectedTransactionIds.size === 0) return;

  // Find transaction by id and add transaction to user transactions
  selectedTransactionIds.forEach((id) => {
    const transaction = allTransactions.find((transaction) => transaction.id === id);
    transactions.push(transaction);
  });

  // Remove transaction from data
  allTransactions = allTransactions.filter(
    (transaction) => !selectedTransactionIds.has(transaction.id)
  );
  
  // Update table
  setTableData(allTransactions);
  refreshUsersDiv();

  // Reset selected transactions
  selectedTransactionIds.clear()

  console.log("User transactions: ", user);
};

const onClickTransaction = (event, id) => {
  const transactionElement = event.target.parentElement;

  if (selectedTransactionIds.has(id)) {
    selectedTransactionIds.delete(id);
    transactionElement.classList.remove("selected");
    return;
  }
  
  selectedTransactionIds.add(id);
  transactionElement.classList.add("selected");
};

const calculateDebt = (user) => {
  const { transactions } = user;
  let total = 0;

  transactions.forEach((transaction) => {
    const { type, amount } = transaction;
    if (type === "deposit") {
      total -= parseInt(amount);
    } else {
      total += parseInt(amount);
    }
  });

  return total;
};

const refreshUsersDiv = () => {
  let htmlString = "";
  users.map((user) => {
    const { id, name } = user;

    const debt = calculateDebt(user);

    const userHtml = `
          <div onclick="handleUser(${id})" data-id="${id}">
            <p>${name}</p><p>Debt: ${debt}</p>
          </div>
        `;
    htmlString += userHtml;
  });

  document.getElementById("users").innerHTML = htmlString;
};

refreshUsersDiv();
