<!-- 编辑页面 -->
<template>
	<view>
		<jinEdit placeholder="请输入内容" @editOk="editOk" uploadFileUrl="/#" :html="html" :title="title"></jinEdit>

		<u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="confirm" value-name="id"
			label-name="label" child-name="children"></u-select>
	</view>
</template>

<script>
	import jinEdit from '../../components/jin-edit/jin-edit.vue';
	export default {
		data() {
			return {
				title: '',
				author: '',
				html: '',
				classifyid: '',
				userid: '',
				id: '',
				show: false,
				isedit: false,
				isPublic: false,
				isDraft: 'true',
				list: ''
			}
		},
		components: {
			jinEdit
		},
		onLoad: function(e) {
			uni.showLoading({
				title: '加载中...'
			});
			this.id = e.id;
			this.isDraft = e.isDraft;
			this.getClassify();
			this.getData(this.id);
			this.userid = uni.getStorageSync('openId');
			this.author = uni.getStorageSync('author');
		},
		methods: {
			// 点击发布
			editOk(res) {
				this.title = res['title'];
				this.html = res['html'];
				this.isPublic = res['isPublic'];
				this.show = true;
				console.log(res);
			},
			async getData(id) {
				if (id != null) {
					if(this.isDraft == "true"){
						const res = await this.$myRequest({
							url: '/GetDraft?id=' + id
						})
						this.title = res.data.title;
						this.html = res.data.text;
						this.classify_id = res.data.classifyId;
					}else{
						const res = await this.$myRequest({
							url: '/GetBlog?id=' + id
						})
						this.title = res.data.title;
						this.html = res.data.text;
						this.classify_id = res.data.classifyId;
					}
					this.isedit = true;
					// console.log("返回信息", res.data);
				}else{
					this.isedit = false;
				}
				uni.hideLoading();
			},
			async getClassify() {
				const res = await this.$myRequest({
					url: '/GetClassify'
				})
				this.list = res.data;
			},
			async setBlog(url, method, data) {
				const res = await this.$myRequest({
					url: url,
					method: method,
					data: data
				})
				console.log("消息", res);
				if (res.data == "success") {
					this.$u.toast(`操作成功`);
					if(this.isPublic == true){
						setTimeout(() => {
							this.$toPage('../essay/essay');
						}, 1000)
					}else{
						setTimeout(() => {
							this.$toPage('../draft/draft');
						}, 1000)
					}
				} else {
					this.$u.toast(`操作失败`);
				}
			},
			confirm(e) {
				this.classifyid = e[1]['value'];
				if(this.isPublic == true){
					if(this.isDraft == "false"){
						if (this.isedit == true) {
							//修改文章
							this.setBlog('/UpdateBlog', 'POST', {
								id: this.id,
								title: this.title,
								text: this.html,
								classifyId: this.classifyid
							});
							// console.log("重新编辑",this.author);
						} else {
							//新增文章
							this.setBlog('/PostBlog', 'POST', {
								title: this.title,
								text: this.html,
								classify_id: this.classifyid,
								user_id: this.userid,
								author: this.author
							});
						}
					}else{
						//在草稿中新增文章
						this.setBlog('/PostBlog', 'POST', {
							title: this.title,
							text: this.html,
							classify_id: this.classifyid,
							user_id: this.userid,
							author: this.author
						});
						//删除草稿
						this.setBlog('/DelDraftContent', 'DELETE', {
							id:this.id
						});
					}
				}else{
					if(this.isDraft == "false"){
						//新增草稿
						this.setBlog('/PostDraft', 'POST', {
							title: this.title,
							text: this.html,
							classify_id: this.classifyid,
							user_id: this.userid,
							author: this.author
						});
						if(this.id != null){
							//删除文章
							this.setBlog('/DelBlogContent', 'DELETE', {
								id:this.id
							});
						}
					}else{
						//修改草稿
						this.setBlog('/UpdateDraft', 'POST', {
							id: this.id,
							title: this.title,
							text: this.html,
							classifyId: this.classifyid
						});
					}
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
