export default {
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
    // ★ @click="$emit('click')" で親にクリックイベントを通知
    // 「子（TaskCard）はただベルを鳴らすだけで、どの部屋のベルが鳴ったかを知っているのは、親（TaskList）」
    // 親であるTaskListが**「どのTaskCardがクリックされたか」をv-forの文脈から判断し、対応するtaskオブジェクトを次のイベントで渡している**のです。
    // この「責務の分離」（子は単純な通知だけ、親が文脈を判断して処理する）は、Vueコンポーネントをクリーンで再利用可能に保つための、非常に一般的で優れた設計パターンです。
    template: `
        <div
            class="task-card"
            draggable="true"
            @dragstart.stop="$emit('dragstart', $event)"
            @click="$emit('click')"
        >
            <p class="task-title">{{ task.title }}</p>
            <!-- 説明文がある場合のみ表示 -->
            <p v-if="task.description" class="task-description">{{ task.description }}</p>
        </div>
    `,
};



