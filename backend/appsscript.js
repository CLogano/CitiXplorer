var NAME_COLUMN_INDEX = 1;
var EMAIL_COLUMN_INDEX = 2;
var MESSAGE_COLUMN_INDEX = 5;
var EMAIL_SENT_COLUMN_INDEX = 6;

function checkForNewEntriesAndSendEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contact Form Responses");
  var data = sheet.getDataRange().getValues();

  // Loop over the rows in reverse order (from the bottom of the sheet up).
  for (var i = data.length - 1; i >= 0; i--) {
    var row = data[i];

    // If the row doesn't have a value in the email column, skip it.
    if (!row[EMAIL_COLUMN_INDEX - 1]) {
      continue;
    }

    // If the row doesn't have a value in the message column, skip it.
    if (!row[MESSAGE_COLUMN_INDEX - 1]) {
      continue;
    }

    // If email has already been sent, skip it.
    if (row[EMAIL_SENT_COLUMN_INDEX - 1] == "Yes") {
      continue;
    }

    let name = row[NAME_COLUMN_INDEX - 1];
    if (!name) {
      name = "User";
    }
    var email = row[EMAIL_COLUMN_INDEX - 1];
    var message = row[MESSAGE_COLUMN_INDEX - 1];

    // Send an email to the email address in the row.
    Logger.log(`Sending email to: ${email} Name: ${name}`);
    try {
      MailApp.sendEmail({
      to: email,
      subject: 'Thanks from the CitiXplorer Team!',
      body: `Hey ${name},\n\nThanks for reaching out to us! We'll try to get back to you as soon as possible.\n\n- The CitiXplorer Team\n\nMessage: "${message}"`,
      });
    } catch (e) {
      Logger.log(`Failed to send email to ${email}: ${e}`);
    }

    // Mark the email as sent in the sheet.
    sheet.getRange(i + 1, EMAIL_SENT_COLUMN_INDEX).setValue("Yes");
  }
}

// Create a time-driven trigger to run the checkForNewEntriesAndSendEmails function every 5 minutes.
function createTimeDrivenTrigger() {
  ScriptApp.newTrigger('checkForNewEntriesAndSendEmails')
    .timeBased()
    .everyMinutes(5)
    .create();
}