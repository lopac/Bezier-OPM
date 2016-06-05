class CanvasUi {
    static width: number;
    static height: number;
    static taskContainer: HTMLElement = null;

    static canvas = document.getElementById("canvas") as HTMLCanvasElement;

    public static refresh(clickedButton: JQuery) {

        this.width = window.innerWidth * 0.70;
        this.height = 800;

        this.clearCanvas();

        if (this.taskContainer === null) {


            this.taskContainer = document.getElementById("taskContainer");

            $("#taskContainer").show();

            let panel = document.createElement("div");
            panel.className = "col-lg-12 panel-heading";

            let heading = document.createElement("h4");
            heading.id = "taskTitle";

            panel.appendChild(heading);

            let descp = document.createElement("div");
            descp.id = "taskDescription";
            descp.className = "col-lg-12 panel-body";

            this.taskContainer.appendChild(panel);
            this.taskContainer.appendChild(descp);
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