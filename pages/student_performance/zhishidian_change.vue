<template>
	<view>
		<h4 class="examName">{{point_name}}</h4>
		<scroll-view class="select-scroll" scroll-y="true">
			<ly-tree :tree-data="pointList" :props="{label:'name'}" node-key="id" @node-click="treeItemClick" />
		</scroll-view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="提示" content="确定要切换到该知识点吗？" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				per_code: '',
				point_name: '',
				pointList: [],
				selectItem: {}
			}
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			if (this.itemData.flag == 0) {
				this.itemData.text = '知识点选择';
				// 获取知识点目录
				this.getPointList(function(tempList) {
					console.log('onLoad--tempList:' + JSON.stringify(tempList));
					_this.pointList = [].concat(tempList);
				});
			} else {
				if (this.itemData.type == 0) {
					this.itemData.text = '知识点选择';
				} else {
					this.itemData.text = '章节选择';
				}
				this.getChapterList(function(tempList) {
					_this.pointList = [].concat(tempList);
				});
			}
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			// 
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			treeItemClick(item) {
				console.log("item: " + JSON.stringify(item));
				if (item.childNodesId.length == 0) {
					this.selectItem = item.data;
					console.log('1111111111111111');
					this.$refs.popup.open();
				}
			},
			close() {
				this.$refs.popup.close();
			},
			confirm(value) {
				this.$refs.popup.close();
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('changeZSD', this.selectItem);
				uni.navigateBack();
			},
			// 获取知识点目录
			getPointList(callback) {
				let comData = {
					per_code: this.itemData.per_code, //学段代码
					sub_code: this.itemData.nowSubject.sub_code, //科目代码
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/catalogs', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.point_name = data.data.list[0].name;
						callback(data.data.list[0].catalog_list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getDptTree(dptList) {
				const map = {};
				const val = [];
				dptList.forEach((item) => {
					map[item.dpt_code] = item;
				});
				dptList.forEach((item) => {
					const parent = map[item.pcode];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						val.push(item);
					}
				});
				return val
			},
			// 获取章节目录
			getChapterList(callback) {
				let comData = {
					type: this.itemData.type, //0为查知识点目录,1为查章节目录
					sub_code: this.itemData.nowSubject.sub_code, //科目代码
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'errorBook/catalogs', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (this.itemData.type == 0) {
							this.point_name = data.data.list[0].name;
							callback(data.data.list[0].catalog_list);
						} else {
							var tempArr = data.data.list.map(function(item) {
								return {
									children: item.catalog_list,
									name: item.name,
									id: item.id,
								}
							})
							callback(tempArr);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	/* 试卷名称 */
	.examName {
		text-align: center;
		margin-top: 20px;
		margin-left: 20px;
		margin-right: 20px;
	}

	::v-deep .ly-tree-node__content_last {
		margin-top: 5px;
	}

	::v-deep .ly-tree-node__content_noLast {
		background: #E7FAEF;
		margin-top: 5px;
	}

	::v-deep .ly-tree-node__label_last {
		border: 1px solid #D6D4D4;
		border-radius: 20px;
		padding: 5px 10px;
		margin-left: -30px;
	}
</style>
