// Get DOM elements
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const clearButton = document.querySelector('.clear-button');
const heroContent = document.getElementById('hero-content');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('search-results');



// Function to display results
function displayResults(results) {

    // Hide only the hero-content, keep social icons visible
    if (heroContent) heroContent.style.display = 'none';
    resultsSection.style.display = 'block';
    resultsContainer.innerHTML = '';


    if (results.length === 0) {
        resultsContainer.innerHTML = `<p style="color:white; font-size:1.2rem; text-align:center;">No results found</p>`;
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('result-card');
        card.style.background = 'rgba(0,0,0,0.7)';
        card.style.border = '4px solid orange';
        card.style.borderRadius = '16px';
        card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        card.style.padding = '18px 18px 12px 18px';
        card.style.maxWidth = '350px';
        card.style.width = '100%';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.marginBottom = '10px';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; max-width:320px; height:200px; object-fit:cover; border-radius:12px; border:3px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.15); margin-bottom:10px;"/>
            <h3 style="color:#2d1c0b; background: #ffd700; font-size:1.3rem; font-weight:800; margin:10px 0 5px; padding:4px 8px; border-radius:6px; text-align:center;">${item.name}</h3>
            <p style="color:white; font-size:1.05rem; text-align:center; margin:0;">${item.description}</p>
        `;
        resultsContainer.appendChild(card);
    });
}

// Search function
async function searchDestinations() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (!keyword) return;

    let data;
    try {
        const response = await fetch('travel_recommendation_api.json');
        data = await response.json();
    } catch (error) {
        resultsContainer.innerHTML = `<p style="color:red; font-size:1.2rem; text-align:center;">Failed to load data</p>`;
        return;
    }

    let results = [];

    // Search countries and cities
    data.countries.forEach(country => {
        if (country.name.toLowerCase().includes(keyword)) {
            country.cities.forEach(city => results.push(city));
        } else {
            country.cities.forEach(city => {
                // Improved: match on any word in city name
                const cityNameWords = city.name.toLowerCase().split(/,|\s+/);
                if (
                    cityNameWords.some(word => word.includes(keyword)) ||
                    city.name.toLowerCase().includes(keyword) ||
                    city.description.toLowerCase().includes(keyword)
                ) {
                    results.push(city);
                }
            });
        }
    });

    // Search temples
    data.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(keyword) || temple.description.toLowerCase().includes(keyword)) {
            results.push(temple);
        }
    });

    // Search beaches
    data.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(keyword) || beach.description.toLowerCase().includes(keyword)) {
            results.push(beach);
        }
    });

    displayResults(results);
}

// Event listeners
searchButton.addEventListener('click', searchDestinations);

// Trigger search on Enter key
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchDestinations();
    }
});

// Clear functionality
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    resultsSection.style.display = 'none';
    if (heroContent) heroContent.style.display = '';
});