import { MongoClient } from './backend.js'

import Item from './item.js'

export default class Session {
  constructor (id, data, created, updated) {
    this.id = id
    this.data = data
    this.created = created
    this.updated = updated
  }

  get shareURL () {
    return `${window.location.origin}/participate/${this.id}`
  }

  get people () {
    const people = this.data.people.map(person => ({ name: person.name, items: [], sessionData: person }))
    this.data.numbers.forEach(item => {
      const peopleCount = this.data.people.filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))).length
      if (peopleCount === 0) return
      this.data.people
        .filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item)))
        .forEach(person => { people.find(p => p.name === person.name).items.push(new Item(item, this)) })
    })
    people.forEach(person => {
      person.total = person.items.reduce((total, item) => total + item.priceOf(person.sessionData), 0)
    })
    return people
  }

  get items () {
    return this.data.numbers
      .filter(item => this.data.people.some(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))))
      .map(item => new Item(item, this))
  }

  get tip () {
    if (!this.data.tips || this.data.tips.length === 0) return 0
    return this.data.tips.reduce((total, tip) => total + tip.value, 0) || 0
  }

  get discount () {
    if (!this.data.discounts || this.data.discounts.length === 0) return 0
    return this.data.discounts.reduce((total, discount) => total * (discount.value / 100), 1) * 100
  }

  async addDiscount (value) {
    await this.update({ $push: { 'data.discounts': { value } } })
  }

  async removeDiscount (index) {
    await this.update({ $unset: { [`data.discounts.${index}`]: '' } })
    await this.update({ $pull: { 'data.discounts': null } })
  }

  async addTip (value) {
    await this.update({ $push: { 'data.tips': { value } } })
  }

  async removeTip (index) {
    await this.update({ $unset: { [`data.tips.${index}`]: '' } })
    await this.update({ $pull: { 'data.tips': null } })
  }

  get total () {
    if (this.data.total) return this.data.total.value
    return this.items.reduce((total, item) => total + this.finalValue(item.value), 0)
  }

  get totalDiff () {
    if (!this.data.total) return undefined
    return this.total - this.items.reduce((total, item) => total + this.finalValue(item.value), 0)
  }

  personalTotal (person) {
    return 0
  }

  finalValue (value) {
    return value * (1 + (this.tip / 100)) * (1 - this.discount / 100)
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
    const updated = await Session.load(this.id)
    if (this.updated < updated.updated) {
      this.data = updated.data
      this.updated = updated.updated
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