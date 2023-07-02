<template>
	<view class="comment-eg">
		<hb-comment ref="hbComment" @add="add" @del="del" @like="like" @focusOn="focusOn" :deleteTip="'确认删除？'"
			:cmData="commentData" v-if="commentData"></hb-comment>
	</view>
</template>

<script>
	export default {
		name: 'comment-eg',
		props: {
			articleId: {
				type: String,
				default: () => {
					return null;
				}
			}
		},
		watch: {
			articleId: {
				handler: function(newVal, oldVal) {
					if (newVal) {
						this.getComment(newVal);
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				"commentData": null,
				"reqFlag": false, // 请求标志，防止重复操作，true表示请求中
				"userId": uni.getStorageSync('openId') || ''
			}
		},
		methods: {
			// 登录校验
			checkLogin() {
				// TODO 此处填写登录校验逻辑
				if (uni.getStorageSync('islogin')) {
					return true;
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录',
						confirmText: '前往登录',
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '../../pages/myuser/myuser'
								});
							}
						}
					});
					return false;
				}
			},
			// 输入框聚焦
			focusOn() {
				this.checkLogin();
			},
			// 获取评论
			getComment(articleId) {
				this.$myRequest({
					url: '/AskCommentList?blogId=' + articleId + '&userId=' + this.userId
				}).then(res => {
					this.$myRequest({
						url: '/CountVisitNum?blogId=' + articleId
					}).then(req => {
						this.commentData = {
							"readNumer": req.data,
							"commentSize": res.data.length,
							"comment": this.getTree(res.data)
						};
					})
				})
			},
			// 新增评论
			add(req) {
				if (!this.checkLogin()) {
					return
				}
				if (this.reqFlag) {
					uni.showToast({
						title: '操作频繁',
						duration: 1000
					});
					return
				}
				this.reqFlag = true;
				this.$myRequest({
					url: '/addComment',
					method: 'GET',
					data: {
						blogId: this.articleId,
						userId: this.userId,
						parentId: req.pId,
						content: req.content
					}
				}).then(req => {
					if (req.data == true) {
						this.reqFlag = false;
						uni.showToast({
							title: '评论成功！',
							duration: 3000
						});
						this.$refs.hbComment.addComplete();
						this.getComment(this.articleId);
					}
				})
			},
			// 点赞评论
			like(commentId) {
				if (!this.checkLogin()) {
					return
				}
				if (this.reqFlag) {
					uni.showToast({
						title: '操作频繁',
						duration: 1000
					});
					return
				}
				this.reqFlag = true;
				this.$myRequest({
					url: '/DealLikeyForComment',
					method: 'GET',
					data: {
						userId: this.userId,
						commentId: commentId
					}
				}).then(req => {
					if (req.data == true) {
						this.reqFlag = false;
						this.$refs.hbComment.likeComplete(commentId);
					}
				}).catch(res => {
					this.reqFlag = false;
				})
			},
			// 删除评论
			del(commentId) {
				if (!this.checkLogin()) {
					return
				}
				if (this.reqFlag) {
					uni.showToast({
						title: '操作频繁',
						duration: 1000
					});
					return
				}
				this.reqFlag = true;
				this.$myRequest({
					url: '/DelComment',
					method: 'DELETE',
					data: {
						commentId: commentId
					}
				}).then(req => {
					if (req.data == true) {
						this.$myRequest({
							url: '/DealLikeyForComment',
							method: 'GET',
							data: {
								userId: this.userId,
								commentId: commentId
							}
						})
						this.reqFlag = false;
						this.$refs.hbComment.deleteComplete(commentId);
					}
				}).catch(res => {
					this.reqFlag = false;
				})
			},
			// 列表按照父子转换成树
			getTree(data) {
				let result = [];
				let map = {};
				data.forEach(item => {
					map[item.id] = item;
				});
				data.forEach(item => {
					let parent = map[item.parentId];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						result.push(item);
					}

				});
				// console.log("result",result);
				return result;
			}
		}
	};
</script>

<style>
</style>
