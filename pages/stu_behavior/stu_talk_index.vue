<template>
	<view>
		<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' icon="plusempty" :iconClick="iconClick"></mynavBar>
		<mynavBar v-else ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' ></mynavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="6">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdArray[grdIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="6">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="clsArray[clsIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="6">
					<picker class="flex-box" @change="thClick" :value="thIndex" :range="thArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="thArray[thIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="6">
					<picker class="flex-box" @change="ztClick" :value="ztIndex" :range="ztArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="ztArray[ztIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
						<uni-row>
							<uni-col :span="24"><view class="title-text"><view v-if="item.status!=null" class='leaveType'>{{item.item_txt}}</view>{{item.grd_name}} {{item.class_name}}&ensp;{{item.stu_name}}<view v-if="item.status!=null" :class="item.status=='unTalk'?'leaveType1':item.status=='talk'?'leaveType2':item.status=='read'?'leaveType3':''">{{item.status_txt}}</view></view></uni-col>
							
							<template v-if="item.status==null"><!-- 主动谈话 -->
								<uni-col :span="24"><view class="detail-text">谈话记录:{{item.chat_detail}}</view></uni-col>
								<uni-col :span="16"><view class="detail-text">记录人:{{item.create_user_name}}</view></uni-col>
								<uni-col :span="8"><view class="detail-text" style="text-align: right;">{{item.chat_time}}</view></uni-col>
							</template>
							<template v-if="item.status=='unTalk'"><!-- 未谈 -->
								<uni-col :span="24"><view class="detail-text">行为发生日期:{{item.behavior_time}}</view></uni-col>
							</template>
							<template v-if="item.status=='talk'"> <!-- 已谈 -->
								<uni-col :span="24"><view class="detail-text">行为发生日期:{{item.behavior_time}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">谈话记录:{{item.chat_detail}}</view></uni-col>
								<uni-col :span="16"><view class="detail-text">记录人:{{item.create_user_name}}</view></uni-col>
								<uni-col :span="8"><view class="detail-text" style="text-align: right;">{{item.chat_time}}</view></uni-col>
							</template>
							<template v-if="item.status=='read'"> <!-- 已阅 -->
								<uni-col :span="24"><view class="detail-text">行为发生日期:{{item.behavior_time}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">记录人:{{item.create_user_name}}</view></uni-col>
							</template>
						</uni-row>
					</text>
				</uni-list-item>
			</uni-list>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
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
				add:false,//add按钮权限
				tabBarItem: {},
				pageSize:15,
				pageobj0:{
					loadFlag:0,//0 刷新 1加载更多
					page_number:1,//页码
					status:'more',//加载更多的状态
					contentText: {
						contentdown: '',//上滑加载更多
						contentrefresh: '加载中',
						contentnomore: ''//没有更多
					},
					canload:true,//是否加载更多
				},
				pagedata:[],
				xwlx:'',//行为类型  ''代表全部(主动谈话+行为谈话)  'behavior'代表行为谈话
				//顶部筛选框相关内容
				grdIndex:0,
				clsIndex:0,
				thIndex:0,
				ztIndex:0,
				grdArray: [{text:'',value:''}],
				clsArray: [{text:'',value:''}],
				thArray: [{text:'',value:''}],
				ztArray: [{text:'',value:''}],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			iconClick(){
				let that=this
				if(this.grdArray.length==0){
					this.showToast('无法获取年级数据，不能进行添加操作')
				}else if(this.clsArray.length==0){
					this.showToast('无法获取班级数据，不能进行添加操作')
				}else {
					util.openwithData('/pages/stu_behavior/stu_talk_add',{index_code:this.index_code},{//新建主动谈话
						refreshTalkBehaviorZd(data){//子页面调用父页面需要的方法
							that.showLoading()
							that.pageobj0.loadFlag=0
							that.pageobj0.canload=true
							that.pageobj0.page_number=1
							that.getList0()
						}
					})
				}
			},
			grdClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.kmIndex=0
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getCls();
				}
			},
			clsClick:function(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.kmIndex=0
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			thClick:function(e){
				if(this.thIndex!==e.detail.value){
					if(e.detail.value!=''){
						this.xwlx='behavior'
					}else{
						this.xwlx=''
					}
					 this.thIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			ztClick:function(e){
				if(this.ztIndex!==e.detail.value){
					 this.ztIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			getGrd(){//获取年级
				let comData={
					op_code:'index',
					get_grd:true,
					all_grd: true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray=[];
					grds.map(function(currentValue) {
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if(grdArray.length>0 ){
						this.grdArray=grdArray;
						this.getCls();
					}else{ 
						this.grdArray=[];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(){//获取班级
				let comData={
					op_code:'index',
					grd_code:this.grdArray[this.grdIndex].value,
					get_cls:true,
					all_cls:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray=[];
					clss.map(function(currentValue) {
						let obj = {};
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if(clsArray.length>0 ){
						this.clsArray=clsArray;
						this.getList0();
					}else{
						this.clsArray=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getCl(){//获取常量
				let comData={
					op_code:'index',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'Talk/getDict',comData,response=>{
				    console.log("responseabaa: " + JSON.stringify(response));
					this.hideLoading()
					let lxList = [{value: '',text: '全部谈话'}].concat(response.qbArray);
					let ztList = [{value: '',text: '全部状态'}].concat(response.statusArray);
					this.thArray = lxList;
					this.ztArray = ztList;
				})
			},
			getList0(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					item_code: this.thArray[this.thIndex].value,
					status: this.ztArray[this.ztIndex].value,
					type:this.xwlx,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'Talk/list',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(this.pageobj0.loadFlag===0){
						this.pagedata=[].concat(response.list)
					}else{
						this.pagedata=this.pagedata.concat(response.list)
					}
					if(this.pageobj0.page_number>=response.total_page){
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}else{
						this.pageobj0.status = 'more';
					}
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				let that=this
				
				//如果自己写的，有没有权限都能删除，如果别人写的，需要验证add权限
				//学生管理这边有点特殊，它又一个规则：创建人默认有编辑和删除权限，就是即使创建人根据按钮权限接口没有编辑和删除权限，但如果它是创建人，那就默认有编辑和删除权限，所以后端返回的这两个字段已经把创建人和按钮权限这两种情况考虑在里面了
				if(item.del==1){
					item.canDelete = true
				}else{
					item.canDelete = false;
				}
				if(item.status==null){
					item.title ='主动谈话详情';
					util.openwithData("/pages/stu_behavior/stu_talk_detail", item,{
						refreshTalkBehaviorDetailZd(data){//子页面调用父页面需要的方法
							that.showLoading()
							that.pageobj0.loadFlag=0
							that.pageobj0.canload=true
							that.pageobj0.page_number=1
							that.getList0()
						},
					});//主动谈话详情
				}else if(item.status=='unTalk' || item.status=='read'){//未谈话、已阅 ，跳转到新增页
					if(item.add==1){
						let that=this
						util.openwithData("/pages/stu_behavior/stu_talk_action_add", item,{
							refreshTalkBehaviorDetail(data){//子页面调用父页面需要的方法
								that.showLoading()
								that.pageobj0.loadFlag=0
								that.pageobj0.canload=true
								that.pageobj0.page_number=1
								that.getList0()
							},
							refreshTalkDetailZt(data){
								console.log("data: " + JSON.stringify(data));
								let id=data.id;
								let bid=data.bid;
								let edit=data.edit;
								let pageArray=that.pagedata
								pageArray.map(function(item){
									let student_behavior_id=item.student_behavior_id
									console.log("item: " + JSON.stringify(item));
									if(bid==student_behavior_id){
										item.id=id
										item.edit=edit
										item.status='read'
										item.status_txt='已阅'
										item.create_user_name=data.create_user_name
									}
								})
							}
						});//新增行为谈话
					}else{
						this.showToast('无操作权限！')
					}
				}else if(item.status=='talk'){
					item.title ='行为谈话详情';
					util.openwithData("/pages/stu_behavior/stu_talk_action_detail", item,{
						refreshTalkBehaviorDetailXw(data){//子页面调用父页面需要的方法
							that.showLoading()
							that.pageobj0.loadFlag=0
							that.pageobj0.canload=true
							that.pageobj0.page_number=1
							that.getList0()
						},
					});//行为谈话详情
				}
			}
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 this.add=result[0]
					 this.hideLoading();
				 })
				 this.getGrd()
				 this.getCl()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList0()
			}
		},
	}
</script>

<style>
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	 .slot-box {
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: row;
	 	align-items: center;
	 }
	 
	 .content{
	 	margin: 2px 0;
	 }
	 .slot-text {
	 	flex: 1;
	 	font-size: 14px;
	 	margin-right: 10px;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
		 width: 80vw;
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		overflow: hidden !important;
		text-overflow: ellipsis !important;;
		white-space: nowrap !important;;
	 }
	 
	 .leaveType {
		 font-size:12px ;
	 	width: 48px;
	 	color: #EFAD44;
	 	padding:0px 3px;
	 	border-radius: 4px;
		margin-right: 3px;
	 	border: 1px solid #EFAD44;
	 }
	 .leaveType1 {
	 		 font-size:12px ;
	 	width: 26px;
	 	color: #D78F8F;
	 	padding:0px 3px;
	 	border-radius: 4px;
	 		margin-left: 3px;
	 	border: 1px solid #D78F8F;
	 }
	 .leaveType2 {
	 		 font-size:12px ;
	 	width: 26px;
	 	color: #98C0A8;
	 	padding:0px 3px;
	 	border-radius: 4px;
	 		margin-left: 3px;
	 	border: 1px solid #98C0A8;
	 }
	 .leaveType3 {
	 		 font-size:12px ;
	 	width: 26px;
	 	color: #51AFCA;
	 	padding:0px 3px;
	 	border-radius: 4px;
	 		margin-left: 3px;
	 	border: 1px solid #51AFCA;
	 }
	 .uni-input-input{
		 font-size: 13px;
	 }
</style>
