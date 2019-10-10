import { put, call } from 'redux-saga/effects'
import { ADD_CONTACTS_TO_FOLLOW_SUCCESS, ADD_CONTACTS_TO_FOLLOW_FAIL } from 'actions'
import { Contact } from 'blockstack-collections'
import requestFollow from '../../actions/follow/requestFollow'
import followUser from '../follow/followUser'

const fetchContacts = async () => {
  let contacts = []

  return Contact.list((contactID) => {
    console.log(contactID)
    contacts.push(contactID)
    return true
  }).then(() => {
    return contacts
  })
}

function* followContact(contact, sessionUsername) {
  if (contact.attrs && contact.attrs.blockstackID) {
    console.log("request to add user " + contact.attrs.blockstackID)
    yield followUser(requestFollow(sessionUsername, contact.attrs.blockstackID))
   }
}

function* addContactsToFollowSage(action) {
  const sessionUsername = action.payload.username
  try {
    const contacts = yield call(fetchContacts)
    var contactID
    var index
    for (index in contacts) {
      contactID = contacts[index]
      const contact = yield Contact.get(contactID)
      yield followContact(contact, sessionUsername)
    }
    yield put({ type: ADD_CONTACTS_TO_FOLLOW_SUCCESS, payload: {}})
  } catch (error) {
    console.log(error)
    yield put({ type: ADD_CONTACTS_TO_FOLLOW_FAIL, payload: error.message })
  }
}

export default addContactsToFollowSage
