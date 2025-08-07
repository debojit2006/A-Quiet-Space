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
        "You’re not just studying Computer Science, you’re rewriting your own future with every line of code.",
        "I see how hard you work, and it inspires me every single day.",
        "You carry so much strength in your silence and so much fire in your focus.",
        "Behind every sleepless night, there's a brighter tomorrow waiting just for you.",
        "Your dedication isn’t ordinary—it’s rare, powerful, and beautiful.",
        "The world needs more minds like yours—sharp, sincere, and kind.",
        "Keep going, even when it’s tough—you're closer to your goals than you think.",
        "Your grind today is the glow-up the future will thank you for.",
        "You might feel overwhelmed now, but one day you’ll look back and smile at how far you’ve come.",
        "I know it’s not easy, but I also know you were never meant for the easy path—you were made for greatness.",
        "You're not just studying code, you're building the foundation for your dreams.",
        "Every bug you fix, every concept you master is one more proof of how capable you are.",
        "Don’t let stress make you forget how brilliant you are.",
        "Even on your worst days, you’re doing more than enough.",
        "The late nights, the frustration, the doubt—it’s all part of your powerful journey.",
        "I know it’s exhausting sometimes, but you’re stronger than anything life throws at you.",
        "You’re not behind—you’re blooming in your own time.",
        "It's okay to rest, but never forget the fire that made you start.",
        "You’ve come too far to not be proud of yourself.",
        "There’s something extraordinary about the way you never give up.",
        "Not everyone sees how hard you work—but I do, and it amazes me.",
        "You’re writing your own success story—one challenge at a time.",
        "Your ambition is magnetic, and your energy is something rare.",
        "You’re the kind of person who turns stress into strength.",
        "The way you manage everything—even when it's hard—is a quiet kind of heroism.",
        "Your mind is powerful, but your heart makes it even more incredible.",
        "Remember: pressure turns coal into diamonds—and you’re already sparkling.",
        "You’re not just going through it—you’re growing through it.",
        "If only you could see yourself through my eyes—you'd see someone unstoppable.",
        "There’s magic in your persistence. Don’t ever let it fade.",
        "You’ve got the kind of grit that changes lives—starting with your own.",
        "Take breaks, but never break down—you’re too brilliant to quit.",
        "I believe in your journey, even on the days you don’t.",
        "You’re not meant to be perfect—only persistent.",
        "When you’re tired, let your dreams rest—but never let them die.",
        "There’s no shortcut to success, but I see you building the whole road yourself.",
        "You’re not behind—you’re learning what most never dare to.",
        "The hard work you’re doing today is shaping a life full of possibilities.",
        "Some people study; you transform every lesson into power.",
        "No algorithm can calculate the brilliance of your determination.",
        "Even machines would admire your logic and your heart.",
        "Your strength is not in always having the answers, but in never being afraid to seek them.",
        "I know you’re tired, but that spark in your eyes is still there.",
        "You’re a storm of intelligence, kindness, and resilience.",
        "Keep showing up, even when it’s hard—especially then.",
        "What you’re building matters. You matter.",
        "When things get hard, remember who you are and why you started.",
        "I’m proud of your ambition and grateful to know someone so driven.",
        "Your dreams aren’t just dreams—they’re blueprints for a future only you can build.",
        "Keep being you—brilliant, hardworking, and truly one of a kind."
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
