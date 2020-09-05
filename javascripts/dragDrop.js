
dragDrop = {
    processEffectFunc: function (ev, effectFunc) {
        try {
            effectFunc(ev);
        } catch(err) {
            console.log("effectFunc broke **************************** " + err.message);
        }
    },

    allowDrop: function (ev, effectFunc) {
        this.processEffectFunc(ev, effectFunc);
        ev.preventDefault();
    },

    drag: function (ev, effectFunc) {
        this.processEffectFunc(ev, effectFunc);
        console.log("drag");
        console.log(ev.target);
        ev.dataTransfer.setData("text", ev.target.id);
        console.log(ev.target.innerHTML);
    }, 

    drop: function (ev, effectFunc) {
        this.processEffectFunc(ev, effectFunc);
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        console.log("drop");
        console.log(data);
        console.log(document.getElementById(data));
        ev.target.innerHTML = document.getElementById(data).innerHTML;
    },
}