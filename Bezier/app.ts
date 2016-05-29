window.onload = () => {


    if (IsMobile.any()) {
        $(".navbar-collapse collapse").remove();
        $("#logo").remove();
    }

    $("#task1")
        .click(() => {


            CanvasUi.refresh($("#task1"));


            $("#taskTitle").html(() => "Zadatak 5.");

            $("#taskDescription")
                .html(() =>
                    "Napravite na racunalu program koji ce omoguciti korisniku da oznaci cetiri tocke u ravnini i da se nakon" +
                    "<br/> toga nacrta Bezierova krivulja kojoj su to kontrolne tocke. Isto tako mora biti omoguceno korisniku" +
                    "<br/>da moze micati kontrolne tocke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. " +
                    "<br/>Kontrolne tocke neka budu redom spojene crtkanim linijama.");

            new QuadriaticBezier(CanvasUi.width, CanvasUi.height, CanvasUi.canvas, 4);

        });

    $("#task2")
        .click(() => {


            CanvasUi.refresh($("#task2"));


            $("#taskTitle").html(() => "Zadatak 6.");
            $("#taskDescription")
                .html(() =>
                    "Implementirajte algoritam na računalu koji će na ulazu imati kontrolne točke Bezierove krivulje q i parametar u e [0,1], a na izlazu će dati q(u). ");


            new DeCasteljau();


        });

    $("#task3")
        .click(() => {
            CanvasUi.refresh($("#task3"));

            $("#taskTitle").html(() => "Zadatak 7.");
            $("#taskDescription")
                .html(() =>
                    "Za krivulje iz zadatka 3 i zadatka 4 izracunajte pomocu Casteljaunovog algoritma q(1/2) i q(3/4).Zadatak napravite rucno i na racunalu pomocu implementiranog algoritma iz prethodnog zadatka."
                );

            $("#taskCom").css("width", 200);

            let label = document.createElement("label");
            label.className = "col-lg-2 control-label";
            label.htmlFor = "select";
            label.innerHTML = "Odaberite podzadatak";

            let select = document.createElement("select");
            select.className = "form-control";
            select.id = "select";

            let o1 = document.createElement("option");
            o1.innerHTML = "zadatak 3. u = 1/2";

            let o2 = document.createElement("option");
            o2.innerHTML = "zadatak 3. u = 3/4";


            let o3 = document.createElement("option");
            o3.innerHTML = "zadatak 4. u = 1/2";

            let o4 = document.createElement("option");
            o4.innerHTML = "zadatak 4. u = 3/4";



            o1.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);


                new DeCasteljauPoint(1 / 2);
            };



            o2.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);

                new DeCasteljauPoint(3 / 4);
            };


            o3.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);

                new DeCasteljauVector(1 / 2);
            };


            o4.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);

                let a = new DeCasteljauVector(3 / 4);
            };


            $("#taskCom").empty();

            $("#taskCom").append(label).append(select);

            $("#select").append(o1).append(o2).append(o3).append(o4);

        });

    $("#task4")
        .click(() => {
            CanvasUi.refresh($("#task4"));
            $("#taskTitle").html(() => "Zadatak 8.");

            $("#taskDescription")
                .html(() =>
                    "Napišite na računalu algoritam koji će zadanu Bezierovu krivulju podijeliti na dva dijela na mjestu na kojemu korisnik to odluči i da nakon toga se može opet tim dijelovima mijenjati oblik pomoću njihovih kontrolnih točaka.<br/>" +
                    "Uputa: Nakon što nacrtate željeni broj kontrolnih točaka te pritisnite \"Nacrtaj krivulju\" kako biste ju podijelili dva puta kliknite mišom na mjesto gdje biste željeli podijeliti krivulju na 2 dijela"
                );

            let c = new BezierSeparation(CanvasUi.width, CanvasUi.height, CanvasUi.canvas);
        });

    $("#task5")
        .click(() => {

            CanvasUi.refresh($("#task5"));

            $("#taskTitle").html(() => "Zadatak 13.");

            $("#taskDescription")
                .html(() =>
                    "Napravite na racunalu program koji ce omoguciti korisniku da oznaci k tocaka u ravnini za k ∈ {3,4,...,10} i da se nakon toga nacrta Bezierova krivulja stupnja k − 1 kojoj su to kontrolne tocke. " +
                    "Isto tako mora biti omoguceno korisniku da moze micati kontrolne tocke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. Kontrolne tocke neka budu redom spojene crtkanim linijama."
                );

            let d = new NBezier(CanvasUi.width, CanvasUi.height, CanvasUi.canvas);

        });

    $("#task6")
        .click(() => {
            CanvasUi.refresh($("#task6"));

        });

    $("#task9")
        .click(() => {
            CanvasUi.refresh($("#task9"));

        });

};