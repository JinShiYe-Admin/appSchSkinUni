<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon='icon' :iconClick="iconClick"></mynavBar>
		<view class="tabs-fixed"  style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdArray[grdIndex].text" ></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;"  @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="clsArray[clsIndex].text" ></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;"  @change="yearClick" :value="yearIndex" :range="yearArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="yearArray[yearIndex].text" ></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;" @change="termClick" :value="termIndex" :range="termArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="termArray[termIndex].text" ></uni-easyinput-select>
				</picker>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
						<uni-row>
							<uni-col :span="24"><view class="title-text">{{item.grd_name}} {{item.class_name}}&ensp;{{item.stu_name}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text tow-line">内容: {{item.remark}}</view></uni-col>
							<uni-col :span="17"><view class="detail-text">撰写人:{{item.create_user_name}}</view></uni-col>
							<uni-col :span="7"><view class="detail-text" style="text-align: right;">{{item.create_time}}</view></uni-col>
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
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				icon:'',
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
				remarkType:[],//评语类型数组
				//顶部筛选框相关内容
				grdIndex:0,
				clsIndex:0,
				yearIndex:0,
				termIndex:0,
				grdArray: [{text:'',value:'-1'}],
				clsArray: [{text:'',value:'-1'}],
				yearArray: [{text:'',value:''}],
				termArray: [{text:'',value:''}],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			toDetails:function(item){
				item.index_code=this.index_code
				let that=this
				util.openwithData('/pages/stu_comment/stu_comment_detail',item,{
					refreshDetail(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getList0()
					}
				})
			},
			iconClick(){
				let that=this
				if(this.grdArray.length==0){
					this.showToast('无法获取年级数据，不能进行添加操作')
				}else if(this.clsArray.length==0){
					this.showToast('无法获取班级数据，不能进行添加操作')
				}else{
					util.openwithData('/pages/stu_comment/stu_comment_add',{index_code:this.index_code},{
						refreshList(data){//子页面调用父页面需要的方法
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
					 this.clsArray=[]
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
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			yearClick:function(e){
				if(this.yearIndex!==e.detail.value){
					 this.yearIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			termClick:function(e){
				if(this.termIndex!==e.detail.value){
					 this.termIndex=e.detail.value
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
						this.getList0()
					}else{
						this.clsArray=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getDictList(){//获取班级
				let comData={
					op_code:'index',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUPYSUB+'Comment/getDict',comData,response=>{
					this.hideLoading()
					let newList=response.yearArray.sort(this.compare("value",0));
					let yearList = [{
						value: '',
						text: '全部年份'
					}].concat(newList);
					let termList = [{
						value: '',
						text: '全部学期'
					}].concat(response.termArray);
					this.yearArray = yearList;
					
					this.termArray = termList;
					
					this.remarkType = response.remarkTypeArray;
				})
			},
			getList0(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					year:this.yearArray[this.yearIndex].value,
					term_name:this.termArray[this.termIndex].value,
					remark_type: '',
					begintime:'1970-01-01',
					endtime:'2050-12-31',
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUPYSUB+'Comment/list',comData,response=>{
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
			compare(propertyName,order) {
			    return function (object1, object2) { 
			        var value1 = object1[propertyName]; 
			        var value2 = object2[propertyName]; 
			        if(order==0){
			            if (value2 < value1) { 
			                return -1; 
			            } 
			            else if (value2 > value1) { 
			                return 1; 
			            } 
			            else { 
			                return 0; 
			            } 
			        }if(order==1){
			            if (value2 > value1) { 
			                return -1; 
			            } 
			            else if (value2 < value1) { 
			                return 1; 
			            } 
			            else { 
			                return 0; 
			            } 
			        }
			        
			    } 
			} 
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.tabBarItem = util.getTabbarMenu();
			this.index_code=this.tabBarItem.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 this.add=result[0]
					 if(result[0]){
						 this.icon='plusempty'
					 }
				 })
				 this.getGrd()
				 this.getDictList()
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
			}, 1000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList0()
			}
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.moreImg {
		width: 35px;
		height: 35px;
	}
	
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}
	
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
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
	 }
	 
	 .tow-line{
		 overflow: hidden;
		 width: 85vw;
		 text-overflow: ellipsis;
		 white-space: nowrap;
/* 		 text-overflow: -o-ellipsis-lastline;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 display: -webkit-box;
		 -webkit-line-clamp: 2;
		 -webkit-box-orient: vertical; */
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
	 
	 .uni-input-input{
		 font-size: 13px;
	 }
</style>