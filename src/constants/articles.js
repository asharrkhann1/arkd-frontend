import howToPlaceOrder from '@/articles/how-to-place-order.json';

export const articles = [
    howToPlaceOrder,
];

// Group articles by section
export function getArticlesBySection() {
    const grouped = {};
    articles.forEach(article => {
        const section = article.metadata?.section || 'general';
        if (!grouped[section]) {
            grouped[section] = [];
        }
        grouped[section].push(article);
    });
    return grouped;
}

// Get article by name
export function getArticleByName(name) {
    return articles.find(a => a.metadata?.name === name);
}

// Get all sections
export function getAllSections() {
    const sections = new Set();
    articles.forEach(article => {
        const section = article.metadata?.section || 'general';
        sections.add(section);
    });
    return Array.from(sections);
}
