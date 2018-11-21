# audioCreate.js使用说明

  audioCreate.js是一款可以创建多个audio标签并且很大限度兼容app端、微信端、h5端、pc端的audio.js插件
  
## 你可以在项目中这么使用它

  jdMusic.create([obj,obj])
  jdMusic.play(index)
  jdMusic.pause()
  
  参数说明:obj需要的传参:src(音频的引用路径)，isloop（是否循环播放）
  
  | 参数名字 | 参数功能 | 示例
  | ------- | -------|----
  | obj | src(音频的引用路径)，isloop（是否循环播放）| {src: 'https://storage.jd.com/jdc-op-fd/audio/bgmusic.mp3',isloop: true}
  | index | 索引（播放第几个音频） | jdMusic.play(0)

 
