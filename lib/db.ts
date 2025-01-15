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
  charset: 'utf8mb4'
})
