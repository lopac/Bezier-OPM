var CanvasUi = (function () {
    function CanvasUi() {
    }
    CanvasUi.refresh = function (clickedButton) {
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
    CanvasUi.clearCanvas = function () {
        this.canvas.width = this.canvas.width;
    };
    CanvasUi.taskContainer = false;
    CanvasUi.canvas = document.getElementById("canvas");
    return CanvasUi;
}());
//# sourceMappingURL=CanvasUI.js.map