const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0");
const year = today.getFullYear();
const date = `${day}-${month}-${year}`;
const dayName = today.toLocaleDateString("ar-SA", {
    weekday: "long"
});

document.getElementById("date").innerHTML = date;
document.getElementById("day").innerHTML = dayName;

function convertTo12Hour(hour24) {
    let [hour, minute] = hour24.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    const time12 = date.toLocaleTimeString("ar-SA", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
    return time12;
}

function addMinutes(time, minutesToAdd) {
    let [hour, minute] = time.split(":");
    hour = Number(hour);
    minute = Number(minute);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute + minutesToAdd);
    return date.toLocaleTimeString("ar-SA", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

function showTimes(cityName) {
    axios.get(`https://api.aladhan.com/v1/timingsByCity/${date}?city=${cityName}&country=SA&method=4`)
    .then(response => {
        let times = response.data.data.timings;
        let timesContent = `
            <thead>
                <tr>
                    <th>الصلاة</th>
                    <th>الأذان/دخول الوقت</th>
                    <th>الإقامة</th>
                </tr>
            </thead>
            <tbody>
                <tr id="fajer">
                    <td>الفجر</td>
                    <td>${convertTo12Hour(times.Fajr)}</td>
                    <td>${addMinutes(times.Fajr, 25)}</td>
                </tr>
                <tr id="ishraq">
                    <td>الإشراق</td>
                    <td>${convertTo12Hour(times.Sunrise)}</td>
                    <td>-</td>
                </tr>
                <tr id="duhur">
                    <td>الظهر</td>
                    <td>${convertTo12Hour(times.Dhuhr)}</td>
                    <td>${addMinutes(times.Dhuhr, 20)}</td>
                </tr>
                <tr id="asir">
                    <td>العصر</td>
                    <td>${convertTo12Hour(times.Asr)}</td>
                    <td>${addMinutes(times.Asr, 20)}</td>
                </tr>
                <tr id="magrib">
                    <td>المغرب</td>
                    <td>${convertTo12Hour(times.Maghrib)}</td>
                    <td>${addMinutes(times.Maghrib, 10)}</td>
                </tr>
                <tr id="isha">
                    <td>العشاء</td>
                    <td>${convertTo12Hour(times.Isha)}</td>
                    <td>${addMinutes(times.Isha, 20)}</td>
                </tr>
            </tbody>
        `;
        document.getElementById("prayers").innerHTML = timesContent;
    })
}

const selectCities = document.getElementById("cities");

let savedCity = localStorage.getItem("selectedCity");

if (savedCity) {
    selectCities.value = savedCity;
} else {
    savedCity = selectCities.value;
    localStorage.setItem("selectedCity", savedCity);
}

showTimes(savedCity);

selectCities.addEventListener("change", function() {
    localStorage.setItem("selectedCity", selectCities.value);
    showTimes(selectCities.value);
});