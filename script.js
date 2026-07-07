// Scroll suave para seções
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Links do menu com scroll suave
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        scrollToSection(target);
    });
});

// Contador animado
const counters = document.querySelectorAll('.counter');
let counterStarted = false;

function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
        current += step;
        if (current < target) {
            counter.innerText = Math.ceil(current).toLocaleString('pt-BR');
            requestAnimationFrame(update);
        } else {
            counter.innerText = target.toLocaleString('pt-BR');
        }
    };
    update();
}

// Detecta quando a seção do contador entra na tela
const counterSection = document.querySelector('.counter-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            counters.forEach(animateCounter);
        }
    });
}, { threshold: 0.5 });

observer.observe(counterSection);

// Quiz de Sustentabilidade
const questions = [
    {
        question: "Qual é o principal objetivo da sustentabilidade?",
        options: [
            "Aumentar o consumo",
            "Atender necessidades atuais sem comprometer as futuras gerações",
            "Parar todo desenvolvimento",
            "Usar apenas produtos importados"
        ],
        correct: 1
    },
    {
        question: "O que significa reciclar?",
        options: [
            "Jogar tudo no lixo comum",
            "Queimar o lixo",
            "Transformar materiais usados em novos produtos",
            "Enterrar o lixo"
        ],
        correct: 2
    },
    {
        question: "Qual dessas atitudes ajuda a economizar água?",
        options: [
            "Tomar banhos demorados",
            "Deixar a torneira aberta ao escovar os dentes",
            "Reaproveitar água da máquina de lavar",
            "Lavar a calçada com mangueira"
        ],
        correct: 2
    },
    {
        question: "O que são os 3 pilares da sustentabilidade?",
        options: [
            "Água, fogo e terra",
            "Ambiental, social e econômico",
            "Casa, escola e trabalho",
            "Ar, solo e mar"
        ],
        correct: 1
    },
    {
        question: "Qual energia é considerada renovável?",
        options: [
            "Petróleo",
            "Carvão",
            "Energia Solar",
            "Gás natural"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question').innerText = q.question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });
    
    document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(index, btn) {
    const q = questions[currentQuestion];
    const allBtns = document.querySelectorAll('.option-btn');
    
    allBtns.forEach(b => b.disabled = true);
    
    if (index === q.correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        allBtns[q.correct].classList.add('correct');
    }
    
    document.getElementById('next-btn').style.display = 'inline-block';
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('score').innerText = score;
    document.getElementById('total').innerText = questions.length;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    loadQuestion();
}

// Inicia o quiz
loadQuestion();

// Animação ao rolar a página
const animatedSections = document.querySelectorAll('.card, .tip-item');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

animatedSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
});
