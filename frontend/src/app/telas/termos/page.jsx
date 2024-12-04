import React from 'react';
import styles from './page.module.css'; // Importa os estilos específicos para esta página

const Termos = () => {
    return (
        <>
            {/* Cabeçalho da página */}
            <header className={styles.header}>
                {/* Logotipo no cabeçalho, estilizado através da classe logo */}
                <span className={styles.logo}></span>
            </header>

            {/* Container principal para todo o conteúdo da página */}
            <div className={styles.container}>
                {/* Título principal da página */}
                <h1 className={styles.titulo}>Termos, Políticas e Referências</h1>

                {/* Seção: Política de Privacidade */}
                <section className={styles.section}>
                    <h2>Política de Privacidade</h2>
                    <p>
                        A sua privacidade é importante para nós. Esta página descreve como
                        coletamos, armazenamos e utilizamos as suas informações. Garantimos
                        que todos os dados coletados são tratados com segurança e em
                        conformidade com as leis de proteção de dados aplicáveis.
                    </p>
                </section>

                {/* Seção: Política de Segurança */}
                <section className={styles.section}>
                    <h2>Política de Segurança</h2>
                    <p>
                        Nosso site é protegido por várias camadas de segurança para proteger
                        seus dados contra acessos não autorizados, alterações e destruição.
                        Trabalhamos constantemente para aprimorar nossas medidas de segurança.
                    </p>
                </section>

                {/* Seção: Uso de Cookies */}
                <section className={styles.section}>
                    <h2>Uso de Cookies</h2>
                    <p>
                        Utilizamos cookies para melhorar a sua experiência de navegação.
                        Estes cookies nos ajudam a entender como você utiliza o site e
                        personalizar o conteúdo e as funcionalidades oferecidas. Você pode
                        configurar seu navegador para bloquear os cookies, mas isso pode
                        limitar algumas funcionalidades do site.
                    </p>
                </section>

                {/* Seção: Referências e Fontes */}
                <section className={styles.section}>
                    <h2>Referências e Fontes</h2>
                    <p>
                        Todas as informações contidas neste site são provenientes de fontes
                        confiáveis e atualizadas. As referências usadas para construir nossas
                        políticas de segurança são baseadas nas melhores práticas do setor.
                    </p>
                </section>
            </div>
        </>
    );
};

export default Termos; // Exporta o componente Termos para uso em outras partes do aplicativo
