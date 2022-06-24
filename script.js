// Thank you internet stranger (https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56)
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let isInEditMode = false;

function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

window.onload = function() {
    // Spooky global-ish variables
    let taskStates = [];
    let listCollapsedStates = [];
    let todoContent = document.getElementById("todo-content");
    let taskDeleteButtons = document.getElementsByClassName("task-delete-button");
    let listDeleteButtons = document.getElementsByClassName("list-delete-button");
    let tasks = document.getElementsByClassName("checkbox");

    function addCheckboxListener(element) {
        taskStates.push({state: false, link: element});

        element.addEventListener("click", function(e) {
            let i = taskStates.findIndex(x => x.link == element);
            e.target.style.transition = "all 0.2s";
            if (taskStates[i].state) {
                e.target.style.borderColor = "#8679D9";
                e.target.style.backgroundColor = "transparent";
            }
            else {
                e.target.style.borderColor = "#5833A6";
                e.target.style.backgroundColor = "#8679D9"
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
                const newDeleteButton = document.createElement("img");
                newDeleteButton.src = "delete.png";
                newDeleteButton.className = "task-delete-button";
                newDeleteButton.style.display = isInEditMode ? "block" : "none";

                newTaskTitle.appendChild(newDeleteButton);
                newDeleteButton.insertAdjacentHTML("beforeBegin", element.value);

                newListItem.appendChild(newCheckbox);
                newListItem.appendChild(newTaskTitle);

                // Add it
                element.parentElement.parentElement.insertBefore(newListItem, element.parentElement);
                element.value = "";

                // Update taskStates and stuff
                addCheckboxListener(newCheckbox);
                addTaskDeletionListener(newDeleteButton);
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
            let group = element.parentElement.parentElement.getElementsByClassName("list-group")[0];
            let origHeight = parseFloat(group.style.maxHeight, 10);
            let newHeight;
            if (listCollapsedStates[i].state) {
                newHeight = group.scrollHeight;
                element.parentElement.getElementsByClassName("dropdown-chevron")[0].style.transform = "rotate(0deg)"
            }
            else {
                newHeight = 0;
                element.parentElement.getElementsByClassName("dropdown-chevron")[0].style.transform = "rotate(-90deg)"
            }

            group.style.maxHeight = newHeight + "px";

            const delta = newHeight - origHeight;
            todoContent.style.maxHeight = todoContent.scrollHeight + delta + "px";

            listCollapsedStates[i].state = !listCollapsedStates[i].state;
        });
    }

    function addTaskDeletionListener(element) {
        element.addEventListener("click", function (e) {
            const j = taskStates.indexOf(e.target);
            const group = e.target.parentElement.parentElement.parentElement;

            e.target.parentElement.parentElement.remove();

            group.style.maxHeight = group.scrollHeight;
            todoContent.style.maxHeight = todoContent.scrollHeight + "px";
            taskStates.splice(j, 1);
        });
    }

    function addListDeletionListener(element) {
        element.addEventListener("click", function (e) {
            const list = e.target.parentElement.parentElement;

            list.remove();

            todoContent.style.maxHeight = todoContent.scrollHeight + "px";
        });
    }

    // Task Checkboxes
    for (let i = 0; i < tasks.length; i++) {
        addCheckboxListener(tasks[i]);
    }

    // Adding New Tasks
    let addTaskInputs = document.getElementsByClassName("task-add");

    for (let i = 0; i < addTaskInputs.length; i++) {
        addNewTaskEnteredListener(addTaskInputs[i]);
    }

    // Collapsible lists

    let listCollapseAreas = document.getElementsByClassName("list-collapse");

    for (let i = 0; i < listCollapseAreas.length; i++) {
        addListCollapseListener(listCollapseAreas[i]);
        // Have to update this at beginning for animation to work properly
        listCollapseAreas[i].parentElement.parentElement.getElementsByClassName("list-group")[0].style.maxHeight = listCollapseAreas[i].parentElement.parentElement.getElementsByClassName("list-group")[0].scrollHeight;
    }

    // Add List Button
    todoContent.style.maxHeight = todoContent.scrollHeight;
    let addListInput = document.getElementsByClassName("list-add-input")[0];
    addListInput.addEventListener("keyup", function(e) {
        if (e.keyCode == 13 && addListInput.value != "") {
            // <div class="list-wrapper">
            //     <div class="list-title">
            //         <div class="list-collapse">
            //             <img class="dropdown-chevron" src="chevron.png"/>
            //             Non-School
            //         </div>
            //         <img class="list-delete-button" src="delete.png" alt="">
            //     </div>
            //     <div class="list-group">
            //         <div class="task-add-wrapper">
            //             <input class="task-add" placeholder="Type a new task here."/>
            //         </div>
            //     </div>
            // </div>

            //#region Create Elements
            const newListWrapper = document.createElement("div");
            newListWrapper.className = "list-wrapper";

            const newListTitle = document.createElement("div");
            newListTitle.className = "list-title";

            const newListCollapse = document.createElement("div");
            newListCollapse.className = "list-collapse";

            const newDropdownChevron = document.createElement("img");
            newDropdownChevron.className = "dropdown-chevron";
            newDropdownChevron.src = "chevron.png";

            const newDeleteButton = document.createElement("img");
            newDeleteButton.className = "task-delete-button";
            newDeleteButton.src = "delete.png";

            const newListGroup = document.createElement("div");
            newListGroup.className = "list-group";

            const newTaskAddWrapper = document.createElement("div");
            newTaskAddWrapper.className = "task-add-wrapper";

            const newTaskAddInput = document.createElement("input");
            newTaskAddInput.className = "task-add";
            newTaskAddInput.placeholder = "Type a new task here.";
            newTaskAddInput.tabIndex = "-1";

            //#endregion


            newListCollapse.appendChild(newDropdownChevron);
            newDropdownChevron.insertAdjacentHTML("afterEnd", addListInput.value);
            newListTitle.appendChild(newListCollapse);
            newListTitle.appendChild(newDeleteButton);

            newTaskAddWrapper.appendChild(newTaskAddInput);
            newListGroup.appendChild(newTaskAddWrapper);

            newListWrapper.appendChild(newListTitle);
            newListWrapper.appendChild(newListGroup);

            addListInput.parentElement.parentElement.parentElement.appendChild(newListWrapper)//, addListInput.parentElement.parentElement.nextSibling);

            addListCollapseListener(newListCollapse);
            newListTitle.parentElement.getElementsByClassName("list-group")[0].style.maxHeight = newListTitle.parentElement.getElementsByClassName("list-group")[0].scrollHeight;

            addNewTaskEnteredListener(newTaskAddInput);

            addListDeletionListener(newDeleteButton);

            addListInput.value = "";

            todoContent.style.maxHeight = todoContent.scrollHeight + "px";
        }
    });

    // Toggle edit mode behaviour
    let editButton = document.getElementsByClassName("profile-pic")[0]; // TODO: Change this
    for (let i = 0; i < taskDeleteButtons.length; i++) {
        taskDeleteButtons[i].style.display = "none";
    }
    for (let i = 0; i < listDeleteButtons.length; i++) {
        listDeleteButtons[i].style.display = "none";
    }
    
    editButton.addEventListener("click", function() {
        for (let i = 0; i < taskDeleteButtons.length; i++) {
            taskDeleteButtons[i].style.display = isInEditMode ? "none" : "block";
        }
        for (let i = 0; i < listDeleteButtons.length; i++) {
            listDeleteButtons[i].style.display = isInEditMode ? "none" : "block";
        }
        isInEditMode = !isInEditMode
    });

    // Delete items
    for (let i = 0; i < taskDeleteButtons.length; i++) {
        addTaskDeletionListener(taskDeleteButtons[i]);
    }
    for (let i = 0; i < listDeleteButtons.length; i++) {
        addListDeletionListener(listDeleteButtons[i]);
    }

    // Stars Background
    let canvas = document.getElementById("backing-canvas");

    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");

    function Star(position, radius, averageBrightness) {
        this.position = position;
        this.radius = radius;
        this.averageBrightness = averageBrightness;
    }

    let stars = [];

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