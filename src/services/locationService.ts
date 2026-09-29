import type { Coordinates } from '../logic/findNearestMall'

function messageFor(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission was denied. Allow it in your browser to use this.'
    case error.POSITION_UNAVAILABLE:
      return 'Your location is unavailable right now.'
    case error.TIMEOUT:
      return 'Finding your location took too long. Please try again.'
    default:
      return 'Could not get your location.'
  }
}

export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Location is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => reject(new Error(messageFor(error))),
      { timeout: 10_000, maximumAge: 60_000 },
    )
  })
}