// ==========================================
// 0. ANIMASI LOADING "I LOVE YOU" MEMBENTUK HATI
// ==========================================
(function () {
    function mulaiLoading() {
        const loadingScreen = document.getElementById('simple-loading-screen');
        if (!loadingScreen) return;

        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 1s ease';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const pinScreen = document.getElementById('pin-screen');
                if (pinScreen) {
                    pinScreen.style.display = 'flex';
                    setTimeout(() => {
                        pinScreen.classList.add('active');
                    }, 50);
                }
            }, 1000);
        }, 3000);

        // ==========================================
        // PIN VALIDATION LOGIC (Pop-Up Notifikasi)
        // ==========================================
        const pinInput = document.getElementById('pin-input');
        const pinPopupOverlay = document.getElementById('pin-popup-overlay');
        const pinPopupBox = document.getElementById('pin-popup-box');
        const pinPopupImg = document.getElementById('pin-popup-img');
        const pinPopupEmoji = document.getElementById('pin-popup-emoji');
        const pinPopupMsg = document.getElementById('pin-popup-msg');
        const pinPopupClose = document.getElementById('pin-popup-close');

        // DEFAULT PIN: Silakan ubah angka ini jika ingin PIN lain
        const SECRET_PIN = "2015";

        let pinAttempt = 0;
        let popupTimeout = null;

        // Konfigurasi pesan & tampilan setiap percobaan salah
        const wrongConfigs = [
            {
                // Percobaan pertama: tampilkan foto kucing
                showCat: true,
                emoji: '',
                message: 'Masa tanggal jadian kita lupa?',
                buttonText: 'Iya iya maaf 😭'
            },
            {
                // Percobaan kedua: foto kucing marah
                showCat: true,
                catSrc: 'img/cat-angry.png',
                emoji: '',
                message: 'Serius lupa?!\nYaudah coba lagi deh.',
                buttonText: 'Sekali lagi 🙏'
            },
            {
                // Percobaan ketiga+: foto kucing thumbs up
                showCat: true,
                catSrc: 'img/cat-thumbsup.png',
                emoji: '',
                message: 'Kalau masih salah,\nketerlaluan sih.',
                buttonText: 'Ampun 😭'
            }
        ];

        function showPinPopup(config, isSuccess) {
            // Bersihkan timeout sebelumnya
            if (popupTimeout) clearTimeout(popupTimeout);

            // Reset semua state
            pinPopupBox.classList.remove('popup-success', 'shake-popup');
            pinPopupImg.classList.remove('wiggle-cat', 'hidden-img');
            pinPopupEmoji.classList.remove('show-emoji');
            pinPopupEmoji.textContent = '';

            if (isSuccess) {
                // Tampilan sukses — pakai foto kucing senang
                pinPopupImg.src = 'img/cat-success.png';
                pinPopupImg.classList.remove('hidden-img');
                pinPopupBox.classList.add('popup-success');
                pinPopupMsg.textContent = config.message;
                pinPopupClose.textContent = config.buttonText;
                setTimeout(() => {
                    pinPopupImg.classList.add('wiggle-cat');
                }, 400);
            } else {
                // Tampilan salah
                if (config.showCat) {
                    // Tampilkan gambar kucing + animasi wiggle
                    pinPopupImg.src = config.catSrc || 'img/cat-warning.png';
                    pinPopupImg.classList.remove('hidden-img');
                    setTimeout(() => {
                        pinPopupImg.classList.add('wiggle-cat');
                    }, 400);
                } else {
                    // Sembunyikan gambar, tampilkan emoji
                    pinPopupImg.classList.add('hidden-img');
                    pinPopupEmoji.textContent = config.emoji;
                    pinPopupEmoji.classList.add('show-emoji');
                    // Tambah padding atas karena tidak ada gambar yang menonjol
                    pinPopupBox.style.paddingTop = '30px';
                }

                pinPopupMsg.textContent = config.message;
                pinPopupClose.textContent = config.buttonText;

                // Shake animation setelah muncul
                setTimeout(() => {
                    pinPopupBox.classList.add('shake-popup');
                }, 500);
            }

            // Tampilkan pop-up
            pinPopupOverlay.classList.add('show-popup');
        }

        function closePinPopup() {
            pinPopupOverlay.classList.remove('show-popup');
            if (popupTimeout) clearTimeout(popupTimeout);
            // Reset padding
            pinPopupBox.style.paddingTop = '';
        }

        // Event listener untuk tombol tutup
        if (pinPopupClose) {
            pinPopupClose.addEventListener('click', closePinPopup);
        }

        // Tutup pop-up dengan klik overlay (di luar box)
        if (pinPopupOverlay) {
            pinPopupOverlay.addEventListener('click', function (e) {
                if (e.target === pinPopupOverlay) {
                    closePinPopup();
                }
            });
        }

        if (pinInput) {
            pinInput.addEventListener('input', function () {
                if (pinInput.value.length === 4) {
                    // Delay sedikit agar digit terakhir terasa diketik
                    setTimeout(() => {
                        if (pinInput.value === SECRET_PIN) {
                            // PIN BENAR
                            showPinPopup({
                                message: 'Valid!\nLanjut yaa~',
                                buttonText: 'Lanjut'
                            }, true);

                            // Auto-close dan lanjut setelah 2 detik
                            popupTimeout = setTimeout(() => {
                                closePinPopup();
                                setTimeout(() => {
                                    const pinScreen = document.getElementById('pin-screen');
                                    pinScreen.classList.remove('active');

                                    setTimeout(() => {
                                        pinScreen.style.display = 'none';
                                        const landingPage = document.getElementById('landing-page');
                                        if (landingPage) landingPage.style.display = '';
                                    }, 1000);
                                }, 300);
                            }, 2000);

                            // Juga lanjut saat tombol diklik
                            pinPopupClose.onclick = function () {
                                closePinPopup();
                                setTimeout(() => {
                                    const pinScreen = document.getElementById('pin-screen');
                                    pinScreen.classList.remove('active');

                                    setTimeout(() => {
                                        pinScreen.style.display = 'none';
                                        const landingPage = document.getElementById('landing-page');
                                        if (landingPage) landingPage.style.display = '';
                                    }, 1000);
                                }, 300);
                            };
                        } else {
                            // PIN SALAH
                            const configIndex = Math.min(pinAttempt, wrongConfigs.length - 1);
                            showPinPopup(wrongConfigs[configIndex], false);
                            pinAttempt++;

                            pinInput.classList.add('shake-animation');
                            setTimeout(() => pinInput.classList.remove('shake-animation'), 400);
                            pinInput.value = '';

                            // Reset tombol close ke default
                            pinPopupClose.onclick = closePinPopup;
                        }
                    }, 150);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mulaiLoading);
    } else {
        mulaiLoading();
    }
})();

