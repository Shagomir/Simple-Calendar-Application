// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// start and end hours in 24 hour time. The calendar builds an element for each hour here, inclusive.
// default values are 9 and 17 (aka 9am to 5pm)
var startHour = 9;
var endHour = 17;
endHour++; // increment the end hour by one for the true end hour because we want the end time to be inclusive.

$(function () {
  // we use the ISO8601 date format to store the date because we live in a society.
  var isoDate = dayjs().format("YYYY-MM-DD"); 

  // initializing the local event object.
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
    localCalendarEvents.date = isoDate; // we save the ISO date on updates
    localStorage.setItem(
      "storedCalendarEvents",
      JSON.stringify(localCalendarEvents)
    );
  }

  // on page load, checks if there are stored events from today. If there are,
  // it will load the events so they can be placed into the generated elements.
  // If the data is not stored or the day is different, it will clear out the
  // event object and rebuild the data structure.
  function checkStoredCalendarEvents() {
    var storedCalendarEvents = JSON.parse(
      localStorage.getItem("storedCalendarEvents")
    );
    if (
      storedCalendarEvents !== null && // make sure there is something stored
      storedCalendarEvents.date === isoDate // make sure we only load events from today
    ) {
      console.log("loaded saved events!");
      localCalendarEvents = storedCalendarEvents; // create the local event table
    } else {
      console.log("clearing and initializing events!");
      for (i = 0; i < 24; i++) {
        // we use 24 hours to keep the hour-# IDs in-line with the index of this array.
        localCalendarEvents.events[i] = " ";
      }
      saveCalendarItems(); // call the save function to make sure it's updated if we reset.
    }
  }
  // this is what builds the dynamic elements for the calendar. 
  function buildCalendar() {
    var currentHour = Number(dayjs().format("H")); //forcing a number for relativeTime calculation. We don't need to do this every loop.

    //Loop through and build an element for each hour.
    for (i = startHour; i < endHour; i++) {
      var calendar = dayjs().hour(i); // this returns a dayjs object - we have to format it to do a simple number comparison.
      var calendarHour = Number(dayjs(calendar).format("H")); //forcing a number for relativeTime calculation.

      // calculating the relative time and setting the variable for the class attribute
      if (currentHour == calendarHour) {
        relativeTime = "present";
      } else if (currentHour > calendarHour) {
        relativeTime = "past";
      } else {
        relativeTime = "future";
      }
      // we create a string containing the HTML we want, adding in the specific variables and text.
      var calendarHourHtmlstring =
        '<div id="hour-' +
        i + //using the hour to set the ID
        '" class="row time-block ' +
        relativeTime + //setting past/present/future
        '">' +
        '<div class="col-2 col-md-1 hour text-center py-3">' +
        dayjs(calendar).format("h A") + //adding the hour to the box
        "</div>" +
        '<textarea class="col-8 col-md-10 description" rows="3">' +
        localCalendarEvents.events[i] + // fill in the text area with the saved text corresponding to this hour.
        "</textarea>" +
        '<button class="btn saveBtn col-2 col-md-1" aria-label="save">' +
        '<i class="fas fa-save" aria-hidden="true"></i></button>' +
        "</div>";

        //append the string to the main div. It becomes HTML elements through the power of love, friendship, and javascript.
      $("#calendar-container").append(calendarHourHtmlstring); 
      
    }
  }

  // event listener for buttons. Checks the ID of the button's parent and passes the text
  // content to be stored in the corresponding index of the events array in the event object.
  // we use event delegation here since the buttons are dynamic elements. 
  $(document).on("click", "button", function () {
    var localID = Number(String($(this).parent().attr("id")).substring(5));

    //traversing the DOM to grab the textarea contents and save them to the event object.
    localCalendarEvents.events[localID] = $(this)
      .siblings(".description")
      .val();

    //don't forget to save your work!
    saveCalendarItems();
  });

  // runs these at page load to create the initial state of the page.
  displayDate();
  checkStoredCalendarEvents();
  buildCalendar();
});
