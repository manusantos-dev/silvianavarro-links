const init = async () => {
    try {
        const [profileRes, linksRes] = await Promise.all([
            fetch('data/profile.json').catch(() => null),
            fetch('data/links.json').catch(() => null)
        ]);

        if (profileRes?.ok) {
            const profile = await profileRes.json();
            renderProfile(profile);
        }

        if (linksRes?.ok) {
            const data = await linksRes.json();
            renderLinks(data.links);
        }
    } catch (err) {
        console.error(err);
    }
};

const renderProfile = ({ username, bio, avatar }) => {
    const elTitle = document.querySelector('h1');
    const elBio = document.querySelector('p');
    const elPic = document.querySelector('.profile-pic');

    if (elTitle && username) elTitle.textContent = username;
    if (elBio && bio) elBio.textContent = bio;
    if (elPic && avatar) {
        Object.assign(elPic.style, {
            backgroundImage: `url(${avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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
                textContent: title,
                target: '_blank',
                rel: 'noopener noreferrer'
            });
            container.appendChild(anchor);
        });
};

document.addEventListener('DOMContentLoaded', init);
