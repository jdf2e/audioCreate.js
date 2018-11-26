# audioCreate.js

  audioCreate.js是一款可以创建一个或多个 Audio 标签并且很大限度兼容JDapp端、微信端、h5端、pc端的audio.js插件
## 示例
```
 import jdMusic from '@jmfe/jm-sound' //这是个demo,待修改路径
 jdMusic.create([{
                src: 'https://jdch5.jd.com/yayoi/res/raw-assets/Sound/A.mp3',
                isloop: false,
                id: 'demo1',
                class: 'demo1',
                autoplay: false
            }, {
                src: 'https://jdch5.jd.com/yayoi/res/raw-assets/Sound/B.mp3',
                isloop: false,
                id: 'demo2',
                class: 'demo2',
                autoplay: true
            }]);
 jdMusic.play(0)
 jdMusic.pause()

```
## 安装
npm install jdf2e-audio

```

 npm install jdf2e-audio
 
```
或者页面直接引入这个js。
```
<script src="js/audioCreate.js"></script>

```
  
## 接口

| 方法 | 说明
| --------------- | -------------
| jdMusic.create([obj,obj]) | 动态创建 Audio
| jdMusic.play(index) | 开始播放音频
| jdMusic.pause() | 停止播放音频

  
  参数说明:obj需要的传参:src(音频的引用路径)，isloop（是否循环播放）
  
  | 参数名称     | 类型       |       必填 |  说明  
  |  ----------  | ---------- | ---------- | ----------
  | obj       | Object | true | 音频对象
  | src | String | true | 属于obj的属性，音频的路径地址
  | isloop | Boolean | false | 属于obj的属性，音频是否循环播放，默认为false
  | id | String | false | 属于obj的属性，音频标签Id
  | class | String | false | 属于obj的属性，音频标签Class
  | autoplay | Boolean | false | 属于obj的属性,音频是否加载完毕自动播放，只能设置一个为true，如果设置多个则默认自动播放第一个 autoplay 为true的Aduio
  | index     | Number | false | 播放第几个音频，不填默认播放第一个
  

 
