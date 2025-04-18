const wrapper = document.querySelector(".wrapper");
const loadingElement = document.querySelector(".loader");
const modalClose = document.querySelector(".modal_close");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal_content");
const modalBack = document.querySelector(".modal_back");
window.setTimeout(buildHomePage, 1500);

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
		modalBack.classList.add("hidden");
		modalContent.innerHTML = "";
		const leagueID = parseInt(event.target.id);
		const seasonList = await getSeasonsList(leagueID);
		if (seasonList == undefined) {
			throw new Error("Failed to Fetch");
		}
		const seasonListTitleElement = document.createElement("div");
		seasonListTitleElement.classList.add("seasons_list_title");

		seasonListTitleElement.innerHTML =
			event.target.previousElementSibling.innerHTML + " Seasons";

		seasonListTitleElement.id = leagueID;

		const seasonListElement = document.createElement("div");
		seasonListElement.classList.add("seasons_list_content");
		seasonListElement.id = "seasonListContent";

		seasonList.forEach((season) => {
			const seasonLink = document.createElement("div");
			seasonLink.classList.add("season_link");
			seasonLink.innerHTML = season.strSeason;
			seasonLink.addEventListener("click", showSeasonsEvents);
			seasonListElement.appendChild(seasonLink);
		});
		modalContent.appendChild(seasonListTitleElement);
		modalContent.appendChild(seasonListElement);

		showModal();
	} catch (err) {
		console.log(err);
	} finally {
	}
}

async function showSeasonsEvents(event) {
	try {
		const leagueYear = event.target.innerHTML;
		const leagueID = event.target.parentElement.previousElementSibling.id;
		const seasonEvents = await getSeasonsEvents(leagueID, leagueYear);
		if (seasonEvents == undefined) {
			throw new Error("Failed to Fetch");
		}
		modalContent.innerHTML = "";
		const seasonEventsTitle = document.createElement("div");
		seasonEventsTitle.innerHTML = `Events For Season ${seasonEvents[0].strSeason}`;
		seasonEventsTitle.classList.add("season_events_title");
		modalContent.appendChild(seasonEventsTitle);

		const seasonEventContent = document.createElement("div");
		seasonEventContent.classList.add("season_events_content");

		seasonEvents.forEach((seasonEvent) => {
			const eventBoxElement = document.createElement("div");
			eventBoxElement.classList.add("event");
			const eventTitle = document.createElement("div");
			eventTitle.classList.add("event_title");
			eventTitle.innerHTML = seasonEvent.strEvent;
			const eventDate = document.createElement("div");
			eventDate.classList.add("event_date");
			eventDate.innerHTML = seasonEvent.dateEvent;
			const eventImg = document.createElement("div");
			eventImg.classList.add("event_img");
			eventImg.innerHTML = `<img src=${seasonEvent.strLeagueBadge} alt='${seasonEvent.strLeague}'/>`;
			eventBoxElement.appendChild(eventTitle);
			eventBoxElement.appendChild(eventDate);
			eventBoxElement.appendChild(eventImg);
			seasonEventContent.appendChild(eventBoxElement);
		});
		modalBack.addEventListener("click", showSeasonsList);
		modalContent.appendChild(seasonEventContent);
		modalBack.id = seasonEvents[0].idLeague;
		modalBack.classList.remove("hidden");
	} catch (err) {
		console.log(err);
	} finally {
	}
}

async function getSeasonsEvents(leagueID, leagueYear) {
	try {
		const response = await fetch(
			`https://www.thesportsdb.com//api/v1/json/3/eventsseason.php?id=${leagueID}&s=${leagueYear}`
		);
		if (!response.ok) {
			throw new Error("Failed to Fetch");
		}
		const data = await response.json();
		return data.events;
	} catch (err) {
		console.log(err);
	} finally {
	}
}
