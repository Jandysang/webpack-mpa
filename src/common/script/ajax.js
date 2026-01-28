import $ from 'jquery'
import 'jquery.cookie'
import merge from 'lodash/merge'
// import { Ajax_BASE_URL, Token_Key, Domain } from '@/config.js'
import { typeDeepOf } from './utils'

const Ajax_BASE_URL = import.meta.env.BASE_URL || '//www.ddnstorage.com.cn/api'
const Token_Key = import.meta.env.TOKEN_KEY || 'x-ddn-access-token'
const Domain = import.meta.env.DOMAIN || 'www.ddnstorage.com.cn'
console.log('import', import.meta.env);

const request = (options) => {
    let settings = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'access-token': $.cookie(Token_Key) || ''
        }
    }

    const _sucFn = options.success || (() => { })
    const _faiFn = options.fail || (() => { })
    const fail = (err) => {
        // console.error(err.msg || '请求出错，请重试！')
        if (err.code == 302) {
            $.removeCookie(Token_Key, { domain: Domain })
            window.location.href = `//${window.location.host}/login.html?backUrl=` + window.location.href;
            //window.location.reload();
            return;
        }
        let _err = merge({}, err)
        
        if (err.code == 999) {
            if (_err.data) {
                if (typeDeepOf(_err.data) == 'string') _err.msg = _err.data;
                if (typeDeepOf(_err.data) == 'array') _err.msg = _err.data[0]['message'] || _err.msg || '服务端验证错误'
            }
        }
        _faiFn(_err)
    }
    const success = (res) => {
        if (res.code == 200) {
            _sucFn(res.data)
        } else {
            fail(res)
        }

    };

    settings = merge({}, settings, options, {
        url: options.url.indexOf('http') >= 0 ? options.url : `${Ajax_BASE_URL}${options.url || ''}`,
        success,
        fail
    })
    $.ajax(settings)
}

export default request
