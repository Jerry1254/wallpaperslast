import COS from 'cos-js-sdk-v5';

const cos = new COS({
    SecretId: process.env.TENCENT_SECRET_ID,
    SecretKey: process.env.TENCENT_SECRET_KEY,
    Protocol: 'https:', // 强制使用 HTTPS
    Domain: '{Bucket}.cos.{Region}.myqcloud.com', // 自定义域名
    UploadQueueSize: 10, // 队列并发数
    FileParallelLimit: 3, // 文件并发数
    ChunkParallelLimit: 8, // 分片并发数
    ChunkSize: 1024 * 1024 * 8, // 分片大小
});

// 配置存储桶 CORS
function setupBucketCORS() {
    cos.putBucketCors({
        Bucket: 'examplebucket-1250000000',
        Region: 'ap-beijing',
        CORSRules: [{
            AllowedOrigins: ['*'],
            AllowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
            AllowedHeaders: ['*'],
            ExposeHeaders: ['ETag', 'Content-Length', 'x-cos-request-id'],
            MaxAgeSeconds: 86400,
        }],
    }, function(err, data) {
        console.log(err || data);
    });
}

// 尝试设置 CORS 规则
setupBucketCORS();

export function uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const key = `${Date.now()}-${file.name}`;
        cos.putObject({
            Bucket: 'examplebucket-1250000000',
            Region: 'ap-beijing',
            Key: key,
            Body: file,
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }
        }, function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(key);
            }
        });
    });
}

export function getDownloadUrl(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
        cos.getObjectUrl({
            Bucket: 'examplebucket-1250000000',
            Region: 'ap-beijing',
            Key: key,
            Sign: true,
            Expires: 3600,
        }, function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data.Url);
            }
        });
    });
}

export function deleteFile(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
        cos.deleteObject({
            Bucket: 'examplebucket-1250000000',
            Region: 'ap-beijing',
            Key: key,
        }, function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
