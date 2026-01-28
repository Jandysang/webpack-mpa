const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

module.exports = () => {
    // 按优先级顺序排列的环境文件
    const envFiles = [
        path.resolve(process.cwd(), '.env'),           // 基础环境文件
        path.resolve(process.cwd(), `.env.${env}`),   // 特定环境文件
    ];

    const envConfig = {};
    
    // 按顺序加载环境文件，后面的会覆盖前面的
    for (const filePath of envFiles) {
        if (fs.existsSync(filePath)) {
            const fileEnv = dotenv.config({ path: filePath }).parsed;
            if (fileEnv) {
                Object.assign(envConfig, fileEnv);
            }
        }
    }

    const defineEnv = {
        'NODE_ENV': env,
    };

    for (const [key, value] of Object.entries(envConfig)) {
        defineEnv[`${key}`] = value;
    }

    return defineEnv;
};