USE wallpaper;

-- 删除所有相关的表
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS wallpaper_files;
DROP TABLE IF EXISTS wallpapers;
SET FOREIGN_KEY_CHECKS = 1;

-- 创建新的壁纸表
CREATE TABLE `wallpapers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '壁纸名称',
  `shop_id` INT NOT NULL COMMENT '所属店铺ID',
  `image_count` int NOT NULL DEFAULT '0' COMMENT '文件数量',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_shop_id` (`shop_id`),
  CONSTRAINT `fk_wallpapers_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='壁纸表';

-- 创建壁纸文件表
CREATE TABLE `wallpaper_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `wallpaper_id` bigint unsigned NOT NULL COMMENT '关联的壁纸ID',
  `file_name` varchar(255) NOT NULL COMMENT '文件名',
  `file_type` varchar(50) NOT NULL COMMENT '文件类型',
  `thumbnail_name` varchar(255) DEFAULT NULL COMMENT '缩略图文件名',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序顺序',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_wallpaper_id` (`wallpaper_id`),
  CONSTRAINT `fk_wallpaper_files_wallpaper` FOREIGN KEY (`wallpaper_id`) REFERENCES `wallpapers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='壁纸文件表';
