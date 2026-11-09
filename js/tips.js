const translations = {
    en: {
        title: 'Typing Tips & Health',
        theme_toggle: 'Theme Toggle',
        language_toggle: 'العربية',
        back_prompt: 'Ready to go back?',
        back_link: 'Back to typing',
        sec1_title: '1. How to Type Faster',
        sec1_1: '<strong>Master the Home Row:</strong> Rest your fingers on A S D F and J K L ;. Always return to this position.',
        sec1_2: "<strong>Don't Look at Your Hands:</strong> Looking at the keyboard breaks your muscle memory. Trust your fingers and look only at the screen.",
        sec1_3: '<strong>Focus on Accuracy:</strong> Speed means nothing if you have to backspace every other word. Slow down and aim for 100% accuracy first.',
        sec1_4: '<strong>Use Rhythm, Not Bursts:</strong> Try to type at a steady, even pace. Smooth typing is faster than typing in jerky, unpredictable bursts.',
        sec2_title: '2. How to Type Healthier (Ergonomics)',
        sec2_1: '<strong>Straight Wrists:</strong> Keep your wrists flat and floating, not resting on the desk or bending up/down.',
        sec2_2: '<strong>Posture:</strong> Sit up straight with your back against the chair. Adjust your screen so it is at eye level.',
        sec2_3: '<strong>Relax Your Shoulders:</strong> Tension in your shoulders travels down to your fingers. Take a deep breath and drop your shoulders.',
        sec2_4: "<strong>Light Touch:</strong> You don't need to smash the keys. Use a light, gentle touch for speed and finger health.",
        sec3_title: '3. The 20-20-20 Rule',
        sec3_1: '<strong>Rest Your Eyes:</strong> Every 20 minutes, look at something 20 feet away for 20 seconds.',
        sec3_2: '<strong>Stretch:</strong> Periodically stretch your fingers, hands, and forearms to prevent carpal tunnel syndrome.'
    },
    ar: {
        title: 'نصائح الكتابة والصحة',
        theme_toggle: 'تبديل السمة',
        language_toggle: 'English',
        back_prompt: 'هل أنت مستعد للعودة؟',
        back_link: 'العودة إلى الكتابة',
        sec1_title: '١. كيف تكتب بشكل أسرع',
        sec1_1: '<strong>إتقان صف الوسط:</strong> ضع أصابعك على مفاتيح الارتكاز (A S D F) و (J K L ;). عُد دائماً إلى هذا الوضع بعد كل ضغطة.',
        sec1_2: '<strong>لا تنظر إلى يديك:</strong> إطالة النظر إلى لوحة المفاتيح تعيق بناء ذاكرتك العضلية. ثق بأصابعك وانظر إلى الشاشة فقط.',
        sec1_3: '<strong>التركيز على الدقة:</strong> السرعة لا تعني شيئاً إذا كنت تضطر للتراجع عن كل كلمة. تمهّل واهدِف إلى دقة ١٠٠٪ أولاً.',
        sec1_4: '<strong>استخدم الإيقاع وليس الاندفاع:</strong> حاول الكتابة بوتيرة ثابتة ومتوازنة. الكتابة بسلاسة أسرع بكثير من الاندفاع المتقطع.',
        sec2_title: '٢. كيف تكتب بصحة أفضل (بيئة العمل)',
        sec2_1: '<strong>استقامة المعصمين:</strong> حافظ على معصميك مستويين وغير مستندين على المكتب أو منحنيين.',
        sec2_2: '<strong>وضعية الجلوس:</strong> اجلس مستقيماً وظهرك مستند إلى الكرسي. اضبط الشاشة لتكون عند مستوى عينيك.',
        sec2_3: '<strong>أرخِ كتفيك:</strong> التوتر في كتفيك ينتقل إلى أصابعك. خذ نفساً عميقاً وأرخِ كتفيك.',
        sec2_4: '<strong>لمسة خفيفة:</strong> لا تحتاج إلى ضرب المفاتيح بقوة. استخدم لمسة خفيفة ولطيفة للسرعة وصحة الأصابع.',
        sec3_title: '٣. قاعدة ٢٠-٢٠-٢٠',
        sec3_1: '<strong>أرح عينيك:</strong> كل ٢٠ دقيقة، انظر إلى شيء على بعد ٢٠ قدماً لمدة ٢٠ ثانية.',
        sec3_2: '<strong>التمدد:</strong> قم بتمديد أصابعك ويديك وساعديك بشكل دوري للوقاية من مشاكل المفاصل.'
    }
};

let currentLanguage = 'en';
const tipsContent = document.getElementById('tips-content');
const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');

function setLanguage(lang) {
    currentLanguage = translations[lang] ? lang : 'en';
    document.documentElement.lang = currentLanguage;
    tipsContent.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('font-arabic', currentLanguage === 'ar');

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.innerHTML = translations[currentLanguage][element.dataset.i18n];
    });
}

function applySavedTheme() {
    const isLightMode = localStorage.getItem('theme') === 'light';
    document.body.classList.toggle('light-mode', isLightMode);
}

function updateImageSources() {
    const isLightMode = document.body.classList.contains('light-mode');

    document.querySelectorAll('img[data-light]').forEach((image) => {
        image.src = isLightMode ? image.dataset.light : image.dataset.dark;
    });
}

function toggleTheme() {
    const isLightMode = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    document.body.classList.add('tips-theme-changing');
    updateImageSources();
    window.setTimeout(() => {
        document.body.classList.remove('tips-theme-changing');
    }, 300);
}

themeToggle.addEventListener('click', toggleTheme);
languageToggle.addEventListener('click', () => {
    document.body.classList.add('tips-language-changing');
    setLanguage(currentLanguage === 'en' ? 'ar' : 'en');
    window.setTimeout(() => {
        document.body.classList.remove('tips-language-changing');
    }, 300);
});

applySavedTheme();
setLanguage('en');
updateImageSources();
