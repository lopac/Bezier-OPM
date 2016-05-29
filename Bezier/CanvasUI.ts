class CanvasUI {
    static width: number;
    static height: number;
    static taskContainer: boolean = false;

    static canvas = document.getElementById("canvas") as HTMLCanvasElement;

    public static refresh(clickedButton: JQuery) {

        this.width = window.innerWidth * 0.70;
        this.height = 800;


        for (let i = 0; i < 9; i++) {
            $(`#task${i + 1}`).removeClass("btn btn-success").addClass("btn btn-primary");
        }

        clickedButton.removeClass("btn btn-primary").addClass("btn btn-success");

        this.clearCanvas();

        if (this.taskContainer === false) {

            let taskContainer = document.getElementById("taskContainer");

            let panel = document.createElement("div");
            panel.className = "panel-heading";

            let heading = document.createElement("h4");
            heading.id = "taskTitle";

            panel.appendChild(heading);

            let descp = document.createElement("div");
            descp.id = "taskDescription";
            descp.className = "panel-body";

            taskContainer.appendChild(panel);
            taskContainer.appendChild(descp);

            this.taskContainer = true;
        } else {
            $("#taskTitle").empty();
            $("#taskDescription").empty();
            $("#taskCom").empty();
            $("#taskBtns").empty();
        }

    }


    

    private static clearCanvas() {
        this.canvas.width = this.canvas.width;
    }


}