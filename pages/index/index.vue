<!-- 首页 -->
<template>
	<view class="container">
		<!-- 滚动通知 -->
		<u-notice-bar type="primary" mode="horizontal" :more-icon="true" :is-circular="true" :autoplay="true"
			:list="list" bg-color="#d9eeff" color="#1379ff"></u-notice-bar>
		<!-- 轮播图 -->
		<u-swiper :height="360" mode="none" :list="imglist" :effect3d="true" border-radius="20"></u-swiper>

		<!-- 文章 -->
		<view>
			<!-- 基于 uni-list 的页面布局 -->
			<uni-list>
				<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
				<uni-list-item direction="column" v-for="item in news" :key="item.id"
					:to="'/pages/info/info?id='+ item.id">
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
			<u-back-top top="600" bottom="180" :scroll-top="scrollTop" icon="arrow-up" tips="返回"
				:icon-style="iconStyle">
			</u-back-top>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top="40"
				margin-bottom='38' />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: [],
				scrollTop: 0,
				current: 1,
				pages: 0,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '上滑加载',
					loading: '正在加载',
					nomore: '没有更多了'
				},
				list: [
					'思维帮——博客小程序',
					'帮助你解放思维、畅思所想',
					'本小程序由阳光养猪场倾情赞助'
				],
				iconStyle: {
					fontSize: '32rpx',
					color: '#2979ff'
				},
				imglist: [{
						image: "https://img2.baidu.com/it/u=3555869004,2232314718&fm=26&fmt=auto"
					},
					{
						image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Ff082984aff237d71e1809a90dfe9b4cd41b83b7011095-hoAPeo_fw658"
					},
					{
						image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F018a2959521228a8012193a3f55275.gif"
					}
				]
			}
		},
		onShow() {
			uni.showLoading({
				title: '加载中...'
			});
			this.getData();
		},
		onPullDownRefresh() {
			//显示加载动画
			uni.showLoading({
				title: '加载中...'
			});
			this.current = 1;
			this.news = [];
			setTimeout(() => {
				//停止下拉刷新
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
					url: '/BlogPagination?current=' + this.current
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

<style lang="scss" scoped>
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
