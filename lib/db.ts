import mysql from 'mysql2/promise'

export const createConnection = async () => {
  return await mysql.createConnection({
    host: '111.231.24.218',
    port: 3306,
    user: 'wmh',
    password: 'Wmh@zq7261449',
    database: 'wallpaper',
    charset: 'utf8mb4'
  })
}

export const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq7261449',
  database: 'wallpaper',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// 测试数据库连接
db.getConnection()
  .then(connection => {
    console.log('Database connection successful')
    connection.release()
  })
  .catch(err => {
    console.error('Database connection failed:', {
      error: err,
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      timestamp: new Date().toISOString()
    })
  })
