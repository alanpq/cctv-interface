const inputs = document.querySelectorAll("input")
const form = document.querySelector("form")
const data = new FormData(form);
let timer;
function debounce(func, timeout = 300){
  clearTimeout(timer);
  timer = setTimeout(func, timeout);
}

const inpE = (e) => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", window.location, true);


  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // X:\Documents\Projects\cctv-interface\build\videos 
  console.log(encodeURIComponent(e.target.name) + "=" + encodeURIComponent(e.target.value))
  xhr.send(encodeURIComponent(e.target.name) + "=" + encodeURIComponent(e.target.value));
}

inputs.forEach((inp) => {
  inp.addEventListener("keyup", (e) => {
    debounce(() => {inpE(e)}, 500)
  })
})