// ==========================================
// 1. FUNGSI FOTO MEMBESAR (LIGHTBOX) & PEMUTAR MUSIK
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const daftarFoto = document.querySelectorAll('.gallery-scroll img, .polaroid, .planet-card');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalIframe = document.getElementById('modal-iframe'); // Panggil elemen iframe
    const modalCaption = document.getElementById('modal-caption');

    if (daftarFoto.length > 0 && modal && modalImg) {
        daftarFoto.forEach(foto => {
            foto.addEventListener('click', function () {

                // Reset layar setiap kali diklik
                if (modalCaption) modalCaption.innerText = "";
                modalImg.style.display = 'block'; // Tampilkan foto sebagai default
                modalIframe.style.display = 'none'; // Sembunyikan musik sebagai default
                modalIframe.src = ""; // Kosongkan lagu sebelumnya

                // A. JIKA YANG DIKLIK ADALAH KARTU LAGU/VIDEO (Punya data-embed)
                if (this.classList.contains('planet-card') && this.hasAttribute('data-embed')) {
                    modalImg.style.display = 'none'; // Sembunyikan foto
                    modalIframe.style.display = 'block'; // Tampilkan alat musik/video

                    const embedUrl = this.getAttribute('data-embed');
                    modalIframe.src = embedUrl; // Masukkan link

                    // Hapus class lama
                    modalIframe.classList.remove('iframe-spotify', 'iframe-youtube', 'iframe-facebook');

                    // Deteksi platform untuk penyesuaian rasio (16:9 untuk YouTube, Kotak untuk Spotify, 9:16 untuk Facebook)
                    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
                        modalIframe.classList.add('iframe-youtube');
                    } else if (embedUrl.includes('spotify.com')) {
                        modalIframe.classList.add('iframe-spotify');
                    } else if (embedUrl.includes('facebook.com')) {
                        modalIframe.classList.add('iframe-facebook');
                    }

                    const customCaption = this.getAttribute('data-caption');
                    const teksCaption = customCaption ? customCaption : this.querySelector('.planet-caption').innerText;
                    if (modalCaption) modalCaption.innerText = teksCaption;
                }
                // B. JIKA YANG DIKLIK ADALAH KARTU 3D BIASA (Bukan Lagu)
                else if (this.classList.contains('planet-card')) {
                    modalImg.src = this.querySelector('img').src;
                    modalImg.style.aspectRatio = "3 / 4";

                    const customCaption = this.getAttribute('data-caption');
                    const teksCaption = customCaption ? customCaption : this.querySelector('.planet-caption').innerText;
                    if (modalCaption) modalCaption.innerText = teksCaption;
                }
                // C. JIKA YANG DIKLIK ADALAH POLAROID
                else if (this.classList.contains('polaroid')) {
                    modalImg.src = this.querySelector('img').src;
                    modalImg.style.aspectRatio = "1 / 1";
                }
                // D. JIKA YANG DIKLIK ADALAH GALERI CINTA
                else {
                    modalImg.src = this.src;
                    modalImg.style.aspectRatio = "9 / 16";
                }

                modal.classList.add('show-modal');
            });
        });
    }

    const semuaTeksKetikan = document.querySelectorAll('.typing-text');
    semuaTeksKetikan.forEach(el => {
        el.setAttribute('data-teks', el.innerHTML);
        el.innerHTML = '';
    });
});

