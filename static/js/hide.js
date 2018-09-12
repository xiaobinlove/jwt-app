var maxmnus = 5
function opTab(){
    var mnu = document.getElementById("menubar")
    var arrdiv = document.getElementById("arrow")
    var arrtxt = document.getElementById("arr")
    if((mnu.style.display != "block") || (mnu.style.display == "")){
        mnu.style.display = "block"
        arrdiv.style.pixelLeft = mnu.style.width.substring(0 , mnu.style.width.length - 2)
        arrtxt.innerText = "3";
    } else {
        mnu.style.display = "none"
        arrtxt.innerText = "4";
        arrdiv.style.pixelLeft = 0;
    }
    event.cancelBubble = true;
}
function toggleMenu(el){
    for(var i = 0;i < maxmnus;i++) document.getElementById(document.getElementById("c" + i).menu).style.display = "none";
    if(el.status == "closed"){
        el.status = "open"
        document.getElementById(el.menu).style.display = "block";
    } else {
        el.status = "closed"
    }
}
function toggleSub(e){
    el = document.getElementById(e)
    if(el.status == "closed"){
        el.style.display = "block";
        el.status = "open"
    } else {
        el.style.display = "none";
        el.status = "closed"
    }
    event.cancelBubble = true;
}