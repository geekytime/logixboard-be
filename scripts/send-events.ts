import { sendAllMessages } from '../test-int/utils/send-all-messages'

sendAllMessages().then(() => {
  console.log('all messages sent!')
})
