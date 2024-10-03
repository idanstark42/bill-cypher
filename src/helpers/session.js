import { MongoClient } from './backend.js'

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
      .map(item => {
        const people = this.data.people.filter(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item)))
        return {
          ...item,
          people,
          priceOf: () => {
            const person = people.find(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item)))
            const participation = person.participations.find(participation => participation.index === this.data.numbers.indexOf(item))
            if (participation.price) return participation.price
            if (participation.percent) return participation.percent / 100 * item.value
            if (participation.shares) return participation.shares / people.reduce((total, p) => total + p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).shares, 0) * item.value
            return item.value / people.length
          },
          setPriceOf: (person, value) => {
            person.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).price = value
            const personIndex = people.indexOf(person)
            const priceOfOthers = (item.value - value) / (people.length - 1 - personIndex)
            people
              .filter((p, index) => index > personIndex)
              .map(p => p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)))
              .forEach(participation => {
                participation.price = priceOfOthers
                if (participation.percent) delete participation.percent
                if (participation.shares) delete participation.shares
              })
            console.log(people)
          },
          percentOf: () => {
            const person = people.find(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item)))
            const participation = person.participations.find(participation => participation.index === this.data.numbers.indexOf(item))
            if (participation.price) return participation.price / item.value * 100
            if (participation.percent) return participation.percent
            if (participation.shares) return participation.shares / people.reduce((total, p) => total + p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).shares, 0)
            return 100 / people.length
          },
          setPercentOf: (person, value) => {
            person.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).percent = value
            const personIndex = people.indexOf(person)
            const percentOfOthers = (100 - value) / (people.length - 1 - personIndex)
            people
              .filter((p, index) => index > personIndex)
              .map(p => p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)))
              .forEach(participation => {
                if (participation.price) delete participation.price
                participation.percent = percentOfOthers
                if (participation.shares) delete participation.shares
              })
          },
          sharesOf: () => {
            const person = people.find(person => person.participations.some(participation => participation.index === this.data.numbers.indexOf(item)))
            const participation = person.participations.find(participation => participation.index === this.data.numbers.indexOf(item))
            if (participation.price) {
              const values = people.map(p => p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).price.toFixed(2) * 100 / item.value)
              const factor = highestCommonFactor(values)
              const shares = values.map(value => value / factor)
              return shares[people.indexOf(person)]
            }
            if (participation.percent) {
              const values = people.map(p => p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).percent * 100)
              const factor = highestCommonFactor(values)
              const shares = values.map(value => value / factor)
              return shares[people.indexOf(person)]
            }
            if (participation.shares) return participation.shares
            return 1
          },
          setSharesOf: (person, value) => {
            person.participations.find(participation => participation.index === this.data.numbers.indexOf(item)).shares = value
            const personIndex = people.indexOf(person)
            people
              .filter((p, index) => index > personIndex)
              .map(p => p.participations.find(participation => participation.index === this.data.numbers.indexOf(item)))
              .forEach(participation => {
                if (participation.price) delete participation.price
                if (participation.percent) delete participation.percent
                participation.shares = 1
              })            
          }
        }
      })
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

  finalValue (value) {
    return value * (1 + (this.tip / 100)) * (1 - this.discount / 100)
  }

  async update (update, options) {
    await (await Session.collection()).updateOne({ _id: { $oid: this.id } }, { ...update, $set: { updated: new Date() } }, options)
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

function highestCommonFactor (numbers) {
  const factors = numbers.map(primaryFactorsOf)
  const allFactors = factors.reduce((all, factors) => all.concat(factors), [])
  const commonFactors = factors.reduce((common, factors) => common.filter(factor => factors.some(f => f[0] === factor[0])), factors[0])
    .map(factor => [factor[0], Math.min(...allFactors.filter(f => f[0] === factor[0]).map(f => f[1]))])
  return commonFactors.reduce((product, factor) => product * Math.pow(factor[0], factor[1]), 1)
}

function primaryFactorsOf (number) {
  const factors = []
  for (let i = 2; i <= Math.round(Math.sqrt(number)); i++) {
    if (number % i === 0 && primaryFactorsOf(i).length === 0) {
      let power = 1
      while (number % Math.pow(i, power) === 0) {
        power++
      }
      factors.push([i, power - 1])
    }
  }
  return factors
}
