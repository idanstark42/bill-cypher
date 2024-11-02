import { MongoClient } from './backend.js'

import Item from './item.js'
import Person from './person.js'

export default class Session {
  constructor (id, data, created, updated) {
    this.id = id
    this.data = data
    this.created = created
    this.updated = updated
    this.listeners = []
  }

  // Getters

  get shareURL () {
    return `${window.location.origin}/participate/${this.id}`
  }

  get total () {
    if (this.data.additions.total === undefined) return -1
    return this._numberFromIndex(this.data.additions.total[0])
  }

  get tip () {
    if (this.data.additions.tip === undefined) return 0
    if (this.data.additions.tip[0].value) return this.data.additions.tip[0].value
    return this._numberFromIndex(this.data.additions.tip[0])
  }

  set tip (value) {
    this.update({ $set: { 'data.additions.tip': [{ value }] } })
  }

  get discount () {
    if (this.data.additions.discount === undefined) return 0
    if (this.data.additions.discount[0].value) return this.data.additions.discount[0].value
    return this._numberFromIndex(this.data.additions.discount[0])
  }

  set discount (value) {
    this.update({ $set: { 'data.additions.discount': [{ value }] } })
  }

  get items () {
    return this.data.selectedNumbers.map(index => new Item(index, this))
  }

  get people () {
    return this.data.participants.map(person => new Person(person.id, this))
  }

  get user () {
    return this.currentParticipant && this.currentParticipant.id ? new Person(this.currentParticipant.id, this) : undefined
  }

  async loginAs (person) {
    if(!this.data.participants.some(participant => participant.id === person.id)) {
      await this.update({ $push: { 'data.participants': person } })
    }
    this.currentParticipant = person
  }

  personalTotal (person) {
    return 0
  }

  // private methods

  _numberFromIndex (index) {
    return this.data.corrections[index] || this.data.numbers[index].value
  }

  _priceAfterAdditions (price) {
    return price * (1 + this.tip / 100) (1 - this.discount / 100)
  }

  // IO methods

  onUpdated (listener) {
    this.listeners.push(listener)
  }

  async update (update, options) {
    const updated = new Date()
    if (update.$set) update.$set.updated = updated
    else update.$set = { updated }
    await (await Session.collection()).updateOne({ _id: { $oid: this.id } }, update, options)
    const response = await (await Session.collection()).findOne({ _id: { $oid: this.id } })
    this.data = response.data
  }

  async sync () {
    if (Date.now() - this.lastSync < 3000) return
    const lastSync = new Date()
    const updated = await Session.load(this.id)
    if (this.updated < updated.updated) {
      this.data = updated.data
      this.updated = updated.updated
      this.listeners.forEach(listener => listener())
    }
  }

  static async load (id) {
    const session = await (await Session.collection()).findOne({ _id: { $oid: id } })
    return new Session(id, session.data, session.created, session.updated)
  }

  static async create (data) {
    const created = new Date()
    const response = await (await Session.collection()).insertOne({ data, created, updated: created })
    const { insertedId } = response
    return new Session(insertedId, data, created, created)
  }

  static async collection () {
    const client = new MongoClient()
    await client.auth()
    return await client.collection('sessions')
  }
}