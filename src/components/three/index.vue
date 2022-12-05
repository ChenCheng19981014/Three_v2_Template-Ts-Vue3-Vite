<template>
  <div class="three-scene" ref="threeScene" @selectstart="() => false">
    <div @pointerdown="(e:any) => e.stopPropagation()" class="btn"></div>
  </div>
</template>

<script lang="ts" setup>
//@ts-ignore
import Change from "./Change";
//@ts-ignore
import { RunScene } from "run-scene-v2";
import bus from "./Bus";
import { onMounted, ref, onBeforeMount } from "vue";
// change的实例
let sceneChange: any = null;
// runscene实例
let runScene: any = null;

// 加载场景
const loadScene = async () => {
  const threeScene = ref(null);
  if (!threeScene) return;
  let dom = document.querySelector(".three-scene");
  runScene = new RunScene({
    msg: {
      show: true,
    },
    showFps: true,
    coverSameId: true,
    instanceClone: false,
    render3: true,
    render2: true,
    renderConfig: {
      // 是否允许设置模型位置后自动渲染最新效果
      matrixAutoUpdate: true,
      scriptFrame: 60,
    },
  })
    .load({
      dom,
      path: "http://192.168.3.8:8080/file?path=project/linkpoint/&key=202208251758369891641001202265",
    })
    .on("complete", () => {});
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
