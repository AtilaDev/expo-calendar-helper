import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';

_askForCalendarPermissions = async () => {
  const response = await Permissions.askAsync(Permissions.CALENDAR);
  return response.status === 'granted';
};

_askForReminderPermissions = async () => {
  if (Platform.OS === 'android') {
    return true;
  }

  const response = await Permissions.askAsync(Permissions.REMINDERS);
  return response.status === 'granted';
};

_findCalendars = async () => {
  const calendarGranted = await this._askForCalendarPermissions();
  const reminderGranted = await this._askForReminderPermissions();
  let calendars = [];

  if (calendarGranted && reminderGranted) {
    calendars = await Calendar.getCalendarsAsync();
  }

  return calendars;
};

_createNewCalendar = async (calendars, calendarTitle, calendarColor) => {
  const newCalendar = {
    title: calendarTitle,
    entityType: Calendar.EntityTypes.EVENT,
    color: calendarColor,
    sourceId:
      Platform.OS === 'ios'
        ? calendars.find(cal => cal.source && cal.source.name === 'iCloud')
            .source.id
        : undefined,
    source:
      Platform.OS === 'android'
        ? {
            name: calendars.find(
              cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
            ).source.name,
            isLocalAccount: true
          }
        : undefined,
    name: calendarTitle,
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    ownerAccount:
      Platform.OS === 'android'
        ? calendars.find(
            cal => cal.accessLevel == Calendar.CalendarAccessLevel.OWNER
          ).ownerAccount
        : undefined
  };

  let calendarId = null;

  try {
    calendarId = await Calendar.createCalendarAsync(newCalendar);
  } catch (e) {
    // console.log(e.message);
  }

  return calendarId;
};

// --------------------------------------------------------------------------
// askPermissionsAsync(): ask for permissions to access to calendar
// --------------------------------------------------------------------------
// return granted string if you gave permissions to access calendar,
// return null if you not
// --------------------------------------------------------------------------
export const askPermissionsAsync = async () => {
  const calendarGranted = await this._askForCalendarPermissions();
  const reminderGranted = await this._askForReminderPermissions();

  if (calendarGranted && reminderGranted) {
    return 'granted';
  } else {
    return null;
  }
};

// --------------------------------------------------------------------------
// newCalendar(): create a new Calendar
// --------------------------------------------------------------------------
// this receive three parameters:
//
// * calendarTitle: Calendar title
// * calendarColor: Calendar color
// * nameCalendarStore: name to save in the mobile using Expo.SecureStore
//
// inside <nameCalendarStore> is stored the calendarId, you can get it using
// Expo.SecureStore.getItemAsync()
// --------------------------------------------------------------------------
export const newCalendar = async (
  calendarTitle,
  calendarColor,
  nameCalendarStore
) => {
  let calendars = await this._findCalendars();
  const calendarId = await this._createNewCalendar(
    calendars,
    calendarTitle,
    calendarColor
  );
  await SecureStore.setItemAsync(nameCalendarStore, calendarId);
};

// --------------------------------------------------------------------------
// deleteCalendarId(): delete a calendar
// --------------------------------------------------------------------------
// this receive one parameter:
//
// * nameCalendarStore: name to load the calendarId from the mobile using
//   Expo.SecureStore saved in the mobile created using newCalendar()
// --------------------------------------------------------------------------
export const deleteCalendarId = async nameCalendarStore => {
  const calendarId = await SecureStore.getItemAsync(nameCalendarStore);
  if (calendarId) {
    await Calendar.deleteCalendarAsync(calendarId);
    await SecureStore.deleteItemAsync(nameCalendarStore);
  }
};

// --------------------------------------------------------------------------
// addEventsToCalendar(): add an event to calendar
// --------------------------------------------------------------------------
// this receive four parameters:
//
// * nameCalendarStore: name to load the calendarId from the mobile using
//   Expo.SecureStore saved in the mobile created using newCalendar()
// * eventTitle: event title
// * eventStartDate: event start date
// * eventEndDate: event end date
// --------------------------------------------------------------------------
export const addEventsToCalendar = async (
  nameCalendarStore,
  eventTitle,
  eventStartDate,
  eventEndDate
) => {
  const calendarId = await SecureStore.getItemAsync(nameCalendarStore);
  const event = {
    title: eventTitle,
    startDate: eventStartDate,
    endDate: eventEndDate,
    timeZone: Localization.timezone,
    alarms: [
      {
        relativeOffset: 0,
        method: Calendar.AlarmMethod.ALERT
      }
    ]
  };

  try {
    await Calendar.createEventAsync(calendarId, event);
  } catch (e) {
    // console.log(e);
  }
};
