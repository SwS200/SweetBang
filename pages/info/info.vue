<!-- 文章内容页面 -->
<template>
	<view class="u-skeleton">
		<view class="content u-skeleton-fillet">
			<view class="title">{{title}}</view>
			<view class="art-content">
				<rich-text class="richText" :nodes="content"></rich-text>
			</view>
		</view>
		<view class="uni-footer u-skeleton-fillet">
			<u-icon :name="iconName" label="点赞" :color="color" size="40" label-size="32" @click="setIcon"></u-icon>
			<u-icon name="chat" label="评论" color="#909090" size="40" label-size="32"
				@click="this.$refs.commentEg.$refs.hbComment.commentInput()"></u-icon>
			<u-icon :name="iconName1" label="收藏" :color="color1" size="40" label-size="32" @click="setIcon1"></u-icon>
		</view>
		<u-toast ref="uToast" />
		<comment-eg class="u-skeleton-fillet" ref="commentEg" :articleId="id"></comment-eg>
		<u-skeleton :loading="loading" :animation="true" bgColor="#ffffff"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				userId: '',
				title: '',
				content: '',
				list: '',
				iconName: 'thumb-up',
				iconName1: 'star',
				color: '#909090',
				color1: '#909090',
				loading: true
			}
		},
		onLoad: function(e) {
			uni.showLoading({
				title: '加载中...'
			});
			this.id = e.id;
			if (uni.getStorageSync('islogin')) {
				this.userId = uni.getStorageSync('openId');
				this.$myRequest({
					url: '/isCollect?userId=' + this.userId + '&blogId=' + this.id
				}).then(res => {
					if (res.data == true) {
						this.iconName1 = 'star-fill',
							this.color1 = '#fcd50f'
					}
				})
				this.$myRequest({
					url: '/isLikey?userId=' + this.userId + '&blogId=' + this.id
				}).then(res => {
					if (res.data == true) {
						this.iconName = 'thumb-up-fill',
							this.color = '#0794ff'
					}
				})
				this.$myRequest({
					url: '/addHistoryOnly?userId=' + this.userId + '&blogId=' + this.id
				})
			}
			this.getData(this.id);
		},
		onPullDownRefresh() {
			// console.log("触发下拉刷新");
			uni.showLoading({
				title: '加载中...'
			});
			this.getData(this.id);
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1500)
		},
		methods: {
			async getData(id) {
				const res = await this.$myRequest({
					url: '/GetBlog?id=' + id
				})
				// .then(res => {})
				this.title = res.data.title;
				this.content = res.data.text;
				uni.hideLoading();
				this.loading = false;
			},
			setIcon() {
				if (uni.getStorageSync('islogin')) {
					if (this.iconName != 'thumb-up-fill') {
						const res = this.$myRequest({
							url: '/addLikeyOnly?userId=' + this.userId + '&blogId=' + this.id
						}).then(res => {
							if (res.data == true) {
								this.$refs.uToast.show({
									title: '点赞成功',
									type: 'success',
								});
							} else {
								this.$refs.uToast.show({
									title: '点赞失败',
									type: 'warning',
								});
							}
						})
						this.iconName = 'thumb-up-fill',
							this.color = '#0794ff'
					} else {
						const res = this.$myRequest({
							url: '/DelLikey',
							method: 'DELETE',
							data: {
								userId: this.userId,
								blogId: this.id
							}
						}).then(res => {
							if (res.data == true) {
								this.$refs.uToast.show({
									title: '取消成功',
									type: 'info',
								});
							} else {
								this.$refs.uToast.show({
									title: '取消失败',
									type: 'warning',
								});
							}
						})
						this.iconName = 'thumb-up',
							this.color = '#909090'
					}
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录',
						confirmText: '前往登录',
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '../myuser/myuser'
								});
							}
						}
					});
				}
			},
			setIcon1() {
				if (uni.getStorageSync('islogin')) {
					if (this.iconName1 != 'star-fill') {
						const res = this.$myRequest({
							url: '/CollectB?userId=' + this.userId + '&blogId=' + this.id
						}).then(res => {
							if (res.data == "收藏成功") {
								this.$refs.uToast.show({
									title: '收藏成功',
									type: 'success',
								});
							} else {
								this.$refs.uToast.show({
									title: '收藏失败',
									type: 'warning',
								});
							}
						})
						this.iconName1 = 'star-fill',
							this.color1 = '#fcd50f'
					} else {
						const res = this.$myRequest({
							url: '/DeleteC',
							method: 'DELETE',
							data: {
								userId: this.userId,
								blogId: this.id
							}
						}).then(res => {
							if (res.data == "取消收藏成功") {
								this.$refs.uToast.show({
									title: '取消成功',
									type: 'info',
								});
							} else {
								this.$refs.uToast.show({
									title: '取消失败',
									type: 'warning',
								});
							}
						})
						this.iconName1 = 'star',
							this.color1 = '#909090'
					}
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录',
						confirmText: '前往登录',
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '../myuser/myuser'
								});
							}
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/uni-ui.scss';

	.content {
		padding: 10upx 2%;
		width: 96%;
		flex-wrap: wrap;
	}

	.title {
		line-height: 2em;
		font-size: 38upx;
		font-weight: 700;
	}

	.art-content {
		line-height: 2em;
	}

	.uni-footer {
		margin: 80rpx 0 10rpx 0;
		padding: 30rpx 60rpx 30rpx 60rpx;
		border-top: 1px solid #a6adaa;
		border-bottom: 1px solid #a6adaa;
		box-shadow: 4px -4px 20px #a6adaa;
	}
</style>
