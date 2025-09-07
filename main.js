import KanbanBoard from './components/KanbanBoard.js';
import TaskList from './components/TaskList.js';
import TaskCard from './components/TaskCard.js';

// Vueアプリケーションを作成
const app = Vue.createApp(KanbanBoard); // 一番の親、ベースとなるコンポーネントの登録。「ルートコンポーネント」と呼ぶ。


// 各コンポーネントをグローバルに登録
// これにより、どのコンポーネントのテンプレート内でもこれらのタグが使えるようになる
app.component('task-list', TaskList);
app.component('task-card', TaskCard);

app.mount('#app');
