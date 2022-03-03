let background = true;

window.onload = init();

function toggleBackground(){
    background = !background;
    console.log(background);
    if(background == false){
      document.getElementById("bg").style = "display: none;";
      document.getElementById("togglebg").innerHTML = "Turn on background"
    }
    if(background == true){
      document.getElementById("bg").style = "display:inline";
      document.getElementById("togglebg").innerHTML = "Turn off background"
    }
  }

  function init(){
    const toggle = document.getElementById("togglebg");
    toggle.addEventListener("click", toggleBackground);
  }