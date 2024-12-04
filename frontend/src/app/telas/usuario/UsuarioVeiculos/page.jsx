import React from "react"; // Importa React para criar componentes
import styles from "./page.module.css"; // Importa os estilos CSS para a página
import Link from "next/link"; // Importa Link do Next.js para navegação entre páginas
import { useState, useEffect } from 'react'; // Importa hooks useState e useEffect para gerenciar estados e efeitos colaterais

import api from "@/services/api"; // Importa o serviço de API para realizar requisições HTTP

import Swal from "sweetalert2"; // Importa SweetAlert2 para mostrar modais de alerta
import InputMask from "react-input-mask"; // Importa InputMask para aplicar máscara de entrada em campos
import { parseISO, format } from "date-fns"; // Importa funções de formatação de data
import { MdAdd, MdOutlineQuestionMark, MdRemoveRedEye } from "react-icons/md"; // Importa ícones de Material Design
import { IoCarSport } from "react-icons/io5"; // Importa ícone de carro
import { FaMotorcycle, FaTruckFront } from "react-icons/fa6"; // Importa ícones de motocicleta e caminhão

export default function UsuarioVeiculos() {
    // Declaração dos estados que serão utilizados para armazenar os dados e o controle da interface
    const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar o modo de edição
    const [isViewing, setIsViewing] = useState(false); // Estado para controlar o modo de visualização
    const [isCreate, setIsCreate] = useState(false); // Estado para controlar a criação de novos veículos
    const [showForm, setShowForm] = useState(false); // Estado para controlar a exibição do formulário
    const [veiculos, setVeiculos] = useState([]); // Estado para armazenar a lista de veículos
    const [originalVehicle, setOriginalVehicle] = useState(null); // Estado para armazenar o veículo original (antes de editar)
    const [categorias, setCategorias] = useState([]); // Estado para armazenar as categorias de veículos
    const [marcas, setMarcas] = useState([]); // Estado para armazenar as marcas de veículos
    const [modelos, setModelos] = useState([]); // Estado para armazenar os modelos de veículos
    const [ano, setAno] = useState(''); // Estado para armazenar o ano do veículo
    const [anoErro, setAnoErro] = useState(''); // Estado para armazenar o erro relacionado ao ano
    const [selectedVehicle, setSelectedVehicle] = useState({ // Estado para armazenar os dados do veículo selecionado
        veic_id: "",
        veic_usu_id: "",
        veic_placa: "",
        cat_nome: "",
        data_inicial: "",
        data_final: "",
        cat_nome: "",
        mar_id: "",
        mar_nome: "",
        mod_id: "",
        mod_nome: "",
        veic_ano: "",
        veic_cor: "",
        veic_combustivel: "",
        veic_observ: "",
        ehproprietario: "",
        veic_situacao: 1,
    });

    // Efeito que é executado uma vez quando o componente é montado
    useEffect(() => {
        const storedUserId = localStorage.getItem('user'); // Obtém o ID do usuário armazenado no localStorage
        if (storedUserId) {
            const parsedUser = JSON.parse(storedUserId); // Converte o ID do usuário em um objeto
            setUserId(parsedUser?.id || null); // Define o ID do usuário no estado
        }
    }, []); // O array vazio [] garante que o efeito seja executado apenas uma vez

    // Efeito que é executado toda vez que o userId é alterado
    useEffect(() => {
        if (userId) {
            ListarVeiculosUsuario(); // Chama a função para listar os veículos do usuário
        }
    }, [userId]); // Dependência userId, o efeito será disparado sempre que o userId mudar

    // Efeito que é executado sempre que a categoria do veículo selecionado mudar
    useEffect(() => {
        if (selectedVehicle?.cat_id) {
            ListarMarcas(); // Chama a função para listar as marcas baseadas na categoria selecionada
        }
    }, [selectedVehicle?.cat_id]); // Dependência selectedVehicle.cat_id

    // Efeito que é executado sempre que a marca do veículo selecionado mudar
    useEffect(() => {
        if (selectedVehicle?.mar_id) {
            ListarModelos(); // Chama a função para listar os modelos baseados na marca selecionada
        }
    }, [selectedVehicle?.mar_id]); // Dependência selectedVehicle.mar_id

    // Função para listar os veículos do usuário
    const ListarVeiculosUsuario = async () => {
        // Verifica se o userId existe antes de continuar
        if (!userId) return;

        try {
            // Faz uma requisição GET para buscar os veículos do usuário
            const response = await api.get(`/veiculoUsuario/usuario/${userId}`);
            // Atualiza o estado com os dados dos veículos
            setVeiculos(response.data.dados);
        } catch (error) {
            // Caso ocorra um erro na requisição, exibe no console
            console.error("Erro ao buscar veículos:", error);
        }
    };

    // Função para listar as categorias disponíveis
    const ListarCategorias = async () => {
        try {
            // Faz uma requisição GET para buscar as categorias
            const response = await api.get('/categorias');
            // Atualiza o estado com as categorias recebidas
            setCategorias(response.data.dados);
        } catch (error) {
            // Caso ocorra um erro na requisição, exibe no console
            console.error("Erro ao buscar as categorias:", error);
        }
    };

    // Função para listar as marcas com base na categoria selecionada
    const ListarMarcas = async () => {
        try {
            // Faz uma requisição GET para buscar as marcas relacionadas à categoria selecionada
            const response = await api.get(`/marcas/categorias/${selectedVehicle.cat_id}`);
            // Atualiza o estado com as marcas recebidas
            setMarcas(response.data.dados);
        } catch (error) {
            // Caso ocorra um erro na requisição, exibe no console
            console.error("Erro ao buscar as marcas:", error);
        }
    };

    // Função para listar os modelos com base na categoria e marca selecionadas
    const ListarModelos = async () => {
        try {
            // Faz uma requisição GET para buscar os modelos relacionados à categoria e marca selecionadas
            const response = await api.get(`/modelos/cat/${selectedVehicle.cat_id}/mar/${selectedVehicle.mar_id}`);
            // Atualiza o estado com os modelos recebidos
            setModelos(response.data.dados);
        } catch (error) {
            // Caso ocorra um erro na requisição, exibe no console
            console.error("Erro ao buscar as marcas:", error);
        }
    };

    // Função para lidar com mudanças nos inputs do formulário
    const handleInputChange = (e) => {
        // Desestrutura o nome e valor do input alterado
        const { name, value } = e.target;

        // Verifica se o campo sendo alterado é a data inicial
        if (name === 'data_inicial') {
            // Valida se o formato da data está correto (YYYY-MM-DD)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return; // Se o formato for inválido, não faz nada
            }
            // Cria um objeto Date com o valor informado
            const inputDate = new Date(value);
            // Cria um objeto Date com a data atual
            const currentDate = new Date();

            // Configura a data atual para 00:00:00 para comparações
            currentDate.setHours(0, 0, 0, 0);

            // Verifica se a data informada é maior que a data atual
            if (inputDate > currentDate) {
                alert("A data não pode ser maior que a data atual.");
                return; // Se for maior, exibe um alerta e não faz nada
            }
        }

        // Atualiza o estado do veículo selecionado com o novo valor
        setSelectedVehicle((prevVehicle) => ({
            ...prevVehicle,
            // Converte valores para inteiros para campos específicos (ID's)
            [name]: (name === 'cat_id' || name === 'mar_id' || name === 'mod_id' || name === 'ehproprietario')
                ? parseInt(value, 10)
                : name === 'veic_placa'
                    ? value.toUpperCase() // Converte a placa para letras maiúsculas
                    : value // Para os outros campos, apenas atualiza o valor
        }));
    };

    const handleExcluirVeiculo = async (veic_usu_id) => {
        // Exibe uma caixa de diálogo de confirmação para o usuário
        Swal.fire({
            title: "Tem certeza?", // Título da caixa de diálogo
            text: "Você deseja realmente excluir este veículo? Esta ação não pode ser desfeita.", // Texto explicativo
            icon: "warning", // Ícone de aviso
            iconColor: "#ff9d00", // Cor do ícone de aviso
            showCancelButton: true, // Exibe o botão de cancelamento
            confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
            cancelButtonColor: "#d33", // Cor do botão de cancelamento
            confirmButtonText: "Sim, excluir!", // Texto do botão de confirmação
            cancelButtonText: "Cancelar", // Texto do botão de cancelamento
            reverseButtons: true, // Inverte a posição dos botões
            backdrop: "rgba(0,0,0,0.7)" // Cor e opacidade do fundo da caixa
        }).then(async (result) => {
            // Verifica se o usuário confirmou a exclusão
            if (result.isConfirmed) {
                const dataAtual = format(new Date(), 'yyyy-MM-dd'); // Formata a data atual no formato 'yyyy-MM-dd'
                try {
                    // Envia a solicitação PATCH para marcar o veículo como excluído (definindo a data final)
                    const response = await api.patch(`/veiculoUsuario/${veic_usu_id}/data_final`, {
                        data_final: dataAtual // Passa a data de exclusão para o servidor
                    });

                    // Se a resposta do servidor indicar sucesso
                    if (response.data.sucesso) {
                        // Exibe uma mensagem de sucesso
                        Swal.fire({
                            title: 'Sucesso!', // Título da mensagem
                            text: 'Veículo excluído com sucesso.', // Texto da mensagem
                            icon: 'success', // Ícone de sucesso
                            confirmButtonText: 'OK', // Texto do botão de confirmação
                            iconColor: "rgb(40, 167, 69)", // Cor do ícone de sucesso
                            confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
                        });

                        // Chama a função para listar novamente os veículos do usuário
                        ListarVeiculosUsuario();
                    } else {
                        // Se a resposta do servidor indicar erro, exibe uma mensagem de erro
                        Swal.fire({
                            title: 'Erro!', // Título da mensagem
                            text: response.data.mensagem || 'Ocorreu um erro ao excluir o veículo.', // Mensagem de erro
                            icon: 'error', // Ícone de erro
                            confirmButtonText: 'OK', // Texto do botão de confirmação
                            iconColor: '#d33', // Cor do ícone de erro
                            confirmButtonColor: '#d33', // Cor do botão de confirmação
                        });
                    }
                } catch (error) {
                    // Se ocorrer um erro na requisição, exibe uma mensagem de erro
                    Swal.fire({
                        title: 'Erro!', // Título da mensagem
                        text: `Erro na exclusão do veículo: ${error.message}`, // Mensagem de erro
                        icon: 'error', // Ícone de erro
                        confirmButtonText: 'Ok', // Texto do botão de confirmação
                        iconColor: '#d33', // Cor do ícone de erro
                        confirmButtonColor: '#d33', // Cor do botão de confirmação
                    });
                }
            }
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de envio de formulário (não recarregar a página)

        // Validação do ano inserido, verificando se está dentro do intervalo permitido
        if (!validarAno(selectedVehicle.veic_ano)) {
            // Exibe um erro caso o ano seja inválido
            setAnoErro(`O ano deve ser entre 1886 e ${new Date().getFullYear() + 1}.`);
            Swal.fire({
                title: 'Erro!',
                text: 'O ano inserido é inválido. Por favor, insira um ano válido.',
                icon: 'error',
                confirmButtonText: 'Ok',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
            return; // Interrompe a execução caso o ano seja inválido
        }

        setAnoErro(''); // Limpa qualquer erro de ano

        // Criação do objeto NovoVeiculo, com dados selecionados ou com valores padrão
        const NovoVeiculo = {
            mod_id: selectedVehicle.mod_id,
            veic_placa: selectedVehicle.veic_placa,
            veic_ano: selectedVehicle.veic_ano,
            veic_cor: selectedVehicle.veic_cor,
            veic_combustivel: selectedVehicle.veic_combustivel,
            veic_observ: selectedVehicle.veic_observ,
            veic_situacao: selectedVehicle.veic_situacao || 1 // Valor padrão '1' caso não tenha situação
        };

        // Criação do objeto UpdateVeiculo para atualizar informações de um veículo existente
        const UpdateVeiculo = {
            mod_id: selectedVehicle.mod_id || veiculos.mod_id,
            veic_placa: selectedVehicle.veic_placa || veiculos.veic_placa,
            veic_ano: selectedVehicle.veic_ano || veiculos.veic_ano,
            veic_cor: selectedVehicle.veic_cor || veiculos.veic_cor,
            veic_combustivel: selectedVehicle.veic_combustivel || veiculos.veic_combustivel,
            veic_observ: selectedVehicle.veic_observ || veiculos.veic_observ,
            ehproprietario: selectedVehicle.ehproprietario !== undefined
                ? parseInt(selectedVehicle.ehproprietario, 10) // Converte o valor para inteiro
                : parseInt(veiculos.ehproprietario, 10)
        };

        // Criação do objeto UpdateVeiculoUsuario, que associa o veículo a um usuário
        const UpdateVeiculoUsuario = {
            veic_usu_id: selectedVehicle.veic_usu_id || veiculos.veic_usu_id,
            data_inicial: selectedVehicle.data_inicial || veiculos.data_inicial,
            ehproprietario: selectedVehicle.ehproprietario !== undefined
                ? parseInt(selectedVehicle.ehproprietario, 10)
                : parseInt(veiculos.ehproprietario, 10)
        };

        let NovoVeiculoUsuario;

        try {
            let responseVehicle;

            // Se o veículo não existir (não tiver ID), cria um novo
            if (!selectedVehicle.veic_id) {
                responseVehicle = await api.post('/veiculos', NovoVeiculo); // Chamada à API para criar veículo

                // Se o veículo for criado com sucesso
                if (responseVehicle.data.sucesso) {
                    const newVeic_id = responseVehicle.data.dados; // Obtém o ID do novo veículo criado

                    // Cria a associação do veículo com o usuário
                    NovoVeiculoUsuario = {
                        veic_id: newVeic_id,
                        usu_id: userId, // ID do usuário
                        data_inicial: selectedVehicle.data_inicial || veiculos.data_inicial,
                        ehproprietario: selectedVehicle.ehproprietario !== undefined
                            ? parseInt(selectedVehicle.ehproprietario, 10)
                            : parseInt(veiculos.ehproprietario, 10)
                    };

                    // Criação da associação entre veículo e usuário
                    await api.post('/veiculoUsuario', NovoVeiculoUsuario);
                } else {
                    throw new Error("Falha ao criar veículo: " + responseVehicle.data.mensagem); // Se falhar, lança erro
                }
            } else {
                // Se o veículo já existir, atualiza os dados do veículo e do usuário
                responseVehicle = await api.patch(`/veiculos/usuario/${selectedVehicle.veic_id}`, UpdateVeiculo);
                if (!responseVehicle.data.sucesso) {
                    throw new Error("Falha ao atualizar veículo: " + responseVehicle.data.mensagem);
                }

                const responseUsuario = await api.patch(`/veiculoUsuario/${selectedVehicle.veic_usu_id}`, UpdateVeiculoUsuario);
                if (!responseUsuario.data.sucesso) {
                    throw new Error("Falha ao atualizar veículo-usuário: " + responseUsuario.data.mensagem);
                }
            }

            // Exibe mensagem de sucesso ao finalizar a operação
            Swal.fire({
                title: 'Sucesso!',
                text: 'O veículo foi criado/atualizado com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            setShowForm(false); // Fecha o formulário após sucesso
            ListarVeiculosUsuario(); // Atualiza a lista de veículos do usuário

        } catch (error) {
            console.error("Erro completo na requisição:", error); // Loga o erro completo para depuração
            let errorMessage;

            // Exibe a mensagem de erro específica dependendo da falha
            if (error.message.includes("Falha ao criar veículo")) {
                errorMessage = "Erro ao criar veículo: " + error.message;
            } else if (error.message.includes("Falha ao atualizar veículo")) {
                errorMessage = "Erro ao atualizar veículo: " + error.message;
            } else if (error.message.includes("Falha ao atualizar veículo-usuário")) {
                errorMessage = "Erro ao atualizar veículo-usuário: " + error.message;
            } else {
                errorMessage = error.response ? error.response.data.mensagem : error.message; // Mensagem genérica de erro
            }

            // Exibe a mensagem de erro ao usuário
            Swal.fire({
                title: 'Erro!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Ok',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };


    // Função para manipular a edição de um veículo
    const handleEditar = (veiculo) => {
        // Cria um objeto com os dados do veículo, garantindo que todos os campos tenham valor padrão, caso contrário, um valor vazio
        const vehicleData = {
            veic_id: veiculo.veic_id || "",
            veic_usu_id: veiculo.veic_usu_id || "",
            veic_placa: veiculo.veic_placa || "",
            data_inicial: veiculo.data_inicial || "",
            cat_nome: veiculo.cat_nome || "",
            mar_id: veiculo.mar_id || "",
            mar_nome: veiculo.mar_nome || "",
            mod_id: veiculo.mod_id || "",
            mod_nome: veiculo.mod_nome || "",
            veic_ano: veiculo.veic_ano || "",
            veic_cor: veiculo.veic_cor || "",
            veic_combustivel: veiculo.veic_combustivel || "",
            veic_observ: veiculo.veic_observ || "",
            // Verifica se o campo "ehproprietario" está definido antes de convertê-lo para string
            ehproprietario: veiculo.ehproprietario !== undefined ? veiculo.ehproprietario.toString() : ""
        };

        // Define o veículo selecionado com os dados fornecidos
        setSelectedVehicle(vehicleData);
        // Salva os dados do veículo original para uso posterior, caso o usuário cancele a edição
        setOriginalVehicle(veiculo);
        // Exibe o formulário de edição
        setShowForm(true);
        // Ativa o modo de edição
        setIsEditing(true);
        // Desativa o modo de criação
        setIsCreate(false);
        // Desativa o modo de visualização
        setIsViewing(false);
    };

    // Função para manipular a visualização de um veículo
    const handleVisualizar = (veiculo) => {
        // Define o veículo selecionado com os dados fornecidos
        setSelectedVehicle(veiculo);
        // Ativa o modo de visualização
        setIsViewing(true);
        // Desativa o modo de edição
        setIsEditing(false);
        // Desativa o modo de criação
        setIsCreate(false);
        // Exibe o formulário de visualização
        setShowForm(true);
    };

    // Função para criar um novo veículo
    const CreateVeiculo = () => {
        // Cria um objeto com os dados iniciais para um novo veículo (campos vazios ou valores padrão)
        const vehicleData = {
            veic_id: "",
            veic_usu_id: "",
            veic_placa: "",
            data_inicial: "",
            cat_nome: "",
            mar_id: "",
            mar_nome: "",
            mod_id: "",
            mod_nome: "",
            veic_ano: "",
            veic_cor: "",
            veic_combustivel: "",
            veic_observ: "",
            ehproprietario: 0, // Define um valor padrão de 0 para "ehproprietario"
            veic_situacao: 1  // Define o status inicial como ativo (1)
        };
        // Chama a função para listar as categorias de veículos
        ListarCategorias();
        // Define o veículo selecionado com os dados iniciais
        setSelectedVehicle(vehicleData);
        // Exibe o formulário de criação
        setShowForm(true);
        // Ativa o modo de criação
        setIsCreate(true);
        // Desativa os modos de edição e visualização
        setIsEditing(false);
        setIsViewing(false);
    };

    // Função para retornar e esconder o formulário
    const handleReturn = () => {
        setShowForm(false); // Define o estado do formulário como oculto
    };

    // Função para cancelar a operação e exibir uma confirmação
    const handleCancel = () => {
        // Exibe uma caixa de confirmação usando o SweetAlert2
        Swal.fire({
            title: "Deseja Cancelar?", // Título da confirmação
            text: "As informações não serão salvas", // Texto da confirmação
            icon: "warning", // Ícone de aviso
            iconColor: "#ff9d00", // Cor do ícone
            showCancelButton: true, // Exibe o botão de cancelar
            cancelButtonColor: "#d33", // Cor do botão de cancelar
            confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmar
            cancelButtonText: "Cancelar", // Texto do botão de cancelar
            confirmButtonText: "Confirmar", // Texto do botão de confirmar
            reverseButtons: true, // Inverte a posição dos botões
            backdrop: "rgba(0,0,0,0.7)", // Define o fundo escurecido ao exibir a caixa de diálogo
        }).then((result) => {
            if (result.isConfirmed) {
                // Se o usuário confirmar o cancelamento, exibe uma mensagem de sucesso
                Swal.fire({
                    title: "Cancelado!", // Título da confirmação
                    text: "As alterações foram canceladas.", // Texto da confirmação
                    icon: "success", // Ícone de sucesso
                    iconColor: "rgb(40, 167, 69)", // Cor do ícone
                    confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
                }).then(() => {
                    // Restaura os dados originais do veículo e oculta o formulário
                    setSelectedVehicle(originalVehicle);
                    setShowForm(false);
                    setIsEditing(false);
                });
            }
        });
    };

    // Função para validar o ano de um veículo
    const validarAno = (ano) => {
        const anoAtual = new Date().getFullYear(); // Obtém o ano atual
        const anoMax = anoAtual + 1; // Define o ano máximo como o próximo ano
        const anoNum = parseInt(ano, 10); // Converte o ano para um número inteiro

        // Verifica se o ano é válido (não é um NaN, está entre 1886 e o ano máximo)
        if (isNaN(anoNum) || anoNum < 1886 || anoNum > anoMax) {
            return false; // Retorna falso se o ano for inválido
        }
        return true; // Retorna verdadeiro se o ano for válido
    };

    return (
        <>
            <div id="clientes" className={styles.content_section}>
                <h2 className={styles.title_page}>Meus Veículos</h2>
                {!showForm ? (
                    <>
                        <ol className={styles.fundocards}>
                            {veiculos.map((veiculo) => (
                                <li key={veiculo.veic_id} className={styles.lista}>

                                    <div className={styles.icone}>
                                        <div className={styles.icone}>
                                            {veiculo.cat_id === 1 ? (
                                                <FaTruckFront className={styles.iconeVeiculo} />

                                            ) : veiculo.cat_id === 2 ? (
                                                <IoCarSport className={styles.iconeVeiculo} />

                                            ) : veiculo.cat_id === 3 ? (
                                                <FaMotorcycle className={styles.iconeVeiculo} />
                                            ) : (
                                                <MdOutlineQuestionMark className={styles.iconeVeiculo} />
                                            )}
                                        </div>

                                    </div>

                                    <div className={styles.botoeslink}>
                                        <MdRemoveRedEye
                                            onClick={() => handleVisualizar(veiculo)}
                                            className={styles.iconeVisualizar}
                                        />

                                        <button
                                            className={styles.link}
                                            onClick={() => handleEditar(veiculo)}
                                        >
                                            <span className={styles.iconeAlterar}></span>
                                        </button>

                                        <Link href="#" onClick={() => handleExcluirVeiculo(veiculo.veic_usu_id)} className={styles.link}>
                                            <span className={styles.iconeExcluir}></span>
                                        </Link>

                                    </div>

                                    <div className={styles.content}>
                                        <span className={styles.placa}>{veiculo.veic_placa}</span>
                                        <span className={styles.marca}>{veiculo.mar_nome}</span>
                                        <span className={styles.modelo}>{veiculo.mod_nome}</span>
                                        {/* <span className={styles.ano}>Ano: {veiculo.veic_ano}</span> */}
                                        {veiculo.ehproprietario === 1 ? (
                                            <span className={styles.proprietario}>Proprietário</span>
                                        ) : (
                                            <span className={styles.naoProprietario}>Não Proprietário</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <li
                                className={`${styles.lista} ${styles.listaAddVeiculo}`}
                                onClick={CreateVeiculo}>
                                <MdAdd
                                    className={styles.iconeAddVeiculo}
                                />
                            </li>
                        </ol>

                    </>
                ) : (
                    <>
                        <form id="veiculoForm" className={styles.form} onSubmit={handleFormSubmit}>
                            <div className={styles.grid}>

                                <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                                    <label htmlFor="veic_id" className={styles.label_veiculos}>Código</label>
                                    <input
                                        type="text"
                                        id="veic_id"
                                        name="veic_id"
                                        value={selectedVehicle.veic_id}
                                        onChange={handleInputChange}
                                        className={styles.input_veiculos}
                                        required
                                        disabled
                                    />
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_categoria}`}>
                                    <label htmlFor="veic_id" className={styles.label_veiculos}>Categoria</label>
                                    {isCreate ? (
                                        <select
                                            name="cat_id"
                                            id="cat_id"
                                            value={selectedVehicle.cat_id}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            required
                                        >
                                            <option value="" hidden>Selecione</option>
                                            {
                                                categorias.map((categoria) => (
                                                    <option key={categoria.cat_id} value={categoria.cat_id}>{categoria.cat_nome}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="cat_nome"
                                            name="cat_nome"
                                            value={selectedVehicle.cat_nome}
                                            onChange={handleInputChange}
                                            className={styles.input_veiculos}
                                            disabled
                                            required
                                        />

                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_marca}`}>
                                    <label htmlFor="mar_nome" className={styles.label_veiculos}>Marca</label>
                                    {isCreate ? (
                                        <select
                                            name="mar_id"
                                            id="mar_id"
                                            value={selectedVehicle.mar_id}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            required
                                            disabled={!selectedVehicle.cat_id}
                                        >
                                            <option value="" hidden>Selecione</option>
                                            {
                                                marcas.map((marca) => (
                                                    <option key={marca.mar_id} value={marca.mar_id}>{marca.mar_nome}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="mar_nome"
                                            name="mar_nome"
                                            value={selectedVehicle.mar_nome}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                            className={styles.input_veiculos}
                                        />
                                    )}

                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_modelo}`}>
                                    <label htmlFor="mod_nome" className={styles.label_veiculos}>Modelo</label>
                                    {isCreate ? (
                                        <select
                                            name="mod_id"
                                            id="mod_id"
                                            value={selectedVehicle.mod_id}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            disabled={!selectedVehicle.mar_id}
                                            required
                                        >
                                            <option value="" hidden>Selecione</option>
                                            {
                                                modelos.map((modelo) => (
                                                    <option key={modelo.mod_id} value={modelo.mod_id}>{modelo.mod_nome}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="mod_nome"
                                            name="mod_nome"
                                            value={selectedVehicle.mod_nome}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                            className={styles.input_veiculos}
                                        />
                                    )}

                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_placa}`}>
                                    <label htmlFor="veic_placa" className={styles.label_veiculos}>Placa</label>
                                    <InputMask
                                        mask="aaa-9*99"
                                        type="text"
                                        id="veic_placa"
                                        name="veic_placa"
                                        value={selectedVehicle.veic_placa}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!isCreate && !isEditing}
                                        className={styles.input_veiculos}
                                        placeholder="Letras e números"
                                    />
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_ano}`}>
                                    <label htmlFor="veic_ano" className={styles.label_veiculos}>Ano</label>
                                    <input
                                        type="number"
                                        id="veic_ano"
                                        name="veic_ano"
                                        value={selectedVehicle.veic_ano || ''}
                                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, veic_ano: e.target.value })}
                                        onBlur={() => validarAno(ano)}
                                        className={styles.input_veiculos}
                                        required
                                        disabled={!isCreate}
                                    />
                                    {anoErro && <span className={styles.error_message}>{anoErro}</span>}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_cor}`}>
                                    <label htmlFor="veic_cor" className={styles.label_veiculos}>Cor</label>
                                    {isViewing ? (
                                        <>
                                            <input
                                                type="text"
                                                id="veic_cor"
                                                name="veic_cor"
                                                value={selectedVehicle.veic_cor}
                                                onChange={handleInputChange}
                                                required
                                                disabled
                                                className={styles.input_veiculos}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <select
                                                id="veic_cor"
                                                name="veic_cor"
                                                value={selectedVehicle.veic_cor}
                                                onChange={handleInputChange}
                                                className={styles.select_veiculos}
                                                required
                                            >
                                                <option value="" disabled hidden>Selecionar</option>
                                                <option value="Amarelo">Amarelo</option>
                                                <option value="Azul">Azul</option>
                                                <option value="Bege">Bege</option>
                                                <option value="Branco">Branco</option>
                                                <option value="Cinza">Cinza</option>
                                                <option value="Dourado">Dourado</option>
                                                <option value="Laranja">Laranja</option>
                                                <option value="Marrom">Marrom</option>
                                                <option value="Preto">Preto</option>
                                                <option value="Prata">Prata</option>
                                                <option value="Rosa">Rosa</option>
                                                <option value="Roxo">Roxo</option>
                                                <option value="Verde">Verde</option>
                                                <option value="Vermelho">Vermelho</option>
                                                <option value="Vinho">Vinho</option>
                                                <option value="Personalizado">Personalizado</option>
                                            </select>
                                        </>
                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_combustivel}`}>
                                    <label htmlFor="veic_combustivel" className={styles.label_veiculos}>Combustível</label>

                                    {isCreate || isEditing ? (
                                        <select
                                            id="veic_combustivel"
                                            name="veic_combustivel"
                                            value={selectedVehicle.veic_combustivel}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            required
                                        >
                                            <option value="" disabled hidden>Selecionar</option>
                                            <option value="Gasolina">Gasolina</option>
                                            <option value="Alcool">Álcool</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Flex">Flex</option>
                                            <option value="GNV">GNV (Gás Natural Veicular)</option>
                                            <option value="Eletrico">Elétrico</option>
                                            <option value="Hibrido">Híbrido</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="veic_combustivel"
                                            name="veic_combustivel"
                                            value={selectedVehicle.veic_combustivel}
                                            onChange={handleInputChange}
                                            className={styles.input_veiculos}
                                            disabled
                                        />
                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_datainicial}`}>
                                    <label htmlFor="data_inicial" className={styles.label_veiculos}>Data Inicial</label>
                                    <input
                                        type="date"
                                        id="data_inicial"
                                        name="data_inicial"
                                        value={selectedVehicle?.data_inicial ? format(parseISO(selectedVehicle.data_inicial), 'yyyy-MM-dd') : ''}
                                        onChange={handleInputChange}
                                        // max={new Date().toISOString().split('T')[0]} // Limita até hoje
                                        className={styles.input_veiculos}
                                        required
                                        disabled={!isCreate && !isEditing}
                                    />
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_proprietario}`}>
                                    <label htmlFor="" className={styles.label_veiculos}>Proprietário</label>

                                    {isViewing ? (
                                        <>
                                            <input
                                                type="text"
                                                id="ehproprietario"
                                                name="ehproprietario"
                                                value={selectedVehicle.ehproprietario === 1 ? "Sim" : "Não"}
                                                onChange={handleInputChange}
                                                className={styles.input_veiculos}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <select
                                                id="ehproprietario"
                                                name="ehproprietario"
                                                value={selectedVehicle.ehproprietario || 0}
                                                onChange={handleInputChange}
                                                required
                                                className={styles.select_veiculos}
                                            >
                                                <option value="" hidden>Selecionar</option>
                                                <option value="1">Sim</option>
                                                <option value="0">Não</option>
                                            </select>
                                        </>
                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_observacoes}`}>
                                    <label htmlFor="data_final" className={styles.label_veiculos}>Observações</label>
                                    <input
                                        type="text"
                                        id="veic_observ"
                                        name="veic_observ"
                                        value={selectedVehicle.veic_observ}
                                        onChange={handleInputChange}
                                        className={styles.input_veiculos}
                                        disabled={!isCreate && !isEditing}
                                    />
                                </div>
                            </div>
                        </form>

                        <div className={styles.footer_form}>

                            {isViewing ? (
                                <button type="button" onClick={handleReturn} className={styles.button_return}>Voltar</button>
                            ) : (
                                <>
                                    <button type="button" onClick={handleCancel} className={styles.button_cancel}>Cancelar</button>
                                    <button type="submit" onClick={handleFormSubmit} className={styles.submitButton}>Salvar</button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div >
        </>
    );
}