// Fungsi Menutup Layar & Mematikan Lagu
function tutupModal() {
    const modal = document.getElementById('image-modal');
    const modalIframe = document.getElementById('modal-iframe');

    if (modal) {
        modal.classList.remove('show-modal');
        // KUNCI PENTING: Mengosongkan src agar lagu berhenti berputar saat ditutup
        if (modalIframe) {
            modalIframe.src = "";
        }
    }
}

// ==========================================
// 2. FUNGSI KADO & PEMUTAR MUSIK LATAR
// ==========================================
function bukaKado() {
    buatHujanBunga();

    const flash = document.getElementById('flash-light');
    if (flash) flash.classList.add('flash-active');

    // --- MULAI MUSIK & MUNCULKAN POP-UP ---
    const bgMusic = document.getElementById('bg-music');
    const musicPopup = document.getElementById('music-popup');

    // Putar musiknya
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Browser memblokir autoplay, tidak masalah.");
        });
    }

    // Munculkan notifikasi pop-up dari bawah layar
    if (musicPopup) {
        setTimeout(() => {
            musicPopup.classList.add('show-music');
        }, 1000);
    }
    // --------------------------------------

    setTimeout(() => {
        const landingPage = document.getElementById('landing-page');
        const mainContent = document.getElementById('main-content');

        if (landingPage) landingPage.style.display = 'none';
        if (mainContent) mainContent.classList.remove('hidden');

        jalankanAnimasiScroll();
    }, 450);
}

function buatHujanBunga() {
    const container = document.getElementById('flower-rain');
    if (!container) return;

    const bungaPilihan = ['🌸', '🌺', '🌷', '✨', '💖'];

    for (let i = 0; i < 40; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        petal.innerText = bungaPilihan[Math.floor(Math.random() * bungaPilihan.length)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        petal.style.animationDelay = (Math.random() * 1) + 's';

        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 6000);
    }
}

// ==========================================
// 3. FUNGSI SENSOR SCROLL & MESIN TIK BERURUTAN
// ==========================================
function jalankanAnimasiScroll() {
    const elemenScroll = document.querySelectorAll('.show-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('is-visible')) {
                    entry.target.classList.add('is-visible');
                    mulaiKetikanBerurutan(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -35% 0px"
    });

    elemenScroll.forEach((el) => observer.observe(el));
}

async function mulaiKetikanBerurutan(slideTarget) {
    const teksKetikan = slideTarget.querySelectorAll('.typing-text');

    await new Promise(resolve => setTimeout(resolve, 3500));

    for (let i = 0; i < teksKetikan.length; i++) {
        const el = teksKetikan[i];
        const teksAsli = el.getAttribute('data-teks');

        if (teksAsli) {
            await ketikTeks(el, teksAsli);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }
}

function ketikTeks(elemen, teks) {
    return new Promise(resolve => {
        let index = 0;
        elemen.innerHTML = '';
        elemen.classList.add('typing-active');

        function ketik() {
            if (index < teks.length) {
                elemen.innerHTML += teks.charAt(index);
                index++;
                setTimeout(ketik, 35);
            } else {
                elemen.classList.remove('typing-active');
                elemen.classList.add('typing-done');
                resolve();
            }
        }

        ketik();
    });
}

// ==========================================
// 4. FUNGSI TOGGLE PLAY/PAUSE MUSIK (SPOTIFY STYLE)
// ==========================================
function toggleMusic() {
    const bgMusic = document.getElementById('bg-music');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().catch(console.error);
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    } else {
        bgMusic.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }
}

// ==========================================
// 5. FUNGSI MENYEMBUNYIKAN POP-UP MUSIK SAAT SCROLL
// ==========================================
function hideMusicPopup() {
    const musicPopup = document.getElementById('music-popup');
    const showMusicBtn = document.getElementById('show-music-btn');
    if (musicPopup) {
        musicPopup.classList.remove('show-music');
    }
    if (showMusicBtn) {
        showMusicBtn.classList.add('show-btn');
    }
}

