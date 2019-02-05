# expo-calendar-helper

This package will help you to ask permissions to access to calendar and reminders, create new calendar, add events to calendar and delete that one by calendarId.

### Installation

```
$ npm install expo-calendar-helper
or
$ yarn add expo-calendar-helper
```

#

### Usage

#### To ask permissions and create a new calendar

```
import { askPermissionsAsync, newCalendar } from 'expo-calendar-helper';

createCalendar = async () => {
    const status = await askPermissionsAsync();
    if (status) {
      newCalendar('MAZINGER Z','lightgreen', 'mazingerSecureStore');
    } else {
      alert(
        'The app need permissions to access to calendar.'
      );
    }
  };
```

## askPermissionsAsync():

return granted string if you gave permissions to access calendar, return null if you not.

## newCalendar():

### create a new calendar.

- calendarTitle: Calendar title
- calendarColor: Calendar color
- nameCalendarStore: name to save in the mobile using Expo.SecureStore
  inside "nameCalendarStore" is stored the calendarId, you can get it using
  Expo.SecureStore.getItemAsync()

#

#### To add a new event

```
import { addEventsToCalendar } from 'expo-calendar-helper';

addEvent = (nameCalendarStore, eventTitle, startDate, endDate) => {
    try {
      addEventsToCalendar(nameCalendarStore, eventTitle, startDate, endDate);
    } catch (e) {
      console.log(e.message);
    }
  };
```

## addEventsToCalendar():

### add an event to calendar

this receive four parameters:

- nameCalendarStore: name to load the calendarId from the mobile using
  Expo.SecureStore saved in the mobile created using newCalendar()
- eventTitle: event title
- eventStartDate: event start date
- eventEndDate: event end date

#

#### To delete a calendar

```
import { deleteCalendarId } from 'expo-calendar-helper';

deleteCalendarId(nameCalendarStore);
```

## deleteCalendarId():

### delete a calendar

this receive one parameter:

- nameCalendarStore: name to load the calendarId from the mobile using
  Expo.SecureStore saved in the mobile created using newCalendar()

#

## Thanks to:

#### Stanisław Chmiela

for helping me create a new calendar on iOS.

#### SleepyFanjo

for sharing how to create an event on iOS.

#### Expo Team

for creating a great framework to work with react native.

#

## All collaborations are welcome!

### If you find this helper useful, will you help me with a star? Thank you!

#

## Licensing

This project is licensed under MIT license.
