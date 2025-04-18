const wrapper = document.querySelector(".wrapper");
const loadingElement=document.querySelector(".loader")
const modalClose=document.querySelector(".modal_close")
const modal=document.querySelector(".modal")


modalClose.addEventListener("click",()=>{
    modal.classList.add("hidden")
})

window.setTimeout(buildHomePage,1500);


function showLoading(isShow) {
	loadingElement.classList.toggle("hidden", !isShow);
}

async function buildHomePage() {
    try{
        showLoading(true);
        const data= await groupeBySport();
        if (data==undefined){
            throw new Error ("failed to fetch")
        }
        const sports = Object.values(data);
        sports.forEach(sportArray => {

            const sportTypeDiv=document.createElement("section");
            sportTypeDiv.classList.add("sport_type")

            const sportTitle=document.createElement("h2");
            sportTitle.classList.add("sport_type_title")
            sportTitle.innerHTML=sportArray[0].strSport;

            const leaguesList=document.createElement("div");
            leaguesList.classList.add("leagues_list");

            sportArray.forEach((element)=>{
                const league=document.createElement("div");
                league.classList.add("league");

                const leagueName=document.createElement("div");
                leagueName.classList.add("league_name");
                leagueName.innerHTML=element.strLeague;

                const linkToList=document.createElement("div");
                linkToList.classList.add("link_to_list");
                linkToList.innerHTML=`Seasons List`

                league.appendChild(leagueName);
                league.appendChild(linkToList);
                leaguesList.appendChild(league);
            })
            sportTypeDiv.appendChild(sportTitle);
            sportTypeDiv.appendChild(leaguesList);
            wrapper.appendChild(sportTypeDiv);
        });
    } catch(err){
        console.log(err);
    } finally{
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
		const resopnse = await fetch(
			"https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
		);
		if (!resopnse.ok) {
			throw new Error("Failed to Fetch");
		}
		const data = await resopnse.json();
		return data.leagues;
	} catch (err) {
		console.log(err);
	} finally {
	}
}
