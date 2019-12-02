import { AccountsClient } from '@accounts/client'
import { AccountsClientPassword } from '@accounts/client-password'
import { RestClient } from '@accounts/rest-client'

const accountsRest = new RestClient({
  apiHost: 'http://192.168.1.18:4000',
  rootPath: '/accounts',
})
const accountsClient = new AccountsClient({}, accountsRest)
const accountsPassword = new AccountsClientPassword(accountsClient)

// accountsPassword.createUser({ username: 'ducan', password: 'ducan123' })
export { accountsClient, accountsRest, accountsPassword }
