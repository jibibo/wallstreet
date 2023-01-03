const input = document.getElementById("fileInput");
const table = document.getElementById("table");

let data = [];
let users = [
  { id: 1, name: "daan", transactions: [] },
  { id: 2, name: "tim", transactions: [] },
];
let currentlySelectedTransaction = null;

const csvString = `type,amount,description
deposit,10,tim
withdraw,20,"hello i need money kind regards julian"
activity,10,beer
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
      console.log(transaction);
      const { type, amount, description, id } = transaction;
      return `
      <tr onclick="handleTransaction(${id})" data-id="${id}">
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
  return data;
}

parseCSV(csvString);

const handleUser = (id) => {
  console.log("Clicking user..");
  const user = users.find((user) => user.id === id);
  const { transactions } = user;

  if (!currentlySelectedTransaction) return;

  // Add transaction to user
  transactions.push(currentlySelectedTransaction);

  // Remove transaction from data
  data = data.filter(
    (transaction) => transaction.id !== currentlySelectedTransaction.id
  );

  console.log(users);

  // Update table
  setTableData(data);
};

const handleTransaction = (id) => {
  console.log("Transaction: ", id);
  const transaction = data.find((transaction) => transaction.id === id);

  console.log(data);
  console.log(transaction);
  currentlySelectedTransaction = transaction;
};

const refreshUsersDiv = () => {
  let htmlString = "";
  users.map((user) => {
    const { id, name } = user;
    const userHtml = `
          <div onclick="handleUser(${id})" data-id="${id}">
            <p>${name}</p>
          </div>
        `;
    htmlString += userHtml;
  });

  document.getElementById("users").innerHTML = htmlString;
};

refreshUsersDiv();
