const date = new Date();
const global = {
    currentPage: window.location.pathname,
    fullDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    search : {
        term : '',
    }
}


console.log(global.currentPage);

async function fetchData(endpoint) {
    // === API Configuration ===
    const API_KEY = 'd48e413797msh9d07a0872c4ac71p1ef2b4jsnc2d795cc07be';
    const BASE_URL = 'https://api-basketball.p.rapidapi.com/';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'api-basketball.p.rapidapi.com'
        }
    }
    showSpinner();
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    hideSpinner();
    return response.json();
}

async function fetchNbaGames(endpoint) {
    const api_url = `https://api-nba-v1.p.rapidapi.com/games?${endpoint}`;
    const api_key = 'd48e413797msh9d07a0872c4ac71p1ef2b4jsnc2d795cc07be';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        }
    };
    showSpinner();
    const response = await fetch(api_url, options);
    hideSpinner();
    return response.json();
}

async function fetchTeamsStandings(conference) {
    const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024&conference=${conference}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'd48e413797msh9d07a0872c4ac71p1ef2b4jsnc2d795cc07be',
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        }
    };
    showSpinner();
    const response = await fetch(url, options);
    hideSpinner();
    return response.json();
}

async function fetchPlayers() {
    const PLAYERS_URL = 'https://api-nba-v1.p.rapidapi.com/players?team=1&season=2021';
    const API_KEY = 'd48e413797msh9d07a0872c4ac71p1ef2b4jsnc2d795cc07be'; 

    const response = await fetch(PLAYERS_URL, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    });
    const data = await response.json();
    return data.response;
}

async function fetchGamesStats() {
    const url = 'https://api-nba-v1.p.rapidapi.com/players/statistics?game=14447';
    const options = {
	    method: 'GET',
	    headers: {
		    'x-rapidapi-key': 'd48e413797msh9d07a0872c4ac71p1ef2b4jsnc2d795cc07be',
		    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
	    }
    };
    const response = await fetch(url, options);
    return response.json();
}

async function displayGamesStats() {
    const gameId = window.location.search.split('=')[1];

    const response = await fetchGamesStats();
    console.log(response);
}

async function displayNbaGames() {
    const { response } = await fetchNbaGames(`date=${global.fullDate}`);
    console.log(response);
    response.forEach((game) => {
        const link = document.createElement('a');
        link.href = `nbaMatchDetails.html?id=${game.id}`;
        link.className = 'text-decoration-none text-reset';
        const div = document.createElement('div');
        div.classList.add('card')
        div.innerHTML = `
            <div class="card-header text-center">${game.status.long}</div>
            <div class="card-body">
                <div class="team"> 
                    <span>${game.teams.home.name}</span> 
                    <span class="score">${game.scores.home.points}</span> 
                    <span class="quarters">
                    ${game.scores.home.linescore[0]} | ${game.scores.home.linescore[1]} | ${game.scores.home.linescore[2]} | ${game.scores.home.linescore[3]}
                    </span> 
                </div>
                <div class="team mt-2"> 
                    <span>${game.teams.visitors.name}</span> 
                    <span class="score">${game.scores.visitors.points}</span>
                    <span class="quarters">${game.scores.visitors.linescore[0]} | ${game.scores.visitors.linescore[1]} | ${game.scores.visitors.linescore[2]} | ${game.scores.visitors.linescore[3]}</span> 
                </div>
            </div>`
        link.appendChild(div);
        document.querySelector('#games').appendChild(link);
    });
}

