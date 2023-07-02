<!-- 我的 页面 -->
<template>
	<view class="content">
		<view class="box">
			<u-avatar class="container" :src="avatarUrl" mode="circle" size="220" :show-sex="true" :sex-icon="sex" @click="userCenter()"></u-avatar>
			<!-- #ifdef MP -->
			<view class="login" @click="userLogin">{{nickName}}</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="login">{{nickName}}</view>
			<!-- #endif -->
		</view>
		<view class="box_2">
			<view class="container_2" v-for="(item,index) in list_1" :key="index" @tap="openpage"
				:data-path="item.path">
				<u-icon class="image_tupian_2" :name="item.name" size="80" :color="item.color" :label="item.text"
					label-size="30" label-pos="bottom" margin-top="20rpx"></u-icon>
			</view>
		</view>
		<view class="box_3">
			<view class="container_3">
				<view v-for="(item,index) in list_2" :key="index" @tap="openpage" :data-path="item.path">
					<view class='middle-item_3' hover-stay-time="150">
						<u-icon class="image_tupian_3" :name="item.name" size="60" :color="item.color"></u-icon>
						<text class='textsytle'>{{item.text}}</text>
						<u-icon class="image-jiantou" name="arrow-right" color="#aaaaaa"></u-icon>
					</view>
					<u-line v-if="index<3" color="#cbcbcb" length="80%" margin="4rpx 10%" />
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-modal v-model="show" title="免责声明" :content="content"></u-modal>
		<u-modal v-model="isshow" title="清除记录" :content="iscontent" :show-cancel-button="true" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list_1: [{
					text: '文章',
					color: '#aecef8',
					name: 'edit-pen-fill',
					path: 'essay'
				}, {
					text: '浏览',
					color: '#c8b2f8',
					name: 'clock-fill',
					path: 'browse'
				}, {
					text: '收藏',

					color: '#f8ef85',
					name: 'star-fill',
					path: 'collection'
				}, {
					text: '草稿',
					color: '#9d9d9d',
					name: 'email-fill',
					path: 'draft'
				}],
				list_2: [{
					text: '免责声明',
					color: '#f1f197',
					name: 'info-circle-fill',
					path: 'statement'
				}, {
					text: '清除记录',
					color: '#94f1ac',
					name: 'trash-fill',
					path: 'cache'
				}, {
					text: '关于程序',
					color: '#a1c8f8',
					name: 'more-circle-fill',
					path: 'about'
				}, {
					text: '退出登录',
					color: '#9d9d9d',
					name: 'close-circle-fill',
					path: 'exit'
				}],
				code: '',
				islogin: false,
				openId: '',
				nickName: '点击登录',
				avatarUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015a465698b54432f87574be965625.png',
				gender: '保密',
				city: '保密',
				sex: 'question',
				show: false,
				content: '禁止将本小程序用于违法、违规业务。文明发言，营造良好的博客社区氛围',
				isshow: false,
				iscontent: '是否清除浏览记录'
			}
		},
		created() {
			uni.setStorageSync('islogin', false);
			uni.setStorageSync('sex','question');
			uni.setStorageSync('author','点击登录');
		},
		onShow(){
			this.sex = uni.getStorageSync('sex') || 'question';
			this.nickName = uni.getStorageSync('author') || '点击登录';
		},
		onPullDownRefresh() {
			// console.log("触发下拉刷新");
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000)
		},
		methods: {
			userCenter() {
				if (this.islogin == true) {
					this.$toPage('../usercenter/usercenter?userId=' + this.openId);
				} else {
					this.$refs.uToast.show({
						title: '未登录',
						type: 'warning',
					});
				}
			},
			// 获取用户信息
			async userLogin() {
				if (this.islogin == false) {
					await uni.login({
							success: (res) => {
								this.code = res.code;
								console.log("获得code", res.code);
								uni.request({
									url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxe2b09d4a402b5bbf&secret=2ca3de147b4cb5686fb29efd1d0e7830&js_code=' +
										this.code + '&grant_type=authorization_code',
									method: 'GET',
									data: {},
									success: res => {
										this.openId = res.data.openid;
										uni.setStorageSync('openId', res.data.openid);
										// console.log("openid在这里", this.openId);
										console.log(res.data);
									},
									fail: (res) => {
										console.log("登录失败", res)
									}
								})
							}
						}),
						await uni.getUserProfile({
							lang: 'zh_CN',
							desc: '登录',
							success: (res) => {
								console.log(res.rawData);
								uni.setStorageSync('userInfo', res.userInfo);
								this.islogin = true;
								// console.log("获得用户信息", uni.getStorageSync('userInfo'));
								this.$myRequest({
									url: '/SubmitUInfo',
									method: 'POST',
									data: {
										openId: this.openId,
										nickName: res.userInfo.nickName,
										avatarUrl: res.userInfo.avatarUrl,
										gender: "保密",
										city: "保密"
									}
								}).then( res => {
									//微信昵称
									this.nickName = res.data.nickName;
									//微信头像
									this.avatarUrl = res.data.avatarUrl;
									if (res.data.gender == "男"){
										this.sex = "man"
									}else if (res.data.gender == "女"){
										this.sex = "woman"
									}else if(res.data.gender == "保密"){
										this.sex = "question"
									}
									uni.setStorageSync('author', this.nickName);
									uni.setStorageSync('sex', this.sex);
									uni.setStorageSync('islogin', this.islogin);
									this.$refs.uToast.show({
										title: '登录成功',
										type: 'success',
									});
								})
							},
							fail: () => {},
							complete: () => {}
						})
				}
			},
			confirm() {
				//清除本地缓存(浏览记录)
				// uni.removeStorageSync("browse_cache");
				// uni.clearStorage();
				const res = this.$myRequest({
					url: '/deleteHistory?userId=' + this.openId,
					method: 'DELETE'
				})
				if (res.data = true) {
					this.$refs.uToast.show({
						title: '清理成功',
						type: 'info',
					});
				} else {
					this.$refs.uToast.show({
						title: '清理失败',
						type: 'warning',
					});
				}
			},
			openpage(e) {
				var path = e.currentTarget.dataset.path;
				// console.log(path);
				if (path == 'statement') {
					this.show = true;
				}
				if (path == 'cache') {
					if (this.islogin == false) {
						this.$refs.uToast.show({
							title: '未登录\n无法使用',
							type: 'warning',
						});
					} else {
						this.isshow = true;
					}
				}
				if (path == 'exit') {
					if (this.islogin == true) {
						this.code = '';
						this.islogin = false;
						this.nickName = '点击登录';
						this.avatarUrl =
							'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015a465698b54432f87574be965625.png';
						uni.setStorageSync('islogin', false);
						this.$refs.uToast.show({
							title: '成功退出',
							type: 'info',
						});
					} else {
						this.$refs.uToast.show({
							title: '未登录',
							type: 'warning',
						});
					}
				}
				if (this.islogin == false) {
					if (path == 'essay' || path == 'browse' || path == 'collection' || path == 'draft') {
						this.$refs.uToast.show({
							title: '未登录\n无法使用',
							type: 'warning',
						});
					} else {
						this.$toPage('../' + path + '/' + path);
					}
				} else {
					this.$toPage('../' + path + '/' + path);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
	}

	.box {
		width: 100%;
		height: 56vw;
		background-image: url(https://img-blog.csdnimg.cn/efc24b37135c4180bbff1ffa3667198c.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAUyB3IFM=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center);
		background-size: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 0 0 50rpx 50rpx;

		.login {
			margin-top: 30rpx;
			font-size: 40rpx;
			font-weight: bold;
			color: #ffffff;
		}
	}

	.box_2 {
		width: 96%;
		/* padding: 0 3%; */
		height: 26vw;
		background-color: #fefefe;
		border-radius: 24upx;
		/*  阴影 */
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
		margin: 40upx 2% 0upx 2%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.image_tupian_2 {
			display: flex;
			width: 100rpx;
			height: 80rpx;
			margin: 0rpx 40rpx 0rpx 40rpx;
		}
	}


	.box_3 {
		width: 96%;
		/* padding: 0 3%; */
		height: 70vw;
		background-color: #fefefe;
		border-radius: 24upx;
		/*  阴影 */
		box-shadow: 0 0 20upx rgba(33, 33, 33, 0.1);
		margin: 40upx 2% 0upx 2%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container_3 {
		width: 96%;
		height: 330rpx;
		display: flex;
		flex-direction: column;
		border-radius: 15rpx;
		background-color: #FFFFFF;
		margin: 20rpx 2% 200rpx 2%;
	}

	.middle-item_3 {
		height: 120rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.image_tupian_3 {
		display: flex;
		width: 50rpx;
		height: 100rpx;
		margin: 0rpx 40rpx 0rpx 40rpx;
	}

	.image-jiantou {
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		/* 要约束所在位置的子元素的位置要设置成绝对 */
		right: 38rpx;
		/* 靠右调节 */
		margin-right: 38rpx
	}

	.textstyle {
		font-size: 40rpx;
	}
</style>
