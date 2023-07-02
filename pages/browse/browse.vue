<!-- 浏览历史 -->
<template>
	<view>
		<uni-list v-for="(item,index) in news" :key="index">
			<uni-list-item :title="item.title" rightText="⛄" ellipsis=1 :note="item.releasedTime" link
				:to="'/pages/info/info?id='+item.id"></uni-list-item>
		</uni-list>
		<u-back-top top="200" bottom="70" :scroll-top="scrollTop" icon="arrow-up" tips="返回" :icon-style="iconStyle">
		</u-back-top>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top="40" margin-bottom='38' />
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
				}
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
			this.getData();
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
			this.getData();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if (this.current < this.pages){
				this.current += 1;
				this.status = 'loading'
				this.getData();
			}else{
				this.status = 'nomore'
			}
		},
		methods: {
			async getData() {
				const res = await this.$myRequest({
					url: '/GetHistoryByUser?userId=' + this.userId
				}).then(ids => {
					this.$myRequest({
						url: '/SelectBlogListByIdList',
						method: 'POST',
						data: {
							"ids": ids.data,
							"current": this.current
						}
					}).then(res => {
						this.pages = res.data.pages
						this.news = this.news.concat(res.data.records);
						if (this.current < this.pages){
							this.status = 'loadmore'
						}else{
							this.status = 'nomore'
						}
					})
				})
				uni.hideLoading();
			}
		}
	}
</script>

<style>
	uni-list-item {
		text-align: left;
		color: $u-content-color;
		font-weight: 600;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
