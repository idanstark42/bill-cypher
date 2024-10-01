// This file contains all the functions that interact with the Splitwise API.

const SPLITWISE_API_KEY = ''
const SPLITWISE_API_SECRET = ''

const REDIRECT_URI = 'http://localhost:3000'

export default class SplitwiseClient {
  async init (code) {
    const data = await splitwiseRequest('POST', 'get_access_token', {
      client_id: SPLITWISE_API_KEY,
      client_secret: SPLITWISE_API_SECRET,
      redirect_uri: REDIRECT_URI,
      code
    })
    this.accessToken = data.access_token
  }

  async getUserData () {
    return await splitwiseRequest('GET', 'get_current_user', null, this.accessToken)
  }

  async getGroups () {
    const raw = await splitwiseRequest('GET', 'get_groups', null, this.accessToken)
    const groups = raw.groups.map(group => new SplitwiseGroup(this, group.id))
    for (const group of groups) {
      await group.load()
    }
    return groups
  }
}

class SplitwiseGroup {
  constructor (client, id) {
    this.client = client
    this.id = id
  }

  get accessToken () {
    return this.client.accessToken
  }

  async load () {
    this.data = await splitwiseRequest('GET', `get_group/${this.id}`, null, this.accessToken)
  }

  async getExpenses () {
    return await splitwiseRequest('GET', `get_expenses/${this.id}`, null, this.accessToken)
  }

  async createExpense (description, cost, shares) {
    const splitwiseShares = shares.map((share, index) => {
      const share = {}
      share[`user__${index}__user_id`] = share.userId
      share[`user__${index}__paid_share`] = share.paidShare
      share[`user__${index}__owed_share`] = share.owedShare
      return share
    })
    
    return await splitwiseRequest('POST', 'create_expense', {
      cost,
      description,
      group_id: this.id,
      splitwiseShares
    }, this.accessToken)
  }
}

async function splitwiseRequest (method, endpoint, body) {
  const response = await fetch(`https://secure.splitwise.com/api/v3.0/${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${SPLITWISE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return await response.json()
}
