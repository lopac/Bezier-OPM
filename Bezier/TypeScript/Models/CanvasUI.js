var CanvasUI = (function () {
    function CanvasUI() {
    }
    CanvasUI.refresh = function (clickedButton) {
        this.width = window.innerWidth * 0.70;
        this.height = 800;
        for (var i = 0; i < 9; i++) {
            $("#task" + (i + 1)).removeClass("btn btn-success").addClass("btn btn-primary");
        }
        clickedButton.removeClass("btn btn-primary").addClass("btn btn-success");
        this.clearCanvas();
        if (this.taskContainer === false) {
            var taskContainer = document.getElementById("taskContainer");
            var panel = document.createElement("div");
            panel.className = "panel-heading";
            var heading = document.createElement("h4");
            heading.id = "taskTitle";
            panel.appendChild(heading);
            var descp = document.createElement("div");
            descp.id = "taskDescription";
            descp.className = "panel-body";
            taskContainer.appendChild(panel);
            taskContainer.appendChild(descp);
            this.taskContainer = true;
        }
        else {
            $("#taskTitle").empty();
            $("#taskDescription").empty();
            $("#taskCom").empty();
            $("#taskBtns").empty();
        }
    };
    CanvasUI.clearCanvas = function () {
        this.canvas.width = this.canvas.width;
    };
    CanvasUI.taskContainer = false;
    CanvasUI.canvas = document.getElementById("canvas");
    return CanvasUI;
}());
