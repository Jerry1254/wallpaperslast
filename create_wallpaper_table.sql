USE wallpaper;

-- 创建壁纸表
CREATE TABLE `wallpapers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '壁纸名称',
  `shop_id` INT NOT NULL COMMENT '所属店铺ID',
  `image_count` int NOT NULL DEFAULT '0' COMMENT '文件数量',
  `thumbnail_url` varchar(1000) NOT NULL COMMENT '缩略图URL',
  `image_urls` MEDIUMTEXT NOT NULL COMMENT '图片URL列表，JSON格式',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_shop_id` (`shop_id`),
  CONSTRAINT `fk_wallpapers_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='壁纸表';
