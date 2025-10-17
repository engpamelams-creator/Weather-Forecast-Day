# 🌤️ APIs Gratuitas de Previsão do Tempo - Guia Completo 2025

Este documento apresenta as **melhores APIs gratuitas de previsão do tempo** para integração no projeto **Weather Forecast Day**, com cobertura para Brasil e mundo.

---

## 📊 Comparação Rápida das Top 3 APIs

| API | Chamadas Grátis/Dia | Chave Necessária | Dias de Previsão | Cobertura | Melhor Para |
|-----|---------------------|------------------|------------------|-----------|-------------|
| **Open-Meteo** | 10.000 | ❌ Não | 16 dias | Mundial | Projetos open-source |
| **OpenWeatherMap** | 1.000 | ✅ Sim | 5 dias | Mundial | Projetos gerais |
| **Visual Crossing** | 1.000 | ✅ Sim | 15 dias | Mundial | Dados históricos |

---

## 🏆 TOP 3 RECOMENDADAS

### 1. 🥇 Open-Meteo (MELHOR OPÇÃO - 100% GRATUITA)

**Por que é a melhor:**
- ✅ Totalmente gratuita para uso não-comercial
- ✅ Sem necessidade de chave de API
- ✅ 10.000 chamadas por dia
- ✅ Previsão de até 16 dias
- ✅ Dados históricos de 80 anos
- ✅ Open-source (AGPLv3)
- ✅ Alta precisão (resolução de 1-11km)

#### 📍 Endpoints Principais

**Previsão do Tempo:**
```
https://api.open-meteo.com/v1/forecast
```

**Geocoding (converter cidade em coordenadas):**
```
https://geocoding-api.open-meteo.com/v1/search
```

#### 🔧 Como Usar

**1. Buscar coordenadas de uma cidade:**
```javascript
// Exemplo: São Paulo
const cityName = 'São Paulo';
const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;

const geoResponse = await fetch(geocodeUrl);
const geoData = await geoResponse.json();
const { latitude, longitude } = geoData.results[0];
```

**2. Buscar previsão do tempo:**
```javascript
const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relative_humidity_2m_max&timezone=America/Sao_Paulo&forecast_days=5`;

const weatherResponse = await fetch(forecastUrl);
const weatherData = await weatherResponse.json();
```

#### 📦 Resposta JSON (Exemplo)
```json
{
  "latitude": -23.55,
  "longitude": -46.633,
  "timezone": "America/Sao_Paulo",
  "daily": {
    "time": ["2025-10-17", "2025-10-18", "2025-10-19", "2025-10-20", "2025-10-21"],
    "temperature_2m_max": [28.5, 29.1, 27.8, 26.5, 28.2],
    "temperature_2m_min": [18.2, 19.5, 18.8, 17.5, 19.0],
    "weathercode": [0, 1, 2, 61, 3],
    "windspeed_10m_max": [12.5, 10.8, 15.2, 18.5, 11.3],
    "relative_humidity_2m_max": [75, 68, 82, 90, 70]
  }
}
```

#### 🌦️ Códigos do Tempo (weathercode)
| Código | Descrição | Emoji |
|--------|-----------|-------|
| 0 | Céu limpo | ☀️ |
| 1, 2, 3 | Parcialmente nublado | 🌤️ ⛅ ☁️ |
| 45, 48 | Neblina | 🌫️ |
| 51, 53, 55 | Chuvisco | 🌧️ |
| 61, 63, 65 | Chuva | 🌧️ |
| 71, 73, 75 | Neve | ❄️ |
| 80, 81, 82 | Pancadas de chuva | 🌧️ |
| 95, 96, 99 | Tempestade | ⚡ |

#### ⚙️ Parâmetros Disponíveis
- `temperature_2m_max` - Temperatura máxima (°C)
- `temperature_2m_min` - Temperatura mínima (°C)
- `weathercode` - Código da condição climática
- `windspeed_10m_max` - Velocidade máxima do vento (km/h)
- `relative_humidity_2m_max` - Umidade relativa máxima (%)
- `precipitation_sum` - Total de precipitação (mm)
- `forecast_days` - Número de dias (1-16)

#### 🚫 Limitações
- 10.000 chamadas/dia (sem chave)
- Para uso comercial, requer assinatura
- Requer coordenadas geográficas (latitude/longitude)

#### 🔗 Links
- **Documentação:** https://open-meteo.com/en/docs
- **Geocoding API:** https://open-meteo.com/en/docs/geocoding-api
- **GitHub:** https://github.com/open-meteo/open-meteo

---

### 2. 🥈 OpenWeatherMap (MAIS POPULAR)

**Por que usar:**
- ✅ API mais popular do mercado
- ✅ Documentação excelente
- ✅ Previsão de 5 dias a cada 3 horas
- ✅ 1.000 chamadas por dia
- ✅ Suporta busca por cidade direta

#### 📍 Endpoint Principal
```
https://api.openweathermap.org/data/2.5/forecast
```

#### 🔧 Como Usar

**1. Obter chave de API:**
- Cadastre-se em: https://openweathermap.org/api
- Acesse: https://home.openweathermap.org/api_keys
- Copie sua API Key

**2. Fazer requisição:**
```javascript
const API_KEY = 'sua_chave_aqui';
const city = 'São Paulo,BR';
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;

