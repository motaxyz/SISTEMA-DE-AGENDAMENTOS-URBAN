import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

import api from "@/services/api"; // Importa o serviço de API para realizar requisições ao backend.

import { IoMdEyeOff, IoMdEye } from "react-icons/io"; // Importa ícones para alternar a visibilidade da senha.
import Swal from "sweetalert2"; // Biblioteca para exibir modais de alerta e mensagens ao usuário.
import InputMask from "react-input-mask"; // Biblioteca para aplicar máscaras nos campos de entrada (e.g., CPF).

export default function DadosDoUsuario() {
    const [meusDados, setMeusDados] = useState([]); // Armazena os dados do usuário.
    const [isEditing, setIsEditing] = useState(false); // Controla se o formulário está no modo de edição.
    const [showPassword, setShowPassword] = useState(false); // Controla a visibilidade do campo de senha.
    const [originalCpf, setOriginalCpf] = useState(''); // Armazena o CPF original para comparações.
    const [originalEmail, setOriginalEmail] = useState(''); // Armazena o e-mail original para comparações.
    const [userId, setUserId] = useState(null); // Armazena o ID do usuário logado.

    const sexoMap = {
        0: 'Feminino',
        1: 'Masculino',
        2: 'Outro'
    }; // Mapeia os valores numéricos de sexo para strings legíveis.

    useEffect(() => {
        // Recupera o ID do usuário armazenado no localStorage ao carregar o componente.
        const storedUserId = localStorage.getItem('user');
        if (storedUserId) {
            const parsedUser = JSON.parse(storedUserId); // Converte a string armazenada para um objeto.
            setUserId(parsedUser?.id || null); // Define o ID do usuário ou null se não encontrado.
        }
    }, []);

    useEffect(() => {
        // Chama a função para listar os dados do usuário apenas quando o ID estiver definido.
        if (userId) {
            listarDadosUsuario(); // Função para buscar os dados do usuário no backend.
        }
    }, [userId]); // Executa o efeito apenas quando o `userId` muda.

    const listarDadosUsuario = async () => {
        if (!userId) return; // Verifica se o ID do usuário está disponível antes de prosseguir.

        try {
            // Faz uma requisição GET para buscar os dados do usuário com base no ID fornecido.
            const response = await api.get(`/usuarios/dadosUsuario/${userId}`);
            setMeusDados(response.data.dados); // Armazena os dados do usuário no estado.

            // Salva o CPF e o email originais em estados separados para possíveis comparações.
            setOriginalCpf(response.data.dados.usu_cpf);
            setOriginalEmail(response.data.dados.usu_email);

        } catch (error) {
            // Exibe no console uma mensagem de erro caso a requisição falhe.
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    const togglePasswordVisibility = () => {
        // Alterna a visibilidade da senha entre oculto e visível.
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target; // Captura o nome e valor do campo que foi alterado.

        // Converte o valor para número apenas se o campo for `usu_sexo`.
        const newValue = name === 'usu_sexo' ? parseInt(value) : value;

        // Atualiza o estado `meusDados` com o novo valor do campo modificado.
        setMeusDados((prevState) => ({
            ...prevState, // Mantém os valores anteriores.
            [name]: newValue, // Atualiza apenas o campo modificado.
        }));
    };

    const handleEdit = () => {
        // Ativa o modo de edição, permitindo alterações nos campos do formulário.
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Exibe um modal de confirmação antes de cancelar as alterações.
        Swal.fire({
            title: "Deseja Cancelar?",
            text: "As informações não serão salvas", // Alerta que as mudanças serão descartadas.
            icon: "warning",
            iconColor: "orange",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)", // Escurece o fundo enquanto o modal está ativo.
        }).then((result) => {
            if (result.isConfirmed) {
                // Exibe uma mensagem de sucesso confirmando o cancelamento.
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    setIsEditing(false); // Desativa o modo de edição.
                    listarDadosUsuario(); // Recarrega os dados originais do usuário.
                    setShowPassword(false); // Oculta a senha após o cancelamento.
                });
            }
        });
    };

    const validarCPF = async (cpf) => {
        // Expressão regular para verificar o formato do CPF
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

        // Verifica se o CPF está no formato correto
        if (!cpfRegex.test(cpf)) {
            return 'CPF inválido.';
        }

        // Remove os caracteres não numéricos do CPF
        const numbersOnly = cpf.replace(/[^\d]/g, '');

        // Verifica se o CPF tem exatamente 11 dígitos e se não é uma sequência de números repetidos
        if (numbersOnly.length !== 11 || /^(\d)\1+$/.test(numbersOnly)) {
            return 'CPF inválido.';
        }

        // Validação do primeiro dígito verificador do CPF
        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(numbersOnly.substring(i - 1, i)) * (11 - i); // Cálculo de soma ponderada
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0; // Ajuste de resto
        if (resto !== parseInt(numbersOnly.substring(9, 10))) {
            return 'CPF inválido.';
        }

        // Validação do segundo dígito verificador do CPF
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(numbersOnly.substring(i - 1, i)) * (12 - i); // Novo cálculo de soma ponderada
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0; // Ajuste de resto
        if (resto !== parseInt(numbersOnly.substring(10, 11))) {
            return 'CPF inválido.';
        }

        // Verificação de CPF no banco de dados (não duplicado)
        try {
            const response = await api.post('/usuarios/verificarCpf', { usu_cpf: cpf });
            if (response.data.sucesso && response.data.dados) {
                return 'CPF indisponível'; // CPF já está registrado no sistema
            }
        } catch (error) {
            console.error('Erro na verificação do CPF:', error);
            return 'Ocorreu um erro ao verificar o CPF. Por favor, tente novamente.'; // Caso haja erro na API
        }

        return null; // CPF válido
    };

    // Função para verificar se o e-mail tem formato válido usando expressão regular
    function checkEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    const validaEmail = async (usuario) => {
        const email = usuario.usu_email.trim(); // Remove espaços antes e depois do e-mail

        // Verifica se o e-mail não foi preenchido
        if (!email) {
            return 'O e-mail do usuário é obrigatório.';
        } else if (!checkEmail(email)) { // Verifica se o e-mail é válido
            return 'Insira um e-mail válido.';
        }

        // Verificação de duplicidade de e-mail no banco de dados
        try {
            const response = await api.post('/usuarios/verificarEmail', {
                usu_email: email,
                usu_id: usuario.usu_id // Enviar o ID do usuário para verificar duplicidade
            });

            if (response.data.sucesso && response.data.dados) {
                return 'Email já está cadastrado.'; // E-mail já existe no sistema
            }
        } catch (error) {
            console.error('Erro na verificação do email:', error);
            return 'Ocorreu um erro ao verificar o email. Por favor, tente novamente.'; // Caso haja erro na API
        }
        return null; // E-mail válido e não duplicado
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        // Valida CPF caso tenha sido alterado
        if (meusDados.usu_cpf !== originalCpf) {
            const cpfError = await validarCPF(meusDados.usu_cpf);
            if (cpfError) {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    iconColor: "#d33",
                    text: cpfError, // Exibe o erro de CPF
                });
                return; // Impede o envio do formulário se CPF for inválido
            }
        }

        // Valida e-mail caso tenha sido alterado
        if (meusDados.usu_email !== originalEmail) {
            const emailError = await validaEmail(meusDados);
            if (emailError) {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    iconColor: "#d33",
                    text: emailError, // Exibe o erro de e-mail
                });
                return; // Impede o envio do formulário se o e-mail for inválido
            }
        }

        // Envio dos dados para a API para atualização
        try {
            const response = await api.patch(`/usuarios/${meusDados.usu_id}`, meusDados);

            if (response.data.sucesso) {
                Swal.fire({
                    title: "Sucesso",
                    text: "Dados salvos com sucesso!",
                    icon: "success",
                    confirmButtonColor: "rgb(40, 167, 69)",
                    iconColor: "rgb(40, 167, 69)",
                });
                setIsEditing(false); // Finaliza o processo de edição
            } else {
                Swal.fire({
                    title: "Erro",
                    text: "Falha ao salvar os dados.", // Exibe erro caso a atualização falhe
                    icon: "error",
                    confirmButtonColor: "rgb(40, 167, 69)",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Erro",
                text: "Ocorreu um erro ao salvar os dados.", // Erro ao salvar os dados
                icon: "error",
                confirmButtonColor: "rgb(40, 167, 69)",
            });
            console.error("Erro ao salvar dados:", error); // Registra o erro no console
        }
    };

    return (
        <div id="clientes" className={styles.content_section}>
            <h2 className={styles.title_page}>Meus Dados</h2>

            {meusDados ? (
                <>
                    <form id="clienteForm" className={styles.form} onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            id="clienteId"
                            className={styles.input_cliente}
                            value={meusDados?.usu_id || ''}
                        />

                        <div className={styles.grid}>
                            <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                                <label htmlFor="codigo_cliente" className={styles.label_cliente}>Código</label>
                                <input
                                    type="number"
                                    id="codigo_cliente"
                                    name="codigo_cliente"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_id || ''}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_nome}`}>
                                <label htmlFor="usu_nome" className={styles.label_cliente}>Nome</label>
                                <input
                                    type="text"
                                    id="usu_nome"
                                    name="usu_nome"
                                    className={styles.input_cliente}
                                    placeholder="Nome Completo"
                                    value={meusDados?.usu_nome || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_cpf}`}>
                                <label htmlFor="usu_cpf" className={styles.label_cliente}>CPF</label>
                                <input
                                    type="text"
                                    id="usu_cpf"
                                    name="usu_cpf"
                                    className={styles.input_cliente}
                                    placeholder="000.000.000-00"
                                    value={meusDados?.usu_cpf || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_data}`}>
                                <label htmlFor="usu_data_nasc" className={styles.label_cliente}>Data de nascimento</label>
                                <input
                                    type="date"
                                    id="usu_data_nasc"
                                    name="usu_data_nasc"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_data_nasc ? new Date(meusDados.usu_data_nasc).toISOString().split("T")[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_sexo}`}>
                                <label htmlFor="usu_sexo" className={styles.label_cliente}>Sexo</label>

                                {isEditing ? (
                                    <select
                                        id="usu_sexo"
                                        name="usu_sexo"
                                        value={meusDados?.usu_sexo || ''}
                                        onChange={handleChange}
                                        className={`${styles.select_cliente} ${styles.input_sexo}`}
                                        required
                                    >
                                        <option value="0">Feminino</option>
                                        <option value="1">Masculino</option>
                                        <option value="2">Outro</option>
                                    </select>
                                ) : (
                                    <input
                                        id="usu_sexo"
                                        name="usu_sexo"
                                        className={`${styles.input_cliente} ${styles.input_sexo}`}
                                        value={sexoMap[meusDados?.usu_sexo] || ''}
                                        onChange={handleChange}
                                        disabled
                                    />
                                )}
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_telefone}`}>
                                <label htmlFor="usu_telefone" className={styles.label_cliente}>Telefone</label>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    type="tel"
                                    id="usu_telefone"
                                    name="usu_telefone"
                                    className={styles.input_cliente}
                                    placeholder="(xx) xxxxx - xxxxx"
                                    value={meusDados?.usu_telefone || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_email}`}>
                                <label htmlFor="usu_email" className={styles.label_cliente}>Email</label>
                                <input
                                    type="email"
                                    id="usu_email"
                                    name="usu_email"
                                    className={styles.input_cliente}
                                    placeholder="exemplo@exemplo.com"
                                    value={meusDados?.usu_email || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_email}`}>
                                <label htmlFor="usu_senha" className={styles.label_cliente}>Senha</label>
                                <div className={styles.input_cliente_senha}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="usu_senha"
                                        name="usu_senha"
                                        value={meusDados?.usu_senha || ''}
                                        onChange={handleChange}
                                        className={styles.input_cliente_password}
                                        disabled={!isEditing}
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                    {showPassword ? (
                                        <IoMdEye onClick={togglePasswordVisibility} className={styles.mdEye} />
                                    ) : (
                                        <IoMdEyeOff onClick={togglePasswordVisibility} className={styles.mdEye} />
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_email}`}>
                                <label htmlFor="usu_acesso" className={styles.label_cliente}>Nível de Acesso</label>
                                <input
                                    type="text"
                                    id="usu_acesso"
                                    name="usu_acesso"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_acesso === 0 ? "Usuário" : "Administrador" || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_observacoes}`}>
                                <label htmlFor="usu_observ" className={styles.label_cliente}>Observações</label>
                                <input
                                    type="text"
                                    id="usu_observ"
                                    name="usu_observ"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_observ || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_situacao}`}>
                                <label htmlFor="usu_situacao" className={styles.label_cliente}>Situação</label>
                                <input
                                    id="usu_situacao"
                                    name="usu_situacao"
                                    className={`${styles.input_cliente} ${styles.input_situacao}`}
                                    value={meusDados?.usu_situacao === 1 ? "Ativo" : "Inativo" || '1'}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>

                    </form>
                    <div className={styles.footer_form}>
                        {!isEditing ? (
                            <button type="button" onClick={handleEdit} className={styles.button_edit}>Editar</button>
                        ) : (
                            <>
                                <button type="button" onClick={handleCancel} className={styles.button_cancel}>Cancelar</button>
                                <button type="submit" onClick={handleSubmit} className={styles.button_submit}>Salvar</button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <p>Carregando dados do usuário...</p>
            )}
        </div>
    );
}