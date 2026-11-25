// Deploy as a web app executing as you. Keep the response spreadsheet private.
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('FORM_ID')) {
    ensureStayField(FormApp.openById(props.getProperty('FORM_ID')));
    return;
  }
  const form = FormApp.create('Apurva & Manmohan — Wedding RSVPs');
  const sheet = SpreadsheetApp.create('Apurva & Manmohan — RSVP Responses');
  ['Name', 'Guests', 'Side', 'Events', 'Food — 17 Jan', 'Food — 18 Jan', 'Note', 'Submission ID'].forEach(function(title) {
    form.addTextItem().setTitle(title);
  });
  ensureStayField(form);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  props.setProperties({ FORM_ID: form.getId(), SHEET_ID: sheet.getId(), SECRET: Utilities.getUuid() + Utilities.getUuid() });
  console.log('Responses: ' + sheet.getUrl());
  console.log('Form: ' + form.getEditUrl());
  console.log('RSVP_SCRIPT_SECRET=' + props.getProperty('SECRET'));
}
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty('SECRET') || data.secret !== props.getProperty('SECRET')) throw new Error('Unauthorized');
    if (!data.name || !Number.isInteger(data.guests) || data.guests < 1 || data.guests > 20 || !data.events.length) throw new Error('Invalid RSVP');
    if (!['own', 'friends-bungalow'].includes(data.stay)) throw new Error('Please choose your stay');
    lock.waitLock(20000);
    const form = FormApp.openById(props.getProperty('FORM_ID'));
    // Inspect saved responses, rather than a cache, so retries cannot lose their receipt.
    const previous = form.getResponses().find(function(response) {
      return response.getItemResponses().some(function(item) {
        return item.getItem().getTitle() === 'Submission ID' && item.getResponse() === data.submissionId;
      });
    });
    if (previous) return json({ok:true, receipt:previous.getId()});
    ensureStayField(form);
    const values = {
      'Name': data.name, 'Guests': String(data.guests), 'Side': data.side,
      'Events': data.events.join(', '), 'Food — 17 Jan': data.food.day1,
      'Food — 18 Jan': data.food.day2, 'Note': data.note, 'Submission ID': data.submissionId,
      'Stay': data.stay === 'own' ? 'Booking own stay' : 'Friends Only bungalow — check-in 17 Jan 2027, checkout 19 Jan 2027'
    };
    let response = form.createResponse();
    form.getItems(FormApp.ItemType.TEXT).forEach(function(item) {
      response.withItemResponse(item.asTextItem().createResponse(String(values[item.getTitle()] || '')));
    });
    response = response.submit();
    return json({ok:true, receipt:response.getId()});
  } catch (error) {
    return json({ok:false, error:'Could not save RSVP'});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

// Upgrade the existing Form without changing its IDs or previous responses.
function ensureStayField(form) {
  if (!form.getItems().some(function(item) { return item.getTitle() === 'Stay'; })) {
    form.addTextItem().setTitle('Stay');
  }
}
