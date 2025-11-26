# Q5: 在使用 IndexedDB 时遇到过什么问题？如何解决的？

## 口头回答

在这个低代码问卷平台项目中，我使用 dexie.js 作为 IndexedDB 的包装器来实现问卷数据的本地存储。在使用过程中主要遇到了以下几个问题：

**1. 数据序列化和反序列化问题**
最大的问题是组件实例的序列化。由于 IndexedDB 只能存储可序列化的数据，而我们的组件包含 Vue 组件实例，直接存储会丢失组件的方法和响应式特性。

**2. 异步操作的错误处理**
IndexedDB 的所有操作都是异步的，需要妥善处理各种异常情况，如数据库连接失败、存储空间不足、数据不存在等。

**3. 数据库版本管理**
在开发过程中需要考虑数据库结构的变更和版本升级问题。

**4. 浏览器兼容性**
不同浏览器对 IndexedDB 的支持程度不同，需要考虑兼容性问题。

## 具体实现细节

### 1. 数据库初始化和配置

项目中使用 dexie.js 简化了 IndexedDB 的操作：

```typescript
// src/db/db.ts
import Dexie, { type Table } from 'dexie';
import type { Questionnaire } from '@/types';

class QuestionnaireDB extends Dexie {
  questionnaires!: Table<Questionnaire, number>;

  constructor() {
    super('questionnaireDB'); // 数据库名称
    this.version(1).stores({
      questionnaires: '++id, createTime, updateTime, title, questionNumber, questionComs',
    });
  }
}

export const db = new QuestionnaireDB();
```

**解决方案：**

- 使用 dexie.js 简化 IndexedDB 操作
- 明确定义数据库结构和索引
- 使用自增主键 `++id` 确保数据唯一性

### 2. 组件序列化问题的解决

**问题：** Vue 组件实例无法直接序列化存储到 IndexedDB

**解决方案：** 实现组件协议化存储和恢复机制

```typescript
// 存储时的序列化处理
// src/components/Common/Header.vue
const saveQuestionnaire = async () => {
  try {
    // 输入标题提示框
    const { value } = await ElMessageBox.prompt('请输入问卷标题', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    // 构建问卷数据
    const questionnaire: Questionnaire = {
      title: value,
      createTime: Date.now(),
      updateTime: Date.now(),
      questionNumber: editorStore.questionCount,
      // indexDB可以存无方法的对象数组
      questionComs: JSON.parse(JSON.stringify(editorStore.questionComs)), // TODO：这种方式恢复时存在问题
    };

    // 保存问卷
    const id = await editorStore.saveQuestionComs(questionnaire);
    ElMessage.success('保存问卷成功');
    router.push(`/editor/${id}/questionTypeGroup`);
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消保存');
    } else {
      ElMessage.info('问卷保存失败');
    }
  }
};
```

```typescript
// 恢复时的反序列化处理
// src/utils/index.ts
// 还原组件状态
export function restoreComponentsStatus(questionComs: SchemaType[]) {
  questionComs.forEach((item) => {
    // 业务组件还原
    item.type = componentMap[item.name];
    // 编辑组件还原
    for (let key in item.status) {
      const name = item.status[key].name as EditorComType;
      item.status[key].editCom = componentMap[name];
    }
  });
}
```

点击编辑按钮时发生路由跳转，并携带问卷id，在编辑页根据id查询问卷数据，再根据数据恢复组件状态

### 3. 异步操作错误处理

**问题：** IndexedDB 操作可能失败，需要妥善处理各种异常

**解决方案：** 在所有数据库操作中添加 try-catch 错误处理

```typescript
// src/views/HomeView.vue - 获取问卷列表
const getQuestionnaireList = async () => {
  try {
    const questionnaireList = await queryAllQuestionnaire();
    tableData.value = questionnaireList;
  } catch (error) {
    ElMessage.error('获取问卷列表失败');
  }
};

// 删除问卷
const deleteQuestionnaire = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该问卷吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    await editorStore.removeQuestionnaireById(id);
    ElMessage.success('删除问卷成功');
    getQuestionnaireList();
  } catch (error) {
    ElMessage.info('取消删除');
  }
};
```

```typescript
// src/components/Common/Header.vue - 更新问卷
const updateQuestionnaire = async () => {
  try {
    const questionnaire: Partial<Questionnaire> = {
      updateTime: Date.now(),
      questionNumber: editorStore.questionCount,
      questionComs: JSON.parse(JSON.stringify(editorStore.questionComs)),
    };
    await editorStore.updateQuestionnaire(Number(props.questionnaireId), questionnaire);
    ElMessage.success('更新问卷成功');
  } catch (error) {
    ElMessage.error('更新问卷失败');
  }
};
```

