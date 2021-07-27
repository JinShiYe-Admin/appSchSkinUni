<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">请假时间</view>
			<input class="uni-input form-right" name="nickname" placeholder="请输入姓名" />
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">请假时间</view>
			<input class="uni-input form-right" name="nickname" placeholder="请输入姓名" disabled/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">请假时间</view>
			<textarea placeholder="请输入请假事由" maxlength="100" ></textarea>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">请假时间</view>
			<switch class="form-right" :checked="autoplay" @change="changeAutoplay" color="#00CFBD"/>
		</view>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view" style="justify-content: space-between;height: 35px;">
			<view class="form-left">抄送人</view>
			<uni-icons size="24" type="personadd-filled" color="#00CFBD" @click="addPeople"></uni-icons>
		</view>
		<view class="line-green"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left-approve">
				<template v-for="(item,index) in formData.copy_list"><template v-if="index < formData.copy_list.length-1">{{item.text}},</template><template v-else>{{item.text}}</template></template>
			</view>
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
				tabBarItem: {},
				
				
				
				
				autoplay:false,
				canSub:true,
				formData: {
					grd:{text:'',value:''},//年级选择值
					cls:{text:'',value:''},//班级选择值
					stu:{text:'',value:''},//学生选择值
					begin_time:'',//请假开始时间
					end_time:'',//请假结束时间
					diff_times_text:'',//时间差
					diff_times_days:0,//时间差 天
					qjlb:{text:'',value:''},//请假类别选择值
					crqx:{text:'',value:''},//出入权限选择值
					comment:'',//说明
					copy_list:[],//抄送人选择对象
				}, //表单内容
				grdList: [], //年级数组
				clsList: [], //班级数组
				stuList: [], //学生数组
				qjlbList: [{text:'病假',value:'sickLeave'},{text:'事假',value:'absenceLeave'}], //请假类别数组
				crqxList: [{text:'可回宿舍',value:'backDorm'},{text:'可出入校园',value:'outSchool'}], //出入权限数组
				approve_rules:[],//额外的审批人规则列表
				approve_list:[],//额外的审批人列表 
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建请假申请'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				 
			},500)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			changeAutoplay(){
				this.autoplay = !this.autoplay
			},
			addPeople(){
				console.log(123);
				util.openwithData('/pages/leave/peopleSelect',{index_code:this.index_code})
			}
		}
	}
</script>

<style>
	.line{
		height: 0.5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.line-green{
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
		color: #3F3F3F;
	}
	.form-left-textarea{
		margin-top: 5px;
		align-self: flex-start;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}
	
	.uni-flex{
		align-items: center;
	}
	
	textarea{
		font-size: 13px;
		height: 80px;
		padding: 5px;
	}
</style>
