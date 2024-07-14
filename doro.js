var interval, animeTime, workTime, timeMins;
let animeSessions, studySessions;
let endTime = Date.now() + 40 * 60 * 1000;
let watchingAnime = false;
let paused = false;

const workInp = document.querySelector("#work-input");
const aniInp = document.querySelector("#anime-input");
const beforeStart = document.querySelector(".before-start");
const aftStart = document.querySelector(".aft-start");
const minsCounter = document.querySelector(".minutes");
const secsCounter = document.querySelector(".seconds");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const finishButton = document.querySelector("#finish-button");
const plus5 = document.querySelector("#plus5");
const pause = document.querySelector("#pause");
const play = document.querySelector("#play");
const nextEventInfo = document.querySelector(".next-event-info");
const animeSessionCounter = document.querySelector(".anime-session-counter");
const studySessionCounter = document.querySelector(".study-session-counter");
const animeHoursCounter = document.querySelector(".total-count-anime");
const studyHoursCounter = document.querySelector(".total-count-study");

const beep = document.querySelector("#notificationSound");

startButton.textContent = "START";
resetButton.style.display = "none";
finishButton.style.display = "none";
finishButton.textContent = "FINISH";
plus5.textContent = "+5";
plus5.style.display = "none";
pause.style.display = "none";
play.style.display = "none";
startButton.addEventListener("click", function () {
  this.blur();
});
// get values and initialize

const LOCAL_STORAGE_KEYS = {
  ANIME_TIME: "animeTime",
  WORK_TIME: "workTime",
  ANIME_SESSIONS: "animeSessions",
  STUDY_SESSIONS: "studySessions",
  ANIME_SESSION_COUNTER: "animeSessionCounter",
  STUDY_SESSION_COUNTER: "studySessionCounter",
};

function getLocalStorageValues(key, defaultValue) {
  const item = localStorage.getItem(key);
  return item ? parseInt(item, 10) : defaultValue;
}

function initializeValues() {
  aniInp.value = getLocalStorageValues(LOCAL_STORAGE_KEYS.ANIME_TIME, 20);
  workInp.value = getLocalStorageValues(LOCAL_STORAGE_KEYS.WORK_TIME, 40);

  animeSessions = getLocalStorageValues(LOCAL_STORAGE_KEYS.ANIME_SESSIONS, 0);
  studySessions = getLocalStorageValues(LOCAL_STORAGE_KEYS.STUDY_SESSIONS, 0);
  animeHours = getLocalStorageValues(
    LOCAL_STORAGE_KEYS.ANIME_SESSION_COUNTER,
    0
  );
  studyHours = getLocalStorageValues(
    LOCAL_STORAGE_KEYS.STUDY_SESSION_COUNTER,
    0
  );

  localStorage.setItem(LOCAL_STORAGE_KEYS.ANIME_SESSIONS, animeSessions);
  localStorage.setItem(LOCAL_STORAGE_KEYS.STUDY_SESSIONS, studySessions);
  localStorage.setItem(LOCAL_STORAGE_KEYS.ANIME_SESSION_COUNTER, animeHours);
  localStorage.setItem(LOCAL_STORAGE_KEYS.STUDY_SESSION_COUNTER, studyHours);

  updateSessionCounters();
}


function updateSessionCounters() {
    animeSessions = getLocalStorageValues(LOCAL_STORAGE_KEYS.ANIME_SESSIONS, 0);
    animeSessionCounter.textContent = `${animeSessions}  Anime Sessions`;
    studySessions = getLocalStorageValues(LOCAL_STORAGE_KEYS.STUDY_SESSIONS, 0);
    studySessionCounter.textContent = `${studySessions}  Study Sessions`;
    animeHours = getLocalStorageValues(LOCAL_STORAGE_KEYS.ANIME_SESSION_COUNTER, 0);
    animeHoursCounter.textContent = `${Math.floor(animeHours / 60)}:${animeHours % 60} Hours Of Anime`;
    studyHours = getLocalStorageValues(LOCAL_STORAGE_KEYS.STUDY_SESSION_COUNTER, 0);
    studyHoursCounter.textContent = `${Math.floor(studyHours / 60)}:${animeHours % 60} Hours Of Study`;
}
updateSessionCounters();

function addAnimeSession() {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ANIME_SESSIONS, parseInt(animeSessions, 10) + 1);
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.ANIME_SESSION_COUNTER,
    parseInt(animeHours, 10) + animeTime
  );
  updateSessionCounters();
}

function addStudySession() {
  localStorage.setItem(LOCAL_STORAGE_KEYS.STUDY_SESSIONS, parseInt(studySessions, 10) + 1);
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.STUDY_SESSION_COUNTER,
    parseInt(studyHours, 10) + workTime
  );
  updateSessionCounters();
}

