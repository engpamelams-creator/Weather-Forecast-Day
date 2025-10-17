// ===== CONFIGURAÇÃO DA API OPEN-METEO (SEM CHAVE NECESSÁRIA!) =====
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// ===== ELEMENTOS DO DOM =====
let locationInput, searchBtn, loading, errorMessage, locationInfo, cityName, currentDate, forecastSection, forecastCards, shareSection, shareFacebook, shareWhatsapp, copyLink, shareInstagram, closeShare;

// ===== VARIÁVEL GLOBAL PARA ARMAZENAR A LOCALIZAÇÃO ATUAL =====
let currentLocation = '';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded — iniciando app');

    // Atribuir elementos após DOM pronto
    locationInput = document.getElementById('locationInput');
    searchBtn = document.getElementById('searchBtn');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    locationInfo = document.getElementById('locationInfo');
    cityName = document.getElementById('cityName');
    currentDate = document.getElementById('currentDate');
    forecastSection = document.getElementById('forecastSection');
    forecastCards = document.getElementById('forecastCards');
    shareSection = document.getElementById('shareSection');
    shareFacebook = document.getElementById('shareFacebook');
    shareWhatsapp = document.getElementById('shareWhatsapp');
    shareInstagram = document.getElementById('shareInstagram');
    copyLink = document.getElementById('copyLink');
    closeShare = document.getElementById('closeShare');

    // checar elementos do DOM
    const missing = [];
    [
        'locationInput','searchBtn','loading','errorMessage','locationInfo',
        'cityName','currentDate','forecastSection','forecastCards',
        'shareSection','shareFacebook','shareWhatsapp','shareInstagram','copyLink','closeShare'
    ].forEach(id => {
        if (!document.getElementById(id)) missing.push(id);
    });

    if (missing.length) {
        console.warn('Elementos ausentes no DOM (alguns recursos de compartilhamento podem não funcionar):', missing);
        // não abortar totalmente — permitir continuar sem share
    }

    // Carregar previsão padrão (se função existir)
    if (typeof fetchWeather === 'function') fetchWeather('São Paulo');

    // Event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log('Clique em Buscar');
            try { handleSearch(); } catch (err) { console.error(err); showError('Erro ao processar busca.'); }
        });
    }

    if (locationInput) {
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter pressionado na busca');
                handleSearch();
            }
        });
    }

    // Inicializar botões de compartilhamento
    initShareButtons();

    console.log('App inicializado com sucesso');
});

// ===== FUNÇÃO PARA BUSCAR COORDENADAS DE UMA CIDADE =====
async function getCoordinates(location) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(location)}&count=1&language=pt&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error('Local não encontrado. Verifique o nome da cidade e tente novamente.');
    }

    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country,
        admin1: data.results[0].admin1 || ''
    };
}

// ===== FUNÇÃO PARA BUSCAR PREVISÃO DO TEMPO =====
async function fetchWeather(location) {
    try {
        // Mostrar loading
        showLoading();
        currentLocation = location;

        // 1. Buscar coordenadas da cidade
        const coords = await getCoordinates(location);

        // 2. Buscar previsão do tempo
        const weatherUrl = `${WEATHER_API}?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relative_humidity_2m_max&timezone=auto&forecast_days=5`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error('Erro ao buscar previsão do tempo. Tente novamente mais tarde.');
        }

        const weatherData = await weatherResponse.json();

        // 3. Renderizar a previsão
        renderForecast(weatherData, coords);

    } catch (error) {
        console.error('Erro ao buscar previsão:', error);
        showError(`❌ ${error.message}`);
    } finally {
        hideLoading();
    }
}

// ===== FUNÇÃO PARA RENDERIZAR A PREVISÃO =====
function renderForecast(data, coords) {
    // Limpar mensagens de erro anteriores
    hideError();

    // Atualizar informações da localização
    const locationName = coords.admin1
        ? `${coords.name}, ${coords.admin1}, ${coords.country}`
        : `${coords.name}, ${coords.country}`;

    cityName.textContent = locationName;
    currentDate.textContent = formatDate(new Date());
    locationInfo.classList.remove('hidden');

    // Limpar cards anteriores
    forecastCards.innerHTML = '';

    // Criar cards para cada dia
    data.daily.time.forEach((date, index) => {
        const forecast = {
            date: new Date(date),
            temp_max: data.daily.temperature_2m_max[index],
            temp_min: data.daily.temperature_2m_min[index],
            weatherCode: data.daily.weathercode[index],
            windSpeed: data.daily.windspeed_10m_max[index],
            humidity: data.daily.relative_humidity_2m_max[index]
        };

        const card = createForecastCard(forecast, index);
        forecastCards.appendChild(card);
    });

    // Mostrar seções
    forecastSection.classList.remove('hidden');
    shareSection.classList.remove('hidden');
}

