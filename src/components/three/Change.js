
// const console = {
//     log: () => { }
// }

import { Utils } from "run-scene-v2";
import * as THREE from "three";
import bus from "./Bus";
// 声明变量
let camera, scene, controls, renderer2, renderer, dom, t, p, runScene, Bus, dark, light;

// 工具
const { getRes, getMacro } = Utils;

// 拿资源
const setAssets = (assets) => {
    camera = assets.camera;
    scene = assets.scene;
    controls = assets.controls;
    renderer = assets.renderer;
    dom = assets.engineDom;
    t = assets.t;
    // renderer2 = assets.renderer2;
    // p = assets.p;
};

//  页面接口总出口
function Change(runScene) {
    setAssets({
        ...runScene.assetsEx.get(),
        t: this,
        runScene,
    });

    // 挂载 runScene
    t.runScene = runScene;

    // 基本事件类
    this.events = null;

    // 工具类
    this.tool = null;

    // 最后一帧加载回调
    t.runScene.on("complete", async () => {

        this.events = new Events();

        this.tool = new Tool();

        // 基本配置
        (() => {
            // 最小距离
            controls.minDistance = 20;
            // 最大距离
            controls.maxDistance = 400;

            controls.maxPolarAngle = Math.PI / 2 - 0.1;

            controls.screenSpacePanning = false;

            // 脚本播放
            t.runScene.script.playAll();
            // 初始视角
            t.events.closeAnimaAtStart.enterAnima = t.tool.cameraFoucs(
                {
                    cx: 18.962385052840354,
                    cy: 39.39184823317323,
                    cz: 64.05234457200034,
                    tx: 17.083599506493073,
                    ty: 3.686659128440832,
                    tz: 24.166062158371606,
                },
                1.5
            )
        })()
    });

    // 销毁
    this.dispose = () => runScene.dispose();
}

// 工具方法 ( 可封的公共方法 )
class Tool {
    // 设置位置 返回2D点位
    setPosition(ps) {
        let world_vector = new THREE.Vector3(ps.x, ps.y, ps.z);
        let vector = world_vector.project(camera);
        let halfWidth = window.innerWidth / 2,
            halfHeight = window.innerHeight / 2;
        return {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight),
        };
    }

    // 模型 材质属性渐变 透明度 缩放值等
    showAnima(info) {
        const { model, isShow, time, cb, opacity } = info;
        const models = [];
        model.traverse((m) => {
            if (m.type === "Group") return;
            if (m.type === "Object3D") return;
            m.material.transparent = true;
            isShow ? (m.material.opacity = 0) : null;
            models.push(m);
        });
        if (isShow) model.visible = isShow;
        Utils.anima({
            opc: isShow ? 0 : opacity || 1,
        }, {
            opc: isShow ? opacity || 1 : 0,
        },
            time,
            (data) => {
                models.map((m) => (m.material.opacity = data.opc));
            },
            () => {
                if (!isShow) model.visible = isShow;
                cb && cb();
            }
        );
    }

    // 相机动画
    cameraFoucs(position, time = 1, fn) {
        t.events.closeAnimaAtStart.anima = Utils.anima({
            cx: t.runScene.assetsEx.camera.position.x,
            cy: t.runScene.assetsEx.camera.position.y,
            cz: t.runScene.assetsEx.camera.position.z,
            tx: t.runScene.assetsEx.controls.target.x,
            ty: t.runScene.assetsEx.controls.target.y,
            tz: t.runScene.assetsEx.controls.target.z,
        }, {
            ...position,
        },
            time,
            (data) => {
                t.runScene.assetsEx.camera.position.set(data.cx, data.cy, data.cz);
                t.runScene.assetsEx.controls.target.set(data.tx, data.ty, data.tz);
                t.runScene.assetsEx.camera.updateProjectionMatrix();
                t.runScene.assetsEx.controls.update();
            },
            () => {
                fn && fn();
            }
        );
    }
}

// 基本事件
class Events {
    downPosition = {
        x: 0,
        y: 0,
    };

    closeAnimaAtStart = {
        enterAnima: "",
    };

    constructor() {
        t.runScene.assetsEx.controls.addEventListener("start", this.controlStart);
        t.runScene.cb.events.pointer.up.add("pointerUp", this.mouseUp);
        t.runScene.cb.model.setSelect.add("trigger-click", this.triggerClick.bind(this));
        t.runScene.cb.events.pointer.down.add("trigger", (e) => t.runScene.modelEx.selectNull());
        document.addEventListener("click", (e) => { });
    }

    triggerClick = (model) => {
        if (!model) return;
        console.log(
            `cx:${camera.position.x}, cy:${camera.position.y}, cz:${camera.position.z}, tx:${controls.target.x}, ty:${controls.target.y}, tz:${controls.target.z} `,
            "位置"
        );
        bus.emit("logClickModel", model);
    };

    controlStart = () => {
        // 关闭其他动画
        this.stopMove();
        this.closeAnmia();
    };

    stopMove = () => {
        let cameraPosition = camera.position;
        let dis = cameraPosition.distanceTo({
            x: 0.9999999999999999,
            y: 0.9999999999999999,
            z: 0.9999999999999999,
        });
        if (dis >= 200) {
            controls.enablePan = false;
            // 1.5秒后恢复
            Utils.getMacro(() => {
                // 重新恢复至初始视角动静
                // t.entranceAmin();
                t.runScene.modelEx.camAnima(
                    t.runScene.modelEx.getCamLocal(), {
                    cx: -0.09426647525432941,
                    cy: 39.82213015427487,
                    cz: 78.80192297308689,
                    tx: 20.083488587666352,
                    ty: 3.686659128440832,
                    tz: 11.119447692310228
                },
                    1.5
                );
                // 可以进行右键移动
                controls.enablePan = true;
            }, 1500);
        } else {
            // 可以进行右键移动
            controls.enablePan = true;
        }
    };

    closeAnmia() {
        // 暂停动画 并清空内容 item就是那个动画
        Object.values(this.closeAnimaAtStart).map((item) => item && item.kill());
    }

    dispose() {
        dom.removeEventListener("pointerup", this.mouseUp);
        controls.removeEventListener("start", this.controlStart);
    }
}


export default Change;
