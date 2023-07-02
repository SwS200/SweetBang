<template>
	<view>
		<t-slide ref="tslides" height="120" @edit="edit" @del="del" @itemClick="itemClick" :btnArr="btnArr"></t-slide>
		<u-back-top top="200" bottom="70" :scroll-top="scrollTop" icon="arrow-up" tips="返回" :icon-style="iconStyle">
		</u-back-top>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top="38" margin-bottom='40' />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: [],
				userId: '',
				current: 1,
				pages: 0,
				scrollTop: 0,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '上滑加载',
					loading: '正在加载',
					nomore: '没有更多了'
				},
				iconStyle: {
					fontSize: '32rpx',
					color: '#2979ff'
				},
				btnArr: [{
					name: '删除',
					background: '#ff7070',
					color: '#fff',
					events: 'del'
				}]
			}
		},
		onShow() {
			if (this.news != []){
				this.news = []
			}
			uni.showLoading({
				title: '加载中...'
			});
			this.current = 1;
			this.userId = uni.getStorageSync('openId');
			this.getData(this.userId);
		},
		onPullDownRefresh() {
			uni.showLoading({
				title: '加载中...'
			});
			this.current = 1;
			this.news = [];
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1500)
			this.getData(this.userId);
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if (this.current < this.pages){
				this.current += 1;
				this.status = 'loading'
				this.getData(this.userId);
			}else{
				this.status = 'nomore'
			}
		},
		methods: {
			async getData(userId) {
				if (userId != '') {
					const res = await this.$myRequest({
						url: '/SelectUsersDraft?userId=' + userId + '&current=' + this.current
					})
					this.pages = res.data.pages
					this.news = this.news.concat(res.data.records);
					if (this.current < this.pages){
						this.status = 'loading'
					}else{
						this.status = 'nomore'
					}
					this.$nextTick(() => {
						this.$refs.tslides.assignment(this.news);
					});
					uni.hideLoading();
				}
			},
			//点击单行
			itemClick(data) {
				var id = data.id;
				this.$toPage('../edit/edit?id=' + id + '&isDraft=' + 'true');
			},
			//删除
			del(data) {
				var res = this.$myRequest({
					url: '/DelDraftContent?id=' + data.id,
					method: 'DELETE'
				});
				res.then(err => {
					if (err.data == "success") {
						this.$u.toast(`删除成功`);
						this.getData(this.userId);
					} else {
						this.$u.toast(`删除失败`);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	uni-list-item {
		text-align: left;
		color: $u-content-color;
		font-weight: 600;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
