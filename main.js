let isRunning = false;

function addParticipant(name){
    if (name == ""){
        return;
    }

    let btn = document.createElement("button");
    btn.classList.add("button");
    btn.classList.add("participant");
    btn.dataset.secondsSpokenTotal = 0;
    btn.dataset.secondsSpokenNow = 0;
    // add a name
    let button_name = document.createElement("div");
    button_name.classList.add("name");
    button_name.innerHTML = name;
    btn.appendChild(button_name);
    // initialize total time to 0
    let time = document.createElement("div");
    time.classList.add("time");
    time.innerHTML = "0:00";
    btn.appendChild(time);

    //btn.addEventListener("click", "changeActive(this);");
    btn.onclick = function() {trackerPressed(this);};

    // make the button appear
    let trackers_area = document.getElementById("trackersArea");
    trackers_area.appendChild(btn);
    
    // clear input box
    let name_field = document.getElementById("nameField");
    name_field.value = "";
}

function trackerPressed(btn){
    if (Object.values(btn.classList).includes("activeButton")){
        pause();
    }
    else{
        changeActive(btn);
    }    
}

function changeActive(newActiveBtn){
    isRunning = true;

    // disable old button
    let oldActiveBtn = document.getElementsByClassName("activeButton")[0];
    if (oldActiveBtn != undefined){
        oldActiveBtn.classList.remove("activeButton");
        oldActiveBtn.dataset.secondsSpokenNow = 0;
    }
    
    // enable new button
    newActiveBtn.classList.add("activeButton");

    //update Labels
    updateLabels();
}

function update(){
    //deals with the internal values, then calls updateLabels().
    
    //ignore if not running
    if (!isRunning){
        return;
    }
    // update times every second
    let activeButton = document.getElementsByClassName("activeButton")[0];
    if (activeButton != undefined){
        activeButton.dataset.secondsSpokenTotal++;
        activeButton.dataset.secondsSpokenNow++;
    }
    updateLabels();
}

function updateLabels(){
    //deals with the external/visible values.
    let buttons = document.getElementsByClassName("participant");
    
    //loop through buttons and fix them 
    for (const btn of buttons){
        let timeSpokenTotal = secondsToMMSS(btn.dataset.secondsSpokenTotal);
        let timeSpokenNow = secondsToMMSS(btn.dataset.secondsSpokenNow);
        let timeToDisplay;
        if (Object.values(btn.classList).includes("activeButton")){
            timeToDisplay = timeSpokenTotal + " (Current: " + timeSpokenNow + ")";
        }
        else{
            timeToDisplay = timeSpokenTotal;
        }
        btn.getElementsByClassName("time")[0].innerHTML = timeToDisplay;
    };
}

function pause(){
    isRunning = false;

    // disable old button
    let oldActiveBtn = document.getElementsByClassName("activeButton")[0];
    if (oldActiveBtn != undefined){
        oldActiveBtn.classList.remove("activeButton");
        oldActiveBtn.dataset.secondsSpokenNow = 0;
    }
    updateLabels();
}

function checkEnter(ele){
    if (event.key === "Enter"){
        addParticipant(ele.value);
    }
}

function startNew(){
    //remove all buttons and reset time
}

function secondsToMMSS(seconds){
    let return_str = "";
    
    let mm = Math.floor(seconds / 60);
    if (mm >= 60){
        let hh = Math.floor(mm / 60);
        return_str = hh + ":"
        mm = mm % 60;
        mm = padZeroes(mm, 2);
    }
    else{
        mm = mm.toString();
    }
    return_str += mm + ":";
    
    let ss = (seconds % 60).toString();
    ss = padZeroes(ss, 2);
    return_str += ss;

    return return_str;
}

function padZeroes(num, len){
    let str = num.toString();
    while (str.length < len){
        str = "0" + str;
    }
    return str;
}

function run(){
    setInterval(update, 1000);
}
