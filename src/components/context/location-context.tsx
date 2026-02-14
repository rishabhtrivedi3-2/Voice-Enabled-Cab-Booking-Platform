'use client'

import { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
const LocationContext = createContext(null)
export function LocationProvider ({ children }) {
  const [location, setLocation] = useState(null)
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )

      const data = await res.json()
       console.log(data);
      setLocation({
        city: data.city,
        country: data.countryName,
        longitude,
        latitude
      })
    })
  }, [])

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  )
}
export function useLocation () {
  return useContext(LocationContext)
}
