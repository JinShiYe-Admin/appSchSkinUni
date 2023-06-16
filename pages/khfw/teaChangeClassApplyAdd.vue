<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存并发送" :textClick="textClick">
		</mynavBar>
		<view class="typeCss" style="margin: 15px 0 0 15px;"><uni-icons type="star-filled" color='#d9001b'
				size="10"></uni-icons>调课事由：</view>
		<textarea style="margin-top: 10px;" maxlength="300" v-model="content" class="rightView"
			placeholder="请输入"></textarea>
		<view style="font-size: 16px;font-weight: 900;margin: 10px 0 0 15px;">调课、代课、停课安排</view>
		<view class="select-line"></view>
		<uni-card isShadow style="margin: 10px;" v-for="(item,index) in tempPlanList" :key="index">
			<uni-icons style="float: right;" type="forward" color='#2c96bd' size="22"
				@click="clickAddEdit(1,item)"></uni-icons>
			<view class="subTea">安排{{index+1}}：</view>
			<view style="height: 1px;background: #d7d7d7;margin-top: 22px;"></view>
			<view class="cardTitle">原课程安排</view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyleP">日期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.originalCls.sub_date.split(' ')[0]}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">星期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.originalCls.week_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">上课时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.originalCls.time_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">上课地点：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">
						{{item.originalCls.addr_list.length>0?item.originalCls.addr_list[0].address:'--'}}
					</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">课程：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.originalCls.sub_name}}</view>
				</uni-col>
			</uni-row>
			<view class="cardTitle">调、代、停课安排</view>
			<view v-if="item.flag == 0">
				<uni-row style="margin-top: 10px;">
					<uni-col :span="6">
						<view class="rowStyleP">日期：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.nowCls.sub_date.split(' ')[0]}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">星期：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.nowCls.week_name}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">上课时间：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.nowCls.time_name}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">上课地点：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{addrList[item.addrIndex].address}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">课程：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.nowCls.sub_name?item.nowCls.sub_name:'--'}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">代课人：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{teaList0[item.teaIndex].tec_name}}</view>
					</uni-col>
				</uni-row>
				<view class="itemStatus">调课</view>
			</view>
			<view v-if="item.flag == 1">
				<uni-row style="margin-top: 10px;">
					<uni-col :span="6">
						<view class="rowStyleP">代课人：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{teaList1[item.teaIndex].tec_name}}</view>
					</uni-col>
				</uni-row>
				<view class="itemStatus" style="margin: 0px 0 10px 0;">代课</view>
			</view>
			<view v-if="item.flag == 2">
				<view class="rowStyleP">无</view>
				<view class="itemStatus" style="margin: 0px 0 10px 0;">停课</view>
			</view>
		</uni-card>
		<view class="addBtn" @click="clickAddEdit(0)" style="margin-top: 15px;">+添加调课安排</view>
		<view style="height: 10px;background: #f2f2f2;"></view>
		<uni-popup ref="popup1" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">
				{{editOrAdd==0?'添加':'修改'}}调课安排</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<view style="font-size: 16px;font-weight: 900;margin: 0px 0 0 15px;">请选择原课程</view>
					<view class="select-line" style="margin-bottom: 10px;"></view>
					<uni-pagination :total="totalDate" :current="returnIndex0" show-icon="true" :value='returnIndex0'
						@change="change0" /></uni-pagination>
					<view style="font-weight: 900;font-size: 16px;text-align: center;margin: -25px 0 10px 0;">
						{{yearMonth0}}
					</view>
					<uni-row style="">
						<uni-col :span="3">
							<view class="rowStyle" style="border:1px solid transparent"></view>
						</uni-col>
						<uni-col :span="3" v-for="(item,index) in tempArr0" :key="index">
							<view class="rowStyle">{{item}}</view>
						</uni-col>
						<uni-col :span="3">
							<view class="rowStyle" style="border:1px solid transparent"></view>
						</uni-col>
						<uni-col :span="3" v-for="(item,index) in weekArray" :key="index">
							<view class="rowStyle">{{item}}</view>
						</uni-col>
						<view style="margin-top: 10px;">
							<view v-for="(item0,index0) in pageData0" :key="index0">
								<!-- <uni-col :span="3">
									<view class="rowClass" style="background: #e1d3be;">
										<view class="rowStyle">{{item0.name}}</view>
										<view class="rowStyle">{{item0.start_time.slice(0, 5)}}</view>
										<view class="rowStyle">-</view>
										<view class="rowStyle">{{item0.end_time.slice(0, 5)}}</view>
									</view>
								</uni-col> -->
								<uni-col :span="3">
									<view class="rowClass" style="background: #e1d3be;"
										:style="{height:(152*item0.child.length-2)+'px'}">
										<view class="rowStyle" style="padding-top: 10px;">
											{{item0.name}}
										</view>
										<view class="rowStyle">{{item0.start_time.slice(0, 5)}}</view>
										<view class="rowStyle">-</view>
										<view class="rowStyle">{{item0.end_time.slice(0, 5)}}</view>
									</view>
								</uni-col>
								<!-- <view v-for="(item1,index1) in item0.child">
									<uni-col :span="3" v-if="item1.setValue == 1">
										<view class="rowClass"
											:style="{background:item1.selectFlag == 1?'#2c96bd':item1.canSelect == 1?'':'#f2f2f2',color:item1.selectFlag == 1||item1.canSelect == 1?'white':''}"
											@click="clickSign(item1,0)">
											<view class="rowStyle" style="font-weight: 900;">{{item1.sub_name}}</view>
											<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
												{{item1.addr_list.length>0?item1.addr_list[0].address:''}}
											</view>
										</view>
									</uni-col>
									<uni-col :span="3" v-else>
										<view class="rowClass" style="background: #f2f2f2;">
										</view>
									</uni-col>
								</view> -->
								<view v-for="(item1,index1) in item0.child" :key="index1">
									<view v-for="(item2,index2) in item1.child" :key="index2">
										<uni-col :span="3" v-if="item2.setValue == 1">
											<view class="rowClass" :style="{background:item2.selectFlag == 1?'#2c96bd':item2.canSelect == 1?'':'#f2f2f2',color:item2.selectFlag == 1||item2.canSelect == 1?'white':''}"
												@click="clickSign(item2,0)">
												<view class="rowStyle" style="font-weight: 900;padding-top: 10px;">{{item2.sub_name}}</view>
												<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
													{{item2.addr_list.length>0?item2.addr_list[0].address:''}}
												</view>
											</view>
										</uni-col>
										<uni-col :span="3" v-else>
											<view class="rowClass" style="background: #f2f2f2;"></view>
										</uni-col>
									</view>
								</view>
							</view>
						</view>
					</uni-row>
					<view style="font-size: 16px;font-weight: 900;margin: 20px 0 0 15px;">该课程将要进行</view>
					<view class="select-line" style="margin-bottom: 15px;"></view>
					<view class="btnCss0" :class="[typeFlag==0?'selectBtn':'']" @click="clickBtn(0)">调课</view>
					<view class="btnCss1" :class="[typeFlag==1?'selectBtn':'']" @click="clickBtn(1)">代课</view>
					<view class="btnCss2" :class="[typeFlag==2?'selectBtn':'']" @click="clickBtn(2)">停课</view>
					<view style="font-size: 16px;font-weight: 900;margin: 70px 0 0 15px;">请选择调课安排</view>
					<view class="select-line" style="margin-bottom: 10px;"></view>
					<view v-if="typeFlag==0">
						<view style="margin-left: 10px;margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
								size="10"></uni-icons>教师：</view>
						<view @click="teaClick()" class="titleRight">
							{{teaStr}}
							<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
						<uni-pagination :total="totalDate" :current="returnIndex1" show-icon="true"
							:value='returnIndex1' @change="change1" /></uni-pagination>
						<view style="font-weight: 900;font-size: 16px;text-align: center;margin: -25px 0 10px 0;">
							{{yearMonth1}}
						</view>
						<uni-row style="">
							<uni-col :span="3">
								<view class="rowStyle" style="border:1px solid transparent"></view>
							</uni-col>
							<uni-col :span="3" v-for="(item,index) in tempArr1" :key="index">
								<view class="rowStyle">{{item}}</view>
							</uni-col>
							<uni-col :span="3">
								<view class="rowStyle" style="border:1px solid transparent"></view>
							</uni-col>
							<uni-col :span="3" v-for="(item,index) in weekArray" :key="index">
								<view class="rowStyle">{{item}}</view>
							</uni-col>
							<view style="margin-top: 10px;">
								<view v-for="(item0,index0) in pageData1" :key="index0">
									<!-- <uni-col :span="3">
										<view class="rowClass" style="background: #e1d3be;">
											<view class="rowStyle">{{item0.name}}</view>
											<view class="rowStyle">{{item0.start_time.slice(0, 5)}}</view>
											<view class="rowStyle">-</view>
											<view class="rowStyle">{{item0.end_time.slice(0, 5)}}</view>
										</view>
									</uni-col> -->
									<uni-col :span="3">
										<view class="rowClass" style="background: #e1d3be;"
											:style="{height:(152*item0.child.length-2)+'px'}">
											<view class="rowStyle" style="padding-top: 10px;">
												{{item0.name}}
											</view>
											<view class="rowStyle">{{item0.start_time.slice(0, 5)}}</view>
											<view class="rowStyle">-</view>
											<view class="rowStyle">{{item0.end_time.slice(0, 5)}}</view>
										</view>
									</uni-col>
									<!-- <view v-for="(item1,index1) in item0.child">
										<uni-col :span="3" v-if="item1.setValue == 1">
											<view class="rowClass"
												:style="{background:item1.selectFlag == 1?'#2c96bd':item1.canSelect == 1?'':'#f2f2f2',color:item1.selectFlag == 1||item1.canSelect == 1?'white':''}"
												@click="clickSign(item1,1)">
												<view class="rowStyle" style="font-weight: 900;">{{item1.sub_name}}
												</view>
												<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
													{{item1.addr_list.length>0?item1.addr_list[0].address:''}}
												</view>
											</view>
										</uni-col>
										<uni-col :span="3" v-else>
											<view class="rowClass"
												:style="{background:item1.selectFlag == 1?'#2c96bd':item1.canSelect == 1?'':'#f2f2f2'}"
												@click="clickSign(item1,1)">
											</view>
										</uni-col>
									</view> -->
									<view v-for="(item1,index1) in item0.child" :key="index1">
										<view v-for="(item2,index2) in item1.child" :key="index2">
											<uni-col :span="3" v-if="item2.setValue == 1">
												<view class="rowClass" :style="{background:item2.selectFlag == 1?'#2c96bd':item2.canSelect == 1?'':'#f2f2f2',color:item2.selectFlag == 1||item2.canSelect == 1?'white':''}"
													@click="clickSign(item2,1)">
													<view class="rowStyle" style="font-weight: 900;padding-top: 10px;">{{item2.sub_name}}</view>
													<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
														{{item2.addr_list.length>0?item2.addr_list[0].address:''}}
													</view>
												</view>
											</uni-col>
											<uni-col :span="3" v-else>
												<view class="rowClass" :style="{background:item2.selectFlag == 1?'#2c96bd':item2.canSelect == 1?'':'#f2f2f2'}" @click="clickSign(item2,1)"></view>
											</uni-col>
										</view>
									</view>
								</view>
							</view>
						</uni-row>
						<view style="margin-left: 10px;margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
								size="10"></uni-icons>上课地点：</view>
						<view @click="addrClick()" class="titleRight" style="margin-left: 100px;">
							{{addrStr}}
							<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</view>
					<view v-if="typeFlag==1">
						<view style="margin-left: 10px;margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
								size="10"></uni-icons>教师：</view>
						<view @click="teaClick()" class="titleRight">
							{{teaStr}}
							<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</view>
					<view v-if="typeFlag==2" style="text-align: center;margin: 10px 0;">无</view>
				</scroll-view>
			</view>
			<view style="height: 50px;margin-top: 20px;">
				<button :class="[editOrAdd ==0?'mini-btn0':'mini-btn1']" type="default" size="mini"
					style="background-color: #169bd5;border-color: #169bd5;" @click="popSure(1)">确定</button>
				<button :class="[editOrAdd ==0?'mini-btn0':'mini-btn1']" style="" type="default" size="mini"
					@click="popSure(0)">取消</button>
				<button v-if="editOrAdd ==1" :class="[editOrAdd ==0?'mini-btn0':'mini-btn1']"
					style="background-color: #d9001b;border-color: #d9001b;" type="default" size="mini"
					@click="popSure(2)">删除</button>
			</view>
			<view style="height: 20px;"></view>
		</uni-popup>
		<uni-popup ref="popup2" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择教师</view>
			<scroll-view scroll-y="true" style="max-height: 400px;">
				<view style="margin: 20px 10px;">
					<uni-grid :column="4">
						<uni-grid-item v-for="(item, index) in teaList0" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='teaSelect(index)'
								:style="index==teaIndex0?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.tec_name}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</scroll-view>
		</uni-popup>
		<uni-popup ref="popup3" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择代课教师</view>
			<scroll-view scroll-y="true" style="max-height: 400px;">
				<view style="margin: 20px 10px;">
					<uni-grid :column="4">
						<uni-grid-item v-for="(item, index) in teaList1" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='teaSelect(index)'
								:style="index==teaIndex1?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.tec_name}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</scroll-view>
		</uni-popup>
		<uni-popup ref="popup4" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择上课地点</view>
			<scroll-view scroll-y="true" style="max-height: 400px;">
				<view style="margin: 20px 10px;">
					<uni-grid :column="2">
						<uni-grid-item v-for="(item, index) in addrList" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='addrSelect(index)'
								:style="index==addrIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.address}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				content: '',
				yearMonth0: '', //年、月显示
				totalDate: 600,
				returnIndex0: 1, //
				tempArr0: [],
				weekArray: ['一', '二', '三', '四', '五', '六', '日'],
				start_date0: '',
				end_date0: '',
				pageData0: [],
				selectModel0: {},//选择的原课程
				typeFlag: 0, //0调课，1代课，2停课
				editOrAdd: 0, //0添加，1编辑
				editIndex: 0, //编辑课程的索引
				yearMonth1: '', //年、月显示
				returnIndex1: 1, //
				tempArr1: [],
				start_date1: '',
				end_date1: '',
				pageData1: [],
				selectModel1: {},//选择的调课课程
				teaList0: [], //教师列表，调课
				teaList1: [], //教师列表，代课
				teaIndex0: 0, //调课时教师index
				teaIndex1: 0, //代课时教师index
				teaStr: '',
				addrList: [],
				addrIndex: 0,
				addrStr: '',
				tempPlanList: [], //临时安排列表
				// selectCls0: [], //选择的原课程id
				// selectCls1: [], //选择的调课课程id
				showDate0: [], //原课程的7天日期列表
				showDate1: [], //调整课程的7天日期列表
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '添加调课申请';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '添加调课申请'
			});
			// 获取代课老师
			this.getTeaList();
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			teaClick() {
				if (this.typeFlag == 0) {//0调课，1代课，2停课
					this.$refs.popup2.open();
				} else {
					this.$refs.popup3.open();
				}
			},
			teaSelect(index) {
				if (this.typeFlag == 0) {//0调课，1代课，2停课
					if (this.teaIndex0 != index) {
						this.teaIndex0 = index;
						this.teaStr = this.teaList0[this.teaIndex0].tec_name;
						this.selectModel1 = {};
						this.pageData1 = [];
						this.setDate1();
						this.getSignSchedule(1, this.start_date1, this.end_date1, this.teaList0[this.teaIndex0].tec_code);
					}
					this.$refs.popup2.close();
				} else {
					if (this.teaIndex1 != index) {
						this.teaIndex1 = index;
						this.teaStr = this.teaList1[this.teaIndex1].tec_name;
					}
					this.$refs.popup3.close();
				}
			},
			addrClick() {
				this.$refs.popup4.open();
			},
			addrSelect(index) {
				if (this.addrIndex != index) {
					this.addrIndex = index;
					this.addrStr = this.addrList[this.addrIndex].address;
				}
				this.$refs.popup4.close();
			},
			getTeaList() {
				let comData = {
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'tec', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.teaList1 = [].concat(data.data.list);
						this.teaStr = this.teaList1[this.teaIndex1].tec_name;
					} else {
						this.showToast('获取不到学年');
					}
				})
			},
			clickBtn(flag) {
				this.typeFlag = flag;
				if (this.typeFlag == 0) {
					this.teaStr = this.teaList0[this.teaIndex0].tec_name;
				} else {
					this.teaStr = this.teaList1[this.teaIndex1].tec_name;
				}
			},
			textClick() {
				// console.log('this.tempPlanList:'+JSON.stringify(this.tempPlanList))
				if (this.content.length == 0) {
					this.showToast('请输入调课事由');
					return;
				} else if (this.tempPlanList.length == 0) {
					this.showToast('请添加调课安排');
					return;
				}
				var tempArr = [];
				for (var i = 0; i < this.tempPlanList.length; i++) {
					var tempM = this.tempPlanList[i];
					var tempNow = {
						old_date:tempM.originalCls.sub_date,//原课程安排-日期
						old_week_name:tempM.originalCls.week_name,//原课程安排-星期名称
						old_week_code:tempM.originalCls.week_code,//原课程安排-星期代码
						old_lesson_time:tempM.originalCls.name,//原课程安排-上课时间
						old_place:tempM.originalCls.addr_list.length>0?tempM.originalCls.addr_list[0].address:'',//原课程安排-地点
						old_place_sign_id:tempM.originalCls.addr_list.length>0?tempM.originalCls.addr_list[0].id:'',//原课程安排-地点签到代码
						old_lesson_sign_id:tempM.originalCls.after_class_sign_id,//原课程安排-课程签到代码
						old_lesson_name:tempM.originalCls.sub_name,//原课程安排-课程名称
						old_tec_sign_id:tempM.originalCls.id,//原课程安排-教师签到代码
						old_start_time:tempM.originalCls.start_time,//原课程安排-开始时间
						old_end_time:tempM.originalCls.end_time,//原课程安排-结束时间
						old_time_id:tempM.originalCls.after_class_time_id
					}
					if (tempM.flag == 0) {
						tempNow.type = 1;//
						tempNow.type_name = '调课';//
						tempNow.new_date = tempM.nowCls.sub_date;//调课安排-日期
						tempNow.new_week_name = tempM.nowCls.week_name;//调课安排-星期名称
						tempNow.new_week_code = tempM.nowCls.week_code;//调课安排-星期代码
						tempNow.new_lesson_time = tempM.nowCls.name;//调课安排-上课时间
						tempNow.new_place = this.addrList[tempM.addrIndex].address;//调课安排-地点
						tempNow.new_addr_id = this.addrList[tempM.addrIndex].id;//调课安排-地点
						tempNow.new_lesson_sign_id = tempM.nowCls.after_class_sign_id?tempM.nowCls.after_class_sign_id:'';//调课安排-课程签到代码
						tempNow.new_lesson_name = tempM.nowCls.sub_name;//调课安排-课程名称
						tempNow.new_start_time = tempM.nowCls.start_time;//调课安排-开始时间
						tempNow.new_end_time = tempM.nowCls.end_time;//调课安排-结束时间
						tempNow.substitute_name = this.teaList0[tempM.teaIndex].tec_name;//代课老师名称
						tempNow.substitute_code = this.teaList0[tempM.teaIndex].tec_code;//代课老师代码
						tempNow.new_time_id = tempM.nowCls.timeID?tempM.nowCls.timeID:tempM.nowCls.after_class_time_id;//调课-时间段代码
					} else if (tempM.flag == 1) {
						tempNow.type = 2;//
						tempNow.type_name = '代课';//
						tempNow.substitute_name = this.teaList1[tempM.teaIndex].tec_name;//代课老师名称
						tempNow.substitute_code = this.teaList1[tempM.teaIndex].tec_code;//代课老师代码
					} else if (tempM.flag == 2) {
						tempNow.type = 0;//
						tempNow.type_name = '停课';//
					}
					tempArr.push(tempNow);
				}
				let comData = {
					proposer_code: this.personInfo.user_code,//申请人代码
					proposer_name: this.personInfo.user_name,//申请人名称
					dpt_code: this.personInfo.dpt_code,//部门代码
					dpt_name: this.personInfo.dpt_name,//部门名称
					sch_code: this.personInfo.sch_code,//学校代码
					explanation: this.content,//说明
					content_list:tempArr,//调课内容
					index_code: this.navItem.index_code,
				}
				// console.log('comData:'+JSON.stringify(comData));
				this.showLoading();
				// 4.1.添加调课申请
				this.post(this.globaData.INTERFACE_KHFW + 'changeCourse/add', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshteaChangeClassApply');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			clickAddEdit(flag, model) {
				this.editOrAdd = flag;
				if (flag == 0 && this.tempPlanList.length == 30) {
					this.showToast('一次最多只能添加30条课程安排');
					return;
				}
				this.$refs.popup1.open();
				setTimeout(() => {
					this.pageData0 = [];
					this.pageData1 = [];
					this.teaIndex0 = 0;
					this.addrIndex = 0;
					this.teaIndex1 = 0;
					// 如果是添加
					if (this.editOrAdd == 0) {
						this.typeFlag = 0;
						this.returnIndex0 = 30;
						this.returnIndex1 = 30;
						if (this.teaList0.length > 0) {
							this.teaStr = this.teaList0[this.teaIndex0].tec_name;
						}
						if (this.addrList.length > 0) {
							this.addrStr = this.addrList[this.addrIndex].address;
						}
					} else {
						this.typeFlag = model.flag;
						// 当前日期所在周
						var tempArr = util.getWeekDataList(this.moment().format('YYYY-MM-DD'));
						// 指定日期所在周
						var tempArr1 = util.getWeekDataList(this.tempPlanList[this.editIndex].originalCls.sub_date
							.split(' ')[0]);
						// 获取上面两个周第一天，相差周数
						var tempPPP = this.moment(tempArr1[0]).diff(this.moment(tempArr[0]), 'weeks');
						this.returnIndex0 = 30 + tempPPP;
						if (this.typeFlag == 0) {
							var tempArr2 = util.getWeekDataList(this.tempPlanList[this.editIndex].nowCls.sub_date
								.split(' ')[0]);
							// 获取上面两个周第一天，相差周数
							var tempPPP1 = this.moment(tempArr2[0]).diff(this.moment(tempArr[0]), 'weeks');
							this.returnIndex1 = 30 + tempPPP1;
						}
						this.selectModel0 = model.originalCls;
						if (model.flag == 0) {
							this.selectModel1 = model.nowCls;
						}
						if (this.typeFlag == 0) {
							this.teaIndex0 = model.teaIndex;
							this.addrIndex = model.addrIndex;
							if (this.teaList0.length > 0) {
								this.teaStr = this.teaList0[this.teaIndex0].tec_name;
							}
						} else {
							this.teaIndex1 = model.teaIndex;
							if (this.teaList1.length > 0) {
								this.teaStr = this.teaList1[this.teaIndex1].tec_name;
							}
						}
						// console.log('this.selectModel0:'+JSON.stringify(this.selectModel0))
					}
					
					this.setDate0();
				}, 500)
			},
			popSure(flag) {
				console.log('this.selectModel1:' + JSON.stringify(this.selectModel1));
				if (flag == 1) { //确定
					if (this.selectModel0.id) {} else {
						this.showToast('请选择原课程');
						return;
					}
					if (this.typeFlag == 0) { //调课
						if (this.selectModel1.id) {} else {
							this.showToast('请选择调课安排课程');
							return;
						}
						if (this.teaList0.length == 0) {
							this.showToast('没有老师，请联系管理人员');
							return;
						}
						if (this.addrList.length == 0) {
							this.showToast('没有上课地点，请联系管理人员');
							return;
						}
						var tempM = {
							flag: this.typeFlag,
							originalCls: this.selectModel0,
							nowCls: this.selectModel1,
							teaIndex: this.teaIndex0,
							addrIndex: this.addrIndex
						}
						// 如果是添加
						if (this.editOrAdd == 0) {
							this.tempPlanList.push(tempM)
						} else {
							this.tempPlanList.splice(this.editIndex, 1, tempM);
						}
					} else if (this.typeFlag == 1) { //代课
						if (this.teaList1.length == 0) {
							this.showToast('没有老师，请联系管理人员');
							return;
						}
						var tempM = {
							flag: this.typeFlag,
							originalCls: this.selectModel0,
							teaIndex: this.teaIndex1,
						}
						// 如果是添加
						if (this.editOrAdd == 0) {
							this.tempPlanList.push(tempM)
						} else {
							this.tempPlanList.splice(this.editIndex, 1, tempM);
						}
					} else { //停课
						var tempM = {
							flag: this.typeFlag,
							originalCls: this.selectModel0,
						}
						// 如果是添加
						if (this.editOrAdd == 0) {
							this.tempPlanList.push(tempM)
						} else {
							this.tempPlanList.splice(this.editIndex, 1, tempM);
						}
					}
					// console.log('this.tempPlanList:' + JSON.stringify(this.tempPlanList));
				} else if (flag == 2) { //删除
					this.tempPlanList.splice(this.editIndex, 1);
				}
				this.$refs.popup1.close();
			},
			// flag,0原课程，1调课课程
			clickSign(model, flag) {
				console.log('model:' + JSON.stringify(model));
				if (model.canSelect == 0) {
					if (flag == 0) {
						if (this.selectModel0.id) {
							if (this.selectModel0.id == model.id) {

							} else {
								this.selectModel0.selectFlag = !this.selectModel0.selectFlag;
								model.selectFlag = 1;
								this.selectModel0 = model;
							}
						} else {
							model.selectFlag = 1;
							this.selectModel0 = model;
						}
					} else {
						if (this.selectModel1.id) {
							if (this.selectModel1.id == model.id) {

							} else {
								this.selectModel1.selectFlag = !this.selectModel1.selectFlag;
								model.selectFlag = 1;
								this.selectModel1 = model;
							}
						} else {
							model.selectFlag = 1;
							this.selectModel1 = model;
						}
						// 选择调课课程时，如果是调课，给设置对应的原地址
						if (this.typeFlag == 0&&model.addr_list&&model.addr_list.length>0) {
							for (var i = 0; i < this.addrList.length; i++) {
								var tempM = this.addrList[i];
								if (tempM.id == model.addr_list[0].after_class_addr_id) {
									this.addrIndex = i;
									this.addrStr = this.addrList[this.addrIndex].address;
								}
							}
						}
					}
				} else {
					this.showToast('已经选过当前课程');
				}
				// console.log('this.pageData0:'+JSON.stringify(this.pageData0))
			},
			// 获取原课程
			setDate0() {
				var tempD = this.totalDate / 2 / 10;
				var tempFlag = tempD - this.returnIndex0;
				this.yearMonth0 = this.moment().subtract(7 * tempFlag, 'days').format('YYYY') + '年' + this.moment()
					.subtract(7 * tempFlag, 'days').format('MM') + '月';
				var tempDay = this.moment().subtract(7 * tempFlag, 'days').format('DD');
				// 
				this.showDate0 = util.getWeekDataList(this.moment().subtract(7 * tempFlag, 'days').format('YYYY-MM-DD'));
				this.tempArr0 = [];
				for (var i = 0; i < this.showDate0.length; i++) {
					this.tempArr0.push(this.showDate0[i].split('-')[2]);
				}
				this.start_date0 = this.showDate0[0];
				this.end_date0 = this.showDate0[6];
				this.getSignSchedule(0, this.start_date0, this.end_date0, '');
			},
			// 获取调课课程
			setDate1() {
				var tempD = this.totalDate / 2 / 10;
				var tempFlag = tempD - this.returnIndex1;
				this.yearMonth1 = this.moment().subtract(7 * tempFlag, 'days').format('YYYY') + '年' + this.moment()
					.subtract(7 * tempFlag, 'days').format('MM') + '月';
				var tempDay = this.moment().subtract(7 * tempFlag, 'days').format('DD');
				// 
				this.showDate1 = util.getWeekDataList(this.moment().subtract(7 * tempFlag, 'days').format(
					'YYYY-MM-DD'));
				this.tempArr1 = [];
				for (var i = 0; i < this.showDate1.length; i++) {
					this.tempArr1.push(this.showDate1[i].split('-')[2]);
				}
				this.start_date1 = this.showDate1[0];
				this.end_date1 = this.showDate1[6];
				if (this.teaList0.length == 0) {
					this.showToast('暂无可调课老师');
				} else {
					this.getSignSchedule(1, this.start_date1, this.end_date1, this.teaList0[this.teaIndex0].tec_code);
				}
			},
			change0(e) {
				this.returnIndex0 = e.current;
				this.setDate0();
			},
			change1(e) {
				this.returnIndex1 = e.current;
				this.setDate1();
			},
			// flag，0原课程，1调课课程
			getSignSchedule(flag, startDate, endDate, tecCode) {
				//签到课程表
				let comData = {
					start_date: startDate,
					end_date: endDate,
					tec_code: tecCode,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_KHFW + 'changeCourse/signSchedule', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						var tempArr1 = [];
						if (flag == 0) {
							tempArr1 = data.data.list;
							if (this.teaList0.length == 0) {
								this.teaList0 = [].concat(data.data.tec_list);
							}
							// 如果是调课，获取调课相关
							if (this.typeFlag == 0) {
								this.setDate1();
								if (this.teaList0.length > 0) {
									this.teaStr = this.teaList0[this.teaIndex0].tec_name;
								}
							}
							if (this.addrList.length == 0) {
								this.addrList = [].concat(data.data.addr_list);
								if (data.data.addr_list.length>0) {
									this.addrStr = this.addrList[this.addrIndex].address;
								}
							}

							if (data.data.list.length == 0) {
								this.pageData0 = [];
								this.showToast('当前周你没有需要调课的课程');
								return;
							}
						} else {
							tempArr1 = data.data.time_list;
						}
						var tempArr0 = [];
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM0 = tempArr1[i];
							tempArr0.push({
								time_name: flag == 0 ? tempM0.time_name : tempM0.name + '（' + tempM0.start_time.slice(0, 5) + '-' + tempM0.end_time.slice(0, 5) + '）',
								// time_name: '（' + tempM0.start_time.slice(0, 5) + '-' + tempM0.end_time.slice(0, 5) + '）',
								name: tempM0.name,
								start_time: tempM0.start_time,
								end_time: tempM0.end_time,
								timeID: tempM0.id,
								child: []
							});
						}
						// console.log('tempArr00:'+JSON.stringify(tempArr0));
						tempArr0 = util.ArrayUnique(tempArr0, 'time_name');
						tempArr0.sort(util.compare('start_time', 1));
						// console.log('tempArr01:'+JSON.stringify(tempArr0));
						// 将课程按照周一到周日，形成数组
						var tempArr1 = JSON.parse(JSON.stringify(tempArr0));
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM = tempArr1[i];
							for (var a = 1; a < 8; a++) {
								tempM.child.push({
									week_code: a==7?0:a,
									child: []
								})
							}
						}
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM0 = tempArr1[i];
							for (var a = 0; a < tempM0.child.length; a++) {
								var tempM1 = tempM0.child[a];
								for (var b = 0; b < data.data.list.length; b++) {
									var tempM2 = data.data.list[b];
									if (flag == 0) {
										if (tempM2.week_code == tempM1.week_code&&tempM0.start_time == tempM2.start_time && tempM0.end_time == tempM2.end_time) {
											tempM2.setValue = 1;
											tempM2.selectFlag = this.selectFlagModel(0, tempM2.id); //是否已经选中
											tempM2.canSelect = this.canSelectModel(0, tempM2.id); //是否点击选中
											if (tempM2.selectFlag == 1) {
												this.selectModel0 = tempM2;
											}
											tempM1.child.push(tempM2);
										}
									} else {
										if (tempM0.start_time == tempM2.start_time && tempM0.end_time == tempM2
											.end_time && tempM2.week_code == tempM1.week_code) {
											tempM2.setValue = 1;
											tempM2.selectFlag = this.selectFlagModel(1, tempM2.id); //是否已经选中
											tempM2.canSelect = this.canSelectModel(1, tempM2.id); //是否点击选中
											if (tempM2.selectFlag == 1) {
												this.selectModel1 = tempM2;
											}
											tempM1.child.push(tempM2);
										}
									}
								}
							}
						}
						for (var i = 0; i < tempArr0.length; i++) {
							var tempM00 = tempArr0[i];
							var tempIndex = 0;
							for (var m = 0; m < tempArr1[i].child.length; m++) {
								var tempM11 = tempArr1[i].child[m];
								tempIndex = tempM11.child.length > tempIndex ? tempM11.child.length : tempIndex;
							}
							for (var m = 0; m < tempIndex; m++) {
								tempM00.child.push({
									child: []
								})
							}
							if (tempIndex==0) {
								tempM00.child.push({
									child: []
								})
							}
							// console.log('tempM00:'+flag+':' + JSON.stringify(tempM00));
							for (var a = 0; a < tempM00.child.length; a++) {
								var tempM01 = tempM00.child[a];
								for (var n = 0; n < 7; n++) {
									var tempQ = tempArr1[i].child[n];
									if (tempQ.child[a] && tempQ.child[a].start_time == tempM00.start_time && tempQ.child[a].end_time == tempM00.end_time) {
										tempM01.child.push(tempQ.child[a]);
									} else {
										var tempW = {
											// week_code: a, //设置星期几
											// setValue: 0 //判断当前model是否有数据 ，0无，1有
											sub_date: this.showDate1[n],
											week_code: a, //设置星期几
											week_name: '周'+this.weekArray[n],
											setValue: 0, //判断当前model是否有数据 ，0无，1有
											selectFlag: this.selectFlagModel(flag, tempArr1[i].timeID +'_' + n +'_'+
												(flag == 0 ? this.showDate0[n] : this.showDate1[n])+'_'+this.teaIndex0), //是否已经选中
											canSelect: this.canSelectModel(flag, tempArr1[i].timeID +'_' + n +'_'+
												(flag == 0 ? this.showDate0[n] : this.showDate1[n])+'_'+this.teaIndex0),
											id: tempArr1[i].timeID +'_' + n +'_'+
												(flag == 0 ? this.showDate0[n] : this.showDate1[n])+'_'+this.teaIndex0,
											time_name: tempArr1[i].time_name,
											name: tempArr1[i].name,
											start_time: tempArr1[i].start_time,
											end_time: tempArr1[i].end_time,
											timeID: tempArr1[i].timeID,
										}
										tempM01.child.push(tempW);
										if (flag == 0 && tempW.selectFlag == 1) {
											this.selectModel0 = tempW;
										} else if (flag == 1 && tempW.selectFlag == 1) {
											this.selectModel1 = tempW;
										}
									}
									
								}
							}
						}
						// console.log('tempArr02:'+JSON.stringify(tempArr0));
						if (flag == 0) {
							this.pageData0 = tempArr0;
						} else {
							this.pageData1 = tempArr0;
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			// searchAddr(id,array){
			// 	if (array&&array.length==0) {
			// 		return '--';
			// 	}
			// 	for (var i = 0; i < array.length; i++) {
			// 		if (array[i].id == id) {
			// 			return array[i].address;
			// 		}
			// 	}
			// },
			canSelectModel(flag, id) { //课程是否已经添加过安排，如果安排过，则不能继续选择,flag=0原课程，1调课课程
				var tempFlag = 0;
				for (var i = 0; i < this.tempPlanList.length; i++) {
					var tempM = this.tempPlanList[i];
					if (this.editOrAdd == 1 && this.editIndex == i) {

					} else {
						if (flag == 0) {
							if (tempM.originalCls.id == id) {
								tempFlag++;
							}
						}
						if (flag == 1) {
							if (tempM.nowCls && tempM.nowCls.id == id) {
								tempFlag++;
							}
						}
					}
				}
				if (tempFlag == 0) {
					return 0; //可选
				} else {
					return 1; //不可选
				}
			},
			selectFlagModel(flag, id) { //如果是编辑，给默认选中状态，flag=0原课程，1调课课程
				var tempFlag = 0;
				// for (var i = 0; i < this.tempPlanList.length; i++) {
				// 	var tempM = this.tempPlanList[i];
				if (this.editOrAdd == 1) {
					if (flag == 0) {
						if (this.selectModel0.id && this.selectModel0.id == id) {
							tempFlag++;
						}
					}
					if (flag == 1) {
						if (this.selectModel1.id && this.selectModel1.id == id) {
							tempFlag++;
						}
					}
				}
				// }
				if (tempFlag == 0) {
					return 0; //未选
				} else {
					return 1; //已选
				}
			},
		}
	}
