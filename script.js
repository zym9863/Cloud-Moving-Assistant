document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const checklistResult = document.getElementById('checklistResult');
    const categoriesContainer = checklistResult.querySelector('.categories');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const saveBtn = document.getElementById('saveBtn');
    const shareBtn = document.getElementById('shareBtn');
    const printBtn = document.getElementById('printBtn');

    // 从 items.json 加载数据
    async function loadItems() {
        try {
            const response = await fetch('items.json');
            return await response.json();
        } catch (error) {
            console.error('加载物品数据失败:', error);
            return null;
        }
    }

    // 从每个分类中随机选择物品
    function selectRandomItems(items, count = 5) {
        const selected = new Set();
        const available = [...items];

        while (selected.size < Math.min(count, items.length)) {
            const randomIndex = Math.floor(Math.random() * available.length);
            const item = available[randomIndex];
            selected.add(item);
            available.splice(randomIndex, 1);
        }

        return Array.from(selected);
    }

    // 获取分类对应的图标
    function getCategoryIcon(category) {
        const icons = {
            '厨房用品': 'ri-knife-line',
            '卧室用品': 'ri-hotel-bed-line',
            '客厅用品': 'ri-sofa-line',
            '卫生间用品': 'ri-shower-line',
            '衣物': 'ri-t-shirt-line',
            '书籍文件': 'ri-book-open-line',
            '杂物': 'ri-box-3-line'
        };

        return icons[category] || 'ri-box-3-line';
    }

    // 添加延迟显示动画效果
    function animateElement(element, delay) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    // 生成搬家清单
    async function generateChecklist() {
        generateBtn.disabled = true;
        loadingIndicator.classList.remove('hidden');

        const items = await loadItems();
        if (!items) {
            generateBtn.disabled = false;
            loadingIndicator.classList.add('hidden');
            return;
        }

        categoriesContainer.innerHTML = '';

        // 遍历每个分类并生成清单
        let index = 0;
        for (const [category, categoryItems] of Object.entries(items)) {
            const selectedItems = selectRandomItems(categoryItems);
            const categoryIcon = getCategoryIcon(category);

            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.innerHTML = `
                <h3><i class="${categoryIcon}"></i>${category}</h3>
                <ul>
                    ${selectedItems.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;

            categoriesContainer.appendChild(categoryElement);
            animateElement(categoryElement, 100 + (index * 150));
            index++;
        }

        checklistResult.classList.remove('hidden');
        generateBtn.disabled = false;
        loadingIndicator.classList.add('hidden');

        // 添加点击事件到每个清单项
        document.querySelectorAll('.category li').forEach(item => {
            item.addEventListener('click', function() {
                this.style.textDecoration = this.style.textDecoration === 'line-through' ? 'none' : 'line-through';
                this.style.color = this.style.textDecoration === 'line-through' ? '#a0aec0' : '';
            });
        });
    }

    // 保存清单功能
    function saveChecklist() {
        const content = document.querySelector('.categories').innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '搬家清单.html';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 分享清单功能
    async function shareChecklist() {
        try {
            await navigator.share({
                title: '我的搬家清单',
                text: '查看我用云搬家助手生成的搬家清单！',
                url: window.location.href
            });
        } catch (err) {
            console.log('分享失败:', err);
        }
    }

    // 打印清单功能
    function printChecklist() {
        window.print();
    }

    // 绑定按钮事件
    saveBtn.addEventListener('click', saveChecklist);
    shareBtn.addEventListener('click', shareChecklist);
    printBtn.addEventListener('click', printChecklist);

    // 绑定按钮点击事件
    generateBtn.addEventListener('click', generateChecklist);
});