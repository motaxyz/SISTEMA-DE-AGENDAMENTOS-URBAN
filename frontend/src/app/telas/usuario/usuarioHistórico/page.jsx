import styles from './page.module.css'; // Importa os estilos da página
import { useState, useEffect } from 'react'; // Importa hooks para gerenciar estado e efeitos

import api from '@/services/api'; // Importa o serviço de API para interagir com o backend

import FormAgendamentos from '@/components/FormAgendamentos'; // Importa o componente de formulário de agendamentos

import Swal from 'sweetalert2'; // Importa a biblioteca SweetAlert2 para modais de alerta
import { PiListMagnifyingGlassBold } from "react-icons/pi"; // Importa ícone de busca
import { MdRemoveRedEye, MdEdit } from "react-icons/md"; // Importa ícones de visualização e edição
import { parseISO, format } from 'date-fns'; // Importa funções para manipulação de datas
import { IoMdTrash } from "react-icons/io"; // Importa ícone de exclusão

export default function UsuarioHistorico() {
    // Estado para armazenar os agendamentos
    const [agendamentos, setAgendamentos] = useState([]);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState([]); // Estado para armazenar os agendamentos filtrados
    const [searchText, setSearchText] = useState(''); // Estado para armazenar o texto de busca
    const [startDate, setStartDate] = useState(''); // Estado para armazenar a data inicial do filtro
    const [endDate, setEndDate] = useState(''); // Estado para armazenar a data final do filtro
    const [statusFilter, setStatusFilter] = useState('todos'); // Estado para armazenar o filtro de status
    const [currentPage, setCurrentPage] = useState(1); // Estado para controlar a página atual na exibição de agendamentos
    const [sortedColumn, setSortedColumn] = useState(null); // Estado para armazenar a coluna ordenada
    const [isAsc, setIsAsc] = useState(true); // Estado para controlar a ordem de classificação (ascendente ou descendente)
    const [situacaoDoAgendamento, setSituacaoDoAgendamento] = useState([]); // Estado para armazenar as situações de agendamento
    const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário
    const [showForm, setShowForm] = useState(false); // Estado para controlar a visibilidade do formulário de agendamento
    const [isViewing, setIsViewing] = useState(false); // Estado para controlar se estamos visualizando um agendamento
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar se estamos editando um agendamento
    const [selectedAgend, setSelectedAgend] = useState({ // Estado para armazenar os dados do agendamento selecionado
        agend_data: '',
        agend_horario: '',
        agend_id: '',
        agend_observ: '',
        agend_serv_situ_id: 1,
        serv_nome: '',
        usu_id: '',
        usu_nome: '',
        veic_ano: '',
        veic_cor: '',
        veic_placa: '',
        veic_usu_id: '',
        cat_serv_id: '',
        cat_serv_nome: '',
        mod_nome: '',
        mar_nome: ''
    });
    const agendamentosPerPage = 15; // Número de agendamentos por página

    // Mapeia os códigos das situações de agendamento para seus respectivos nomes
    const agendSituacaoMap = {
        1: 'Pendente',
        2: 'Em andamento',
        3: 'Concluído',
        4: "Cancelado"
    };

    // Mapeia os códigos das situações de agendamento para suas respectivas cores
    const colorMap = {
        1: '#e69500f3',  // Pendente - Dourado
        2: '#1b77d4',  // Em andamento - Azul
        3: '#26a426',  // Concluído - Verde
        4: '#c3290e'   // Cancelado - Vermelho
    };

    useEffect(() => {
        // Verifica se o userId está presente para carregar os agendamentos e a situação do agendamento
        if (userId) {
            ListarAgendamentos();
            ListarSituacaoDoAgendamento();
        }
    }, [userId]); // Dependência: só executa novamente quando o userId mudar

    useEffect(() => {
        // Recupera o ID do usuário armazenado no localStorage e define o estado de userId
        const storedUserId = localStorage.getItem('user');
        if (storedUserId) {
            const parsedUser = JSON.parse(storedUserId);
            setUserId(parsedUser?.id || null); // Atualiza o estado do userId
        }
    }, []); // Executa uma única vez ao montar o componente

    const ListarAgendamentos = async () => {
        try {
            // Realiza a requisição para obter os agendamentos do usuário
            const response = await api.get(`/agendamentos/${userId}`);

            // Ordena os agendamentos pela data e horário
            const agendamentosOrdenados = response.data.dados.sort((a, b) => {
                const dateTimeA = new Date(`${a.agend_data}T${a.agend_horario}`);
                const dateTimeB = new Date(`${b.agend_data}T${b.agend_horario}`);
                return dateTimeB - dateTimeA; // Ordenação decrescente
            });

            setAgendamentos(agendamentosOrdenados); // Atualiza o estado com os agendamentos ordenados
            setFilteredAgendamentos(agendamentosOrdenados); // Atualiza os agendamentos filtrados
        } catch (error) {
            // Exibe um alerta se ocorrer erro ao buscar os agendamentos
            console.error("Erro ao buscar os agendamentos:", error);
            Swal.fire({
                title: "Aviso",
                text: "Ainda não há agendamentos.",
                icon: "warning",
                iconColor: '#ff9d00',
                confirmButtonColor: '#ff9d00',
            });
        }
    };

    const ListarSituacaoDoAgendamento = async () => {
        try {
            // Realiza a requisição para obter as situações dos agendamentos
            const responde = await api.get('/agendaServicosSituacao');
            setSituacaoDoAgendamento(responde.data.dados); // Atualiza o estado com as situações
        } catch (error) {
            // Exibe um alerta caso ocorra erro ao buscar as situações
            console.error("Erro ao buscar os situações dos agendamentos:", error);
            Swal.fire({
                title: "Erro!",
                text: "Ainda não há agendamentos",
                icon: "error",
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleSubmit = async (agendamentos) => {
        // Prepara os dados do agendamento para envio ao backend
        const dados = {
            veic_usu_id: selectedAgend.veic_usu_id,
            agend_data: selectedAgend.agend_data,
            agend_horario: selectedAgend.agend_horario,
            serv_id: selectedAgend.serv_id,
            agend_serv_situ_id: selectedAgend.agend_serv_situ_id,
            agend_observ: selectedAgend.agend_observ,
            agend_id: selectedAgend.agend_id,
        };

        try {
            let response;

            // Se estiver editando um agendamento, realiza um PATCH para atualizar
            if (isEditing) {
                response = await api.patch(`/agendamentos/${agendamentos.agend_id}`, dados);
            }

            // Exibe um alerta de sucesso após salvar o agendamento
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            // Atualiza o estado e lista novamente os agendamentos
            setShowForm(false);
            setIsEditing(false);
            setIsViewing(false);
            ListarAgendamentos();
        } catch (error) {
            // Exibe um alerta de erro caso ocorra falha no processo de salvamento
            console.error('Erro ao salvar o agendamento:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao salvar o agendamento. Tente novamente.',
                icon: 'error',
                iconColor: "rgb(255, 69, 58)",
                confirmButtonColor: "rgb(255, 69, 58)",
            });
        }
    };

    const handleSearch = (text) => {
        // Atualiza o estado do texto de busca
        setSearchText(text);
        const lowerText = text.toLowerCase(); // Converte o texto para minúsculas para facilitar a comparação

        // Filtra os agendamentos com base no texto de busca
        const filtered = agendamentos.filter((agendamento) => {
            // Verifica se o texto de busca corresponde a algum campo do agendamento
            const idMatch = agendamento.agend_id.toString().includes(lowerText);
            const placaMatch = agendamento.veic_placa.toLowerCase().includes(lowerText);
            const dataMatch = format(parseISO(agendamento.agend_data), 'dd/MM/yyyy').includes(lowerText);
            const horarioMatch = agendamento.agend_horario.includes(lowerText);
            const servicoMatch = agendamento.serv_nome.toLowerCase().includes(lowerText);

            return idMatch || placaMatch || dataMatch || horarioMatch || servicoMatch; // Retorna agendamentos que atendem a qualquer uma das condições
        });

        setFilteredAgendamentos(filtered); // Atualiza os agendamentos filtrados
    };

    // Função para atualizar as datas de início e fim e aplicar os filtros
    const handleDateChange = (start, end) => {
        setStartDate(start); // Atualiza a data de início
        setEndDate(end); // Atualiza a data de fim
        applyFilters(searchText, start, end, statusFilter); // Aplica os filtros com as novas datas
    };

    // Função para alterar o filtro de status e aplicar os filtros novamente
    const handleStatusFilterChange = (status) => {
        setStatusFilter(status); // Atualiza o filtro de status
        applyFilters(searchText, startDate, endDate, status); // Aplica os filtros com o novo status
    };

    // Função para preparar o formulário de edição de agendamento
    const handleEditAgend = (agendamentos) => {
        setShowForm(true); // Exibe o formulário
        setSelectedAgend(agendamentos); // Seleciona o agendamento para edição
        setIsViewing(false); // Desativa a visualização do agendamento
        setIsEditing(true); // Ativa o modo de edição
    };

    // Função para visualizar o agendamento sem editar
    const handleViewAgend = (agendamentos) => {
        setSelectedAgend(agendamentos); // Seleciona o agendamento para visualização
        setShowForm(true); // Exibe o formulário
        setIsViewing(true); // Ativa o modo de visualização
        setIsEditing(false); // Desativa o modo de edição
    };

    // Função para cancelar um agendamento com confirmação via SweetAlert2
    const CancelarAgendamento = async (agendamentos) => {
        // Exibe um modal de confirmação de cancelamento
        Swal.fire({
            title: "Tem certeza?", // Título do modal
            text: "Você deseja realmente cancelar este agendamento? Esta ação não pode ser desfeita.", // Descrição do alerta
            icon: "warning", // Tipo de ícone do alerta
            iconColor: "#ff9d00", // Cor do ícone
            showCancelButton: true, // Exibe o botão de cancelar
            confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
            cancelButtonColor: "#d33", // Cor do botão de cancelamento
            confirmButtonText: "Sim, cancelar!", // Texto do botão de confirmação
            cancelButtonText: "Cancelar", // Texto do botão de cancelamento
            reverseButtons: true, // Inverte a ordem dos botões
            backdrop: "rgba(0,0,0,0.7)" // Cor de fundo com opacidade
        }).then(async (result) => {
            if (result.isConfirmed) { // Se o usuário confirmar o cancelamento
                try {
                    const situacao = 0; // Situação do agendamento após o cancelamento
                    const servSituacaoId = 4; // Identificador da situação do serviço (cancelado)

                    const dados = {
                        agend_situacao: parseInt(situacao, 10), // Atualiza a situação do agendamento
                        agend_serv_situ_id: parseInt(servSituacaoId, 10) // Atualiza a situação do serviço
                    };

                    // Faz a requisição para cancelar o agendamento
                    const response = await api.patch(`/agendamentos/cancelar/${agendamentos.agend_id}`, dados);

                    // Exibe uma mensagem de sucesso ou erro com base na resposta da API
                    if (response.data.sucesso) {
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Agendamento cancelado com sucesso.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            iconColor: "rgb(40, 167, 69)",
                            confirmButtonColor: "rgb(40, 167, 69)",
                        });
                        ListarAgendamentos(); // Recarrega a lista de agendamentos
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: response.data.mensagem || 'Ocorreu um erro ao cancelar o agendamento.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            iconColor: '#d33',
                            confirmButtonColor: '#d33',
                        });
                    }
                } catch (error) {
                    // Exibe um alerta de erro em caso de falha na requisição
                    Swal.fire({
                        title: 'Erro!',
                        text: `Erro no cancelamento do agendamento: ${error.message}`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        iconColor: '#d33',
                        confirmButtonColor: '#d33',
                    });
                }
            }
        });
    };

    // Função para confirmar o cancelamento do formulário sem salvar alterações
    const Cancelar = () => {
        // Exibe um modal de confirmação para cancelar o formulário
        Swal.fire({
            title: "Deseja Cancelar?", // Título do modal
            text: "As informações não serão salvas", // Descrição do alerta
            icon: "warning", // Tipo de ícone do alerta
            iconColor: "orange", // Cor do ícone
            showCancelButton: true, // Exibe o botão de cancelar
            cancelButtonColor: "#d33", // Cor do botão de cancelamento
            confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
            cancelButtonText: "Cancelar", // Texto do botão de cancelamento
            confirmButtonText: "Confirmar", // Texto do botão de confirmação
            reverseButtons: true, // Inverte a ordem dos botões
            backdrop: "rgba(0,0,0,0.7)", // Cor de fundo com opacidade
        }).then((result) => {
            if (result.isConfirmed) { // Se o usuário confirmar o cancelamento
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    setShowForm(false); // Fecha o formulário
                    setSelectedAgend({
                        // Reseta os dados do agendamento selecionado
                        agend_data: '',
                        agend_horario: '',
                        agend_id: '',
                        agend_observ: '',
                        agend_serv_situ_id: '',
                        serv_nome: '',
                        usu_id: '',
                        usu_nome: '',
                        veic_ano: '',
                        veic_cor: '',
                        veic_placa: '',
                        veic_usu_id: '',
                        cat_serv_id: '',
                        cat_serv_nome: ''
                    });
                    setIsViewing(false); // Desativa a visualização do agendamento
                    setIsEditing(false); // Desativa a edição do agendamento
                });
            }
        });
    };

    // Função para sair do formulário sem salvar ou cancelar alterações
    const handleExit = () => {
        setShowForm(false); // Fecha o formulário
        setSelectedAgend({
            // Reseta os dados do agendamento selecionado
            agend_data: '',
            agend_horario: '',
            agend_id: '',
            agend_observ: '',
            agend_serv_situ_id: '',
            serv_nome: '',
            usu_id: '',
            usu_nome: '',
            veic_ano: '',
            veic_cor: '',
            veic_placa: '',
            veic_usu_id: '',
            cat_serv_id: '',
            cat_serv_nome: ''
        });
        setIsViewing(false); // Desativa a visualização do agendamento
        setIsEditing(false); // Desativa a edição do agendamento
    };

    const applyFilters = (text, start, end, status) => {
        // Filtra a lista de agendamentos com base nos critérios fornecidos (texto, intervalo de datas e status)
        const result = agendamentos.filter((agendamento) => {
            // Verifica se o texto de pesquisa corresponde ao campo observações, placa ou ID do agendamento
            const matchesText = agendamento.agend_observ.toLowerCase().includes(text.toLowerCase()) ||
                agendamento.veic_placa.toLowerCase().includes(text.toLowerCase()) ||
                agendamento.agend_id.toString().includes(text);

            // Converte a data do agendamento para comparações sem considerar a hora
            const agendamentoData = new Date(agendamento.agend_data).setUTCHours(0, 0, 0, 0);

            // Converte as datas de início e fim para o formato UTC para comparações
            const startDate = start ? new Date(start).setUTCHours(0, 0, 0, 0) : null;
            const endDate = end ? new Date(end).setUTCHours(23, 59, 59, 999) : null;

            // Verifica se a data do agendamento está dentro do intervalo especificado
            const matchesDate = (!startDate || agendamentoData >= startDate) &&
                (!endDate || agendamentoData <= endDate);

            // Verifica se o status do agendamento corresponde ao status filtrado
            const matchesStatus = status === 'todos' || agendamento.agend_serv_situ_id === parseInt(status);

            // Retorna verdadeiro se todos os critérios de filtro forem atendidos
            return matchesText && matchesDate && matchesStatus;
        });

        // Atualiza a lista filtrada de agendamentos e redefine a página atual para 1
        setFilteredAgendamentos(result);
        setCurrentPage(1);
    };

    const sortByColumn = (column) => {
        let newIsAsc = true; // Assume que a ordenação será crescente por padrão

        // Se a coluna já está sendo ordenada, alterna a direção da ordenação
        if (sortedColumn === column) newIsAsc = !isAsc;

        // Ordena os agendamentos com base na coluna especificada e na direção da ordenação
        const sortedData = [...filteredAgendamentos].sort((a, b) => {
            if (a[column] < b[column]) return newIsAsc ? -1 : 1; // Se "a" for menor que "b", coloca "a" primeiro
            if (a[column] > b[column]) return newIsAsc ? 1 : -1; // Se "a" for maior que "b", coloca "b" primeiro
            return 0; // Se são iguais, mantém a ordem original
        });

        // Atualiza a lista ordenada de agendamentos e as variáveis relacionadas à ordenação
        setFilteredAgendamentos(sortedData);
        setSortedColumn(column);
        setIsAsc(newIsAsc);
    };

    // Calcula os índices de início e fim para a página atual de agendamentos
    const indexOfLastAgendamento = currentPage * agendamentosPerPage;
    const indexOfFirstAgendamento = indexOfLastAgendamento - agendamentosPerPage;

    // Cria a lista de agendamentos a serem exibidos na página atual, com base nos índices calculados
    const currentAgendamentos = filteredAgendamentos.slice(indexOfFirstAgendamento, indexOfLastAgendamento);

    return (
        <div id="clientes" className={styles.content_section}>
            <h2 className={styles.title_page}>Gerenciamento de Agendamentos</h2>
            {!showForm ? (
                <>
                    <div className={styles.contentSearch}>
                        <div className={styles.search}>
                            <div className={styles.searchInput}>
                                <input
                                    type="text"
                                    placeholder="Digite aqui..."
                                    className={styles.inputSearch}
                                    value={searchText}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <PiListMagnifyingGlassBold className={styles.lupa} />
                            </div>
                        </div>

                        <div className={styles.filterButtons}>
                            <div className={styles.filterGroup}>
                                <label htmlFor="startDate" className={styles.labelFilter}>Data Início</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className={styles.filterSelect}
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e.target.value, endDate)}
                                />
                            </div>

                            <div className={styles.filterGroup}>
                                <label htmlFor="endDate" className={styles.labelFilter}>Data Fim</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className={styles.filterSelect}
                                    value={endDate}
                                    onChange={(e) => handleDateChange(startDate, e.target.value)}
                                />
                            </div>

                            <div className={styles.filterGroup}>
                                <label htmlFor="status" className={styles.labelFilter}>Situação</label>
                                <select
                                    id="status"
                                    className={styles.filterSelect}
                                    value={statusFilter}
                                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    {situacaoDoAgendamento.map((agendSitu) => (
                                        <option key={agendSitu.agend_serv_situ_id} value={agendSitu.agend_serv_situ_id}>
                                            {agendSitu.agend_serv_situ_nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.resultTableContainer}>
                        <table className={styles.resultTable}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th
                                        className={`${styles.tableHeader} ${styles.id}`}
                                        onClick={() => sortByColumn('agend_id')}>
                                        ID
                                        {sortedColumn === 'agend_id' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.placa}`}
                                        onClick={() => sortByColumn('veic_placa')}>
                                        Placa
                                        {sortedColumn === 'veic_placa' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.data}`}
                                        onClick={() => sortByColumn('agend_data')}>
                                        Data
                                        {sortedColumn === 'agend_data' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.horario}`}
                                        onClick={() => sortByColumn('agend_horario')}>
                                        Horário
                                        {sortedColumn === 'agend_horario' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.observ}`}
                                        onClick={() => sortByColumn('serv_nome')}>
                                        Serviço
                                        {sortedColumn === 'serv_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.cliente}`}
                                        onClick={() => sortByColumn('usu_nome')}>
                                        Cliente
                                        {sortedColumn === 'usu_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.situacao}`}>
                                        Situação
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.acao}`}>Ações</th>
                                </tr>
                            </thead>

                            <tbody className={styles.tableBody}>
                                {currentAgendamentos.length > 0 ? (
                                    currentAgendamentos.map((agendamento) => (
                                        <tr key={agendamento.agend_id} className={styles.tableRow}>
                                            <td className={styles.tdId}>{agendamento.agend_id}</td>
                                            <td>{agendamento.veic_placa}</td>
                                            <td>{format(parseISO(agendamento?.agend_data), 'dd/MM/yyyy')}</td>
                                            <td>{agendamento.agend_horario}</td>
                                            <td>{agendamento.serv_nome}</td>
                                            <td>{agendamento.usu_nome}</td>
                                            <td>
                                                <div
                                                    className={styles.corSituacao}
                                                    style={{ backgroundColor: colorMap[agendamento.agend_serv_situ_id] || '#ccc' }}
                                                >
                                                    {agendSituacaoMap[agendamento.agend_serv_situ_id] || 'Desconhecido'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.actionIcons}>
                                                    <i>
                                                        <MdRemoveRedEye
                                                            title="Visualizar"
                                                            onClick={() => handleViewAgend(agendamento)}
                                                        />
                                                    </i>
                                                    <i>
                                                        <MdEdit
                                                            title="Editar"
                                                            onClick={() => handleEditAgend(agendamento)}
                                                        />
                                                    </i>

                                                    <i>
                                                        <IoMdTrash
                                                            title="Cancelar"
                                                            onClick={() => CancelarAgendamento(agendamento)}
                                                        />
                                                    </i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className={styles.tableRow}>
                                        <td colSpan="8">Nenhum agendamento encontrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.pagination}>
                        <button
                            className={`${styles.buttonPrev} ${styles.paginationButton}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span className={styles.paginationText}>Página {currentPage}</span>
                        <button
                            className={`${styles.buttonNext} ${styles.paginationButton}`}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    filteredAgendamentos.length > indexOfLastAgendamento ? prev + 1 : prev
                                )
                            }
                            disabled={filteredAgendamentos.length <= indexOfLastAgendamento}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <FormAgendamentos
                        selectedAgend={selectedAgend}
                        setSelectedAgend={setSelectedAgend}
                        Cancelar={Cancelar}
                        isViewing={isViewing}
                        isEditing={isEditing}
                        handleSubmit={handleSubmit}
                    />

                    <div className={styles.footer_form}>

                        {isViewing ? (

                            <button
                                type="button"
                                className={styles.button_exit}
                                onClick={handleExit}
                            >
                                Voltar
                            </button>
                        ) : (
                            <>
                                {isEditing ? (
                                    <>
                                        <button
                                            type="reset"
                                            onClick={Cancelar}
                                            className={styles.button_cancel}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className={styles.button_submit}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit(selectedAgend);
                                            }}
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="reset"
                                            onClick={Cancelar}
                                            className={styles.button_cancel}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className={styles.button_submit}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit(selectedAgend);
                                            }}
                                        >
                                            Salvar
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}