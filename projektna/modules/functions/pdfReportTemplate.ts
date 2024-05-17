import { Attendance, User } from "../interfaces/user";

export default function pdfReportTemplate(user: User): string {
  const generateTable = (attendances: Attendance[]) => {
    let tableHtml = '<table>';
    tableHtml += '<tr><th>Entry</th><th>Time in</th><th>Time out</th><th>Breaks</th></tr>';

    for (let i = 0; i < attendances.length; i++) {
      tableHtml += `<tr>`;
      tableHtml += `<td>${i + 1}</td>`;
      tableHtml += `<td>${new Date(attendances[i].timeIn.seconds * 1000 + attendances[i].timeIn.nanoseconds / 1e6).toLocaleString()}</td>`;
      tableHtml += `<td>${attendances[i].timeOut ? new Date(attendances[i].timeOut!.seconds * 1000 + attendances[i].timeOut!.nanoseconds / 1e6).toLocaleString() : 'Ongoing'}</td>`;

      tableHtml += `<td><table><tr><th>Entry</th><th>Start</th><th>End</th><th>Description</th></tr>`;
      for (let j = 0; j < attendances[i].breaks.length; j++) {
        const breakData = attendances[i].breaks[j];
        tableHtml += `<tr>`;
        tableHtml += `<td>${j + 1}</td>`;
        tableHtml += `<td>${new Date(breakData.start.seconds * 1000 + breakData.start.nanoseconds / 1e6).toLocaleString()}</td>`;
        tableHtml += `<td>${breakData.end ? new Date(breakData.end.seconds * 1000 + breakData.end.nanoseconds / 1e6).toLocaleString() : 'Ongoing'}</td>`;
        tableHtml += `<td class="break-description">${breakData.description}</td>`;
        tableHtml += `</tr>`;
      }
      tableHtml += `</table></td>`;

      tableHtml += `</tr>`;
    }

    tableHtml += '</table>';
    return tableHtml;
  };

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Attendance</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }

                th {
                    background-color: #f2f2f2;
                }

                .break-description {
                    max-width: 200px; /* Adjust the max-width based on your design */
                    word-wrap: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            </style>
        </head>
        <body>
            <h2>User Information</h2>
            <table>
                <tr><th>Name</th><td>${user.name}</td></tr>
                <tr><th>Surname</th><td>${user.surname}</td></tr>
                <tr><th>UID</th><td>${user.uid}</td></tr>
            </table>
            <h2>Attendance</h2>
            ${generateTable(user.attendance)}
        </body>
        </html>
    `;
}
