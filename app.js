(() => {
  'use strict';
  const conf = window.PARTY_CONFIG;
  const $ = (id) => document.getElementById(id);
  $('partyName').textContent = conf.partyName;
  $('partyDate').textContent = conf.date;
  $('partyTime').textContent = conf.time;
  $('partyVenue').textContent = conf.venue;
  $('partyAddress').textContent = conf.address;
  const ready = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(conf.supabaseUrl) && conf.supabasePublishableKey.startsWith('sb_publishable_');
  if (!ready) { $('setupNotice').hidden = false; $('submitBtn').disabled = true; }
  const form = $('rsvpForm');
  function toggleCounts() { const attending = form.elements.attending.value === 'yes'; $('counts').hidden = !attending; $('adults').disabled = !attending; $('kids').disabled = !attending; }
  form.querySelectorAll('input[name="attending"]').forEach(el => el.addEventListener('change', toggleCounts));
  toggleCounts();
  document.querySelectorAll('[data-target]').forEach(btn => btn.addEventListener('click', () => {
    const field = $(btn.dataset.target);
    const val = Number(field.value || 0) + Number(btn.dataset.change);
    field.value = Math.max(0, Math.min(30, val));
  }));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!ready) return;
    $('status').textContent = ''; $('status').className = 'status';
    const attending = form.elements.attending.value === 'yes';
    const adults = attending ? Number($('adults').value) : 0;
    const kids = attending ? Number($('kids').value) : 0;
    const name = $('family').value.trim(); const email = $('email').value.trim();
    if (!name || !$('email').checkValidity() || !Number.isInteger(adults) || !Number.isInteger(kids) || adults < 0 || kids < 0 || adults > 30 || kids > 30 || (attending && adults + kids === 0)) {
      $('status').textContent = 'Please enter a valid family name, email and headcount (at least one guest if attending).'; $('status').classList.add('error'); return;
    }
    const payload = {family_name:name, email, attending, adults, kids, note:$('note').value.trim()};
    $('submitBtn').disabled = true; $('submitBtn').textContent = 'Sending RSVP…';
    try {
      const url = conf.supabaseUrl.replace(/\/$/,'') + '/rest/v1/rsvps';
      const result = await fetch(url, {method:'POST', headers:{'apikey':conf.supabasePublishableKey,'Content-Type':'application/json','Prefer':'return=minimal'}, body:JSON.stringify(payload)});
      if (!result.ok) throw new Error('Could not save RSVP (HTTP '+result.status+').');
      form.hidden = true; $('success').hidden = false;
      $('successMessage').textContent = attending ? `Thank you, ${name}! Your RSVP for ${adults} adult${adults===1?'':'s'} and ${kids} child${kids===1?'':'ren'} has been saved.` : `Thank you, ${name}, for letting us know. We'll miss you!`;
      $('success').focus();
    } catch(err) {
      $('status').textContent = 'Your RSVP was not confirmed. Please try again or contact the host. '+err.message;
      $('status').classList.add('error');
      $('submitBtn').disabled = false; $('submitBtn').textContent = 'Send RSVP';
    }
  });
})();
