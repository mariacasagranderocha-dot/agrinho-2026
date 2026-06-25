// Modal da calculadora
const btnCalc = document.querySelector('.btn-calculator');
const modal = document.getElementById('modal-calculator');
const modalClose = modal.querySelector('.modal-close');

function openModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // foco no primeiro input para acessibilidade
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
}
function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    btnCalc.focus();
}

btnCalc.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // fecha ao clicar fora do conteúdo
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// Lógica da "Calculadora de Impacto"
const form = document.getElementById('calc-form');
const resultBox = document.getElementById('calc-result');

function formatNumber(n){
    return Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const areaInput = document.getElementById('area');
    const emissaoInput = document.getElementById('emissao');

    const area = parseFloat(areaInput.value);
    const emissao = parseFloat(emissaoInput.value);

    // Validação básica além do required
    if (isNaN(area) || area <= 0) {
        resultBox.textContent = 'Insira uma área válida (> 0).';
        areaInput.focus();
        return;
    }
    if (isNaN(emissao) || emissao < 0) {
        resultBox.textContent = 'Insira um valor de emissão válido (>= 0).';
        emissaoInput.focus();
        return;
    }

    // Cálculo exemplo: emissão total = área · emissão por ha
    const emissaoTotal = area * emissao; // toneladas CO₂

    // Estimativas adicionais (exemplos): custo estimado de mitigação, plantio de árvores
    const custoPorTon = 10; // valor hipotético em moeda local por tonelada
    const custoMitigacao = emissaoTotal * custoPorTon;

    const arvoresPorTon = 0.05; // número hipotético de árvores necessárias por tonelada/ano
    const arvoresNecessarias = emissaoTotal * arvoresPorTon;

    resultBox.innerHTML = `Emissão total estimada: ${formatNumber(emissaoTotal)} ton CO₂<br>` +
                          `Custo estimado de mitigação: R$ ${formatNumber(custoMitigacao)}<br>` +
                          `Árvores necessárias/ano (estimativa): ${formatNumber(arvoresNecessarias)}`;
});

// Acessibilidade: manter foco trap dentro do modal quando aberto
modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || modal.classList.contains('hidden')) return;
    const focusable = modal.querySelectorAll('a, button, input, textarea, select');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// Exemplo: botão de menu mobile simples (abre/fecha nav)
const btnMenu = document.querySelector('.btn-menu');
const nav = document.querySelector('nav');
if (btnMenu){
    btnMenu.addEventListener('click', () => {
        const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
        btnMenu.setAttribute('aria-expanded', String(!expanded));
        nav.style.display = expanded ? '' : 'flex';
    });
}
