//summary: cookies辅助工具,需作为jquery插件运行
//author: 李轶嵘
//create date: 2012-12-11
(function($) {
	//private funcs
	//设定cookie值的方法
	//name: string类型的名称
	//value: string类型的值
	//options附加的cookie信息,json对象, 例如{expires: 7}
	function setting(name, value, options){
		options = options || {expires: 1, path: '/'};//防止客户端资料过多,默认有效期为1天
		if (value === null) {
			value = '';
			options = $.extend({}, options);
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '|', (new Date()).getTime(), '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	};
	//获取cookie值的方法
	//name: 可以为正则表达式, 例如/name*/, 或者为string, 例如'name'
	//返回值为数组(json对象)
	function getting(name){
		var cookieValue = [];
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				var cInfo = cookie.split('=');//拆分键值对
				var cNInfo = cInfo[0].split('|');//拆分名称与写入时间
				if((typeof name != 'string' && name.test(cNInfo[0])) ||(typeof name == 'string' && name == cNInfo[0])){
					cv = decodeURIComponent(cInfo[1]);
					cookieValue[cookieValue.length] = {'key' : cInfo[0], 'value' : cv};					
				}
			}
		}
		return cookieValue;
	};
	//排序key-value pairs,最近输入的排在前面
	function sorting(cookies){
		return cookies.sort(function(a, b){
			return -(parseInt(a.key.split('|')[1]) - parseInt(b.key.split('|')[1]));
		});
		return cookies;
	};
	//过滤掉cookies中的时间戳后返回
	//pairArr: json键值对的数组
	//ch:使用ch作为分隔key的字符
	//idx:分隔key后返回key的那个部分的下标
	$.xclip = function(pairArr, ch, i){
		$(pairArr).each(function(idx, item){
			item.key = item.key.split(ch)[i];
		});
		return pairArr;
	};
	//删除value重复的数据, 需要已经完成排序
	function xunique(cookies){
		//算法复杂度为2n
		var v = {};
		for(var i = 0; i < cookies.length; i++){
			if(v[cookies[i].value]){
				v[cookies[i].value]++;
			} else {
				v[cookies[i].value] = 1;
			}			
		}
		var nc = [];
		for(i = 0; i < cookies.length; i++){
			if(v[cookies[i].value] > 0){
				nc[nc.length] = cookies[i];
			}
			v[cookies[i].value] = 0;
		}
		return nc;
	}
	//public funcs
	//统一的读取与写入入口函数,不需要使用$.fn.cookie方式定义
	//name: cookies 值
	//value: cookies值
	//options: cookies的可选项,包括expires, secure, path, domain
	//flg: 为true时,返回cookies的全名,false或者未输入,返回排序剪切后的name:value对
	//当使用读方式获取时,返回的为一个数组,格式为[{'key':'xxx','value':'yyy'}],并且按输入先后顺序返回,有近至远
	$.xcookie = function(name, value, options, flg){
		if(name.toString().indexOf('|') != -1){ //该字符设定为保留字
			alert('cookies名字请勿使用|');
			return;
		}
		if (typeof value != 'undefined') { //setting操作
			setting(name, value, options);
		} else {//getting 
			return flg ? getting(name) : xunique($.xclip(sorting(getting(name)),'|', 0));
		}
	};
	
})(jQuery);


//TODO:删除方法存在问题
