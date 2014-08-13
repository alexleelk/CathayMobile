//summary: cookies��������,����Ϊjquery�������
//author: ������
//create date: 2012-12-11
(function($) {
	//private funcs
	//�趨cookieֵ�ķ���
	//name: string���͵�����
	//value: string���͵�ֵ
	//options���ӵ�cookie��Ϣ,json����, ����{expires: 7}
	function setting(name, value, options){
		options = options || {expires: 1, path: '/'};//��ֹ�ͻ������Ϲ���,Ĭ����Ч��Ϊ1��
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
	//��ȡcookieֵ�ķ���
	//name: ����Ϊ������ʽ, ����/name*/, ����Ϊstring, ����'name'
	//����ֵΪ����(json����)
	function getting(name){
		var cookieValue = [];
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				var cInfo = cookie.split('=');//��ּ�ֵ��
				var cNInfo = cInfo[0].split('|');//���������д��ʱ��
				if((typeof name != 'string' && name.test(cNInfo[0])) ||(typeof name == 'string' && name == cNInfo[0])){
					cv = decodeURIComponent(cInfo[1]);
					cookieValue[cookieValue.length] = {'key' : cInfo[0], 'value' : cv};					
				}
			}
		}
		return cookieValue;
	};
	//����key-value pairs,������������ǰ��
	function sorting(cookies){
		return cookies.sort(function(a, b){
			return -(parseInt(a.key.split('|')[1]) - parseInt(b.key.split('|')[1]));
		});
		return cookies;
	};
	//���˵�cookies�е�ʱ����󷵻�
	//pairArr: json��ֵ�Ե�����
	//ch:ʹ��ch��Ϊ�ָ�key���ַ�
	//idx:�ָ�key�󷵻�key���Ǹ����ֵ��±�
	$.xclip = function(pairArr, ch, i){
		$(pairArr).each(function(idx, item){
			item.key = item.key.split(ch)[i];
		});
		return pairArr;
	};
	//ɾ��value�ظ�������, ��Ҫ�Ѿ��������
	function xunique(cookies){
		//�㷨���Ӷ�Ϊ2n
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
	//ͳһ�Ķ�ȡ��д����ں���,����Ҫʹ��$.fn.cookie��ʽ����
	//name: cookies ֵ
	//value: cookiesֵ
	//options: cookies�Ŀ�ѡ��,����expires, secure, path, domain
	//flg: Ϊtrueʱ,����cookies��ȫ��,false����δ����,����������к��name:value��
	//��ʹ�ö���ʽ��ȡʱ,���ص�Ϊһ������,��ʽΪ[{'key':'xxx','value':'yyy'}],���Ұ������Ⱥ�˳�򷵻�,�н���Զ
	$.xcookie = function(name, value, options, flg){
		if(name.toString().indexOf('|') != -1){ //���ַ��趨Ϊ������
			alert('cookies��������ʹ��|');
			return;
		}
		if (typeof value != 'undefined') { //setting����
			setting(name, value, options);
		} else {//getting 
			return flg ? getting(name) : xunique($.xclip(sorting(getting(name)),'|', 0));
		}
	};
	
})(jQuery);


//TODO:ɾ��������������
