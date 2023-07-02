//全局属性--调用接口方法
// #ifdef H5
const BASE_URL = '/api'
// #endif
// #ifdef MP
const BASE_URL = 'http://localhost:8888'
// #endif
export const myRequest = (option)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: BASE_URL+option.url,
			method: option.method || 'GET',
			data: option.data || {},
			success: (res) => {
				if(res.data.status == 0){
					return uni.showToast({
						title:'获取数据失败！！！'
					})
				}
				resolve(res)
			},
			fail: (err) => {
				uni.showToast({
					title: '请求接口失败'
				});
				reject(err)
			}
		});
	})
}