export default class Person {
  constructor (id, session) {
    this.id = id
    this.session = session
  }

  get _person () {
    return this.session.data.participants.find(person => person.id === this.id)
  }

  get name () {
    return this._person.name
  }

  get participations () {
    return this.session.data.participations.filter(participation => participation.person === this.id)
  }

  get items () {
    return this.participations.map(participation => this.session.items.find(item => item.index === participation))
  }

  get total () {
    const participations = this.participations
    const items = this.session.items.filter(item => participations.some(participation => participation.item === item.index))
    return items.reduce((total, item) => total + item.priceOf(this), 0)
  }

  async participate (item) {
    const participation = this.participations.find(participation => participation.item === item.index)
    if (participation) return 'Already participated'
    return await this.session.update({ $addToSet: { 'data.participations': { person: this.id, item: item.index } } })
  }

  async unparticipate (item) {
    const participation = this.participations.find(participation => participation.item === item.index)
    if (!participation) return 'Not participated'
    return await this.session.update({ $pull: { 'data.participations': { person: this.id, item: item.index } } })
  }
}

export function randomName () {
  return names[Math.floor(Math.random() * names.length)]
}

const names = [
  'Avalon',
  'Helios',
  'Valhalla',
  'Elysium',
  'Asgard',
  'Freyja',
  'Celestia',
  'Aether',
  'Erebus',
  'Olympus',
  'Midgard',
  'Niflheim',
  'Titania',
  'Arcadia',
  'Pangaea',
  'Selene',
  'Hyperion',
  'Chimera',
  'Gaia',
  'Oberon',
  'Lyra',
  'Zephyr',
  'Calypso',
  'Nyx',
  'Borealis',
  'Orion',
  'Mimir',
  'Astraea',
  'Icarus',
  'Fenrir',
  'Phoenix',
  'Epona',
  'Nephilim',
  'Moros',
  'Hesperia',
  'Kronos',
  'Stheno',
  'Tartarus',
  'Yggdrasil',
  'Morpheus',
  'Scylla',
  'Cassandra',
  'Circe',
  'Andromeda',
  'Phaedra',
  'Heimdall',
  'Elara',
  'Drakon',
  'Thanatos',
  'Lerna',
  'Tiamat'
]