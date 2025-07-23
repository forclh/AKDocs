# VR 全景看房项目面试点

## 项目介绍

### 项目描述

该项目基于 Three.js 和 Vue.js 开发的 3D 虚拟房屋查看应用，实现了沉浸式看房体验。用户可以在客厅、厨房、阳台等多个房间场景中自由切换，通过第一人称视角进行 360° 全景浏览同时可以通过交互查看场景中存在的信息点。

### 技术栈

vue3、ts、three.js、gsap

### 项目亮难点

1. 实现了第一人称视角的相机控制系统，通过监听鼠标事件调整相机旋转角度并确保旋转符合人类直觉。同时，使用 GSAP 动画库实现了房间之间的平滑过渡效果，提升用户体验。
2. 利用射线投射交互技术实现了精确的 3D 空间交互，包括房间导航点的点击切换和信息点的悬停检测。

## 面试题

### Q1: 请介绍一下 Three.js 的核心组件，以及它们在 VR 看房项目中的作用？

[详细内容](./Q1-Three.js核心组件介绍.md)

**参考答案：**

面试官您好，Three.js 是一个基于 WebGL 的 JavaScript 3D 图形库，它的核心组件主要包括**场景（Scene）、相机（Camera）、渲染器（Renderer）、几何体（Geometry）、材质（Material）、光源（Light）等**。在我们的 VR 看房项目中，这些组件发挥了关键作用：

**1. 场景（Scene）**

场景是**所有 3D 对象的容器**，相当于一个虚拟的 3D 世界。在我们项目中，**所有的房间、导航图标、信息点**都被添加到同一个场景中进行统一管理。

**2. 相机（Camera）**

我们使用**透视相机（PerspectiveCamera）来模拟人眼视角**，实现第一人称的沉浸式体验。**相机的位置变化实现了房间之间的切换，旋转控制实现了 360° 全景浏览**。

**3. 渲染器（Renderer）**

使用 WebGLRenderer 将**场景和相机的数据渲染到 HTML 画布**上，并通过 `requestAnimationFrame` 实现**实时渲染循环**。

**4. 几何体（Geometry）**

主要使用**立方体几何体（BoxGeometry）创建房间**空间，通过**翻转 Z 轴使纹理朝向内部，形成房间内部视角**。

**5. 材质（Material）**

使用**基础材质（MeshBasicMaterial）配合纹理贴图**，为**每个房间的六个面分别加载对应的全景图片**，创建沉浸式的房间环境。

**6. 精灵（Sprite）**

虽然不是传统核心组件，但在我们项目中大量使用**精灵对象创建导航图标和信息点**，它们始终面向相机，确保良好的交互体验。

### Q2: 如何实现第一人称视角的相机控制？需要注意哪些细节？

[详细内容](./Q2-第一人称视角相机控制实现.md)

**参考答案：**

第一人称视角的相机控制是 VR 看房项目的核心功能之一。我们的实现主要包括以下几个方面：

**1. 相机初始化设置**
首先，我们使用**透视相机并将其位置设置在房间几何体内部**，模拟人眼在房间中的视角。相机的初始位置设置为 (0, 0, 0.01)，确保视点在立方体内部。

**2. 鼠标事件监听**
通过监听鼠标的 `mousedown`、`mouseup`、`mouseout` 和 `mousemove` 事件，实现拖拽控制。只有在**鼠标按下状态时，才响应鼠标移动事件**，避免意外的视角变化。

```js
onMounted(() => {
  if (container.value) {
    container.value.appendChild(renderer.domElement);
    // 渲染
    render();

    // 自定义相机视角旋转动画
    let mouseDown = false;
    container.value.addEventListener(
      "mousedown",
      () => {
        mouseDown = true;
      },
      false
    );
    container.value.addEventListener(
      "mouseup",
      () => {
        mouseDown = false;
      },
      false
    );
    container.value.addEventListener("mouseout", () => {
      mouseDown = false;
    });
    // 省略...
  }
});
```

**3. 旋转角度计算**
使用鼠标移动的增量值（`movementX` 和 `movementY`）**乘以灵敏度系数** 0.002，将像素移动转换为弧度旋转。相机 Y 轴上的角度是由鼠标 X 轴方向的增量控制，相机 X 轴上的角度是由鼠标 Y 轴方向的增量控制。

```js
// 鼠标移动事件处理
container.value.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    // 水平旋转：鼠标左右移动控制Y轴旋转
    camera.rotation.y += e.movementX * 0.002;

    // 垂直旋转：鼠标上下移动控制X轴旋转
    camera.rotation.x += e.movementY * 0.002;

    // 关键：设置旋转顺序为YXZ，符合第一人称视角直觉
    camera.rotation.order = "YXZ";
  }
});
```

**4. 旋转顺序优化**
关键是设置**相机的旋转顺序为 "YXZ"**，这样可以避免万向节锁问题，确保旋转行为**符合第一人称视角的直觉**。

### Q3: 如何使用 GSAP 实现房间之间的平滑过渡？

**参考答案：**

