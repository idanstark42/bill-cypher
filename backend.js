// Get workout log as JSON
function doGet (request) {
  const action = request.parameter.action
  if (action === 'ping') {
    return ping()
  } else if (action === 'load') {
    return load(request.parameter.id)
  } else if (action === 'create') {
    const data = JSON.parse(request.postData.contents)
    return create(data)
  } else if (action === 'update') {
    const id = request.parameter.id
    const data = JSON.parse(request.postData.contents)
    return update(id, data)
  }
}

function ping () {
  const response = { active: true, version: '1.0', user: 'Idan Stark' }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON)
}

const FIELDS = ['id', 'data']

function load (id) {
  const sheet = getSheet()
  const data = sheet.getDataRange().getValues()
  const session = data.find(row => row[0] === id)

  if (!session) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Session not found' })).setMimeType(ContentService.MimeType.JSON)
  }

  const response = {}
  FIELDS.forEach((field, index) => {
    response[field] = session[index]
  })
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON)
}

function create (data) {
  const id = Utilities.getUuid()
  const sheet = getSheet()
  sheet.appendRow([id, data])
  return ContentService.createTextOutput(JSON.stringify({ id })).setMimeType(ContentService.MimeType.JSON)
}

function update (id, data) {
  const sheet = getSheet()
  const sessions = sheet.getDataRange().getValues()
  const rowIndex = sessions.findIndex(row => row[0] === id)
  if (rowIndex === -1) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Session not found' })).setMimeType(ContentService.MimeType.JSON)
  }
  sheet.getRange(rowIndex + 1, 2).setValue(data)
  return ContentService.createTextOutput(JSON.stringify({ id })).setMimeType(ContentService.MimeType.JSON)
}

function getSheet () {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  return spreadsheet.getSheetByName('sessions')
}