// ===== FUNÇÃO PARA CRIAR CARD DE PREVISÃO =====
function createForecastCard(forecast, index) {
    const card = document.createElement('div');
    card.className = 'forecast-card';

    const emoji = mapWeatherToEmoji(forecast.weatherCode);
    const dayName = getDayName(forecast.date, index);
    const description = getWeatherDescription(forecast.weatherCode);

    card.innerHTML = `
        <div class="card-date">${dayName}</div>
        <div class="card-emoji">${emoji}</div>
        <div class="card-description">${description}</div>
        <div class="card-temp">
            <div class="temp-max">
                <span class="temp-label">Máx</span>
                <span class="temp-value">${Math.round(forecast.temp_max)}°C</span>
            </div>
            <div class="temp-min">
                <span class="temp-label">Mín</span>
                <span class="temp-value">${Math.round(forecast.temp_min)}°C</span>
            </div>
        </div>
        <div class="card-details">
            <div class="detail-item">
                <span class="detail-icon">💨</span>
                <span>${forecast.windSpeed.toFixed(1)} km/h</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">💧</span>
                <span>${Math.round(forecast.humidity)}%</span>
            </div>
        </div>
    `;

    return card;
}

// ===== FUNÇÃO PARA MAPEAR CÓDIGO DO CLIMA PARA EMOJI =====
function mapWeatherToEmoji(weatherCode) {
    // Códigos baseados na WMO Weather interpretation codes
    // Referência: https://open-meteo.com/en/docs

    if (weatherCode === 0) {
        return '☀️';
    } else if (weatherCode === 1) {
        return '🌤️';
    } else if (weatherCode === 2) {
        return '⛅';
    } else if (weatherCode === 3) {
        return '☁️';
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        return '🌫️';
    } else if (weatherCode >= 51 && weatherCode <= 57) {
        return '🌧️';
    } else if (weatherCode >= 61 && weatherCode <= 67) {
        return '🌧️';
    } else if (weatherCode >= 71 && weatherCode <= 77) {
        return '❄️';
    } else if (weatherCode >= 80 && weatherCode <= 82) {
        return '🌧️';
    } else if (weatherCode >= 85 && weatherCode <= 86) {
        return '❄️';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        return '⚡';
    } else {
        return '🌤️';
    }
}

// ===== FUNÇÃO PARA OBTER DESCRIÇÃO DO CLIMA =====
function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Névoa',
        51: 'Chuvisco leve',
        53: 'Chuvisco moderado',
        55: 'Chuvisco intenso',
        56: 'Chuvisco congelante leve',
        57: 'Chuvisco congelante intenso',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        71: 'Neve fraca',
        73: 'Neve moderada',
        75: 'Neve intensa',
        77: 'Grãos de neve',
        80: 'Pancadas de chuva leves',
        81: 'Pancadas de chuva moderadas',
        82: 'Pancadas de chuva fortes',
        85: 'Pancadas de neve leves',
        86: 'Pancadas de neve fortes',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
    };

    return descriptions[weatherCode] || 'Condições variadas';
}

// ===== FUNÇÃO PARA OBTER NOME DO DIA =====
function getDayName(date, index) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    if (index === 0) {
        return 'Hoje';
    } else if (index === 1) {
        return 'Amanhã';
    } else {
        return days[date.getDay()];
    }
}

// ===== FUNÇÃO PARA FORMATAR DATA =====
function formatDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// ===== FUNÇÃO PARA CAPITALIZAR TEXTO =====
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// ===== FUNÇÃO PARA LIDAR COM A BUSCA =====
function handleSearch() {
    const location = locationInput.value.trim();

    if (!location) {
        showError('⚠️ Por favor, digite uma localização.');
        return;
    }

    fetchWeather(location);
}

