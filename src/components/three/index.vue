<template>
  <div class="three-scene" ref="three-scene" @selectstart="() => false">
    <div @pointerdown="(e) => e.stopPropagation()" class="btn"></div>
  </div>
</template>

<script lang="ts" setup>
//@ts-ignore
import Change from "./Change";
//@ts-ignore
import { RunScene } from "run-scene-v2";
import bus from "./Bus";
import { onMounted, ref } from "vue";
// change的实例
let sceneChange: any = null;
// runscene实例
let runScene: any = null;

// 加载场景
const loadScene = async () => {
  runScene = new RunScene({
    path: "https://test2-1303915342.cos.ap-shanghai.myqcloud.com/gangtiechang/scene.glb",
    rootDom: document.querySelector(".three-scene"),
    options: {
      // render2: true,
      render3: true,
      texture: {
        // load: false,
        lazyLoad: {
          // open: true,
          // IntervalTime: 16.6,
        },
      },

      msg: {
        // show: true,
        // level: "detail",
      },
      /**
            msg?: {
            是否显示打印，默认显示
              show: boolean = true
             显示打印的等级 默认显示基础打印
              level: "base" | 'detail' =  base
              }
             是否渲染
              run?: boolean = true
             decode 的路径
              decodePath?: string = ./draco/
             是否显示fps 默认关
              showFps?: boolean = false
             是否延迟加载 默认不延迟
              loadInterval?: number = 0
             模式 默认运行模式
              mode?: 'editor' | 'debug' | 'running' = 'running
             texture?:{
             是否加载贴图
               load?:boolean = true
               lazyload?:{
             是否懒加载贴图 默认是
                 open?:boolean = false,
             懒加载的时间区间 默认为16.0ms
                 IntervalTime?:number = 16.6
              },
             贴图质量 可大幅度降低显存占用 0-1 之间
              quality?:number = 1
             }
             是否加载实例后的模型 节省性能 默认关闭
              instanceClone?: boolean =false
             2drenderer
              render2?: boolean = false
             3drenderer
              render3?: boolean, = false
               */
    },
  }).on("complete", () => {});
  sceneChange = new Change(runScene);
};

onMounted(() => {
  loadScene();
});
</script>

<style lang="scss" scoped>
// 场景
.three-scene {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
}

.three-scene .btn {
  position: absolute;
  z-index: 2;
  left: 0px;
  top: 0px;
  display: flex;
  user-select: none;
  button {
    cursor: pointer;
    pointer-events: all;
    font-size: 25px;
    background: rgba(17, 93, 156, 0.7);
    color: white;
    border: none;
    outline: none;
    margin-right: 20px;
    border-radius: 10px;
    &:hover {
      background: rgba(0, 153, 255, 0.7);
    }
  }
}

.three-scene .block {
  display: block !important;
}

.three-scene .show {
  opacity: 1 !important;
}
</style>
