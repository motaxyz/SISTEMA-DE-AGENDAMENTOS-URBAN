'use client' // Indica que este arquivo é executado no cliente, necessário em projetos Next.js para usar funcionalidades específicas.

import { useState, useEffect } from 'react'; // Importa hooks do React para gerenciamento de estado e efeitos colaterais.
import Link from 'next/link'; // Importa o componente de link do Next.js para navegação entre páginas.
import styles from './page.module.css'; // Importa os estilos CSS para a página.

import Header from '@/components/header'; // Importa o componente de cabeçalho.
import Footer from '@/components/footer'; // Importa o componente de rodapé.

// Importa as páginas dos serviços individualmente.
import Servico1 from './servico1/page';
import Servico2 from './servico2/page';
import Servico3 from './servico3/page';
import Servico4 from './servico4/page';
import Servico5 from './servico5/page';
import Servico6 from './servico6/page';

export default function Servicos() {
    // Hook useState para gerenciar o estado da tela atual (qual serviço está selecionado).
    const [tela, setTela] = useState(1);

    // useEffect para configurar o estado inicial da tela ao montar o componente.
    useEffect(() => {
        setTela(1); // Define a tela inicial como 1.
    }, []);

    return (
        <>
            {/* Componente de cabeçalho comum em todas as páginas */}
            <Header />

            <main className={styles.main}>
                <section className={styles.section}>
                    <div className={styles.geral_servicos}>
                        {/* Menu lateral com botões para seleção de serviços */}
                        <div className={styles.sidebar_buttons}>
                            <h1 className={styles.emalta}>Em alta</h1>

                            {/* Cada botão altera o estado "tela" para exibir o serviço correspondente */}
                            <Link href='' className={`${styles.link_button} ${tela === 1 ? styles.active : ''}`} onClick={() => setTela(1)}>
                                Polimento e Cristalização da Pintura
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 2 ? styles.active : ''}`} onClick={() => setTela(2)}>
                                Higienização Interna Completa
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 3 ? styles.active : ''}`} onClick={() => setTela(3)}>
                                Envelopamento Automotivo
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 4 ? styles.active : ''}`} onClick={() => setTela(4)}>
                                Vitrificação de Vidros
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 5 ? styles.active : ''}`} onClick={() => setTela(5)}>
                                Correção de Pintura
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 6 ? styles.active : ''}`} onClick={() => setTela(6)}>
                                Proteção Cerâmica
                            </Link>
                        </div>

                        {/* Renderiza o componente correspondente ao serviço selecionado */}
                        <div className={styles.container_servicos}>
                        {
                                tela === 1 ?
                                    <Servico1 />
                                    : tela === 2 ?
                                        <Servico2 />
                                        : tela === 3 ?
                                            <Servico3 />
                                            : tela === 4 ?
                                                <Servico4 />
                                                : tela === 5 ?
                                                    <Servico5 />
                                                    : tela === 6 ?
                                                        <Servico6 />
                                                        : <></>
                            }
                        </div>

                        {/* Renderiza informações sobre os serviços em formato de cards para dispositivos móveis */}
                        <div className={styles.container_servicosMobile}>
                            {/* Card para Polimento */}
                            <div className={`${styles.servico} ${styles.um}`}>
                                <p>Polimento</p>
                                <div className={styles.contentText}>
                                    Revitalize o brilho e a profundidade da cor do seu veículo...
                                </div>
                            </div>

                            {/* Card para Higienização */}
                            <div className={`${styles.servico} ${styles.dois}`}>
                                <p>Higienização</p>
                                <div className={styles.contentText}>
                                    Mantenha o interior do seu carro sempre limpo e agradável...
                                </div>
                            </div>

                            {/* Card para Envelopamento */}
                            <div className={`${styles.servico} ${styles.tres}`}>
                                <p>Envelopamento</p>
                                <div className={styles.contentText}>
                                    Dê uma nova cara ao seu carro com o nosso serviço...
                                </div>
                            </div>

                            {/* Outros serviços seguem o mesmo padrão */}
                            <div className={`${styles.servico} ${styles.quatro}`}>
                                <p>Vitrificação</p>
                                <div className={styles.contentText}>
                                    Melhore a visibilidade e segurança ao dirigir...
                                </div>
                            </div>
                            <div className={`${styles.servico} ${styles.cinco}`}>
                                <p>Pintura</p>
                                <div className={styles.contentText}>
                                    Elimine imperfeições, riscos profundos e manchas...
                                </div>
                            </div>
                            <div className={`${styles.servico} ${styles.seis}`}>
                                <p>Proteção Cerâmica</p>
                                <div className={styles.contentText}>
                                    Proteja a pintura do seu carro com nosso serviço...
                                </div>
                            </div>

                            <h2>Para conhecer todos os serviços, cadastre-se</h2>
                        </div>
                    </div>
                </section>
            </main>

            {/* Componente de rodapé comum em todas as páginas */}
            <Footer />
        </>
    );
}