// ===== FUNÇÕES DE CONTROLE DE INTERFACE =====
function showLoading() {
    loading.classList.remove('hidden');
    forecastSection.classList.add('hidden');
    shareSection.classList.add('hidden');
    locationInfo.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    forecastSection.classList.add('hidden');
    shareSection.classList.add('hidden');
    locationInfo.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// ===== FUNÇÃO PARA INICIALIZAR BOTÕES DE COMPARTILHAMENTO =====
function initShareButtons() {
    if (!shareSection) return;

    // abrir modal de compartilhamento (chamar quando quiser mostrar)
    function showShare() {
        shareSection.classList.remove('hidden');
        shareSection.setAttribute('aria-hidden', 'false');
    }

    function hideShare() {
        shareSection.classList.add('hidden');
        shareSection.setAttribute('aria-hidden', 'true');
    }

    function buildShareUrl() {
        const city = currentLocation || (cityName && cityName.textContent) || 'localidade';
        const dateText = (currentDate && currentDate.textContent) || new Date().toLocaleDateString();
        // gerar URL relativa com parâmetros (aberta no navegador)
        const base = `${location.protocol}//${location.host}${location.pathname}`;
        return `${base}?city=${encodeURIComponent(city)}&date=${encodeURIComponent(dateText)}`;
    }

    function buildShareMessage() {
        const city = currentLocation || (cityName && cityName.textContent) || 'localidade';
        const dateText = (currentDate && currentDate.textContent) || new Date().toLocaleDateString();
        const url = buildShareUrl();
        return `Previsão do tempo para ${city} — ${dateText}\nVeja mais: ${url}`;
    }

    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            flashMessage('Link copiado!');
        } catch (err) {
            console.error('Erro ao copiar:', err);
            flashMessage('Não foi possível copiar');
        }
    }

    function flashMessage(msg) {
        const el = document.createElement('div');
        el.textContent = msg;
        el.style.position = 'absolute';
        el.style.bottom = '-46px';
        el.style.left = '50%';
        el.style.transform = 'translateX(-50%)';
        el.style.background = 'rgba(0,0,0,0.8)';
        el.style.color = '#fff';
        el.style.padding = '8px 12px';
        el.style.borderRadius = '10px';
        el.style.fontSize = '0.9rem';
        el.style.zIndex = '10001';
        shareSection.appendChild(el);
        setTimeout(() => el.remove(), 1700);
    }

    // handlers
    if (shareWhatsapp) {
        shareWhatsapp.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = encodeURIComponent(buildShareMessage());
            const url = `https://api.whatsapp.com/send?text=${msg}`;
            window.open(url, '_blank');
        });
    }

    if (shareFacebook) {
        shareFacebook.addEventListener('click', (e) => {
            e.preventDefault();
            const u = encodeURIComponent(buildShareUrl());
            const url = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
            window.open(url, '_blank', 'noopener');
        });
    }

    if (shareInstagram) {
        shareInstagram.addEventListener('click', (e) => {
            e.preventDefault();
            // Instagram não fornece sharer de texto via web — abrir perfil/instagram
            window.open('https://www.instagram.com/', '_blank', 'noopener');
        });
    }

    if (copyLink) {
        copyLink.addEventListener('click', (e) => {
            e.preventDefault();
            copyToClipboard(buildShareUrl());
        });
    }

    if (closeShare) {
        closeShare.addEventListener('click', () => hideShare());
    }

    // fechar ao clicar fora (simples)
    document.addEventListener('click', (ev) => {
        if (!shareSection) return;
        if (!shareSection.classList.contains('hidden')) {
            // se clicar fora do modal (shareSection), fechar
            const rect = shareSection.getBoundingClientRect();
            const x = ev.clientX, y = ev.clientY;
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                hideShare();
            }
        }
    });

    // expor funções para uso externo (se precisar abrir o modal de outro lugar)
    window.showShareModal = showShare;
    window.hideShareModal = hideShare;
}

// ===== INFORMAÇÃO SOBRE A API =====
console.log(`
✅ Weather Forecast Day - Usando Open-Meteo API

📍 API: Open-Meteo (100% gratuita)
🌍 Cobertura: Mundial (incluindo Brasil)
📊 Limite: 10.000 chamadas/dia
🔑 Chave: Não necessária
📖 Docs: https://open-meteo.com/

Benefícios:
✓ Sem necessidade de cadastro
✓ Sem chave de API
✓ Alta precisão
✓ Open-source
✓ Previsão de até 16 dias
`);
