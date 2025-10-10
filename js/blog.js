const posts = [
    {
        title: "Cambios en la Ley de Contratos",
        date: "2023-10-01",
        excerpt: "En este artículo discutimos las recientes modificaciones a la legislación sobre contratos civiles...",
        url: "posts/post1.html"
    },
    {
        title: "Consejos para Evitar Problemas Legales en tu Empresa",
        date: "2023-09-15",
        excerpt: "Aprende cómo proteger tu negocio con estas recomendaciones prácticas...",
        url: "posts/post2.html"
    },
    {
        title: "Entendiendo tus Derechos Laborales",
        date: "2023-08-20",
        excerpt: "Un resumen de los derechos básicos de los trabajadores en el país...",
        url: "posts/post3.html"
    }
];

function loadPosts() {
    const postsContainer = document.querySelector('.posts');
    if (!postsContainer) return;

    postsContainer.innerHTML = posts.map(post => `
        <div class="post">
            <h2><a href="${post.url}">${post.title}</a></h2>
            <p class="date">Fecha: ${post.date}</p>
            <p>${post.excerpt}</p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadPosts);