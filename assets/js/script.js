// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// start and end hours in 24 hour time. The calendar builds an element for each hour here, inclusive.
var startHour = 9;
var endHour = 17;
endHour++; // increment the end hour by one for the true end hour.

$(function () {
  var isoDate = dayjs().format("YYYY-MM-DD");
  var localCalendarEvents = {
    date: isoDate,
    events: [],
  };
  // Displays the current date in the header of the page.
  function displayDate() {
    var today = dayjs().format("dddd, MMMM D, YYYY");
    $("#currentDay").text(today);
  }

  // function that is called when initializing the event list or when saving a new event.
  function saveCalendarItems() {
    localCalendarEvents.date = isoDate; // we save the date on isodate updates
    localStorage.setItem(
      "storedCalendarEvents",
      JSON.stringify(localCalendarEvents)
    );
  }

  // on page load, checks if there are stored events from today. If there are, 
  // it will load the events so they can be placed into the generated elements. 
  // If the data is not stored or the day is different, it will clear out the 
  // list and rebuild the data structure.
  function checkStoredCalendarEvents() {
    var storedCalendarEvents = JSON.parse(
      localStorage.getItem("storedCalendarEvents")
    );
    if (
      storedCalendarEvents !== null &&
      storedCalendarEvents.date === isoDate
    ) {
      console.log("loaded saved events!");
      localCalendarEvents = storedCalendarEvents;
    } else {
      console.log("clearing and initializing events!");
      for (i = 0; i < 24; i++) {
        localCalendarEvents.events[i] = " ";
      }
      saveCalendarItems(); // call the save function to make sure it's updated if we reset.
    }
  }

  function buildCalendar() {
    var calendarHour;
    var currentHour = Number(dayjs().format("H")); //forcing a number for relativeTime calculation

    //Loop through and build an element for each hour. While we do this, we add an ID based on the hour, add
    for (i = startHour; i < endHour; i++) {
      calendar = dayjs().hour(i);
      calendarHour = Number(dayjs(calendar).format("H")); //forcing a number for relativeTime calculation

      if (currentHour == calendarHour) {
        relativeTime = "present";
      } else if (currentHour > calendarHour) {
        relativeTime = "past";
      } else {
        relativeTime = "future";
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
        '<textarea class="col-8 col-md-10 description" rows="3">' + // TODO: Add code to get any user input that was saved in localStorage and set
        // the values of the corresponding textarea elements. HINT: How can the id
        // attribute of each time-block be used to do this?
        localCalendarEvents.events[i] +
        "</textarea>" +
        '<button class="btn saveBtn col-2 col-md-1" aria-label="save">' +
        '<i class="fas fa-save" aria-hidden="true"></i></button>' +
        "</div>";

      $("#calendar-container").append(calendarHourHtmlstring);
    }
  }
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?

  //event listener for buttons. Checks the ID of the button's parent and passes the text content to be stored in the corresponding field.
  $(document).on("click", "button", function () {
    var localID = Number(String($(this).parent().attr("id")).substring(5));
    console.log(localID);

    localCalendarEvents.events[localID] = $(this)
      .siblings(".description")
      .val();

    console.log($(this).siblings("textarea").val());
    saveCalendarItems();
  });

  displayDate();
  checkStoredCalendarEvents();
  buildCalendar();
});
