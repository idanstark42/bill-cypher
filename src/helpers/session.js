import { MongoClient } from './backend.js'

export default class Session {
  constructor (id, data) {
    this.id = id
    this.data = data
  }

  get shareURL () {
    return `${window.location.origin}/participate/${this.id}`
  }

  get people () {
    const people = this.data.people.map(person => ({ name: person.name, items: [] }))
    this.data.numbers.forEach(item => {
      const total = item.value
      const peopleCount = this.data.people.filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))).length
      if (peopleCount === 0) return
      const pricePerPerson = total / peopleCount
      this.data.people
        .filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item)))
        .forEach(person => { people.find(p => p.name === person.name).items.push({ ...item, value: pricePerPerson }) })
    })
    people.forEach(person => {
      person.total = person.items.reduce((total, item) => total + item.value, 0)
    })
    return people
  }

  get items () {
    return this.data.numbers
      .filter(item => this.data.people.some(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))))
      .map(item => ({
        ...item,
        participations: this.data.people.filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))),
        pricePerPerson: item.value / this.data.people.filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))).length
      }))
  }

  get tip () {
    return this.data.tips?.reduce((total, tip) => total + tip.value, 0) || 0
  }

  get discount () {
    return this.data.discounts?.reduce((total, discount) => total * (discount.value / 100), 1) * 100 || 0
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

  finalValue (value) {
    return value * (1 + (this.tip / 100)) * (1 - this.discount / 100)
  }

  async update (update, options) {
    await (await Session.collection()).updateOne({ _id: { $oid: this.id } }, update, options)
    const response = await (await Session.collection()).findOne({ _id: { $oid: this.id } })
    this.data = response.data
  }

  static async load (id) {
    const session = await (await Session.collection()).findOne({ _id: { $oid: id } })
    return new Session(id, session.data)
  }

  static async create (data) {
    const response = await (await Session.collection()).insertOne({ data })
    const { insertedId } = response
    const session = new Session(insertedId, data)
    return session
  }

  static async collection () {
    const client = new MongoClient()
    await client.auth()
    return await client.collection('sessions')
  }
}