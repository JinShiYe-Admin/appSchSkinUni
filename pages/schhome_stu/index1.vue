<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<scroll-view id="tab-bar" class="scroll-h tabs-fixed" :scroll-x="true" :show-scrollbar="false"
			:scroll-into-view="scrollInto">
			<view v-for="(tab,index) in typeArray" :key="tab.value" class="uni-tab-item" :id="tab.value" :data-current="index"
				@click="clickSeg">
				<text class="uni-tab-item-title"
					:class="typeIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		<view style="padding-top: 40px;" >
			<uni-list :border="false">
				<uni-list-item showArrow clickable @click="toDetails(item)" :key="index" v-for="(item,index) in pagedata" :border="true">
					<view slot="body" class="slot-box slot-text" @click.stop="toDetails(item)">
						<view style="display: flex;">
							<view class="icons-text" :class="item.msg_type=='1-1'?'icons-text-school':
								item.msg_type=='1-2'?'icons-text-grade':
								item.msg_type=='1-3'?'icons-text-class':
								item.msg_type=='1-4'?'icons-text-homework':
								item.msg_type=='1-5'?'icons-text-performance':
								item.msg_type=='1-6'?'icons-text-score':''">
									<template v-if="item.msg_type=='1-1'">校</template>
									<template v-if="item.msg_type=='1-2'">年</template>
									<template v-if="item.msg_type=='1-3'">班</template>
									<template v-if="item.msg_type=='1-4'">作业</template>
									<template v-if="item.msg_type=='1-5'">个性</template>
									<template v-if="item.msg_type=='1-6'">成绩</template>
							</view>
							<view style="display: flex;flex-direction: column;flex: 1;">
								<view style="display: flex;">
									<view class="title-text">{{item.send_user_tname}}</view>
									<view class="detail-text">{{item.send_time}}</view>
								</view>
								<view class="detail-text" style="margin-left: 5px;text-align: left; overflow: hidden; text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
									<template v-if="item.msg_type=='1-6'">请进入详情页查看</template>
									<template v-else>
										{{item.msg_content}}
									</template>
								</view>
							</view>
						</view>
					</view>
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
				navItem: {},
				index_code:'',
				//顶部筛选框相关内容
				scrollInto: '',
				typeIndex:0,
				typeArray: [
					{name:'全部',value:''},
					{name:'学校通知',value:this.MSG_SMS.SCHOOL.MSG_TYPE},
					{name:'年级通知',value:this.MSG_SMS.GRADE.MSG_TYPE},
					{name:'班级通知',value:this.MSG_SMS.CLASS.MSG_TYPE},
					// {name:'班级作业',value:this.MSG_SMS.HOMEWORK.MSG_TYPE},
					{name:'个性表现',value:this.MSG_SMS.PERFORMANCE.MSG_TYPE},
					{name:'成绩通知',value:this.MSG_SMS.SCORE.MSG_TYPE},
				],
				
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
			}
		},
		components: {
			mynavBar,
		},
		methods: {
			clickSeg: function(e) {
				// console.log('clickSeg:'+JSON.stringify(e))
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				if(this.typeIndex!==index){
					this.typeIndex=index
					this.showLoading()
					this.pageobj0.loadFlag=0
					this.pageobj0.canload=true
					this.pageobj0.page_number=1
					this.getList0();
				}
			},
			getList0(){//获取页面数据
				let comData={
					get_unit_code:this.personInfo.unit_code,
					msg_type:this.typeArray[this.typeIndex].value,
					msg_content:'',
					dest_user:'',
					dest_user_code:this.personInfo.user_code,
					send_time_begin:'1970-01-01',
					send_time_end:'2051-01-01',
					send_user:'',
					grd_code:this.personInfo.grd_code,
					cls_code:this.personInfo.cls_code,
					serviced:'0,1,99,100',
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				if(this.personInfo.type_code == 'YHLX0004'){
					comData.dest_user_code = this.personInfo.stu_code;
				}
				this.post(this.globaData.INTERFACE_SCHHOME+'api/appsms/appsmsugetp',comData,response=>{
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(response!=null){
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
					}else{
						this.pagedata=[]
						this.showToast('暂无数据')
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				util.openwithData('/pages/schhome_stu/detail',item,{})
			}
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.navItem = util.getPageData(option);
			this.index_code=this.navItem.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getList0()
			},100)
			//#ifdef H5
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
		margin: 0 -15px;
	}
	 .slot-box {
	 	flex-direction: row;
	 	align-items: center;
	 }
	 
	 .content{
	 	margin: 2px 0;
	 }
	 .slot-text {
	 	font-size: 14px;
	 	margin-right: 10px;
		flex: 1;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		align-items: center;
	 	width: 120px;
		padding-left: 5px;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
		font-size: 14px !important;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		word-break: break-all;
		text-align: right;
		flex: 1;
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
	 
	 .icons-text{
		 display: flex;
		 align-items: center;
		 flex-direction: row;
		 justify-content: space-around;
	 	width: 40px;
		margin-top: 3px;
	 	height: 40px;
	 	border-radius: 50%;
	 	padding:0px;
		font-weight: 800 !important;
		color: #FFFFFF;
		
	 }
	 
	 .icons-text.icons-text-school{
	 	background: #57D2C9;
		font-size: 15px;
	 }
	 
	 .icons-text.icons-text-grade{
	 	background:#FF9079;
		font-size: 15px;
	 }
	 
	 .icons-text.icons-text-class{
	 	background:#73ADED;
		font-size: 15px;
	 }
	 
	 .icons-text.icons-text-homework{
	 	background: #FFD757;
		font-size: 12px;
	 }
	 
	 .icons-text.icons-text-performance{
	 	background: #C879D6;
		font-size: 12px;
	 }
	 .icons-text.icons-text-score{
	 	background: #2F4553;
	 		font-size: 12px;
	 }
	 
	 .scroll-h {
	 	width: 100%;
	 	height: 40px;
	 	background-color: #F0F0F0;
	 	flex-direction: row;
	 	white-space: nowrap;
	 }
	 
	 .uni-tab-item {
	 	display: inline-block;
	 	flex-wrap: nowrap;
	 	padding-left: 17px;
	 	padding-right: 17px;
	 }
	 
	 .uni-tab-item-title {
	 	color: #555;
	 	font-size: 15px;
	 	height: 40px;
	 	line-height: 40px;
	 	flex-wrap: nowrap;
	 	white-space: nowrap;
	 }
	 
	 .uni-tab-item-title-active {
	 	color: #00CFBD;
	 }
</style>