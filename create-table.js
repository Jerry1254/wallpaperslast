const mysql = require('mysql2/promise');

async function createTables() {
  const connection = await mysql.createConnection({
    host: '111.231.24.218',
    port: 3306,
    user: 'wmh',
    password: 'Wmh@zq7261449',
    database: 'wallpaper'
  });

  try {
    console.log('Connected to database');

    // 检查 shops 表的 id 字段类型
    const [shopColumns] = await connection.execute('SHOW COLUMNS FROM shops WHERE Field = "id"');
    console.log('Shop id column type:', shopColumns[0].Type);

    // 删除旧表（如果存在）
    await connection.execute('DROP TABLE IF EXISTS wallpapers');
    console.log('Dropped existing table');

    // 创建新表，使用与 shops.id 相同的类型
    const createTableSQL = `
    CREATE TABLE wallpapers (
      id bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
      name varchar(100) NOT NULL COMMENT '壁纸名称',
      shop_id bigint unsigned NOT NULL COMMENT '所属店铺ID',
      image_count int NOT NULL DEFAULT '0' COMMENT '文件数量',
      thumbnail_url text NOT NULL COMMENT '缩略图URL',
      image_urls MEDIUMTEXT NOT NULL COMMENT '图片URL列表，JSON格式',
      created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      PRIMARY KEY (id),
      KEY idx_shop_id (shop_id),
      CONSTRAINT fk_wallpapers_shop FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='壁纸表'
    `;

    await connection.execute(createTableSQL);
    console.log('Created new table');

    console.log('All done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

createTables();
