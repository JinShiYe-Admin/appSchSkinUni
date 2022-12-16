<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="">
			<view class="example-body">
				<view v-for="(model,index) in pagedata" :key='index'>
					<uni-card isShadow>
						<view class="title-text">
							<view v-if="model.eval_type == 1" class='otherIndex'>期评</view>
							<view v-else class='otherIndex'>毕业评</view>
							<span style='margin-left: 5px;'>{{model.name}}</span>
						</view>
						<view style="font-size: 13px;color: #101010;margin-top: 3px;">创建人：{{model.create_user_name}}
							<span style='margin-left: 30px;'>创建时间：{{model.create_time}}</span>
						</view>
						<view v-if="model.stu_fill == 0" style="text-align: center;margin-top: 10px;">
							<button style="width: 150px;border: 1px solid #00baad;color: #00baad;" type="default" size="mini"
								@click="gotoDetail(item)">去填写</button>
						</view>
					</uni-card>
				</view>
				<view style="height: 5px;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pagedata: [],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem(model) {
				model.index_code = this.index_code;
				util.openwithData('/pages/costMs/accountApproveDetail', model, {
					refreshAccApproveIndexList(data) { //子页面调用父页面需要的方法
						_this.showLoading();
						_this.getList0();
					}
				});
			},
			getList0() {
				let comData = {
					stu_code: this.personInfo.stu_code, //
					index_code: this.index_code,
				}
				// 列表查询报告填写记录
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/reportList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						// for (var i = 0; i < data.data.list.length; i++) {
						// 	let tempM = data.data.list[i];
						// 	if(tempM.status == 1){
						// 		tempM.statusStr = '预览';
						// 	}else if(tempM.status == 2){
						// 		tempM.statusStr = '待批';
						// 	}else if(tempM.status == 3){
						// 		tempM.statusStr = '已批';
						// 	}
						// 	if(tempM.progress == 1){
						// 		tempM.progressStr = '新建';
						// 	}else if(tempM.progress == 2){
						// 		tempM.progressStr = '审批中';
						// 	}else if(tempM.progress == 3){
						// 		tempM.progressStr = '审毕';
						// 	}
						// }
						this.pagedata = [].concat(data.data.list);
						if (data.data.list.length == 0) {
							this.showToast('暂无数据');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1]
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getList0();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.cardPCls {
		width: 40px !important;
		height: 18px;
		background: #04D0BE;
		color: white;
		font-size: 12px;
		text-align: center;
		padding-top: 0px;
		margin-top: 3px;
		float: left;
	}

	.cardConent {
		font-size: 13px;
		word-break: break-all;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
		color: #787878;
	}

	.otherIndex {
		text-align: center;
		border: 1px solid #00baad;
		color: #00baad;
		border-radius: 5px;
		width: 70px;
		padding: 2px 5px;
		font-size: 13px;
	}

	.title-text {
		display: flex;
		align-items: center;
		/* width: 80vw; */
		font-weight: 900;font-size: 15px;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
	}

	.leaveType {
		font-size: 12px;
		width: auto;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}
</style>
