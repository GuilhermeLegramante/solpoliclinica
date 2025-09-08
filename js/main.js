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
            const contactButtons = [];

            if (p.contatos) {
                if (p.contatos.whatsapp) {
                    contactButtons.push(
                        `<a href="https://wa.me/${p.contatos.whatsapp.replace(/\D/g, '')}" target="_blank" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600">
                        WhatsApp: ${formatPhone(p.contatos.whatsapp)}
                        </a>`
                    );
                }

                if (p.contatos.telefone) {
                    const phones = Array.isArray(p.contatos.telefone) ? p.contatos.telefone : [p.contatos.telefone];
                    phones.forEach(t => {
                        contactButtons.push(
                            `<a href="tel:${t.replace(/\D/g, '')}" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">
                            Ligar: ${formatPhone(t)}
                            </a>`
                        );
                    });
                }
            }

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
            const contactButtons = [];

            if (p.contatos) {
                if (p.contatos.whatsapp) {
                    contactButtons.push(
                        `<a href="https://wa.me/${p.contatos.whatsapp.replace(/\D/g, '')}" target="_blank" class="bg-green-600 text-white px-3 py-2 rounded-xl inline-flex gap-2 hover:bg-green-700">WhatsApp</a>`
                    );
                }
                if (p.contatos.telefone) {
                    const phones = Array.isArray(p.contatos.telefone) ? p.contatos.telefone : [p.contatos.telefone];
                    phones.forEach(t => {
                        contactButtons.push(
                            `<a href="tel:${t.replace(/\D/g, '')}" class="bg-blue-600 text-white px-3 py-2 rounded-xl inline-flex gap-2 hover:bg-blue-700">${formatPartnerPhone(t)}</a>`
                        );
                    });
                }
            }

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
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setFooterYear();
    setYearsInMarket(12);
    initCookieBanner();
    loadTeam();
    loadPartners();
    initContactForm();
});
