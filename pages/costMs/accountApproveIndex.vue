<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background: white;">
			<uni-row>
				<uni-col :span="6">
					<picker class="flex-box" @change="statusClick" :value="statusIndex" :range="statusArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="statusArray[statusIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view class="example-body">
				<view v-for="(model,index) in pagedata" :key='index'>
					<uni-card isShadow>
						<text class="content-box-text" @click="clickItem(model,0)">
							<uni-row style=''>
								<uni-col :span="16" style="font-size: 15px;font-weight: bold;">
									{{model.apply_code}}
								</uni-col>
								<uni-col :span="8" style="text-align: right;color: red;font-size: 13px;">
									￥{{model.account_sum}}
								</uni-col>
							</uni-row>
							<view style="font-size: 15px;font-weight: bold;">类型：{{model.account_type}}</view>
							<view style="font-size: 15px;font-weight: bold;">申请人：{{model.apply_man_name}}</view>
							<view style="width: 280px;height: 25px;margin-top: 5px;">
								<p class='cardPCls' style=''>状态</p>
								<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>{{model.statusStr}}</p>
								<p class='cardPCls' style='margin-left: 20px;'>进程</p>
								<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>{{model.progressStr}}</p>
							</view>
							<view class="cardConent" style="margin-top: 5px;">事由：{{model.account_reason}}</view>
							<view class="card-line"></view>
							<uni-row style=''>
								<uni-col :span="12" class="cardConent">
									{{model.apply_time}}
								</uni-col>
								<uni-col :span="12" style="text-align: right;">
									<button v-if="model.status == 2" class="mini-btn" type="default" size="mini" style="margin-left: 5px;background: #04D0BE;color: white;" @click.stop="clickSem0Item(model,1)">同意</button>
									<button v-if="model.status == 2" class="mini-btn" type="default" size="mini" style="margin-left: 5px;background: #F0AD4E;color: white;" @click.stop="clickSem0Item(model,2)">退回</button>
								</uni-col>
							</uni-row>
						</text>
					</uni-card>
				</view>
			</view>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		<uni-popup ref="popupDel" type="dialog">
			<uni-popup-dialog title="确定?" :content="`确定${this.approveFlagStr}吗?`" :duration="2000" :before-close="true" @close="closeDel"
				@confirm="confirmDel"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				itemData: {},
				pageSize:10,
				pagedata:[],
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
				statusIndex:0,
				statusArray: [{text:'全部',value:'0'},{text:'预览',value:'1'},{text:'待批',value:'2'},{text:'已批',value:'3'}],
				approveModel:{},
				approveFlag:0,
				approveFlagStr:'',
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem(model){
				model.index_code = this.index_code;
				util.openwithData('/pages/costMs/accountApproveDetail', model, {
					refreshAccApproveIndexList(data) { //子页面调用父页面需要的方法
						_this.showLoading();
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				});
			},
			clickSem0Item(model,flag) {
				console.log('clickSem0Item:'+JSON.stringify(model));
				this.$refs.popupDel.open();
				this.approveModel = model;
				this.approveFlag = flag;
				if(flag == 1){
					this.approveFlagStr = '同意';
				}else{
					this.approveFlagStr = '退回';
				}
			},
			closeDel() {
				this.$refs.popupDel.close();
			},
			confirmDel(value) {
				this.$refs.popupDel.close();
				let comData = {
					index_code: this.index_code,
					id: this.approveModel.id,
					approve_result:this.approveFlag
				}
				if(this.approveFlag == 1){
					comData.approve_content = '同意';
				}else{
					comData.approve_content = '退回';
				}
				this.showLoading();
				//19.审批报销申请
				this.post(this.globaData.INTERFACE_COSTMS + 'accountApply/doSetAccountApprove', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.loadMoreText = "加载中..."
						this.flagRef = 0;
						this.pageIndex = 1;
						this.getList0();
					}
					this.showToast(data.msg);
				});
			},
			statusClick:function(e){
				if(this.statusIndex!==e.detail.value){
					 this.statusIndex=e.detail.value
					 this.showLoading();
					 this.loadMoreText = "加载中..."
					 this.flagRef = 0;
					 this.pageIndex = 1;
					 this.getList0();
				}
			},
			getList0(){
				let comData = {
					approve_man_code: this.personInfo.user_code,//审批人Code
					apply_code: '',
					account_type:0,
					account_reason:'',
					apply_man_name:'',
					status:this.statusArray[this.statusIndex].value,
					progress:0,
					begin_time:'20200101',
					end_time:'20501231',
					page_size:this.pageSize,
					page_number:this.pageIndex,
					index_code: this.index_code,
				}
				// 22.获取报销审批列表
				this.post(this.globaData.INTERFACE_COSTMS + 'accountApply/getAccountApproves', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							if(tempM.status == 1){
								tempM.statusStr = '预览';
							}else if(tempM.status == 2){
								tempM.statusStr = '待批';
							}else if(tempM.status == 3){
								tempM.statusStr = '已批';
							}
							if(tempM.progress == 1){
								tempM.progressStr = '新建';
							}else if(tempM.progress == 2){
								tempM.progressStr = '审批中';
							}else if(tempM.progress == 3){
								tempM.progressStr = '审毕';
							}
						}
							this.pageIndex++;
							this.total_page = data.data.total_page;
							if (this.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.pagedata = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.pagedata = this.pagedata.concat(data.data.list);
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
			this.itemData = util.getPageData(options);
			this.itemData.index = 100;
			this.index_code=this.itemData.access.split("#")[1]
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			this.getList0();
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getList0();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getList0();
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
				//#ifndef APP-PLUS
					document.title=""
				//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.select-line{
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
	 
	 .cardPCls{
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
	 
	 .cardConent{
	 	font-size: 13px;
	 	word-break: break-all;
	 	/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
	 	color: #787878;
	 }
</style>