### 4. 数据库操作封装

**解决方案：** 将所有数据库操作封装到独立的模块中

```typescript
// src/db/operation.ts
import { db } from './db';
import type { Questionnaire } from '@/types';

// 添加问卷
export const addQuestionnaire = async (questionnaire: Questionnaire) => {
  return await db.questionnaires.add(questionnaire);
};

// 查询所有数据
export const queryAllQuestionnaire = async () => {
  return await db.questionnaires.toArray();
};

// 根据id查询某一条数据
export const queryQuestionnaireById = async (id: number) => {
  return await db.questionnaires.get(id);
};

// 根据id删除某一条数据
export const deleteQuestionnaireById = async (id: number) => {
  return await db.questionnaires.delete(id);
};

// 根据id更新某一条数据
export const updateQuestionnaireById = async (
  id: number,
  questionnaire: Partial<Questionnaire>,
) => {
  return await db.questionnaires.update(id, questionnaire);
};
```

### 5. 数据加载和恢复机制

**问题：** 从数据库加载数据后需要正确恢复组件状态

**解决方案：** 实现完整的数据恢复流程

```typescript
// src/views/EditorView/index.vue - 编辑器页面数据恢复
if (questionnaireId) {
  editorStore.getQuestionnaireById(Number(questionnaireId.value)).then((res) => {
    if (res) {
      // 恢复组件实例
      restoreComponentsStatus(res.questionComs);
      // 恢复编辑器状态
      editorStore.restoreQuestionnaire(res);
    }
  });
}
```

```typescript
// src/views/Preview.vue - 预览页面数据恢复
const getQuestionnaire = async () => {
  try {
    const res = await editorStore.getQuestionnaireById(id);
    if (res) {
      // 拿到数据后需要重新还原组件
      restoreComponentsStatus(res.questionComs);
      // 还原问卷仓库的状态
      editorStore.restoreQuestionnaire(res);
    }
  } catch (error) {
    ElMessage.error('加载问卷数据失败');
    router.push('/');
  }
};
```

### 6. 状态管理集成

**解决方案：** 将数据库操作集成到 Pinia 状态管理中

```typescript
// src/stores/useEditor.ts
export const useEditorStore = defineStore('editor', {
  actions: {
    // 保存问卷
    saveQuestionComs(questionnaire: Questionnaire) {
      return addQuestionnaire(questionnaire);
    },

    // 更新问卷
    updateQuestionnaire(id: number, questionnaire: Partial<Questionnaire>) {
      return updateQuestionnaireById(id, questionnaire);
    },

    // 获取问卷
    getQuestionnaireById(id: number) {
      return queryQuestionnaireById(id);
    },

    // 删除问卷
    removeQuestionnaireById(id: number) {
      return deleteQuestionnaireById(id);
    },

    // 恢复问卷状态
    restoreQuestionnaire(questionnaire: Questionnaire) {
      this.questionComs = questionnaire.questionComs;
      this.questionCount = questionnaire.questionNumber;
      this.currentQuestionIndex = -1;
    },
  },
});
```

## 解决方案总结

### 1. 技术选型优势

- **使用 dexie.js**：简化了 IndexedDB 的复杂 API，提供了更友好的 Promise 接口
- **TypeScript 支持**：提供了完整的类型定义，减少了运行时错误

### 2. 架构设计优势

- **组件协议化**：通过协议化设计解决了组件序列化问题
- **分层架构**：数据库操作、状态管理、UI 组件分离，便于维护
- **错误处理机制**：在每个关键操作点都添加了错误处理

### 3. 用户体验优化

- **友好的错误提示**：使用 Element Plus 的消息组件提供用户友好的错误信息
- **数据恢复机制**：确保用户数据的完整性和一致性
- **离线可用性**：本地存储保证了核心功能的离线可用性

### 4. 性能优化

- **按需加载**：只在需要时加载和恢复数据
- **深拷贝优化**：使用 `JSON.parse(JSON.stringify())` 进行数据清理
- **索引优化**：合理设计数据库索引提高查询性能

这种混合存储架构既保证了核心功能的离线可用性，又为后续的服务器端扩展预留了空间，是一个实用且可扩展的解决方案。
