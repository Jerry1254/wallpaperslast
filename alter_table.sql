USE wallpaper;

-- 先删除外键约束
ALTER TABLE wallpapers DROP FOREIGN KEY fk_wallpapers_shop;

-- 删除原表
DROP TABLE IF EXISTS wallpapers;

-- 重新创建表
CREATE TABLE `wallpapers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '壁纸名称',
  `image_count` int NOT NULL DEFAULT '0' COMMENT '壁纸张数',
  `thumbnail_url` MEDIUMTEXT NOT NULL COMMENT '缩略图地址',
  `image_url` MEDIUMTEXT NOT NULL COMMENT '图片地址',
  `shop_id` INT NOT NULL COMMENT '所属店铺ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_shop_id` (`shop_id`),
  CONSTRAINT `fk_wallpapers_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='壁纸表';