function showMusicPopup() {
    const musicPopup = document.getElementById('music-popup');
    const showMusicBtn = document.getElementById('show-music-btn');
    if (musicPopup) {
        musicPopup.classList.add('show-music');
    }
    if (showMusicBtn) {
        showMusicBtn.classList.remove('show-btn');
    }
}

// Auto-hide pop-up musik saat user mulai scroll
(function () {
    let sudahDisembunyikan = false;

    window.addEventListener('scroll', function () {
        const musicPopup = document.getElementById('music-popup');

        // Hanya sembunyikan jika pop-up sedang tampil dan belum pernah disembunyikan oleh scroll
        if (!sudahDisembunyikan && musicPopup && musicPopup.classList.contains('show-music')) {
            hideMusicPopup();
            sudahDisembunyikan = true;
        }
    });

    // Reset flag saat pop-up ditampilkan kembali lewat tombol 🎵
    const originalShowMusicPopup = showMusicPopup;
    showMusicPopup = function () {
        sudahDisembunyikan = false;
        originalShowMusicPopup();
    };
    // Pasang ulang ke window agar onclick di HTML tetap berfungsi
    window.showMusicPopup = showMusicPopup;
})();

// ==========================================
// SCRATCH CARD (ERASER EFFECT) + GALLERY UNLOCK LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.scratch-canvas');
    const galleryScroll = document.querySelector('.gallery-scroll');
    const galleryHint = document.getElementById('gallery-hint');
    const gallerySlider = document.getElementById('gallery-slider');
    const gallerySliderThumb = document.getElementById('gallery-slider-thumb');

    const totalCanvases = canvases.length;
    const clearedSet = new Set();
    let galleryUnlocked = false;

    function updateSlider() {
        if (!gallerySliderThumb || !galleryScroll) return;
        const maxScroll = galleryScroll.scrollWidth - galleryScroll.clientWidth;
        if (maxScroll > 0) {
            const scrollPercent = galleryScroll.scrollLeft / maxScroll;
            const trackWidth = gallerySliderThumb.parentElement.clientWidth;
            const thumbWidth = gallerySliderThumb.clientWidth;
            const maxLeft = trackWidth - thumbWidth;
            gallerySliderThumb.style.left = (scrollPercent * maxLeft) + 'px';
        }
    }

    function scrollToCard(cardIndex) {
        if (!galleryScroll) return;
        const cards = galleryScroll.querySelectorAll('.scratch-card');
        if (cardIndex < cards.length) {
            const card = cards[cardIndex];
            // Hitung posisi scroll secara manual agar card berada di tengah container
            // Ini menghindari scrollIntoView yang bisa menggeser seluruh halaman di HP
            const containerWidth = galleryScroll.clientWidth;
            const cardLeft = card.offsetLeft;
            const cardWidth = card.offsetWidth;
            const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);

            // Sementara aktifkan scroll agar bisa geser
            galleryScroll.style.overflowX = 'auto';
            galleryScroll.scrollTo({ left: targetScroll, behavior: 'smooth' });
            // Kunci lagi setelah scroll selesai
            setTimeout(() => {
                if (!galleryUnlocked) {
                    galleryScroll.style.overflowX = 'hidden';
                }
                updateSlider();
            }, 600);
        }
    }

    // Tampilkan slider dari awal
    if (gallerySlider) {
        gallerySlider.classList.add('slider-visible');
    }

    function checkCanvasCleared(canvas, index) {
        if (clearedSet.has(index)) return;

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentCount = 0;
        let sampledCount = 0;

        for (let i = 3; i < pixels.length; i += 8) {
            sampledCount++;
            if (pixels[i] === 0) transparentCount++;
        }

        const ratio = transparentCount / sampledCount;
        if (ratio > 0.45) {
            clearedSet.add(index);
            // Fade out sisa canvas
            canvas.style.transition = 'opacity 0.5s ease';
            canvas.style.opacity = '0';
            setTimeout(() => {
                canvas.style.pointerEvents = 'none';
            }, 500);

            // Update hint
            if (galleryHint) {
                if (totalCanvases > 1) {
                    galleryHint.textContent = '✨ Kenangan ' + clearedSet.size + ' dari ' + totalCanvases + ' terbuka ✨';
                } else {
                    galleryHint.textContent = '✨ Terbuka! ✨';
                }
            }

            // Cek apakah semua sudah dibersihkan
            if (clearedSet.size >= totalCanvases) {
                // Semua selesai — unlock untuk geser bebas
                galleryUnlocked = true;
                if (galleryScroll) {
                    galleryScroll.classList.add('gallery-unlocked');
                    galleryScroll.style.overflowX = 'auto';
                    galleryScroll.style.touchAction = 'pan-x pan-y';
                    // Sync slider saat scroll bebas
                    galleryScroll.addEventListener('scroll', updateSlider);
                }
                if (galleryHint) {
                    if (totalCanvases > 1) {
                        galleryHint.textContent = 'Semua kenangan sudah terbuka! Geser kesamping untuk melihatnya';
                    } else {
                        galleryHint.textContent = 'Semoga suatu saat kita bisa fotbar yaa 🤍';
                    }
                    galleryHint.classList.add('hint-unlocked');
                }
            } else {
                // Auto-scroll ke foto berikutnya
                setTimeout(() => {
                    scrollToCard(index + 1);
                }, 700);
            }
        }
    }

    canvases.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let brushRadius = 25;
        let drawMoveCount = 0;

        setTimeout(() => {
            canvas.width = 220;
            canvas.height = Math.round(220 * 16 / 9);

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < 200; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 1.5,
                    0, Math.PI * 2
                );
                ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,182,193,0.8)';
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'destination-out';

            const startPosition = (e) => {
                isDrawing = true;
                drawMoveCount = 0;
                draw(e);
            };

            const endPosition = () => {
                isDrawing = false;
                ctx.beginPath();
                // Cek setiap kali selesai menggosok
                checkCanvasCleared(canvas, index);
            };

            const draw = (e) => {
                if (!isDrawing) return;

                let clientX, clientY;
                if (e.type.includes('touch')) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const canvasRect = canvas.getBoundingClientRect();
                const x = clientX - canvasRect.left;
                const y = clientY - canvasRect.top;

                ctx.lineWidth = brushRadius * 2;
                ctx.lineCap = 'round';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);

                // Juga cek selama menggosok setiap 15 gerakan
                drawMoveCount++;
                if (drawMoveCount % 15 === 0) {
                    checkCanvasCleared(canvas, index);
                }
            };

            canvas.addEventListener('mousedown', startPosition);
            canvas.addEventListener('mouseup', endPosition);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseleave', endPosition);

            canvas.addEventListener('touchstart', startPosition, { passive: true });
            canvas.addEventListener('touchend', endPosition);
            canvas.addEventListener('touchmove', (e) => {
                if (isDrawing) e.preventDefault();
                draw(e);
            }, { passive: false });

        }, 500);
    });
});

