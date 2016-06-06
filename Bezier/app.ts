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
                    "Napravite na računalu program koji će omogućiti korisniku da označi četiri tocke u ravnini i da se nakon" +
                    "toga nacrta Bezierova krivulja kojoj su to kontrolne točke. Isto tako mora biti omogućeno korisniku" +
                    "da može micati kontrolne točke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. " +
                    "Kontrolne točke neka budu redom spojene crtkanim linijama.");
            let quadriaticBezier = new QuadriaticBezier(CanvasUi.canvas, 4);
        });

    $("#task2")
        .click(() => {


            CanvasUi.refresh($("#task2"));


            $("#taskTitle").html(() => "Zadatak 6.");
            $("#taskDescription")
                .html(() =>
                    "Implementirajte algoritam na računalu koji će na ulazu imati kontrolne točke Bezierove krivulje q i parametar u e [0,1], a na izlazu će dati q(u). ");
            let deCasteljau = new DeCasteljau();
        });

    $("#task3")
        .click(() => {
            CanvasUi.refresh($("#task3"));

            $("#taskTitle").html(() => "Zadatak 7.");
            $("#taskDescription")
                .html(() =>
                    "Za krivulje iz zadatka 3 i zadatka 4 izračunajte pomoću Casteljaunovog algoritma q(1/2) i q(3/4).Zadatak napravite ručno i na računalu pomoću implementiranog algoritma iz prethodnog zadatka."
                );


            let label = document.createElement("label");
            label.className = "control-label";
            label.htmlFor = "select";
            label.innerHTML = "Odaberite podzadatak";

            let select = document.createElement("select");
            select.className = "col-lg-12 form-control";
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
                let deCasteljauPoint = new DeCasteljauPoint(1 / 2);
            };


            o2.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);
                let deCasteljauPoint = new DeCasteljauPoint(3 / 4);
            };


            o3.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);
                let deCasteljauVector = new DeCasteljauVector(1 / 2);
            };


            o4.onclick = () => {
                $("#taskCom").empty();


                $("#taskCom").append(label).append(select);

                $("#select").append(o1).append(o2).append(o3).append(o4);
                let deCasteljauVector = new DeCasteljauVector(3 / 4);
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

            let c = new BezierSeparation(CanvasUi.canvas);
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

            let d = new NBezier(CanvasUi.canvas);

        });

    $("#task6")
        .click(() => {
            CanvasUi.refresh($("#task6"));

            $("#taskTitle").html(() => "Zadatak 14.");

            $("#taskDescription")
                .html(() =>
                    "Opisite De Casteljaunov algoritam za izracunavanje vrijednosti Bezierove krivulje stupnja k u proizvoljnoj tocki i dajte geometrijsku interpretaciju tog algoritma.Dokazite ispravnost algoritma.Objasnite koja je prednost takvog nacina racunanja pred standardnim nacinom.Implementirajte taj algoritam na racunalu koji ce na ulazu imati kontrolne tocke Bezierove krivulje q i parametar u ∈[0, 1], a na izlazu ce dati q(u)."
                );

            let deCasteljauPoint = new DeCasteljauPoint(0.2);


        });

    $("#task7")
        .click(() => {
            CanvasUi.refresh($("#task7"));
            $("#taskTitle").html(() => "Zadatak 17.");
            $("#taskDescription")
                .html(() =>
                    "Napravite na računalu program koji će nacrtati dvije Bezierove krivulje stupnja tri zajedno s njihovim kontrolnim točkama tako da druga krivulja ima početak u točki u kojoj je prva završila. Program neka bude interaktivan tako da je moguće mišem mijenjati kontrolne točke kako bi se dobivali različiti oblici tih krivulja. Probajte micanjem kontrolnih točaka dobiti G1 odnosno C 1 neprekidnu krivulju. Olakšajte korisniku dobivanje tih neprekidnosti direktnim klikom na određenu tipku koja će o tome brinuti");

            let bS = new BezierSeparation(CanvasUi.canvas);


        });

    $("#task8")
        .click(() => {
            CanvasUi.refresh($("#task8"));
            $("#taskTitle").html(() => "Zadatak 19., k = 2");

            $("#taskDescription")
                .html(() =>
                    "Napisite program koji ce za danu Bezierovu krivulju stupnja k zadanu svojim kontrolnim tockama prikazati i kontrolne tocke koje ce tu istu krivulju reprezentirati kao Bezierovu krivulju stupnja k + 1. Kontrolne tocke koje pripadaju razlicitim skupinama neka budu razlicito obojane. Tocke iz pojedinih skupina neka redom budu spojene isprekidanim linijama. Program mora korisniku dozvoliti mijenjanje polozaja kontrolnih tocaka. Program napravite za k = 2 i k = 3.");

            let bezierLifting = new BezierLifting(CanvasUi.canvas, 3);

        });

    $("#task9")
        .click(() => {
            CanvasUi.refresh($("#task9"));
            $("#taskTitle").html(() => "Zadatak 19., k = 3");

            $("#taskDescription")
                .html(() =>
                    "Napisite program koji ce za danu Bezierovu krivulju stupnja k zadanu svojim kontrolnim tockama prikazati i kontrolne tocke koje ce tu istu krivulju reprezentirati kao Bezierovu krivulju stupnja k + 1. Kontrolne tocke koje pripadaju razlicitim skupinama neka budu razlicito obojane. Tocke iz pojedinih skupina neka redom budu spojene isprekidanim linijama. Program mora korisniku dozvoliti mijenjanje polozaja kontrolnih tocaka. Program napravite za k = 2 i k = 3.");

            let bezierLifting = new BezierLifting(CanvasUi.canvas, 4);

        });
};