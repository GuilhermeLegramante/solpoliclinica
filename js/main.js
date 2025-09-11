// utils.js
// ----------------------
// Seletores rápidos
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Formatação de telefone
function formatPhone(number) {
    const digits = number.replace(/\D/g, '');
    if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return number;
}

function formatPartnerPhone(number) {
    const digits = number.replace(/\D/g, '');
    if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return number;
}

// ----------------------
// Menu mobile
function initMobileMenu() {
    $('#menuBtn').addEventListener('click', () => $('#mobileMenu').classList.toggle('hidden'));
}

// ----------------------
// Footer dinâmico
function setFooterYear() {
    $('#yearCopy').textContent = new Date().getFullYear();
}

function setYearsInMarket(startYears = 12) {
    const foundingYear = new Date().getFullYear() - startYears;
    const anos = Math.max(startYears, new Date().getFullYear() - foundingYear);
    $('#anosMercado').textContent = anos;
}

// ----------------------
// Cookie Banner
function initCookieBanner(cookieKey = 'solpoliclinica_cookie_consent_v1') {
    const saved = localStorage.getItem(cookieKey);
    if (!saved) $('#cookieBanner').classList.remove('hidden');

    $('#cookieAccept').addEventListener('click', () => {
        localStorage.setItem(cookieKey, 'accepted');
        $('#cookieBanner').classList.add('hidden');
    });
    $('#cookieDecline').addEventListener('click', () => {
        localStorage.setItem(cookieKey, 'declined');
        $('#cookieBanner').classList.add('hidden');
    });
}

function generateContactButtons(contatos) {
    const buttons = [];

    if (!contatos) return buttons;

    // WhatsApp
    if (contatos.whatsapp) {
        buttons.push(
            `<a href="https://wa.me/${contatos.whatsapp.replace(/\D/g, '')}" target="_blank" 
                class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.97L0 24l6.24-1.63A11.9 11.9 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.18-3.48-8.52zM12 22a9.9 9.9 0 0 1-5.06-1.37l-.36-.21-3.7.97.99-3.61-.23-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10a9.94 9.94 0 0 1 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.12-7.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.19.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.19-.27.3-.45.1-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34s-.95.93-.95 2.27.98 2.63 1.12 2.8c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.65.21 1.23.18 1.69.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"/>
                </svg>
                ${formatPhone(contatos.whatsapp)}
            </a>`
        );
    }

    // Telefones
    if (contatos.telefone) {
        const phones = Array.isArray(contatos.telefone) ? contatos.telefone : [contatos.telefone];
        phones.forEach(t => {
            buttons.push(
                `<a href="tel:${t.replace(/\D/g, '')}" 
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.093 15.093 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    ${formatPhone(t)}
                </a>`
            );
        });
    }

    return buttons;
}


// ----------------------
// Equipe
async function loadTeam() {
    const teamGrid = $('#teamGrid');
    const emptyState = $('#emptyState');
    const filterCategory = $('#filterCategory');
    const searchName = $('#searchName');

    try {
        const res = await fetch('data/professionals.json');
        const data = await res.json();
        const team = data.profissionais || [];

        // Popular categorias únicas
        const categories = Array.from(new Set(team.map(p => p.categoria))).sort();
        for (const c of categories) {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            filterCategory.appendChild(opt);
        }

        function cardTemplate(p) {
            const photo = p.foto || 'https://via.placeholder.com/600x400?text=Profissional';

            const contactButtons = generateContactButtons(p.contatos);

            return `<article class="group bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:-translate-y-0.5 transition">
                        <div class="relative w-full overflow-hidden rounded-xl shadow-soft bg-white">
                            <img src="${photo}" alt="${p.nome}" class="w-full max-h-64 mx-auto object-contain rounded-xl"/>
                            <span class="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200">
                                ${p.categoria}
                            </span>
                        </div>
                        <div class="p-5">
                            <h3 class="text-lg font-semibold text-brand.ink">${p.nome}</h3>
                            <p class="mt-1 text-sm text-slate-600">${p.sobre || ''}</p>
                            <div class="mt-4 flex flex-wrap gap-2">${contactButtons.join('')}</div>
                        </div>
                    </article>`;
        }

        function render() {
            const q = searchName.value.trim().toLowerCase();
            const cat = filterCategory.value;
            const filtered = team.filter(p => (!q || p.nome.toLowerCase().includes(q)) && (!cat || p.categoria === cat));
            teamGrid.innerHTML = filtered.map(cardTemplate).join('');
            emptyState.classList.toggle('hidden', filtered.length !== 0);
        }

        searchName.addEventListener('input', render);
        filterCategory.addEventListener('change', render);
        render();

    } catch (err) {
        console.error('Erro ao carregar dados da equipe:', err);
    }
}

