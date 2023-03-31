<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;margin-right: 5px;">
				<picker style="flex: 1;"  @change="dptClick" :value="dptIndex" :range="dptList" range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{dptList[dptIndex].text}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
				<picker style="flex: 1;"  @change="userClick" :value="userIndex" :range="userList" range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{userList[userIndex].text}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='endDate' timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</view>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 38px;">
			<uni-list>
				<uni-list-item v-for="(model,index) in dataList" :key='index' direction='column'>
					<view slot="body">
						<view class="">
							<a class="tempCss">部门：</a>
							<a class="biaoti">{{model.dpt_name}}<span class="biaoti" style="float: right;">{{model.begin_time}} ~ {{model.end_time}}</span></a>
						</view>
						<view class="">
							<a class="tempCss">姓名：</a>
							<a class="biaoti">{{model.user_name}}</a>
						</view>
						<view class="">
							<a class="tempCss">地点：</a>
							<a class="biaoti">{{model.note_addr}}</a>
						</view>
						<view class="">
							<a class="tempCss">内容：</a>
							<a class="biaoti">{{model.note_note}}</a>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				icon:'',
				add:false,//add按钮权限
				navItem: {},
				pageSize: 10,
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
				dataList:[],
				//顶部筛选框相关内容
				dptIndex:0,
				userIndex:0,
				qjlxIndex:0,
				time:this.moment().format('YYYY-MM-DD'),
				dptList: [{text:'',value:'-1'}],
				userList: [{text:'',value:'-1'}],
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD')
			}
		},
		components: {
			mynavBar
		},
		methods: {
			dptClick:function(e){
				if(this.dptIndex!==e.detail.value){
					 this.dptIndex=e.detail.value
					 this.userIndex=0
					 this.userList=[{text:'',value:'-1'}]
					 this.loadMoreText = "加载中..."
					 this.flagRef = 0;
					 this.pageIndex = 1;
					 this.getDptUser(this.dptList[this.dptIndex]);
				}
			},
			userClick:function(e){
				if(this.userIndex!==e.detail.value){
					 this.userIndex=e.detail.value
					 this.loadMoreText = "加载中..."
					 this.flagRef = 0;
					 this.pageIndex = 1;
					 this.getPageDataArray();
				}
			},
			timeSelect(e){
				this.time=e
				this.loadMoreText = "加载中..."
				this.flagRef = 0;
				this.pageIndex = 1;
				this.getPageDataArray();
			},
			getUserInfo(){//1.17.当前登录用户部门及额外角色
				let comData={
					user_code:this.personInfo.user_code,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'user/userInfo',comData,(data0,data)=>{
					this.hideLoading();
					if (data.code == 0) {
						let dpts = data.data.dpt_list;
						if(dpts.length>0 ){
							for (var i = 0; i < dpts.length; i++) {
								var tempDpt = dpts[i];
								tempDpt.text = tempDpt.dpt_name;
								tempDpt.value = tempDpt.dpt_code;
								tempDpt.userArray = [];
							}
							this.dptList=dpts;
							//1.14.学校部门用户
							this.getDptUser(dpts[0]);
						}else{
							events.closeWaiting();
							this.showToast('无数据授权 无法获取部门');
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getDptUser(dptModel){//1.14.学校部门用户
				let comData={
					dpt_codes:dptModel.dpt_code,
					page_size:'999',
					pageIndex:'1',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'dptUser',comData,(data0,data)=>{
					this.hideLoading()
					if (data.code == 0) {
						let users = data.data.list;
						if(users.length>0 ){
							var tempArr = [{
								user_name:'全部老师',
								user_code:'0',
								dpt_code:dptModel.dpt_code,
							}];
							users = tempArr.concat(users);
							for (var i = 0; i < users.length; i++) {
								var tempM = users[i];
								tempM.value = tempM.user_code;
								tempM.text = tempM.user_name;
							}
							for (var i = 0; i < this.dptList.length; i++) {
								var tempDpt = this.dptList[i];
								if (tempDpt.dpt_code == users[0].dpt_code) {
									tempDpt.userArray = [].concat(users);
								}
							}
							this.userList=users;
							// 获取数据
							this.pageIndex = 1;
							this.flagRef = 0;
							this.pageArray = [];
							this.getPageDataArray();
						}else{
							this.showToast('当前部门没有人员');
						}
					}else{
						this.showToast(data.msg);
					}
				})
			},
			getPageDataArray(){//获取页面数据
				let user_codes=[]
				let user_names=[]
				if(this.userList[this.userIndex].user_code=='0'){
					this.userList.map(function(item){
						if(item.user_code=='0'){}else{
							user_codes.push(item.user_code)
							user_names.push(item.user_name)
						}
					})
				}else{
					user_codes.push(this.userList[this.userIndex].user_code)
					user_names.push(this.userList[this.userIndex].user_name)
				}
				let comData = {
					dpt_code: this.dptList[this.dptIndex].dpt_code,//部门Code
					dpt_name: this.dptList[this.dptIndex].dpt_name,//部门名称
					user_codes:user_codes.join(","),//用户Code
					user_names:user_names.join(","),//用户名称
					begin_time: this.time, //查询开始时间
					end_time: this.time, //查询结束时间
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_PROGRAMME+'note/getDptNotes',comData,(data0,data)=>{
				    if (data.code == 0) {
				    	var tempArray = [];
				    	for (var i = 0; i < data.data.list.length; i++) {
				    		var tempM = data.data.list[i];
				    		for (var a = 0; a < tempM.notes.length; a++) {
				    			var tempModel = tempM.notes[a];
				    			tempModel.dpt_name = tempM.dpt_name;
				    			tempModel.dpt_code = tempM.dpt_code;
				    			tempArray.push(tempModel);
				    		}
				    	}
						this.pageIndex++;
						this.total_page = data.data.total_page;
						if (this.flagRef == 0) {
							if (tempArray.length == 0) {
								this.showToast('暂无数据');
							}
							this.dataList = [].concat(tempArray);
							uni.stopPullDownRefresh();
						} else {
							this.dataList = this.dataList.concat(tempArray);
						}
				    } else {
				    	this.showToast(data.msg);
				    }
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.navItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			this.getUserInfo();
			//#ifdef H5
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageDataArray();
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getPageDataArray();
			}, 300);
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
				//#ifdef H5
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
		/* margin: 0 -15px; */
	}
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	/* margin: 5px 0; */
	 }
	 
	.tempCss{
		font-size: 14px;
		color: #000000;
	}
	
	.biaoti{
		font-size: 14px;
		color: gray;
		word-break: break-all;
	}
</style>
