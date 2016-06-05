var CanvasUi = (function () {
    function CanvasUi() {
    }
    CanvasUi.refresh = function (clickedButton) {
        this.clearCanvas();
        if (this.taskContainer === null) {
            this.taskContainer = document.getElementById("taskContainer");
            $("#taskContainer").addClass("panel panel-info");
            var panel = document.createElement("div");
            panel.className = "col-lg-12 panel-heading";
            var heading = document.createElement("h4");
            heading.id = "taskTitle";
            panel.appendChild(heading);
            var descp = document.createElement("div");
            descp.id = "taskDescription";
            descp.className = "col-lg-12 panel-body";
            this.taskContainer.appendChild(panel);
            this.taskContainer.appendChild(descp);
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
    CanvasUi.taskContainer = null;
    CanvasUi.canvas = document.getElementById("canvas");
    return CanvasUi;
}());
