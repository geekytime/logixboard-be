import { messages } from './messages'
import axios from 'axios'

export const sendAllMessages = async (port: Number = 3001) => {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    let endpoint = 'shipment'
    if (message.type === 'ORGANIZATION') {
      endpoint = 'organization'
    }

    try {
      const url = `http://localhost:${port}/${endpoint}`
      await axios.post(url, message)
    } catch (error) {
      console.error('whoops')
    }
  }
}
