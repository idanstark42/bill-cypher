import { compressImage, MAX_FILE_SIZE } from './compress-image'

const MONGODB_API_ACTION_ENDPOINT = process.env.REACT_APP_MONGODB_API_ACTION_ENDPOINT
const MONGODB_APP_ID = process.env.REACT_APP_REALM_APP_ID
const MONGODB_DATABASE = process.env.REACT_APP_MONGODB_DATABASE

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME
const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET

// uploading images to cloudinary to the folder 'bill-cypher'

export async function uploadImage (file, compress = false) {
  if (compress && file.size > MAX_FILE_SIZE) {
    file = await compressImage(file)
  }
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', UPLOAD_PRESET)
  data.append('folder', 'bill-cypher')
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'post',
    body: data
  })
  const json = await response.json()
  return json.secure_url
}

// connecting to the MongoDB Realm app

export class MongoClient {
  async auth () {
    // use anonymous authentication
    const response = await fetch(`https://services.cloud.mongodb.com/api/client/v2.0/app/${MONGODB_APP_ID}/auth/providers/anon-user/login`, {
      method: 'post'
    })
    const json = await response.json()
    this.token = json.access_token
  }

  async request (action, body) {
    const response = await fetch(`${MONGODB_API_ACTION_ENDPOINT}/${action}`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        ...body
      })
    })
    return await response.json()
  }

  async insetOne (collection, document) {
    return await this.request('insertOne', { database: MONGODB_DATABASE, collection, document })
  }

  async findOne (collection, filter) {
    const response = await this.request('findOne', { database: MONGODB_DATABASE, collection, filter })
    return response.document
  }

  async updateOne (collection, params) {
    return await this.request('updateOne', { database: MONGODB_DATABASE, collection, ...params })
  }

  async collection (collection) {
    return {
      insertOne: document => this.insetOne(collection, document),
      findOne: filter => this.findOne(collection, filter),
      updateOne: params => this.updateOne(collection, params)
    }
  }

}
