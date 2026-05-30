document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const tabTitle = document.getElementById('tab-title');
    const navLinks = document.querySelectorAll('.nav-links li');

    const tabs = {
        dashboard: {
            title: 'Dashboard',
            render: () => `
                <div class="welcome-card">
                    <h2>Bem-vindo ao Sistema de Agendamento</h2>
                    <p>Selecione uma categoria no menu ao lado para visualizar os dados em tempo real.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <i class="fas fa-building"></i>
                        <div class="stat-info">
                            <h3>Status do Servidor</h3>
                            <p class="status online" style="color: #22c55e">● Online e Conectado</p>
                        </div>
                    </div>
                </div>
            `
        },
        clientes: {
            title: 'Lista de Clientes',
            endpoint: '/clientes',
            columns: ['ID', 'Nome', 'Email', 'Telefone'],
            mapping: (item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.email || '-'}</td>
                    <td>${item.telefone || '-'}</td>
                </tr>
            `
        },
        profissionais: {
            title: 'Nossos Profissionais',
            endpoint: '/profissionais',
            columns: ['ID', 'Nome', 'Especialidade', 'CAU'],
            mapping: (item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.especialidade || '-'}</td>
                    <td>${item.cau || '-'}</td>
                </tr>
            `
        },
        servicos: {
            title: 'Catálogo de Serviços',
            endpoint: '/servicos',
            columns: ['ID', 'Serviço', 'Duração', 'Preço'],
            mapping: (item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.duracao || '-'} min</td>
                    <td>R$ ${item.preco || '0.00'}</td>
                </tr>
            `
        },
        agendamentos: {
            title: 'Agendamentos Marcados',
            endpoint: '/agendamentos',
            columns: ['ID', 'Cliente', 'Profissional', 'Serviço', 'Data/Hora', 'Status'],
            mapping: (item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.cliente}</td>
                    <td>${item.profissional}</td>
                    <td>${item.servico}</td>
                    <td>${new Date(item.data_hora).toLocaleString('pt-BR')}</td>
                    <td><span class="status-badge ${item.status?.toLowerCase()}">${item.status}</span></td>
                </tr>
            `
        }
    };

    async function fetchData(tabKey) {
        const tab = tabs[tabKey];
        if (!tab.endpoint) {
            contentArea.innerHTML = tab.render();
            return;
        }

        contentArea.innerHTML = '<div class="loader"><div class="spinner"></div></div>';

        try {
            const response = await fetch(tab.endpoint);
            const data = await response.json();

            if (data.length === 0) {
                contentArea.innerHTML = '<div class="welcome-card"><p>Nenhum dado encontrado para esta categoria.</p></div>';
                return;
            }

            let tableHtml = `
                <table class="data-table">
                    <thead>
                        <tr>${tab.columns.map(col => `<th>${col}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${data.map(item => tab.mapping(item)).join('')}
                    </tbody>
                </table>
            `;
            contentArea.innerHTML = tableHtml;

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            contentArea.innerHTML = `
                <div class="welcome-card">
                    <h2 style="color: #ef4444">Erro de Conexão</h2>
                    <p>Não foi possível buscar os dados do servidor. Verifique se o backend está rodando.</p>
                </div>
            `;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabKey = link.getAttribute('data-tab');
            
            // Update UI
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            tabTitle.innerText = tabs[tabKey].title;

            fetchData(tabKey);
        });
    });
});
