// Thank you internet stranger (https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56)
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Spooky global variables
let taskStates = [];
let listCollapsedStates = [];

function addCheckboxListener(element) {
    taskStates.push(false);
    let i = taskStates.length - 1;

    element.addEventListener("click", function() {
        element.style.transition = "all 0.2s"
        if (taskStates[i]) {
            element.style.borderColor = "#8679D9";
            element.style.backgroundColor = "transparent"
        }
        else {
            element.style.borderColor = "#5833A6";
            element.style.backgroundColor = "#8679D9"
        }
        taskStates[i] = !taskStates[i];
    });
}

function addListCollapseListener(element) {
    listCollapsedStates.push(false);
    let i = listCollapsedStates.length - 1;

    element.addEventListener("click", function() {
        let group = element.parentElement.getElementsByClassName("list-group")[0];
        if (listCollapsedStates[i]) {
            group.style.maxHeight = group.scrollHeight + "px";
            element.getElementsByClassName("dropdown-chevron")[0].style.transform = "rotate(0deg)"
        }
        else {
            group.style.maxHeight = "0px";
            element.getElementsByClassName("dropdown-chevron")[0].style.transform = "rotate(-90deg)"
        }

        // element.style.transition = "all 0.2s";
        // let children = element.parentElement.getElementsByClassName("list-item");
        // if (listCollapsedStates[i]) {
        //     for (let j = 0; j < children.length; j++) {
        //         children[j].style.maxHeight;
        //     }
        // }
        // else {
        //     for (let j = 0; j < children.length; j++) {
        //         children[j].style.display = "none";
        //         console.log(children[j]);
        //     }
        // }
        listCollapsedStates[i] = !listCollapsedStates[i];
    });
}

window.onload = function() {

    // Task Checkboxes
    let tasks = document.getElementsByClassName("checkbox");

    for (let i = 0; i < tasks.length; i++) {
        addCheckboxListener(tasks[i]);
    }

    // Adding New Tasks
    let addTaskInputs = document.getElementsByClassName("task-add");

    for (let i = 0; i < addTaskInputs.length; i++) {
        addTaskInputs[i].addEventListener("keyup", function(e) {
            // When enter (keycode 13) pressed
            if (e.keyCode == 13) {
                // Create new list item
                const newListItem = document.createElement("div");
                newListItem.className = "list-item";

                const newCheckbox = document.createElement("div");
                newCheckbox.className = "checkbox";
                const newTaskTitle = document.createElement("div");
                newTaskTitle.className = "task-title";
                newTaskTitle.innerHTML = addTaskInputs[i].value;

                newListItem.appendChild(newCheckbox);
                newListItem.appendChild(newTaskTitle);

                // Add it
                addTaskInputs[i].parentElement.parentElement.insertBefore(newListItem, addTaskInputs[i].parentElement);
                addTaskInputs[i].value = "";

                // Update taskStates and stuff
                addCheckboxListener(newCheckbox);
                addTaskInputs[i].parentElement.parentElement.style.maxHeight = addTaskInputs[i].parentElement.parentElement.scrollHeight + "px";
            }
        });
    }

    // Collapsible lists

    let listTitles = document.getElementsByClassName("list-title");

    for (let i = 0; i < listTitles.length; i++) {
        addListCollapseListener(listTitles[i]);
        // Have to update this at beginning for animation to work properly
        listTitles[i].parentElement.getElementsByClassName("list-group")[0].style.maxHeight = listTitles[i].parentElement.getElementsByClassName("list-group")[0].scrollHeight;
    }

    // Stars Background
    let canvas = document.getElementById("backing-canvas");

    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");

    function refresh() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let numStars = Math.floor(innerWidth * innerHeight * 0.0003);
        for (let i = 0; i < numStars; i++) {
            let xRand = Math.random() * window.innerWidth;
            let yRand = Math.random() * window.innerHeight;
            let sizeRand = Math.random().map(0, 1, 0, 2);
            let randBrightness = Math.random().map(0, 1, 0.3, 1);
            ctx.fillStyle = `rgb(255, 255, 255, ${randBrightness})`;

            ctx.beginPath();
            ctx.moveTo(xRand, yRand);
            ctx.arc(xRand, yRand, sizeRand, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    refresh();

    window.onresize = function() {refresh();};

}