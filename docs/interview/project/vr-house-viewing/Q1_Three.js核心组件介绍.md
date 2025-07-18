# Q1: 请介绍一下 Three.js 的核心组件，以及它们在 VR 看房项目中的作用？

## 口头回答

面试官您好，Three.js 是一个基于 WebGL 的 JavaScript 3D 图形库，它的核心组件主要包括场景（Scene）、相机（Camera）、渲染器（Renderer）、几何体（Geometry）、材质（Material）、光源（Light）等。在我们的 VR 看房项目中，这些组件发挥了关键作用：

**1. 场景（Scene）**
场景是所有 3D 对象的容器，相当于一个虚拟的 3D 世界。在我们项目中，所有的房间、导航图标、信息点都被添加到同一个场景中进行统一管理。

**2. 相机（Camera）**
我们使用透视相机（PerspectiveCamera）来模拟人眼视角，实现第一人称的沉浸式体验。相机的位置变化实现了房间之间的切换，旋转控制实现了 360° 全景浏览。

**3. 渲染器（Renderer）**
使用 WebGLRenderer 将场景和相机的数据渲染到 HTML 画布上，并通过 requestAnimationFrame 实现实时渲染循环。

**4. 几何体（Geometry）**
主要使用立方体几何体（BoxGeometry）创建房间空间，通过翻转 Z 轴使纹理朝向内部，形成房间内部视角。

**5. 材质（Material）**
使用基础材质（MeshBasicMaterial）配合纹理贴图，为每个房间的六个面分别加载对应的全景图片，创建沉浸式的房间环境。

**6. 精灵（Sprite）**
虽然不是传统核心组件，但在我们项目中大量使用精灵对象创建导航图标和信息点，它们始终面向相机，确保良好的交互体验。

## 项目中的具体实现细节

### 1. 场景创建

```typescript
// 在 App.vue 中创建全局场景
const scene = new THREE.Scene();
```

### 2. 相机设置

```typescript
// 创建透视相机，75度视野角，适合VR体验
const camera = new THREE.PerspectiveCamera(
    75, // 视野角度（FOV）
    window.innerWidth / window.innerHeight, // 宽高比
    0.1, // 近裁剪面
    1000 // 远裁剪面
);

// 将相机位置设置在几何体内部
camera.position.set(0, 0, 0.01);
```

### 3. 渲染器配置

```typescript
// 创建WebGL渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 渲染循环
const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
```

### 4. 房间几何体实现（Room.ts）

```typescript
// 创建10x10x10的立方体作为房间
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
// 翻转Z轴，使纹理朝向内部
boxGeometry.scale(1, 1, -1);

// 为立方体的六个面分别创建材质
const boxMaterial: THREE.MeshBasicMaterial[] = [];
imageList.forEach((item) => {
    const texture = new THREE.TextureLoader().load(textureUrl + item);
    boxMaterial.push(new THREE.MeshBasicMaterial({ map: texture }));
});

// 创建网格对象并添加到场景
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.copy(position);
box.rotation.copy(euler);
scene.add(box);
```

### 5. 导航精灵实现（RoomSprite.ts）

```typescript
// 使用Canvas动态生成导航图标纹理
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
canvas.width = 1024;
canvas.height = 1024;
ctx.fillStyle = "rgba(100, 100, 100, 0.7)";
ctx.fillRect(0, 256, canvas.width, canvas.height / 2);
ctx.font = "bold 200px Arial";
ctx.fillStyle = "white";
ctx.fillText(text, canvas.width / 2, canvas.height / 2);

// 创建精灵材质和精灵对象
const spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
});
const sprite = new THREE.Sprite(spriteMaterial);
```

### 6. 信息点精灵实现（InfoSprite.ts）

```typescript
// 使用纹理加载器加载信息点图标
const infoSpriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load(url),
    transparent: true,
});

const infoSprite = new THREE.Sprite(infoSpriteMaterial);
infoSprite.position.copy(position);
infoSprite.scale.set(scale, scale, scale);
infoSprite.userData = userData; // 存储信息点数据
scene.add(infoSprite);
```

### 7. 射线投射交互

```typescript
// 使用射线投射实现精确的3D空间交互
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// 将鼠标位置归一化为设备坐标
pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

// 从相机发射射线
raycaster.setFromCamera(pointer, camera);

// 检测射线与物体的相交
const intersects = raycaster.intersectObjects(spriteList);
if (intersects.length > 0) {
    // 处理交互逻辑
}
```

### 8. 相机控制系统

```typescript
// 实现第一人称视角的鼠标控制
container.value.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        camera.rotation.y += e.movementX * 0.002;
        camera.rotation.x += e.movementY * 0.002;
        camera.rotation.order = "YXZ"; // 使用YXZ顺序符合第一人称视角
    }
});
```

### 9. 响应式设计

```typescript
// 窗口大小变化时更新相机和渲染器
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});
```

## 技术亮点

1. **几何体翻转技术**：通过 `boxGeometry.scale(1, 1, -1)` 翻转 Z 轴，使立方体纹理朝向内部，创造房间内部视角

2. **多材质应用**：为立方体的六个面分别应用不同的全景图片纹理，实现 360° 全景效果

3. **精灵对象优化**：使用 Sprite 对象创建始终面向相机的导航图标和信息点，确保良好的用户体验

4. **射线投射交互**：利用 Raycaster 实现精确的 3D 空间点击和悬停检测

5. **相机控制优化**：使用 YXZ 旋转顺序，符合人类直觉的第一人称视角控制

6. **动态纹理生成**：使用 Canvas API 动态生成导航图标纹理，提高灵活性和性能

这些 Three.js 核心组件的合理运用，使我们成功实现了一个流畅、沉浸式的 VR 看房体验。
