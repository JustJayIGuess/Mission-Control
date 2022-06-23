// Thank you internet stranger (https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56)
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

window.onload = function() {
    // Spooky global variables
    let taskStates = [];
    let listCollapsedStates = [];
    let todoContent = document.getElementById("todo-content");

    function addCheckboxListener(element) {
        taskStates.push({state: false, link: element});
        let i = taskStates.length - 1;

        element.addEventListener("click", function() {
            element.style.transition = "all 0.2s"
            if (taskStates[i].state) {
                element.style.borderColor = "#8679D9";
                element.style.backgroundColor = "transparent"
            }
            else {
                element.style.borderColor = "#5833A6";
                element.style.backgroundColor = "#8679D9"
            }
            taskStates[i].state = !taskStates[i].state;
        });
    }

    function addNewTaskEnteredListener(element) {
        element.addEventListener("keyup", function(e) {
            // When enter (keycode 13) pressed
            if (e.keyCode == 13) {
                // Create new list item
                const newListItem = document.createElement("div");
                newListItem.className = "list-item";

                const newCheckbox = document.createElement("div");
                newCheckbox.className = "checkbox";
                const newTaskTitle = document.createElement("div");
                newTaskTitle.className = "task-title";
                newTaskTitle.innerHTML = element.value;

                newListItem.appendChild(newCheckbox);
                newListItem.appendChild(newTaskTitle);

                // Add it
                element.parentElement.parentElement.insertBefore(newListItem, element.parentElement);
                element.value = "";

                // Update taskStates and stuff
                addCheckboxListener(newCheckbox);
                let delta = element.parentElement.parentElement.scrollHeight - parseFloat(element.parentElement.parentElement.style.maxHeight, 10);
                element.parentElement.parentElement.style.maxHeight = element.parentElement.parentElement.scrollHeight + "px";
                todoContent.style.maxHeight = todoContent.scrollHeight + delta + "px";
            }
        });
    }

    function addListCollapseListener(element) {
        listCollapsedStates.push({state: false, link: element});
        let i = listCollapsedStates.length - 1;

        element.addEventListener("click", function() {
            let group = element.parentElement.getElementsByClassName("list-group")[0];
            let origHeight = parseFloat(group.style.maxHeight, 10);
            let newHeight;
            if (listCollapsedStates[i].state) {
                newHeight = group.scrollHeight;
                element.getElementsByClassName("dropdown-chevron")[0].style.transform = "rotate(0deg)"
            }
            else {
                newHeight = 0;
                element.getElementsByClassName("dropdown-chevron")[0].style.transform = "rotate(-90deg)"
            }

            group.style.maxHeight = newHeight + "px";

            let delta = newHeight - origHeight;
            todoContent.style.maxHeight = todoContent.scrollHeight + delta + "px";

            listCollapsedStates[i].state = !listCollapsedStates[i].state;
        });
    }

    // Task Checkboxes
    let tasks = document.getElementsByClassName("checkbox");

    for (let i = 0; i < tasks.length; i++) {
        addCheckboxListener(tasks[i]);
    }

    // Adding New Tasks
    let addTaskInputs = document.getElementsByClassName("task-add");

    for (let i = 0; i < addTaskInputs.length; i++) {
        addNewTaskEnteredListener(addTaskInputs[i]);
    }

    // Collapsible lists

    let listTitles = document.getElementsByClassName("list-title");

    for (let i = 0; i < listTitles.length; i++) {
        addListCollapseListener(listTitles[i]);
        // Have to update this at beginning for animation to work properly
        listTitles[i].parentElement.getElementsByClassName("list-group")[0].style.maxHeight = listTitles[i].parentElement.getElementsByClassName("list-group")[0].scrollHeight;
    }

    // Add List Button
    todoContent.style.maxHeight = todoContent.scrollHeight;
    let addListInput = document.getElementsByClassName("list-add-input")[0];
    addListInput.addEventListener("keyup", function(e) {
        if (e.keyCode == 13 && addListInput.value != "") {
            // <div class="list-wrapper">
            //     <div class="list-title">
            //         <img class="dropdown-chevron" src="chevron.png"/>
            //         Non-School
            //     </div>
            //     <div class="list-group">
            //         <div class="task-add-wrapper">
            //             <input class="task-add" placeholder="Type a new task here."/>
            //         </div>
            //     </div>
            // </div>
            const newListWrapper = document.createElement("div");
            newListWrapper.className = "list-wrapper";
            const newListTitle = document.createElement("div");
            newListTitle.className = "list-title";
            const newDropdownChevron = document.createElement("img");
            newDropdownChevron.className = "dropdown-chevron";
            newDropdownChevron.src = "chevron.png";
            const newListGroup = document.createElement("div");
            newListGroup.className = "list-group";
            const newTaskAddWrapper = document.createElement("div");
            newTaskAddWrapper.className = "task-add-wrapper";
            const newTaskAddInput = document.createElement("input");
            newTaskAddInput.className = "task-add";
            newTaskAddInput.placeholder = "Type a new task here.";

            newListTitle.appendChild(newDropdownChevron);
            newDropdownChevron.insertAdjacentHTML("afterEnd", addListInput.value);


            newTaskAddWrapper.appendChild(newTaskAddInput);
            newListGroup.appendChild(newTaskAddWrapper);

            newListWrapper.appendChild(newListTitle);
            newListWrapper.appendChild(newListGroup);

            addListInput.parentElement.parentElement.parentElement.appendChild(newListWrapper)//, addListInput.parentElement.parentElement.nextSibling);

            addListCollapseListener(newListTitle);
            newListTitle.parentElement.getElementsByClassName("list-group")[0].style.maxHeight = newListTitle.parentElement.getElementsByClassName("list-group")[0].scrollHeight;

            addNewTaskEnteredListener(newTaskAddInput);

            addListInput.value = "";

            todoContent.style.maxHeight = todoContent.scrollHeight;
        }
    });

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