async function displayLiveGames() {
    const { response } = await fetchNbaGames('live=all');

    const liveMatches = document.querySelector('#liveMatches');
    liveMatches.innerHTML = '';
    if (response.length > 0) {
        response.forEach((game) => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <div class="card-header">${game.status.long}</div>
                <div class="card-body">
                    <div class="team">
                    <span>${game.teams.home.name}</span>
                    <span class="score">${game.scores.home.points}</span> 
                    <span class="quarters">
                    ${game.scores.home.linescore[0]} | ${game.scores.home.linescore[1]} | ${game.scores.home.linescore[2]} | ${game.scores.home.linescore[3]}
                    </span>
                    </div>
                    <div class="team mt-2">
                        <span>${game.teams.visitors.name}</span> 
                        <span class="score">${game.scores.visitors.points}</span>
                        <span class="quarters">${game.scores.visitors.linescore[0]} | ${game.scores.visitors.linescore[1]} | ${game.scores.visitors.linescore[2]} | ${game.scores.visitors.linescore[3]}</span> 
                    </div>
                </div>`
            liveMatches.appendChild(div);
        })
    }
    else {
        const h3 = document.createElement('h3');
        h3.textContent = 'No live Matches Right Now';
        liveMatches.appendChild(h3);
    }
}

// Nba Teams standings--
async function displayTeamsStandings(endpoint) {
    const { response } = await fetchTeamsStandings(endpoint);
    const teams = response;

    // Sort the teams by their rankings 
    teams.sort((a, b) => a.conference.rank - b.conference.rank);

    // Display the sorted teams 
    const standingsTable = document.getElementById('standings-table');
    standingsTable.innerHTML = '';

    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = ` 
        <td>${team.conference.rank}</td> 
        <td><img src="${team.team.logo}" width="15px" height="auto"> ${team.team.name}</td> 
        <td>${team.win.total}</td> 
        <td>${team.loss.total}</td> `;

        standingsTable.appendChild(row);
    });

    // Toggling the button styles--
    const eastBtn = document.getElementById('east-btn'); 
    const westBtn = document.getElementById('west-btn');
    if(endpoint === 'east') {
        eastBtn.classList.add('btn-primary'); 
        eastBtn.classList.remove('btn-secondary'); 
        eastBtn.classList.add('active'); 
        westBtn.classList.add('btn-secondary'); 
        westBtn.classList.remove('btn-primary'); 
        westBtn.classList.remove('active');
    }
    else {
        westBtn.classList.add('btn-primary'); 
        westBtn.classList.remove('btn-secondary'); 
        westBtn.classList.add('active'); 
        eastBtn.classList.add('btn-secondary'); 
        eastBtn.classList.remove('btn-primary'); 
        eastBtn.classList.remove('active');
    }
}

// For players--
async function displayPlayers() {
    const response = await fetchPlayers();
    console.log(response);

    response.forEach((player) => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('card');
        playerCard.innerHTML = `
            <img src="${player.img || 'https://placehold.co/100x100'}" alt="Player placeholder image" class="player-img">
            <h3 class="player-name">${player.firstname} ${player.lastname}</h3>
            <p class="player-position">${player.leagues.standard.pos}</p>
            <div class="team-info">
                <i class="fas fa-basketball-ball"></i> 
                <span class="team-name">${player.college}</span>
            </div>`;
        const playersGrid = document.querySelector('.grid-container');
        playersGrid.appendChild(playerCard);
    });
}

// Display Slider for Leagues across the world--
async function displaySliderForLeagues() {
    const { response } = await fetchData('leagues');
    console.log(response);
    response.forEach((league) => {
        const div = document.createElement('div');
        div.className = 'swiper-slide';

        const link = document.createElement('a');
        link.href = '#';
        link.alt = `${league.name}`;

        const image = document.createElement('img');
        league.logo ? image.src = `${league.logo}` : image.src = 'assets/images/no-image.jpg';
        image.alt = `${league.name}`;
        link.appendChild(image);

        const h4 = document.createElement('h4');
        h4.classList.add('swiper-rating');
        h4.textContent = `${league.name}`;

        const country = document.createElement('h4');
        country.textContent = `Country: ${league.country.name}`;

        div.appendChild(link);
        div.appendChild(h4);
        div.appendChild(country);

        document.querySelector('.swiper-wrapper').appendChild(div);

    });
    // Initialize a Swiper--
    initSwiper();
}

// To show spinner or hide spinner---
const showSpinner = () => {
    const spinner = document.querySelector('.spinner');
    spinner.classList.add('show');
}

const hideSpinner = () => {
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('show');
}

// Swiper Initialize--
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4
            }
        }
    })
}

// It will Highlight the page link in which we're on-- 
function activateLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    })
}

// Router: Initialize our app--
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displaySliderForLeagues();
            console.log('index');
            break;
        case '/nba.html':
            displayNbaGames();
            displayLiveGames();
            displayTeamsStandings('east');

            // Adding event-listener for east and west buttons.
            document.getElementById('east-btn').addEventListener('click', () => displayTeamsStandings('east')); 
            document.getElementById('west-btn').addEventListener('click', () => displayTeamsStandings('west'));
            console.log('nba')
            break;
        case '/nbaMatchDetails.html':
            console.log('Details nba page');
            displayGamesStats();
            break;
        case '/players.html':
            console.log('players');
            // displayPlayers();
            break;
    }

    activateLink();
}
document.addEventListener("DOMContentLoaded", init);


console.log(global.fullDate);
