// 导入需要的工具函数（如果使用lodash）
// import { cloneDeep, merge } from 'lodash';

// 处理abstractImg的函数
function processAbstractImg(abstractImg) {
    // 默认的base64图片
    const defaultBase64 = 'data:image/png;base64,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';
    
    const _hostname = window.location.hostname;
    
    // 如果没有abstractImg或者不是URL格式，返回默认图片
    if (!abstractImg || abstractImg.startsWith('data:image/')) {
        return abstractImg || defaultBase64;
    }
    
    try {
        // 定义所有可能的URL前缀
        const prefixes = [
            'http://47.76.253.240:8089/ddn/api/v1/endpoint/getResource/',
            'http://www.ddnstorage.com.cn/api/endpoint/getResource/',
            'https://www.ddnstorage.com.cn/api/endpoint/getResource/'
        ];
        
        // 检查并提取ID
        let imgId = null;
        for (const prefix of prefixes) {
            if (abstractImg.startsWith(prefix)) {
                imgId = abstractImg.substring(prefix.length);
                break;
            }
        }
        
        // 如果成功提取ID，可以根据需要返回ID或拼接新的URL
        if (imgId) {
            // 这里可以根据需要返回ID，或者拼接新的URL格式
            // 例如返回ID：return imgId;
            // 或者返回默认base64图片：
            // return defaultBase64;
            // 或者根据ID构建新的URL：
            if(_hostname.indexOf('47\.76\.253\.240')>-1){
                return `//47.76.253.240:8089/ddn/api/v1/endpoint/getResource/${imgId}`
            }else {
                return `//www.ddnstorage.com.cn/api/endpoint/getResource/${imgId}`
            }
        }
        
        // 如果不匹配任何前缀，返回原URL或默认图片
        return abstractImg;
        
    } catch (error) {
        // 出错时返回默认图片
        return defaultBase64;
    }
}



export default processAbstractImg;