const response = await fetch(url);
const data = await response.json();
```

#### 📦 Resposta JSON (Simplificada)
```json
{
  "city": {
    "name": "São Paulo",
    "country": "BR"
  },
  "list": [
    {
      "dt": 1697558400,
      "main": {
        "temp": 25.5,
        "temp_min": 22.3,
        "temp_max": 28.7,
        "humidity": 65
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "céu limpo",
          "icon": "01d"
        }
      ],
      "wind": {
        "speed": 3.5
      }
    }
  ]
}
```

#### 🌦️ Códigos do Tempo (weather.id)
| Código | Descrição | Emoji |
|--------|-----------|-------|
| 200-232 | Tempestade | ⚡ |
| 300-321 | Chuvisco | 🌧️ |
| 500-531 | Chuva | 🌧️ |
| 600-622 | Neve | ❄️ |
| 701-781 | Atmosfera (névoa) | 🌫️ |
| 800 | Céu limpo | ☀️ |
| 801 | Poucas nuvens | 🌤️ |
| 802 | Nuvens dispersas | ⛅ |
| 803-804 | Nublado | ☁️ |

#### 🚫 Limitações
- 1.000 chamadas/dia (plano gratuito)
- 60 chamadas/minuto
- Previsão máxima de 5 dias
- Requer chave de API

#### 🔗 Links
- **Cadastro:** https://openweathermap.org/api
- **Documentação:** https://openweathermap.org/forecast5
- **Códigos do tempo:** https://openweathermap.org/weather-conditions

---

### 3. 🥉 Visual Crossing (MELHOR DADOS HISTÓRICOS)

**Por que usar:**
- ✅ 1.000 registros/dia grátis
- ✅ Previsão de até 15 dias
- ✅ Dados históricos de 50 anos
- ✅ Interface amigável
- ✅ Suporte a múltiplos idiomas

#### 📍 Endpoint Principal
```
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline
```

#### 🔧 Como Usar

**1. Obter chave de API:**
- Cadastre-se em: https://www.visualcrossing.com/weather-api
- Acesse sua conta e copie a API Key

**2. Fazer requisição:**
```javascript
const API_KEY = 'sua_chave_aqui';
const location = 'São Paulo, Brazil';
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next5days?unitGroup=metric&key=${API_KEY}&contentType=json&lang=pt`;

const response = await fetch(url);
const data = await response.json();
```

#### 📦 Resposta JSON (Simplificada)
```json
{
  "address": "São Paulo, Brazil",
  "days": [
    {
      "datetime": "2025-10-17",
      "tempmax": 28.5,
      "tempmin": 18.2,
      "temp": 23.3,
      "humidity": 65.5,
      "windspeed": 12.5,
      "conditions": "Parcialmente nublado",
      "icon": "partly-cloudy-day"
    }
  ]
}
```

#### 🚫 Limitações
- 1.000 registros/dia (plano gratuito)
- Requer chave de API
- Rate limit: 5 requisições/segundo

#### 🔗 Links
- **Website:** https://www.visualcrossing.com/
- **Documentação:** https://www.visualcrossing.com/resources/documentation/weather-api/
- **Cadastro:** https://www.visualcrossing.com/weather-api

---

## 🌎 OUTRAS OPÇÕES

### 4. WeatherAPI
- **Grátis:** 100.000 chamadas/mês
- **Previsão:** 3 dias (grátis)
- **Site:** https://www.weatherapi.com/

### 5. Weatherbit
- **Grátis:** 500 chamadas/dia
- **Previsão:** 16 dias
- **Site:** https://www.weatherbit.io/

### 6. Tomorrow.io
- **Grátis:** 500 chamadas/dia
- **Previsão:** 14 dias
- **Site:** https://www.tomorrow.io/

### 7. HG Brasil (Específico para Brasil)
- **Grátis:** 1.500 chamadas/dia
- **Previsão:** 10 dias
- **Cobertura:** Apenas Brasil
- **Site:** https://hgbrasil.com/status/weather

---

## 🎯 RECOMENDAÇÃO FINAL PARA WEATHER FORECAST DAY

### 🏆 Melhor Escolha: **Open-Meteo**

**Motivos:**
1. ✅ **Totalmente gratuita** - Sem necessidade de cadastro ou chave
2. ✅ **10.000 chamadas/dia** - 10x mais que OpenWeatherMap
3. ✅ **16 dias de previsão** - Mais que o projeto precisa (5 dias)
4. ✅ **Sem cartão de crédito** - Uso imediato
5. ✅ **Open-source** - Código aberto e comunidade ativa
6. ✅ **Alta precisão** - Modelos meteorológicos de vários países
7. ✅ **Cobertura global** - Brasil e mundo inteiro

