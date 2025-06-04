let city,lat,lon;
const now=new Date();
const hours = now.getHours();
async function getWeather(lat,lon) {
  try {
    let res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,precipitation_probability,uv_index,weathercode&current_weather=true&timezone=auto`);
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
const weatherCodeMap = {
  0: { label: "Clear", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Cloudy", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌁" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌧️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Dense freezing", icon: "❄️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Light freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing", icon: "❄️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Mod. showers", icon: "🌧️" },
  82: { label: "Heavy showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow show.", icon: "🌨️" },
  95: { label: "Storm", icon: "🌩️" },
  96: { label: "Storm + light hail", icon: "🧊" },
  99: { label: "Storm + heavy hail", icon: "🧊" }
};

let form=document.querySelector('form');
let input=document.querySelector('input');
city=document.querySelector('.main-card h1');



let nav=document.querySelector('.time-forecast');

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    city.innerText=input.value.trim();

    getCoords(input.value.trim()).then((coords)=>{
        if(coords.results && coords.results.length>0){
            lat=coords.results[0].latitude;
            lon=coords.results[0].longitude;

            getWeather(lat,lon).then((details)=>{
                document.querySelector('.temp').innerText=details.current_weather.temperature+" °C";
                console.log(details.hourly);
                

                nav.innerHTML = '';
                let arr=[0,0,0,0];
                for(let i=0;i<=23;i++){
                    let time = document.createElement('span');
                    let span = document.createElement('span');
                    let tempspan = document.createElement('span');
                    let div=document.createElement('div');
                    time.innerText=details.hourly.time[i].slice(-5);
                    if(hours==time.innerText.substring(0,2)){
                        arr[0]=details.hourly.precipitation_probability[i];
                        arr[1]=details.hourly.relative_humidity_2m[i];
                        arr[2]=details.hourly.uv_index[i];
                        arr[3]=details.hourly.weathercode[i];
                    }
                    span.innerHTML=`<span>${weatherCodeMap[details.hourly.weathercode[i]].icon}</span>`+weatherCodeMap[details.hourly.weathercode[i]].label;
                    tempspan.innerHTML=`<span>${details.hourly.temperature_2m[i]}/</span>${details.hourly.precipitation_probability[i]}`;
                    div.append(time);
                    div.append(span);
                    div.append(tempspan);
                    nav.append(div);                   
                    nav.append(document.createElement('hr'));
                }
                document.querySelector('.feel h3').innerText=arr[1]+'%';
                document.querySelector('.rain h3').innerText=arr[0]+'%';
                document.querySelector('.uv h3').innerText=arr[2];
                document.querySelector('.wind h3').innerText=details.current_weather.windspeed+' km/h';
                document.querySelector('.main-card i').innerText=weatherCodeMap[arr[3]].icon;
            })

        }
        else{
            console.log("City not Found")
        }
    })


})
