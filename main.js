let isRunning = false;

// Internal functions.

function makeParticipantTracker(name, displaytime=0, dataSecondsTotal=0, dataSecondsNow=0){
    // This function creates a participant tracker with the given name
    // and adds it to the page as a button.
    // This tracker/button can be clicked to start/pause the timer.
    if (name == ""){
        return;
    }

    let trackerBtn = document.createElement("button");

    // give it classes
    trackerBtn.classList.add("button");
    trackerBtn.classList.add("participant");

    // initialize times to 0
    trackerBtn.dataset.secondsSpokenTotal = dataSecondsTotal; // seconds spoken total
    trackerBtn.dataset.secondsSpokenNow = dataSecondsNow; //seconds spoken in the current session

    // add a name div inside the button (works as a label)
    let button_name = document.createElement("div");
    button_name.classList.add("name");
    button_name.innerHTML = name;
    trackerBtn.appendChild(button_name);

    // initialize total time to 0 as a div inside the button
    let time = document.createElement("div");
    time.classList.add("time");
    // time.innerHTML = "0:00";
    time.innerHTML = displaytime;
    trackerBtn.appendChild(time);

    // make button interactive
    trackerBtn.onclick = function() {trackerPressed(this);};

    // make the button appear in the correct area
    let trackers_area = document.getElementById("trackersArea");
    trackers_area.appendChild(trackerBtn);
    
    // clear input box
    let name_field = document.getElementById("nameField");
    name_field.value = "";

    save(); // save participants into local storage
}
function run(){
    // runs the timer that updates every 1000 miliseconds (1s).
    load(); // load data from local storage
    setInterval(updateTime, 1000);
}

function updateTime(){
    // Ticks every second and updates the time internally.
    // This is triggered by the setInterval inside run().
    // Visual changes are handled by updateLabels().
    
    // Ignore if not running.
    if (!isRunning){
        return;
    }

    // ticks up times for the active button every second
    let activeButton = document.getElementsByClassName("activeButton")[0];
    if (activeButton != undefined){
        activeButton.dataset.secondsSpokenTotal++;
        activeButton.dataset.secondsSpokenNow++;
    }

    updateLabels(); // refresh labels
    save(); // save data into local storage
}

function updateLabels(){
    // Deals with the external/visible labels.
    let trackerButtons = document.getElementsByClassName("participant");
    
    // Loop through every button and fix the labels.
    for (const trackerBtn of trackerButtons){
        let timeSpokenTotal = secondsToMMSS(trackerBtn.dataset.secondsSpokenTotal);
        let timeSpokenNow = secondsToMMSS(trackerBtn.dataset.secondsSpokenNow);
        let timeToDisplay; // the label that eventually gets displayed
        if (Object.values(trackerBtn.classList).includes("activeButton")){
            // if the button is active, also show the time spent in the current turn
            timeToDisplay = timeSpokenTotal + " (Current: " + timeSpokenNow + ")";
        }
        else{
            // if the button is not active, only show the total time spent
            timeToDisplay = timeSpokenTotal;
        }
        // finally, change the label
        trackerBtn.getElementsByClassName("time")[0].innerHTML = timeToDisplay;
    };
}

// Functions that directly deal with input/interaction.

function trackerPressed(trackerBtn){
    // Triggers when you press a button.
    // If the button is already active, just pause. Otherwise, change active button.
    if (Object.values(trackerBtn.classList).includes("activeButton")){
        // button is active, so pause
        pause();
    }
    else{
        // make this the new active button
        changeActiveTracker(trackerBtn);
    }    
}

function changeActiveTracker(newActiveTracker){
    isRunning = true; // starts running if not already
    DisableActiveTracker(); //disable old active tracker
    newActiveTracker.classList.add("activeButton"); // enable new tracker
    updateLabels();
}

function DisableActiveTracker(){
    // find and disable currently active button
    let currentlyActiveTracker = document.getElementsByClassName("activeButton")[0]; //find
    if (currentlyActiveTracker != undefined){
        // as long as you found something
        currentlyActiveTracker.classList.remove("activeButton"); // disable
        currentlyActiveTracker.dataset.secondsSpokenNow = 0; // reset time
    }
}

function pause(){
    isRunning = false;
    DisableActiveTracker();
    updateLabels();
    save(); // save participants into local storage
}

function sendIfEnter(ele){
    // Triggers when you press enter in the input box.
    if (event.key === "Enter"){
        // send the text inside the input box to the makeParticipantTracker function
        makeParticipantTracker(ele.value);
    }
}

function startNew(){
    //remove all buttons and reset time
    // Not implemented.
}

//Utilities, string formatting, etc.

function secondsToMMSS(seconds){
    // Takes in a number of seconds and returns a string in M:SS format.
    // If more than 1 hour, returns H:MM:SS format.
    
    let return_str = ""; // gets added to as we go
    
    let mm = Math.floor(seconds / 60);
    if (mm >= 60){
        // more than 1 hour
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
    // add zeroes to the front of a number to make it a certain length
    // returns a string, not a number
    let str = num.toString();
    while (str.length < len){
        str = "0" + str;
    }
    return str;
}


function save(){ // will save current participants+data into local storage
    //get buttons
    let buttons = document.getElementsByClassName("participant");

    // load array of participants if in local storage
    let participants = new Array();
    try{
        participants = JSON.parse(localStorage.getItem("participants"));
    }
    catch(err){
        console.log("no existing participants in local storage");
    }
    if (participants == null){
        participants = new Array();
    }

    

    // loop through all participants, create an object of their properties
    // then save it to local storage
    for (const btn of buttons){
        let participantToSave = {
            name: btn.getElementsByClassName("name")[0].innerHTML,
            time: btn.dataset.secondsSpokenTotal,
            dataSecondsTotal: btn.dataset.secondsSpokenTotal,
            dataSecondsNow: btn.dataset.secondsSpokenNow
        };

        // take participant object and turn it into a json string to save
        let PTSjson = JSON.stringify(participantToSave);
        // console.log(PTSjson);
        // localStorage.setItem(btn.getElementsByClassName("name")[0].innerHTML, PTSjson);

        // save properties of participant into local storage
        localStorage.setItem(participantToSave.name, PTSjson);

        // update array of participants into local storage
        participantFound=participants.indexOf(participantToSave.name); //checks if participant is already in array
        if (participantFound == -1){ //if not, add it
            participants.push(participantToSave.name);
        }
        else{ //if participant is already in array, update participant
            participants[participantFound] = participantToSave.name;
        }
        // finally save array of participants into local storage
        localStorage.setItem("participants", JSON.stringify(participants));
    }

    
}


function load(){
    // load participants from local storage if available
    let participants = [];
    try{
        // participants is an array keys of the participants
        // loops through array of keys and loads the saved participant objects
        participants = JSON.parse(localStorage.getItem("participants"));
        for (const participant of participants){
            participantObject = JSON.parse(localStorage.getItem(participant));
            // after retriving participant, create a button for it
            makeParticipantTracker(participantObject.name, participantObject.time, participantObject.dataSecondsTotal, participantObject.dataSecondsNow);
        }
    }
    catch(err){
        console.log("no existing participants in local storage");
    }



    



}