// ==========================================
// FITUR TIUP LILIN 🎂 (Press & Hold)
// ==========================================
let holdTime = 0;
let holdInterval = null;
let holdCurrentStage = 0;
let holdListenersAttached = false;
let holdStartFn = null;
let holdStopFn = null;

const STAGE_1_DURATION = 6000;  // 6 detik untuk tahap 1
const STAGE_2_DURATION = 13000; // 13 detik total (7 detik tambahan) untuk tahap 2

function bukaHalamanLilin() {
    const candlePage = document.getElementById('candle-page');
    if (!candlePage) return;

    // Reset state
    holdTime = 0;
    holdCurrentStage = 0;
    holdListenersAttached = false;

    // Tampilkan halaman
    candlePage.classList.add('active');

    // Buat sparkle background
    buatSparkleBackground(candlePage);

    // Fade in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            candlePage.classList.add('visible');
        });
    });
}

function tutupHalamanLilin() {
    const candlePage = document.getElementById('candle-page');
    const msg = document.getElementById('candle-message');
    const btn = document.getElementById('btn-mulai-tiup');
    const tapHint = document.getElementById('tap-hint');
    const flames = document.querySelectorAll('.candle-flame');
    const progressBar = document.getElementById('hold-progress-bar');
    const progressFill = document.getElementById('hold-progress-fill');
    const cakeContainer = document.querySelector('.cake-container');

    if (!candlePage) return;

    // Stop hold interval
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }

    // Hapus event listeners
    hapusHoldListeners(candlePage);

    // Fade out
    candlePage.classList.remove('visible');

    setTimeout(() => {
        candlePage.classList.remove('active');

        // Reset semua state
        holdTime = 0;
        holdCurrentStage = 0;

        if (msg) {
            msg.textContent = '';
            msg.className = 'candle-message';
            msg.style.marginTop = '';
            msg.style.padding = '';
        }

        if (btn) btn.classList.remove('hidden-btn');

        if (tapHint) {
            tapHint.textContent = '';
            tapHint.className = 'tap-hint';
        }

        if (progressBar) progressBar.classList.remove('show-bar');
        if (progressFill) progressFill.style.width = '0%';
        if (cakeContainer) {
            cakeContainer.classList.remove('holding');
            cakeContainer.style.display = '';
        }

        const envelopeWrapper = document.getElementById('envelope-wrapper');
        const envelopeMain = document.getElementById('envelope-main');
        const envelopePaper = document.getElementById('envelope-paper');
        if (envelopeWrapper) {
            envelopeWrapper.classList.remove('show');
            envelopeWrapper.classList.add('hidden');
        }
        if (envelopeMain) {
            envelopeMain.classList.remove('open', 'hide-body', 'center-paper');
        }
        if (envelopePaper) {
            envelopePaper.innerHTML = '';
        }
        window.cancelTyping = true;

        // Reset api lilin
        flames.forEach(flame => {
            flame.classList.remove('dimming', 'extinguished');
            flame.style.animationDuration = '';
        });

        // Hapus sparkle elements
        const sparkles = candlePage.querySelectorAll('.candle-sparkle');
        sparkles.forEach(s => s.remove());
    }, 800);
}

function hapusHoldListeners(candlePage) {
    if (holdListenersAttached && holdStartFn && holdStopFn) {
        candlePage.removeEventListener('mousedown', holdStartFn);
        candlePage.removeEventListener('mouseup', holdStopFn);
        candlePage.removeEventListener('mouseleave', holdStopFn);
        candlePage.removeEventListener('touchstart', holdStartFn);
        candlePage.removeEventListener('touchend', holdStopFn);
        candlePage.removeEventListener('touchcancel', holdStopFn);
        holdListenersAttached = false;
    }
}

function buatSparkleBackground(container) {
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('candle-sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = (Math.random() * 3) + 's';
        sparkle.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        container.appendChild(sparkle);
    }
}

function mulaiTiupLilin() {
    const btn = document.getElementById('btn-mulai-tiup');
    const tapHint = document.getElementById('tap-hint');
    const candlePage = document.getElementById('candle-page');
    const progressBar = document.getElementById('hold-progress-bar');

    if (!btn || !candlePage) return;

    // Sembunyikan tombol
    btn.classList.add('hidden-btn');

    // Tampilkan progress bar & hint
    if (progressBar) progressBar.classList.add('show-bar');
    if (tapHint) {
        tapHint.textContent = 'Tekan dan tahan layar untuk meniup lilin';
        tapHint.className = 'tap-hint show-hint';
    }

    // Reset hold state
    holdTime = 0;
    holdCurrentStage = 0;

    // Setup hold event listeners
    holdStartFn = function (e) {
        // Jangan proses jika klik tombol kembali
        if (e.target.closest('.btn-back-candle')) return;
        // Jangan proses jika sudah selesai
        if (holdCurrentStage >= 3) return;

        e.preventDefault();
        startHolding();
    };

    holdStopFn = function () {
        if (holdCurrentStage >= 3) return;
        stopHolding();
    };

    candlePage.addEventListener('mousedown', holdStartFn);
    candlePage.addEventListener('mouseup', holdStopFn);
    candlePage.addEventListener('mouseleave', holdStopFn);
    candlePage.addEventListener('touchstart', holdStartFn, { passive: false });
    candlePage.addEventListener('touchend', holdStopFn);
    candlePage.addEventListener('touchcancel', holdStopFn);
    holdListenersAttached = true;
}

function startHolding() {
    const cakeContainer = document.querySelector('.cake-container');
    const tapHint = document.getElementById('tap-hint');

    if (cakeContainer) cakeContainer.classList.add('holding');
    if (tapHint) tapHint.className = 'tap-hint'; // Sembunyikan hint saat menekan

    // Jika belum masuk tahap 1, langsung masuk
    if (holdCurrentStage === 0) {
        holdCurrentStage = 1;
        tampilkanTahap1();
    }

    // Mulai interval untuk menambah holdTime
    if (holdInterval) clearInterval(holdInterval);
    holdInterval = setInterval(() => {
        holdTime += 50;
        updateProgress();
        cekTransisiTahap();
    }, 50);
}

function stopHolding() {
    const cakeContainer = document.querySelector('.cake-container');
    const tapHint = document.getElementById('tap-hint');

    if (cakeContainer) cakeContainer.classList.remove('holding');

    // Stop interval
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }

    // Tampilkan hint untuk menekan lagi (jika belum selesai)
    if (holdCurrentStage > 0 && holdCurrentStage < 3 && tapHint) {
        tapHint.textContent = '🌬️ Tekan dan tahan lagi untuk melanjutkan';
        tapHint.className = 'tap-hint show-hint';
    }
}

function updateProgress() {
    const progressFill = document.getElementById('hold-progress-fill');
    if (!progressFill) return;

    const percent = Math.min((holdTime / STAGE_2_DURATION) * 100, 100);
    progressFill.style.width = percent + '%';
}

function cekTransisiTahap() {
    // Transisi dari tahap 1 ke tahap 2
    if (holdCurrentStage === 1 && holdTime >= STAGE_1_DURATION) {
        holdCurrentStage = 2;
        tampilkanTahap2();
    }

    // Transisi dari tahap 2 ke tahap 3 (selesai)
    if (holdCurrentStage === 2 && holdTime >= STAGE_2_DURATION) {
        holdCurrentStage = 3;
        stopHolding();
        tampilkanTahap3();
    }
}

function tampilkanTahap1() {
    const msg = document.getElementById('candle-message');
    const flames = document.querySelectorAll('.candle-flame');

    if (msg) {
        msg.textContent = 'Lilin mulai ditiup...';
        msg.className = 'candle-message show-msg';
    }

    // Api bergoyang lebih kencang tapi belum mati
    flames.forEach(flame => {
        flame.style.animationDuration = '0.15s';
    });
}

function tampilkanTahap2() {
    const msg = document.getElementById('candle-message');
    const flames = document.querySelectorAll('.candle-flame');

    if (msg) {
        msg.className = 'candle-message'; // fade out dulu
        setTimeout(() => {
            msg.textContent = 'Make a wish, Berdoa dulu yaa.. ';
            msg.className = 'candle-message show-msg';
        }, 400);
    }

    // Api mulai redup
    flames.forEach(flame => {
        flame.classList.add('dimming');
    });
}

function tampilkanTahap3() {
    const msg = document.getElementById('candle-message');
    const tapHint = document.getElementById('tap-hint');
    const flames = document.querySelectorAll('.candle-flame');
    const candlePage = document.getElementById('candle-page');
    const progressBar = document.getElementById('hold-progress-bar');

    // Sembunyikan hint & progress
    if (tapHint) {
        tapHint.textContent = '';
        tapHint.className = 'tap-hint';
    }
    if (progressBar) {
        setTimeout(() => { progressBar.classList.remove('show-bar'); }, 500);
    }

    // Fade out pesan sebelumnya
    if (msg) msg.className = 'candle-message';

    // Matikan api satu per satu
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.remove('dimming');
            flame.classList.add('extinguished');
        }, index * 400);
    });

    // Setelah semua api mati
    setTimeout(() => {
        buatConfetti();

        setTimeout(() => {
            const cakeContainer = document.querySelector('.cake-container');
            const envelopeWrapper = document.getElementById('envelope-wrapper');
            const envelopeMain = document.getElementById('envelope-main');
            const envelopePaper = document.getElementById('envelope-paper');

            if (cakeContainer) cakeContainer.style.display = 'none';

            if (envelopeWrapper && envelopeMain && envelopePaper) {
                // Initialize empty paragraphs for typing animation
                envelopePaper.innerHTML = '<p id="env-p1" style="font-size:1.5em;font-weight:bold;margin-bottom:15px;text-align:center;min-height:1.5em;"></p>' +
                    '<p id="env-p2" style="margin-bottom:15px;text-align:center;line-height:1.5;min-height:1.5em;"></p>' +
                    '<p id="env-p3" style="text-align:center;line-height:1.5;min-height:1.5em;"></p>';

                envelopeWrapper.classList.remove('hidden');
                // Trigger reflow
                void envelopeWrapper.offsetWidth;
                envelopeWrapper.classList.add('show');
                window.cancelTyping = false;

                // Animate opening after a short delay
                setTimeout(() => {
                    if (window.cancelTyping) return;
                    envelopeMain.classList.add('open');

                    // After paper slides out, hide the envelope body and center paper
                    setTimeout(() => {
                        if (window.cancelTyping) return;
                        envelopeMain.classList.add('hide-body', 'center-paper');

                        // Wait for centering animation to finish (approx 1.2s), then start typing
                        setTimeout(() => {
                            if (window.cancelTyping) return;
                            const p1Chars = Array.from("HAPPY BIRTHDAY");
                            const p2Chars = Array.from("hari ini kamu ulang tahun ya selamat bertambah usia sehat selalu, panjang umur makin sabar lagi ya hehe doa terbaik untukmu semoga di umur sekarang semesta berpihak ya sama kamu semoga bisa dapetin hal yang selama ini di perjuangin, semoga bahagia dan semoga itu selamanya my best wishes for you.");
                            const p3Chars = Array.from("aku mau ngomong ini sebenarnya dari lama tapi aku baru berani bilang nya hari ini pas dihari ulang tahunmu aku mau bilang SEBENARNYA AKU SUKA SAMA KAMU, kamuu mau gk jadi pacarku?🤍🥰");

                            function typeArray(id, chars, idx, speed, cb) {
                                if (window.cancelTyping) return;
                                const el = document.getElementById(id);
                                if (!el) return;
                                if (idx < chars.length) {
                                    el.innerHTML += chars[idx];
                                    if (envelopePaper) envelopePaper.scrollTop = envelopePaper.scrollHeight; // Auto-scroll while typing
                                    setTimeout(() => typeArray(id, chars, idx + 1, speed, cb), speed);
                                } else {
                                    if (cb) cb();
                                }
                            }

                            typeArray('env-p1', p1Chars, 0, 70, () => {
                                setTimeout(() => {
                                    typeArray('env-p2', p2Chars, 0, 40, () => {
                                        setTimeout(() => {
                                            typeArray('env-p3', p3Chars, 0, 50, null);
                                        }, 400);
                                    });
                                }, 400);
                            });
                        }, 1200);
                    }, 2000);
                }, 1000);
            }
        }, 6000);
    }, flames.length * 400 + 500);

    // Hapus event listeners karena sudah selesai
    if (candlePage) hapusHoldListeners(candlePage);
}