function updateTime() {
  animeTime = Number(aniInp.value);
  workTime = Number(workInp.value);
  localStorage.setItem(LOCAL_STORAGE_KEYS.ANIME_TIME, animeTime);
  localStorage.setItem(LOCAL_STORAGE_KEYS.WORK_TIME, workTime);
  timeMins = workTime;
}
updateTime();

const startCountdown = function (mins, secs) {
  const now = Date.now();
  endTime = now + mins * 60 * 1000 + secs * 1000;
  displayTime(Math.round((endTime - Date.now()) / 1000));
  plus5.style.display = "inline";
  pause.style.display = "inline";
  finishButton.style.display = "inline";
  play.style.display = "none";
  interval = setInterval(() => {
    if (paused) {
      endTime += 100; // keeps adding 100ms because interval is called every 100ms
      return;
    }
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    if (timeLeft < 0) {
      beep.play();
      if (watchingAnime) {
        // working time starts
        clearInterval(interval);
        nextEventInfo.textContent = "Dont you dare click on next Episode!";
        startButton.textContent = "START";
        plus5.style.display = "none";
        finishButton.style.display = "none";
        timeMins = workTime;
        watchingAnime = false;
        paused = true;
        notify(
          "Anime time has ended",
          "Get back to work\nAND DONT YOU DARE CLICK ON NEXT EPISODE!"
        );
        addAnimeSession();
        return;
      } else {
        // anime time starts
        clearInterval(interval);
        timeMins = animeTime;
        nextEventInfo.textContent = "You can watch Anime now";
        plus5.style.display = "none";
        finishButton.style.display = "none";
        startButton.textContent = "START";
        watchingAnime = true;
        paused = true;
        notify("You can take a break now", "Go watch that episode!\n");
        addStudySession();
        return;
      }
    }
    displayTime(timeLeft);
  }, 100); // 100ms interval
};

const displayTime = function (seconds) {
  let minutesRemaining = Math.floor(seconds / 60);
  let secondsRemaining = seconds % 60;
  minsCounter.textContent =
    (minutesRemaining < 10 ? "0" : "") + minutesRemaining;
  secsCounter.textContent =
    (secondsRemaining < 10 ? "0" : "") + secondsRemaining;
  //console.log(minutesRemaining, secondsRemaining);
};

const add5mins = function () {
  endTime += 5 * 60 * 1000;
  //displayTime(Date.now() - endTime);
  updateEventDetails(endTime);
};

const finishCountdown = function () {
  endTime = 1000;
  //displayTime(Date.now() - endTime);
  updateEventDetails(endTime);
};

const updateEventDetails = function (timestamp) {
  let dateObj = new Date(timestamp);
  let hours = dateObj.getHours();
  hours = (hours < 10 ? "0" : "") + hours;
  let mins = dateObj.getMinutes();
  mins = (mins < 10 ? "0" : "") + mins;
  if (watchingAnime) {
    nextEventInfo.textContent = "Stop Anime at " + hours + ":" + mins;
  } else {
    nextEventInfo.textContent = "Next Episode at " + hours + ":" + mins;
  }
};

function startClicked() {
  window.onbeforeunload = function (e) {
    return "Sure you want to leave?";
  };

  if (startButton.textContent === "RESTART") {
    paused = true;
    startButton.textContent = "START";
    resetButton.style.display = "inline";
    startButton.style.display = "none";
  } else {
    paused = false;
    startButton.style.display = "inline";
    startButton.textContent = "RESET";
  }

  checkPerms();
  startCountdown(timeMins, 0);
  updateEventDetails(endTime);
  aftStart.style.display = "inline";
  beforeStart.style.display = "none";
}

function pauseCountdown() {
  paused = true;
  pause.style.display = "none";
  play.style.display = "inline";
}

function resumeCountdown() {
  paused = false;
  pause.style.display = "inline";
  play.style.display = "none";
}

//startCountdown(1, 5);
//add5mins();
//updateEventDetails(endTime)

/*NOTIFICATIONS*/

const checkPerms = function () {
  if (Notification.permission === "granted") {
    //alert("we have permission");
    console.log("notifications allowed");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });
  }
};

const notify = function (heading, desc) {
  checkPerms();

  const notification = new Notification(heading, {
    body: desc,
    icon: "../Images/icon.png",
  });
  beep.play();
};

function inpvalid(inp) {
  val = inp.value;
  if (val.length > 3) {
    inp.value = val.slice(-3);
  }
}

function inpchk(inp) {
  if (Number(val) > 180) {
    inp.value = 180;
  }

  if (Number(val) < 0) {
    inp.value = 0;
  }

  updateTime();
}

checkPerms();

function reset() {
  aftStart.style.display = "none";
  beforeStart.style.display = "inline";
  startButton.textContent = "START";
  resetButton.style.display = "none";
}
