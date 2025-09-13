// KanbanBoard.js: カンバンボード全体を管理するコンポーネント

export default {
    // ` ` JavaScriptファイルの中にHTMLを書くための特別な書き方.
    // データと見た目を連動させ、さらに親子間のデータのやり取りを宣言的に書けるのが、Vue.jsの大きな特徴
    template: `
        <div>
            <h1>Vue.js カンバンボード</h1>
            <div class="kanban-board">
                <!-- task-listコンポーネントをリストの数だけ繰り返し表示 -->
                <task-list
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                    @add-task="handleAddTask"
                    @move-task="handleMoveTask"
                ></task-list>
                <!-- :key, :listは親から子へデータ渡し。@は子から親へのイベント通知 -->
            </div>
        </div>
    `,
    // コンポーネントが持つデータ
    data() {
        return {
            lists: [
                {
                    id: 1,
                    title: 'TODO',
                    tasks: [
                        { id: 1, title: 'デザインを作成する', description: 'Figmaでワイヤーフレームを準備' },
                        { id: 2, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                    ]
                },
                {
                    id: 2,
                    title: 'In Progress',
                    tasks: [
                        { id: 3, title: 'HTML/CSSコーディング', description: '静的なページを作成' },
                    ]
                },
                {
                    id: 3,
                    title: 'Done',
                    tasks: []
                },
                {
                    id: 4,
                    title: 'Hold',
                    tasks: []
                }
            ],
            // nextTaskId: 5,    // 次に追加するタスクのID
            // nextTaskId: this.lists.length + 1　という書き方はエラー。computedを使う必要がある。
        }
    },
    computed: {
        nextTaskId() {
            return this.lists.length;
        }
    },
    // コンポーネントが持つメソッド (振る舞い)
    methods: {
        // 子コンポーネントから 'add-task' イベントがemitされたときに呼ばれる
        handleAddTask(newTask) {
            // 対象のリストを見つける
            const targetList = this.lists.find(list => list.id === newTask.listId);
            if (targetList) {
                // 新しいタスクを追加
                targetList.tasks.push({
                    id: this.nextTaskId++,
                    title: newTask.title,
                    description: '', // 簡単のため説明は空に
                });
            }
        },

        // ドラッグ＆ドロップによるタスク移動処理
        handleMoveTask({ taskId, fromListId, toListId }) {
            // 移動元のリストを探す
            const fromList = this.lists.find(list => list.id === fromListId);
            if (!fromList) return;

            // 移動対象のタスクのインデックスを探す
            const taskIndex = fromList.tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) return;

            // タスクを移動元リストから削除
            const [movedTask] = fromList.tasks.splice(taskIndex, 1);

            // 移動先のリストを探してタスクを追加
            const toList = this.lists.find(list => list.id === toListId);
            if (toList) {
                toList.tasks.push(movedTask);
            }
        }
    }
};

