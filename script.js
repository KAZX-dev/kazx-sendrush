/*
  SendRush : script
  © KΛZX.dev Tous droits réservés.
*/

// ---------- Réglages de la vitesse (en ms) ----------
const RUSH_DURATION  = 520;   // temps de course d'un chevron (plus petit = plus rapide)
const RUSH_STAGGER   = 70;    // décalage entre les 3 chevrons
const MORPH_DURATION = 420;   // bouton -> rond
const DONE_HOLD      = 2400;  // durée d'affichage de la validation avant le retour
const DRAW_DURATION  = 820;   // cercle + coche/croix se tracent, puis saut ou tremblement + haptique

// ---------- Éléments ----------
const btn    = document.getElementById('send');
const wrap   = document.getElementById('wrap');
const icon   = document.getElementById('icon');
const status = document.getElementById('status');
const simulateError = document.getElementById('simulateError'); // démo uniquement

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep  = ms => new Promise(resolve => setTimeout(resolve, ms));
let busy = false;

// ---------- Les chevrons ">" qui filent vers la droite ----------
async function launch() {
  const b = btn.getBoundingClientRect();
  const i = icon.getBoundingClientRect();
  const left = i.left - b.left;
  const top  = i.top - b.top;
  const dist = b.width - left + 70;   // distance pour sortir du bouton
  const chevronSVG = icon.innerHTML;
  const clones = [];
  const anims  = [];

  for (let n = 0; n < 3; n++) {
    const c = document.createElement('span');
    c.className = 'rush';
    c.style.cssText = `left:${left}px;top:${top}px;width:${i.width}px;height:${i.height}px;opacity:${1 - n * 0.28}`;
    c.innerHTML = '<i class="streak"></i>' + chevronSVG;
    btn.appendChild(c);
    clones.push(c);

    const timing = {
      duration: RUSH_DURATION,
      delay: n * RUSH_STAGGER,
      easing: 'cubic-bezier(.6, 0, .9, .5)',  // démarre doucement, finit en trombe
      fill: 'both'
    };

    // Le chevron s'étire en accélérant
    anims.push(c.animate([
      { transform: 'translateX(0) scaleX(1)' },
      { transform: `translateX(${dist}px) scaleX(1.5)` }
    ], timing));

    // La traînée de vitesse derrière lui
    anims.push(c.querySelector('.streak').animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(1)' }
    ], { ...timing, easing: 'ease-in' }));
  }

  await Promise.all(anims.map(a => a.finished));
  clones.forEach(c => c.remove());
}

// ---------- Retour haptique ----------
// Android (Chrome) : navigator.vibrate.
// iPhone (Safari 17.4+) : astuce du <input switch> qui déclenche un petit "tic".
function haptic(type) {
  const patterns = {
    tap: 10,
    success: [14, 45, 26],
    error: [30, 50, 30, 50, 70]   // vibration plus sèche et répétée
  };

  if (navigator.vibrate) {
    navigator.vibrate(patterns[type]);
    return;
  }

  try {
    const label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    label.appendChild(input);
    document.body.appendChild(label);
    label.click();
    label.remove();
  } catch (e) { /* pas de haptique disponible */ }
}

// ---------- Séquence complète ----------

// ---------- Envoi du message ----------
// Remplace cette fonction par ton vrai envoi (par exemple un fetch).
// Elle doit réussir (resolve) ou échouer (reject).
function sendMessage() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError && simulateError.checked) reject(new Error('Échec de l\'envoi'));
      else resolve();
    }, 900);
  });
}

async function run() {
  if (busy) return;
  busy = true;
  btn.setAttribute('aria-disabled', 'true');
  haptic('tap');
  status.className = 'status';
  status.textContent = 'Envoi…';

  // L'envoi démarre en même temps que l'animation
  const request = sendMessage().then(() => true, () => false);

  // 1. Les flèches filent vers la droite
  btn.dataset.state = 'sending';
  if (reduce) await sleep(200); else await launch();

  // Si l'envoi n'est pas encore terminé, on attend le résultat
  const ok = await request;

  // 2. Le bouton devient un rond (vert si succès, rouge si erreur)
  btn.classList.toggle('is-error', !ok);
  wrap.classList.toggle('err', !ok);
  btn.dataset.state = 'morph';
  await sleep(reduce ? 0 : MORPH_DURATION);

  // 3. Le cercle se trace, puis la coche (ou la croix)
  btn.dataset.state = 'done';
  await sleep(reduce ? 0 : DRAW_DURATION);

  // 4. Résultat : saut + haptique de succès, ou tremblement + haptique d'erreur
  wrap.classList.add('ping');
  if (ok) {
    btn.classList.add('hop');
    haptic('success');
    status.textContent = 'Message envoyé';
    status.classList.add('ok');
  } else {
    btn.classList.add('shake');
    haptic('error');
    status.textContent = 'Échec de l\'envoi, réessaie';
    status.classList.add('err');
  }
  await sleep(DONE_HOLD);

  // 5. Retour à l'état initial
  btn.classList.remove('hop', 'shake', 'is-error');
  wrap.classList.remove('ping', 'err');
  btn.dataset.state = 'idle';
  status.className = 'status';
  status.textContent = 'Prêt à envoyer';
  await sleep(reduce ? 0 : 500);

  btn.removeAttribute('aria-disabled');
  busy = false;
}

btn.addEventListener('click', run);
