const getIconClass = t => {
  const m = { spotify:'fa-brands fa-spotify', youtube:'fa-brands fa-youtube', instagram:'fa-brands fa-instagram', tiktok:'fa-brands fa-tiktok', apple:'fa-brands fa-apple' };
  const k = Object.keys(m).find(x => t.toLowerCase().includes(x));
  return m[k] || 'fa-solid fa-link';
};
const init = async () => {
  setupModal();
  try {
    const [pRes, lRes] = await Promise.all([ fetch('data/profile.json').catch(()=>null), fetch('data/links.json').catch(()=>null) ]);
    if (pRes?.ok) renderProfile(await pRes.json());
    if (lRes?.ok) renderLinks((await lRes.json()).links || []);
  } catch (e) { console.error(e); }
};
const renderProfile = d => {
  const name = d.username || d.name, img = d.avatar || d.image;
  const setTxt = (s, t) => { const e = document.querySelector(s); if(e && t) e.textContent = t; };
  const setSrc = (id, s) => { const e = document.getElementById(id); if(e && s) e.src = s; };
  setTxt('.y2k-title', name); setTxt('.modal-profile h4', name); setTxt('.y2k-subtitle', d.bio);
  setTxt('#video-title', d.video_title); setTxt('#video-subtitle', d.video_subtitle);
  setTxt('#photo-title', d.photo_title); setTxt('#photo-subtitle', d.photo_subtitle);
  setSrc('bg-video', d.bg_video); setSrc('manifesto-video', d.manifesto_video);
  setSrc('collage-img-1', d.collage_1); setSrc('collage-img-2', d.collage_2); setSrc('photo-cierre', d.photo_cierre);
  if (img) document.querySelectorAll('.profile-pic, .profile-pic-small').forEach(p => Object.assign(p.style, { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }));
};
const renderLinks = l => {
  const c = document.querySelector('.links-container');
  if (!c) return;
  c.innerHTML = '';
  l.filter(x => x.visible !== false).sort((a, b) => (a.order||0) - (b.order||0)).forEach(({url, title}) => {
    const a = document.createElement('a');
    Object.assign(a, { href: url, className: 'link-btn', target: '_blank', rel: 'noopener noreferrer', innerHTML: `<i class="${getIconClass(title)}"></i> ${title}` });
    c.appendChild(a);
  });
};
const setupModal = () => {
  const m = document.getElementById('shareModal'), cBtn = document.getElementById('copyBtn');
  document.getElementById('shareBtn')?.addEventListener('click', () => m?.classList.add('active'));
  document.getElementById('closeBtn')?.addEventListener('click', () => m?.classList.remove('active'));
  m?.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
  cBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const i = cBtn.querySelector('i');
      i.className = 'fa-solid fa-check';
      setTimeout(() => i.className = 'fa-solid fa-link', 2000);
    } catch (e) { console.error(e); }
  });
};
document.addEventListener('DOMContentLoaded', init);
