const BASIC_PARTICIPATION_KEYS = ['person', 'item']

export default class Item {
  constructor (index, session) {
    this.index = index
    this.session = session
    this.divisionFunction = selectDevisionFunction(this)
  }

  get value () {
    return this.session._numberFromIndex(this.index)
  }

  // box

  get top () {
    return this._item.top
  }

  get left () {
    return this._item.left
  }

  get height () {
    return this._item.height
  }

  get width () {
    return this._item.width
  }

  // division

  get participations () {
    return this.session.data.participations.filter(participation => participation.item === this.index)
  }

  get people () {
    const participations = this.participations
    return this.session.people.filter(person => participations.some(participation => participation.person === person.id))
  }

  priceOf (person) {
    return this.divisionFunction.priceOf(person, this)
  }

  percentOf (person) {
    return this.divisionFunction.percentOf(person, this)
  }

  sharesOf (person) {
    return this.divisionFunction.sharesOf(person, this)
  }

  setPriceOf (person, value) {
    if (this.divisionFunction instanceof PriceDevisionFunction) {
      this.divisionFunction.addConstraint(person, value)
    }
    this.divisionFunction = new PriceDevisionFunction(this._item.value, this.people.length, [{ person, value }])
  }

  setPercentOf (person, value) {
    if (this.divisionFunction instanceof PercentDevisionFunction) {
      this.divisionFunction.addConstraint(person, value)
    }
    this.divisionFunction = new PercentDevisionFunction(this._item.value, this.people.length, [{ person, value }])
  }

  setSharesOf (person, value) {
    if (this.divisionFunction instanceof SharesDevisionFunction) {
      this.divisionFunction.addConstraint(person, value)
    }
    this.divisionFunction = new SharesDevisionFunction(this._item.value, this.people.length, [{ person, value }])
  }

  flush () {
    return this.divisionFunction.flush(this)
  }

  get _item () {
    return this.session.data.numbers[this.index]
  }
}

function selectDevisionFunction (item) {
  const participations = item.participations
  for (const key in divisionFunctions) {
    const DivisionFunction = divisionFunctions[key]
    if (participations.some(participation => participation[key] !== undefined)) {
      const constraints = participations
        .filter(participation => participation[key] !== undefined)
        .map(participation => ({ person: participation.person, value: participation[key] }))
      return new DivisionFunction(item.value, participations.length, constraints)
    }
  }
  return new BasicDevisionFunction(item.value, participations.length)
}

// Division functions

class BasicDevisionFunction {
  constructor (total, length) {
    this.total = total
    this.length = length
  }

  priceOf () {
    return this.total / this.length
  }

  percentOf () {
    return 100 / this.length
  }

  sharesOf () {
    return 1
  }

  flush (item) {
    item.participantions.forEach(participantion => cleanParticipation(participantion))
  }
}

class ConstrainedDevisionFunction {
  constructor (name, total, length, constraints=[]) {
    this.name = name
    this.total = total
    this.length = length
    this.constaints = constraints
  }

  base (person) {
    const constraint = this.constaints.find(c => c.person === person.id)
    return constraint ? constraint.value : this._unconstrainedValue()
  }

  addConstraint (person, value) {
    this.constaints.push({ person: person.id, value })
  }

  _unconstrainedValue () {
    const constrainedTotal = this.constaints.reduce((total, c) => total + c.value, 0)
    return (this.total - constrainedTotal) / (this.length - this.constaints.length)
  }

  flush (item) {
    item.participantions.forEach(participation => {
      cleanParticipation(participation)
      const constraint = this.constaints.find(c => c.person === participation.person)
      if (constraint) {
        participation[this.name] = constraint.value
      }
    })
  }
}

class PriceDevisionFunction extends ConstrainedDevisionFunction {
  constructor (total, length, constraints) {
    super('price', total, length, constraints)
  }

  priceOf (person) {
    return this.base(person)
  }

  percentOf (person) {
    return this.priceOf(person) / this.total * 100
  }

  sharesOf (person, item) {
    const people = item.people
    return sharesFromPercentsAndIndex(people.map(p => this.percentOf(p)), people.findIndex(p => p.id === person.id))
  }
}

class PercentDevisionFunction extends ConstrainedDevisionFunction {
  constructor (total, length, constraints) {
    super('percent', 100, length, constraints)
    this.numericTotal = total
  }

  priceOf (person) {
    return this.percentOf(person) / 100 * this.numericTotal
  }

  percentOf (person) {
    return this.base(person)
  }

  sharesOf (person, item) {
    const people = item.people
    return sharesFromPercentsAndIndex(people.map(p => this.percentOf(p)), people.findIndex(p => p.id === person.id))
  }
}

class SharesDevisionFunction extends ConstrainedDevisionFunction {
  constructor (total, length, constraints) {
    super('shares', length, length, constraints)
    this.numericTotal = total
  }

  priceOf (person) {
    return this.sharesOf(person) / this.total * this.numericTotal
  }

  percentOf (person) {
    return this.sharesOf(person) / this.total * 100
  }

  sharesOf (person) {
    return this.base(person)
  }

  addConstraint (person, value) {
    super.addConstraint(person, value)
    this.total = this.constaints.reduce((total, c) => total + c.value, 0) + this._unconstrainedValue() * (this.length - this.constaints.length)
  }

  _unconstrainedValue () {
    return 1
  }
}

function cleanParticipation (participation) {
  for (const key in participation) {
    if (!BASIC_PARTICIPATION_KEYS.include(key)) {
      delete participation[key]
    }
  }
}

function sharesFromPercentsAndIndex (allPercents, index) {
  const values = allPercents.map(p => p.toFixed(2) * 100)
  const factor = highestCommonFactor(values)
  const shares = values.map(value => value / factor)
  return shares[index]
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

const divisionFunctions = {
  price: PriceDevisionFunction,
  percent: PercentDevisionFunction,
  shares: SharesDevisionFunction
}