</script>

<style>
	.typeCss {
		font-size: 14px;
		color: #333333;
	}

	.uni-list-cell {
		justify-content: flex-start;
		font-size: 13px;
		margin-top: 10px;
		margin-left: 15px;
	}

	.uni-list-cell::after {
		height: 0px !important;
	}

	::v-deep uni-radio .uni-radio-input {
		width: 15px !important;
		height: 15px !important;
	}

	.show-time {
		border: 1px solid gainsboro;
		padding: 8px;
		margin: 10px 20px 0 15px;
		border-radius: 3px;
		font-size: 13px;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		height: 80px;
		padding-top: 5px;
		margin: 0 15px 0 15px;
		width: auto;
		background: white;
	}

	.select-line {
		height: 3px;
		background-color: #aaaaaa;
		margin: 0 10px;
	}

	.subTea {
		font-size: 14px;
		font-weight: 700;
		float: left;
	}

	.cardTitle {
		text-align: center;
		font-size: 14px;
		background: #eae9e9;
		padding: 3px 0;
		margin-top: 5px;
	}

	.rowStyleP {
		font-size: 13px;
		min-height: 20px;
		margin-top: 2px;
	}

	.itemStatus {
		font-size: 18px;
		color: #f59a23;
		border: 2px solid #f59a23;
		width: 38px;
		padding: 0px 10px;
		border-radius: 8px;
		float: right;
		margin-top: -70px;
		transform: rotate(315deg);
		font-family: 700;
	}

	.addBtn {
		font-size: 13px;
		background: #169bd5;
		width: 150px;
		color: white;
		text-align: center;
		padding: 10px 0;
		border-radius: 4px;
		margin-left: 10px;
	}

	.mini-btn0 {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		/* margin-left: calc(100% - 400px); */
		margin-left: calc((100% - 200px)/3);
		font-size: 14px;
		color: white;
		background: #7f7f7f;
	}

	.mini-btn1 {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		/* margin-left: calc(100% - 400px); */
		margin-left: calc((100% - 300px)/4);
		font-size: 14px;
		color: white;
		background: #7f7f7f;
	}

	/* .rowStyle {
		font-size: 12px !important;
		text-align: center;
		margin-top: 10px;
		margin: 2px;
		word-break: break-all;
	}

	.rowClass {
		color: #333333;
		font-size: 10px !important;
		margin-top: 5px;
		text-align: center;
		height: 100px;
		background: #f06f38;
		border-radius: 5px;
		margin: 1px;
		padding-top: 10px;
		word-break: break-all;
	} */
	
	.rowStyle {
		font-size: 12px !important;
		text-align: center;
		word-break: break-all;
	}
	
	.rowClass {
		color: #333333;
		font-size: 10px !important;
		text-align: center;
		height: 150px;
		background: #00cfbd;
		border-radius: 5px;
		margin: 2px 1px 0 1px;
		word-break: break-all;
	}

	::v-deep .uni-pagination__num-current {
		color: rgba(0, 0, 0, 0) !important;
		display: none !important;
	}

	::v-deep .uni-pagination__num-current-text {
		color: rgba(0, 0, 0, 0) !important;
		display: none !important;
	}

	.btnCss0 {
		width: 80px;
		height: 30px;
		text-align: center;
		color: #7f7f7f;
		padding-top: 8px;
		border-radius: 3px;
		font-size: 13px;
		border: 1px solid #aaaaaa;
		float: left;
		margin-left: calc((100% - 240px)/4);
	}

	.btnCss1 {
		width: 80px;
		height: 30px;
		text-align: center;
		padding-top: 8px;
		border-radius: 3px;
		font-size: 13px;
		background: white;
		color: #7f7f7f;
		border: 1px solid #aaaaaa;
		float: left;
		margin-left: calc((100% - 240px)/4);
	}

	.btnCss2 {
		width: 80px;
		height: 30px;
		text-align: center;
		padding-top: 8px;
		border-radius: 3px;
		font-size: 13px;
		background: white;
		color: #7f7f7f;
		border: 1px solid #aaaaaa;
		float: left;
		margin-left: calc((100% - 240px)/4);
	}

	.selectBtn {
		background: #169bd5;
		border: 1px solid #169bd5;
		color: white;
	}

	.titleRight {
		border-radius: 3px;
		height: 30px;
		color: #7f7f7f;
		font-size: 14px;
		margin: -30px 0 20px 70px;
		border: 1px solid #aaaaaa;
		width: 200px;
		padding: 8px 0 0 10px;
	}

	::v-deep .uni-date-x {
		padding: 0px !important;
	}

	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}

	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}

	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}

	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}
</style>