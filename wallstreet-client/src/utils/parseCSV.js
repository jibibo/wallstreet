export default function parseCSV(csvString) {
  let rows = csvString.split("\n");
  
  // Use the first row to get the keys for each column
  let keys = rows[0].split(",");
  
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
  
  return data;
}