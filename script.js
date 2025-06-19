let city,lat,lon;
let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,precipitation_probability,uv_index&current_weather=true&timezone=auto`;
async function getWeather() {
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getCoords(city) {
    try{
        let res=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        let data=await res.json();
        return data;
    }catch(e){
        console.log("Error: ",e);
    }
}

let form=document.querySelector('form');
let input=document.querySelector('input');
city=document.querySelector('.main-card h1');

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    city.innerText=input.value.trim();
    getCoords(city).then((coords)=>{
        console.log(coords);
    })

})
