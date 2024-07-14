
const width = "270px";

function openNav(){
    document.querySelector(".sidenav").style.width = width;
    document.querySelector(".main").style.marginLeft = "260px";
    document.querySelector(".main").style.padding = '0 10px';
    document.querySelector("header").style.marginLeft = width;
    document.querySelector(".h2").style.width = "60vw";
    document.querySelector("h2").style.width = "100%";
    document.querySelector(".openBtn").style.visibility = "hidden" ;
}

function closeNav(){
    document.querySelector(".sidenav").style.width = 0;
    document.querySelector(".main").style.marginLeft = 0;
    document.querySelector("header").style.marginLeft = 0;
    document.querySelector(".openBtn").style.visibility = "visible";
}

closeNav();