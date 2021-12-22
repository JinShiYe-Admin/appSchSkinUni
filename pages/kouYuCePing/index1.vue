<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="navText" :textClick="textClick">
		</mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="text"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<view style="text-align: center;font-size: 13px;color: gray;">{{bookItems||"暂无教材"}}
				<uni-icons type="settings" size="20" color="#00CFBD" style="margin-left: 10px;padding-top: 5px;"
					@click="bookSelect()"></uni-icons>
			</view>
			<view v-if="semFlag == 0">
				<uni-row style="margin-top: 5px;">
					<uni-col :span="3">
						<uni-icons @click="changeMenu(-1)" type="arrowleft" size="20" color="gray"
							style="float: right;"></uni-icons>
					</uni-col>
					<uni-col :span="18">
						<view @click="showMenu()" style="text-align: center;" v-html="contentTitle"></view>
					</uni-col>
					<uni-col :span="3">
						<uni-icons @click="changeMenu(1)" type="arrowright" size="20" color="gray" style="float: left;">
						</uni-icons>
					</uni-col>
				</uni-row>
				<view class="progress-box">
					<span>{{(semFlag0Data.index+1)+"/"+semFlag0Data.list.length}}</span>
				</view>
				<view v-if="semFlag0Data.list.length" class="test-pannel" :class="{sentence: !isWordsemFlag0}">
					{{semFlag0Data.list[semFlag0Data.index].words}}
					<p class="read" v-if="isWordsemFlag0"
						v-show="isTestedFlag0&&semFlag0Data.list[semFlag0Data.index].symbol">
						[{{semFlag0Data.list[semFlag0Data.index].symbol}}]</p>
					<p class="translation" v-else
						v-show="isTestedFlag0&&semFlag0Data.list[semFlag0Data.index].translations">
						{{semFlag0Data.list[semFlag0Data.index].translations}}
					</p>
				</view>
				<view v-else-if="state>2" class="test-pannel" style="font-size: 12px;color: #999999;">暂无内容</view>
				<view v-else class="test-pannel">123</view>

				<view class="action-box" v-if="semFlag0Data.list.length" style="display: flex;flex-direction: column;">
					<view class="overflow-cover"></view>
					<view class="score-box">
						<span class="scoreCss"
							v-if="isTestedFlag0">{{setScore(semFlag0Data.list[semFlag0Data.index].total_score)}}</span>
					</view>
					<view class="btn-record">
						按住录音，松开提交
					</view>
					<view style="display: flex;align-self: center;margin-top: 20px;">
						<view
							@click.stop="playAudioLeftBtn(semFlag0Data.list[semFlag0Data.index],semFlag0Data.list[semFlag0Data.index].audio_url)"
							class="img-voice btn-img-cp"
							:class="{active:semFlag0Data.list[semFlag0Data.index].playAudoIS?semFlag0Data.list[semFlag0Data.index].playAudoIS:false}">
						</view>
						<view @touchstart.stop.prevent="touchStart(semFlag0Data.list[semFlag0Data.index],$event)"
							style="margin: 0 12px;"
							@touchend.stop.prevent="touchEnd(semFlag0Data.list[semFlag0Data.index],$event,1)"
							@touchmove.stop.prevent="touchEnd(semFlag0Data.list[semFlag0Data.index],$event,0)"
							class="img-record btn-img-cp"
							:class="{active:semFlag0Data.list[semFlag0Data.index].recordIS?semFlag0Data.list[semFlag0Data.index].recordIS:false}">
						</view>
						<view @click.stop="playAudioRightBtn(semFlag0Data.list[semFlag0Data.index].record_url)"
							class="img-play btn-img-cp"></view>
					</view>
					<view class="skip-box">
						<a :class="{disabled: semFlag0Data.index==0}" @tap="changeIndex(-1)">上一个</a>
						<a v-show="semFlag0Data.index<semFlag0Data.list.length-1" @tap="changeIndex(1)">下一个</a>
						<a v-show="semFlag0Data.index==semFlag0Data.list.length-1" class="btn-submit"
							@tap="submit">提交</a>
					</view>
				</view>
			</view>
			<view v-if="semFlag == 1">
				<uni-row style="margin-top: 5px;">
					<uni-col :span="3">
						<uni-icons @click="changeMenu(-1)" type="arrowleft" size="20" color="gray"
							style="float: right;"></uni-icons>
					</uni-col>
					<uni-col :span="18">
						<view @click="showMenu()" style="text-align: center;" v-html="contentTitle"></view>
					</uni-col>
					<uni-col :span="3">
						<uni-icons @click="changeMenu(1)" type="arrowright" size="20" color="gray" style="float: left;">
						</uni-icons>
					</uni-col>
				</uni-row>
				<view class="progress-box">
					<span>{{(semFlag1Data.index+1)+"/"+semFlag1Data.list.length}}</span>
				</view>
				<view v-if="semFlag1Data.list.length" class="test-pannel" :class="{sentence: !isWordsemFlag1}">
					{{semFlag1Data.list[semFlag1Data.index].words}}
					<p class="read" v-if="isWordsemFlag1"
						v-show="isTestedFlag1&&semFlag1Data.list[semFlag1Data.index].symbol">
						[{{semFlag1Data.list[semFlag1Data.index].symbol}}]</p>
					<p class="translation" v-else
						v-show="isTestedFlag1&&semFlag1Data.list[semFlag1Data.index].translations">
						{{semFlag1Data.list[semFlag1Data.index].translations}}
					</p>
				</view>
				<view v-else-if="state>2" class="test-pannel" style="font-size: 12px;color: #999999;">暂无内容</view>
				<view v-else class="test-pannel"></view>

				<view class="action-box" v-if="semFlag1Data.list.length" style="display: flex;flex-direction: column;">
					<view class="overflow-cover"></view>
					<view class="score-box">
						<span class="scoreCss"
							v-if="isTestedFlag1">{{setScore(semFlag1Data.list[semFlag1Data.index].total_score)}}</span>
					</view>
					<view class="btn-record">
						按住录音，松开提交
					</view>
					<view style="display: flex;align-self: center;margin-top: 20px;">
						<view
							@click.stop="playAudioLeftBtn(semFlag1Data.list[semFlag1Data.index],semFlag1Data.list[semFlag1Data.index].audio_url)"
							class="img-voice btn-img-cp"
							:class="{active:semFlag1Data.list[semFlag1Data.index].playAudoIS?semFlag1Data.list[semFlag1Data.index].playAudoIS:false}">
						</view>
						<view @touchstart.stop.prevent="touchStart(semFlag1Data.list[semFlag1Data.index],$event)"
							style="margin: 0 12px;"
							@touchend.stop.prevent="touchEnd(semFlag1Data.list[semFlag1Data.index],$event,1)"
							@touchmove.stop.prevent="touchEnd(semFlag1Data.list[semFlag1Data.index],$event,0)"
							class="img-record btn-img-cp"
							:class="{active:semFlag1Data.list[semFlag1Data.index].recordIS?semFlag1Data.list[semFlag1Data.index].recordIS:false}">
						</view>
						<view @click.stop="playAudioRightBtn(semFlag1Data.list[semFlag1Data.index].record_url)"
							class="img-play btn-img-cp"></view>
					</view>
					<view class="skip-box">
						<a :class="{disabled: semFlag1Data.index==0}" @tap="changeIndex(-1)">上一个</a>
						<a v-show="semFlag1Data.index<semFlag1Data.list.length-1" @tap="changeIndex(1)">下一个</a>
						<a v-show="semFlag1Data.index==semFlag1Data.list.length-1" class="btn-submit"
							@tap="submit">提交</a>
					</view>
				</view>
			</view>
			<view v-if="semFlag == 2">
				<view v-if="semFlag2Data.total">
					<uni-list class="result-list" v-for="(item,index) in semFlag2Data.model" :key="index"
						v-if="item.list.length">
						<view class="result-title" v-show="item.title">
							{{item.sub_title}}
							<view class="sec-title">{{item.title}}</view>
						</view>
						<uni-list-item v-for="(v, i) in item.list" :key='i' direction='column' clickable
							:class="{'word-cell': v.category=='read_word'}" @click="toggleOpen(v)">
							<view slot="body" class="slot-box slot-text">
								<view class="rightView">
									<view style="min-height: 40px;margin-top: 10px;"
										:class="{'word-box': v.category=='read_word', 'sentence-box': v.category=='read_sentence'}">
										<h4 v-if="v.category=='read_word'">{{v.words}}
											<span class="symbol" v-if="v.symbol">[{{v.symbol}}]</span>
											<span class="score" style='right: 10px;'
												v-if="v.total_score!=null">{{setScore(v.total_score)}}</span>
										</h4>
										<h4 v-else>{{v.words}}
											<span class="score" style='right: 10px;'
												v-if="v.total_score!=null">{{setScore(v.total_score)}}</span>
										</h4>
										<view v-if="v.btnShow">
											<view @click.stop="playAudioLeftBtn(v,v.audio_url)"
												class="btn-img img-voice" style="width: 40px;height: 40px;"
												:class="{active:v.playAudoIS?v.playAudoIS:false}"></view>
											<view @touchstart.stop.prevent="touchStart(v,$event)"
												@touchend.stop.prevent="touchEnd(v,$event,1)"
												@touchmove.stop.prevent="touchEnd(v,$event,0)"
												class="btn-img img-record" style="width: 50px;height: 50px;"
												:class="{active:v.recordIS?v.recordIS:false}">
											</view>
											<view @click.stop="playAudioRightBtn(v.record_url)" class="btn-img img-play"
												style="width: 40px;height: 40px;"></view>
										</view>
									</view>
									<view class="result-bar" v-if="v.category=='read_sentence'&&v.total_score!=null">
										<view class="score-item">
											准确度：{{v.accuracy_score}}
										</view>
										<view class="score-item">
											完整度：{{v.integrity_score}}
										</view>
										<view class="score-item">
											流利度：{{v.fluency_score}}
										</view>
									</view>
								</view>
							</view>
						</uni-list-item>
					</uni-list>
				</view>
				<view class="list-end" v-else>还没有错题</view>
			</view>
			<view>
				<uni-popup ref="popup" background-color="#fff">
					<view class="popup-content" style="max-height: 500px;" :class="{ 'popup-height': 'top' }">
						<view class="">
							<view style="font-size: 16px;height: 35px;padding-top: 8px;margin-left: 10px;">
								<uni-icons type="bars" size="23" color="gray"></uni-icons>
								<span style='margin-left: 10px;'>选择章节</span>
							</view>
							<scroll-view scroll-y="true" class="scroll-Y" style="max-height: 500px;">
								<uni-list v-for="(v,i) in menu_list" :key="i">
									<uni-list-item direction='column' class="list-name" style="min-height: 40px;">
										<view slot="body">
											<view style="float: left;">
												<view class="">{{v.name}}</view>
											</view>
										</view>
									</uni-list-item>
									<uni-list-item v-for="(item, k) in v.list" :key="k" direction='column' clickable
										:class="{selected: item.id==catalogId}" @click="selectMenu(item.id)"
										style="min-height: 40px;">
										<view slot="body">
											<view style="float: left;">
												<view style="font-size: 14px;color: gray;">{{item.name}}</view>
											</view>
										</view>
									</uni-list-item>
								</uni-list>
							</scroll-view>
						</view>
					</view>
				</uni-popup>
			</view>
		</view>
		<u-tabbar-my v-if='tabBarItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import Recorder from 'js-audio-recorder';
	// 七牛上传相关
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				navText: '',
				phoneType:'h5',

				audioContext: '',
				recorderManager: '',
				audioUrl: '', //音频url

				isGetLast: false, //判断登录者是否有上一次记录
				catalogId: 0,
				menu: [],
				bookItems: "",
				contentTitle: "...",
				isContentTitle: true,
				state: 1, // 1-unload; 2-loading; 3-loaded; 4-start; 5-submit
				semValuesArray: ['单词测评', '句子测评', '错题本'],
				semFlag: 0, //点击的seg索引
				uploadModel: {},
				touchData: {}, //滑动事件数据
				uploadFlag: false, //是否上传

				menu_list: [],

				semFlag0Data: { //单词测评
					list: [],
					index: 0,
				},
				semFlag1Data: { //句子测评
					list: [],
					index: 0,
				},
				semFlag2Data: { //错题本
					page: 1,
					model: [],
					isRecording: false,
					valid_touch: false,
					// key: "",
					isPlaying: false,
					total: 0,
				},


				playAudoIS: false,
				recordIS: false,
				clickV: null,
			}
		},
		components: {
			mynavBar
		},
		onShow() {
			// this.uploadModel = {};
			this.audioContext.onStop(() => {
				this.clickV.playAudoIS = false
				this.$forceUpdate();
				console.log('停止播放');
				this.audioUrl = '';
			});
			this.audioContext.onEnded(() => {
				this.clickV.playAudoIS = false
				this.$forceUpdate();
				console.log('停止播放11');
				this.audioUrl = '';
			});
			// #ifdef APP-PLUS
			this.recorderManager.onStop(function(res) {
				console.log('recorder stop' + JSON.stringify(res));
				console.log('_this.uploadFlag' + _this.uploadFlag);
				if (_this.uploadFlag) {
					_this.uploadFlag = false;
					_this.showLoading('上传中...');
					uni.uploadFile({
						url: _this.globaData.INTERFACE_KYCP + "/pub/upload",
						filePath: res.tempFilePath,
						name: 'file',
						success: (uploadFileRes) => {
							_this.hideLoading();
							console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
							if (uploadFileRes.statusCode == 200) {
								var tempM = JSON.parse(uploadFileRes.data);
								_this.uploadModel.words = _this.uploadModel.words ? _this.uploadModel
									.words.trim() : _this.uploadModel.words;
								console.log('key:' + JSON.stringify(_this.uploadModel));
								console.log('正在评分:' + JSON.stringify({
									data: _this.uploadModel,
									file_url: tempM.data.url,
									index_code: _this.tabBarItem.access.split('#')[1],
									user_code: _this.personInfo.user_code
								}));
								_this.showLoading('正在评分');
								_this.post(_this.globaData.INTERFACE_KYCP + '/orals/record', {
									phone_type:_this.phoneType,
									data: _this.uploadModel,
									file_url: tempM.data.url,
									index_code: _this.tabBarItem.access.split('#')[1],
									user_code: _this.personInfo.user_code
								}, (res0, res) => {
									_this.hideLoading();
									console.log('resres:' + JSON.stringify(res));
									if (res.code == 0) {
										_this.uploadModel.key = res.data.key;
										_this.uploadModel.total_score = res.data.total_score;
										_this.uploadModel.record_url = res.data.record_url;
										if (_this.uploadModel.category == "read_sentence") {
											_this.uploadModel.accuracy_score = res.data
												.accuracy_score;
											_this.uploadModel.fluency_score = res.data
												.fluency_score;
											_this.uploadModel.integrity_score = res.data
												.integrity_score;
										}
										if (this.semFlag == 2) {
											_this.post(_this.globaData.INTERFACE_KYCP +
												'/orals/save', {
													data: [_this.uploadModel],
													index_code: _this.tabBarItem.access
														.split('#')[1],
													user_code: _this.personInfo.user_code
												}, (res0, res) => {
													_this.hideLoading();
													console.log('resresresresres:' + JSON
														.stringify(res));
												})
										} else {

										}

									} else {
										_this.showToast('评分失败，请重试');
									}
								})
							} else {
								uni.showToast('文件上传失败，请稍后再试 ');
							}
						},
						fail: (e) => {
							console.log(e);
						}
					});
				}
			});
			// #endif
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			this.tabBarItem = util.getPageData(option);
			console.log('this.tabBarItem:' + JSON.stringify(this.tabBarItem));
			uni.setNavigationBarTitle({
				title: this.tabBarItem.text
			});
			var orals_auth = util.getStore('orals_auth');
			if (orals_auth && orals_auth.user_code == this.personInfo.user_code) {
				this.isGetLast = true;
			}
			util.setStore("orals_auth", this.personInfo);
			this.navText = '测评记录';
			// 
			this.getInitData();
			// this.getContent();
			// util.setStore("orals_catalog_id", String(v));
			this.audioContext = uni.createInnerAudioContext();
			//#ifdef APP-PLUS
			this.recorderManager = uni.getRecorderManager();
			uni.getSystemInfo({
			    success: function (res) {
					if(res.platform == 'ios'){
						_this.phoneType = 'ios';
					}else{
						_this.phoneType = 'Android';
					}
			    }
			});
			//#endif
			//#ifdef H5
			this.recorderManager = new Recorder({
				sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
				sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
				numChannels: 1,
			});
			//#endif

		},
		computed: {
			isTestedFlag0: function() {
				var cur = this.semFlag0Data.list[this.semFlag0Data.index];
				return cur && cur.total_score != null && cur.total_score >= 0;
			},
			isTestedFlag1: function() {
				var cur = this.semFlag1Data.list[this.semFlag1Data.index];
				return cur && cur.total_score != null && cur.total_score >= 0;
			},
			isWordsemFlag0: function() {
				return this.semFlag0Data.list[this.semFlag0Data.index].category == 'read_word';
			},
			isWordsemFlag1: function() {
				return this.semFlag1Data.list[this.semFlag1Data.index].category == 'read_word';
			},
			// total: function() {
			// 	var t = 0;
			// 	this.semFlag2Data.model.forEach(function(v) {
			// 		t = t + v.list.length;
			// 	});
			// 	return t;
			// }
		},
		watch: {
			catalogId: function(v, ov) {
				this.getContent();
				util.setStore("orals_catalog_id", String(v));
			},
			category: function(v, ov) {
				this.getContent("category");
			}
		},
		methods: {
			touchStart(model, e) {
				console.log('touchStart:' + JSON.stringify(model));
				model.recordIS = true
				this.uploadFlag = true;
				this.$forceUpdate()
				this.touchData.clientX = e.changedTouches[0].clientX;
				this.touchData.clientY = e.changedTouches[0].clientY;
				this.uploadModel = model;
				// #ifdef H5
				console.log('aaaaaaazzzzzzz');
				this.recorderManager.start().then(() => {
					console.log('kaishi luyin');
					// 开始录音
				}, (error) => {
					// 出错了
					console.log(`${error.name} : ${error.message}`);
				});
				// #endif
				// #ifndef H5
				this.recorderManager.start({
					format: 'wav',
					duration: '10000',
					sampleRate: 16000,
					numberOfChannels: 1,
					encodeBitRate: 16000
				});
				// #endif
			},
			touchEnd(model, e, flag) {
				console.log('touchEndtouchEndtouchEndtouchEnd');
				if (flag == 1) {
					this.touchUpload(model, e, flag);
				} else {
					let subX = e.changedTouches[0].clientX - this.touchData.clientX;
					let subY = e.changedTouches[0].clientY - this.touchData.clientY;
					subX = Math.abs(subX);
					subY = Math.abs(subY);
					if (subX > 100 || subY > 100) {
						if (model.recordIS) {
							this.touchUpload(model, e, flag);
						}
					}
				}
			},
			touchUpload(model, e, flag) {
				model.recordIS = false
				this.$forceUpdate();
				// #ifdef H5
				console.log('aaaaaaazzzzzzz111');
				this.recorderManager.stop();
				let tempAu = this.recorderManager.getWAVBlob();
				let files = new window.File([tempAu], '111.wav');
				console.log(files);
				uni.uploadFile({
					url: this.globaData.INTERFACE_KYCP + "/pub/upload",
					method: 'POST',
					file: files,
					name: 'file',
					success: (uploadFileRes) => {
						_this.hideLoading();
						console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
						if (uploadFileRes.statusCode == 200) {
							var tempM = JSON.parse(uploadFileRes.data);
							_this.uploadModel.words = _this.uploadModel.words ? _this.uploadModel
								.words.trim() : _this.uploadModel.words;
							console.log('key:' + JSON.stringify(_this.uploadModel));
							_this.showLoading('正在评分');
							_this.post(_this.globaData.INTERFACE_KYCP + '/orals/record', {
								phone_type:_this.phoneType,
								data: _this.uploadModel,
								file_url: tempM.data.url,
								index_code: _this.tabBarItem.access.split('#')[1],
								user_code: _this.personInfo.user_code
							}, (res0, res) => {
								_this.hideLoading();
								console.log('resres:' + JSON.stringify(res));
								if (res.code == 0) {
									_this.uploadModel.key = res.data.key;
									_this.uploadModel.total_score = res.data.total_score;
									_this.uploadModel.record_url = res.data.record_url;
									if (_this.uploadModel.category == "read_sentence") {
										_this.uploadModel.accuracy_score = res.data
											.accuracy_score;
										_this.uploadModel.fluency_score = res.data
											.fluency_score;
										_this.uploadModel.integrity_score = res.data
											.integrity_score;
									}
									if (this.semFlag == 2) {
										_this.post(_this.globaData.INTERFACE_KYCP +
											'/orals/save', {
												data: [_this.uploadModel],
												index_code: _this.tabBarItem.access
													.split('#')[1],
												user_code: _this.personInfo.user_code
											}, (res0, res) => {
												_this.hideLoading();
												console.log('resresresresres:' + JSON
													.stringify(res));
											})
									} else {

									}

								} else {
									_this.showToast('评分失败，请重试');
								}
							})
						} else {
							uni.showToast('文件上传失败，请稍后再试 ');
						}
					},
					fail: (e) => {
						console.log('fail:' + JSON.stringify(e));
					}
				});
				// #endif
				// #ifndef H5
				console.log('uploadFlaguploadFlag--true');
				this.uploadFlag = true;
				this.recorderManager.stop();
				// #endif
			},
			playAudioLeftBtn(v, url) {
				v.playAudoIS = true
				this.clickV = v
				this.$forceUpdate();
				this.playAudio(url)
			},
			playAudioRightBtn(url) {
				this.playAudio(url)
			},
			playAudio(url) {
				if (url && url.length > 0) {
					if (this.audioUrl == url) {
						if (this.audioContext.paused) {
							this.audioPlay();
						} else {
							this.audioContext.stop();
						}
					} else {
						this.audioUrl = url;
						this.audioPlay();
					}
				} else {
					this.showToast('没有录音');
				}
			},
			audioPlay() {
				var getDownToken = {
					appId: this.globaData.QN_APPID, //int 必填 项目id
					appKey: this.globaData.QN_APPKEY,
					urls: [this.audioUrl] //array 必填 需要获取下载token文件的路径
				}
				var getDownTokenUrl = this.QNGETDOWNTOKENFILE;
				this.showLoading();
				cloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, (data) => {
					this.hideLoading();
					this.audioContext.src = data.Data[0].Value;
					this.audioContext.play();
				});
			},
			//分数格式
			setScore(score) {
				return Math.round(score * 20);
			},
			toggleOpen: function(model) {
				model.btnShow = !model.btnShow;
			},
			textClick() {
				if (this.state == 4) {
					this.layerBeforeLeave("您还没有提交，确定要离开吗？", ["确定", "取消"], function() {
						this.goRecord();
					});
				} else {
					this.goRecord();
				}
			},
			goRecord() {
				var model = {
					access: this.tabBarItem.access,
					category: this.semFlag == 0 ? "read_word" : "read_sentence"
				}
				util.openwithData("/pages/kouYuCePing/record", model, {
					refreshBook() { //子页面调用父页面需要的方法
						var catalog_id = util.getStore("orals_catalog_id");
						if (catalog_id != _this.catalogId) {
							_this.setBaseData();
							//错题本数据重置
							_this.semFlag2Data.page = 1;
							if (_this.semFlag == 2) {
								_this.getErrList();
							} else {
								_this.semFlag2Data.isReload = true;
							}
						}
					}
				});
			},
			getInitData() {
				var book_items = util.getStore('kycp_book_items');
				//保存了上一次记录时
				if (this.isGetLast && book_items) {
					var book_codes = this.getBookCodes(book_items);
					this.getBook(book_codes);
				} else {
					this.getBook({})
				}
			},
			// 获取教材信息
			getBook(defaultCodes) {
				this.showLoading();
				var auto_book = {};
				// 获取学段
				this.post(this.globaData.INTERFACE_KYCP + '/pub/resPer', {
					index_code: this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					console.log('resPer:' + JSON.stringify(res));
					if (res.state == "ok") {
						auto_book.per = {
							list: res.data,
							selected: defaultCodes.percode || (res.data[0] ? res.data[0].percode : "")
						}

						// 获取科目
						this.post(this.globaData.INTERFACE_KYCP + '/pub/resSub', {
							percode: auto_book.per.selected,
							index_code: this.tabBarItem.access.split('#')[1],
							user_code: this.personInfo.user_code
						}, (res0, res) => {
							if (res.state == "ok") {
								auto_book.sub = {
									list: res.data,
									selected: defaultCodes.subcode || (res.data[0] ? res.data[0]
										.subcode : "")
								}

								// 获取教版
								this.post(this.globaData.INTERFACE_KYCP + '/pub/resMater', {
									percode: auto_book.per.selected,
									subcode: auto_book.sub.selected,
									index_code: this.tabBarItem.access.split('#')[1],
									user_code: this.personInfo.user_code
								}, (res0, res) => {
									if (res.state == "ok") {
										auto_book.mater = {
											list: res.data,
											selected: defaultCodes.matercode || (res.data[0] ?
												res.data[0].matercode : "")
										}

										// 获取分册
										this.post(this.globaData.INTERFACE_KYCP + '/pub/resFasc', {
											percode: auto_book.per.selected,
											subcode: auto_book.sub.selected,
											matercode: auto_book.mater.selected,
											index_code: this.tabBarItem.access.split('#')[
												1],
											user_code: this.personInfo.user_code
										}, (res0, res) => {
											if (res.state == "ok") {
												res.data.sort(util.compare('fasccode',1));
												auto_book.fasc = {
													list: res.data,
													selected: defaultCodes.fasccode ||
														(res.data[0] ? res.data[0]
															.fasccode : "")
												}

												// 保存目录
												util.setStore('kycp_book_items',
													auto_book);
												//获取目录
												this.getCatalog(this.bookCheck(auto_book));

												this.hideLoading();
											} else {
												this.hideLoading();
												if (res.code != 404) this.showToast(res
													.msg);
											}
										})
									} else {
										this.hideLoading();
										if (res.code != 404) this.showToast(res.msg);
									}
								})
							} else {
								this.hideLoading();
								if (res.code != 404) this.showToast(res.msg);
							}
						})
					} else {
						this.hideLoading();
						if (res.code != 404) this.showToast(res.msg);
					}
				})
			},
			// 检查确保教材的selected是否都在list中
			bookCheck(book) {
				for (var key in book) {
					var selected = "";
					for (var i = 0; i < book[key].list.length; i++) {
						if (book[key].list[i][key + "code"] == book[key].selected) {
							selected = book[key].list[i][key + "code"];
							break;
						}
					}
					if (!selected) book[key].selected = book[key].list[0] ? book[key].list[0][key + "code"] : "";
				}
				return book;
			},
			//获取目录
			getCatalog(auto_book) {
				var data = this.getBookCodes(auto_book);
				if (Object.keys(data).length < 4) {
					this.showLoading('教材信息不完整');
					return;
				}
				this.post(this.globaData.INTERFACE_KYCP + '/pub/catalog', {
					...data,
					index_code: this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					if (res.state == "ok") {
						//保存目录
						util.setStore("orals_menu", res.data.catalog);

						//保存分册目录
						var catalog = this.getFinalCatalog(res.data.catalog.children);
						util.setStore("orals_catalog", catalog);

						this.setBaseData(); //设置数据
						// this.getContent("category");
					} else {
						if (res.code != 404) this.showToast(res.msg);
					}
				})
			},
			// 获取教材code
			getBookCodes(book) {
				var codes = {};
				for (var key in book) {
					if (key == "per" || key == "sub" || key == "mater" || key == "fasc") {
						if (book[key].selected) codes[key + "code"] = book[key].selected;
					}
				}
				return codes;
			},
			//获取最末端目录
			getFinalCatalog(list) {
				var catalog = [];
				this.readTree(list, function(node) {
					if (!node.children) {
						catalog.push(node);
					}
				});
				catalog.forEach(function(v, i) {
					_this.readTree(list, function(node) {
						if (node.id == v.pid) {
							catalog[i]["pname"] = node.name;
						}
					});
				});
				return catalog;
			},
			// 遍历树形菜单，并回调
			readTree(tree, callback) {
				for (var i = 0; i < tree.length; i++) {
					callback(tree[i]);
					if (tree[i].children) {
						this.readTree(tree[i].children, callback);
					}
				}
			},
			//设置基础数据
			setBaseData() {
				//教材名
				this.bookItems = this.getBookNames();
				//设置目录列表
				this.menu = util.getStore("orals_catalog") || [];
				//设置节点
				var catalogId = util.getStore('orals_catalog_id');
				var isCatalogId = this.menu.some(function(v, i) {
					return v.id == catalogId;
				});
				if (catalogId && isCatalogId) {
					this.catalogId = catalogId;
				} else {
					this.getAutoNode();
				}
			},
			//获取默认节点
			getAutoNode() {
				var auto_node = this.menu[0];
				if (auto_node) {
					this.catalogId = auto_node.id;
				} else {
					this.catalogId = 0;
				}
			},
			//获取教材名
			getBookNames() {
				var orals_menu = util.getStore("orals_menu");
				return orals_menu.name || "";
			},
			//选择教材
			bookSelect() {
				console.log('bookSelect');
				if (this.state == 4 && (self.semFlag == 0 || self.semFlag == 1)) {
					console.log('bookSelect000');
					// this.layerBeforeLeave("您还没有提交，确定要离开吗？", ["确定", "取消"], goBook);
				} else {
					console.log('bookSelect111');
					// this.endPlayAudio();
					this.goBook();
				}
			},
			goBook() {
				util.openwithData("/pages/kouYuCePing/book", this.tabBarItem, {
					refreshBook() { //子页面调用父页面需要的方法
						var catalog_id = util.getStore("orals_catalog_id");
						if (catalog_id != _this.catalogId) {
							_this.setBaseData();
							//错题本数据重置
							_this.semFlag2Data.page = 1;
							if (_this.semFlag == 2) {
								_this.getErrList();
							} else {
								_this.semFlag2Data.isReload = true;
							}
						}
					}
				});
			},
			//显示目录
			showMenu() {
				this.$refs.popup.open('bottom');
				var menu_list = [];
				this.menu.forEach(function(v) {
					var cur_list = _this.filterArray(menu_list, "id", v.pid)[0];
					if (cur_list) {
						cur_list.list.push(v);
					} else {
						menu_list.push({
							id: v.pid,
							name: v.pname,
							list: [v]
						});
					}
				});
				this.menu_list = menu_list;
				this.catalogId = this.catalogId;
			},
			//切换目录
			changeMenu(d) {
				console.log('changeMenuchangeMenu:' + d);
				var catalog = this.menu;
				var c_index;
				catalog.forEach(function(v, i) {
					if (v.id == _this.catalogId) c_index = i;
				});
				var new_index = c_index + d;
				if (new_index < 0) {
					this.showToast("当前已是第一单元");
				} else if (new_index >= catalog.length) {
					this.showToast("已到达最后一个单元！");
				} else {
					if (this.state == 4) {
						console.log('layerBeforeLeave');
						// this.layerBeforeLeave("您还没有提交，离开将不保存成绩！", ["残忍离开", "我再想想"], function(){
						// 	this.catalogId = catalog[c_index+d].id;
						// });
					} else {
						this.catalogId = catalog[c_index + d].id;
					}
				}
			},
			// hideMenu() {
			// 	this.isShowMenu = false;
			// },
			selectMenu(id) {
				this.$refs.popup.close();
				// if(this.state == 4) {
				// 	this.layerBeforeLeave("您还没有提交，离开将不保存成绩！", ["残忍离开", "我再想想"], function() {
				// 		_this.isShowMenu = false;
				// 		_this.catalogId = id;
				// 		this.catalogId = id;
				// 	});
				// } else {
				this.catalogId = id;
				// }
			},
			//获取目录名
			getCatalogName(id) {
				var catalog = util.getStore('orals_catalog');
				var cur_node = this.filterArray(catalog, 'id', id)[0];
				var final_name = "";
				if (cur_node) {
					final_name = cur_node.pid ? ((cur_node.pname || "") + "&nbsp;&nbsp;" + cur_node.name) : cur_node.name;
				}
				return final_name;
			},
			// 根据某属性的值找数组对象
			filterArray(arr, key, val) {
				var r = arr.filter(function(item) {
					return item[key] == val;
				});
				return r;
			},
			//获取评测内容
			getContent(change_data) {
				this.showLoading();
				if (change_data != "category") {
					this.contentTitle = this.getCatalogName(_this.catalogId);
					console.log('this.contentTitle:' + this.contentTitle);
				}
				var data = {
					category: this.semFlag == 0 ? "read_word" : "read_sentence",
					bookCatalogId: _this.catalogId
				}
				_this.state = 2;
				this.post(this.globaData.INTERFACE_KYCP + '/orals', {
					...data,
					index_code: this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					if (res.state == "ok") {
						// this.endPlayAudio();
						//添加单词句子列表
						res.data.list.forEach(function(v) {
							//成绩清零
							v.total_score = null;
							v.record_url = null;
							v.key = res.data.key;
						});
						if (this.semFlag == 0) {
							this.semFlag0Data.list = res.data.list;
							this.semFlag0Data.index = 0;
						} else {
							this.semFlag1Data.list = res.data.list;
							this.semFlag1Data.index = 0;
						}

						this.state = 3;
						this.hideLoading();
					} else {
						_this.state = 3;
						this.hideLoading();
						if (res.code != 404) this.showToast(res.msg);
					}
				})
			},
			//切换单词句子
			changeIndex(d) {
				// if(this.isRecording) {
				// 	return false;
				// }
				if (this.semFlag == 0) {
					var f_index = this.semFlag0Data.index + d;
					if (f_index >= 0 && f_index < this.semFlag0Data.list.length) {
						this.semFlag0Data.index = f_index;
						// endPlayAudio();
					}
				} else {
					var f_index = this.semFlag1Data.index + d;
					if (f_index >= 0 && f_index < this.semFlag1Data.list.length) {
						this.semFlag1Data.index = f_index;
						// endPlayAudio();
					}
				}

			},
			//提交
			submit: function() {
				// this.endPlayAudio();
				this.showLoading("正在提交");
				this.post(this.globaData.INTERFACE_KYCP + '/orals/save', {
					data: this.semFlag == 0 ? this.semFlag0Data.list : this.semFlag1Data.list,
					index_code: this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0, res) => {
					this.hideLoading();
					if (res.state == "ok") {
						this.state = 5;
						//打开结果页
						// this.goResult({
						// 	title: secondTitle.contentTitle,
						// 	cate: _this.list[0].category,
						// 	catalog_id: _this.catalogId
						// });
						this.uploadModel.access = this.tabBarItem.access;
						this.uploadModel.title = this.uploadModel.book_catalog_name;
						this.uploadModel.cate = this.uploadModel.category;
						this.uploadModel.catalog_id = this.uploadModel.book_catalog_id;
						console.log('clickItem:' + JSON.stringify(this.uploadModel));
						util.openwithData("/pages/kouYuCePing/result", this.uploadModel);
						// this.semFlag2Data.page = 1;
						// this.semFlag2Data.isReload = true;
					} else {
						this.showToast(res.msg);
					}
				})
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					if (this.semFlag == 0) {
						this.navText = '测评记录';
						this.getContent();
					} else if (this.semFlag == 1) {
						this.navText = '测评记录';
						this.getContent();
					} else if (this.semFlag == 2) {
						this.navText = '';
						this.getErrList();
					}
				}
			},
			getErrList(callback) {
				console.log('getErrList');
				this.semFlag2Data.isLoading = true;
				//错题本列表
				var catalog_ids;
				if (this.semFlag2Data.page == 1) {
					console.log('getErrList11111');
					this.showLoading();
					this.semFlag2Data.bookName = this.getBookNames();
					this.semFlag2Data.model = [];
					catalog_ids = [];
					//可选目录节点
					var catalog = util.getStore('orals_catalog');
					if (!catalog) {
						console.log('getErrList11113:' + JSON.stringify(catalog));
						return;
					}
					catalog.forEach(function(v) {
						catalog_ids.push(v.id);
						_this.semFlag2Data.model.push({
							id: v.id,
							sub_title: v.pname,
							title: v.name,
							list: []
						});
					});
					this.semFlag2Data.model.sort(function(a, b) {
						console.log('getErrList11114');
						return a.id - b.id;
					});
				}
				console.log('getErrList11112');
				//获取节点内容
				// this.post(this.globaData.INTERFACE_KYCP + '/orals', {
				// 	bookCatalogId: catalog_ids.join(),
				// 	showAll: false,
				// 	totalScoreLimit: "4.0",
				// 	page: true,
				// 	p: this.semFlag2Data.page,
				// 	s: 10,
				// 	index_code:this.tabBarItem.access.split('#')[1],
				// 	user_code: this.personInfo.user_code
				// }, (res0,res)=> {
				// 	if (res.state == "ok") {
				// 		this.semFlag2Data.key = res.data.key;
				// 		res.data.page.list.forEach(function(val, index) {
				// 			for (var i = 0; i < _this.semFlag2Data.model.length; i++) {
				// 				if (_this.semFlag2Data.model[i].id == val.book_catalog_id) {
				// 					_this.semFlag2Data.model[i].list.push(val);
				// 				}
				// 			}
				// 		});
				// 		if (this.semFlag2Data.page == 1) {
				// 			this.hideLoading();
				// 		}
				// 		this.semFlag2Data.lastPage = res.data.page.last_page;
				// 		this.semFlag2Data.page = res.data.page.page_number + 1;
				// 		this.semFlag2Data.isLoading = false;

				// 		callback && callback(res);
				// 	} else {
				// 		this.semFlag2Data.isLoading = false;
				// 		this.semFlag2Data.page == 1 && this.hideLoading();;
				// 		if (res.code != 404) this.showToast(res.msg);
				// 	}
				// })
				this.post(this.globaData.INTERFACE_KYCP + '/orals', {
					// category: this.itemData.cate,
					bookCatalogId: catalog_ids.join(),
					totalScoreLimit: "4.0",
					index_code: this.tabBarItem.access.split('#')[1]
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						// this.semFlag2Data.key = res.data.key;
						res.data.list.forEach(function(val, index) {
							for (var i = 0; i < _this.semFlag2Data.model.length; i++) {
								if (_this.semFlag2Data.model[i].id == val.book_catalog_id) {
									val.btnShow = false;
									val.key = res.data.key;
									_this.semFlag2Data.model[i].list.push(val);
								}
							}
						});
						var t = 0;
						this.semFlag2Data.model.forEach(function(v) {
							t = t + v.list.length;
						});
						this.semFlag2Data.total = t;
					} else {
						this.showToast(res.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.progress-box {
		text-align: center;
		padding-top: 15px;
	}

	.progress-box>span {
		background-color: #EBEBEB;
		display: inline-block;
		width: 80px;
		border-radius: 10px;
		font-size: 13px;
		line-height: 1.6;
	}

	/* .test-pannel {
		height: calc(40% - 35px);
	} */
	.test-pannel {
		color: #000000;
		line-height: 1.4;
		position: relative;
		font-size: 200%;
		word-break: break-word;
		/* padding: 0 0.26rem; */
		padding: 120px 0.26rem 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* height: calc(40vh - 64px); */
		height: 100px;
		overflow-y: auto;
		text-align: center;
	}

	/* .test-pannel .read, .test-pannel .translation {
		margin-top: 5px;
	  	color: #666666;
	}
	.test-pannel.sentence {
		font-size: 128.6%;
	    justify-content: flex-start;
	    padding-top: 0.15rem;
	}
	.test-pannel .translation {
		margin-top: 50px;
	} */

	.list-end {
		text-align: center;
		color: #999999;
		margin-top: 20px;
		font-size: 12px;
	}

	.result-title {
		color: #333333;
		background-color: #EEEEEE;
		margin-top: 15px;
		padding: 10px;
		text-align: center;
		font-size: 16px;
	}

	.result-title .sec-title {
		color: #666666;
		font-size: 15px;
	}

	.result-bar {
		font-size: 12px;
		color: #999999;
		padding-top: 10px;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.title {
		font-size: 114%;
		color: #333333;
		font-weight: normal;
		margin-top: 0;
		line-height: 1.4;
		padding-right: 0.08rem;
	}

	.cur {
		font-size: 143%;
	}

	.btn-img-cp {
		width: 70px;
		height: 70px;
		object-fit: cover;
		margin-top: 15px;
	}

	.symbol {
		margin-left: 0.12rem;
		font-size: 14px;
		color: #666666;
		word-break: break-all;
	}

	.score {
		/*font-family: "DINPro";*/
		background-color: #FAA666;
		display: inline-block;
		width: 25px;
		height: 25px;
		text-align: center;
		line-height: 25px;
		border-radius: 50%;
		position: absolute;
		color: #FFFFFF;
		font-size: 13px;
		right: 0;
		/* top: 50%; */
		/* margin-right: 10px; */
		margin-top: 0px;
	}

	.scoreCss {
		background-color: #FAA666;
		/* display: inline-block; */
		width: 25px;
		height: 25px;
		text-align: center;
		line-height: 25px;
		border-radius: 50%;
		position: absolute;
		color: #FFFFFF;
		font-size: 13px;
		margin-left: -15px;
		margin-top: 20px;
		/* padding: 4px; */
	}

	::v-deep .uni-list--border-top {
		height: 0px
	}

	.skip-box {
		text-align: center;
		margin-top: 30px;
	}

	.skip-box>a {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border: 2px solid #DDDDDD;
		border-radius: 20px;
		color: #666666;
		font-size: 13px;
		padding: 5px 15px;
	}

	.skip-box>a.disabled {
		background-color: #DDDDDD;
	}

	.skip-box>a.btn-submit {
		background-color: #FF9900;
		border-color: #FF9900;
		color: #FFFFFF;
	}

	.skip-box>a+a {
		margin-left: 20px;
	}

	.action-box {
		position: relative;
	}

	.action-box .overflow-cover {
		position: absolute;
		width: 100%;
		height: 0.15rem;
		top: -0.15rem;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
	}

	.action-box .score-box {
		text-align: center;
		margin-bottom: 18px;
		min-height: 0.5rem;
	}

	.action-box .btns-box {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 5px;
		flex-shrink: 0;
		backface-visibility: hidden;
	}

	.btn-record {
		text-align: center;
		font-size: 10px;
		color: #7290A1;
		margin: 30px 0 -20px 0;
	}

	.list-name {
		background-color: #F6F6F6;
	}

	.btn-img {
		width: 55px;
		height: 55px;
		object-fit: cover;
		margin-top: 25px;
		margin-left: 20px;
	}

	.img-voice {
		width: 55px;
		height: 55px;
		background-image: url(~@/static/images/kouYuCePing/btn_voice.png);
		background-size: 100%;
		float: left;
	}

	.img-voice.active {
		width: 55px;
		height: 55px;
		background-image: url(~@/static/images/kouYuCePing/icon-voice.gif);
		background-size: 100%;
		float: left;
	}

	.img-record {
		width: 70px;
		height: 70px;
		background-size: 100%;
		margin-top: 15px;
		background-image: url(~@/static/images/kouYuCePing/btn_record.png);
		float: left;
	}

	.img-record.active {
		width: 70px;
		height: 70px;
		background-size: 100%;
		margin-top: 15px;
		background-image: url(~@/static/images/kouYuCePing/icon-record.gif);
		float: left;
	}

	.img-play {
		width: 55px;
		height: 55px;
		background-size: 100%;
		background-image: url(~@/static/images/kouYuCePing/btn_play.png);
		float: left;
	}
</style>
