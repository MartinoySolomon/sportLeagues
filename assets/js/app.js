const wrapper = document.querySelector(".wrapper");
const loadingElement = document.querySelector(".loader");
const modalClose = document.querySelector(".modal_close");
const modal = document.querySelector(".modal");
const seasonListElement = document.getElementById("seasonListContent");
const seasonListTitleElement = document.getElementById("seasonListTitle");
// window.setTimeout(buildHomePage,1500);

buildHomePage();

function showModal() {
	modal.classList.remove("hidden");
}

modalClose.addEventListener("click", () => {
	modal.classList.add("hidden");
});

function showLoading(isShow) {
	loadingElement.classList.toggle("hidden", !isShow);
}

async function buildHomePage() {
	try {
		showLoading(true);
		const data = await groupeBySport();
		if (data == undefined) {
			throw new Error("failed to fetch");
		}
		const sports = Object.values(data);
		sports.forEach((sportArray) => {
			const sportTypeDiv = document.createElement("section");
			sportTypeDiv.classList.add("sport_type");

			const sportTitle = document.createElement("h2");
			sportTitle.classList.add("sport_type_title");
			sportTitle.innerHTML = sportArray[0].strSport;

			const leaguesList = document.createElement("div");
			leaguesList.classList.add("leagues_list");

			sportArray.forEach((element) => {
				const league = document.createElement("div");
				league.classList.add("league");

				const leagueName = document.createElement("div");
				leagueName.classList.add("league_name");
				leagueName.innerHTML = element.strLeague;

				const linkToList = document.createElement("div");
				linkToList.id = element.idLeague;
				linkToList.classList.add("link_to_list");
				linkToList.innerHTML = `Seasons List`;
				linkToList.addEventListener("click", showSeasonsList);

				league.appendChild(leagueName);
				league.appendChild(linkToList);
				leaguesList.appendChild(league);
			});
			sportTypeDiv.appendChild(sportTitle);
			sportTypeDiv.appendChild(leaguesList);
			wrapper.appendChild(sportTypeDiv);
		});
	} catch (err) {
		console.log(err);
	} finally {
		showLoading(false);
	}
}

async function groupeBySport() {
	try {
		const leagues = await getSportsLeagues();
		if (leagues == undefined) {
			throw new Error("failed to fetch data");
		}
		const groupedBySport = leagues.reduce((acc, league) => {
			const sport = league.strSport;
			if (!acc[sport]) {
				acc[sport] = [];
			}
			acc[sport].push(league);
			return acc;
		}, []);
		return groupedBySport;
	} catch (err) {
		console.log(err);
	} finally {
	}
}

async function getSportsLeagues() {
	try {
		const response = await fetch(
			"https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
		);
		if (!response.ok) {
			throw new Error("Failed to Fetch");
		}
		const data = await response.json();
		return data.leagues;
	} catch (err) {
		console.log(err);
	} finally {
	}
}

async function getSeasonsList(leagueID) {
	try {
		const response = await fetch(
			"https://www.thesportsdb.com//api/v1/json/3/search_all_seasons.php?id=" +
				leagueID
		);
		if (!response.ok) {
			throw new Error("Failed to Fetch");
		}
		const data = await response.json();
		return data.seasons;
	} catch (err) {
		console.log(err);
	} finally {
	}
}

async function showSeasonsList(event) {
	try {
		const leagueID = parseInt(event.target.id);
		const seasonList = await getSeasonsList(leagueID);
		if (seasonList == undefined) {
			throw new Error("Failed to Fetch");
		}
		seasonListElement.innerHTML = "";
		seasonList.forEach((season) => {
			const seasonLink = document.createElement("div");
			seasonLink.classList.add("season_link");
			seasonLink.innerHTML = season.strSeason;
			seasonListElement.appendChild(seasonLink);
            seasonListTitleElement.innerHTML=event.target.previousElementSibling.innerHTML
		});
		showModal();
	} catch (err) {
		console.log(err);
	} finally {
	}
}
