function showElement() {
    var ele = document.getElementById("chatpanel");
    var ele2 = document.getElementById("contactpanel");
    //var ele3 = document.getElementById("logpanel");

    var text = document.getElementById("nickbutton");

    if (ele.style.display == "block") {
        ele.style.display = "none";
        text.innerHTML = "show";
    }
    if (ele2.style.display == "block") {
        ele2.style.display = "none";
        text.innerHTML = "show";
    }
    /*if (ele3.style.display == "block") {
        ele3.style.display = "none";
        text.innerHTML = "show";
    }
    else {
        ele.style.display = "block";
        ele2.style.display = "block";
        //ele3.style.display = "block";
        text.innerHTML = "hide";
    }*/
}