每个房间导航图标都有对应的点击事件，点击事件触发后会使用 `gsap.to` 函数调整相机的位置（`camera.position`），并设置平滑的过渡时间，点击事件是全局注册的，通过计算鼠标点击的位置图标调整射线的角度，判断是否和当前的导航图标相交，如果相交就触发相应的事件。

```js
// 使用GSAP实现平滑的房间切换动画
// 客厅到阳台
balconySprite.onClick(() => {
  gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: -10, // 移动到阳台房间的位置
    duration: 1, // 1秒的平滑过渡
  });
});

// 客厅到厨房
kitchenSprite.onClick(() => {
  gsap.to(camera.position, {
    x: 1.5,
    y: 0,
    z: 10, // 移动到厨房房间的位置
    duration: 1,
  });
});
```

### Q4: 什么是射线投射？在 VR 看房项目中如何应用？

[详细内容](./Q4-射线投射技术应用.md)

**参考答案：**

射线投射（Raycasting）是 3D 图形学中的一种技术，通过**从一个点（通常是相机）发射一条无限延伸射线来检测与 3D 对象的交点。**

在我们的 VR 看房项目中，射线投射主要应用于两个核心场景：

1. **导航点击交互**：当用户点击房间导航图标时，通过射线投射检测点击的是哪个导航精灵，然后执行相应的房间切换动画。

2. **信息点悬停检测**：当用户鼠标悬停在信息点上时，通过射线投射实时检测鼠标位置对应的信息点，并显示相应的提示信息。

这种技术的优势在于能够在 3D 空间中实现精确的交互检测，**无需复杂的碰撞检测算法，性能高效且实现简单**。

### Q5: 如何实现信息点的悬停检测和视觉反馈？

**参考答案：**

监听在渲染场景中**鼠标的移动事件**（mousemove），并触发信息点悬停显示函数。在这个函数中会**判断鼠标的位置，并将这个位置传递给射线投射器**，同时我们会维护一个所有信息点的列表，射线投射器会判断是否和其中的信息点相交。如果相交就创建一个信息点的提示框，否则就隐藏提示框。

```typescript
// 存储所有信息点精灵的数组
const spriteList: THREE.Sprite[] = [];

// 信息点悬停显示函数
function tooltipShow(e: MouseEvent, spriteList: THREE.Sprite[]) {
  e.preventDefault();
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // 1. 归一化鼠标坐标
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // 2. 从相机位置发射射线
  raycaster.setFromCamera(pointer, camera);

  // 3. 检测射线与所有信息点的相交
  const intersects = raycaster.intersectObjects(spriteList);

  // 4. 处理相交结果
  if (intersects.length > 0) {
    // 检查是否为信息点类型
    if (intersects[0].object.userData.type === "information") {
      // 计算提示框在屏幕上的位置
      const element = e.target as HTMLElement;
      const elementWidth = element.clientWidth / 2;
      const elementHeight = element.clientHeight / 2;

      // 将3D世界坐标转换为屏幕坐标
      const worldVector = new THREE.Vector3(
        intersects[0].object.position.x,
        intersects[0].object.position.y,
        intersects[0].object.position.z
      );
      const position = worldVector.project(camera);

      // 计算提示框的屏幕位置
      const left = Math.round(
        (position.x + 1) * elementWidth - tooltipBox.value!.clientWidth / 2
      );
      const top = Math.round(
        -(position.y - 1) * elementHeight - tooltipBox.value!.clientHeight / 2
      );

      // 更新提示框位置和内容
      tooltipPosition.value = {
        left: `${left}px`,
        top: `${top}px`,
      };
      tooltipContent.value = intersects[0].object.userData;
    } else {
      // 如果不是信息点，隐藏提示框
      handleTooltipHide(e);
    }
  }
}
```

### Q6: 如何在 Vue3 项目中集成 Three.js？有哪些最佳实践？

**参考答案：**

```typescript
// ThreeScene.vue
<template>
  <div ref="containerRef" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { SceneManager } from '@/utils/SceneManager'

const containerRef = ref<HTMLElement>()
let sceneManager: SceneManager | null = null
let animationId: number

onMounted(() => {
  if (containerRef.value) {
    sceneManager = new SceneManager(containerRef.value)
    sceneManager.init()
    animate()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  sceneManager?.dispose()
})

function animate() {
  animationId = requestAnimationFrame(animate)
  sceneManager?.update()
  sceneManager?.render()
}
</script>
```

**最佳实践：**

- 将 Three.js 逻辑封装在独立的类中
- 在组件卸载时正确清理资源
- 使用 TypeScript 提供类型安全
- 合理管理动画循环

### Q7: 如何处理 Three.js 场景的响应式布局？

**参考答案：**

监听窗口大小变化事件，并在回调函数中更新相机和渲染器的尺寸

```typescript
class ResponsiveManager {
  constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
    this.renderer = renderer;
    this.camera = camera;

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 更新相机宽高比
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // 更新渲染器尺寸
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose() {
    window.removeEventListener("resize", this.onWindowResize.bind(this));
  }
}
```
