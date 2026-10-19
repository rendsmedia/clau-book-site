/* William Matovu · shared scripts */
document.querySelectorAll('.copy').forEach(function(b){
  b.addEventListener('click',function(){
    var el=document.getElementById(b.dataset.copy),t=el.textContent;
    function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}
    function sel(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)}
    try{navigator.clipboard.writeText(t).then(done,sel)}catch(e){sel()}
  });
});

/* ---- Amazon: send each reader to their own Amazon store ----
   KDP books keep the same ASIN in every Amazon marketplace, so one ASIN
   is enough. Paste it below (from KDP Bookshelf, or the "ASIN" line on the
   Amazon page). Until it is set, buttons fall back to an Amazon search. */
var AMAZON_ASIN = "B0B9K66JQT";  // Kindle edition
(function(){
  var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch(e) {}
  var stores = [
    [/^Europe\/London|^Europe\/(Belfast|Guernsey|Isle_of_Man|Jersey)/, "amazon.co.uk"],
    [/^Europe\/Dublin/, "amazon.co.uk"],
    [/^Europe\/(Berlin|Vienna|Zurich|Busingen)/, "amazon.de"],
    [/^Europe\/Paris|^Europe\/(Brussels|Luxembourg|Monaco)/, "amazon.fr"],
    [/^Europe\/(Rome|Vatican|San_Marino)/, "amazon.it"],
    [/^Europe\/Madrid|^Atlantic\/Canary/, "amazon.es"],
    [/^Europe\/Amsterdam/, "amazon.nl"],
    [/^Europe\/Warsaw/, "amazon.pl"],
    [/^Europe\/Stockholm/, "amazon.se"],
    [/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal)/, "amazon.ca"],
    [/^America\/(Mexico_City|Cancun|Monterrey|Tijuana|Merida|Chihuahua)/, "amazon.com.mx"],
    [/^America\/(Sao_Paulo|Recife|Fortaleza|Bahia|Manaus|Belem)/, "amazon.com.br"],
    [/^Australia\//, "amazon.com.au"],
    [/^Asia\/(Kolkata|Calcutta)/, "amazon.in"],
    [/^Asia\/Tokyo/, "amazon.co.jp"]
  ];
  var host = "amazon.com";
  for (var i = 0; i < stores.length; i++) { if (stores[i][0].test(tz)) { host = stores[i][1]; break; } }
  var url = AMAZON_ASIN
    ? "https://www." + host + "/dp/" + AMAZON_ASIN
    : "https://www." + host + "/s?k=Compulsory+Land+Acquisition+Road+Infrastructure+Uganda+Matovu&i=stripbooks";
  document.querySelectorAll("[data-amazon]").forEach(function(a){ a.href = url; });
})();
/* ---- Contact form ---- */
(function(){
  var form=document.getElementById('form'); if(!form) return;
  var status=document.getElementById('form-status'), sel=document.getElementById('f-enquiry');
  document.getElementById('f-started').value=Date.now();
  function show(msg,err){status.textContent=msg;status.className='status'+(err?' error':'');status.hidden=false;}
  // Links like /contact?enquiry=bulk preselect the enquiry type
  var m=location.search.match(/[?&]enquiry=([a-z]+)/); if(m && sel.querySelector('option[value="'+m[1]+'"]')) sel.value=m[1];
  // Result after the server redirects back
  var q=location.search;
  if(/[?&]sent=1/.test(q)) show('Thank you. Your message has been sent, and William will reply within two working days.');
  else if(/[?&]error=1/.test(q)) show('Your message could not be sent. Please check the fields, or email hello@williammatovu.com directly.',true);
  form.addEventListener('submit',function(e){
    var bad=null;
    form.querySelectorAll('[required]').forEach(function(f){
      var ok=f.value.trim()!=='' && (f.type!=='email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.setAttribute('aria-invalid',ok?'false':'true'); if(!ok&&!bad) bad=f;
    });
    if(bad){e.preventDefault();show('Please fill in your name, a valid email and a message.',true);bad.focus();}
  });
})();

/* ---- Mobile menu ---- */
(function(){
  var btn=document.querySelector('.menu-toggle'), nav=document.getElementById('site-nav'); if(!btn||!nav) return;
  function set(open){nav.classList.toggle('open',open);btn.setAttribute('aria-expanded',open?'true':'false');btn.setAttribute('aria-label',open?'Close menu':'Open menu');}
  btn.addEventListener('click',function(){set(btn.getAttribute('aria-expanded')!=='true');});
  nav.addEventListener('click',function(e){if(e.target.closest('a')) set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){set(false);btn.focus();}});
  document.addEventListener('click',function(e){if(nav.classList.contains('open')&&!e.target.closest('.top')) set(false);});
  window.addEventListener('resize',function(){if(window.innerWidth>820) set(false);});
})();