function buatConfetti() {
    const colors = [
        '#ff6b81', '#ffb6c1', '#a55eea', '#6c5ce7', '#ffd700',
        '#ff9ff3', '#f368e0', '#ffffff', '#00d2d3', '#ff6348',
        '#7bed9f', '#ffa502', '#ff4757', '#2ed573', '#eccc68',
        '#ff7eb3', '#c56cf0', '#17c0eb', '#ffc312'
    ];
    const shapes = ['circle', 'rect', 'star', 'heart', 'ribbon'];
    const animStyles = ['', 'confetti-swirl', 'confetti-zigzag'];

    function burstWave(count, delayBase) {
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');

            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const animStyle = animStyles[Math.floor(Math.random() * animStyles.length)];
            const size = 5 + Math.random() * 10;

            if (animStyle) confetti.classList.add(animStyle);

            if (shape === 'star') {
                confetti.classList.add('confetti-star');
                confetti.textContent = '⭐';
                confetti.style.fontSize = (10 + Math.random() * 8) + 'px';
            } else if (shape === 'heart') {
                confetti.classList.add('confetti-heart');
                confetti.textContent = '💖';
                confetti.style.fontSize = (8 + Math.random() * 8) + 'px';
            } else if (shape === 'ribbon') {
                confetti.classList.add('confetti-ribbon');
                confetti.style.width = (3 + Math.random() * 4) + 'px';
                confetti.style.height = (14 + Math.random() * 12) + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '1px';
            } else if (shape === 'rect') {
                confetti.style.width = size + 'px';
                confetti.style.height = (size * 0.5) + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '2px';
            } else {
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '50%';
            }

            // Wider spread across the entire screen
            confetti.style.left = (5 + Math.random() * 90) + 'vw';
            confetti.style.top = '-15px';
            confetti.style.animationDuration = (2.5 + Math.random() * 3) + 's';
            confetti.style.animationDelay = (delayBase + Math.random() * 1.2) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 8000 + delayBase * 1000);
        }
    }

    // Gelombang 1: Ledakan utama
    burstWave(60, 0);

    // Gelombang 2: Ledakan kedua setelah 0.8 detik
    setTimeout(() => burstWave(50, 0), 800);

    // Gelombang 3: Hujan confetti lanjutan
    setTimeout(() => burstWave(40, 0), 2000);
}
<<<<<<< HEAD

// ==========================================
// 8. MUSIK PLAYLIST LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    if (!bgMusic) return;

    const albumCover = document.getElementById('album-cover');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');

    const playlist = [
        {
            src: "audio/Magnolia Celebration - Magnolia Lyrics.mp3",
            title: "Magnolia",
            artist: "Magnolia Celebration",
            cover: "img/so.jpeg"
        },
        {
            src: "audio/About-You.mp3",
            title: "About You",
            artist: "The 1975",
            cover: "img/so.jpeg" 
        }
    ];

    let currentSongIndex = 0;

    bgMusic.addEventListener('ended', () => {
        currentSongIndex++;
        // Kalo udah abis lagunya, ulang dari pertama
        if (currentSongIndex >= playlist.length) {
            currentSongIndex = 0;
        }

        const nextSong = playlist[currentSongIndex];
        
        // Ubah source lagu
        const sourceElement = bgMusic.querySelector('source');
        if (sourceElement) {
            sourceElement.src = nextSong.src;
        } else {
            bgMusic.src = nextSong.src;
        }
        
        bgMusic.load(); // Load the new track

        // Ubah text popup
        if (songTitle) songTitle.textContent = nextSong.title;
        if (artistName) artistName.textContent = nextSong.artist;
        if (albumCover) albumCover.src = nextSong.cover;

        // Auto play the next track
        bgMusic.play().catch(console.error);

        // Pastikan icon play/pause disesuaikan jika lagu berlanjut
        const iconPlay = document.getElementById('icon-play');
        const iconPause = document.getElementById('icon-pause');
        if (iconPlay && iconPause) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }
    });
});
=======
>>>>>>> e71b2d0de1fa701f5030e512b50915c50387616e
