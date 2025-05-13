// fetching songs from the folder 

let currentsong = new Audio();
let currentsongid;
let intervalId;
let currentsongpausetime;

const playcircle = document.querySelector(".circle");
const playpause = document.querySelector("#playpause");
const songtimeline = document.querySelector(".songtimeline")
const playnext = document.querySelector("#next")
const playprevious = document.querySelector("#previous")


async function getSongs() {
    let a = await fetch("https://github.com/Shubhamk0174/SpotifyClone/tree/main/Songs/Playlist1");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = [];
    let songnames = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href)
            songnames.push(element.innerHTML)
            let id = songnames.length;
            createSongListItem(element.innerHTML, (id - 1));

        }
    }
    // console.log(songnames);
    return songs
}




// to display all songs list to library
function createSongListItem(name, id) {
    let songli = document.createElement("li")
    songli.classList.add("songslistitem", "align-center", "flex", "g-1", "pointer", "pos-relative")
    songli.setAttribute("id", id)
    songli.innerHTML = `<img src="icons/musicicon.svg"  alt="" class="songlistitemimg invertsvg" width="30px">
    <span>${name.slice(0, -4)}</span>
    <img src="icons/playhollow.svg" class="invertsvg justify-self-end img2 display-none" alt="">`

    songli.addEventListener("mouseover", () => {
        const img2 = songli.querySelector(".img2");
        img2.classList.remove('display-none')
        img2.classList.add('display-block');
    })
    songli.addEventListener("mouseout", () => {
        const img2 = songli.querySelector(".img2");
        img2.classList.remove('display-block');
        img2.classList.add('display-none')
    })
    let songlistul = document.querySelector(".songlistulist");
    songlistul.append(songli)


    let songcard = document.createElement("div");
    songcard.classList.add("card", "pointer");
    songcard.setAttribute("id", id);
    songcard.innerHTML = `<div class="playbtncontainer pointer">
                                <img src="icons/playbtn.svg " class="playbtn" alt="" height="45px" width="45px">
                            </div>
                            <img src="Songs/Playlist1/playlistthumbnail.png" class="cardimg" alt="">
                            <p class="para1 ">${name.slice(0, -4)}</p>`
    let cardcontainer = document.querySelector(".cardcontainer");
    cardcontainer.append(songcard);
    const card = document.querySelectorAll(".card")



    card.forEach(slectedcard => {
        slectedcard.addEventListener("mouseover", () => {
            const playbtncontainer = slectedcard.querySelector(".playbtncontainer");
            playbtncontainer.classList.add('playbtndisplay')
        })
    });

    card.forEach(slectedcard => {
        slectedcard.addEventListener("mouseout", () => {
            const playbtncontainer = slectedcard.querySelector(".playbtncontainer");
            playbtncontainer.classList.remove('playbtndisplay')
        })
    });




}




function playsong(id, songs) {

    currentsong.src = songs[id];
    currentsongid = id;
    currentsong.play()
    // currentsong.currentTime= 120;
    updatePlayBar();
}



function updatePlayBar() {
    intervalId = setInterval(() => {
        let totaltime = currentsong.duration;
        let currenttime = currentsong.currentTime;
        let volume = currentsong.volume;
        let playstatus = (currentsong.paused) ? 1 : 0;
        let percent = (currenttime / totaltime) * 100;
        playcircle.style.left = `${percent}%`;

        if (playstatus == false) {
            playpause.src = "icons/pause.svg"
        }
        else {
            playpause.src = "icons/play.svg"
        }
    }, 100);

}



async function main() {

    let songs = await getSongs();

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", () => {
            let id = element.getAttribute("id");
            playsong(id, songs);
        })
    });

    Array.from(document.querySelector(".cardcontainer").getElementsByTagName("div")).forEach(element => {
        element.addEventListener("click", () => {
            let id = element.getAttribute("id");
            playsong(id, songs);
        })
    });




    playpause.addEventListener("click", () => {
        let playstatus = (currentsong.paused) ? 1 : 0;
        if (playstatus == false) {
            playpause.src = "icons/play.svg"
            currentsong.pause()
            currentsongpausetime = currentsong.currentTime;
            clearInterval(intervalId)
            updatePlayBar();
        }
        else {
            playpause.src = "icons/pause.svg"
            currentsong.currentTime = currentsongpausetime;
            currentsong.play();
            updatePlayBar();

        }
    })

    let songtimelinewidth = songtimeline.clientWidth;

    songtimeline.addEventListener("click", (event) => {

        let persent = (event.offsetX / songtimelinewidth) * 100

        let songnewtime = (persent / 100) * (currentsong.duration);

        currentsong.currentTime = songnewtime;
        currentsong.play();
        updatePlayBar()
    })

    console.log(currentsongid);
    playnext.addEventListener("click", () => {
        let id = parseInt(currentsongid) + 1;
        console.log(id);

        if (id >= songs.length) {
            id = 0; 
        }

        if (intervalId) {
            clearInterval(intervalId);
        }

        playsong(id, songs);
    });

    playprevious.addEventListener("click", () => {
        let id = parseInt(currentsongid) - 1;

        if (id < 0) {
            id = songs.length-1; 
        }

        if (intervalId) {
            clearInterval(intervalId);
        }

        playsong(id, songs);
    });



}
main()

