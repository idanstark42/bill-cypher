import { MongoClient } from './backend.js'

export default class Session {
  constructor (id, data) {
    this.id = id
    this.data = data
  }

  get shareURL () {
    return `${window.location.origin}/participate/${this.id}`
  }

  get payments () {
    const people = this.data.people.map(person => ({ name: person.name, items: [] }))
    this.data.numbers.forEach(item => {
      const total = item.value
      const peopleCount = this.data.people.filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item))).length
      if (peopleCount === 0) return
      console.log(peopleCount)
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