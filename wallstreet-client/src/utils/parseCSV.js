import Papa from "papaparse";

import { v4 as uuidv4 } from "uuid";

export default function parseCSV(string) {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const transactionDescriptions = new Set();

    Papa.parse(string, {
      header: true,
      delimiter: ",",
      step: ({ data: row }) => {
        if (Object.values(row).length === 1) return;

        Object.entries(row).forEach(entry => {
          const [key, value] = entry;
          if (key === "Bedrag (EUR)") {
            row.amount = parseFloat(row["Bedrag (EUR)"].replace(/,/, "."));

            if (row["Af Bij"] === "Af")
              row.amount = -row.amount;
          }

          if (key === "Mededelingen") {
            if (transactionDescriptions.has(value)) {
              row.Mededelingen = row.Mededelingen + `[${transactionDescriptions.size}]`;
            }
            transactionDescriptions.add(row.Mededelingen);
          }
        });

        row.description = row.Mededelingen;
        delete row["Mededelingen"];
        delete row["Bedrag (EUR)"];
        row.id = uuidv4();
        transactions.push(row);
      },
      complete: () => {
        resolve(transactions);
      }
    });
  })
}
