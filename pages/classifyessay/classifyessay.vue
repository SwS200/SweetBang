<!-- 分类文章页面 -->
<template>
	<!-- 文章 -->
	<view>
		<!-- 基于 uni-list 的页面布局 -->
		<uni-list>
			<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
			<uni-list-item direction="column" v-for="item in news" :key="item.id" :to="'/pages/info/info?id='+item.id">
				<!-- 通过header插槽定义列表的标题 -->
				<template v-slot:header>
					<view class="uni-title">{{item.title}}</view>
				</template>
				<!-- 通过body插槽定义列表内容显示 -->
				<template v-slot:body>
					<view class="uni-list-box">
						<view class="uni-content">
							<view class="uni-title-sub uni-ellipsis-2">作者：{{item.author}}</view>
							<view class="uni-note">{{item.releasedTime}}</view>
						</view>
					</view>
				</template>
				<!-- 同步footer插槽定义列表底部的显示效果 -->
				<template v-slot:footer>
					<view class="uni-footer">
						<u-icon name="eye" :label="item.visitNum"></u-icon>
						<u-icon name="thumb-up" :label="item.likeNum"></u-icon>
						<u-icon name="chat" :label="item.commentNum"></u-icon>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<u-back-top top="600" bottom="180" :scroll-top="scrollTop" icon="arrow-up" tips="返回" :icon-style="iconStyle">
		</u-back-top>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top="40" margin-bottom='38' />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: [],
				classifyid: '',
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
		onLoad: function(e) {
			uni.showLoading({
				title: '加载中...'
			});
			this.current = 1;
			this.classifyid = e.classifyid;
			this.getData(this.classifyid);
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
			this.getData(this.classifyid);
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if (this.current < this.pages){
				this.current += 1;
				this.status = 'loading'
				this.getData(this.classifyid);
			}else{
				this.status = 'nomore'
			}
		},
		methods: {
			async getData(classifyid) {
				const res = await this.$myRequest({
					url: '/SearchBlogByCollectId?classifyId=' + classifyid + '&current=' + this.current
				})
				this.pages = res.data.pages
				this.news = this.news.concat(res.data.records);
				if (this.current < this.pages){
					this.status = 'loading'
				}else{
					this.status = 'nomore'
				}
				uni.hideLoading();
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	.uni-title {
		font-size: 18px;
	}
</style>
