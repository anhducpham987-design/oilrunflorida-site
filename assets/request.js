/* Oilrun service request: opens the visitor's texting app with the form filled in.
   Messages go to (850) 637-7024. No backend; the visitor still has to press Send.
   For automatic delivery without the visitor's texting app, see README (Formspree / Twilio). */
(function () {
  var form = document.getElementById('request-form');
  if (!form) return;
  var SMS_NUMBER = '+18506377024';
  var status = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var f = form.elements;
    var val = function (n) { var el = f[n]; return el && el.value ? el.value.trim() : ''; };
    var times = Array.prototype.slice.call(form.querySelectorAll('input[name="Preferred time"]:checked'))
      .map(function (c) { return c.value; }).join(', ');
    var vehicle = [val('Year'), val('Make'), val('Model')].filter(Boolean).join(' ');
    var lines = [
      'Oilrun service request (from oilrunflorida.com)',
      'Name: ' + val('Name'),
      'Phone: ' + val('Phone'),
      'Vehicle: ' + (vehicle || 'not given'),
      'Service: ' + val('Service'),
      'Location: ' + val('Location'),
      'Preferred time of day: ' + (times || 'no preference'),
      'Availability: ' + (val('Availability') || 'not given'),
      'Notes: ' + (val('Notes') || 'none')
    ];
    var body = encodeURIComponent(lines.join('\n'));
    // "?&body=" is accepted by both iOS Messages and Android messaging apps.
    var url = 'sms:' + SMS_NUMBER + '?&body=' + body;
    if (status) {
      status.textContent = 'Opening your texting app with your request filled in. Press Send to text it to us. ' +
        'If nothing opened (for example on a computer), text (850) 637-7024 or use the email link below.';
    }
    window.location.href = url;
  });
})();
