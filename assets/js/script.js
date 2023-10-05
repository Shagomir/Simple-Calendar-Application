// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// start and end hours in 24 hour time. The calendar builds an element for each hour here, inclusive.
var startHour = 10;
var endHour = 23;
endHour++; // increment the end hour by one for the true end hour.

$(function () {
  function buildCalendar() {
    var calendarHour;
    var currentHour = Number(dayjs().format("H")); //forcing a number for relativeTime calculation

    for (i = startHour; i < endHour; i++) {
      calendar = dayjs().hour(i);
      calendarHour = Number(dayjs(calendar).format("H")); //forcing a number for relativeTime calculation

      if (currentHour == calendarHour) {
        relativeTime = "present";
        console.log("current", currentHour);
        console.log("calendar", calendarHour);
        console.log(relativeTime);
      } else if (currentHour > calendarHour) {
        relativeTime = "past";
        console.log("current", currentHour);
        console.log("calendar", calendarHour);
        console.log(relativeTime);
      } else {
        relativeTime = "future";
        console.log("current", currentHour);
        console.log("calendar", calendarHour);
        console.log(relativeTime);
      }
      var calendarHourHtmlstring =
        '<div id="hour-' +
        i + //using the hour to set the ID
        '" class="row time-block ' +
        relativeTime + //setting past/present/future
        '">' +
        '<div class="col-2 col-md-1 hour text-center py-3">' +
        dayjs(calendar).format("h A") + //adding the text description
        "</div>" +
        '<textarea class="col-8 col-md-10 description" rows="3"> </textarea>' +
        //calendarItem[i].text + //adding the text from the extracted list of calendar items
        '<button class="btn saveBtn col-2 col-md-1" aria-label="save">' +
        '<i class="fas fa-save" aria-hidden="true"></i></button>' +
        "</div>";

      $("#calendar-container").append(calendarHourHtmlstring);
    }
  }
  buildCalendar();

  // function getCalendarItems

  // function saveCalendarItems

  // function applyTimeFormatting

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});
