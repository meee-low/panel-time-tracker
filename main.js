let isRunning = false;

// Internal functions.

function makeParticipantTracker(name){
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
    trackerBtn.dataset.secondsSpokenTotal = 0; // seconds spoken total
    trackerBtn.dataset.secondsSpokenNow = 0; //seconds spoken in the current session

    // add a name div inside the button (works as a label)
    let button_name = document.createElement("div");
    button_name.classList.add("name");
    button_name.innerHTML = name;
    trackerBtn.appendChild(button_name);

    // initialize total time to 0 as a div inside the button
    let time = document.createElement("div");
    time.classList.add("time");
    time.innerHTML = "0:00";
    trackerBtn.appendChild(time);

    // make button interactive
    trackerBtn.onclick = function() {trackerPressed(this);};

    // make the button appear in the correct area
    let trackers_area = document.getElementById("trackersArea");
    trackers_area.appendChild(trackerBtn);
    
    // clear input box
    let name_field = document.getElementById("nameField");
    name_field.value = "";
}
function run(){
    // runs the timer that updates every 1000 miliseconds (1s).
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
     let currentlyActiveTracker = document.getElementsByClassName("activeButton")[0]; //find active button
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