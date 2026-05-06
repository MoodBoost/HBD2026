const coverSection = document.getElementById('cover');
const messageSection = document.getElementById('message');
const openBtn = document.getElementById('openBtn');
const btnText = document.getElementById('btnText');
const moreConfettiBtn = document.getElementById('moreConfettiBtn');
const allPhotos = document.querySelectorAll('.photo-frame');
const scatterPhotosElements = document.querySelectorAll('.scatter-photo');
const mainCard = document.getElementById('mainCard');

const abstractEmojis = ['👽', '💩', '👻', '🍕', '🚀', '🦖', '🦄', '🗿', '💅', '🤡', '🐸', '💸'];

const clickMessages = [
    "Pencet Dulu Sini Kak!",
    "Eits, kurang bertenaga! Coba lagi 😜",
    "Masa anak sauwibuk lemes? Pencet lagi!",
    "Nah gitu dong, dikit lagi kebuka nih!",
    "Satu... Dua... TIGA!!! 💥"
];
let clickCount = 0;

function fireConfetti() {
    var duration = 3000;
    var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function scatterPhotosSafe() {
    const gallery = document.getElementById('photoGallery');
    gallery.classList.remove('hidden');
    
    // CEK JIKA DIBUKA DI HP
    if (window.innerWidth <= 768) {
        gallery.classList.add('mobile-layout');
        scatterPhotosElements.forEach((photo) => {
            // Hapus CSS absolute dari script sebelumnya
            photo.style.position = 'relative';
            photo.style.left = 'auto';
            photo.style.top = 'auto';
            
            // Cukup kasih miring-miring estetik biar tetap ajur kabeh
            const randomRot = (Math.random() * 40) - 20;
            photo.style.transform = `rotate(${randomRot}deg)`;
        });
        return; // Hentikan script disini agar tidak lanjut ke mode PC
    }

    // ==========================================
    // LOGIKA MODE PC (Kavling Kiri-Kanan)
    // ==========================================
    const cardRect = mainCard.getBoundingClientRect();
    const leftPhotos = [];
    const rightPhotos = [];
    
    scatterPhotosElements.forEach((photo, index) => {
        if (index % 2 === 0) leftPhotos.push(photo);
        else rightPhotos.push(photo);
    });

    const photoWidth = 140; 
    const maxY = window.innerHeight - 200; 
    
    const slotHeightLeft = maxY / leftPhotos.length;
    const slotHeightRight = maxY / rightPhotos.length;

    leftPhotos.forEach((photo, index) => {
        let maxLeft = cardRect.left - photoWidth - 20; 
        if(maxLeft < 10) maxLeft = 10; 
        const randomX = Math.random() * maxLeft;
        const baseY = index * slotHeightLeft; 
        const randomY = baseY + (Math.random() * (slotHeightLeft * 0.4));
        const randomRot = (Math.random() * 50) - 25; 
        
        photo.style.left = `${randomX}px`;
        photo.style.top = `${randomY}px`;
        photo.style.transform = `rotate(${randomRot}deg)`;
    });

    rightPhotos.forEach((photo, index) => {
        let minRight = cardRect.right + 20; 
        let spaceRight = window.innerWidth - minRight - photoWidth;
        if(spaceRight < 10) { minRight = window.innerWidth - photoWidth - 10; spaceRight = 10; }
        
        const randomX = minRight + (Math.random() * spaceRight);
        const baseY = index * slotHeightRight; 
        const randomY = baseY + (Math.random() * (slotHeightRight * 0.4));
        const randomRot = (Math.random() * 50) - 25; 
        
        photo.style.left = `${randomX}px`;
        photo.style.top = `${randomY}px`;
        photo.style.transform = `rotate(${randomRot}deg)`;
    });
}

openBtn.addEventListener('click', () => {
    clickCount++;
    openBtn.classList.add('shake-animation');
    setTimeout(() => openBtn.classList.remove('shake-animation'), 300);

    if (clickCount < 5) {
        btnText.innerText = clickMessages[clickCount];
    } else {
        coverSection.classList.add('hidden');
        setTimeout(() => {
            messageSection.classList.remove('hidden');
            fireConfetti();
            scatterPhotosSafe();
        }, 200);
    }
});

moreConfettiBtn.addEventListener('click', () => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
});

allPhotos.forEach(photo => {
    photo.addEventListener('click', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        confetti({ particleCount: 40, spread: 40, origin: { x: x, y: y }, colors: ['#FF6B81', '#FFFFFF', '#FFD700'] });
    });
});

// Animasi Emoji Abstrak
function spawnRandomEmoji() {
    const emojiEl = document.createElement('div');
    emojiEl.style.position = 'fixed';
    emojiEl.style.fontSize = (Math.random() * 30 + 20) + 'px';
    emojiEl.style.zIndex = 1; 
    emojiEl.style.pointerEvents = 'none';
    emojiEl.innerText = abstractEmojis[Math.floor(Math.random() * abstractEmojis.length)];
    document.body.appendChild(emojiEl);

    const startY = Math.random() * window.innerHeight;
    const endY = Math.random() * window.innerHeight;
    const midY1 = startY + (Math.random() * 400 - 200);
    const midY2 = endY + (Math.random() * 400 - 200);
    const duration = Math.random() * 5000 + 4000;

    const animation = emojiEl.animate([
        { transform: `translate(110vw, ${startY}px) rotate(0deg) scale(1)` },
        { transform: `translate(70vw, ${midY1}px) rotate(${Math.random()*180}deg) scale(${Math.random()*1.5+0.5})` },
        { transform: `translate(30vw, ${midY2}px) rotate(${Math.random()*360}deg) scale(${Math.random()*1.5+0.5})` },
        { transform: `translate(-10vw, ${endY}px) rotate(${Math.random()*720}deg) scale(1)` }
    ], { duration: duration, easing: 'ease-in-out', fill: 'forwards' });

    animation.onfinish = () => emojiEl.remove();
    setTimeout(spawnRandomEmoji, Math.random() * 1500 + 500);
}

spawnRandomEmoji();