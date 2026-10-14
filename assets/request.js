/* Oilrun service request. No backend; the visitor still has to press Send.
   - Phones/tablets: opens the visitor's texting app with the form filled in, addressed to (850) 637-7024.
   - Desktop computers: opens the visitor's email app (mailto:oilrunflorida@gmail.com) with the same details.
   For automatic delivery without the visitor's texting/email app, see README (Formspree / Twilio). */
(function () {
  var form = document.getElementById('request-form');
  if (!form) return;
  var SMS_NUMBER = '+18506377024';
  var EMAIL = 'oilrunflorida@gmail.com';
  var EMAIL_SUBJECT = 'Service request';
  var status = document.getElementById('form-status');

  function isMobile() {
    var nav = window.navigator || {};
    if (nav.userAgentData && typeof nav.userAgentData.mobile === 'boolean' && nav.userAgentData.mobile) return true;
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent || '')) return true;
    // iPadOS 13+ reports itself as a Mac; tell it apart from a real Mac by its touch screen.
    if (/Mac/i.test(nav.platform || '') && (nav.maxTouchPoints || 0) > 1) return true;
    return false;
  }

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
    var url;
    if (isMobile()) {
      // "?&body=" is accepted by both iOS Messages and Android messaging apps.
      url = 'sms:' + SMS_NUMBER + '?&body=' + encodeURIComponent(lines.join('\n'));
      if (status) {
        status.textContent = 'Opening your texting app with your request filled in. Press Send to text it to us. ' +
          'If nothing opened, text (850) 637-7024 or email ' + EMAIL + '.';
      }
    } else {
      // CRLF line breaks (%0D%0A) are what RFC 6068 mailto: bodies expect.
      url = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(EMAIL_SUBJECT) +
        '&body=' + encodeURIComponent(lines.join('\r\n'));
      if (status) {
        status.textContent = 'Opening your email app with your request filled in. Press Send to email it to us. ' +
          'If nothing opened, email ' + EMAIL + ' or call (850) 449-1738.';
      }
    }
    window.location.href = url;
  });
})();
