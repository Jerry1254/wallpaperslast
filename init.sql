-- 创建数据库
CREATE DATABASE IF NOT EXISTS wallpaper DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wallpaper;

-- 用户表
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `role` enum('admin','user') NOT NULL DEFAULT 'user' COMMENT '角色：admin-管理员，user-普通用户',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 店铺表
CREATE TABLE IF NOT EXISTS shops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 壁纸表
CREATE TABLE `wallpapers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '壁纸名称',
  `image_count` int NOT NULL DEFAULT '0' COMMENT '壁纸张数',
  `thumbnail_url` TEXT NOT NULL COMMENT '缩略图地址',
  `image_url` TEXT NOT NULL COMMENT '图片地址',
  `shop_id` INT NOT NULL COMMENT '所属店铺ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_shop_id` (`shop_id`),
  CONSTRAINT `fk_wallpapers_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='壁纸表';

-- 系统设置表
CREATE TABLE `system_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `share_header_text` varchar(255) DEFAULT NULL COMMENT '分享页顶部文字',
  `share_button_text` varchar(100) DEFAULT NULL COMMENT '分享按钮文本',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- 初始化系统设置
INSERT INTO `system_settings` (`share_header_text`, `share_button_text`) 
VALUES ('欢迎使用壁纸分享系统', '立即分享');

-- 初始化管理员账户 (密码: 111111 的MD5值)
INSERT INTO `users` (`username`, `password`, `role`) 
VALUES ('wumh', '96e79218965eb72c92a549dd5a330112', 'admin');
