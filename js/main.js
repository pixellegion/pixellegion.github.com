/*jslint browser: true, devel: true*/
/*global moment*/

var stretch_start = moment("2019-01-01", "YYYY-MM-DD"),
  stretch_end = moment("2019-07-12 24:00", "YYYY-MM-DD HH:mm");

function getTimeBetween(startDate, endDate) {
  "use strict";
  var t = endDate - startDate,
    seconds = Math.floor((t / 1000) % 60),
    minutes = Math.floor(((t / (1000 * 60)) + 1) % 60),
    hours = Math.floor(((t / (1000 * 60 * 60)) + 1) % 24),
    days = Math.floor((t / (1000 * 60 * 60 * 24))) + 1;
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

var test = getTimeBetween(moment("2019-01-01", "YYYY-MM-DD"), moment("2019-07-12 24:00", "YYYY-MM-DD HH:mm"));
console.log(test.days + "d " + test.hours + ":" + test.minutes);

function getTimeUntil(endDate) {
  "use strict";
  return getTimeBetween(moment(), endDate);
}

function getTimeSince(startDate) {
  "use strict";
  return getTimeBetween(startDate, moment());
}

function initClock(clockId, barId, startDate, endDate) {
  "use strict";
  var clock = document.getElementById(clockId),
    bar = document.getElementById(barId),
    duration = getTimeBetween(startDate, endDate),
    timeInterval;

  timeInterval = setInterval(function () {
    var t = getTimeUntil(endDate),
      dayPercent = (100.0 - (t.days / duration.days * 100.0)).toFixed(2),
      hourPercent = (100.0 - (t.hours / 24 * 100.0)).toFixed(2),
      minPercent = (100.0 - (t.minutes / 60 * 100.0)).toFixed(2),
      secPercent = (100.0 - (t.seconds / 60 * 100.0)).toFixed(2);

    clock.innerHTML = t.days + 'days and ' +
                      t.hours + ':' +
                      t.minutes + ':' +
                      t.seconds + '<br>' +
                      'You are ' + dayPercent + '% there<br><br>';
    bar.innerHTML = '<div id="countdownBar">' +
                    '<div id="countdownDays" style="width:' + dayPercent + '%;">' +
                    '<div id="countdownHours" style="width:' + hourPercent + '%;">' +
                    '<div id="countdownMinutes" style="width:' + minPercent + '%;">' +
                    '<div id="countdownSeconds" style="width:' + secPercent + '%;">' +
                    '</div>' +
                    t.seconds + 's</div>' +
                    t.minutes + 'm</div>' +
                    t.hours + 'h</div>' +
                    t.days + 'd</div>';
    if (t.total <= 0) {
      clearInterval(timeInterval);
    }
  }, 1000);
}

initClock('stretch-clock', 'stretch-bar', stretch_start, stretch_end);

function initCalBar(calBarId, startDate, endDate) {
  "use strict";
  var calBar = document.getElementById(calBarId),
    duration = getTimeBetween(startDate, endDate),
    timeSince = getTimeSince(startDate),
    weekOffset = new Date(startDate).getDay(),
    days = new [].constructor(duration.days),
    hour,
    timeInterval,
    dayCount,
    weekCount,
    week;

  for (dayCount = 0; dayCount < duration.days; dayCount += 1) {
    days[dayCount] = document.createElement("div");
    days[dayCount].className = "calBarDay";
    if (dayCount < timeSince.days) {
      hour = document.createElement("div");
      hour.className = "calBarHour";
      days[dayCount].appendChild(hour);
    }
  }

  for (weekCount = 0, dayCount = -weekOffset; weekCount < (duration.days / 7); weekCount += 1) {
    week = document.createElement("div");
    week.className = "calBarWeek";
    calBar.appendChild(week);

    while (dayCount < ((weekCount + 1) * 7) - weekOffset && dayCount < duration.days) {
      if (dayCount >= 0) {
        week.appendChild(days[dayCount]);
      }
      dayCount += 1;
    }
  }

  timeInterval = setInterval(function () {
    var timeUntil = getTimeUntil(endDate),
      timeSince = getTimeSince(startDate),
      hourPercent = (100.0 - (timeUntil.hours / 24 * 100.0)).toFixed(2),
      hourBlock = document.createElement("div"),
      currentDay = days[timeSince.days - 1],
      dayCount;

    hourBlock.className = "calBarHour";
    hourBlock.style = "width: " + hourPercent + "%";

    // Remove any previous children
    while (currentDay.firstChild) {
      currentDay.removeChild(currentDay.firstChild);
    }

    currentDay.appendChild(hourBlock);
    //for (dayCount = 0; dayCount < timeSince.days; dayCount += 1) {
    //  days[dayCount].style = "background-color: black";
    //}
  }, 1000);
}

initCalBar('cal-bar', stretch_start, stretch_end);
