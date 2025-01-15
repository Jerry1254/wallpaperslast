USE wallpaper;

-- 修改表结构
ALTER TABLE wallpapers 
MODIFY COLUMN thumbnail_url VARCHAR(1000) NOT NULL COMMENT '缩略图地址',
MODIFY COLUMN image_url MEDIUMTEXT NOT NULL COMMENT '图片地址';
