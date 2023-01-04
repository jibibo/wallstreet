import { v4 as uuidv4 } from 'uuid';

export default function parseCSV(csvString) {
  let rows = csvString.split("\n");

  let data = [];
  // Loop through the rows
  for (let i = 1; i < rows.length; i++) {
    // Split the row on commas to get an array of columns
    let columns = rows[i].split(",");

    // Create an object for this row of data
    let amount = parseFloat(columns[1]);
    if (columns[0] == "withdraw")
      amount = -amount;

    const row = {
      id: uuidv4(),
      amount,
      description: columns[2].trim(),
    };

    // Push the row object onto the data array
    data.push(row);
  }

  console.log(data)
  return data;
}