<!-- 搜索页面 -->
<template>
	<view>
		<zy-search theme="circle" :showWant="true" @searchcontent="searchcontent" :hotList="hotList"></zy-search>

		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in news" :key="index"
				@tap="openinfo" :data-id="item.id">
				<view class="uni-media-list">
					<!-- <image class="uni-media-list-logo" :src="item.author_avatar"></image> -->
					<view class="uni-media-list-body">
						<view class="title uni-media-list-text-top">{{item.title}}</view>
						
						<view class="uni-media-list-text-bottom uni-ellipsis">{{item.author+' '+item.releasedTime}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="err" v-if="!isshow">{{err}}</view>
		<u-loadmore v-if="show" :status="status" :icon-type="iconType" :load-text="loadText" margin-top="38"
			margin-bottom='40' />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: [],
				show: false,
				isshow: false,
				err: '',
				keyword: '',
				current: 1,
				pages: 0,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '上滑加载',
					loading: '正在加载',
					nomore: '没有更多了'
				},
				hotList:['Java','Python','测试','SQL']
			}
		},
		onShow: function() {},
		onReachBottom() {
			if (this.current < this.pages){
				this.current += 1;
				this.status = 'loading'
				this.search(this.keyword);
			}else{
				this.status = 'nomore'
			}
		},
		methods: {
			async search(keyword) {
				const resp = await this.$myRequest({
					url: '/SearchBlog?keyword=' + keyword + '&current=' + this.current
				})
				this.pages = resp.data.pages
				this.news = this.news.concat(resp.data.records);
				if (this.current < this.pages){
					this.status = 'loadmore'
				}else{
					this.status = 'nomore'
				}
				if (this.news.length > 0) {
					this.show = true;
					this.isshow = true;
				} else {
					this.err = '未查询到此关键词的文章';
					this.show = false;
					this.isshow = false;
				}
			},
			openinfo(e) {
				var id = e.currentTarget.dataset.id;
				this.$toPage('../info/info?id=' + id);
			},
			searchcontent(res) {
				uni.showLoading({
					title: '加载中...'
				});
				this.keyword = res;
				this.news = [];
				this.current = 1;
				this.search(this.keyword);
				uni.hideLoading();
			}
		}
	}
</script>

<style>
	.uni-list {
		display: flex;
	}

	.title {
		text-align: left;
		color: $u-content-color;
		margin-top: 20rpx;
		line-height: 1.8em;
		font-size: 32rpx;
		font-weight: 600;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-bottom: 16rpx;
	}

	.history {
		margin: 30rpx;
		display: flex;
		flex-direction: row;
	}

	.historyTab {
		margin: 0 15rpx 10rpx 15rpx;
	}

	.uni-media-list-body {
		height: auto;
	}

	.uni-media-list-text-top {
		line-height: 1.6em;
	}

	.err {
		text-align: center;
		margin-top: 35%;
		color: #ff8383;
		font-size: 50rpx;
		font-weight: 600;
	}
</style>
