<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick">
		</mynavBar>
		<view class="tabs-fixed" style="background: white;">
			<uni-row>
				<uni-col :span="8">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
							:value="grdArray[grdIndex].text"></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
							:value="clsArray[clsIndex].text"></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="stusClick" :value="stusIndex" :range="stusArray" range-key="text">
						<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
							:value="stusArray[stusIndex].text"></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="16" style="">
					<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
						@click="showTimePick()">
						{{timePickerDate.join(' ~ ')}}
						<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
					</view>
				</uni-col>
				<uni-col :span="8" style="text-align: left;height: 40px;">
					<view style="margin-top: 10px;color: #505050;font-size: 11px;">
						记录数量：{{total_row}}
					</view>
				</uni-col>
			</uni-row>
			<uni-row style="margin-bottom: 5px;">
				<uni-col class="rowClo" :span="7">

				</uni-col>
				<uni-col class="rowClo" :span="8">

				</uni-col>
				<uni-col class="rowClo" :span="3">
					上午
				</uni-col>
				<uni-col class="rowClo" :span="3">
					下午
				</uni-col>
				<uni-col class="rowClo" :span="3">
					晚上
				</uni-col>
			</uni-row>
			<!-- <view class="select-line" style="background-color: #a6a6a6;margin-top: 5px;"></view> -->
			<view class="select-line"></view>
		</view>
		<view style="padding-top:115px;">
			<view class="t-wrap">
				<t-slide ref="slide" @del="delRow" @itemClick="clickRow">
					<template v-slot:default="{item}">
						<view class="t-conten">
							<uni-row>
								<uni-col class="rowName" :span="7">
									<view style="margin-top: -10px;">{{item.stu_name}}</view>
									<view style="font-size: 11px;color: #808080;">{{item.grd_name}} {{item.cls_name}}
									</view>
								</uni-col>
								<uni-col class="rowClass" :span="8">
									{{item.take_date.split(' ')[0]}}
								</uni-col>
								<uni-col :class="item.morning>=37.2||item.morning<=36?'rowTiwenRed':'rowTiwenBlack'"
									:span="3">
									{{item.morning}}
								</uni-col>
								<uni-col :class="item.afternoon>=37.2||item.afternoon<=36?'rowTiwenRed':'rowTiwenBlack'"
									:span="3">
									{{item.afternoon}}
								</uni-col>
								<uni-col :class="(item.evening>=37.2||item.evening<=36)?'rowTiwenRed':'rowTiwenBlack'"
									:span="3">
									{{item.evening}}
								</uni-col>
							</uni-row>
						</view>
					</template>
				</t-slide>
			</view>
		</view>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true' @confirm="confirm">
			</term-picker>
		</view>
		<uni-popup ref="popupSelect" type="center" style="background-color: white;">
			<scroll-view
				style="background-color: white;padding: 10px;border-radius: 5px 5px 0px 0px;width: 300px;height: 400px;"
				class="popupSelect" scroll-y="true">
				<view style="text-align: center;padding-top: 10px;" v-if="editModel.id">编辑体温记录</view>
				<view style="text-align: center;padding-top: 10px;" v-else>添加体温记录</view>
				<uni-row style="margin-bottom: 5px;">
					<uni-col class="addEditLeft" :span="5">
						年级：
					</uni-col>
					<uni-col :span="18">
						<picker style="margin-top: 10px;" v-if="grdArrayAddEdit.length>0" @change="clickGrdAddEdit"
							:value="grdIndexAddEdit" :range="grdArrayAddEdit" range-key='text'>
							<view class="uni-input pickBorder">{{grdArrayAddEdit[grdIndexAddEdit].text}}
								<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
							</view>
						</picker>
						<view class="addEditRight" v-if='grdArrayAddEdit.length==0'>没有获取到年级</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						班级：
					</uni-col>
					<uni-col class="" :span="19">
						<picker style="margin-top: 10px;" v-if="clsArrayAddEdit.length>0" @change="clickClsAddEdit"
							:value="clsIndexAddEdit" :range="clsArrayAddEdit" range-key='text'>
							<view class="uni-input pickBorder">{{clsArrayAddEdit[clsIndexAddEdit].text}}
								<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
							</view>
						</picker>
						<view class="addEditRight" v-if='clsArrayAddEdit.length==0'>当前年级没有班级</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						学生：
					</uni-col>
					<uni-col class="" :span="19">
						<picker style="margin-top: 10px;" v-if="stusArrayAddEdit.length>0" @change="clickStuAddEdit"
							:value="stusIndexAddEdit" :range="stusArrayAddEdit" range-key='text'>
							<view class="uni-input pickBorder">{{stusArrayAddEdit[stusIndexAddEdit].text}}
								<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
							</view>
						</picker>
						<view class="addEditRight" v-if='stusArrayAddEdit.length==0'>当前班级没有学生</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						日期：
					</uni-col>
					<uni-col class="rowClo" :span="19">
						<view class="mini-date pickBorder"
							style="margin-top: -5px;width: 185px;height: 40px;text-align: left;">
							<dy-Date :childValue='endtime' timeType="day" v-on:getData='timeSelect'
								:minSelect='startDate' :maxSelect='endDate'></dy-Date>
							<uni-icons style="padding-right: 13px;" size="13" type="arrowdown" color="#C2C7D6">
							</uni-icons>
						</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						上午体温：
					</uni-col>
					<uni-col class="" :span="19">
						<view class="pickBorder" style="margin-top: 10px;width: 185px;height: 40px;">
							<input v-model="amTiWen" class="rightInput" type="number" placeholder="请输入体温" />
							<span style='float: left;margin: -20px 0 0 190px;'>℃</span>
						</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						下午体温：
					</uni-col>
					<uni-col class="" :span="19">
						<view class="pickBorder" style="margin-top: 10px;width: 185px;height: 40px;">
							<input v-model="pmTiWen" class="rightInput" type="number" placeholder="请输入体温" />
							<span style='float: left;margin: -20px 0 0 190px;'>℃</span>
						</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						晚上体温：
					</uni-col>
					<uni-col class="" :span="19">
						<view class="pickBorder" style="margin-top: 10px;width: 185px;height: 40px;">
							<input v-model="nightTiWen" class="rightInput" type="number" placeholder="请输入体温" />
							<span style='float: left;margin: -20px 0 0 190px;'>℃</span>
						</view>
					</uni-col>
				</uni-row>
			</scroll-view>
			<view style="background-color: white;height: 50px;border-radius: 0px 0px 5px 5px;">
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="确定删除?" content="确定删除这条记录吗？" :duration="2000" :before-close="true" @close="closeDel"
				@confirm="confirmDel"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import sofarPicker from '@/components/term-picker/term-picker.vue';
	import tSlide from "@/components/t-slide/t-slide.nvue"
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				navItem: {},
				total_row: 0,
				pageSize: 15,
				pageobj0: {
					loadFlag: 0, //0 刷新 1加载更多
					page_number: 1, //页码
					status: 'more', //加载更多的状态
					contentText: {
						contentdown: '', //上滑加载更多
						contentrefresh: '加载中',
						contentnomore: '' //没有更多
					},
					canload: true, //是否加载更多
				},
				dataRangeFlag: 0, //列表获取权限0，添加1修改2获取权限
				pagedata: [],
				//顶部筛选框相关内容
				grdIndex: 0,
				grdIndexAddEdit: 0,
				clsIndex: 0,
				clsIndexAddEdit: 0,
				stusIndex: 0,
				stusIndexAddEdit: 0,
				grdArray: [{
					name: '',
					value: ''
				}],
				clsArray: [{
					name: '',
					value: ''
				}],
				stusArray: [{
					name: '',
					value: ''
				}],
				grdArrayAddEdit: [],
				clsArrayAddEdit: [],
				stusArrayAddEdit: [],
				icon: '',
				add: false, //add按钮权限
				delete: false, //delete按钮权限
				edit: false, //edit按钮权限
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				endtime: this.moment().format('YYYY-MM-DD'),
				startDate: '2020-01-01',
				endDate: this.moment().format('YYYY-MM-DD'),
				amTiWen: '',
				pmTiWen: '',
				nightTiWen: '',
				editModel: {},
				delModel: {},
			}
		},
		components: {
			mynavBar,
			sofarPicker,
			tSlide
		},
		methods: {
			closeDel() {
				this.$refs.popup.close();
			},
			confirmDel(value) {
				this.$refs.popup.close();
				//不需要加密的数据
				var comData0 = {
					index_code: this.index_code,
					ids: this.delModel.id,
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_TWJK_TEA + 'temperature/delete', comData0, (data0, data) => {
					this.hideLoading();
					this.dataRangeFlag = 0;
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
				});
			},
			//删除
			delRow(data) {
				if (this.delete) {
					this.delModel = data;
					this.$refs.popup.open();
				} else {
					this.showToast('没有删除权限');
				}
			},
			clickRow(model) {
				console.log('model:' + JSON.stringify(model));
				if (this.edit) {
					this.dataRangeFlag = 2;
					this.endtime = model.take_date.split(' ')[0];
					this.amTiWen = model.morning;
					this.pmTiWen = model.afternoon;
					this.nightTiWen = model.evening;
					this.editModel = model;
					this.getGrd();
					this.$refs.popupSelect.open();
				}
			},
			timeSelect(e) {
				console.log(e);
				this.endtime = e;
			},
			popSure(flag) {
				if (flag == 0) {
					this.$refs.popupSelect.close();
				} else {
					if ((this.amTiWen && this.amTiWen.length > 0 && this.amTiWen < 35) || (this.pmTiWen && this.pmTiWen
							.length > 0 && this.pmTiWen < 35) || (this.nightTiWen && this.nightTiWen.length > 0 && this
							.nightTiWen < 35) || (this.amTiWen && this.amTiWen.length > 0 && this.amTiWen > 42) || (this
							.pmTiWen && this.pmTiWen.length > 0 && this.pmTiWen > 42) || (this.nightTiWen && this
							.nightTiWen.length > 0 && this.nightTiWen > 42)) {
						this.showToast('请输入35°-42°体温');
						return;
					}
					let comData = {
						grd_code: this.grdArrayAddEdit[this.grdIndexAddEdit].value,
						grd_name: this.grdArrayAddEdit[this.grdIndexAddEdit].text,
						cls_code: this.clsArrayAddEdit[this.clsIndexAddEdit].value,
						cls_name: this.clsArrayAddEdit[this.clsIndexAddEdit].text,
						stu_code: this.stusArrayAddEdit[this.stusIndexAddEdit].value,
						stu_name: this.stusArrayAddEdit[this.stusIndexAddEdit].text,
						take_date: this.endtime,
						morning: this.amTiWen,
						afternoon: this.pmTiWen,
						evening: this.nightTiWen,
						index_code: this.index_code,
						sex: 1
					}
					if (this.editModel.id) {
						comData.id = this.editModel.id;
						this.post(this.globaData.INTERFACE_TWJK_TEA + 'temperature/edit', comData, response => {
							this.$refs.popupSelect.close();
							this.showLoading()
							this.dataRangeFlag = 0;
							this.pageobj0.loadFlag = 0
							this.pageobj0.canload = true
							this.pageobj0.page_number = 1
							this.getList0();
						})
					} else {
						this.post(this.globaData.INTERFACE_TWJK_TEA + 'temperature/add', comData, response => {
							this.$refs.popupSelect.close();
							this.showLoading()
							this.dataRangeFlag = 0;
							this.pageobj0.loadFlag = 0
							this.pageobj0.canload = true
							this.pageobj0.page_number = 1
							this.getList0();
						})
					}
				}
			},
			iconClick() {
				_this.editModel = {};
				_this.dataRangeFlag = 1;
				_this.amTiWen = '';
				_this.pmTiWen = '';
				_this.nightTiWen = '';
				// if(this.grdArrayAddEdit.length == 0){
				_this.getGrd();
				// }
				_this.$refs.popupSelect.open();
			},
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				console.log(date) // ['2021-06-01', '2021-07-01']
				this.showLoading()
				this.pageobj0.loadFlag = 0
				this.pageobj0.canload = true
				this.pageobj0.page_number = 1
				this.getList0();
			},
			grdClick: function(e) {
				if (this.grdIndex !== e.detail.value) {
					this.dataRangeFlag = 0;
					this.grdIndex = e.detail.value
					this.clsIndex = 0
					this.stusIndex = 0
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getCls();
				}
			},
			clickGrdAddEdit: function(e) {
				if (this.grdIndexAddEdit !== e.target.value) {
					this.grdIndexAddEdit = e.target.value;
					this.clsIndexAddEdit = 0;
					this.clsArrayAddEdit = [];
					this.stusIndexAddEdit = 0;
					this.stusArrayAddEdit = [];
					this.showLoading();
					this.getCls();
				}
			},
			clsClick: function(e) {
				if (this.clsIndex !== e.detail.value) {
					this.dataRangeFlag = 0;
					this.clsIndex = e.detail.value
					this.stusIndex = 0
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getStus();
				}
			},
			clickClsAddEdit: function(e) {
				if (this.clsIndexAddEdit !== e.target.value) {
					this.clsIndexAddEdit = e.target.value;
					this.stusIndexAddEdit = 0
					this.stusArrayAddEdit = [];
					this.showLoading();
					this.getStus();
				}
			},
			stusClick: function(e) {
				if (this.stusIndex !== e.detail.value) {
					this.stusIndex = e.detail.value
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
				}
			},
			clickStuAddEdit: function(e) {
				if (this.stusIndexAddEdit !== e.target.value) {
					this.stusIndexAddEdit = e.target.value;
				}
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: true,
					index_code: this.index_code,
				}
				if (this.dataRangeFlag != 0) {
					comData.all_grd = false;
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						if (this.dataRangeFlag == 0) {
							this.grdArray = grdArray;
						} else {
							this.grdArrayAddEdit = grdArray;
							if (this.editModel.id) {
								for (var i = 0; i < grdArray.length; i++) {
									var tempM = grdArray[i];
									if (tempM.value == this.editModel.grd_code) {
										this.grdIndexAddEdit = i;
									}
								}
							}
						}
						this.getCls();
					} else {
						if (this.dataRangeFlag == 0) {
							this.grdArray = [];
						} else {
							this.grdArrayAddEdit = [];
						}
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: true,
					index_code: this.index_code,
				}
				if (this.dataRangeFlag != 0) {
					comData.grd_code = this.grdArrayAddEdit[this.grdIndexAddEdit].value;
					comData.all_cls = false;
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						if (this.dataRangeFlag == 0) {
							this.clsArray = clsArray;
						} else {
							this.clsArrayAddEdit = clsArray;
							if (this.editModel.id) {
								for (var i = 0; i < clsArray.length; i++) {
									var tempM = clsArray[i];
									if (tempM.value == this.editModel.cls_code) {
										this.clsIndexAddEdit = i;
									}
								}
							}
						}
						this.getStus();
					} else {
						if (this.dataRangeFlag == 0) {
							this.clsArray = [];
						} else {
							this.clsArrayAddEdit = [];
						}
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStus() { //获取学生
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu: true,
					all_stu: true,
					index_code: this.index_code,
				}
				if (this.dataRangeFlag != 0) {
					comData.grd_code = this.grdArrayAddEdit[this.grdIndexAddEdit].value;
					comData.cls_code = this.clsArrayAddEdit[this.clsIndexAddEdit].value;
					comData.all_stu = false;
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let stu = response.stu_list;
					let stusArray = [];
					stu.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name !== '全部' ? currentValue.name : '全部学生';
						obj.value = currentValue.value;
						obj.text = name;
						stusArray.push(obj)
					})
					if (stusArray.length > 0) {
						if (this.dataRangeFlag == 0) {
							this.stusArray = stusArray;
						} else {
							this.stusArrayAddEdit = stusArray;
							if (this.editModel.id) {
								for (var i = 0; i < stusArray.length; i++) {
									var tempM = stusArray[i];
									if (tempM.value == this.editModel.stu_code) {
										this.stusIndexAddEdit = i;
									}
								}
							}
						}
						this.getList0()
					} else {
						if (this.dataRangeFlag == 0) {
							this.stusArray = [];
						} else {
							this.stusArrayAddEdit = [];
						}
						this.showToast('无数据授权 无法获取学生');
					}
				})
			},
			getList0() { //获取页面数据
				let comData = {
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					stu_code: this.stusArray[this.stusIndex].value,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					start_date: this.timePickerDate[0],
					end_date: this.timePickerDate[1],
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_TWJK_TEA + 'temperature/page', comData, response => {
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 1000);
					this.total_row = response.total_row;
					this.hideLoading()
					if (this.pageobj0.loadFlag === 0) {
						this.pagedata = [].concat(response.list)
					} else {
						this.pagedata = this.pagedata.concat(response.list)
					}
					this.pagedata.sort(util.compare('value', 1));
					this.$nextTick(() => {
						this.$refs.slide.assignment(this.pagedata);
					})
					if (this.pageobj0.page_number >= response.total_page) {
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload = false
					} else {
						this.pageobj0.status = 'more';
					}
				})
			},
			toDetails(item) {
				console.log("item: " + JSON.stringify(item));
				item.index_code = this.index_code
				let that = this
				util.openwithData('/pages/stu_dorm/action_dorm_detail', item, {
					refreshList(data) { //子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag = 0
						that.pageobj0.canload = true
						that.pageobj0.page_number = 1
						that.getList0()
					}
				})
			}
		},
		onLoad(options) {
			_this = this;
			const itemData = util.getPageData(options);
			this.index_code = itemData.access.split('#')[1]
			itemData.index = 100
			console.log("itemData: " + JSON.stringify(itemData));
			this.personInfo = util.getPersonal();
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1];
			let end_month = this.moment().format('YYYY-MM-DD')
			// let start_month = this.moment().subtract(12, 'M').format('YYYY-MM-DD');
			this.defaultDate.push(end_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(end_month);
			this.timePickerDate.push(end_month);
			// this.startTime = end_month;
			// this.endTime = end_month;
			// this.dateEndTime = end_month;
			this.$nextTick(() => {
				this.$refs.slide.assignment([])
			})
			setTimeout(() => {
				this.showLoading()
				this.getPermissionByPosition('add,delete,edit', this.index_code, result => {
					this.add = result[0];
					this.delete = result[1];
					this.edit = result[2];
					if (result[0]) {
						this.icon = 'plusempty'
					}
				})
				this.getGrd();
			}, 100)
			uni.setNavigationBarTitle({
				title: itemData.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag = 0
			this.pageobj0.canload = true
			this.pageobj0.page_number = 1
			this.getList0()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if (this.pageobj0.canload) {
				this.pageobj0.loadFlag = 1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number = this.pageobj0.page_number + 1
				this.getList0()
			}
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

	.row-line {
		height: 0.5px;
		background-color: #e0dddd;
		/* margin: 0 -15px; */
		margin-top: 0px;
		margin-left: 10px;
	}

	.rowClo {
		text-align: center;
		margin-top: 15px;
		font-size: 12px;
		color: #505050;
	}

	.rowName {
		text-align: center;
		margin-top: 15px;
		font-size: 15px;
		color: #000000;
	}

	.rowClass {
		text-align: center;
		margin-top: 15px;
		font-size: 12px;
		color: #808080;
	}

	.rowTiwenRed {
		text-align: center;
		margin-top: 15px;
		font-size: 16px;
		color: #d43030;
	}

	.rowTiwenBlack {
		text-align: center;
		margin-top: 15px;
		font-size: 16px;
		color: #505050;
	}

	.tiwenFlag {
		margin: 20px 0 0 10px;
		padding-bottom: 10px;
		font-size: 11px;
		color: #505050;
	}

	.addEditLeft {
		text-align: right;
		margin-top: 20px;
		font-size: 12px;
		color: #505050;
	}

	.addEditRight {
		text-align: left;
		margin-top: 20px;
		font-size: 12px;
		color: #E6A23C;
	}

	.pickBorder {
		border: 1px solid #e5e5e5;
		width: 160px;
		border-radius: 5px;
	}

	::v-deep .mini-date .uni-input {
		text-align: left !important;
		margin-left: 10px;
		font-size: 14px !important;
		color: #000000 !important;
	}

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 40px;
	}

	.rightInput {
		margin-top: 10px;
		margin-left: 10px;
		font-size: 14px;
	}

	.t-wrap {
		padding: 0 0upx;

	}

	.t-conten {
		display: flex;
		flex-direction: row !important;
		padding: 10upx 0;

	}

	.image {
		width: 400upx;
		height: 100upx;
		margin-right: 10upx;
	}
</style>
