document.addEventListener('DOMContentLoaded', () => {
    // 1. INJEÇÃO DINÂMICA DO MODAL DA CALCULADORA (Garante que funcione em qualquer HTML)
    if (!document.getElementById('modal-calculator')) {
        const modalHTML = `
            <div id="modal-calculator" class="modal hidden" role="dialog" aria-modal="true" aria-hidden="true">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Fechar modal">✕</button>
                    <h3>Calculadora de Impacto Ambiental</h3>
                    <p class="modal-subtitle">Estime a redução de CO₂ ao adotar práticas sustentáveis.</p>
                    
                    <form id="calc-form">
                        <div class="form-group">
                            <label for="calc-area">Área de Cultivo (Hectares)</label>
                            <input type="number" id="calc-area" min="1" step="any" placeholder="Ex: 100" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="calc-pratica">Prática Sustentável</label>
                            <select id="calc-pratica" required>
                                <option value="0.4">Plantio Direto (Evita ~0.4 ton de CO₂/ha)</option>
                                <option value="0.6">Integração Lavoura-Pecuária-Floresta (Evita ~0.6 ton de CO₂/ha)</option>
                                <option value="0.3">Uso de Bioinsumos (Evita ~0.3 ton de CO₂/ha)</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn-submit">Calcular Impacto</button>
                    </form>
                    
                    <div id="calc-result" class="calc-result hidden" aria-live="polite"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 2. SELEÇÃO DE ELEMENTOS
    const modal = document.getElementById('modal-calculator');
    const modalClose = modal.querySelector('.modal-close');
    const calcForm = document.getElementById('calc-form');
    const calcResult = document.getElementById('calc-result');
    const btnMenu = document.querySelector('.btn-menu');
    const navMenu = document.getElementById('nav-menu');

    // 3. CONTROLE DO MODAL (ABRIR E FECHAR)
    function openModal() {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Bloqueia o scroll do fundo
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Libera o scroll
        calcForm.reset();
        calcResult.classList.add
