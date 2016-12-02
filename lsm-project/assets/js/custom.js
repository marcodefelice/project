//custom js for page interaction

// on document load append listiening events
window.onload = function () {
    document.querySelector("#button")
        .addEventListener("click", function () {
            startAnimate("open");
        });

    parkingSlotManage();
};

function startAnimate(method) {

    //open widget
    var rect = document.querySelector('.widget');
    var from = method == "open" ? 15 : 100;
    var to = method == "open" ? 100 : 15;
    var duration = 500;

    //set time animation
    var start = new Date().getTime();
    var timer = setInterval(function () {
        var time = new Date().getTime() - start;

        //calculate the correct RANGE on incrase %
        var x = easeInOutQuart(time, from, to - from, duration);

        //setting up the new style
        rect.style.height = x + "%";
        rect.setAttribute('class', "widget " + method);

        //reset animation
        if (time >= duration) {
            clearInterval(timer);
            rect.setAttribute('class', "widget " + method + "--complete");
            rect.setAttribute('style', "");
        }
    }, 1000 / 60);

    //when animation is complete invert the funcion
    //if send OPEN it open a widget
    //if send CLOSE it close a windget
    var btn2 = document.querySelector('#button');
    btn2.addEventListener('click', function () {
        startAnimate(method == "open" ? "close" : "open");
    });
}


//t: current time
//b: beginning value
//c: change in value
//d: duration
function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    var result = -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    return result >= 99 ? 100 : result
}


//add to cart the parking widget for buy ones
function addToCart(obj) {
    var idParking = obj.getAttribute('id_parking');
    console.log("Buy parking ID: ", idParking);

    //start calling AJAX
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //response
            //TODO: inmplement callback function after positive response
        } else {
            alert("Implementare il metodo di acquistta");
            //TODO: implement callback function after ERROR
        }
    };
    xhttp.open("GET", "url-example-for-buy-parking.action", true);
    xhttp.send();
}

// manage the parking slot function for interaction
function parkingSlotManage() {
    var parkingSlots = document.getElementsByClassName("parkingSlots");
    for (var i = 0; i < parkingSlots.length; i++) {
        parkingSlots[i].addEventListener('click', function () {
            addToCart(this);
        });
    }

}



