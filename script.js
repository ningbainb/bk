// 判断当前页面
const isArticlePage = window.location.pathname.includes('article.html');

// 首页：显示文章列表
function renderArticlesList() {
    if (!isArticlePage) {
        const articlesList = document.getElementById('articles-list');
        blogData.articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article-item';
            articleElement.innerHTML = `
                <h2><a href="article.html?article=${article.filename}" class="article-title">${article.title}</a></h2>
                <p class="article-summary">${article.summary}</p>
            `;
            articlesList.appendChild(articleElement);
        });
    }
}

// 文章详情页：加载并显示文章内容
async function loadArticleContent() {
    if (isArticlePage) {
        const urlParams = new URLSearchParams(window.location.search);
        const filename = urlParams.get('article');
        
        try {
            const response = await fetch(`posts/${filename}`);
            const markdown = await response.text();
            const articleContent = document.getElementById('article-content');
            
            // 使用 marked.js 解析 Markdown
            articleContent.innerHTML = marked.parse(markdown);
            
            // 设置页面标题
            const article = blogData.articles.find(a => a.filename === filename);
            if (article) {
                document.title = `${article.title} - 我的静态博客`;
            }
        } catch (error) {
            console.error('文章加载失败:', error);
        }
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    if (isArticlePage) {
        loadArticleContent();
    } else {
        renderArticlesList();
    }
});
