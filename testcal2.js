/* Return first day of specified week of month of year
**
** @param {number|string} year - year for required week
** @param {number|string} month - month for required week
**         Month is calendar month number, 1 = Jan, 2 = Feb, etc.
** @param {number|string} week - week of month
**         First week of month is the one with the first Thursday
** @returns {Date} date for Monday at start of required week
*/
function getMonthWeek(year, month, week) {
    // Set date to 4th of month
    let d = new Date(year, month -1 , 4 );
    // Get day number, set Sunday to 7
    let day = d.getDay() || 7;
    // Set to prior Monday
    d.setDate(d.getDate() - day + 1);
    // Set to required week
    d.setDate(d.getDate() + 7 * (week));
    return d;
  }
  
  // Return array of dates for specified week of month of year
  function getWeekDates(year, month, week,dayofweek) {
    let d = getMonthWeek(year, month, week);
    for (var i=0, arr=[]; i<7; i++) {
  
      // Array of date strings
      arr.push(d.toDateString());
  
      // For array of Date objects, replace above with
      // arr.push(new Date(d));
  
      // Increment date
      d.setDate(d.getDate() + 1);
    }
    // if(dayofweek = 1){
    //     return arr[6]
    // }
    console.log('dayofweek : ',dayofweek)
    return arr[dayofweek-1];
  }
  
  // Week dates for week 1 of Jan 2020 - week starts in prior year
  console.log(getWeekDates(2023,3,1,3));

  console.log(getMonthWeek(2023,3,1));
  // Week dates for week 5 of Jan 2020 - 5 week month
 