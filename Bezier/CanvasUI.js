var CanvasUi = (function () {
    function CanvasUi() {
    }
    CanvasUi.refresh = function (clickedButton) {
        this.width = window.innerWidth * 0.70;
        this.height = 800;
        this.clearCanvas();
        if (this.taskContainer === null) {
            this.taskContainer = document.getElementById("taskContainer");
            $("#taskContainer").show();
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
