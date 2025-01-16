USE wallpaper;

-- 创建分享页配置表
CREATE TABLE `share_pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wallpaper_id` bigint unsigned NOT NULL COMMENT '关联的壁纸ID',
  `description` TEXT NOT NULL COMMENT '分享页描述',
  `button_text` varchar(50) NOT NULL DEFAULT '全部下载' COMMENT '下载按钮文字',
  `share_code` varchar(32) NOT NULL COMMENT '分享码',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_share_code` (`share_code`),
  KEY `idx_wallpaper_id` (`wallpaper_id`),
  CONSTRAINT `fk_share_wallpaper` FOREIGN KEY (`wallpaper_id`) REFERENCES `wallpapers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分享页配置表';
