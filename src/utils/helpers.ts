import countries from 'react-flags-select/lib/countries.js'
import { IHowto } from 'src/models/howto.models'
import { IMapPin } from 'src/models/maps.models'
import { IUser } from 'src/models/user.models'
import { DBDoc, IModerable } from 'src/models/common.models'

// remove special characters from string, also replacing spaces with dashes
export const stripSpecialCharacters = (text?: string) => {
  return text
    ? text
        .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .split(' ')
        .join('-')
    : ''
}

// remove dashes with spaces
export const replaceDashesWithSpaces = (str?: string) => {
  return str ? str.replace(/-/g, ' ') : ''
}

// take an array of objects and convert to an single object, using a unique key
// that already exists in the array element, i.e.
// [{id:'abc',val:'hello'},{id:'def',val:'world'}] = > {abc:{id:abc,val:'hello}, def:{id:'def',val:'world'}}
export const arrayToJson = (arr: any[], keyField: string) => {
  const json = {}
  arr.forEach(el => {
    if (el.hasOwnProperty(keyField)) {
      const key = el[keyField]
      json[key] = el
    }
  })
  return json
}

// Take a string and capitalises the first letter
// hello world => Hello world
export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/************************************************************************
 *              Date Methods
 ***********************************************************************/
export const timestampToYear = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.getFullYear()
}

export const getMonth = (d: Date, monthType: string = 'long') => {
  // use ECMAScript Internationalization API to return month
  return `${d.toLocaleString('en-us', { month: monthType })}`
}
export const getDay = (d: Date) => {
  return `${d.getDate()}`
}

/************************************************************************
 *             Validators
 ***********************************************************************/
export const isEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const hasAdminRights = (user?: IUser) => {
  if (!user) {
    return false
  }
  const roles =
    user.userRoles && Array.isArray(user.userRoles) ? user.userRoles : []

  if (roles.includes('admin') || roles.includes('super-admin')) {
    return true
  } else {
    return false
  }
}

export const needsModeration = (doc: IModerable, user?: IUser) => {
  if (!hasAdminRights(user)) {
    return false
  }
  return doc.moderation !== 'accepted'
}

export const isAllowToEditContent = (doc: IEditableDoc, user?: IUser) => {
  if (!user) {
    return false
  }
  const roles =
    user.userRoles && Array.isArray(user.userRoles) ? user.userRoles : []
  if (
    roles.includes('admin') ||
    roles.includes('super-admin') ||
    (doc._createdBy && doc._createdBy === user.userName)
  ) {
    return true
  } else {
    return false
  }
}

export const isAllowToPin = (pin: IMapPin, user?: IUser) => {
  if (hasAdminRights(user) || (pin._id && user && pin._id === user.userName)) {
    return true
  } else {
    return false
  }
}

/************************************************************************
 *             Country code to country name converters
 ***********************************************************************/
export const getCountryCode = (countryName: string | undefined) => {
  let countryCode = Object.keys(countries).find(
    key => countries[key] === countryName,
  )
  if (countryCode !== undefined) {
    countryCode = countryCode.toLowerCase()
  }
  return countryCode
}

export const getCountryName = (countryCode: string | undefined) => {
  if (countries.hasOwnProperty(countryCode)) {
    return countries[countryCode]
  } else {
    return countryCode
  }
}

// ensure docs passed to edit check contain _createdBy field
interface IEditableDoc extends DBDoc {
  _createdBy: string
}
