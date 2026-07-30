const getIconClass = (title) => {
    const map = {
        'spotify': 'fa-brands fa-spotify',
        'youtube': 'fa-brands fa-youtube',
        'instagram': 'fa-brands fa-instagram',
        'tiktok': 'fa-brands fa-tiktok',
        'apple': 'fa-brands fa-apple'
    };
    const key = Object.keys(map).find(k => title.toLowerCase().includes(k));
    return map[key] || 'fa-solid fa-link';
};

const init = async () => {
    setupModal();
    try {
        const [profileRes, linksRes] = await Promise.all([
            fetch('data/profile.json').catch(() => null),
            fetch('data/links.json').catch(() => null)
        ]);
        if (profileRes?.ok) renderProfile(await profileRes.json());
        if (linksRes?.ok) {
            const data = await linksRes.json();
            renderLinks(data.links || []);
        }
    } catch (err) {
        console.error(err);
    }
};

const renderProfile = ({ username, bio, avatar }) => {
    const elTitle = document.querySelector('h1');
    const elBio = document.querySelector('p');
    const pics = document.querySelectorAll('.profile-pic, .profile-pic-small');
    const modalName = document.querySelector('.modal-profile h4');

    if (elTitle && username) elTitle.textContent = username;
    if (modalName && username) modalName.textContent = username;
    if (elBio && bio) elBio.textContent = bio;

    if (avatar) {
        pics.forEach(pic => {
            Object.assign(pic.style, {
                backgroundImage: `url(${avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            });
        });
    }
};

const renderLinks = (links = []) => {
    const container = document.querySelector('.links-container');
    if (!container) return;
    container.innerHTML = '';

    links
        .filter(link => link.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach(({ url, title }) => {
            const anchor = document.createElement('a');
            Object.assign(anchor, {
                href: url,
                className: 'link-btn',
                target: '_blank',
                rel: 'noopener noreferrer'
            });
            anchor.innerHTML = `<i class="${getIconClass(title)}"></i> ${title}`;
            container.appendChild(anchor);
        });
};

const setupModal = () => {
    const modal = document.getElementById('shareModal');
    const btnOpen = document.getElementById('shareBtn');
    const btnClose = document.getElementById('closeBtn');
    const btnCopy = document.getElementById('copyBtn');

    btnOpen?.addEventListener('click', () => modal?.classList.add('active'));
    btnClose?.addEventListener('click', () => modal?.classList.remove('active'));
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    btnCopy?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            const icon = btnCopy.querySelector('i');
            icon.className = 'fa-solid fa-check';
            setTimeout(() => icon.className = 'fa-solid fa-link', 2000);
        } catch (err) {
            console.error(err);
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
