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

        // Parse date as Date if it is in integer and in form YYYYMMDD
        const year = row.Datum.toString().slice(0, 4);
        const month = row.Datum.toString().slice(4, 6);
        const day = row.Datum.toString().slice(6, 8);

        const date = new Date(year, month - 1, day);
        row.date = date.getTime();

        delete row["Datum"]
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