**Quando usar OpenWeatherMap:**
- Quando precisar de busca direta por cidade (sem coordenadas)
- Quando já tiver uma chave configurada
- Quando precisar de documentação em português

---

## 🚀 IMPLEMENTAÇÃO RÁPIDA COM OPEN-METEO

### Arquivo: script.js (modificado)

```javascript
// ===== CONFIGURAÇÃO DA API OPEN-METEO (SEM CHAVE!) =====
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// ===== FUNÇÃO PARA BUSCAR COORDENADAS =====
async function getCoordinates(cityName) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error('Cidade não encontrada');
    }

    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country
    };
}

// ===== FUNÇÃO PARA BUSCAR PREVISÃO =====
async function fetchWeather(location) {
    try {
        showLoading();

        // 1. Buscar coordenadas
        const coords = await getCoordinates(location);

        // 2. Buscar previsão
        const url = `${WEATHER_API}?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relative_humidity_2m_max&timezone=auto&forecast_days=5`;

        const response = await fetch(url);
        const data = await response.json();

        // 3. Processar e renderizar
        renderForecast(data, coords);

    } catch (error) {
        showError(`❌ ${error.message}`);
    } finally {
        hideLoading();
    }
}

// ===== MAPEAR WEATHERCODE PARA EMOJI =====
function mapWeatherToEmoji(weatherCode) {
    if (weatherCode === 0) return '☀️';
    if (weatherCode >= 1 && weatherCode <= 3) return ['🌤️', '⛅', '☁️'][weatherCode - 1];
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
    if (weatherCode >= 80 && weatherCode <= 82) return '🌧️';
    if (weatherCode >= 95) return '⚡';
    return '🌤️';
}
```

---

## 📊 TABELA DE COMPARAÇÃO COMPLETA

| Critério | Open-Meteo | OpenWeatherMap | Visual Crossing |
|----------|------------|----------------|-----------------|
| **Preço** | Grátis | Grátis + Pagos | Grátis + Pagos |
| **Chamadas/dia** | 10.000 | 1.000 | 1.000 |
| **Chave API** | ❌ Não | ✅ Sim | ✅ Sim |
| **Cadastro** | ❌ Não | ✅ Sim | ✅ Sim |
| **Dias de previsão** | 16 | 5 | 15 |
| **Dados históricos** | 80 anos | Pago | 50 anos |
| **Resolução** | 1-11 km | Variável | Variável |
| **Busca por cidade** | Via Geocoding | ✅ Direta | ✅ Direta |
| **Idioma PT** | ✅ | ✅ | ✅ |
| **Open-source** | ✅ | ❌ | ❌ |
| **Rate limit** | 10k/dia | 60/min | 5/seg |
| **Cobertura** | Mundial | Mundial | Mundial |
| **Documentação** | Excelente | Excelente | Boa |

---

## 💡 DICAS IMPORTANTES

### ✅ Boas Práticas
1. **Cache de dados** - Armazene respostas para evitar chamadas repetidas
2. **Tratamento de erros** - Sempre tenha fallback para API indisponível
3. **Rate limiting** - Implemente controle para não exceder limites
4. **Timeout** - Configure timeout de 10-15 segundos
5. **Coordenadas** - Para Open-Meteo, cache coordenadas das cidades mais buscadas

### ⚠️ Atenções
- OpenWeatherMap requer chave de API (cadastro necessário)
- Open-Meteo funciona com coordenadas (precisa geocoding)
- Visual Crossing tem rate limit de 5 req/segundo
- APIs gratuitas podem ter downtime ocasional

### 🔒 Segurança
- **NUNCA** exponha chaves de API no frontend
- Use variáveis de ambiente (.env)
- Implemente proxy no backend para produção
- Rotacione chaves periodicamente

---

## 📚 RECURSOS ADICIONAIS

### 🔗 Links Úteis
- **Comparador de APIs:** https://rapidapi.com/collection/weather-apis
- **Lista completa:** https://github.com/public-apis/public-apis#weather
- **Forecast API Docs:** https://open-meteo.com/en/docs

### 📖 Tutoriais
- Open-Meteo: https://www.omi.me/blogs/api-guides/how-to-fetch-weather-data-using-open-meteo-api-in-javascript
- OpenWeatherMap: https://openweathermap.org/guide

---

## ✅ CONCLUSÃO

Para o projeto **Weather Forecast Day**, a **Open-Meteo** é a escolha ideal:

- ✅ Sem necessidade de cadastro ou chave
- ✅ 10x mais chamadas que a concorrência
- ✅ Previsão de 16 dias (mais que suficiente)
- ✅ Open-source e gratuita
- ✅ Funciona imediatamente

**Alternativa:** Se preferir busca direta por cidade sem geocoding, use **OpenWeatherMap** (requer chave gratuita).

---

**Desenvolvido para o projeto Weather Forecast Day** 🌤️
