import { AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data'])
export const POST_FILENAME = 'info.json'
export const nodeEnv = process.env.NODE_ENV === 'development' ? 'development' : 'production'
export const appUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://debutapp.social'
