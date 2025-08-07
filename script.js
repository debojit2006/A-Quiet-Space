document.addEventListener('DOMContentLoaded', () => {

    // --- STATE ---
    let activeFeature = null;
    let breathingInterval = null;
    let nightSkyInterval = null;

    // --- DOM ELEMENTS ---
    const featureBtns = document.querySelectorAll('.feature-btn');
    const initialMessage = document.getElementById('initial-message');
    const breathingFeature = document.getElementById('breathing-feature');
    const kindWordsFeature = document.getElementById('kind-words-feature');
    const appContainer = document.querySelector('.app-container');

    // --- FEATURE: BREATHING ANIMATION ---
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingInstructions = document.getElementById('breathing-instructions');

    // --- FEATURE: KIND WORDS ---
    const kindWordText = document.getElementById('kind-word-text');
    const anotherWordBtn = document.getElementById('another-word-btn');
    const kindWords = [
        "You are stronger than you know.", "This moment will pass, and you will be okay.", "You deserve peace and happiness.", "Your feelings are valid and you are not alone.", "Every small step forward is progress.", "You are enough, exactly as you are.", "Tomorrow is a fresh start with new possibilities.", "Your presence makes the world a little brighter.", "It's okay to rest. You don't have to carry everything today.", "You have survived difficult moments before, and you will again."
    ];
    let currentWordIndex = 0;
    
    // --- RENDER FUNCTION ---
    function render() {
        // Hide all features first
        initialMessage.classList.add('hidden');
        breathingFeature.classList.add('hidden');
        kindWordsFeature.classList.add('hidden');
        stopBreathingAnimation();
        stopNightSky();
        
        // Reset button styles
        featureBtns.forEach(btn => btn.classList.remove('active'));

        // Show the active feature
        if (activeFeature) {
            const activeBtn = document.querySelector(`.feature-btn[data-feature="${activeFeature}"]`);
            if(activeBtn) activeBtn.classList.add('active');

            if (activeFeature === 'breathing') {
                breathingFeature.classList.remove('hidden');
                startBreathingAnimation();
            } else if (activeFeature === 'words') {
                kindWordsFeature.classList.remove('hidden');
                showNewKindWord();
            } else if (activeFeature === 'sky') {
                startNightSky();
            } else {
                initialMessage.classList.remove('hidden');
            }
        } else {
            initialMessage.classList.remove('hidden');
        }
    }
    
    // --- EVENT LISTENERS ---
    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.dataset.feature;
            activeFeature = activeFeature === feature ? null : feature;
            render();
        });
    });

    anotherWordBtn.addEventListener('click', () => {
        if (anotherWordBtn.classList.contains('refreshing')) return;
        
        anotherWordBtn.classList.add('refreshing');
        showNewKindWord();

        setTimeout(() => {
           anotherWordBtn.classList.remove('refreshing');
        }, 500);
    });

    // --- BREATHING LOGIC ---
    function startBreathingAnimation() {
        if (breathingInterval) clearInterval(breathingInterval);
        const cycle = [
            { phase: 'inhale', text: 'Breathe in slowly...', scale: 1.5, duration: 4000 },
            { phase: 'hold', text: 'Hold...', scale: 1.5, duration: 2000 },
            { phase: 'exhale', text: 'Breathe out gently...', scale: 0.8, duration: 6000 },
            { phase: 'pause', text: 'Rest...', scale: 0.8, duration: 2000 },
        ];
        let currentPhaseIndex = 0;

        const runCycle = () => {
            const current = cycle[currentPhaseIndex];
            
            // Animate text fade
            breathingInstructions.classList.add('fade-out');
            setTimeout(() => {
                breathingInstructions.textContent = current.text;
                breathingInstructions.classList.remove('fade-out');
            }, 500);

            // Animate circle scale
            breathingCircle.style.transitionDuration = `${current.duration / 1000}s`;
            breathingCircle.style.transform = `scale(${current.scale})`;
            
            currentPhaseIndex = (currentPhaseIndex + 1) % cycle.length;
        };

        runCycle(); // Run immediately
        
        let cumulativeTime = 0;
        const totalCycleTime = cycle.reduce((sum, p) => sum + p.duration, 0);

        function schedulePhases() {
            cumulativeTime = 0;
            cycle.forEach(phase => {
                setTimeout(runCycle, cumulativeTime);
                cumulativeTime += phase.duration;
            });
        }
        
        schedulePhases(); // Run the first full cycle
        breathingInterval = setInterval(schedulePhases, totalCycleTime); // Repeat every full cycle
    }


    function stopBreathingAnimation() {
        clearInterval(breathingInterval);
        breathingInterval = null;
        breathingInstructions.textContent = 'Find your rhythm';
        breathingCircle.style.transform = 'scale(1)';
    }
    
    // --- KIND WORDS LOGIC ---
    function showNewKindWord() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * kindWords.length);
        } while (newIndex === currentWordIndex && kindWords.length > 1);
        currentWordIndex = newIndex;

        kindWordText.style.opacity = 0;
        kindWordText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            kindWordText.textContent = kindWords[currentWordIndex];
            kindWordText.style.opacity = 1;
            kindWordText.style.transform = 'translateY(0)';
        }, 300);
    }

    // --- NIGHT SKY LOGIC ---
    function startNightSky() {
        if (document.querySelector('.night-sky-container')) return; // Already running

        const sky = document.createElement('div');
        sky.className = 'night-sky-container';
        
        // Create twinkling stars
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.7 + 0.3;
            star.className = 'star';
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--start-opacity', opacity);
            star.style.animationDuration = `${3 + Math.random() * 2}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            sky.appendChild(star);
        }
        appContainer.prepend(sky);
        
        // Create shooting stars
        nightSkyInterval = setInterval(() => {
            const shootingStar = document.createElement('div');
            const startX = Math.random() * 100;
            const startY = Math.random() * 30;
            const endX = (startX + (Math.random() * 20 - 10)); // travel some horiz dist
            const endY = (startY + 40 + Math.random() * 30); // travel mostly down
            const endTranslate = `translate(${(endX - startX) * window.innerWidth / 100}px, ${(endY - startY) * window.innerHeight / 100}px)`;

            shootingStar.className = 'shooting-star';
            shootingStar.style.left = `${startX}%`;
            shootingStar.style.top = `${startY}%`;
            shootingStar.style.setProperty('--translate-end', endTranslate);
            shootingStar.style.animationDuration = `${1.5 + Math.random()}s`;
            sky.appendChild(shootingStar);
            
            // Remove after animation
            setTimeout(() => {
                shootingStar.remove();
            }, 3000);
        }, 8000);
    }

    function stopNightSky() {
        const sky = document.querySelector('.night-sky-container');
        if (sky) sky.remove();
        clearInterval(nightSkyInterval);
        nightSkyInterval = null;
    }

    // Initial Render
    render();
});
