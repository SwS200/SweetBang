<template>
	<view>
		<u-button plain type="primary" shape="circle" :ripple="true" ripple-bg-color="#b2e4ff"
			:custom-style="customStyle" @click="add">新增文章</u-button>

		<t-slide ref="slides" height="120" @edit="edit" @del="del" @itemClick="itemClick">
		</t-slide>
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
				disabled: false,
				btnWidth: 160,
				show: false,
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
				customStyle: {
					margin: '10px'
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
						url: '/SelectUsersBlog?userId=' + userId + '&current=' + this.current
					})
					this.pages = res.data.pages
					this.news = this.news.concat(res.data.records);
					if (this.current < this.pages){
						this.status = 'loadmore'
					}else{
						this.status = 'nomore'
					}
					this.$nextTick(()=>{
						this.$refs.slides.assignment(this.news);
					});
				}
				uni.hideLoading();
			},
			//新增文章
			add() {
				this.$toPage('../edit/edit?isDraft=' + false);
			},
			//点击单行
			itemClick(data) {
				var id = data.id;
				this.$toPage('../info/info?id=' + id);
			},
			//删除
			del(data) {
				var res = this.$myRequest({
					url: '/DelBlogContent?id=' + data.id,
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
			},
			//编辑
			edit(data) {
				var id = data.id;
				this.$toPage('../edit/edit?id=' + id + '&isDraft=' + 'false');
			},
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
