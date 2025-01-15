USE wallpaper;

-- 修改 thumbnail_url 和 image_url 字段类型
ALTER TABLE wallpapers
MODIFY COLUMN thumbnail_url TEXT NOT NULL COMMENT '缩略图地址',
MODIFY COLUMN image_url TEXT NOT NULL COMMENT '图片地址';
