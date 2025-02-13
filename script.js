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
        
        // 调试信息
        console.log('正在加载文章:', filename);
        
        if (!filename) {
            console.error('未找到文章文件名');
            document.getElementById('article-content').innerHTML = '<h1>文章未找到</h1>';
            return;
        }

        try {
            const response = await fetch(`posts/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const markdown = await response.text();
            const articleContent = document.getElementById('article-content');
            
            // 检查markdown内容
            console.log('Markdown内容长度:', markdown.length);
            
            if (!markdown || markdown.trim().length === 0) {
                throw new Error('文章内容为空');
            }

            // 使用 marked.js 解析 Markdown
            articleContent.innerHTML = marked.parse(markdown);
            
            // 设置页面标题
            const article = blogData.articles.find(a => a.filename === filename);
            if (article) {
                document.title = `${article.title} - 小宁de博客`;
            } else {
                console.warn('未在blogData中找到文章信息');
            }
        } catch (error) {
            console.error('文章加载失败:', error);
            document.getElementById('article-content').innerHTML = `
                <h1>文章加载失败</h1>
                <p>错误信息: ${error.message}</p>
            `;
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