// ----------------------
// Parceiros
async function loadPartners() {
    const partnersGrid = $('#partnersGrid');
    const partnersEmpty = $('#partnersEmpty');
    const filterPartnerCategory = $('#filterPartnerCategory');
    const searchPartner = $('#searchPartner');

    let partners = [];

    try {
        const res = await fetch('data/partners.json');
        const data = await res.json();
        partners = data.partners || [];

        const partnerCategories = Array.from(new Set(partners.map(p => p.categoria))).sort();
        for (const c of partnerCategories) {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            filterPartnerCategory.appendChild(opt);
        }

        function partnerCardTemplate(p) {
            const contactButtons = generateContactButtons(p.contatos);

            return `<article class="group bg-white rounded-2xl shadow-soft border border-slate-100 p-5">
                        <h3 class="text-lg font-semibold text-brand.ink">${p.nome}</h3>
                        <span class="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">${p.categoria}</span>
                        <div class="mt-4 flex flex-wrap gap-2">${contactButtons.join('')}</div>
                    </article>`;
        }

        function renderPartners() {
            const nameFilter = searchPartner.value.toLowerCase();
            const categoryFilter = filterPartnerCategory.value;
            const filtered = partners.filter(p => (!nameFilter || p.nome.toLowerCase().includes(nameFilter)) && (!categoryFilter || p.categoria === categoryFilter));
            partnersGrid.innerHTML = filtered.map(partnerCardTemplate).join('');
            partnersEmpty.classList.toggle('hidden', filtered.length !== 0);
        }

        searchPartner.addEventListener('input', renderPartners);
        filterPartnerCategory.addEventListener('change', renderPartners);
        renderPartners();

    } catch (err) {
        console.error('Erro ao carregar parceiros:', err);
    }
}

// ----------------------
// Form de contato via WhatsApp
function initContactForm() {
    $('#contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const nome = form.get('nome');
        const tel = form.get('telefone');
        const email = form.get('email');
        const mensagem = form.get('mensagem');
        const texto = encodeURIComponent(`Olá, meu nome é ${nome}. Telefone: ${tel} | E-mail: ${email}. Mensagem: ${mensagem}`);
        const url = `https://wa.me/55997316224?text=${texto}`;
        window.open(url, '_blank');
        $('#formStatus').textContent = 'Mensagem aberta no WhatsApp. Se preferir, aguarde nosso retorno pelo número informado.';
        e.target.reset();
    });
}


// ----------------------
// Profissionais Parceiros
async function loadProfessionalPartners() {
    const grid = $('#professionalPartnersGrid');
    const empty = $('#professionalPartnersEmpty');
    const filterCategory = $('#filterProfessionalPartnerCategory');
    const searchName = $('#searchProfessionalPartner');

    let professionals = [];

    try {
        const res = await fetch('data/professionals-partners.json');
        const data = await res.json();
        professionals = data['professionals-partners'] || [];

        // Popular categorias únicas
        const categories = Array.from(new Set(professionals.map(p => p.categoria))).sort();
        for (const c of categories) {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            filterCategory.appendChild(opt);
        }

        function cardTemplate(p) {
            const photo = p.foto || 'https://via.placeholder.com/600x400?text=Profissional+Parceiro';
            const contactButtons = [];


            return `<article class="group bg-white rounded-2xl shadow-soft border border-slate-100 p-5">
                        <h3 class="text-lg font-semibold text-brand.ink">${p.nome}</h3>
                        <span class="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">${p.categoria}</span>
                    </article>`;

        }

        function render() {
            const q = searchName.value.trim().toLowerCase();
            const cat = filterCategory.value;
            const filtered = professionals.filter(p => (!q || p.nome.toLowerCase().includes(q)) && (!cat || p.categoria === cat));
            grid.innerHTML = filtered.map(cardTemplate).join('');
            empty.classList.toggle('hidden', filtered.length !== 0);
        }

        searchName.addEventListener('input', render);
        filterCategory.addEventListener('change', render);
        render();

    } catch (err) {
        console.error('Erro ao carregar profissionais parceiros:', err);
    }
}



// ----------------------
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setFooterYear();
    setYearsInMarket(12);
    initCookieBanner();
    loadTeam();
    loadPartners();
    loadProfessionalPartners(); // <-- aqui
    initContactForm();
});

