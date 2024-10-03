export default class Item {
  constructor (item, session) {
    this._item = item
    this.session = session
    this.people = session.data.people.filter(person => person.participations.some(participation => participation.index === session.data.numbers.indexOf(item)))
    this.devisionFunction = selectDevisionFunction(this, this.people)
  }

  get value () {
    return this._item.value
  }

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

  get text () {
    return this._item.text
  }

  priceOf (person) {
    return this.devisionFunction.priceOf(person, this.people)
  }

  percentOf (person) {
    return this.devisionFunction.percentOf(person, this.people)
  }

  sharesOf (person) {
    return this.devisionFunction.sharesOf(person, this.people)
  }

  setPriceOf (person, value) {
    if (this.devisionFunction instanceof PriceDevisionFunction) {
      this.devisionFunction.addConstraint(person, value)
    }
    this.devisionFunction = new PriceDevisionFunction(this._item.value, this.people.length, [{ person, value }])
  }

  setPercentOf (person, value) {
    if (this.devisionFunction instanceof PercentDevisionFunction) {
      this.devisionFunction.addConstraint(person, value)
    }
    this.devisionFunction = new PercentDevisionFunction(this._item.value, this.people.length, [{ person, value }])
  }

  setSharesOf (person, value) {
    if (this.devisionFunction instanceof SharesDevisionFunction) {
      this.devisionFunction.addConstraint(person, value)
    }
    this.devisionFunction = new SharesDevisionFunction(this._item.value, this.people.length, [{ person, value }])
  }

  participation (person) {
    return person.participations.find(p => p.index === this.session.data.numbers.indexOf(this._item))
  }

  flush () {
    return this.devisionFunction.flush(this)
  }
}

function selectDevisionFunction (item, people) {
  const participations = people.map(person => item.participation(person))
  console.log(participations)
  if (participations[0].price !== undefined) {
    const constraints = people.filter(person => item.participation(person).price !== undefined).map(person => ({ person, value: item.participation(person).price }))
    return new PriceDevisionFunction(item._item.value, people.length, constraints)
  } else if (participations[0].percent !== undefined) {
    const constraints = people.filter(person => item.participation(person).percent !== undefined).map(person => ({ person, value: item.participation(person).percent }))
    return new PercentDevisionFunction(item._item.value, people.length, constraints)
  } else if (participations[0].shares !== undefined) {
    const constraints = people.filter(person => item.participation(person).shares !== undefined).map(person => ({ person, value: item.participation(person).shares }))
    return new SharesDevisionFunction(item._item.value, people.length, constraints)
  } else {
    return new BasicDevisionFunction(item._item.value, people.length)
  }
}

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
    item.people.forEach(person => {
      const participation = item.participation(person)
      for (const key in participation) {
        if (key !== 'index') delete participation[key]
      }
    })
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
    const constraint = this.constaints.find(c => c.person === person)
    return constraint ? constraint.value : this.unconstrainedValue()
  }

  addConstraint (person, value) {
    this.constaints.push({ person, value })
  }

  unconstrainedValue () {
    return (this.total - this.constaints.reduce((total, c) => total + c.value, 0)) / (this.length - this.constaints.length)
  }

  flush (item) {
    item.people.forEach(person => {
      const participation = item.participation(person)
      for (const key in participation) {
        if (key !== 'index') delete participation[key]
      }
      const constraint = this.constaints.find(c => c.person === person)
      if (constraint) {
        participation[this.name] = constraint.value
      } else {
        participation[this.name] = this.unconstrainedValue()
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

  sharesOf (person, people) {
    return sharesFromPercentsAndIndex(people.map(p => this.percentOf(p)), people.indexOf(person))
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

  sharesOf (person, people) {
    return sharesFromPercentsAndIndex(people.map(p => this.percentOf(p)), people.indexOf(person))
  }
}

class SharesDevisionFunction extends ConstrainedDevisionFunction {
  constructor (total, length, constraints) {
    super('shares', length, length, constraints)
    this.numericTotal = total
  }

  priceOf (person) {
    return this.sharesOf(person) / this.totalShares() * this.numericTotal
  }

  percentOf (person) {
    return this.sharesOf(person) / this.totalShares() * 100
  }

  sharesOf (person) {
    return this.base(person)
  }

  totalShares () {
    return this.constaints.reduce((total, c) => total + c.value, 0) + this.unconstrainedValue() * (this.length - this.constaints.length)
  }

  addConstraint (person, value) {
    super.addConstraint(person, value)
    this.total = this.constaints.reduce((total, c) => total + c.value, 0)
  }

  unconstrainedValue () {
    return 1
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
