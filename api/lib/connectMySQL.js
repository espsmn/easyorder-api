const mysqlssh = require('mysql-ssh')
const ssh = {
  host: 'ip',
  user: '*',
  password: '*'
}
let database = {
  user: 'root',
  password: '*',
  database: '*'
}
module.exports = () => {
  return { promise: mysqlssh.connect(ssh, database), client: mysqlssh }
}
